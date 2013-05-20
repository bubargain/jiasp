<?php

class BaseApp extends CController
{
	public $visitor=null;
	public $theme=null;
	public $_view=null;
	
    function __construct()
    {
        $this->BaseApp();
    }
	
    function BaseApp()
    {
		parent::__construct();
		
		$this->theme=$GLOBALS["THEME"];
		$this->_view=T("",false);			//获取模板
		//$this->_config_view();
		
		$this->_init_session();

        if(!defined('MODULE')) // 临时处理方案，此处不应对模块进行特殊处理
        {
            /* GZIP */
            if ($this->gzip_enabled())
            {
                ob_start('ob_gzhandler');
            }
            else
            {
                ob_start();
            }

            /* 非utf8转码 */
            if (CHARSET != 'utf-8' && isset($_REQUEST['ajax']))
            {
                $_FILES = sys_iconv_deep('utf-8', CHARSET, $_FILES);
                $_GET = sys_iconv_deep('utf-8', CHARSET, $_GET);
                $_POST = sys_iconv_deep('utf-8', CHARSET, $_POST);
            }

            /* 载入配置项 */
            $setting =& af('settings');
            Conf::load($setting->getAll());

            /* 初始化访问者(放在此可能产生问题) */
            $this->_init_visitor();
        }
	}
	
    function gzip_enabled()
    {
        static $enabled_gzip = NULL;

        if ($enabled_gzip === NULL)
        {
            $enabled_gzip = (defined('ENABLED_GZIP') && ENABLED_GZIP === 1 && function_exists('ob_gzhandler'));
        }

        return $enabled_gzip;
    }
	
    function _init_visitor()
    {
    }
	
    /**
     *    初始化视图连接
     *
     *    @author    Garbin
     *    @param    none
     *    @return    void
     */
    function _init_view()
    {
        if ($this->_view === null)
        {
			$this->theme=$GLOBALS["THEME"];
			$this->_view=T("",false);			//获取模板
			//$this->_config_view();  //配置
        }
    }
	
    /**
     *    初始化Session
     *
     *    @param    none
     *    @return    void
     */
    function _init_session()
    {
        L('session');
        $db = dbMysqlConnection::getMaster();
        $this->_session = new SessionProcessor($db, '`ecm_sessions`', '`ecm_sessions_data`', 'MVC_ID');
        define('SESS_ID', $this->_session->get_session_id());
        $this->_session->my_session_start();
    }
	
    function login()
    {
        $this->display('login.html');
    }
	
    function logout()
    {
        $this->visitor->logout();
    }
	
    /**
     *    head标签内的内容
     *
     *    @author    Garbin
     *    @param     string $contents
     *    @return    void
     */
    function headtag($string)
    {
        //$this->_init_view();
        $this->assign('_head_tags', $this->_view->fetch('str:' . $string));
    }
	
    /**
     *    导入资源到模板
     *
     *    @author    Garbin
     *    @param     mixed $resources
     *    @return    string
     */
    function import_resource($resources, $spec_type = null)
    {
        $headtag = '';
        if (is_string($resources) || $spec_type)
        {
            !$spec_type && $spec_type = 'script';
            $resources = $this->_get_resource_data($resources);
            foreach ($resources as $params)
            {
                $headtag .= $this->_get_resource_code($spec_type, $params) . "\r\n";
            }
            $this->headtag($headtag);
        }
        elseif (is_array($resources))
        {
            foreach ($resources as $type => $res)
            {
                $headtag .= $this->import_resource($res, $type);
            }
            $this->headtag($headtag);
        }

        return $headtag;
    }
	
    /**
     * 配置seo信息
     *
     * @param array/string $seo_info
     * @return void
     */
    function _config_seo($seo_info, $ext_info = null)
    {
        if (is_string($seo_info))
        {
            $this->_assign_seo($seo_info, $ext_info);
        }
        elseif (is_array($seo_info))
        {
            foreach ($seo_info as $type => $info)
            {
                $this->_assign_seo($type, $info);
            }
        }
    }
	
