<?php
class Lang
{
    /**
     *    获取指定键的语言项
     *
     *    @author    Garbin
     *    @param     none
     *    @return    mixed
     */
    function &get($key = '')
    {
        $vkey = $key ? strtokey("{$key}", '$GLOBALS[\'__CJLANG__\']') : '$GLOBALS[\'__CJLANG__\']';
        $tmp = eval('if(isset(' . $vkey . '))return ' . $vkey . ';else{ return $key; }');
        return $tmp;
    }
    /**
     *    加载指定的语言项至全局语言数据中
     *
     *    @author    Garbin
     *    @param    none
     *    @return    void
     */
    function load($lang_file)
    {
		//echoMsg($lang_file);exit;
		//$lang_file=ROOT_PATH . '/languages/' . LANG . '/' . $lang_file . '.lang.php';
        static $loaded = array();
        $old_lang = $new_lang = array();
        $file_md5 = md5($lang_file);
        if (!isset($loaded[$file_md5]))
        {
            $new_lang = Lang::fetch($lang_file);
            $loaded[$file_md5] = $lang_file;
        }
        else
        {
            return;
        }
        $old_lang =& $GLOBALS['__CJLANG__'];
        if (is_array($old_lang))
        {
            $new_lang = array_merge($old_lang, $new_lang);
        }
        $GLOBALS['__CJLANG__'] = $new_lang;
    }

    /**
     *    获取一个语言文件的内容
     *
     *    @author    Garbin
     *    @param     string $lang_file
     *    @return    array
     */
    function fetch($lang_file)
    {
		if(is_file($lang_file))
		{
	        return include($lang_file);
		}
		else
		{
			return array();
		}
    }
}
function lang_file($file)
{
    return ROOT_PATH . '/languages/' . LANG . '/' . $file . '.lang.php';
}
function strtokey($str, $owner = '')
{
    if (!$str)
    {
        return '';
    }
    if ($owner)
    {
        return $owner . '[\'' . str_replace('.', '\'][\'', $str) . '\']';
    }
    else
    {
        $parts = explode('.', $str);
        $owner = '$' . $parts[0];
        unset($parts[0]);
        return strtokey(implode('.', $parts), $owner);
    }
}
?>