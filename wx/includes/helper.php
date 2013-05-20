<?php

class StringHelper
{
	//格式数字成指定长度的字符串
	function NumberString($str,$num)
	{
		$sk="";
		$nl=$num-strlen($str);
		if($nl>=0)
		{
			for($i=0;$i<$nl;$i++)
			{
				$sk.="0";
			}
		}
		return $sk . $str;
	}

	//获得流水号，比如订单编号
	//返回long 整型
	function GetLsh()
	{
		$time=time();
		$rand=rand(0,$time);
		$ret=$time . $rand;
		return $ret;
	}
	
	//裁剪指定位置的字符串
	//
	//@access  public
	//
	//@param1  $str		string //待裁剪的字符串
	//@param2  $start   int    //裁剪的起始位置
	//@param3  $length  int    //裁剪的长度
	//
	//@return  string 字符串类型
	function msubstr($str, $start, $length=NULL)
	{
		preg_match_all("/./u", $str, $ar);
		if(func_num_args() >= 3) 
		{
		   $end = func_get_arg(2);
		   return join("",array_slice($ar[0],$start,$end));
		} 
		else 
		{
		   return join("",array_slice($ar[0],$start));
		}
	}
	
	//返回一个指定长度的小字符串，超过的部分用...代替（常用于文章标题）
	//
	//@access  public
	//
	//@param1  $s		string //待裁剪的字符串
	//@param2  $len     int    //裁剪的长度
	//
	//@return  string 字符串类型
	function GetLimitStr($s, $len) 
	{
		$end="...";
    	$result = '';
    	$strLen = strlen($s); 
    	if ($strLen <= $len) 
		{
        	return $s;
    	}
    	$len -= 2;
    	for($i=0; $i<$len && $i<$strLen; $i++)
		{
        	$c = $s[$i];
        	if(ord($c) < 0x80)
			{
            	$result .= $c;
        	}
			elseif($i+1<$len)
			{
            	$result .= $s[$i++] . $s[$i];
        	}
    	}
    	return ($i < $strLen) ? ($result . $end) : $result;
	}
	
	//返回一个指定长度的小字符串（包括汉字功能），超过的部分用...代替（常用于文章标题）
	//
	//@access  public
	//
	//@param1  $s		string //待裁剪的字符串
	//@param2  $len     int    //裁剪的长度
	//
	//@return  string 字符串类型	
	function GetLimitStr1($string, $length, $etc = '...')
	{
		$result = '';
		$string = html_entity_decode(trim(strip_tags($string)), ENT_QUOTES, 'utf-8');
		for($i = 0, $j = 0; $i < strlen($string); $i++)
		{
			if($j >= $length)
			{
				for($x = 0, $y = 0; $x < strlen($etc); $x++)
				{
			  		if($number = strpos(str_pad(decbin(ord(substr($string, $i, 1))), 8, '0', STR_PAD_LEFT), '0'))
			  		{
						$x += $number - 1;
						$y++;
			  		}
			  		else
			  		{
						$y += 0.5;
			  		}
				}
				$length -= $y;
				break;
			}
			if($number = strpos(str_pad(decbin(ord(substr($string, $i, 1))), 8, '0', STR_PAD_LEFT), '0'))
			{
				$i += $number - 1;
				$j++;
			}
			else
			{
				$j += 0.5;
			}
		}
		for($i = 0; (($i < strlen($string)) && ($length > 0)); $i++)
		{
			if($number = strpos(str_pad(decbin(ord(substr($string, $i, 1))), 8, '0', STR_PAD_LEFT), '0'))
			{
				if($length < 1.0)
				{
			  		break;
				}
				$result .= substr($string, $i, $number);
				$length -= 1.0;
				$i += $number - 1;
			}
			else
			{
				$result .= substr($string, $i, 1);
				$length -= 0.5;
			}
	  	}
		$result = htmlentities($result, ENT_QUOTES, 'utf-8');
		if($i < strlen($string))
	  	{
			$result .= $etc;
	  	}
		return $result;
	}
	
	//获取字符串左边的内容
	//
	//@access  public
	//
	//@param1  $str		string //待裁剪的字符串
	//@param2  $sSep    用于分割的字符串
	//
	//@return  string 字符串类型	
	function GetStrLeft($str,$sSep)
	{
		$sRet="";
		$nPos=strpos($str,$sSep);
		if($nPos>=0)
		{
			$sRet=substr($str,0,$nPos);
		}
		return $sRet;
	}
	