    function _assign_seo($type, $info)
    {
		$this->_init_view();
        $_seo_info = $this->_view->smarty->get_template_vars('_seo_info');
        if (is_array($_seo_info))
        {
            $_seo_info[$type] = $info;
        }
        else
        {
            $_seo_info = array($type => $info);
        }
        $this->assign('_seo_info', $_seo_info);
        $this->assign('page_seo', $this->_get_seo_code($_seo_info));
    }
	
    function _get_seo_code($_seo_info)
    {
        $html = '';
        foreach ($_seo_info as $type => $info)
        {
            $info = trim(htmlspecialchars($info));
            switch ($type)
            {
                case 'title' :
                    $html .= "<{$type}>{$info}</{$type}>";
                    break;
                case 'description' :
                case 'keywords' :
                default :
                    $html .= "<meta name=\"{$type}\" content=\"{$info}\" />";
                    break;
            }
            $html .= "\r\n";
        }        
        return $html;
    }
	
    /**
     *    获取资源数据
     *
     *    @author    Garbin
     *    @param     mixed $resources
     *    @return    array
     */
    function _get_resource_data($resources)
    {
        $return = array();
        if (is_string($resources))
        {
            $items = explode(',', $resources);
            array_walk($items, create_function('&$val, $key', '$val = trim($val);'));
            foreach ($items as $path)
            {
                $return[] = array('path' => $path, 'attr' => '');
            }
        }
        elseif (is_array($resources))
        {
            foreach ($resources as $item)
            {
                !isset($item['attr']) && $item['attr'] = '';
                $return[] = $item;
            }
        }

        return $return;
    }
	
    /**
     *    获取资源文件的HTML代码
     *
     *    @author    Garbin
     *    @param     string $type
     *    @param     array  $params
     *    @return    string
     */
    function _get_resource_code($type, $params)
    {
        switch ($type)
        {
            case 'script':
                $pre = '<script charset="utf-8" type="text/javascript"';
                $path= ' src="' . $this->_get_resource_url($params['path']) . '"';
                $attr= ' ' . $params['attr'];
                $tail= '></script>';
            break;
            case 'style':
                $pre = '<link rel="stylesheet" type="text/css"';
                $path= ' href="' . $this->_get_resource_url($params['path']) . '"';
                $attr= ' ' . $params['attr'];
                $tail= ' />';
            break;
        }
        $html = $pre . $path . $attr . $tail;

        return $html;
    }
	
    /**
     *    获取真实的资源路径
     *
     *    @author    Garbin
     *    @param     string $res
     *    @return    void
     */
    function _get_resource_url($res)
    {
        $res_par = explode(':', $res);
        $url_type = $res_par[0];
        $return  = '';
        switch ($url_type)
        {
            case 'url':
                $return = $res_par[1];
            break;
            case 'res':
                $return = '{res file="' . $res_par[1] . '"}';
            break;
            default:
                $res_path = empty($res_par[1]) ? $res : $res_par[1];
                $return = '{lib file="' . $res_path . '"}';
            break;
        }

        return $return;
    }
	
    function display($filename,$cache_id=0)
    {
		/*
        if ($this->_hook('on_display', array('display_file' => & $f)))
        {
            return;
        }
		*/
        $this->assign('site_url', SITE_URL);
		$base_url=$_SERVER["REQUEST_URI"];
		if(strpos($base_url,"index.php")>-1)
		{
			$base_url=GetStrLeft($base_url,"index.php");
		}
		$this->assign('css_base', $base_url . "themes/" . $this->theme . "/css");
		$this->assign('img_base', $base_url . "themes/" . $this->theme . "/images");
        $this->assign('ecmall_version', VERSION);
        $this->assign('random_number', rand());

        /* 语言项 */
        $this->assign('lang', Lang::get());

        /* 用户信息 */
        $this->assign('visitor', isset($this->visitor) ? $this->visitor->info : array());

        /* 新消息 */
		//$this->assign('new_message', isset($this->visitor) ? $this->_get_new_message() : '');
        $this->assign('charset', CHARSET);
        $this->assign('price_format', Conf::get('price_format'));
        //$this->assign('async_sendmail', $this->_async_sendmail());
        $this->_assign_query_info();

		$this->_view->display($filename,$cache_id);
		/*
        if ($this->_hook('end_display', array('display_file' => & $f)))
        {
            return;
        }
		*/
    }
	
