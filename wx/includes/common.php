<?php 
/*************************************************************/
#author: LYC teams
#time  : 2009-12-10 17:26
#info  : 公共类
/************************************************************/

/**
* 返回一个指定的config配置文件项目
* @access	public
* @return	mixed
*/
function config_item($item)
{
	static $_config_item = array();
	if(!isset($_config_item[$item]))
	{
		$config =& get_config();
		if(!isset($config[$item]))
		{
			return FALSE;
		}
		$_config_item[$item] = $config[$item];
	}
	return $_config_item[$item];
}

/**
 * 测试文件是否可写
 *
 * is_writable() returns TRUE on Windows servers when you really can't write to
 * the file, based on the read-only attribute.  is_writable() is also unreliable
 * on Unix servers if safe_mode is on.
 *
 * @access	private
 * @return	void
 */
function is_really_writable($file)
{
	// If we're on a Unix server with safe_mode off we call is_writable
	if (DIRECTORY_SEPARATOR == '/' AND @ini_get("safe_mode") == FALSE)
	{
		return is_writable($file);
	}
	// For windows servers and safe_mode "on" installations we'll actually
	// write a file then read it.  Bah...
	if (is_dir($file))
	{
		$file = rtrim($file, '/').'/'.md5(mt_rand(1,100).mt_rand(1,100));

		if (($fp = @fopen($file, FOPEN_WRITE_CREATE)) === FALSE)
		{
			return FALSE;
		}

		fclose($fp);
		@chmod($file, DIR_WRITE_MODE);
		@unlink($file);
		return TRUE;
	}
	elseif ( ! is_file($file) OR ($fp = @fopen($file, FOPEN_WRITE_CREATE)) === FALSE)
	{
		return FALSE;
	}
	fclose($fp);
	return TRUE;
}

function log_message($level = 'error', $message, $php_error = FALSE)
{
	static $_log;
	if (config_item('log_threshold') == 0)
	{
		return;
	}
	$_log =& load_class('Log');
	$_log->write_log($level, $message, $php_error);
}

class Common
{
	/*控制器开始*/
	function LycControl()
	{
		if(isset($_GET['c'])) 
		{
			$c=$_GET['c'];		
			$a=isset($_GET['a'])?$_GET['a']:'default';
		}
		else
		{
			$c='index';
			$a='default';
		}
		$classfile=ROOT_PATH . "/app/c/" . $c . "Control.php";
		if(!file_exists($classfile))
		{
			header("Location: 404.php"); 
		}
		else
		{
			//require_once(ROOT_PATH . "/includes/core/FrontControlApp.class.php");
			require_once($classfile);
			$classname=$c.'Control';
			$class=new $classname();		
			$action=$a.'Action';
			if(!method_exists($class,$action))
			{
				header("Location: 404.php"); 		
			}
			else
			{
				$class->$action();
			}	
		}
	}
	/*END 控制器*/
}
?>
