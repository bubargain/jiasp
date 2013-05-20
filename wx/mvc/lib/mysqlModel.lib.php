<?php
class mysqlModel
{
	public $rs=null;						//记录集
	public $m_sTable="";					//表名称
	public $m_sKeyField="";					//主键名称
	
	function __construct($table,$keyField)
	{
		$this->SetTable($table,$keyField);
	}
	
	function mysqlModel($table,$keyField)
	{
		$this->SetTable($table,$keyField);
	}
	
	function SetTable($table,$keyField)
	{
		$this->m_sTable=$table;
		$this->m_sKeyField=$keyField;
	}
	
	function __destruct()
	{
		if($this->rs)
		{
			unset($this->rs);
			$this->rs=null;
		}
	}
	
	public function CloseRs()
	{
		if($this->rs)
		{
			unset($this->rs);
			$this->rs=null;
		}
	}	
	
	function Exists($KeyValue)
	{
		$sQuery = "select count(1) from " . $this->m_sTable . " where " . $this->m_sKeyField . "='" . $KeyValue . "'";
		$this->rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
		$nRet=mysql_result($this->rs,0);
		if($nRet>0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	public function GetCount($strWhere)
	{
		$sQuery = "select count(*) from " . $this->m_sTable;
		if($strWhere!="")
		{
			$sQuery=$sQuery." where ".$strWhere;
		}
		$this->rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
		$nRet=mysql_result($this->rs,0);
		mysql_free_result($this->rs);
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
	
	public function QueryRow($strWhere,$fields='*',$order='',$table='')
	{
		if($table=="")
		{
			$table=$this->m_sTable;
		}
		$sql="select " . $fields . " from " . $table;
		if($strWhere!="")
		{
			$sql=$sql." where ".$strWhere;
		}
		if($order!=null)
		{
			$sql=$sql." ".$order;
		}
		$this->rs=mysql_query($sql) or die('Query failed: ' . mysql_error());
		if($this->rs!=null)
		{
			$ary = array();
			$row=null;
			if($row=mysql_fetch_array($this->rs,MYSQL_ASSOC))
			{
				return $row;
			}
		}
		return "";
	}
	
	public function QueryAll($strWhere,$fields='*',$order='',$limit='',$table='')
	{
		if($table=="")
		{
			$table=$this->m_sTable;
		}
		$sql="select " . $fields . " from " . $table;
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
		$this->rs=mysql_query($sql) or die('Query failed: ' . mysql_error());
		return $this->rs;
	}
	
	public function QueryRowToArray($strWhere,$fields='*',$order='',$table='')
	{
		if($table=="")
		{
			$table=$this->m_sTable;
		}
		$sql="select " . $fields . " from " . $table;
		if($strWhere!="")
		{
			$sql=$sql." where ".$strWhere;
		}
		if($order!=null)
		{
			$sql=$sql." ".$order;
		}
		$this->rs=mysql_query($sql) or die('Query failed: ' . mysql_error());
		if($this->rs!=null)
		{
			$ary = array();
			$row=null;
			if($row=mysql_fetch_array($this->rs,MYSQL_NUM))
			{
				array_push($ary,$row[0]);
			}
			return $ary;
		}
		return "";
	}
	
	public function QueryAllToArray($strWhere,$fields='*',$order='',$limit='',$table='')
	{
		if($table=="")
		{
			$table=$this->m_sTable;
		}
		$sql="select " . $fields . " from " . $table;
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
		$this->rs=mysql_query($sql) or die('Query failed: ' . mysql_error());
		if($this->rs!=null)
		{
			$ary = array();
			$row=null;
			while($row=mysql_fetch_array($this->rs,MYSQL_NUM))
			{
				array_push($ary,$row);
			}
			return $ary;
		}
		return "";
	}
	
	public function QueryRowToArrayByName($strWhere,$fields='*',$order='',$table='')
	{
		if($table=="")
		{
			$table=$this->m_sTable;
		}		
		$sql="select " . $fields . " from " . $table;
		if($strWhere!="")
		{
			$sql=$sql." where ".$strWhere;
		}
		if($order!=null)
		{
			$sql=$sql." ".$order;
		}
		$this->rs=mysql_query($sql) or die('Query failed: ' . mysql_error());
		if($this->rs!=null)
		{
			$ary = array();
			$row=null;
			while($row=mysql_fetch_array($this->rs,MYSQL_ASSOC))
			{
				array_push($ary,$row);
			}
			return $ary;
		}
		return "";
	}	
	
	public function QueryAllToArrayByName($strWhere,$fields='*',$order='',$limit='',$table='')
	{
		if($table=="")
		{
			$table=$this->m_sTable;
		}		
		$sql="select " . $fields . " from " . $table;
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
		//echoMsg($sql,"sql");
		$this->rs=mysql_query($sql) or die('Query failed: ' . mysql_error());
		if($this->rs!=null)
		{
			$ary = array();
			$row=null;
			while($row=mysql_fetch_array($this->rs,MYSQL_ASSOC))
			{
				array_push($ary,$row);
			}
			return $ary;
		}
		return "";
	}
	
	function SqlAllToArray($sQuery)
	{
		$rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
		if($rs!=null)
		{
			$ary = array();
			$row=null;
			while($row=mysql_fetch_array($rs,MYSQL_NUM))
			{
				array_push($ary,$row);
			}
			mysql_free_result($rs);
			return $ary;
		}
		return "";
	}
	
	function SqlAllToArrayByName($sQuery)
	{
		$rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
		if($rs!=null)
		{
			$ary = array();
			$row=null;
			while($row=mysql_fetch_array($rs,MYSQL_ASSOC))
			{
				array_push($ary,$row);
			}
			mysql_free_result($rs);
			return $ary;
		}
		return "";
	}

	public function SqlRowToArray($sQuery)
	{
		$this->rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
		if($this->rs!=null)
		{
			$ary = array();
			$row=null;
			if($row=mysql_fetch_array($this->rs,MYSQL_NUM))
			{
				return $row;
			}
		}
		return null;
	}
	
	public function SqlRowToArrayByName($sQuery)
	{
		$this->rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
		if($this->rs!=null)
		{
			$ary = array();
			$row=null;
			if($row=mysql_fetch_array($this->rs,MYSQL_ASSOC))
			{
				return $row;
			}
		}
		return null;
	}		
	
	public function AddByArray($data,$retid=true,$debug=false)
	{
		$nRet=0;
		$fields=array_keys($data);
		$values=array_values($data);
		$sql="insert into " . $this->m_sTable . "(";
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
				$sQuery = "select max(" . $this->m_sKeyField . ") from " . $this->m_sTable;
				$this->rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
				$nRet=mysql_result($this->rs,0);
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
	
	public function UpdateByArray($data,$keyValue,$debug=false)
	{
		$fields=array_keys($data);
		$values=array_values($data);
		$sql="update " . $this->m_sTable . " set ";
		$nCount=count($fields);
		for($i=0;$i<$nCount;$i++)
		{
			$field=$fields[$i];
			$value=$values[$i];
			$sql.=$field . "='" . $value . "',";
		}
		$sql=substr($sql,0,strlen($sql)-1);
		$sql.=" where " . $this->m_sKeyField . "='" . $keyValue . "'";
		if($debug)
		{
			echoMsg($sql,"sql");
		}
		return mysql_query($sql);
	}
	
	
	public function Delete($condition='')
	{
		if(is_numeric($condition)) 
		{
			return $this->DeleteByKeyValue($condition);
		}
		$sql="delete from " . $this->m_sTable . " where " . $condition;
		return mysql_query($sql);
	}
	
	public function DeleteByKeyValue($KeyValue)
	{
		$sql="delete from " . $this->m_sTable . " where " . $this->m_sKeyField . "='" . $KeyValue . "'";
		return mysql_query($sql);
	}
	
	public function Execute($sql)
	{
		return mysql_query($sql);
	}
	
	//返回记录数
	public function rowNum($result)
	{
		return mysql_num_rows($result);
	}

}
?>