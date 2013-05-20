<?php

class MysqlApp
{
	//属性
	private $host;				//服务器名
	private $user;				//用户名
	private $pwd;				//密码
	private $name;				//数据库名		
	private $connection;		//连接标识

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
	function __set($property_name, $value)
	{
		$this->$property_name = $value;
	}
	
	//设置数据库的链接
	function SetConnection($conn)
	{
		$this->connection=$conn;
	}
	
	function DisConnection()
	{
		@mysql_close($this->connection)  or die ('断开失败 ');		
	}
	
	function SetConn($host,$user,$pwd,$name)
	{
		$this->host=$host;
		$this->user=$user;
		$this->pwd=$pwd;
		$this->name=$name;

		@$this->connection=mysql_connect($this->host,$this->user,$this->pwd) or die('数据库服务器连接失败。 ');//建立连接
		//选择数据库
		
		if($this->version()>'4.1')
		{
			if($dbcharset)
			{
				mysql_query("SET character_set_connection=".$dbcharset.", character_set_results=".$dbcharset.", character_set_client=binary", $this->connection);
			}
			if($this->version()>'5.0.1')
			{
				mysql_query("SET sql_mode=''", $this->connection);
				//mysql_query('SET NAMES "utf8"');
			}
		}
		@mysql_select_db($this->name, $this->connection) or die ('数据库连接失败。 ');
	}
	
	//__construct：构造函数，建立连接
	function __construct()
	{
	     $this->MysqlApp();	
	}
	
	function MysqlApp()
	{
	}

