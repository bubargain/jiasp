<?php 
/*************************************************************/
#author: cui
#time  : 2011-10-31 11:43
/************************************************************/
define('IN_CJCMS',true);

define('VERSION', '0.0.1');
define('RELEASE', '20120627');
/* 定义PHP_SELF常量 */
define('PHP_SELF',  htmlentities(isset($_SERVER['PHP_SELF']) ? $_SERVER['PHP_SELF'] : $_SERVER['SCRIPT_NAME']));

define('FOPEN_WRITE_CREATE','ab');
define('FILE_READ_MODE', 0644);
define('FILE_WRITE_MODE', 0666);
define('DIR_READ_MODE', 0755);
define('DIR_WRITE_MODE', 0777);


//error_reporting(0);
if(__FILE__=='')
{
    die('Fatal error code: 0');
}

/* 初始化设置 */
//date_default_timezone_set("Asia/Shanghai");
@ini_set('memory_limit',          '64M');
@ini_set('session.cache_expire',  180);
@ini_set('session.use_trans_sid', 0);
@ini_set('session.use_cookies',   1);
@ini_set('session.auto_start',    1);

/**
 *    从文件或数组中定义常量
 *    @param     mixed $source
 *    @return    void
 */
function mvc_define($source)
{
    if (is_string($source))
    {
        /* 导入数组 */
        $source = include($source);
    }
    if (!is_array($source))
    {
        /* 不是数组，无法定义 */
        return false;
    }
    foreach ($source as $key => $value)
    {
        if (is_string($value) || is_numeric($value) || is_bool($value) || is_null($value))
        {
            /* 如果是可被定义的，则定义 */
            define(strtoupper($key), $value);
        }
    }
}

//加载配置文件
mvc_define(ROOT_PATH . '/config/config.php');

$GLOBALS["THEME"]=THEME;		//全局模板变量名

//加载公用php函数库
require_once(ROOT_PATH.'/includes/public.php');
require_once(ROOT_PATH.'/includes/helper.php');
//包含mvc控制器
require_once(ROOT_PATH.'/mvc/mvc.php');
?>