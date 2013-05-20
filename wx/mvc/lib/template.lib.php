<?php
/*************************************************************/
#FrontControlApp 前端控制类（主要封装数据库及模板）
#author: LYC teams {cui}
#time  : 2009-12-11 16:03
/************************************************************/

require_once(ROOT_PATH.'/mvc/template.php');

class TemplateApp
{
	public $smarty=null;
	public $theme="";

    function __construct()
    {
        $this->TemplateApp();
    }
	
	//构造函数
	function TemplateApp()
	{
		$this->theme=$GLOBALS["THEME"];
		$this->smarty=new Template();
		$this->smarty->config_dir=ROOT_PATH . "/config";
		$this->smarty->cache_dir = ROOT_PATH . "/tmp/cache/" . $this->theme;
		$this->smarty->compile_dir = ROOT_PATH . "/tmp/templates_c" . "/" . $this->theme;
		$this->smarty->template_dir = ROOT_PATH . "/themes" . "/" . $this->theme;
		$this->smarty->cache_lifetime = 0;
		$this->smarty->caching = false;
		$this->_config_view();
	}
	
    function _config_view()
    {
        $this->smarty->caching       = ((DEBUG_MODE & 1) == 0);  // 是否缓存
        $this->smarty->force_compile = ((DEBUG_MODE & 2) == 2);  // 是否需要强制编译
        $this->smarty->direct_output = ((DEBUG_MODE & 4) == 4);  // 是否直接输出
        $this->smarty->gzip          = (defined('ENABLED_GZIP') && ENABLED_GZIP === 1);
        $this->smarty->lib_base      = site_url() . '/js';
		$this->smarty->res_base      = site_url() . '/themes/' . $this->theme;
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
		$this->smarty->compile_dir = ROOT_PATH . "/tmp/templates_c/" . $this->theme . "/" . $dir;
	}
	
	function display($temp)
	{
		$arr = explode('/',$temp);
		$filename= $arr[count($arr)-1];
		//$path=GetStrLeft($temp,"/");
		$dir=GetStrLeft($temp,"/");
		$path=substr($temp,0,strlen($temp)-strlen($filename)-1);
		if($dir)
		{
			$path=GetStrRight($temp,"/");
			$this->smarty->template_dir=$this->smarty->template_dir . "/" . $dir;
		}
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
	
	function fetch($filename, $cache_id = '')
	{
		return $this->smarty->fetch($filename, $cache_id);
	}
	
}
?>