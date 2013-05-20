<?php
class Cache_server
{
    public $_options = null;
    public function __construct($options = null)
    {
        $this->Cache_server($options);
    }
	
    public function Cache_server($options = null)
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
?>