	//获取字符串右边的内容
	//
	//@access  public
	//
	//@param1  $str		string //待裁剪的字符串
	//@param2  $sSep    用于分割的字符串
	//
	//@return  string 字符串类型
	function GetStrRight($str,$sSep)
	{
		$sRet="";
		$nPos=strpos($str,$sSep);
		if($nPos>0)
		{
			$sRet=substr($str,$nPos+1,strlen($str)-($nPos+1));
		}
		return $sRet;
	}
	
	//替换<br>标签
	//
	//@access  public
	//
	//@param1  $text	string //待替换的字符串
	//
	//@return  string 字符串类型	
	function br2nl($text)
	{
    	return preg_replace('/<br\\s*?\/??>/i', '', $text);
	}
	
	//转义字符串中的html标记，用于获取fckedit等在线编辑器的内容
	//
	//@access  public
	//
	//@param1  $content	string //待转义的字符串
	//
	//@return  string 字符串类型
	function SetContent($content)
	{
		$content=htmlspecialchars($content);
		if(!get_magic_quotes_gpc())
		{
			$content=addslashes($content);
		}
		return $content;
	}
	
	//还原字符串中的html标记
	//
	//@access  public
	//
	//@param1  $content	string //待还原的字符串
	//
	//@return  string 字符串类型	
	function GetContent($content,$length=0)
	{
		if(!get_magic_quotes_gpc())
		{
			$content=stripslashes($content);
		}
		$content=htmlspecialchars_decode($content);
		if($length>0)
		{
			$content=substr($content,0,$length);
		}
		return $content;
	}	
	
	//把字符串中的html标记清除后，返回指定长度的纯文本，用于生成一段文章的摘要
	//
	//@access  public
	//
	//@param1  $content	string //待还原的字符串
	//@param2  $length  int    //字符串长度
	//
	//@return  string 字符串类型		
	function GetContentToText($content,$length=0)
	{
		if(!get_magic_quotes_gpc())
		{
			$content=stripslashes($content);
		}
		$content=htmlspecialchars_decode($content);
		$content=strip_tags($content,"<a> <b> <img>");
		if($length>0)
		{
			$content=substr($content,0,$length);
		}
		return $content;
	}
	
	//获取TextArea中的内容
	function FromTextArea($content)
	{
		return addslashes(nl2br($content));
	}

	//设置内容到TextArea中
	function ToTextArea($content)
	{
		$content=stripslashes($content);
		return $content;
	}
	
	//把mysql的数据类型转换为C#的数据类型
	function MysqlDbTypeToCsType($dbType)
	{
		$dbType=trim($dbType);
		$sRet="string";
		switch ($dbType)
		{
			case "varchar":
			case "text":
			case "timestamp":
			case "time":
			case "year":
			case "char":
			case "tinytext":
			case "mediumtext":
			case "longtext":
				$sRet = "string";
				break;
			case "date":
			case "datetime":
				$sRet = "DateTime";
				break;
			case "bit":
			case "bool":
				$sRet = "bool";
				break;
			case "tinyint":
			case "smallint":
			case "mediumint":
			case "int":
			case "bigint":
				$sRet = "int";
				break;
			case "float":
				$sRet = "float";
				break;
			case "double":
			case "decimal":
				$sRet = "double";
				break;
			case "image":
			case "tinyblob":
			case "blob":
			case "mediumblob":
			case "longblob":
			case "binary":
			case "varbinary":
				$sRet = "byte[]";
				break;
		}
		return $sRet;
	}
}

class TimeHelper
{
	//获取当日的零点时间
	//返回long整型
	function GetToday0()
	{
		$date_time_array = getdate();
		$month = $date_time_array["mon"];
		$day = $date_time_array["mday"];
		$year = $date_time_array["year"];
		// 用mktime()函数重新产生Unix时间戳值
		$timestamp = mktime(0,0,0,$month,$day,$year);
		return $timestamp;
	}
	
	//获取当日日期
	//返回string 字符串类型
	function GetToday0ToString()
	{
		return date("Ymd",time());
	}
	
