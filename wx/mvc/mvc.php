<?php
define('IS_POST', (strtoupper($_SERVER['REQUEST_METHOD']) == 'POST'));
require_once(ROOT_PATH . '/mvc/global.php');
require_once(ROOT_PATH . '/mvc/core/CException.php');
require_once(ROOT_PATH . '/mvc/core/CController.php');
require_once(ROOT_PATH . '/mvc/core/CLang.php');
require_once(ROOT_PATH . '/mvc/core/CConf.php');
require_once(ROOT_PATH . '/app/system/backend.base.php');
require_once(ROOT_PATH . '/app/system/frontend.base.php');

/* 记录程序启动时间 */
define('START_TIME', get_microtime());

/**
 *    所有类的基础类
 */
class Object
{
    var $_errors = array();
    var $_errnum = 0;
    function __construct()
    {
        $this->Object();
    }
    function Object()
    {
        #TODO
    }
    /**
     *    触发错误
     *
     *    @author    Garbin
     *    @param     string $errmsg
     *    @return    void
     */
    function _error($msg, $obj = '')
    {
        if(is_array($msg))
        {
            $this->_errors = array_merge($this->_errors, $msg);
            $this->_errnum += count($msg);
        }
        else
        {
            $this->_errors[] = compact('msg', 'obj');
            $this->_errnum++;
        }
    }

    /**
     *    检查是否存在错误
     *
     *    @author    Garbin
     *    @return    int
     */
    function has_error()
    {
        return $this->_errnum;
    }

    /**
     *    获取错误列表
     *
     *    @author    Garbin
     *    @return    array
     */
    function get_error()
    {
        return $this->_errors;
    }
}

function LoadLibrary($library)
{
	require_once(ROOT_PATH .'/mvc/lib/'.$library.'.lib.php');
}

function L($library)
{
	LoadLibrary($library);
}

//提前加载成员登录管理
L("member");
L("dbMysqlConnection");
L("dbModel");
L("time");

//加载模型类
function LoadModel($model)
{
	require_once(ROOT_PATH . '/app/m/'.$model.'Model.php');
}

function LoadService($service)
{
	require_once(ROOT_PATH .'/app/service/'.$service.'.svc.php');
}

function Svc($service)
{
	LoadService($service);
}

//$a=new dbMysqlConnection();
//print_r($a->getMaster());
//print_r(dbMysqlConnection::getMaster());
//exit;

//获取model类
/*
function M($model_name, $params = array(), $key_name="id")
{
	LoadModel($model_name);
	$model_class_name=$model_name . "Model";
	$model=new $model_class_name($model_name,$key_name);
	return $model;
}
*/


function &cache_server()
{
	L("cache");
    static $CS = null;
    if ($CS === null)
    {
        switch (CACHE_SERVER)
        {
            case 'memcached':
                $CS = new MemcacheServer(array(
                    'host'  => MEMCACHE_HOST,
                    'port'  => MEMCACHE_PORT,
                ));
            break;
            default:
                $CS = new PhpCacheServer;
                $CS->set_cache_dir(ROOT_PATH . '/temp/caches');
            break;
        }
    }

    return $CS;
}

function M($model_name, $use_prefix=true, $master=false, $params = array(), $is_new = false)
{
    static $models = array();
    $model_hash = md5($model_name . var_export($params, true));
	if ($is_new || !isset($models[$model_hash]))
	{
		$mpath="";
		$mname="";
		if(strpos($model_name,"/")>-1)
		{
			$mpath=GetStrLeft($model_name,"/");
			$mname=GetStrRight($model_name,"/");
		}
        $model_file = ROOT_PATH . '/app/m/' . $model_name . 'Model.php';

        if (!is_file($model_file))
        {
            /* 不存在该文件，则无法获取模型 */
			echoMsg($model_name . "Model 创建错误!");
            return false;
        }
        include_once($model_file);
        $tmp_model_name = $mname . 'Model';
		if(!class_exists($tmp_model_name))
		{
			$tmp_model_name = str_replace("/","_",$model_name) . 'Model';
		}
		$db=null;
		if($master)
		{
			$db=dbMysqlConnection::getMaster();
		}
		else
		{
			$db=dbMysqlConnection::getSlave();
		}
		$model= new $tmp_model_name($params, $db);
		if(!$use_prefix)
		{
			$model->_prefix="";
			$model->table=$model_name;
		}
        if ($is_new)
        {
			return $model;
        }
        $models[$model_hash] = $model;
	}
    return $models[$model_hash];
}

