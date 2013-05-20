<?php
require_once(dirname(__FILE__).'/dbmysql.lib.php');
class dbMysqlConnection
{
	public static $conn_master_string;		//主库连接字符串
	public static $conn_slaves_strings;		//从库连接字符串
	
	public static $conn_master;				//主库连接
	public static $conn_slave;				//从库连接
	
	function __construct()
	{
		$this->dbMysqlConnection();
	}
	
	function dbMysqlConnection()
	{
	}

	public static function getMaster()
	{
		if(!self::$conn_master)
		{
			if(isset($_SERVER["DB_CONFIG"]["master"]))
			{
				$cfg=$_SERVER["DB_CONFIG"]["master"];
				self::$conn_master_string="mysql://" . $cfg["user"] . ":" . $cfg["pass"] . "@" . $cfg["server"] . "/" . $cfg["db"];
				self::$conn_master=new dbMysql();
				self::$conn_master->cache_dir = ROOT_PATH . '/temp/query_caches_master';
				self::$conn_master->connect($cfg["server"] . ':' . $cfg["port"], $cfg['user'], $cfg['pass'], $cfg['db'], $_SERVER["DB_CONFIG"]["charset"]);
			}			
		}
		return self::$conn_master;
	}
	
	public static function getSlave()
	{
		if(!self::$conn_slave)
		{
			if(isset($_SERVER["DB_CONFIG"]["slave"]))
			{
				$cfgs=$_SERVER["DB_CONFIG"]["slave"];
				self::$conn_slaves_strings=array();
				foreach($cfgs as $cfg)
				{
					array_push(self::$conn_slaves_strings,array("conn"=>"mysql://" . $cfg["user"] . ":" . $cfg["pass"] . "@" . $cfg["server"] . "/" . $cfg["db"]));
				}	
				$pos=rand(0,count(self::$conn_slaves_strings)-1);
				
				$cfg=$cfgs[$pos];	
				$slave_dir=ROOT_PATH . '/temp/query_caches_slave/' . $pos . "/";
				makeDir($slave_dir);
				self::$conn_slave=new dbMysql();
				self::$conn_slave->cache_dir = $slave_dir;
				self::$conn_slave->connect($cfg["server"] . ':' . $cfg["port"],$cfg['user'],$cfg['pass'],$cfg['db'],$_SERVER["DB_CONFIG"]["charset"]);
			}
		}
		return self::$conn_slave;
	}
}
?>