	//获取今天+next日的时间戳
	//返回long 整型
	function GetDateAdd($next)
	{
		$date_time_array = getdate();
		$month = $date_time_array["mon"];
		$day = $date_time_array["mday"] + $next;
		$year = $date_time_array["year"];
		// 用mktime()函数重新产生Unix时间戳值
		$timestamp = mktime(0,0,0,$month,$day,$year);
		return $timestamp;
	}
	
	//返回现在的时间距离发布时间过去了多少时间
	//比如发布时间是2009-12-11 12:10:00
	//    当前日期是2009-12-11  14:00:01
	//运算结果是过去了1小时50分01秒，结果放在数组里 
	//返回Array数组
	function GetPastTime($a,$b)
	{
		$c=$a-$b;
		$timeDiff["day"]=intval($c/86400);
		$c=$c-$timeDiff["day"] * 86400;
		$timeDiff["hour"]=intval($c/3600);
		$c=$c-$timeDiff["hour"] * 3600;
		$timeDiff["second"]=intval($c/60);
		return $timeDiff;
	}
	
	//返回现在的时间距离发布时间过去了多少时间
	//返回string 字符串类型
	function GetPastTimeString($a,$b)
	{
		$ret="";
		$timeDiff=TimeHelper::GetPastTime($a,$b);
		if($timeDiff["day"]>0)
		{
			$ret=$timeDiff["day"] . "天";
		}
		else if($timeDiff["hour"]>0)
		{
			$ret.=$timeDiff["hour"] . "小时";
		}
		else if($timeDiff["second"]>0)
		{
			$ret.=$timeDiff["second"] . "分钟前";
		}
		if($ret=="")
		{
			$ret="刚发布";
		}
		return $ret;
	}

	//返回现在的时间距离发布时间过去了多少时间(英文版)
	//返回string 字符串类型
	function GetPastTimeString_en($a,$b)
	{
		$ret="";
		$timeDiff=TimeHelper::GetPastTime($a,$b);
		if($timeDiff["day"]>0)
		{
			$ret="before&nbsp;" . $timeDiff["day"] . "&nbsp;days";
		}
		else if($timeDiff["hour"]>0)
		{
			$ret.="before&nbsp;" . $timeDiff["hour"] . "&nbsp;hours";
		}
		else if($timeDiff["second"]>0)
		{
			$ret.="before&nbsp;" . $timeDiff["second"] . "&nbsp;seconds";
		}
		if($ret=="")
		{
			$ret="just comment";
		}
		return $ret;
	}
	
	//转换日期格式化字符串从Javascript形式到Php形式
	//返回类型string 字符串类型
	function ConvertDateFormatJsToPhp($format)
	{
		$ret="";
		if($format=="yyyy-mm-dd HH:MM:ss")
		{
			$ret="Y-m-d H:i:s";
		}
		else if($format=="yyyy-mm-dd")
		{
			$ret="Y-m-d";
		}
		else if($format=="HH:MM:ss")
		{
			$ret="H:i:s";
		}
		return $ret;
	}
	
	//转换日期格式化字符串从Php形式到Javascript形式
	//返回类型string 字符串类型
	function ConvertDateFormatPhpToJs($format)
	{
		$ret="";
		if($format=="Y-m-d H:i:s")
		{
			$ret="yyyy-mm-dd HH:MM:ss";
		}
		else if($format=="Y-m-d")
		{
			$ret="yyyy-mm-dd";
		}
		else if($format=="H:i:s")
		{
			$ret="HH:MM:ss";
		}
		return $ret;
	}	
	
	/**
 	* 获得当前格林威治时间的时间戳
 	*
 	* @return  integer
 	*/
	function gmtime()
	{
	    return (time() - date('Z'));
	}
	
	/**
 	* 获得服务器的时区
 	*
 	* @return  integer
 	*/
	function server_timezone()
	{
    	if (function_exists('date_default_timezone_get'))
    	{
        	return date_default_timezone_get();
    	}
    	else
    	{
        	return date('Z') / 3600;
    	}
	}