//创建一个Master数据库
function DBM($model_name, $params = array(), $is_new = false)
{
	$use_prefix=false;
    static $models = array();
    $model_hash = md5($model_name . var_export($params, true));
	if ($is_new || !isset($models[$model_hash]))
	{
		$mpath="";
		$mname="";
		if(strpos($model_name,"/")>-1)
		{
			$use_prefix=true;
			$mpath=GetStrLeft($model_name,"/");
			$mname=GetStrRight($model_name,"/");
		}
        $model_file = ROOT_PATH . '/app/m/' . $model_name . 'Model.php';

        if (!is_file($model_file))
        {
            /* 不存在该文件，则无法获取模型 */
			echoMsg($model_name . "Model 创建错误!");
            return false;
        }
        include_once($model_file);
        $tmp_model_name = $mname . 'Model';
		if(!class_exists($tmp_model_name))
		{
			$tmp_model_name = str_replace("/","_",$model_name) . 'Model';
		}
		$db=dbMysqlConnection::getMaster();
		$model= new $tmp_model_name($params, $db);
		if(!$use_prefix)
		{
			$model->_prefix="";
			$model->table=$model_name;
		}
        if ($is_new)
        {
			return $model;
        }
        $models[$model_hash] = $model;
	}
    return $models[$model_hash];
}


//创建一个Slave数据库
function DBS($model_name, $params = array(), $is_new = false)
{
	$use_prefix=false;
    static $models = array();
    $model_hash = md5($model_name . var_export($params, true));
	if ($is_new || !isset($models[$model_hash]))
	{
		$mpath="";
		$mname="";
		if(strpos($model_name,"/")>-1)
		{
			$use_prefix=true;
			$mpath=GetStrLeft($model_name,"/");
			$mname=GetStrRight($model_name,"/");
		}
        $model_file = ROOT_PATH . '/app/m/' . $model_name . 'Model.php';

        if (!is_file($model_file))
        {
            /* 不存在该文件，则无法获取模型 */
			echoMsg($model_name . "Model 创建错误!");
            return false;
        }
        include_once($model_file);
        $tmp_model_name = $mname . 'Model';
		if(!class_exists($tmp_model_name))
		{
			$tmp_model_name = str_replace("/","_",$model_name) . 'Model';
		}
		$db=dbMysqlConnection::getSlave();
		$model= new $tmp_model_name($params, $db);
		if(!$use_prefix)
		{
			$model->_prefix="";
			$model->table=$model_name;
		}
        if ($is_new)
        {
			return $model;
        }
        $models[$model_hash] = $model;
	}
    return $models[$model_hash];
}

function T($dir_name,$set_userinfo=true)
{
	$theme=THEME;
	if(isset($GLOBALS["THEME"]))
	{
		if($GLOBALS["THEME"]!="")
		{
			$theme=$GLOBALS["THEME"];
		}
	}
	LoadLibrary("template");						//载入模板引擎
	$template=new TemplateApp();
	$template_dir="themes/" . $theme;
	if($dir_name!="")
	{
		$template_dir.=ROOT_PATH . "/" . $dir_name;
		$template->SetCompileDir($dir_name);
	}
	$template->SetTemplateDir($template_dir);
	if($set_userinfo)
	{
		SetUserInfo($template);
	}
	return $template;
}

//MVC控制器
function MvcControl()
{
	$static=G2Int("static");
	$GLOBALS["gStatic"]=$static;
	
	$c=preg_replace('/(\W+)/', '', G("c"));
	$cpath="";
	$cname="";
	//拆分第一个_标记符
	if(strpos($c,"_")>-1)
	{
		$cpath=GetStrLeft($c,"_");
		$cname=GetStrRight($c,"_");
	}
    else {
        $cname = $c;
    }
	if($cname=="")
	{
		if($cpath=="")
		{
			$cname="index";
		}
		else
		{
			$cname=$cpath;
			$cpath="";
		}
	}
	
	$a=G("a");
	if($a=="")
	{
		$a="default";
	}
	
	define('APATH', $cpath);	
	define('APP', $cname);
	define('ACT', $a);

	$classfile=ROOT_PATH . '/app/c/';
	if($cpath)
	{
		$classfile.=$cpath . "/";
	}
	$classfile.=$cname.'Control.php';
	if(!file_exists($classfile))
	{
		echoMsg($classfile);
		exit;
		header("Location: 404.php");
	}
	else
	{
		require_once($classfile);
		$classname=$cname.'Control';
		if(!class_exists($classname))
		{
			$classname=$cpath . "_" . $classname;
		}
		$class=new $classname();
		$action=$a.'Action';
		if(!method_exists($class,$action))
		{
			echoMsg($action);
			exit;
			header("Location: 404.php"); 		
		}
		else
		{
			$class->$action();
		}	
	}
}


