<?php 
/*************************************************************/
#author: LYC teams {you}
#time  : 2009-12-10 17:26
#info  : 数据库类文件
/************************************************************/

if(!defined('IN_CJCMS')) {
	exit('Access Denied');
}
class database
	{
	//属性
	private $host;	//服务器名
	private $user;	//用户名
	private $pwd;		//密码
	private $name;	//数据库名		
	private $connection;	//连接标识
		
		//方法
		//__get()：获取属性值
	function __get($property_name)
	{  
			 if(isset($this->$property_name))
			 { 
					return($this->$property_name); 
			 } 
			 else
			 { 
					return(NULL); 
			 } 
	}
		
		//__set()：设置属性值
	function __set($property_name, $value) { 
			 $this->$property_name = $value; 
		} 		
		
		//__construct：构造函数，建立连接
	function __construct($host,$user,$pwd,$name)
		{
			$this->host=$host;	
			$this->user=$user;
			$this->pwd=$pwd;
			$this->name=$name;
			
			@$this->connection=mysql_connect ($this->host,$this->user,$this->pwd) or die('数据库服务器连接失败。 ');//建立连接
				//选择数据库

			if($this->version() > '4.1') {

				if($dbcharset) {
					mysql_query("SET character_set_connection=".$dbcharset.", character_set_results=".$dbcharset.", character_set_client=binary", $this->connection);
				}
	
				if($this->version() > '5.0.1') {
					mysql_query("SET sql_mode=''", $this->connection);
				  //mysql_query('SET NAMES "utf8"');
				}
			}


			@mysql_select_db($this->name, $this->connection) or die ('数据库连接失败。 ');
		}
		
		//__destruct：析构函数，断开连接
	function __destruct(){
		@mysql_close($this->connection)  or die ('断开失败 ');
	}
		
	//增删改：参数$sql为delete语句
	function query($sql){
			//echo $sql;
		if(!isset($sql)){return 0;exit;}
		if(mysql_query($sql))return 1;
		else return 0;
	}
		
	//查：参数$sql为select语句;返回值为对象数组，数组中的每一元素为一行记录构成的数组
	function getAll($sql){
		if(!isset($sql)){return 0;exit;}
		$result_array=array();	//返回数组
		$i=0;										//数组下标
		if(!$query_result=mysql_query($sql,$this->connection))return 0;	//查询数据
		else
		{
			while($row=mysql_fetch_array($query_result)){
				$result_array[$i++]=$row;
			}//while
			return $result_array; 
		}
	}
	//更新数据库 
	function updateArr($table,$arr,$where){
		$sql="update ".$table." set ";
		foreach($arr as $key=>$val){
			$new[]=$key."='".$val."'";
		}
		$st=join(',',$new);
		$sql.=$st.$where;
		if(mysql_query($sql)){
			return 1;
		}
		else{
			return 0;
		}
	}
	//插入数据库记录
	function insertArr($table,$arr,$return=""){
		$sql="insert into ".$table;
		foreach($arr as $key=>$val){
			$k[]="`".$key."`";
			$v[]="'".$val."'";
		}
		$ke=join(',',$k);
		$va=join(',',$v);
		$sql.=" (".$ke.") values(".$va.")";
		if(mysql_query($sql)){
			if($return){
			 	return mysql_insert_id();
			}
			else{
				return 1;
			}
		}
		else{
			return 0;
		}
		      
	}
	//取一条记录
	function getOne($sql){
		$arr=$this->getAll($sql);
		return $arr[0]?$arr[0]:0;
	}	
	//返回记录数
	function rowNum($result){
		return mysql_num_rows($result);
	}	
				
	//返回数据库版本号
	private function version() {
		return mysql_get_server_info($this->connection);
	}

}
?>