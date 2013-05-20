<?php

function addslashes_all($arr)
{
	if(is_array($arr))
	{
		foreach($arr as $key=>$val)
		{
			if(is_array($val))
			{
				$arr[$key]=addslashes_all($val);
			}
			else
			{
				$arr[$key]=addslashes($val);
			}
		}
	}
	else
	{
		$arr=addslashes($val);			
	}
	return $arr;
}

function Res2Xml($res)
{ 
	$xml  = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	$xml .= "<service version=\"1.0\">\n";
	foreach($res as $val)
	{
		$xml .= "    <DataRow>\n";
		foreach ($val as $key => $value)
		{
			$xml .= "        <{$key}>".utf8_encode($value)."</{$key}>\n";
		}
        $xml .= "    </DataRow>\n";
    }
    $xml .= "</service>\n";
    return $xml;
}

function GetLsh()
{
	$time=time();
	$rand=rand(0,$time);
	$ret=$time . $rand;
	return $ret;
}

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

function msubstr1($s, $len) 
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

function msubstr2($string, $length, $etc = '...')
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

function GetIP()
{
	return GetClientIP();
}

function GetClientIP()
{
	$ip="";
	if(isset($HTTP_SERVER_VARS["HTTP_X_FORWARDED_FOR"]))
	{
		$ip = $HTTP_SERVER_VARS["HTTP_X_FORWARDED_FOR"];
	}
	elseif(isset($HTTP_SERVER_VARS["HTTP_CLIENT_IP"]))
	{
		$ip = $HTTP_SERVER_VARS["HTTP_CLIENT_IP"]; 
	}
	elseif(isset($HTTP_SERVER_VARS["REMOTE_ADDR"])) 
	{
		$ip = $HTTP_SERVER_VARS["REMOTE_ADDR"];
	}
	elseif(getenv("HTTP_X_FORWARDED_FOR"))
	{
		$ip = getenv("HTTP_X_FORWARDED_FOR"); 
	} 
	elseif (getenv("HTTP_CLIENT_IP")) 
	{ 
		$ip = getenv("HTTP_CLIENT_IP");
	}
	elseif (getenv("REMOTE_ADDR"))
	{
		$ip = getenv("REMOTE_ADDR");
	}
	else 
	{ 
		$ip = "Unknown";
	}
	return $ip;
}

function GetMaskIP($ip)
{
	$ary=explode(".", $ip);
	return $ary[0] . "." . $ary[1] . ".*.*";
}

function RealUrl($subject_url,$replace_url)        
{
    $urls = parse_url($subject_url);
    $pnum = substr_count($replace_url,'../');
    if(substr($replace_url,0,1) == '/')
	{
        $replace_url = 'http://'.$urls['host'].$replace_url;
	}
    else if(substr($replace_url,0,2) == './')
	{
        $replace_url = dirname($subject_url).substr($replace_url,1);
    }
    if($pnum>0)
    {
        for($i=0;$i<($pnum+1);$i++)
        {
            $subject_url = dirname($subject_url);
        }
        $replace_url = str_replace('../','',$replace_url);
        $replace_url = $subject_url.'/'.$replace_url;
    }
    return $replace_url;
}

function RealFilePath($url)        
{
	$root_path = str_replace('/includes/public.php', '', str_replace('\\', '/', __FILE__));
	return $root_path . $url;
}

function RealPathA($subject_path,$replace_url)        
{
	$basePath=dirname($_SERVER['SCRIPT_FILENAME']);	
    $pnum = substr_count($replace_url,'../');
    if(substr($replace_url,0,1) == '/')
	{
        $replace_url = $basePath . $replace_url;
	}
    else if(substr($replace_url,0,2) == './')
	{
        $replace_url = dirname($subject_url).substr($replace_url,1);
    }
    if($pnum>0)
    {
        for($i=0;$i<($pnum+1);$i++)
        {
            $subject_url = dirname($subject_url);
        }
        $replace_url = str_replace('../','',$replace_url);
        $replace_url = $subject_url.'/'.$replace_url;
    }
    return $replace_url;
}

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

function GetStrLeft1($str,$sSep)
{
	$sRet=$str;
	$nPos=strpos($str,$sSep);
	if($nPos>=0)
	{
		$sRet=substr($str,0,$nPos);
	}
	return $sRet;
}

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

function GetValue($obj)
{
	$ret=0;
	if($obj!="")
	{
		$ret=$obj;
	}
	return $ret;
}

function G($keyName)
{
	$ret="";
	if(isset($_GET[$keyName]))
	{
		$ret=$_GET[$keyName];
	}
	return $ret;
}

function G2Int($keyName)
{
	$ret=0;
	if(isset($_GET[$keyName]))
	{
		$ret=$_GET[$keyName];
	}
	return $ret;
}

function P_CheckBox($keyName)
{
	$ret=0;
	if(isset($_POST[$keyName]))
	{
		if($_POST[$keyName]=="on")
		{
			$ret=1;
		}
	}		
	return $ret;
}

function P($keyName)
{
    $ret = "";
    if(isset($_POST[$keyName]))
    {
        $ret = $_POST[$keyName];
    }
    return $ret;
}

function P2Int($keyName)
{
	$ret=0;
	if(isset($_POST[$keyName]))
	{
		$ret=$_POST[$keyName];
	}
	if($ret=="")
	{
		$ret=0;
	}
	return $ret;
}

function POST2Int($keyName)
{
	$ret=0;
	if(isset($_POST[$keyName]))
	{
		$ret=$_POST[$keyName];
	}
	if($ret=="")
	{
		$ret=0;
	}
	return $ret;
}

function S($keyName)
{
    $ret = "";
    if(isset($_SESSION[$keyName]))
    {
        $ret = $_SESSION[$keyName];
    }
    return $ret;
}
function S2Int($keyName)
{
    $ret = 0;
    if(isset($_SESSION[$keyName]))
    {
        $ret = $_SESSION[$keyName];
    }
    if($ret == "")
    {
        $ret = 0;
    }
    return $ret;
}

function br2nl($text)
{
    return preg_replace('/<br\\s*?\/??>/i', '', $text);
}

function echoMsg($msg,$name="")
{
	if($name=="")
	{
		echo $msg . "<br />\n";
	}
	else
	{
		echo $name . "=" . $msg . "<br />\n";
	}
}

function gotoUrl($url)
{
	echo "<script>window.location='" . $url . "';</script>";
}

function ToContent($content)
{
	$content=htmlspecialchars($content);
	if(!get_magic_quotes_gpc())
   	{
		$content=addslashes($content);
   	}
	return $content;
}

