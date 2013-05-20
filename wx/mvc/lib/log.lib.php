<?php

class Log {

	protected $_log_path;
	protected $_threshold	= 4;
	protected $_date_fmt	= 'Y-m-d H:i:s';
	protected $_enabled	= TRUE;
	protected $_levels	= array('ERROR' => '1', 'DEBUG' => '2',  'INFO' => '3', 'ALL' => '4');

	//构造函数
	public function __construct()
	{
		$config = array(
			"log_path"=>ROOT_PATH . "/logs",
			"log_threshold"=>4,
			"log_date_format"=>"",
		);
		$this->_log_path = ($config['log_path'] != '') ? $config['log_path'] : APPPATH.'logs/';
		
		if ( ! is_dir($this->_log_path) OR ! is_really_writable($this->_log_path))
		{
			$this->_enabled = FALSE;
		}

		if (is_numeric($config['log_threshold']))
		{
			$this->_threshold = $config['log_threshold'];
		}

		if ($config['log_date_format'] != '')
		{
			$this->_date_fmt = $config['log_date_format'];
		}
	}
	
	function object_to_array($obj,$tab=1)
	{
		$_arr = is_object($obj) ? get_object_vars($obj) : $obj;
		foreach ($_arr as $key => $val)
		{
			for($i=0;$i<$tab;$i++)
			{
				$str.="\t";
			}			
			$val = is_object($val) ? $this->object_to_array($val) : $val;
			$arr[$key] = $val;
		}
		return $arr;
	}
	
	function array_to_text($data,$tab=1)
	{
		$str="";
		foreach($data as $k => $v)
		{
			if(is_array($v))
			{
				for($i=0;$i<$tab;$i++)
				{
					$str.="\t";
				}
				$str.=$k.":" . $this->array_to_text($v,$tab+1);
			}
			else
			{
				for($i=0;$i<$tab;$i++)
				{
					$str.="\t";
				}				
				$str .= $k." : ".$v."\n";
			}
		}
		return $str;
	}

	// --------------------------------------------------------------------

	/**
	 * 写入日志文件
	 *
	 * @param	string	错误级别
	 * @param	string	错误消息
	 * @param	bool	错误是否是原生的PHP错误
	 * @return	bool
	 */
	public function write_log($level = 'ERROR', $msg, $php_error = FALSE)
	{
		if ($this->_enabled === FALSE)
		{
			return FALSE;
		}

		$level = strtoupper($level);

		if ( ! isset($this->_levels[$level]) OR ($this->_levels[$level] > $this->_threshold))
		{
			return FALSE;
		}

		$filepath = $this->_log_path.'/log-'.date('Y-m-d') . ".txt";
		$message  = '';

		if ( ! file_exists($filepath))
		{
			$message .= "<"."?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed'); ?".">\n\n";
		}

		if ( ! $fp = @fopen($filepath, FOPEN_WRITE_CREATE))
		{
			return FALSE;
		}

		$data=$msg;
		if(is_object($data))
		{
			$data=$this->object_to_array($data);
		}

		if(is_array($data))
		{
			$message.=$level.' '.(($level == 'INFO') ? ' -' : '-').' '.date($this->_date_fmt). ' --> Array(\n';
			$message.=$this->array_to_text($data);
			$message.="}\n\n\n\n";
		}
		else
		{
			$message .= $level.' '.(($level == 'INFO') ? ' -' : '-').' '.date($this->_date_fmt). ' --> '.$data."\n\n\n\n";
		}

		flock($fp, LOCK_EX);
		fwrite($fp, $message);
		flock($fp, LOCK_UN);
		fclose($fp);

		@chmod($filepath, FILE_WRITE_MODE);
		return TRUE;
	}

}

?>