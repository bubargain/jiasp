<?php
define("TIME_KEY", 10);
class WeixinService
{
	public $signature;
	public $timestamp;
	public $nonce;
	public $echostr;
	
	public $weixinM;		 //微信记录类
	public $textS;			 //时尚资讯访问类
	public $weixinuserM;	 //微信用户访问类
	
	public $request = array();
	
    protected $funcflag = false;
    protected $debug = false;
	
	static $req_keys = array(
                "Content",
                "CreateTime",
                "FromUserName",
                "Label",
                "Location_X",
                "Location_Y",
                "MsgType",
                "PicUrl",
                "Scale",
                "ToUserName"
        );
	
    function __construct($token, $debug = false)
    {
        $this->WeixinService($token, $debug);
    }
	
    function WeixinService($token, $debug = false)
    {
		$this->weixinM = DBM("log/weixin");
		$this->weixinuserM = DBM("weixinuser");
		$this->textS = DBS("text");
        $this->token = $token;
        $this->debug = $debug;
	}
	
	public function valid()
    {
        $echoStr = $_GET["echostr"];
		echo $echoStr;
		exit;
        if($this->checkSignature()){
        	echo $echoStr;
        	exit;
        }
    }
	
    public function get_msg_type()
    {
        return strtolower($this->request['MsgType']);
    }

	public function get_msg_event()
    {
        return strtolower($this->request['Event']);
    }
	
    public function set_funcflag()
    {
        $this->funcflag = true;
    }
	
	//测试微信数据
	function test()
	{
		$keyword=G("key");
		$data=$this->SearchKeyword($keyword,"test",'text','');
        $ret = $this->replyNews($data);
		echo $ret;
	}
	
	//记录用户的搜索日志
	function UserSearchLog($user_id,$keyword, $type, $event)
	{
		$sql = "insert into `weixinuserlog`(`user_id`,`keyword`,`type`,`event`,`addtime`) values(" . $user_id . ",'" . $keyword . "','" . $type . "','" . $event . "'," .time() . ")";
		$this->weixinuserM->query($sql);
	}
	
	//搜索关键词
	function SearchKeyword($keyword,$from_user_name,$type = 'text', $event = '')
	{
        $data = array();
        $this->_search_key = strtolower($keyword);

        $this->initUser($from_user_name);

        $this->UserSearchLog($this->_user["user_id"],$this->_search_key, $type, $event);

        //记录搜索日志文件

        switch($this->_search_key) {
            case 't':
                $data = $this->searchFocus();
                break;
            case 'ymall':
            case 'Ymall商城':
            case '商城':
            case '时尚搜':
                $data = $this->Ymall();
                break;
            case '':
            case '###image###':
            case '###location###':
            case '###link###':
            case '###subscribe###':
            case '###unsubscribe###':
            case '###click###':
            case '###else###':
            case 'url':
                $data = $this->home();
                break;
            case 'm':
                $data = $this->searchText();
                break;
            default:
                $data = $this->searchText();
                break;
        }

        //更新用户最新搜索信息
        $this->saveUserInfo();
        //返回数据

        return $data;
    }

    function formatText(&$data) {
        foreach($data as $k=>$row) {
            /*
			if($row['from']) {
                $row['title'] = '【'.$row['from'].'】' . $row['title'];
            }
			*/
            $row['title'] = htmlspecialchars_decode($row['title']);
            $data[$k]['title'] = str_replace(array('&',"'",'"','<','>'),array('﹠',' ',' ',' ',' '),$row['title']);
            if(strlen($data[$k]['title']) > 40) {
                $data[$k]['title'] = sub_str($data[$k]['title'], 40, true);
            }
            if($row['goods_id'])
                $data[$k]['url'] = SITE_URL . "/index.php?c=index&a=goods&id=" . $row['goods_id'];
            else
                $data[$k]['url'] = SITE_URL . "/index.php?c=index&a=text&id=" . $row['id'];

            $data[$k]['date_str'] = $row['date_str'] > 0 ? date('Y-m-d', $row['date_str']) : '';
        }
    }

    function searchFocus() {
        //$time_arr = $this->focusEndTime();

        $this->_up_keys = array('last_search_time','last_search_keyword','last_search_page');

        $this->_user['last_search_keyword'] = $this->_search_key;
        $this->_user['last_search_time'] = time();
        $this->_user['last_search_page'] = 1;

        $sql = "select * from text where date_str<=unix_timestamp() order by date_str desc limit 0, 5";
        $data = $this->textS->getRows($sql);

        $this->formatText($data);

        $data[] = array(
            "title" => "查看更多时尚热点，请回复“m”或者“M”",
            "description" => "",
            "pic" =>  "http://p1.yokacdn.com/pic/EDM_Ymall/Ymall_icon.png",
            "url" =>  SITE_URL . "/themes/cn_style1/ymall.html"
        );
        return $data;
    }


