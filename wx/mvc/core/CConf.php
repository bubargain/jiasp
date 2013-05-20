<?php

/**
 *    配置管理器
 *
 */
class Conf
{
    /**
     *    加载配置项
     *
     *    @author    Garbin
     *    @param     mixed $conf
     *    @return    bool
     */
    function load($conf)
    {
        $old_conf = isset($GLOBALS['MVC_CONFIG']) ? $GLOBALS['MVC_CONFIG'] : array();
        if (is_string($conf))
        {
            $conf = include($conf);
        }
        if (is_array($old_conf))
        {
            $GLOBALS['MVC_CONFIG'] = array_merge($old_conf, $conf);
        }
        else
        {
            $GLOBALS['MVC_CONFIG'] = $conf;
        }
    }
    /**
     *    获取配置项
     *
     *    @author    Garbin
     *    @param     string $k
     *    @return    mixed
     */
    function get($key = '')
    {
        $vkey = $key ? strtokey("{$key}", '$GLOBALS[\'MVC_CONFIG\']') : '$GLOBALS[\'MVC_CONFIG\']';
        return eval('if(isset(' . $vkey . '))return ' . $vkey . ';else{ return null; }');
    }
}

?>