function SetContent($content)
{
	return ToContent($content);
}

function ReContent($content,$length=0)
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

function GetContent($content,$length=0)
{
	return ReContent($content,$length);
}

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

function GetContent1($content)
{
	$content=stripslashes($content);
	$content=br2nl($content);
	return $content;
}

function ToText($content)
{
	return addslashes(nl2br($content));
}

function ReText($content)
{
	$content=stripslashes($content);
//	$content=br2nl($content);
	return $content;
}

function GetTodayTime()
{
	$date_time_array = getdate();
	$month = $date_time_array["mon"];
	$day = $date_time_array["mday"];
	$year = $date_time_array["year"];
	// 用mktime()函数重新产生Unix时间戳值
	$timestamp = mktime(0,0,0,$month,$day,$year);
	return $timestamp;
}

function GetCurHourTime()
{
	$date_time_array = getdate();
	$month = $date_time_array["mon"];
	$day = $date_time_array["mday"];
	$year = $date_time_array["year"];
	$hours = $date_time_array["hours"];
	// 用mktime()函数重新产生Unix时间戳值
	$timestamp = mktime($hours,0,0,$month,$day,$year);	
	return $timestamp;
}

function GetTodayTimeToString()
{
	$date_time_array = getdate();
	$month = NumberString($date_time_array["mon"],2);
	$day = NumberString($date_time_array["mday"],2);
	$year = NumberString($date_time_array["year"],2);
	$time=$year . $month . $day;
	return $time;
}

function GetNextTime($next)
{
	$date_time_array = getdate();
	$month = $date_time_array["mon"];
	$day = $date_time_array["mday"] + $next;
	$year = $date_time_array["year"];
	// 用mktime()函数重新产生Unix时间戳值
	$timestamp = mktime(0,0,0,$month,$day,$year);
	return $timestamp;
}

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

