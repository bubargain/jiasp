<?php
header("content-Type: text/html; charset=utf8");
define('ROOT_PATH', str_replace('\\','/',dirname(__FILE__)));
define('CDNServer','http://mp1.yokacdn.com/');
//入口文件
require("mvc/ini.php");

MvcControl();
?>