    function searchText() {
        $sql_cnt = "select count(*) from text where date_str<=unix_timestamp() ";
        $sql = "select * from text where date_str<=unix_timestamp() ";
        $this->_up_keys = array('last_search_page','last_search_keyword','last_search_time');

        if($this->_search_key == 'm') {
            if($this->_user['last_search_keyword'] == 't') {
                $this->_user['last_search_page']++;
                $this->_search_key = $this->_user['last_search_keyword'];
            }
            else {
                $this->_user['last_search_page']++;
                $this->_search_key = $this->_user['last_search_keyword'];

                $sql_cnt .= " and `title` like '%$this->_search_key%'";
                $sql .= " and `title` like '%$this->_search_key%'";
            }
        }
        else {
            $this->_user['last_search_page'] = 1;
            $this->_user['last_search_keyword'] = $this->_search_key;

            $sql_cnt .= " and `title` like '%$this->_search_key%'";
            $sql .= " and `title` like '%$this->_search_key%'";
        }
        $this->_user['last_search_time'] = time();

        if($total = $this->textS->getOne($sql_cnt)) {
            $total_page = ceil($total / 5);

            if($this->_user)
                $page = $this->_user['last_search_page'];
            if($page < 1)
                $page = 1;

            if($page >= $total_page)
                $this->_user['last_search_page'] = $page = $total_page;

            $limit = (($page-1) * 5) . ', 5';
            $sql .= ' order by date_str desc limit ' . $limit;
            $data = $this->textS->getRows($sql);


            if($this->_search_key != 't' && $data)
                $data = array_merge($data, $this->iSearchGoods($this->_search_key, $page, 1));

            $this->formatText($data);

            if($page < $total_page) {
                if($this->_user['last_search_keyword'] == 't') {
                    $data[] = array(
                        "title" => "查看更多时尚热点，请回复“m”或者“M”" ,
                        "description" => "",
                        "pic" =>  "http://p1.yokacdn.com/pic/EDM_Ymall/Ymall_icon.png",
                        "url" =>  SITE_URL . "/themes/cn_style1/ymall.html"
                    );
                }
                else {
                    $data[] = array(
                        "title" => "查看更多搜索结果，请回复“m”或者“M”" ,
                        "description" => "",
                        "pic" =>  "http://p1.yokacdn.com/pic/EDM_Ymall/Ymall_icon.png",
                        "url" =>  SITE_URL . "/themes/cn_style1/ymall.html"
                    );
                }
            }

            return $data;
        }
        else {
            return $this->showNothing();
        }
    }

    function iSearchGoods($keyword, $page, $size) {
        Svc("ymallsearch");
        $ymallSvc = new YmallSearchService();
        $list = $ymallSvc->search($keyword, $page, $size);
        if(!$list) {
            return array();
        }

        foreach($list as $row) {
            $ret[] = array(
                'id'=>$row['goods_id'],
                'goods_id'=>$row['goods_id'],
                'title'=>'【礼物店】' . $row['goods_name'],
                'from'=>'礼物店',
                'date_str'=>'',
                'pic'=>$row['default_image'],
                //'url'=>SITE_URL . "/index.php?c=index&a=goods&id=" . $row['goods_id'],
                //'url'=>'http://www.ymall.com',
            );
        }
        return $ret;
    }

    private function focusEndTime() {

        $_t = explode('-',date('Y-m-d-H'));

        if($_t[3] < TIME_KEY) {
            return array(
                'start' => mktime(0,0,0,$_t[1],($_t[2] - 1),$_t[0]),
                'end' => mktime(0,0,0,$_t[1],$_t[2],$_t[0]),
                'base'=>mktime(TIME_KEY,0,0,$_t[1],$_t[2],$_t[0]),
            );
        }
        else {
            return array(
                'start' => mktime(0,0,0,$_t[1],$_t[2],$_t[0]),
                'end' => time(),
                'base'=>mktime(TIME_KEY,0,0,$_t[1],$_t[2],$_t[0]),
            );
        }
    }