function GetPastTimeString($a,$b)
{
	$ret="";
	$timeDiff=GetPastTime($a,$b);
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

function GetPastTimeString_en($a,$b)
{
	$ret="";
	$timeDiff=GetPastTime($a,$b);
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

function GetTimeString($b)
{
	$ret="";
	$a=time();
	$timeDiff=GetPastTime($a,$b);
	if($timeDiff["second"]==0 && $timeDiff["hour"]==0 && $timeDiff["day"]==0)
	{
		$c=$a-$b;
		//多少秒前
		$ret=$c . "秒前";
	}
	else if($timeDiff["hour"]==0 && $timeDiff["day"]==0)
	{
		//多少分钟前
		$ret=$timeDiff["second"] . "分钟前";
	}
	else if($timeDiff["day"]==0)
	{
		//今天的几点几分
		$ret="今天" . date("H:i",$b);
	}
	else
	{
		//某年的某月的某日
		$b_date=(int)substr(date("Y-m-d",$b),0,4);
		$b_now=(int)substr(date("Y-m-d",$a),0,4);
		if($b_date==$b_now)
		{
			//同一年的
			$ret=date("m月d日 H:i",$b);
		}
		else
		{
			//不是同一年的
			$ret=date("Y年m月d日 H:i",$b);
		}
	}
	return $ret;
}

function GetTimeString1($b)
{
	$ret="";
	$a=time();
	$timeDiff=GetPastTime($a,$b);
	if($timeDiff["second"]==0 && $timeDiff["hour"]==0 && $timeDiff["day"]==0)
	{
		$ret.=date("H:i",$b);
	}
	else if($timeDiff["hour"]==0 && $timeDiff["day"]==0)
	{
		//多少分钟前
		$ret.=date("H:i",$b);
	}
	else if($timeDiff["day"]==0)
	{
		//今天的几点几分
		$ret.=date("H:i",$b);
	}
	else
	{
		//某年的某月的某日
		$b_date=(int)substr(date("Y-m-d",$b),0,4);
		$b_now=(int)substr(date("Y-m-d",$a),0,4);
		if($b_date==$b_now)
		{
			//同一年的
			$ret=date("m月d日",$b);
		}
		else
		{
			//不是同一年的
			$ret=date("Y年m月d日",$b);
		}
	}
	return $ret;
}

function GetTimeString2($b)
{
	$ret="";
	$a=time();
	$timeDiff=GetPastTime($a,$b);
	if($timeDiff["second"]==0 && $timeDiff["hour"]==0 && $timeDiff["day"]==0)
	{
		$ret.=date("今天 H:i",$b);
	}
	else if($timeDiff["hour"]==0 && $timeDiff["day"]==0)
	{
		//多少分钟前
		$ret.=date("今天 H:i",$b);
	}
	else if($timeDiff["day"]==0)
	{
		//今天的几点几分
		$ret.=date("今天 H:i",$b);
	}
	else
	{
		//某年的某月的某日
		$b_date=(int)substr(date("Y-m-d",$b),0,4);
		$b_now=(int)substr(date("Y-m-d",$a),0,4);
		if($b_date==$b_now)
		{
			//同一年的
			$ret=date("m月d日 H:i",$b);
		}
		else
		{
			//不是同一年的
			$ret=date("Y年m月d日 H:i",$b);
		}
	}
	return $ret;
}

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

function QueryAll($sQuery)
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
	
function QueryAll1($sQuery)
{
	$rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
	if($rs!=null)
	{
		$ary = array();
		$row=null;
		while($row=mysql_fetch_array($this->rs,MYSQL_NUM))
		{
			array_push($ary,$row);
		}
		mysql_free_result($rs);
		return $ary;
	}
	return "";
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

function QueryOne($sQuery)
{
	$rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
	if($rs!=null)
	{
		$row=null;
		if($row=mysql_fetch_array($rs,MYSQL_ASSOC))
		{
			return $row;
		}
	}
	return "";
}

function QueryOneToArray($sQuery)
{
	$rs=mysql_query($sQuery) or die('Query failed: ' . mysql_error());
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

function GetKeywordsHtml($keywords)
{
	$keyHtml="";
	$aryKey=split(",",$keywords);
	foreach($aryKey as $key)
	{
		$keyHtml.="<a href='/search.php?k=" . urlencode($key) . "' target='_blank'>" . $key . "</a>&nbsp;";
	}
	return $keyHtml;
}

function GetFileName($path)
{
	if($path=="")
	{
		return "";
	}
	
	$arr = explode('/',$path);
	$filename= $arr[count($arr)-1];
	return $filename;
}

function GetDir($path)
{
	if($path=="")
	{
		return "";
	}
	$pos=strrpos($path,"/");
	if($pos>-1)
	{
		return substr($path,0,$pos);
	}
}

function makeDir($dir, $mode=0777)
{
	if(!$dir)
		return 0;
	$dir=str_replace( "\\", "/", $dir );
	$mdir="";
	foreach(explode("/", $dir) as $val)
	{
		$mdir.= $val."/";
		if($val==".." || $val=="." )
		{
			continue;
		}
		if(is_dir($mdir)==0)
		{
			if(!@mkdir($mdir,$mode))
			{
				echo "创建目录 [".$mdir."]失败.";
				//exit;
			}
		}
	}
	return true;
}

function removeDir($dir)
{
    $dir = str_replace(array('..', "\n", "\r"), array('', '', ''), $dir);
    $ret_val = false;
    if (is_dir($dir))
    {
        $d = @dir($dir);
        if($d)
        {
            while (false !== ($entry = $d->read()))
            {
               if($entry!='.' && $entry!='..')
               {
                   $entry = $dir.'/'.$entry;
                   if(is_dir($entry))
                   {
                       removeDir($entry);
                   }
                   else
                   {
                       @unlink($entry);
                   }
               }
            }
            $d->close();
            $ret_val = rmdir($dir);
         }
    }
    else
    {
        $ret_val = unlink($dir);
    }
    return $ret_val;
}

function GetImageFileTypeName($type)
{
	$ret="";
	$type=strtolower($type);
	if($type=="image/gif")
	{
		$ret = ".gif";
	}
	else if($type=="image/png")
	{
		$ret = ".png";
	}
	else if($type=="image/jpeg" || $type=="image/pjpeg")
	{
		$ret = ".jpg";
	}
	return $ret;
}

function GetFileTypeName($filestr)
{
	$suffixarray=explode(".",$filestr);
	$suffixarray=array_reverse($suffixarray);
	return $suffixarray[0];
}

function GetImageTypeName($src_file)
{
	$ext="";
	// 图像类型
	if(!file_exists($src_file))
	{
		return $ext;
	}
	$type=exif_imagetype($src_file);
	$support_type=array(IMAGETYPE_JPEG , IMAGETYPE_PNG , IMAGETYPE_GIF);
	if(!in_array($type, $support_type,true))
	{
		return "";
	}	
	//Load image
	switch($type)
	{
		case IMAGETYPE_JPEG :
			$ext="jpg";
			break;
		case IMAGETYPE_PNG :
			$ext="png";
			break;
		case IMAGETYPE_GIF :
			$ext="gif";
			break;
		default:
			return "";
	}
	return $ext;
}

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

function in_array_key($key, $array, $value = false)
{
   while(list($k, $v) = each($array))
   {
       if($key == $k)
       {
           if($value && $value == $v)
               return true;
           elseif($value && $value != $v)
               return false;
           else
               return true;
       }
   }
   return false;
}

//获取界面搜索控件的值与来自url的$_GET值
//$ControlName  界面控件名称
//$GetParaName  $_GET参数的名称
//$isString     是否字符串类型
function GetSearchParam($ControlName,$GetParaName,$isString=false)
{
	$value=trim($_POST[$ControlName]);
	if($value=="")
	{
		$value=G($GetParaName);
		if($isString)
		{
			$value=urldecode($value);
		}
	}
	return $value;
}

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
            $sRet = "int";
            break;
        case "bigint":
			$sRet = "long";
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

function GetFieldTypeForCs($Field,$aryColumns)
{
	$php_type="";
	$type="string";
	foreach($aryColumns as $row)
	{
		if($row["Field"]==$Field)
		{
			$php_type=$row["Type"];
			$type=MysqlDbTypeToCsType(GetStrLeft($php_type,"("));
			break;
		}
	}
	return $type;
}

//把php的数组转换成js的数组
function phparr_to_jsarr($phparr,$jsarrname="")
{
	$str = "new Array(";
	$str = $jsarrname=="" ? $str : "$jsarrname = ".$str;
	$len = count($phparr);
	$i = 0;
	while(list($a,$b)=each($phparr))
	{
		$str .= $i++>0 ? "," : "";
		$str .= is_array($b) ? phparr_to_jsarr( $b ) : "\"".str_replace("\"","\\\"",str_replace("\\","\\\\",$b))."\"";
	}
	$str .=")";
	$str = $jsarrname=="" ? $str : $str.";";
	return $str;
}

function GetNl()
{
	$everymonth=array(
                    0=>array(8,0,0,0,0,0,0,0,0,0,0,0,29,30,7,1),
                    1=>array(0,29,30,29,29,30,29,30,29,30,30,30,29,0,8,2),
                    2=>array(0,30,29,30,29,29,30,29,30,29,30,30,30,0,9,3),
                    3=>array(5,29,30,29,30,29,29,30,29,29,30,30,29,30,10,4),
                    4=>array(0,30,30,29,30,29,29,30,29,29,30,30,29,0,1,5),
                    5=>array(0,30,30,29,30,30,29,29,30,29,30,29,30,0,2,6),
                    6=>array(4,29,30,30,29,30,29,30,29,30,29,30,29,30,3,7),
                    7=>array(0,29,30,29,30,29,30,30,29,30,29,30,29,0,4,8),
                    8=>array(0,30,29,29,30,30,29,30,29,30,30,29,30,0,5,9),
                    9=>array(2,29,30,29,29,30,29,30,29,30,30,30,29,30,6,10),
                    10=>array(0,29,30,29,29,30,29,30,29,30,30,30,29,0,7,11),
                    11=>array(6,30,29,30,29,29,30,29,29,30,30,29,30,30,8,12),
                    12=>array(0,30,29,30,29,29,30,29,29,30,30,29,30,0,9,1),
                    13=>array(0,30,30,29,30,29,29,30,29,29,30,29,30,0,10,2),
                    14=>array(5,30,30,29,30,29,30,29,30,29,30,29,29,30,1,3),
                    15=>array(0,30,29,30,30,29,30,29,30,29,30,29,30,0,2,4),
                    16=>array(0,29,30,29,30,29,30,30,29,30,29,30,29,0,3,5),
                    17=>array(2,30,29,29,30,29,30,30,29,30,30,29,30,29,4,6),
                    18=>array(0,30,29,29,30,29,30,29,30,30,29,30,30,0,5,7),
                    19=>array(7,29,30,29,29,30,29,29,30,30,29,30,30,30,6,8),
                    20=>array(0,29,30,29,29,30,29,29,30,30,29,30,30,0,7,9),
                    21=>array(0,30,29,30,29,29,30,29,29,30,29,30,30,0,8,10),
                    22=>array(5,30,29,30,30,29,29,30,29,29,30,29,30,30,9,11),
                    23=>array(0,29,30,30,29,30,29,30,29,29,30,29,30,0,10,12),
                    24=>array(0,29,30,30,29,30,30,29,30,29,30,29,29,0,1,1),
                    25=>array(4,30,29,30,29,30,30,29,30,30,29,30,29,30,2,2),
                    26=>array(0,29,29,30,29,30,29,30,30,29,30,30,29,0,3,3),
                    27=>array(0,30,29,29,30,29,30,29,30,29,30,30,30,0,4,4),
                    28=>array(2,29,30,29,29,30,29,29,30,29,30,30,30,30,5,5),
                    29=>array(0,29,30,29,29,30,29,29,30,29,30,30,30,0,6,6),
                    30=>array(6,29,30,30,29,29,30,29,29,30,29,30,30,29,7,7),
                    31=>array(0,30,30,29,30,29,30,29,29,30,29,30,29,0,8,8),
                    32=>array(0,30,30,30,29,30,29,30,29,29,30,29,30,0,9,9),
                    33=>array(5,29,30,30,29,30,30,29,30,29,30,29,29,30,10,10),
                    34=>array(0,29,30,29,30,30,29,30,29,30,30,29,30,0,1,11),
                    35=>array(0,29,29,30,29,30,29,30,30,29,30,30,29,0,2,12),
                    36=>array(3,30,29,29,30,29,29,30,30,29,30,30,30,29,3,1),
                    37=>array(0,30,29,29,30,29,29,30,29,30,30,30,29,0,4,2),
                    38=>array(7,30,30,29,29,30,29,29,30,29,30,30,29,30,5,3),
                    39=>array(0,30,30,29,29,30,29,29,30,29,30,29,30,0,6,4),
                    40=>array(0,30,30,29,30,29,30,29,29,30,29,30,29,0,7,5),
                    41=>array(6,30,30,29,30,30,29,30,29,29,30,29,30,29,8,6),
                    42=>array(0,30,29,30,30,29,30,29,30,29,30,29,30,0,9,7),
                    43=>array(0,29,30,29,30,29,30,30,29,30,29,30,29,0,10,8),
                    44=>array(4,30,29,30,29,30,29,30,29,30,30,29,30,30,1,9),
                    45=>array(0,29,29,30,29,29,30,29,30,30,30,29,30,0,2,10),
                    46=>array(0,30,29,29,30,29,29,30,29,30,30,29,30,0,3,11),
                    47=>array(2,30,30,29,29,30,29,29,30,29,30,29,30,30,4,12),
                    48=>array(0,30,29,30,29,30,29,29,30,29,30,29,30,0,5,1),
                    49=>array(7,30,29,30,30,29,30,29,29,30,29,30,29,30,6,2),
                    50=>array(0,29,30,30,29,30,30,29,29,30,29,30,29,0,7,3),
                    51=>array(0,30,29,30,30,29,30,29,30,29,30,29,30,0,8,4),
                    52=>array(5,29,30,29,30,29,30,29,30,30,29,30,29,30,9,5),
                    53=>array(0,29,30,29,29,30,30,29,30,30,29,30,29,0,10,6),
                    54=>array(0,30,29,30,29,29,30,29,30,30,29,30,30,0,1,7),
                    55=>array(3,29,30,29,30,29,29,30,29,30,29,30,30,30,2,8),
                    56=>array(0,29,30,29,30,29,29,30,29,30,29,30,30,0,3,9),
                    57=>array(8,30,29,30,29,30,29,29,30,29,30,29,30,29,4,10),
                    58=>array(0,30,30,30,29,30,29,29,30,29,30,29,30,0,5,11),
                    59=>array(0,29,30,30,29,30,29,30,29,30,29,30,29,0,6,12),
                    60=>array(6,30,29,30,29,30,30,29,30,29,30,29,30,29,7,1),
                    61=>array(0,30,29,30,29,30,29,30,30,29,30,29,30,0,8,2),
                    62=>array(0,29,30,29,29,30,29,30,30,29,30,30,29,0,9,3),
                    63=>array(4,30,29,30,29,29,30,29,30,29,30,30,30,29,10,4),
                    64=>array(0,30,29,30,29,29,30,29,30,29,30,30,30,0,1,5),
                    65=>array(0,29,30,29,30,29,29,30,29,29,30,30,29,0,2,6),
                    66=>array(3,30,30,30,29,30,29,29,30,29,29,30,30,29,3,7),
                    67=>array(0,30,30,29,30,30,29,29,30,29,30,29,30,0,4,8),
                    68=>array(7,29,30,29,30,30,29,30,29,30,29,30,29,30,5,9),
                    69=>array(0,29,30,29,30,29,30,30,29,30,29,30,29,0,6,10),
                    70=>array(0,30,29,29,30,29,30,30,29,30,30,29,30,0,7,11),
                    71=>array(5,29,30,29,29,30,29,30,29,30,30,30,29,30,8,12),
                    72=>array(0,29,30,29,29,30,29,30,29,30,30,29,30,0,9,1),
                    73=>array(0,30,29,30,29,29,30,29,29,30,30,29,30,0,10,2),
                    74=>array(4,30,30,29,30,29,29,30,29,29,30,30,29,30,1,3),
                    75=>array(0,30,30,29,30,29,29,30,29,29,30,29,30,0,2,4),
                    76=>array(8,30,30,29,30,29,30,29,30,29,29,30,29,30,3,5),
                    77=>array(0,30,29,30,30,29,30,29,30,29,30,29,29,0,4,6),
                    78=>array(0,30,29,30,30,29,30,30,29,30,29,30,29,0,5,7),
                    79=>array(6,30,29,29,30,29,30,30,29,30,30,29,30,29,6,8),
                    80=>array(0,30,29,29,30,29,30,29,30,30,29,30,30,0,7,9),
                    81=>array(0,29,30,29,29,30,29,29,30,30,29,30,30,0,8,10),
                    82=>array(4,30,29,30,29,29,30,29,29,30,29,30,30,30,9,11),
                    83=>array(0,30,29,30,29,29,30,29,29,30,29,30,30,0,10,12),
                    84=>array(10,30,29,30,30,29,29,30,29,29,30,29,30,30,1,1),
                    85=>array(0,29,30,30,29,30,29,30,29,29,30,29,30,0,2,2),
                    86=>array(0,29,30,30,29,30,30,29,30,29,30,29,29,0,3,3),
                    87=>array(6,30,29,30,29,30,30,29,30,30,29,30,29,29,4,4),
                    88=>array(0,30,29,30,29,30,29,30,30,29,30,30,29,0,5,5),
                    89=>array(0,30,29,29,30,29,29,30,30,29,30,30,30,0,6,6),
                    90=>array(5,29,30,29,29,30,29,29,30,29,30,30,30,30,7,7),
                    91=>array(0,29,30,29,29,30,29,29,30,29,30,30,30,0,8,8),
                    92=>array(0,29,30,30,29,29,30,29,29,30,29,30,30,0,9,9),
                    93=>array(3,29,30,30,29,30,29,30,29,29,30,29,30,29,10,10),
                    94=>array(0,30,30,30,29,30,29,30,29,29,30,29,30,0,1,11),
                    95=>array(8,29,30,30,29,30,29,30,30,29,29,30,29,30,2,12),
                    96=>array(0,29,30,29,30,30,29,30,29,30,30,29,29,0,3,1),
                    97=>array(0,30,29,30,29,30,29,30,30,29,30,30,29,0,4,2),
                    98=>array(5,30,29,29,30,29,29,30,30,29,30,30,29,30,5,3),
                    99=>array(0,30,29,29,30,29,29,30,29,30,30,30,29,0,6,4),
                    100=>array(0,30,30,29,29,30,29,29,30,29,30,30,29,0,7,5),
                    101=>array(4,30,30,29,30,29,30,29,29,30,29,30,29,30,8,6),
                    102=>array(0,30,30,29,30,29,30,29,29,30,29,30,29,0,9,7),
                    103=>array(0,30,30,29,30,30,29,30,29,29,30,29,30,0,10,8),
                    104=>array(2,29,30,29,30,30,29,30,29,30,29,30,29,30,1,9),
                    105=>array(0,29,30,29,30,29,30,30,29,30,29,30,29,0,2,10),
                    106=>array(7,30,29,30,29,30,29,30,29,30,30,29,30,30,3,11),
                    107=>array(0,29,29,30,29,29,30,29,30,30,30,29,30,0,4,12),
                    108=>array(0,30,29,29,30,29,29,30,29,30,30,29,30,0,5,1),
                    109=>array(5,30,30,29,29,30,29,29,30,29,30,29,30,30,6,2),
                    110=>array(0,30,29,30,29,30,29,29,30,29,30,29,30,0,7,3),
                    111=>array(0,30,29,30,30,29,30,29,29,30,29,30,29,0,8,4),
                    112=>array(4,30,29,30,30,29,30,29,30,29,30,29,30,29,9,5),
                    113=>array(0,30,29,30,29,30,30,29,30,29,30,29,30,0,10,6),
                    114=>array(9,29,30,29,30,29,30,29,30,30,29,30,29,30,1,7),
                    115=>array(0,29,30,29,29,30,29,30,30,30,29,30,29,0,2,8),
                    116=>array(0,30,29,30,29,29,30,29,30,30,29,30,30,0,3,9),
                    117=>array(6,29,30,29,30,29,29,30,29,30,29,30,30,30,4,10),
                    118=>array(0,29,30,29,30,29,29,30,29,30,29,30,30,0,5,11),
                    119=>array(0,30,29,30,29,30,29,29,30,29,29,30,30,0,6,12),
                    120=>array(4,29,30,30,30,29,30,29,29,30,29,30,29,30,7,1)
                   );
##############################
  #农历天干
  $mten=array("null","甲","乙","丙","丁","戊","己","庚","辛","壬","癸");
  #农历地支
  $mtwelve=array("null","子(鼠)","丑(牛)","寅(虎)","卯(兔)","辰(龙)",
                 "巳(蛇)","午(马)","未(羊)","申(猴)","酉(鸡)","戌(狗)","亥(猪)");
  #农历月份
  $mmonth=array("闰","正","二","三","四","五","六",
                "七","八","九","十","十一","十二","月");
  #农历日
  $mday=array("null","初一","初二","初三","初四","初五","初六","初七","初八","初九","初十",
              "十一","十二","十三","十四","十五","十六","十七","十八","十九","二十",
              "廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十");
##############################
  #星期
  $weekday = array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");

  #阳历总天数 至1900年12月21日
  $total=11;
  #阴历总天数
  $mtotal=0;
##############################
  #获得当日日期
  $today=getdate();
  
  if($today["year"]<1901 || $today["year"]>2020) die("年份出错！");

  $cur_wday=$today["wday"];

  for($y=1901;$y<$today["year"];$y++) { //计算到所求日期阳历的总天数-自1900年12月21日始,先算年的和
       $total+=365;
       if ($y%4==0) $total++;
  }

  switch($today["mon"]) { //再加当年的几个月
         case 12:
              $total+=30;
         case 11:
              $total+=31;
         case 10:
              $total+=30;
         case 9:
              $total+=31;
         case 8:
              $total+=31;
         case 7:
              $total+=30;
         case 6:
              $total+=31;
         case 5:
              $total+=30;
         case 4:
              $total+=31;
         case 3:
              $total+=28;
         case 2:
              $total+=31;
  }

  if($today["year"]%4 == 0 && $today["mon"]>2) $total++; //如果当年是闰年还要加一天

  $total=$total+$today["mday"]-1; //加当月的天数

  $flag1=0;  //判断跳出循环的条件
  $j=0;
  while ($j<=120){  //用农历的天数累加来判断是否超过阳历的天数
      $i=1;
      while ($i<=13){
            $mtotal+=$everymonth[$j][$i];
            if ($mtotal>=$total){
                 $flag1=1;
                 break;
            }
            $i++;
      }
      if ($flag1==1) break;
      $j++;
  }

  if($everymonth[$j][0]<>0 and $everymonth[$j][0]<$i){ //原来错在这里，对闰月没有修补
      $mm=$i-1;
  }
  else{
      $mm=$i;
  }

  if($i==$everymonth[$j][0]+1 and $everymonth[$j][0]<>0) {
      $nlmon=$mmonth[0].$mmonth[$mm];#闰月
  }
  else {
      $nlmon=$mmonth[$mm].$mmonth[13];
  }
  #计算所求月份1号的农历日期
  $md=$everymonth[$j][$i]-($mtotal-$total);
  if($md > $everymonth[$j][$i])
      $md-=$everymonth[$j][$i];
  $nlday=$mday[$md];
  return $nlmon.$nlday;
}

function file_ext($filename)
{
    return trim(substr(strrchr($filename, '.'), 1, 10));
}

function CreateSmallImage($src_file, $dst_file , $new_width , $new_height)
{
	if($new_width <1 || $new_height <1)
	{
		echo "params width or height error !<br />\n";
		return;
	}
	if(!file_exists($src_file))
	{
		echo $src_file . " is not exists !<br />\n";
		return;
	}
	
	// 图像类型
	$type=exif_imagetype($src_file);
	$support_type=array(IMAGETYPE_JPEG , IMAGETYPE_PNG , IMAGETYPE_GIF);
	if(!in_array($type, $support_type,true))
	{
		echo "this type of image does not support! only support jpg , gif or png<br />\n";
		return;
	}
	
	//Load image
	switch($type)
	{
		case IMAGETYPE_JPEG :
			$src_img=imagecreatefromjpeg($src_file);
			break;
		case IMAGETYPE_PNG :
			$src_img=imagecreatefrompng($src_file);
			break;
		case IMAGETYPE_GIF :
			$src_img=imagecreatefromgif($src_file);
			break;
		default:
			echo "Load image error!<br />\n";
			return;
	}
	$w=imagesx($src_img);
	$h=imagesy($src_img);
	
	$ratio_w=1.0 * $new_width / $w;
	$ratio_h=1.0 * $new_height / $h;
	$ratio=1.0;
	// 生成的图像的高宽比原来的都小，或都大 ，原则是 取大比例放大，取大比例缩小（缩小的比例就比较小了）
	if(($ratio_w < 1 && $ratio_h < 1) || ($ratio_w > 1 && $ratio_h > 1))
	{
		if($ratio_w < $ratio_h)
		{
			$ratio = $ratio_h ; // 情况一，宽度的比例比高度方向的小，按照高度的比例标准来裁剪或放大
		}
		else
		{
			$ratio = $ratio_w ;
		}
		// 定义一个中间的临时图像，该图像的宽高比 正好满足目标要求
		$inter_w=(int)($new_width / $ratio);
		$inter_h=(int) ($new_height / $ratio);
		$inter_img=imagecreatetruecolor($inter_w , $inter_h);
		imagecopy($inter_img, $src_img, 0,0,0,0,$inter_w,$inter_h);
		// 生成一个以最大边长度为大小的是目标图像$ratio比例的临时图像
		// 定义一个新的图像
		$new_img=imagecreatetruecolor($new_width,$new_height);
		imagecopyresampled($new_img,$inter_img,0,0,0,0,$new_width,$new_height,$inter_w,$inter_h);
		switch($type)
		{
			case IMAGETYPE_JPEG:
				imagejpeg($new_img, $dst_file,100); // 存储图像
				break;
			case IMAGETYPE_PNG:
				imagepng($new_img,$dst_file,100);
				break;
			case IMAGETYPE_GIF:
				imagegif($new_img,$dst_file,100);
				break;
			default:
				break;
		}
	}// end if 1
	// 2 目标图像 的一个边大于原图，一个边小于原图 ，先放大平普图像，然后裁剪
	// =if( ($ratio_w < 1 && $ratio_h > 1) || ($ratio_w >1 && $ratio_h <1) )
	else
	{
		$ratio=$ratio_h>$ratio_w? $ratio_h : $ratio_w; //取比例大的那个值
		// 定义一个中间的大图像，该图像的高或宽和目标图像相等，然后对原图放大
		$inter_w=(int)($w * $ratio);
		$inter_h=(int) ($h * $ratio);
		$inter_img=imagecreatetruecolor($inter_w , $inter_h);
		//将原图缩放比例后裁剪
		imagecopyresampled($inter_img,$src_img,0,0,0,0,$inter_w,$inter_h,$w,$h);
		// 定义一个新的图像
		$new_img=imagecreatetruecolor($new_width,$new_height);
		imagecopy($new_img, $inter_img, 0,0,0,0,$new_width,$new_height);
		switch($type)
		{
			case IMAGETYPE_JPEG:
				imagejpeg($new_img, $dst_file,100); // 存储图像
				break;
			case IMAGETYPE_PNG:
				imagepng($new_img,$dst_file,100);
				break;
			case IMAGETYPE_GIF :
				imagegif($new_img,$dst_file,100);
				break;
			default:
				break;
		}
	}// if3
}// end function

function SetImageSmall($src_file)
{
	$ext=GetImageTypeName($src_file);
	if($ext!="")
	{
		$ckimg="small." . $ext;
		$nPos=strpos($src_file,$ckimg);
		if($nPos>0)
		{
			return;
		}		
		$dst_file= $src_file . "." . $ckimg;
		if(!file_exists($dst_file))
		{
			//echoMsg($dst_file,$src_file);
			CreateSmallImage($src_file, $dst_file , 116 , 86);
		}
	}
}

function GetSmallImage($src_file)
{
	$ext=GetImageTypeName($src_file);
	if($ext!="")
	{
		$ckimg="small." . $ext;
		$nPos=strpos($src_file,$ckimg);
		if($nPos>0)
		{
			return $src_file;
		}		
		$dst_file= $src_file . ".small." . $ext;
		if(file_exists($dst_file))
		{
			return $dst_file;
		}
	}
	return "";
}



function GotoBack()
{
	if(isset($_SESSION["OriginalUrl"]))
	{
		echo "<script>window.location='" . $_SESSION["OriginalUrl"] . "';</script>";
	}
	else
	{
		echo "<script>window.location='/index.php';</script>";
	}
}

function UserLoginCheck()
{
	$bLogin=false;
	if(isset($_SESSION["user_id"]))			//用户的id编号
	{
		if($_SESSION["user_id"]!="")
		{
			$bLogin=true;
		}
	}
	return $bLogin;
}

function MessageBox($msg,$charset="UTF8")
{
	echo "<html>";
	echo "<head>";
	echo "<title>error</title>";
	echo "<meta http-equiv='content-type' content='text/html; charset=". $charset ."'>";
	echo "</head>";
	echo "<body>";
	echo "<input id='msg' type='hidden' value='" . $msg . "'>";
	echo "<script type='text/javascript'>alert(document.getElementById('msg').value);</script>";
	echo "</body>";
	echo "</html>";
}

function SetImgThumb(&$aryData,$img_field="img_thumb")
{
	for($i=0;$i<count($aryData);$i++)
	{	
		$aryData[$i][$img_field]=GetWebSmallImage($aryData[$i][$img_field]);
	}
}

function GetWebSmallImage($src_file)
{
	$ext=GetWebFileExt($src_file);
	if($ext!="")
	{
		$ckimg="small." . $ext;
		$nPos=strpos($src_file,$ckimg);
		if($nPos>0)
		{
			return $src_file;
		}
		$dst_file= $src_file . ".small." . $ext;		
		$real_dst_file=RealFilePath($dst_file);
		if(file_exists($real_dst_file))
		{
			return $dst_file;
		}
		else
		{
			return $src_file;
		}
	}
	return "";
}

function GetWebFileExt($url)
{
	if($url=="")
	{
		return "";
	}
	$path=parse_url($url);
	$str=explode('.',$path['path']);
	return $str[1];
}

function SetCaptionDotDotDot(&$aryData, $caption_field, $lenght = 30)
{
	if($aryData=="")
	{
		return;
	}
    for($i = 0; $i < count($aryData); $i++)
    {
		if(strlen($aryData[$i][$caption_field]) >= $lenght)
        {
			$aryData[$i][$caption_field]=msubstr2($aryData[$i][$caption_field],$lenght);
        }
    }
}

function SetCaptionSizeColor(&$aryData)
{
	if($aryData=="")
	{
		return;
	}
	$aryColor=array("#000000","#6F3700","#090","#FC3","#966","#000000","#EBB","#E80","#000000","#CF147A","#FC0","#000000","#000000","#FF0000","3C0");
	
	
	
#000000
#090
#FC3
#966
#EBB
#F3C
#FC0
#CF147A
#FF0000
	
	
	
	
	
	$size=13;
    for($i = 0; $i < count($aryData); $i++)
    {
		$size=13;
		if($aryData[$i]["count_view"]>10)
		{
			$size++;
		}
		if($aryData[$i]["count_view"]>50)
		{
			$size++;
		}
		if($aryData[$i]["count_view"]>100)
		{
			$size++;
		}
		if($aryData[$i]["count_view"]>500)
		{
			$size++;
		}
		if($aryData[$i]["count_view"]>1000)
		{
			$size++;
		}		
		if($aryData[$i]["count_view"]>5000)
		{
			$size++;
		}
		if($aryData[$i]["count_view"]>10000)
		{
			$size++;
		}		
		if($aryData[$i]["count_view"]>80000)
		{
			$size++;
		}		
		if($aryData[$i]["count_view"]>200000)
		{
			$size++;
		}
		if($aryData[$i]["count_view"]>600000)
		{
			$size++;
		}
		if($aryData[$i]["count_view"]>1000000)
		{
			$size++;
		}		
		if($aryData[$i]["count_replies"]>1)
		{
			$size++;
		}
		if($aryData[$i]["count_replies"]>10)
		{
			$size++;
		}
		if($aryData[$i]["count_replies"]>50)
		{
			$size++;
		}
		if($aryData[$i]["count_replies"]>100)
		{
			$size++;
		}
		if($aryData[$i]["count_replies"]>500)
		{
			$size++;
		}		
		if($aryData[$i]["count_replies"]>1000)
		{
			$size++;
		}
		if($aryData[$i]["count_replies"]>8000)
		{
			$size++;
		}		
		if($aryData[$i]["count_replies"]>20000)
		{
			$size++;
		}		
		$aryData[$i]["color"]=$aryColor[rand(0,count($aryColor)-1)];
		$aryData[$i]["fontsize"]=$size . "px";
		$aryData[$i]["height"]=($size+8) . "px";
    }
}

function SetHttpfromType(&$aryData)
{
	for($i=0;$i<count($aryData);$i++)
	{
		$aryData[$i]["http"]="";
		switch($aryData[$i]["type"])
		{
			case "blog_articles":
				$aryData[$i]["http"]="/index.php?c=blog&a=article&aid=63" . $aryData[$i]["id"];
				break;
			case "blog_img_collect":
				$aryData[$i]["http"]="/index.php?c=blog&a=photos&id=" . $aryData[$i]["id"];
				break;
			case "con_articles":
				LoadModel("con_articles");
				$con_articlesM=new con_articlesModel("con_articles","id");			
				if($GLOBALS["gStatic"]==1)
				{
					$aryData[$i]["http"]=$con_articlesM->GetHtmlPath($aryData[$i]["id"]);
				}
				else
				{
					//先查找这个id是否已经存在htmlpath了，如果存在，就调取htmlpath
					$sQuery="select htmlpath from con_articles where id=" . $aryData[$i]["id"];
					$httppath=$con_articlesM->GetOne($sQuery);
					if($httppath=="")
					{
						$aryData[$i]["http"]="/index.php?c=article&id=" . $aryData[$i]["id"];
					}
					else
					{
						$aryData[$i]["http"]=$httppath;						
					}
				}
				break;
			case "con_img_collect":
				$aryData[$i]["http"]="/index.php?c=photos&id=" . $aryData[$i]["id"];
				break;
		}
	}
}

function mb_unserialize($serial_str)
{
	$out = preg_replace('!s:(\d+):"(.*?)";!se', "'s:'.strlen('$2').':\"$2\";'", $serial_str );
	return unserialize($out);
}

function ToImageUbb($content)
{
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/smile.gif\\\" alt=\\\"微笑\\\" />","[~i1]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/tongue.gif\\\" alt=\\\"吐舌头\\\" />","[~i2]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/titter.gif\\\" alt=\\\"偷笑\\\" />","[~i3]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/laugh.gif\\\" alt=\\\"大笑\\\" />","[~i4]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/sad.gif\\\" alt=\\\"难过\\\" />","[~i5]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/wronged.gif\\\" alt=\\\"委屈\\\" />","[~i6]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/fastcry.gif\\\" alt=\\\"快哭了\\\" />","[~i7]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/cry.gif\\\" alt=\\\"哭\\\" />","[~i8]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/wail.gif\\\" alt=\\\"大哭\\\" />","[~i9]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/mad.gif\\\" alt=\\\"生气\\\" />","[~ia]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/knock.gif\\\" alt=\\\"敲打\\\" />","[~ib]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/curse.gif\\\" alt=\\\"骂人\\\" />","[~ic]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/crazy.gif\\\" alt=\\\"抓狂\\\" />","[~id]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/angry.gif\\\" alt=\\\"发火\\\" />","[~ie]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/ohmy.gif\\\" alt=\\\"惊讶\\\" />","[~if]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/awkward.gif\\\" alt=\\\"尴尬\\\" />","[~ig]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/panic.gif\\\" alt=\\\"惊恐\\\" />","[~ih]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/shy.gif\\\" alt=\\\"害羞\\\" />","[~ii]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/cute.gif\\\" alt=\\\"可怜\\\" />","[~ij]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/envy.gif\\\" alt=\\\"羡慕\\\" />","[~ik]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/proud.gif\\\" alt=\\\"得意\\\" />","[~il]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/struggle.gif\\\" alt=\\\"奋斗\\\" />","[~im]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/quiet.gif\\\" alt=\\\"安静\\\" />","[~in]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/shutup.gif\\\" alt=\\\"闭嘴\\\" />","[~io]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/doubt.gif\\\" alt=\\\"疑问\\\" />","[~ip]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/despise.gif\\\" alt=\\\"鄙视\\\" />","[~iq]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/sleep.gif\\\" alt=\\\"睡觉\\\" />","[~ir]",$content);
	$content=str_replace("<img src=\\\"includes/ubb/xheditor_emot/default/bye.gif\\\" alt=\\\"再见\\\" />","[~is]",$content);
	return $content;
}
	
function ReImageUbb($content)
{
	$content=str_replace("[~i1]","<img src=\"includes/ubb/xheditor_emot/default/smile.gif\" alt=\"微笑\" />",$content);
	$content=str_replace("[~i2]","<img src=\"includes/ubb/xheditor_emot/default/tongue.gif\" alt=\"吐舌头\" />",$content);
	$content=str_replace("[~i3]","<img src=\"includes/ubb/xheditor_emot/default/titter.gif\" alt=\"偷笑\" />",$content);
	$content=str_replace("[~i4]","<img src=\"includes/ubb/xheditor_emot/default/laugh.gif\" alt=\"大笑\" />",$content);
	$content=str_replace("[~i5]","<img src=\"includes/ubb/xheditor_emot/default/sad.gif\" alt=\"难过\" />",$content);
	$content=str_replace("[~i6]","<img src=\"includes/ubb/xheditor_emot/default/wronged.gif\" alt=\"委屈\" />",$content);
	$content=str_replace("[~i7]","<img src=\"includes/ubb/xheditor_emot/default/fastcry.gif\" alt=\"快哭了\" />",$content);
	$content=str_replace("[~i8]","<img src=\"includes/ubb/xheditor_emot/default/cry.gif\" alt=\"哭\" />",$content);
	$content=str_replace("[~i9]","<img src=\"includes/ubb/xheditor_emot/default/wail.gif\" alt=\"大哭\" />",$content);
	$content=str_replace("[~ia]","<img src=\"includes/ubb/xheditor_emot/default/mad.gif\" alt=\"生气\" />",$content);
	$content=str_replace("[~ib]","<img src=\"includes/ubb/xheditor_emot/default/knock.gif\" alt=\"敲打\" />",$content);
	$content=str_replace("[~ic]","<img src=\"includes/ubb/xheditor_emot/default/curse.gif\" alt=\"骂人\" />",$content);
	$content=str_replace("[~id]","<img src=\"includes/ubb/xheditor_emot/default/crazy.gif\" alt=\"抓狂\" />",$content);
	$content=str_replace("[~ie]","<img src=\"includes/ubb/xheditor_emot/default/angry.gif\" alt=\"发火\" />",$content);
	$content=str_replace("[~if]","<img src=\"includes/ubb/xheditor_emot/default/ohmy.gif\" alt=\"惊讶\" />",$content);
	$content=str_replace("[~ig]","<img src=\"includes/ubb/xheditor_emot/default/awkward.gif\" alt=\"尴尬\" />",$content);
	$content=str_replace("[~ih]","<img src=\"includes/ubb/xheditor_emot/default/panic.gif\" alt=\"惊恐\" />",$content);
	$content=str_replace("[~ii]","<img src=\"includes/ubb/xheditor_emot/default/shy.gif\" alt=\"害羞\" />",$content);
	$content=str_replace("[~ij]","<img src=\"includes/ubb/xheditor_emot/default/cute.gif\" alt=\"可怜\" />",$content);
	$content=str_replace("[~ik]","<img src=\"includes/ubb/xheditor_emot/default/envy.gif\" alt=\"羡慕\" />",$content);
	$content=str_replace("[~il]","<img src=\"includes/ubb/xheditor_emot/default/proud.gif\" alt=\"得意\" />",$content);
	$content=str_replace("[~im]","<img src=\"includes/ubb/xheditor_emot/default/struggle.gif\" alt=\"奋斗\" />",$content);
	$content=str_replace("[~in]","<img src=\"includes/ubb/xheditor_emot/default/quiet.gif\" alt=\"安静\" />",$content);
	$content=str_replace("[~io]","<img src=\"includes/ubb/xheditor_emot/default/shutup.gif\" alt=\"闭嘴\" />",$content);
	$content=str_replace("[~ip]","<img src=\"includes/ubb/xheditor_emot/default/doubt.gif\" alt=\"疑问\" />",$content);
	$content=str_replace("[~iq]","<img src=\"includes/ubb/xheditor_emot/default/despise.gif\" alt=\"鄙视\" />",$content);
	$content=str_replace("[~ir]","<img src=\"includes/ubb/xheditor_emot/default/sleep.gif\" alt=\"睡觉\" />",$content);
	$content=str_replace("[~is]","<img src=\"includes/ubb/xheditor_emot/default/bye.gif\" alt=\"再见\" />",$content);
	return $content;
}

//把秒转换为小时和分钟
function sec2time($sec)
{  
	$sec = round($sec/60);  
	if ($sec >= 60)
	{
		$hour = floor($sec/60);  
		$min = $sec%60;  
		$res = $hour.' 小时 ';  
		$min != 0  &&  $res .= $min.' 分钟';  
	}
	else
	{
		$res = $sec.' 分钟';
	}
	return $res;  
}


/**
 * 测试文件是否可写
 *
 * is_writable() returns TRUE on Windows servers when you really can't write to
 * the file, based on the read-only attribute.  is_writable() is also unreliable
 * on Unix servers if safe_mode is on.
 *
 * @access	private
 * @return	void
 */
function is_really_writable($file)
{
	// If we're on a Unix server with safe_mode off we call is_writable
	if (DIRECTORY_SEPARATOR == '/' AND @ini_get("safe_mode") == FALSE)
	{
		return is_writable($file);
	}
	// For windows servers and safe_mode "on" installations we'll actually
	// write a file then read it.  Bah...
	if (is_dir($file))
	{
		$file = rtrim($file, '/').'/'.md5(mt_rand(1,100).mt_rand(1,100)) . ".tmp";
		if (($fp = @fopen($file, FOPEN_WRITE_CREATE)) === FALSE)
		{
			return FALSE;
		}

		fclose($fp);
		@chmod($file, DIR_WRITE_MODE);
		@unlink($file);
		return TRUE;
	}
	elseif ( ! is_file($file) OR ($fp = @fopen($file, FOPEN_WRITE_CREATE)) === FALSE)
	{
		return FALSE;
	}
	fclose($fp);
	return TRUE;
}

?>