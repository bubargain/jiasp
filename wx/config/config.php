<?php
if(!defined('IN_CJCMS')) die('SORRY');

$_SERVER["DB_CONFIG"]=array(
    "master"=>array(
        "server"=>$_SERVER['MDB_SERVER_WEIXIN'],
        "user"=>$_SERVER['MDB_USER_WEIXIN'],
        "pass"=>$_SERVER['MDB_PASS_WEIXIN'],
        "db"=>$_SERVER['MDB_DB_WEIXIN'],
    ),
    'slave'=>array(
        array(
            "server"=>$_SERVER['MDB_SERVER_WEIXIN'],
			"user"=>$_SERVER['MDB_USER_WEIXIN'],
			"pass"=>$_SERVER['MDB_PASS_WEIXIN'],
			"db"=>$_SERVER['MDB_DB_WEIXIN'],
        ),
		array(
            "server"=>$_SERVER['MDB_SERVER_WEIXIN'],
			"user"=>$_SERVER['MDB_USER_WEIXIN'],
			"pass"=>$_SERVER['MDB_PASS_WEIXIN'],
			"db"=>$_SERVER['MDB_DB_WEIXIN'],
        ),
		/*
		array(
            "server"=>$_SERVER['SDB1_SERVER_WEIXIN'],
            "user"=>$_SERVER['SDB1_USER_WEIXIN'],
            "pass"=>$_SERVER['SDB1_PASS_WEIXIN'],
            "db"=>$_SERVER['SDB1_DB_WEIXIN']
        ),
        array(
            "server"=>$_SERVER['SDB2_SERVER_WEIXIN'],
            "user"=>$_SERVER['SDB2_USER_WEIXIN'],
            "pass"=>$_SERVER['SDB2_PASS_WEIXIN'],
            "db"=>$_SERVER['SDB2_DB_WEIXIN']
        ),
		/*
        array(
            "server"=>$_SERVER['SDB3_SERVER_WEIXIN'],
            "user"=>$_SERVER['SDB3_USER_WEIXIN'],
            "pass"=>$_SERVER['SDB3_PASS_WEIXIN'],
            "db"=>$_SERVER['SDB3_DB_WEIXIN']
        ),
		*/
    ),

    "driver" => "mysqli",
	"charset" => "utf8",
	"prefix" => "",
);


return array (
  'SITE_URL' => 'http://www.ymall.com/services/weixin',
  'JS_BASE_URL' => '/admin/js/',					//商城自己的存储设备,指向网站根目录 /
  'IMG_BASE_URL' => '/admin/data/images/',			//商城自己的存储设备,指向网站根目录 /
  'CDN_URL' => 'http://mp' .rand(1,2) . '.yokacdn.com',			//CDN 目录
  'DB_PREFIX' => '',
  'CHARSET' => 'utf-8',													//字符集
  'COOKIE_DOMAIN' => '',
  'COOKIE_PATH' => '/',
  'MALL_KEY' => 'fca0c6540f53b6cd554e9ec3f0a1a235',
  'MALL_SITE_ID' => 'EMLBTLUk7eNm8z6r',
  'ENABLED_GZIP' => 0,
  'DEBUG_MODE' => 0,
  'CACHE_SERVER' => 'default',
#  'CACHE_SERVER' => 'memcached',
  
  'THEME'=>'cn_style1',														//默认模板名称
  'LANG'=>'cn',																//默认语言
  
  'MEMBER_TYPE' => 'default',
  'ENABLED_SUBDOMAIN' => 0,
  'SUBDOMAIN_SUFFIX' => '',
  
  /*
  'UC_DBCHARSET' => 'utf8',
  'UC_DBTABLEPRE' => '`uspace_ucenter`.uc_',
  'UC_KEY' => 'B1k9Q4k972y4ya3bb4X0w1YdKdvbZ7B4tadeLeo9a1w6XbH3idweh6M7K3W7M1fe',
  'UC_APPID' => '35',
  'UC_DBHOST' => '10.0.0.27:6924',
  'UC_DBNAME' => 'uspace_ucenter',
  'UC_DBUSER' => 'uspace',
  'UC_DBPW' => 'uspace.yoka.com',
  'UC_CHARSET' => 'utf-8',
  'UC_API' => 'http://ucenter.yoka.com/',
  'UC_PATH' => 'uc_client',
  'UC_CONNECT' => '',
  'UC_IP' => '',
  'UC_DBCONNECT' => '0',
  */
);
?>