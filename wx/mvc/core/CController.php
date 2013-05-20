<?php
LoadLibrary("cache");
class CController extends Object
{
	
	public $cs=null;	
	
	function __construct()
	{
		$this->Init();
	}
	
	function CController()
	{
		$this->Init();
	}
	
	function Init()
	{
		$this->cs=new PhpCacheServer();									//创建一个cache服务对象
        $this->cs->set_cache_dir(ROOT_PATH . "/tmp/static_caches");
	}	
	
	//页面跳转
    public function jump($url, $delay = 0)
	{
		if($url=="")
		{
			if(isset($_SESSION["OriginalUrl"]))
			{
				$url=$_SESSION["OriginalUrl"];
			}
			else
			{
				$url="/index.php";
			}
		}
		echo "<html><head><meta http-equiv='refresh' content='{$delay};url={$url}'></head><body></body></html>";
		exit;
    }
	
	//错误提示
    public function error($msg, $url)
	{
		if($url=="")
		{
			if(isset($_SESSION["OriginalUrl"]))
			{
				$url=$_SESSION["OriginalUrl"];
			}
			else
			{
				$url="/index.php";
			}
		}		
		echo "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"><script>function sptips(){alert(\"{$msg}\");location.href=\"{$url}\";}</script></head><body onload=\"sptips()\"></body></html>";
		exit;
    }
	
	//成功提示
    public function success($msg, $url)
	{
		if($url=="")
		{
			if(isset($_SESSION["OriginalUrl"]))
			{
				$url=$_SESSION["OriginalUrl"];
			}
			else
			{
				$url="/index.php";
			}
		}	
		echo "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"><script>function sptips(){alert(\"{$msg}\");location.href=\"{$url}\";}</script></head><body onload=\"sptips()\"></body></html>";
		exit;
    }
	
	function GotoBack()
	{
		if(isset($_SESSION["OriginalUrl"]))
		{
			echo "<script>window.location='" . $_SESSION["OriginalUrl"] . "';</script>";
		}
		else
		{
			echo "<script>window.location='/index.php';</script>";
		}
	}
	
}
?>