<?php

require_once(ROOT_PATH . '/app/system/app.base.php');
//后台管理系统基类
class FrontendApp extends BaseApp
{
    function __construct()
    {
        $this->BackendApp();
    }
	
    function BackendApp()
    {
		parent::__construct();
		
		//先加载语言包文件
		Lang::load(lang_file('common'));
		
		if(APATH)
		{
			Lang::load(lang_file(APATH . "/" . APP));
		}
		else
		{
			Lang::load(lang_file(APP));
		}
	}
	
	/**
     * 用于客户端验证用户是否已经登录.
     * return ajax;
     */
	function verifyLogin()
	{
		if($this->visitor->has_login)
		{
			$this->json_result("has_login");
		}
		else
		{
			$this->json_result("no_login");
		}
	}

    function get_referer()
	{
        $ret_url = '';
        if(isset($_POST['ret_url']))
		{
			$ret_url = rawurldecode($_POST['ret_url']);
        }
        elseif(isset($_GET['ret_url']))
		{
			$ret_url = rawurldecode($_GET['ret_url']);
        }
        if(!$ret_url && isset($_SERVER['HTTP_REFERER']))
		{
			$search  = array('c=login', 'c=register');
            if($_SERVER['HTTP_REFERER'] == str_replace($search, "", $_SERVER['HTTP_REFERER']))
			{
                $ret_url = $_SERVER['HTTP_REFERER'];
            }
        }
		
        if(!$ret_url)
		{
            $ret_url = SITE_URL . '/index.php';
        }
        if(stripos($ret_url,'ret_url'))
		{
            $ret_url_array = explode('ret_url=', $ret_url);
            $ret_url = SITE_URL . rawurldecode($ret_url_array[count($ret_url_array)-1]);
        }
        return htmlspecialchars_decode($ret_url);
    }
	
	//用户登录的逻辑
    function login()
    {
        if ($this->visitor->has_login)
        {
            $this->show_warning('has_login');

            return;
        }
        if (!IS_POST)
        {
            if (!empty($_GET['ret_url']))
            {
                $ret_url = trim($_GET['ret_url']);
            }
            else
            {
                if (isset($_SERVER['HTTP_REFERER']))
                {
                    $ret_url = $_SERVER['HTTP_REFERER'];
                }
                else
                {
                    $ret_url = SITE_URL . '/index.php';
                }
            }
            /* 防止登陆成功后跳转到登陆、退出的页面 */
            $ret_url = strtolower($ret_url);            
            if (str_replace(array('c=login', 'c=logout',), '', $ret_url) != $ret_url)
            {
                $ret_url = SITE_URL . '/index.php';
            }

            if (Conf::get('captcha_status.login'))
            {
                $this->assign('captcha', 1);
            }
            $this->import_resource(array('script' => 'jquery.plugins/jquery.validate.js'));
            $this->assign('ret_url', rawurlencode($ret_url));
            $this->_curlocal(LANG::get('user_login'));
            $this->_config_seo('title', Lang::get('user_login') . ' - ' . Conf::get('site_title'));
            $this->display('login.html');
            /* 同步退出外部系统 */
            if (!empty($_GET['synlogout']))
            {
                $ms =& ms();
                echo $synlogout = $ms->user->synlogout();
            }
        }
        else
        {
            if(Conf::get('captcha_status.login') && base64_decode($_SESSION['captcha']) != strtolower($_POST['captcha']))
            {
                $this->show_warning('captcha_failed');

                return;
            }

            $user_name = trim($_POST['user_name']);
            $password  = $_POST['password'];

            $ms =& ms();
            $user_id = $ms->user->auth($user_name, $password);
            if (!$user_id)
            {
                /* 未通过验证，提示错误信息 */
                $this->show_warning($ms->user->get_error());

                return;
            }
            else
            {
                /* 通过验证，执行登陆操作 */
                $this->_do_login($user_id);

                /* 同步登陆外部系统 */
                $synlogin = $ms->user->synlogin($user_id);
            }

            $this->show_message(Lang::get('login_successed') . $synlogin,
                'back_before_login', rawurldecode($_POST['ret_url']),
                'enter_member_center', 'index.php?app=member'
            );
        }
    }
	
	//弹出警告框
    function pop_warning($msg, $dialog_id = '',$url = '')
    {
        if($msg == 'ok')
        {
            if(empty($dialog_id))
            {
                $dialog_id = APP . '_' . ACT;
            }
            if (!empty($url))
            {
                echo "<script type='text/javascript'>window.parent.location.href='".$url."';</script>";
            }
            echo "<script type='text/javascript'>window.parent.js_success('" . $dialog_id ."');</script>";
        }
        else
        {
            header("Content-Type:text/html;charset=".CHARSET);
            $msg = is_array($msg) ? $msg : array(array('msg' => $msg));
            $errors = '';
            foreach ($msg as $k => $v)
            {
                $error = $v[obj] ? Lang::get($v[msg]) . " [" . Lang::get($v[obj]) . "]" : Lang::get($v[msg]);
                $errors .= $errors ? "<br />" . $error : $error;
            }
            echo "<script type='text/javascript'>window.parent.js_fail('" . $errors . "');</script>";
        }
    }
	
	//退出登录
    function logout()
    {
        $this->visitor->logout();

        /* 跳转到登录页，执行同步退出操作 */
        header("Location: index.php?c=member&act=login&synlogout=1");
        return;
    }
	
    /* 执行登录动作 */
    function _do_login($user_id)
    {
		$mod_user = M('sys/member');

        $user_info = $mod_user->get(array(
            'conditions'    => "user_id = '{$user_id}'",
            'join'          => 'has_store',                 //关联查找看看是否有店铺
            'fields'        => 'user_id, user_name, reg_time, last_login, last_ip, store_id',
        ));
		
		print_r($user_info);exit;

        /* 分派身份 */
        $this->visitor->assign($user_info);
    }

    /* 取得导航 */
    function _get_navs()
    {
        $cache_server =& cache_server();
        $key = 'common.navigation';
        $data = $cache_server->get($key);
        if($data === false)
        {
            $data = array(
                'header' => array(),
                'middle' => array(),
                'footer' => array(),
            );
            $nav_mod =& m('navigation');
            $rows = $nav_mod->find(array(
                'order' => 'type, sort_order',
            ));
            foreach ($rows as $row)
            {
                $data[$row['type']][] = $row;
            }
            $cache_server->set($key, $data, 86400);
        }

        return $data;
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
        $this->_session = new SessionProcessor($db, '`ecm_sessions`', '`ecm_sessions_data`', 'YMALL_ID');
        define('SESS_ID', $this->_session->get_session_id());
		//添加购物车相关表绑定到session表中，用于过时清除
		$this->_session->add_related_table('`ecm_cart`', 'cart', 'session_id', 'user_id=0');
        $this->_session->my_session_start();
		env('session', $this->_session);
    }	
	
    function _init_visitor()
    {
        $this->visitor =& env('visitor', new UserVisitor());
    }
}

/**
 *    前台访问者
 *
 *    @author    Garbin
 *    @usage    none
 */
class UserVisitor extends BaseVisitor
{
    var $_info_key = 'user_info';

    /**
     *    退出登录
     *
     *    @author    Garbin
     *    @param    none
     *    @return    void
     */
    function logout()
    {
        /* 将购物车中的相关项的session_id置为空 */
		/*
		$mod_cart =& m('cart');
        $mod_cart->edit("user_id = '" . $this->get('user_id') . "'", array(
            'session_id' => '',
        ));
		*/
		
        /* 退出登录 */
        parent::logout();
    }
}

?>