	function Exists($Table,$KeyField,$KeyValue)
	{
		$sQuery = "select count(1) from " . $Table . " where " . $KeyField . "='" . $KeyValue . "'";
		$rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
		$nRet=mysql_result($rs,0);
		if($nRet>0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	public function GetCount($Table,$strWhere)
	{
		$sQuery = "select count(*) from " . $Table;
		if($strWhere!="")
		{
			$sQuery=$sQuery." where ".$strWhere;
		}
		$rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
		$nRet=mysql_result($rs,0);
		mysql_free_result($rs);
		return $nRet;
	}
	
	function GetOne($sQuery)
	{
		$ret="";
		$rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
		if($rs!=null)
		{
			$row=null;
			if($row=mysql_fetch_array($rs,MYSQL_NUM))
			{
				$ret=$row[0];
			}
		}
		mysql_free_result($rs);	
		return $ret;
	}
	
	public function QueryRow($Table,$strWhere,$fields='*',$order='')
	{
		$sql="select " . $fields . " from " . $Table;
		if($strWhere!="")
		{
			$sql=$sql." where ".$strWhere;
		}
		if($order!=null)
		{
			$sql=$sql." ".$order;
		}
		$rs=mysql_query($sql) or die('Query failed: ' . mysql_error());
		if($rs!=null)
		{
			$ary = array();
			$row=null;
			if($row=mysql_fetch_array($rs,MYSQL_ASSOC))
			{
				return $row;
			}
		}
		return "";
	}
	
	public function QueryAll($Table,$strWhere,$fields='*',$order='')
	{
		$sql="select " . $fields . " from " . $Table;
		if($strWhere!="")
		{
			$sql=$sql." where ".$strWhere;
		}
		if($order!=null)
		{
			$sql=$sql." ".$order;
		}
		$rs=mysql_query($sql) or die('Query failed: ' . mysql_error());
		return $rs;
	}
	
	public function QueryRowToArray($Table,$strWhere,$fields='*',$order='',$limit='')
	{
		$sql="select " . $fields . " from " . $Table;
		if($strWhere!="")
		{
			$sql=$sql." where ".$strWhere;
		}
		if($order!=null)
		{
			$sql=$sql." ".$order;
		}
		if($limit!=null)
		{
			$sql=$sql." ".$limit;		
		}
		$rs=mysql_query($sql) or die('Query failed: ' . mysql_error());
		if($rs!=null)
		{
			$ary = array();
			$row=null;
			while($row=mysql_fetch_array($rs,MYSQL_NUM))
			{
				array_push($ary,$row[0]);
			}
			return $ary;
		}
		return "";
	}	
	
	public function QueryAllToArray($Table,$strWhere,$fields='*',$order='')
	{
		$sql="select " . $fields . " from " . $Table;
		if($strWhere!="")
		{
			$sql=$sql." where ".$strWhere;
		}
		if($order!=null)
		{
			$sql=$sql." ".$order;
		}
		$rs=mysql_query($sql) or die('Query failed: ' . mysql_error());
		if($rs!=null)
		{
			$ary = array();
			$row=null;
			while($row=mysql_fetch_array($rs,MYSQL_NUM))
			{
				array_push($ary,$row);
			}
			return $ary;
		}
		return "";
	}
	
	public function QueryRowToArrayByName($Table,$strWhere,$fields='*',$order='',$limit='')
	{
		$sql="select " . $fields . " from " . $Table;
		if($strWhere!="")
		{
			$sql=$sql." where ".$strWhere;
		}
		if($order!=null)
		{
			$sql=$sql." ".$order;
		}
		if($limit!=null)
		{
			$sql=$sql." ".$limit;		
		}
		$rs=mysql_query($sql) or die('Query failed: ' . mysql_error());
		if($rs!=null)
		{
			$ary = array();
			$row=null;
			while($row=mysql_fetch_array($rs,MYSQL_ASSOC))
			{
				array_push($ary,$row[0]);
			}
			return $ary;
		}
		return "";
	}	
	
	public function QueryAllToArrayByName($Table,$strWhere,$fields='*',$order='')
	{
		$sql="select " . $fields . " from " . $Table;
		if($strWhere!="")
		{
			$sql=$sql." where ".$strWhere;
		}
		if($order!=null)
		{
			$sql=$sql." ".$order;
		}
		$rs=mysql_query($sql) or die('Query failed: ' . mysql_error());
		if($rs!=null)
		{
			$ary = array();
			$row=null;
			while($row=mysql_fetch_array($rs,MYSQL_ASSOC))
			{
				array_push($ary,$row);
			}
			return $ary;
		}
		return "";
	}
	
	public function AddByArray($Table,$data,$retid=true,$debug=false)
	{
		$nRet=0;
		$fields=array_keys($data);
		$values=array_values($data);
		$sql="insert into " . $Table . "(";
		foreach($fields as $field)
		{
			$sql.=$field . ",";
		}
		$sql=substr($sql,0,strlen($sql)-1);
		$sql.=") values(";
		foreach($values as $value)
		{
			$sql.="'" . $value . "',";
		}
		$sql=substr($sql,0,strlen($sql)-1);		
		$sql.=")";
		if($debug)
		{
			echoMsg($sql,"sql");
		}		
		if(mysql_query($sql))
		{
			if($retid==true)
			{
				$sQuery = "select max(" . $m_sKeyField . ") from " . $Table;
				$rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
				$nRet=mysql_result($rs,0);
				return $nRet;
			}
			else
			{
				return 0;
			}
		}
		else
		{
			return 0;
		}
	}
	
	public function UpdateByArray($Table,$data,$keyValue)
	{
		$fields=array_keys($data);
		$values=array_values($data);
		$sql="update " . $Table . " set ";
		$nCount=count($fields);
		for($i=0;$i<$nCount;$i++)
		{
			$field=$fields[$i];
			$value=$values[$i];
			$sql.=$field . "='" . $value . "',";
		}
		$sql=substr($sql,0,strlen($sql)-1);
		$sql.=" where " . $m_sKeyField . "='" . $keyValue . "'";
		return mysql_query($sql);
	}
	
	
	public function Delete($Table,$condition='')
	{
		if(is_numeric($condition)) 
		{
			return $DeleteByKeyValue($condition);
		}
		$sql="delete from " . $Table . " where " . $condition;
		return mysql_query($sql);
	}	
	
	public function DeleteByKeyValue($Table,$KeyValue)
	{
		$sql="delete from " . $Table . " where " . $m_sKeyField . "='" . $KeyValue . "'";
		return mysql_query($sql);
	}
	
	public function Execute($sql)
	{
		return mysql_query($sql);
	}
	
	//返回记录数
	function rowNum($result)
	{
		return mysql_num_rows($result);
	}	
				
	//返回数据库版本号
	private function version()
	{
		return mysql_get_server_info($this->connection);
	}

}
?>