    /* 页面查询信息 */
    function _assign_query_info()
    {
        $query_time = get_microtime() - START_TIME;

        $this->assign('query_time', $query_time);
        //$db =& db();
        //$this->assign('query_count', $db->_query_count);
		if(isset($this->_session->get_users_count))
		{
	        $this->assign('query_user_count', $this->_session->get_users_count());
		}

        /* 内存占用情况 */
        if (function_exists('memory_get_usage'))
        {
            $this->assign('memory_info', memory_get_usage() / 1048576);
        }

        $this->assign('gzip_enabled', $this->gzip_enabled());
        $this->assign('site_domain', urlencode(get_domain()));
        $this->assign('mvc_version', VERSION . ' ' . RELEASE);
    }
	
    /**
     *    显示错误警告
     *
     *    @param    none
     *    @return    void
     */
    function show_warning()
    {
        $args = func_get_args();
        call_user_func_array('show_warning', $args);
    }
	
    /**
     *    显示提示消息
     *
     *    @return    void
     */
    function show_message()
    {
        $args = func_get_args();
        call_user_func_array('show_message', $args);
    }
	
    /**
     * Make a error message by JSON format
     *
     * @param   string  $msg
     *
     * @return  void
     */
    function json_error ($msg='', $retval=null, $jqremote = false)
    {
        if (!empty($msg))
        {
            $msg = Lang::get($msg);
        }
        $result = array('done' => false , 'msg' => $msg);
        if (isset($retval)) $result['retval'] = $retval;

        $this->json_header();
        $json = ecm_json_encode($result);
        if ($jqremote === false)
        {
            $jqremote = isset($_GET['jsoncallback']) ? trim($_GET['jsoncallback']) : false;
        }
        if ($jqremote)
        {
            $json = $jqremote . '(' . $json . ')';
        }

        echo $json;
    }
	
    /**
     * Make a successfully message
     *
     * @param   mixed   $retval
     * @param   string  $msg
     *
     * @return  void
     */
    function json_result ($retval = '', $msg = '', $jqremote = false)
    {
        if (!empty($msg))
        {
            $msg = Lang::get($msg);
        }
        $this->json_header();
        $json = ecm_json_encode(array('done' => true , 'msg' => $msg , 'retval' => $retval));
        if ($jqremote === false)
        {
            $jqremote = isset($_GET['jsoncallback']) ? trim($_GET['jsoncallback']) : false;
        }
        if ($jqremote)
        {
            $json = $jqremote . '(' . $json . ')';
        }

        echo $json;
    }
	
    /**
     * Send a Header
     *
     * @author weberliu
     *
     * @return  void
     */
    function json_header()
    {
        header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past
        header("Content-type:text/plain;charset=" . CHARSET, true);
    }
	
    /**
     *    验证码
     *
     *    @author    Garbin
     *    @return    void
     */
    function _captcha($width, $height)
    {
        import('captcha.lib');
        $word = generate_code();
        $_SESSION['captcha'] = base64_encode($word);
        $code = new Captcha(array(
            'width' => $width,
            'height'=> $height,
        ));
        $code->display($word);
    }
	
    /**
     *    给视图传递变量
     *
     *    @author    Garbin
     *    @param     string $k
     *    @param     mixed  $v
     *    @return    void
     */
    function assign($k, $v = null)
    {
        if (is_array($k))
        {
            $args  = func_get_args();
            foreach ($args as $arg)     //遍历参数
            {
                foreach ($arg as $key => $value)    //遍历数据并传给视图
                {
                    $this->_view->assign($key, $value);
                }
            }
        }
        else
        {
            $this->_view->assign($k, $v);
        }
    }
}

