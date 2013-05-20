<?php
require_once(dirname(__FILE__).'/cache_server.php');
class Cache_server_php extends Cache_server
{
    /* 缓存目录 */
    public  $_cache_dir = './';
    public function set($key, $value, $ttl = 0)
    {
        if (!$key).
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
?>