	/**
	 *  生成一个用户自定义时区日期的GMT时间戳
	 *
	 * @access  public
	 * @param   int     $hour
	 * @param   int     $minute
	 * @param   int     $second
	 * @param   int     $month
	 * @param   int     $day
	 * @param   int     $year
	 *
	 * @return void
	 */
	function local_mktime($hour = NULL , $minute= NULL, $second = NULL,  $month = NULL,  $day = NULL,  $year = NULL)
	{
		$timezone = isset($_SESSION['timezone']) ? $_SESSION['timezone'] : $GLOBALS['_CFG']['timezone'];
	
		/**
		* $time = mktime($hour, $minute, $second, $month, $day, $year) - date('Z') + (date('Z') - $timezone * 3600)
		* 先用mktime生成时间戳，再减去date('Z')转换为GMT时间，然后修正为用户自定义时间。以下是化简后结果
		**/
		$time = mktime($hour, $minute, $second, $month, $day, $year) - $timezone * 3600;
	
		return $time;
	}
	
	/**
	 * 将GMT时间戳格式化为用户自定义时区日期
	 *
	 * @param  string       $format
	 * @param  integer      $time       该参数必须是一个GMT的时间戳
	 *
	 * @return  string
	 */
	
	function local_date($format, $time = NULL)
	{
		/* 现在暂时还没有用户自定义时区的功能，所有的时区都跟着商城的设置走 */
		$timezone = Conf::get('time_zone');
	
		if ($time === NULL)
		{
			$time = gmtime();
		}
		elseif ($time <= 0)
		{
			return '';
		}
	
		$time += ($timezone * 3600);
	
		return date($format, $time);
	}
	
	/**
	 * 遍历指定数组中的时间并将其格式化
	 *
	 * @param   array   $item
	 * @param   string  $key
	 * @param   string  $format
	 *
	 * @return  mix
	 */
	function deep_local_date(&$arr, $key, $format)
	{
		$func = create_function('&$arr', '$arr[\'' .$key. '\'] = $arr[\'' .$key. '\'] > 0 ? local_date(\'' .$format. '\', $arr[\'' .$key. '\']) : \'N/A\';');
		array_walk($arr, $func);
	
		return $arr;
	}
	
	/**
	 * 转换字符串形式的时间表达式为GMT时间戳
	 *
	 * @param   string  $str
	 *
	 * @return  integer
	 */
	function gmstr2time($str)
	{
		$time = strtotime($str);
	
		if ($time > 0)
		{
			$time -= date('Z');
		}
	
		return $time;
	}
	
	/**
	 *  将一个用户自定义时区的日期转为GMT时间戳
	 *
	 * @access  public
	 * @param   string      $str
	 *
	 * @return  integer
	 */
	function local_strtotime($str)
	{
		$timezone = isset($_SESSION['timezone']) ? $_SESSION['timezone'] : $GLOBALS['_CFG']['timezone'];
	
		/**
		* $time = mktime($hour, $minute, $second, $month, $day, $year) - date('Z') + (date('Z') - $timezone * 3600)
		* 先用mktime生成时间戳，再减去date('Z')转换为GMT时间，然后修正为用户自定义时间。以下是化简后结果
		**/
		$time = strtotime($str) - $timezone * 3600;
	
		return $time;
	
	}
	
	/**
	 * 获得用户所在时区指定的时间戳
	 *
	 * @param   $timestamp  integer     该时间戳必须是一个服务器本地的时间戳
	 *
	 * @return  array
	 */
	function local_gettime($timestamp = NULL)
	{
		$tmp = local_getdate($timestamp);
		return $tmp[0];
	}
	
	/**
	 * 获得用户所在时区指定的日期和时间信息
	 *
	 * @param   $timestamp  integer     该时间戳必须是一个服务器本地的时间戳
	 *
	 * @return  array
	 */
	function local_getdate($timestamp = NULL)
	{
		$timezone = isset($_SESSION['timezone']) ? $_SESSION['timezone'] : $GLOBALS['_CFG']['timezone'];
	
		/* 如果时间戳为空，则获得服务器的当前时间 */
		if ($timestamp === NULL)
		{
			$timestamp = time();
		}
	
		$gmt        = $timestamp - date('Z');       // 得到该时间的格林威治时间
		$local_time = $gmt + ($timezone * 3600);    // 转换为用户所在时区的时间戳
	
		return getdate($local_time);
	}
	
	
}




?>