/**
 *    访问者基础类，集合了当前访问用户的操作
 */
class BaseVisitor extends Object
{
    var $has_login = false;
    var $info      = null;
    var $privilege = null;
    var $_info_key = '';
    function __construct()
    {
        $this->BaseVisitor();
    }
    function BaseVisitor()
    {
        if (!empty($_SESSION[$this->_info_key]['user_id']))
        {
            $this->info         = $_SESSION[$this->_info_key];
            $this->has_login    = true;
        }
        else
        {
            $this->info         = array(
                'user_id'   => 0,
                'user_name' => Lang::get('guest')
            );
            $this->has_login    = false;
        }
    }
    function assign($user_info)
    {
        $_SESSION[$this->_info_key]   =   $user_info;
    }

    /**
     *    获取当前登录用户的详细信息
     *
     *    @author    Garbin
     *    @return    array      用户的详细信息
     */
    function get_detail()
    {
        /* 未登录，则无详细信息 */
        if (!$this->has_login)
        {
            return array();
        }

        /* 取出详细信息 */
        static $detail = null;

        if ($detail === null)
        {
            $detail = $this->_get_detail();
        }

        return $detail;
    }

    /**
     *    获取用户详细信息
     *
     *    @author    Garbin
     *    @return    array
     */
    function _get_detail()
    {
        $model_member =& m('member');

        /* 获取当前用户的详细信息，包括权限 */
        $member_info = $model_member->findAll(array(
            'conditions'    => "member.user_id = '{$this->info['user_id']}'",
            'join'          => 'has_store',                 //关联查找看看是否有店铺
            'fields'        => 'email, password, real_name, logins, ugrade, portrait, store_id, state, sgrade , feed_config',
            'include'       => array(                       //找出所有该用户管理的店铺
                'manage_store'  =>  array(
                    'fields'    =>  'user_priv.privs, store.store_name',
                ),
            ),
        ));
        $detail = current($member_info);

        /* 如果拥有店铺，则默认管理的店铺为自己的店铺，否则需要用户自行指定 */
        if ($detail['store_id'] && $detail['state'] != STORE_APPLYING) // 排除申请中的店铺
        {
            $detail['manage_store'] = $detail['has_store'] = $detail['store_id'];
        }

        return $detail;
    }

    /**
     *    获取当前用户的指定信息
     *
     *    @author    Garbin
     *    @param     string $key  指定用户信息
     *    @return    string  如果值是字符串的话
     *               array   如果是数组的话
     */
    function get($key = null)
    {
        $info = null;

        if (empty($key))
        {
            /* 未指定key，则返回当前用户的所有信息：基础信息＋详细信息 */
            $info = array_merge((array)$this->info, (array)$this->get_detail());
        }
        else
        {
            /* 指定了key，则返回指定的信息 */
            if (isset($this->info[$key]))
            {
                /* 优先查找基础数据 */
                $info = $this->info[$key];
            }
            else
            {
                /* 若基础数据中没有，则查询详细数据 */
                $detail = $this->get_detail();
                $info = isset($detail[$key]) ? $detail[$key] : null;
            }
        }

        return $info;
    }

    /**
     *    登出
     *
     *    @author    Garbin
     *    @return    void
     */
    function logout()
    {
        unset($_SESSION[$this->_info_key]);
    }
    function i_can($event, $privileges = array())
    {
        $fun_name = 'check_' . $event;

        return $this->$fun_name($privileges);
    }

    function check_do_action($privileges)
    {
        $mp = APP . '|' . ACT;

        if ($privileges == 'all')
        {
            /* 拥有所有权限 */
            return true;
        }
        else
        {
            /* 查看当前操作是否在白名单中，如果在，则允许，否则不允许 */
            $privs = explode(',', $privileges);
            if (in_array(APP . '|all', $privs) || in_array($mp, $privs))
            {
                return true;
            }

            return false;
        }
    }

}

?>