    function initUser($user_name) {
        $sql = "select * from weixinuser where weixin_username='" . $user_name . "'";
        $this->_user = $this->weixinuserM->getRow($sql);

        if(!$this->_user) {
            $this->_user = array(
                "user_id"=>null,
                "addtime"=>time(),				//添加时间 int
                "weixin_username"=>$user_name,	//微信用户名 varchar
                "last_search_type"=>"",			//最后搜索类型 varchar
                "last_search_keyword"=>"",		//最后搜索关键词 varchar
                "last_search_page"=>0,			//最后搜索关键词的阅览页面数量 int
                "last_search_time"=>0,			//最后搜索关键词的阅览页面数量 int
                "last_focus_page"=>0	,		//最后搜索关键词的阅览页面数量 int
                "last_focus_time"=>0	,		//最后搜索关键词的阅览页面数量 int
            );
            $this->_user["user_id"] = $this->weixinuserM->add($this->_user);
        }
    }

    function saveUserInfo() {
        if(!$this->_user || !$this->_up_keys)
            return true;

        $conditions = 'user_id='.$this->_user['user_id'];

        foreach($this->_up_keys as $key) {
            $info[$key] = $this->_user[$key];
        }
        return $this->weixinuserM->edit($conditions, $info);
    }

    public function showNothing()
    {
        return sprintf("您在这个【" . $this->_search_key . "】领域已经是超专业了，所有资讯都躲避了。请尝试热门关键词：".$this->getTopKeys()."等。输入“t”或者“T”，查看今日热点。");
    }
    public function home()
    {
       return sprintf("时尚搜：看最新鲜的，搜最想要的。输入您感兴趣的关键词，开启个性化的新鲜时尚之旅，如".$this->getTopKeys()."等。");      
    }
	
	public function getTopKeys() {
		$sql = "select * from weixinkeys where 1 order by id desc limit 1";
        $info = $this->weixinuserM->getRow($sql);
		if($info['keys'])
			return "“" . str_replace(',', "”，“", $info['keys']) . "”";
		return "“条纹”，“墨镜”，“性感”";		
	}
	
    public function begin()
    {
        return array(
            array(
                "title" =>  "《夜问》第三方预告",
                "description" =>"看最新鲜的，搜最想要的。关于时尚那点事儿，你想知道,你想拥有，请点这里。",
                "pic" =>  "http://p1.yokacdn.com/pic/EDM_Ymall/lejia/index_face.jpg",
                "url" =>  SITE_URL . "/themes/cn_style1/lejia/lejia5.html",
            ),
		    array(
                "title" =>  "【送色仔】点此参与抽奖，免费得色仔",
                "description" =>"看最新鲜的，搜最想要的。关于时尚那点事儿，你想知道,你想拥有，请点这里。",
                "pic" =>  "http://p1.yokacdn.com/pic/EDM_Ymall/lejia/sezai.jpg",
                "url" =>  SITE_URL . "/themes/cn_style1/lejia/lejia4.html",
            ),
		    array(
                "title" =>  "【了解自己】FPA性格色彩",
                "description" =>"看最新鲜的，搜最想要的。关于时尚那点事儿，你想知道,你想拥有，请点这里。",
                "pic" =>  "http://p1.yokacdn.com/pic/EDM_Ymall/lejia/1-1.jpg",
                "url" =>  SITE_URL . "/themes/cn_style1/lejia/lejia1.html",
            ),
		    array(
                "title" =>  "【学会孤独】不在相对是世界追求绝对",
                "description" =>"看最新鲜的，搜最想要的。关于时尚那点事儿，你想知道,你想拥有，请点这里。",
                "pic" =>  "http://p1.yokacdn.com/pic/EDM_Ymall/lejia/5.jpg",
                "url" =>  SITE_URL . "/themes/cn_style1/lejia/lejia2.html",
            ),
		    array(
                "title" =>  "【语录傍身】慧眼识人",
                "description" =>"看最新鲜的，搜最想要的。关于时尚那点事儿，你想知道,你想拥有，请点这里。",
                "pic" =>  "http://p1.yokacdn.com/pic/EDM_Ymall/lejia/2.jpg",
                "url" =>  SITE_URL . "/themes/cn_style1/lejia/lejia3.html",
            ),
		    array(
                "title" =>  "在对话框内输入感兴趣的关键词如“瘦脸”，“短裙”，“假期”等会有惊喜！",
                "description" =>"看最新鲜的，搜最想要的。关于时尚那点事儿，你想知道,你想拥有，请点这里。",
                "pic" =>  "http://p1.yokacdn.com/pic/EDM_Ymall/Ymall_icon.png",
                "url" =>  SITE_URL . "/themes/cn_style1/ymall.html",
            ),
		);
    }
    public function Ymall()
    {
        return array(
            array(
                "title" =>  "Ymall品牌",
                "description" =>"看最新鲜的，搜最想要的。关于时尚那点事儿，你想知道,你想拥有，请点这里。",
                "pic" =>  "http://p1.yokacdn.com/pic/EDM_Ymall/weixin/A20_logo.jpg",
                "url" =>  SITE_URL . "/themes/cn_style1/ymall.html",
            ),
        );
    }


//========================================================================================

