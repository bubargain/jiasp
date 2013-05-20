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

class indexControl extends FrontendApp
{
	function defaultAction()
	{
		Svc("weixin");
		$weixin=new WeixinService(TOEKN,false);
		//log_message("ALL","index_" . time());
		//$weixin->valid();		//完成验证后就可以把这个函数注释掉
		$weixin->responseMsg();
	}
	/*
	function cosmeticAction()
	{
		$id=G2Int("id");
		if(!$id)
		{
			$this->show_message('出错啦!','back_list','http://www.ymall.com');
			exit;
		}
		$cosmeticM=M("cosmetic",false);
		
		$sQuery="select * from cosmetic where id=" . $id;
		$data=$cosmeticM->getRow($sQuery);
		$this->assign("data",$data);
		$this->display("cosmetic.html");
	}
	*/
	function textAction()
	{
		$id=G2Int("id");
		if(!$id)
		{
			$this->show_message('出错啦!','back_list','http://www.ymall.com');
			exit;			
		}
		$textM=DBS("text");
		$sQuery="select * from text where id=" . $id;
		$data=$textM->getRow($sQuery);
        if($data)
            $data['date_str'] = $data['date_str']>0 ? date('Y-m-d', $data['date_str']) : '';
		$this->assign("data",$data);
		$this->display("text.html");
	}
	
	function bagAction()
	{
		$id=G2Int("id");
		if(!$id)
		{
			$this->show_message('出错啦!','back_list','http://www.ymall.com');
			exit;			
		}
		$textM=DBS("text");
		$sQuery="select * from bag where id=" . $id;
		$data=$textM->getRow($sQuery);
		$this->assign("data",$data);
		$this->display("bag.html");
	}	
	
	function testAction()
	{
		Svc("weixin");
		$weixin=new WeixinService(TOEKN,false);
		$weixin->test();
		//$key=G("key");
		//print_r($weixin->search_bag($key));
	}

    function searchTestAction() {
        Svc("weixin");
        $weixin = new WeixinService(TOEKN,false);

        $data = $weixin->SearchKeyword($_GET['key'],$_GET['name']);
        print_r($data);
    }

    function goodsTestAction() {
        Svc("ymallsearch");
        $ymallSvc = new YmallSearchService();

        $data = $ymallSvc->search($_GET['keyword']);
        var_dump($data);
    }

    function goodsAction() {
        Svc("ymallsearch");
        $ymallSvc = new YmallSearchService();
        $data = $ymallSvc->getGoodsById($_GET['id']);
        $this->assign("data",$data);
        $this->display("product.html");
    }

	function tttAction()
	{
		$db=dbMysqlConnection::getSlave();
		print_r($db);
		exit;
	}
	
	function hctpostAction()
	{
		$data['title'] = P("title");
		$data['from'] = P("from");
		$data['pic'] = P("pic");
		$data['neirong'] = P("neirong");
		$data['date_str'] = P("date_str");
		$data['description'] = P("description");
        $data['focus'] = P("focus");
        $data['from_url'] = P("from_url");
        $data['buy_url'] = P("buy_url");

        if(!$this->checkData($data)) {
            echoMsg("失败！");
            return false;
        }

        $key_hash = md5($data['title']);

        $textS = DBS("text");
        $sql_cnt = "select 1 from `text` where `hash_key`='$key_hash'";
        if(!$textS->getOne($sql_cnt))
        {
            $data['neirong'] = $this->textImg2Local($data["neirong"]);
            $data['pic'] = $this->default_pic;
			
			if($data['from']) {
				$data['title'] = '【' . $data['from'] . '】' . $data['title'];
			}
            $data['title'] = addslashes($data['title']);
            $data['from'] = addslashes( $data['from']);
            $data['neirong'] = addslashes($data["neirong"]);
            $data['date_str'] = strtotime($data["date_str"]);
            $data['description'] = addslashes($data["description"]);
			$data['from_url'] = $data['from_url'];
			$data['buy_url'] = $data['buy_url'];

            $sql="insert into `text`(`title`,`pic`,`from`,`neirong`,`description`,`date_str`,`focus`,`from_url`,`buy_url`,`hash_key`) VALUES(";
            $sql.="'" . $data['title'] . "',";
            $sql.="'" . $data['pic'] . "',";
            $sql.="'" . $data['from'] . "',";
            $sql.="'" . $data['neirong'] . "',";
            $sql.="'" . $data['description'] . "',";
            $sql.="'" . $data['date_str'] . "',";
            $sql.="'" . $data['focus']  . "',";
            $sql.="'" . $data['from_url']  . "',";
            $sql.="'" . $data['buy_url']  . "',";
            $sql.="'" . $key_hash . "')";
            $textM = DBM('text');
            $id=$textM->query($sql);
        }
        echoMsg("成功！");
	}

    function checkData($data) {
        if(!$data['title'] || !$data['neirong'])
            return false;

        $pat = '/<img.+?src=["|\'](http:\/\/[^"\']*)?["|\']/';
        preg_match_all($pat, $data['neirong'], $imgs);
        if(empty($imgs) || count($imgs[1]) <=1)
            return false;

        return true;
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

        $cdn_path = realpath(ROOT_PATH .'/../../');
        $cdn_url = 'http://mp' .rand(1,2) . '.yokacdn.com';
		//$cdn_url ='http://59.151.9.86';
        $this->default_pic = '';

        foreach ($imgs[1] as $k=>$img) {//图片处理， 图片替换
            /*
            if (strrpos($img, 'yoka.com') ||
                strrpos($img, 'ymall.com') ||
                strrpos($img, 'yokacdn.com')
            ) {
                continue;
            }
            */
            //保存到本地
            $_cur_time = time();
            $path = $cdn_path . '/data/files/upload/' . ($_cur_time % 200) . '/';

            $status = $this->save_web_img($img, $path);
            if(!$status) {
                continue;
            }

            $file = str_replace($cdn_path, '', $status);
            /* 图片替换 */
            $html = str_replace($img, CDN_URL . $file, $html);
            if(!$this->default_pic)
                $this->default_pic = $cdn_url . $file;
        }
        return $html;
    }

    function save_web_img($url, $path)
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

        if($path=="")
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

        $pic = $file = false;
        $len = false;
        if ($status == '200')
        {
            $pic = @$http_client->get_response_body();
            $tmp = '/tmp/tmp_'.md5($path);
            $len = file_put_contents($tmp, $pic);

            L('img');
            $img = new imageProcessor();
            $file = $img->make_thumb($tmp, 480, 0, $path);
            unlink($tmp);
        }
        return $file;
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