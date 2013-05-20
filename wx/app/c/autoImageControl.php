<?php 

//indexControl类定义
/*
$signature=$_GET["signature"];
$timestamp=$_GET["timestamp"];
$nonce=$_GET["nonce"];
$echostr=$_GET["echostr"];

echo $echostr;
exit;
*/
define("TOKEN", "ymall");

class autoImageControl extends FrontendApp
{
	function defaultAction()
	{
		Svc("weixin");
		$weixin=new WeixinService(TOEKN,true);
		log_message("ALL","index_" . time());
		//$weixin->valid();		//完成验证后就可以把这个函数注释掉
		$weixin->responseMsg();
	}

    function pic2Local($img) {
        $cdn_path = realpath(ROOT_PATH .'/../../');
        $cdn_url = 'http://mp' .rand(1,2) . '.yokacdn.com/';

        if (strrpos($img, 'yoka.com') ||
            strrpos($img, 'ymall.com') ||
            strrpos($img, 'yokacdn.com')
        ) {
            return $img;
        }
        //保存到本地
        $_cur_time = time();
        $save_path = 'data/files/weixin/goods_' . ($_cur_time % 200);
        !is_dir($cdn_path . '/' . $save_path) && $this->ecm_mkdir($cdn_path .$save_path, $cdn_path);
        $_file = $this->random_filename() . '.jpg';
        $file = $save_path . '/' . $_file;
        $size = $this->save_web_img($img, $cdn_path . '/' . $file);
        if($size<=100) {
            return $img;
        }
        return $cdn_url . $file;
    }

    /**
     * @param $html
     * @return mixed
     */
    function textImg2Local($html) {
        $pat = '/<img.+?src=["|\'](http:\/\/[^"\']*)?["|\']/';
        preg_match_all($pat, $html, $imgs);
        if(empty($imgs)) {
            return $html;
        }

        foreach ($imgs[1] as $k=>$img) {//图片处理， 图片替换

            $cdn_img = $this->pic2Local($img);
            /* 图片替换 */
            $html = str_replace($img, $cdn_img, $html);
        }
        return $html;
    }

    function save_web_img($url, $file)
    {
        if(!class_exists('http'))
            L('http');

        $allow_types = array('.png','.jpg','.gif','.jpeg');
        if('' == $url)
        {
            return false;
        }
        $ext = strtolower(strrchr($url, "."));
        if(!in_array($ext, $allow_types))
        {
            $ext = '.jpg';
            //return false;
        }

        if($file=="")
        {
            return false;
        }

        $urlinfo = parse_url($url);

        $http_client = new http(HTTP_V11);
        $http_client->host = $urlinfo['host'];
        $http_client->set_request_header('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; rv:13.0) Gecko/20100101 Firefox/13.0.1');
        $http_client->set_request_header('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
        $http_client->set_request_header('Accept-Language', 'zh-cn');
        $http_client->set_request_header('Accept-Encoding', 'gzip,deflate');
        $http_client->set_request_header('Accept-Charset', 'gb2312,utf-8;q=0.7,*;q=0.7');
        $http_client->set_request_header('Keep-Alive', '300');
        $status = @$http_client->get($url);

        $pic = false;
        $len = false;
        if ($status == '200')
        {
            $pic = @$http_client->get_response_body();
            $len = file_put_contents($file, $pic);
        }
        return $len;
    }

    function random_filename()
    {
        $seedstr = explode(" ", microtime(), 5);
        $seed    = $seedstr[0] * 10000;
        srand($seed);
        $random  = rand(1000,10000);

        return date("YmdHis", time()) . $random;
    }

    function ecm_mkdir($absolute_path, $root_path, $mode = 0777)
    {
        if (is_dir($absolute_path))
        {
            return true;
        }
        $relative_path  = str_replace($root_path, '', $absolute_path);
        $each_path      = explode('/', $relative_path);
        $cur_path       = $root_path; // 当前循环处理的路径
        foreach ($each_path as $path)
        {
            if ($path)
            {
                $cur_path = $cur_path . '/' . $path;
                if (!is_dir($cur_path))
                {
                    if (@mkdir($cur_path, $mode))
                    {
                        fclose(fopen($cur_path . '/index.htm', 'w'));
                    }
                    else
                    {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}

?>