/*生成URL函授***************
#arr(key=>value)
#return string
**************************/
function Make_Url($arr,$is_domain='')
{
	$control=isset($_GET['c'])?$_GET['c']:'index';
	$action=isset($_GET['a'])?$_GET['a']:'default';
	//echo 1;
	if(ReUrl_On)
	{
		if($is_domain)
		{
			$str=$action.'/';
			$siteurl='http://'.$control.'.'.SiteDomain.'/';
		}
		else{
			$str=$control.'/'.$action.'/';	
			$siteurl=SiteUrl;
		}
		if($arr)
		{
			foreach($arr as $val)
			{
				$new[]=urlencode($val);
			}
			$st=join('/',$new).'.html';
		}
		$str.=$st;
		return $siteurl.$str;
	}
	else
	{
		$str='index.php?c='.$control.'&a='.$action;
		if($arr)
		{
			foreach($arr as $key=>$val)
			{
				$new[]=$key.'='.urlencode($val);
			}
			
			$st='&'.join('&',$new);
		}
		$str.=$st;
	}
	return SiteUrl.$str;
}

/**
 *    连接会员系统
 *
 *    @return    Passport 会员系统连接接口
 */
function &ms()
{
    static $ms = null;
    if ($ms === null)
    {
        include(ROOT_PATH . '/app/system/passport.base.php');
        include(ROOT_PATH . '/includes/passports/' . MEMBER_TYPE . '.passport.php');
        $class_name  = ucfirst(MEMBER_TYPE) . 'Passport';
		
        $ms = new $class_name();
    }

    return $ms;
}

function log_message($level = 'error', $message, $php_error = FALSE)
{
	static $_log;
	if ($_log === null)
	{
		$_log = L("log");
		$_log=new Log();
	}
	$_log->write_log($level, $message, $php_error);
}
/**
 * 截取UTF-8编码下字符串的函数
 *
 * @param   string      $str        被截取的字符串
 * @param   int         $length     截取的长度
 * @param   bool        $append     是否附加省略号
 *
 * @return  string
 */
function sub_str($string, $length = 0, $append = true)
{

    if(strlen($string) <= $length) {
        return $string;
    }

    $string = str_replace(array('&amp;', '&quot;', '&lt;', '&gt;'), array('&', '"', '<', '>'), $string);

    $strcut = '';

    if(strtolower(CHARSET) == 'utf-8') {
        $n = $tn = $noc = 0;
        while($n < strlen($string)) {

            $t = ord($string[$n]);
            if($t == 9 || $t == 10 || (32 <= $t && $t <= 126)) {
                $tn = 1; $n++; $noc++;
            } elseif(194 <= $t && $t <= 223) {
                $tn = 2; $n += 2; $noc += 2;
            } elseif(224 <= $t && $t < 239) {
                $tn = 3; $n += 3; $noc += 2;
            } elseif(240 <= $t && $t <= 247) {
                $tn = 4; $n += 4; $noc += 2;
            } elseif(248 <= $t && $t <= 251) {
                $tn = 5; $n += 5; $noc += 2;
            } elseif($t == 252 || $t == 253) {
                $tn = 6; $n += 6; $noc += 2;
            } else {
                $n++;
            }

            if($noc >= $length) {
                break;
            }

        }
        if($noc > $length) {
            $n -= $tn;
        }

        $strcut = substr($string, 0, $n);

    } else {
        for($i = 0; $i < $length; $i++) {
            $strcut .= ord($string[$i]) > 127 ? $string[$i].$string[++$i] : $string[$i];
        }
    }

    $strcut = str_replace(array('&', '"', '<', '>'), array('&amp;', '&quot;', '&lt;', '&gt;'), $strcut);

    if ($append && $string != $strcut)
    {
        $strcut .= '...';
    }

    return $strcut;

}

?>