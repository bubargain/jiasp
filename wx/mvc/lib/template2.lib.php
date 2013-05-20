<?php
/*************************************************************/
#FrontControlApp 前端控制类（主要封装数据库及模板）
#author: LYC teams {cui}
#time  : 2009-12-11 16:03
/************************************************************/

require_once(ROOT_PATH.'/mvc/smarty/Smarty.class.php');

class TemplateApp
{
	public $smarty=null;

    function __construct()
    {
        $this->TemplateApp();
    }
	
	//构造函数
	function TemplateApp()
	{
		global $theme;
		$this->smarty=new Smarty();
		$this->smarty->config_dir=ROOT_PATH . "/config/";
		$this->smarty->cache_dir = ROOT_PATH . "/tmp/cache/" . $theme . "/";
		$this->smarty->compile_dir = ROOT_PATH . "/tmp/templates_c" . "/" . $theme;
		$this->smarty->template_dir = ROOT_PATH . "/themes" . "/" . $theme;
		$this->smarty->cache_lifetime = 0;
		$this->smarty->caching = false;
		$this->smarty->compile_check = true;
		$this->smarty->left_delimiter="{{";
		$this->smarty->right_delimiter="}}";
	}
	
	function assign($varname, $var)
	{
		$this->smarty->assign($varname,$var);
	}
	
	function SetTemplateDir($dir)
	{
		$this->smarty->template_dir = ROOT_PATH . "/" . $dir;
	}	
	
	function SetCompileDir($dir)
	{
		global $theme;
		$this->smarty->compile_dir = ROOT_PATH . "/tmp/templates_c/" . $theme . "/" . $dir;
	}
	
	function display($temp)
	{
		$arr = explode('/',$temp);
		$filename= $arr[count($arr)-1];
		$path=substr($temp,0,strlen($temp)-strlen($filename));
		$this->smarty->template_dir=$this->smarty->template_dir . $path;
		if(!is_file($this->smarty->template_dir . "/" . $filename))
		{
			echoMsg("文件 " . $this->smarty->template_dir . "/" . $filename . " 没有找到!");
			exit;
		}
		$this->smarty->display($filename);
	}
	
	function save($temp,$html_path)
	{
		$save_path=ROOT_PATH . "/" . $html_path;
		$save_dir=GetDir($save_path);
		makeDir($save_dir);
		$arr = explode('/',$temp);
		$filename= $arr[count($arr)-1];
		$path=substr($temp,0,strlen($temp)-strlen($filename));
		$this->smarty->template_dir=$this->smarty->template_dir . $path;	
		$output=$this->smarty->fetch($filename);
		$fp=fopen($save_path,"w");
		fwrite($fp,$output);
		fclose($fp);
	}
	
}
?>