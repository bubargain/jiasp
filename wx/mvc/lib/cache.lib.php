<?php

/**
 *    基础缓存类接口
 */
class CacheServer
{
    public $_options = null;
    public function __construct($options = null)
    {
        $this->CacheServer($options);
    }
	
    public function CacheServer($options = null)
    {
        $this->_options = $options;
    }

    /**
     *    获取缓存的数据
     *
     *    @author    Garbin
     *    @param     string $key
     *    @return    mixed
     */
    public function get($key){}
	
    /**
     *    设置缓存
     *
     *    @author    Garbin
     *    @param     string $key
     *    @param     mixed  $value
     *    @param     int    $ttl
     *    @return    bool
     */
    public function set($key, $value, $ttl = 0){}
	
    /**
     *    清空缓存
     *
     *    @author    Garbin
     *    @return    bool
     */
    public function clear(){}
	
    /**
     *    删除一个缓存
     *
     *    @author    Garbin
     *    @param     string $key
     *    @return    bool
     */
    public function delete($key){}
}

/**
 *    普通PHP文件缓存
 *
 *    @author    Garbin
 *    @usage    none
 使用方法：
1，根据参数生成key，例如
 		$key = "forum_SetForumCategory";
		if($cat_id!="")
		{
			$key.="_" . $cat_id;
		}
		if($not_ids!="")
		{
			$key.="_" . $not_ids;
		}
		if($sUrl!="")
		{
			$key.="_" . $sUrl;
		}
		$key.="_" . $GLOBALS["gLang"];
 
2， 如果得不到数组，就生成数组
		$cat_child = $this->cs->get($key);			//获取cache中的数据
		if($cat_child === false)						//如果没有cache数据
		{
			...生成数组
			$this->cs->set($key, $cat_child, 86400);
		}
 */
class PhpCacheServer extends CacheServer
{
    /* 缓存目录 */
    public  $_cache_dir = './';
    public function set($key, $value, $ttl = 0)
    {
        if (!$key)
        {
            return false;
        }
        $cache_file = $this->_get_cache_path($key);
        $cache_data = "<?php\r\n/**\r\n *  @Created By PhpCacheServer\r\n *  @Time:" . date('Y-m-d H:i:s') . "\r\n */";
        $cache_data .= $this->_get_expire_condition(intval($ttl));
        $cache_data .= "\r\nreturn " . var_export($value, true) .  ";\r\n";
        $cache_data .= "\r\n?>";
        return file_put_contents($cache_file, $cache_data, LOCK_EX);
    }
	
    public function get($key)
    {
        $cache_file = $this->_get_cache_path($key);
        if (!is_file($cache_file))
        {
            return false;
        }
        $data = include($cache_file);

        return $data;
    }
	
    public function clear()
    {
        $dir = dir($this->_cache_dir);
        while (false !== ($item = $dir->read()))
        {
            if ($item == '.' || $item == '..' || substr($item, 0, 1) == '.')
            {
                continue;
            }
            $item_path = $this->_cache_dir . '/' . $item;
            if (is_dir($item_path))
            {
                removeDir($item_path);
            }
            else
            {
                @unlink($item_path);
            }
        }
        return true;
    }
	
    public function delete($key)
    {
        $cache_file = $this->_get_cache_path($key);
        return @unlink($cache_file);
    }
	
    public function set_cache_dir($path)
    {
        $this->_cache_dir = $path;
    }
	
    public function _get_expire_condition($ttl = 0)
    {
        if (!$ttl)
        {
            return '';
        }

        return "\r\n\r\n" . 'if(filemtime(__FILE__) + ' . $ttl . ' < time())return false;' . "\r\n";
    }
	
    public function _get_cache_path($key)
    {
		$file_name=$this->_get_file_name($key);
		$ym=date("Ym",time());
		$dir=$this->_cache_dir . '/' . $ym . '/' . substr($file_name,0,2);
		//检测这个目录位置在不在？
		if(is_dir($dir)==0)
		{
			makeDir($dir,0777);
		}
        return $dir . '/' . $file_name;
    }
	
    public function _get_file_name($key)
    {
        return md5($key) . '.cache.php';
    }
}

/**
 *    Memcached
 *
 *    @author    Garbin
 *    @usage    none
 */
class MemcacheServer extends CacheServer
{
    public $_memcache = null;
    public function __construct($options)
    {
        $this->MemcacheServer($options);
    }
	
    public function MemcacheServer($options)
    {
        parent::__construct($options);

        /* 连接到缓存服务器 */
        $this->connect($this->_options);
    }

    /**
     *    连接到缓存服务器
     *
     *    @author    Garbin
     *    @param     array $options
     *    @return    bool
     */
    public function connect($options)
    {
        if (empty($options))
        {
            return false;
        }
        $this->_memcache = new Memcache;

        return $this->_memcache->connect($options['host'], $options['port']);
    }

    /**
     *    写入缓存
     *
     *    @author    Garbin
     *    @param    none
     *    @return    void
     */
    public function set($key, $value, $ttl = null)
    {
        return $this->_memcache->set($key, $value, $ttl);
    }

    /**
     *    获取缓存
     *
     *    @author    Garbin
     *    @param     string $key
     *    @return    mixed
     */
    public function get($key)
    {
        return $this->_memcache->get($key);
    }

    /**
     *    清空缓存
     *
     *    @author    Garbin
     *    @return    bool
     */
    public function clear()
    {
        return $this->_memcache->flush();
    }

    public function delete($key)
    {
        return $this->_memcache->delete($key);
    }
}
?>