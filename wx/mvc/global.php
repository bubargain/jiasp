<?php


/**
 *    获取环境变量
 *
 *    @param     string $key
 *    @param     mixed  $val
 *    @return    mixed
 */
function &env($key, $val = null)
{
    !isset($GLOBALS['EC_ENV']) && $GLOBALS['EC_ENV'] = array();
    $vkey = $key ? strtokey("{$key}", '$GLOBALS[\'EC_ENV\']') : '$GLOBALS[\'EC_ENV\']';
    if ($val === null)
    {
        /* 返回该指定环境变量 */
        $v = eval('return isset(' . $vkey . ') ? ' . $vkey . ' : null;');

        return $v;
    }
    else
    {
        /* 设置指定环境变量 */
        eval($vkey . ' = $val;');

        return $val;
    }
}

/**
 *    获取数组文件对象
 *
 *    @param     string $type
 *    @param     array  $params
 *    @return    void
 */
function &af($type, $params = array())
{
    static $types = array();
    if (!isset($types[$type]))
    {
        /* 加载数据文件基础类 */
        include_once(ROOT_PATH . '/app/system/arrayfile.base.php');
        include(ROOT_PATH . '/includes/arrayfiles/' . $type . '.arrayfile.php');
        $class_name = ucfirst($type) . 'Arrayfile';
        $types[$type]   =   new $class_name($params);
    }

    return $types[$type];
}

function get_microtime()
{
    if (PHP_VERSION >= 5.0)
    {
        return microtime(true);
    }
    else
    {
        list($usec, $sec) = explode(" ", microtime());

        return ((float)$usec + (float)$sec);
    }
}

/**
 * 获得当前的域名
 *
 * @return  string
 */
function get_domain()
{
    /* 协议 */
    $protocol = (isset($_SERVER['HTTPS']) && (strtolower($_SERVER['HTTPS']) != 'off')) ? 'https://' : 'http://';

    /* 域名或IP地址 */
    if (isset($_SERVER['HTTP_X_FORWARDED_HOST']))
    {
        $host = $_SERVER['HTTP_X_FORWARDED_HOST'];
    }
    elseif (isset($_SERVER['HTTP_HOST']))
    {
        $host = $_SERVER['HTTP_HOST'];
    }
    else
    {
        /* 端口 */
        if (isset($_SERVER['SERVER_PORT']))
        {
            $port = ':' . $_SERVER['SERVER_PORT'];

            if ((':80' == $port && 'http://' == $protocol) || (':443' == $port && 'https://' == $protocol))
            {
                $port = '';
            }
        }
        else
        {
            $port = '';
        }

        if (isset($_SERVER['SERVER_NAME']))
        {
            $host = $_SERVER['SERVER_NAME'] . $port;
        }
        elseif (isset($_SERVER['SERVER_ADDR']))
        {
            $host = $_SERVER['SERVER_ADDR'] . $port;
        }
    }

    return $protocol . $host;
}

function site_url()
{
    return get_domain() . substr(PHP_SELF, 0, strrpos(PHP_SELF, '/'));
}

function gmtime()
{
	//return time();
    return (time() - date('Z'));
}

function sys_json_encode($value)
{
    if (CHARSET == 'utf-8' && function_exists('json_encode'))
    {
        return json_encode($value);
    }

    $props = '';
    if (is_object($value))
    {
        foreach (get_object_vars($value) as $name => $propValue)
        {
            if (isset($propValue))
            {
                $props .= $props ? ','.sys_json_encode($name)  : sys_json_encode($name);
                $props .= ':' . sys_json_encode($propValue);
            }
        }
        return '{' . $props . '}';
    }
    elseif (is_array($value))
    {
        $keys = array_keys($value);
        if (!empty($value) && !empty($value) && ($keys[0] != '0' || $keys != range(0, count($value)-1)))
        {
            foreach ($value as $key => $val)
            {
                $key = (string) $key;
                $props .= $props ? ','.sys_json_encode($key)  : sys_json_encode($key);
                $props .= ':' . sys_json_encode($val);
            }
            return '{' . $props . '}';
        }
        else
        {
            $length = count($value);
            for ($i = 0; $i < $length; $i++)
            {
                $props .= ($props != '') ? ','.sys_json_encode($value[$i])  : sys_json_encode($value[$i]);
            }
            return '[' . $props . ']';
        }
    }
    elseif (is_string($value))
    {
        //$value = stripslashes($value);
        $replace  = array('\\' => '\\\\', "\n" => '\n', "\t" => '\t', '/' => '\/',
                        "\r" => '\r', "\b" => '\b', "\f" => '\f',
                        '"' => '\"', chr(0x08) => '\b', chr(0x0C) => '\f'
                        );
        $value  = strtr($value, $replace);
        if (CHARSET == 'big5' && $value{strlen($value)-1} == '\\')
        {
            $value  = substr($value,0,strlen($value)-1);
        }
        return '"' . $value . '"';
    }
    elseif (is_numeric($value))
    {
        return $value;
    }
    elseif (is_bool($value))
    {
        return $value ? 'true' : 'false';
    }
    elseif (empty($value))
    {
        return '""';
    }
    else
    {
        return $value;
    }
}