	//执行消息处理函数
	function responseMsg()
	{
		//get post data, May be due to the different environments
		$postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
        if ($this->debug)
			file_put_contents("request.txt", $postStr);

        if(empty($postStr) || !$this->checkSignature())
		{
			file_put_contents("bad.txt", "bad request");
            die("bad request");
		}
		if ($this->debug)
			file_put_contents("postStr.txt", $postStr);
			
		log_message("ALL",$postStr);

        $this->request = (array)simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
		log_message("ALL",$this->request);

		$arg = $this->reply_cb($this->request,$this);
		
		log_message("ALL",$arg);
		
		if ($this->debug)
			file_put_contents("arg.txt", $arg);
		
        if (!is_array($arg))
            $ret = $this->replyText($arg);
        else
            $ret = $this->replyNews($arg);

        if ($this->debug)
            file_put_contents("response.txt", $ret);
        echo $ret;
	}
	
	public function reply_cb($request, $w)
	{
		log_message("msg_type",$w->get_msg_type());
		$type = $w->get_msg_type();
		$event = $w->get_msg_event();
		switch($type) {
            case 'image':
				$keyword = '###image###';
				break;
            case 'location':
				$keyword = '###location###';
				break;
            case 'link':
				$keyword = '###link###';
				break;
            case 'event':
				if($event == 'subscribe') {
					$keyword = '###subscribe###';
				}
				elseif($event == 'unsubscribe') {
					$keyword = '###unsubscribe###';
				}
				else {
					$keyword = '###click###';
				}
                break;
            case 'text':
				$keyword = trim($request['Content']);
                break;
            default:
                $keyword = '###else###';
                break;
        }
        return $this->SearchKeyword($keyword,trim($request['FromUserName']),$type,$event);
	}
	
    public function replyText($message)
    {
        $textTpl = <<<eot
<xml>
    <ToUserName><![CDATA[%s]]></ToUserName>
    <FromUserName><![CDATA[%s]]></FromUserName>
    <CreateTime>%s</CreateTime>
    <MsgType><![CDATA[%s]]></MsgType>
    <Content><![CDATA[%s]]></Content>
    <FuncFlag>%d</FuncFlag>
</xml>
eot;
        $req = $this->request;
        return sprintf($textTpl, $req['FromUserName'], $req['ToUserName'],
                time(), 'text', $message, $this->funcflag ? 1 : 0);

    }
	
    public function replyNews($arr_item)
    {
        $itemTpl = <<<eot
        <item>
            <Title><![CDATA[%s]]></Title>
            <Discription><![CDATA[%s]]></Discription>
            <PicUrl><![CDATA[%s]]></PicUrl> 
            <Url><![CDATA[%s]]></Url>
        </item>

eot;
        $real_arr_item = $arr_item;
        if (isset($arr_item['title']))
            $real_arr_item = array($arr_item); 

        $nr = count($real_arr_item);
        $item_str = "";
        foreach ($real_arr_item as $item)
            $item_str .= sprintf($itemTpl, $item['title'], '',
                    $item['pic'], $item['url']);

        $time = time();
        $fun = $this->funcflag ? 1 : 0;

        return <<<eot
<xml>
    <ToUserName><![CDATA[{$this->request['FromUserName']}]]></ToUserName>
    <FromUserName><![CDATA[{$this->request['ToUserName']}]]></FromUserName>
    <CreateTime>{$time}</CreateTime>
    <MsgType><![CDATA[news]]></MsgType>
    <Content><![CDATA[]]></Content>
    <ArticleCount>{$nr}</ArticleCount>
    <Articles>
$item_str
    </Articles>
    <FuncFlag>{$fun}</FuncFlag>
</xml> 
eot;
    }
	
	private function checkSignature()
	{
		return true;
		
        $args = array("signature", "timestamp", "nonce");
        foreach ($args as $arg)
            if (!isset($_GET[$arg]))
                return false;

        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];
		
		$tmpArr = array($this->token, $timestamp, $nonce);
		sort($tmpArr);
		$tmpStr = implode( $tmpArr );
		$tmpStr = sha1( $tmpStr );
		
		if( $tmpStr == $signature ){
			return true;
		}else{
			return false;
		}
	}
}

?>