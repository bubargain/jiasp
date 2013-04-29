<?php
/*
+--------------------------------------------------------------------------
|   Anwsion [#RELEASE_VERSION#]
|   ========================================
|   by Anwsion dev team
|   (c) 2011 - 2012 Anwsion Software
|   http://www.anwsion.com
|   ========================================
|   Support: zhengqiang@gmail.com
|   
+---------------------------------------------------------------------------
*/

class core_cache
{
	private $cache_factory;
	private $frontendName = 'Core';
	
	private $frontendOptions = array(
		'lifeTime' => 3600, 
		'automatic_serialization' => TRUE
	);
	
	// 支持 File, Memcached, APC, Xcache, 手册参考: http://framework.zend.com/manual/zh/zend.cache.html
	private $backendName = 'File';
	
	private $backendOptions = array(
		/*
		// Memcache 配置
		'servers' => array(
			array(
				'host' => '127.0.0.1', 
				'port' => 41111, 
				'persistent' => true,
				'timeout' => 5,
				'compression' => false,	// 压缩
				'compatibility' => false	// 兼容旧版 Memcache servers
			)	
		)
		*/
	);
	
	private $groupPrefix = '_group_';
	private $cachePrefix = '_cache_';
	
	
	public function __construct()
	{
		$this->groupPrefix = G_COOKIE_HASH_KEY . $this->groupPrefix;
		$this->cachePrefix = G_COOKIE_HASH_KEY . $this->cachePrefix;
		
		if ($this->backendName == 'File')
		{
			$cache_dir = ROOT_PATH . 'cache/';
			//$cache_dir = SAE_TMP_PATH;	
			/*if (!$cache_dir = get_setting('cache_dir'))
			{	
				$cache_dir = ROOT_PATH . 'cache/';
			}*/
			
			$this->backendOptions = array(
				'cache_dir' => realpath($cache_dir)
			);
			
			if (!file_exists($cache_dir . 'index.html'))
			{
				file_put_contents($cache_dir . 'index.html', '');
			}
		}
			
		$this->cache_factory = Zend_Cache::factory($this->frontendName, $this->backendName, $this->frontendOptions, $this->backendOptions);
		
		return true;
	}
	
	/**
	 * SET 
	 * @param  $key
	 * @param  $value
	 * @param  $group
	 * @param  $lifetime
	 * @return boolean
	 */
	public function set($key, $value, $lifetime = 60, $group = null)
	{		
		if (AWS_APP::config()->get('system')->debug)
		{
			list($usec, $sec) = explode(' ', microtime());
			$start_time = (float)$usec + (float)$sec;
		}
		
		if (! $key)
		{
			return false;
		}
		
		$result = $this->cache_factory->save($value, $this->cachePrefix . $key, array(), $lifetime);
		
		if ($group)
		{
			if (is_array($group))
			{
				if (count($group) > 0)
				{
					foreach ($group as $cg)
					{
						$this->setGroup($cg, $key);
					}
				}
			}
			else
			{
				$this->setGroup($group, $key);
			}
		}
		
		if (AWS_APP::config()->get('system')->debug)
		{
			list($usec, $sec) = explode(' ', microtime());
			$end_time = (float)$usec + (float)$sec;
			$stime = sprintf("%06f", $end_time - $start_time);
			
			AWS_APP::debug_log('cache', $stime, 'Save Cache: ' . $key . ', result type: ' . gettype($value));
		}
		
		return $result;
	}

	/**
	 * GET
	 * @param  $key
	 */
	public function get($key)
	{
		if (AWS_APP::config()->get('system')->debug)
		{
			list($usec, $sec) = explode(' ', microtime());
			$start_time = (float)$usec + (float)$sec;
		}
		
		if (! $key)
		{
			return false;
		}
		
		$result = $this->cache_factory->load($this->cachePrefix . $key);
		
		if (AWS_APP::config()->get('system')->debug)
		{
			list($usec, $sec) = explode(' ', microtime());
			$end_time = (float)$usec + (float)$sec;
			$stime = sprintf("%06f", $end_time - $start_time);
			
			AWS_APP::debug_log('cache', $stime, 'Get Cache: ' . str_replace($this->groupPrefix, '', $key) . ', result type: ' . gettype($result));
		}

		return $result;
	}

	/**
	 * SET_GROUP
	 * @param  $group_name
	 * @param  $key
	 */
	public function setGroup($group_name, $key)
	{
		$groupData = $this->get($this->groupPrefix . $group_name);
		
		if (is_array($groupData) && in_array($key, $groupData))
		{
			return false;
		}
		
		$groupData[] = $key;
		
		return $this->set($this->groupPrefix . $group_name, $groupData, null, $this->frontendOptions['lifeTime']);
	}

	/**
	 * GET GROUP
	 * @param  $group_name
	 */
	public function getGroup($group_name)
	{
		return $this->get($this->groupPrefix . $group_name);
	}

	/**
	 * CLEAN GROUP
	 * @param  $group_name
	 */
	public function cleanGroup($group_name)
	{
		$groupData = $this->get($this->groupPrefix . $group_name);
		
		if ($groupData && is_array($groupData))
		{
			foreach ($groupData as $item)
			{
				$this->delete($item);
			}
		}
		
		$this->delete($this->groupPrefix . $group_name);
	}

	/**
	 * DELETE
	 * @param  $key
	 */
	public function delete($key)
	{			
		$key = $this->cachePrefix . $key;
		
		return $this->cache_factory->remove($key);
	}

	/**
	 * CLEAN
	 */
	public function clean()
	{		
		return $this->cache_factory->clean(Zend_Cache::CLEANING_MODE_ALL);
	}

	/**
	 * START
	 * @param  $key
	 */
	public function start($key)
	{
		$key = $this->cachePrefix . $key;
		
		$this->cache_factory->start($key);
	}

	/**
	 * END
	 */
	public function end()
	{
		$this->cache_factory->end();
	}
}