function sys_json_decode($value, $type = 0)
{
    if (CHARSET == 'utf-8' && function_exists('json_decode'))
    {
        return empty($type) ? json_decode($value) : get_object_vars_deep(json_decode($value));
    }

    if (!class_exists('JSON'))
    {
        L('json');
    }
    $json = new JSON();
    return $json->decode($value, $type);
}

/**
 * 返回由对象属性组成的关联数组
 *
 * @access   pubilc
 * @param    obj    $obj
 *
 * @return   array
 */
function get_object_vars_deep($obj)
{
    if(is_object($obj))
    {
        $obj = get_object_vars($obj);
    }
    if(is_array($obj))
    {
        foreach ($obj as $key => $value)
        {
            $obj[$key] = get_object_vars_deep($value);
        }
    }
    return $obj;
}

/**
 * 创建像这样的查询: "IN('a','b')";
 *
 * @access   public
 * @param    mix      $item_list      列表数组或字符串,如果为字符串时,字符串只接受数字串
 * @param    string   $field_name     字段名称
 *
 * @return   void
 */
function db_create_in($item_list, $field_name = '')
{
    if (empty($item_list))
    {
        return $field_name . " IN ('') ";
    }
    else
    {
        if (!is_array($item_list))
        {
            $item_list = explode(',', $item_list);
            foreach ($item_list as $k=>$v)
            {
                $item_list[$k] = intval($v);
            }
        }

        $item_list = array_unique($item_list);
        $item_list_tmp = '';
        foreach ($item_list AS $item)
        {
            if ($item !== '')
            {
                $item_list_tmp .= $item_list_tmp ? ",'$item'" : "'$item'";
            }
        }
        if (empty($item_list_tmp))
        {
            return $field_name . " IN ('') ";
        }
        else
        {
            return $field_name . ' IN (' . $item_list_tmp . ') ';
        }
    }
}

/**
 * 对数组转码
 *
 * @param   string  $func
 * @param   array   $params
 *
 * @return  mixed
 */
function sys_iconv_deep($source_lang, $target_lang, $value)
{
    if (empty($value))
    {
        return $value;
    }
    else
    {
        if (is_array($value))
        {
            foreach ($value as $k=>$v)
            {
                $value[$k] = sys_iconv_deep($source_lang, $target_lang, $v);
            }
            return $value;
        }
        elseif (is_string($value))
        {
            return sys_iconv($source_lang, $target_lang, $value);
        }
        else
        {
            return $value;
        }
    }
}

/**
 * 编码转换函数
 *
 * @author  wj
 * @param string $source_lang       待转换编码
 * @param string $target_lang         转换后编码
 * @param string $source_string      需要转换编码的字串
 * @return string
 */
function sys_iconv($source_lang, $target_lang, $source_string = '')
{
    static $chs = NULL;

    /* 如果字符串为空或者字符串不需要转换，直接返回 */
    if ($source_lang == $target_lang || $source_string == '' || preg_match("/[\x80-\xFF]+/", $source_string) == 0)
    {
        return $source_string;
    }

    if ($chs === NULL)
    {
        L('iconv');
        $chs = new Chinese(ROOT_PATH . '/');
    }
    return strtolower($target_lang) == 'utf-8' ? addslashes(stripslashes($chs->Convert($source_lang, $target_lang, $source_string))) : $chs->Convert($source_lang, $target_lang, $source_string);
}

function CheckImageHttpUrl($url)
{
	if(strpos(strtolower($url), 'http:/')>-1)
	{
		return true;
	}
	else if(strpos(strtolower($url), 'data:image')>-1)
	{
		return true;
	}
	return false;
}

function HttpImageUrl($http_path)
{
	if(!CheckImageHttpUrl($http_path))
	{
		$http_path=IMG_BASE_URL . "/" . $http_path;
	}
	return $http_path;
}

?>