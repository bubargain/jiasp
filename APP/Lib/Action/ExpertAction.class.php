<?php
header("Content-Type:text/html; charset=utf-8");
	class ExpertAction extends Action {
		
		/*
		 * 渲染函数
		 * display index.html page
		 */
		public function index(){
			$this->redirect('Expert:expertList');
		}
		
		/*
		 * 渲染函数
		 * display et.html page
		 * Author:Daniel Ma Date: 2013/04/29
		 */
		public function et()
		{
			$this->head = $this->fetch("Index:head");
			$this->foot = $this->fetch("Index:foot");
			$this->display();
		}
		
		/*
		 * 渲染函数
		*  显示expertlist page
		*/
		public function expertList()
		{
			 //导入分页类
			import("@.ORG.Page");      
	        $Form   =   M('User');
	        $count  = $Form->count();    //计算总数
	        $limit =10;//一页显示6张图片
	        $Page = new Page($count, $limit); 
      
     	   // 模拟设置分页额外传入的参数
		
	        $Page->parameter    =   '';
	        // 设置分页显示
	        $Page->setConfig('header', '位设计师 ');
	        $Page->setConfig('first', '<<');
	        $Page->setConfig('last', '>>');
	        $page = $Page->show();
	        $this->assign("page", $page);
	        
	        $showList = $this->chooseItem($p=$Page->firstRow,$limit=$Page->listRows);
	        $itemsHTML="";
	        //根据uid列表，生成专家list的展示html页面
	       
	        foreach($showList as $oneItem)
	        {
	        	
	        	$itemsHTML=  $itemsHTML . $this->expertItem($oneItem);
	        }
	       
	      
	        
			$this->head = $this->fetch("Index:head");
			$this->foot = $this->fetch("Index:foot");
			$this->items = $itemsHTML;
			$this->display();
		}
		
		/*
		 * 功能函数：
		 * 筛选要显示的专家，并返回uid数组
		 * @INPUT  p,开始页数 默认为0
		 * @INPUT limit 每页显示数量，默认为10条
		 * @INPUT city 专家所在城市，默认为空 即全部城市
		 * @OUTPUT ARRAY数组，包含 user_id
		 */
		public function chooseItem($p=0,$limit=10,$city='')
		{
			if($city != "") $condition['city'] = $city;
			$user= M('User');
	    	$res = $user->where($condition)->order('user_id desc')->limit($p.','.$limit)->field("user_id")->select();
	    	//格式化输出
	    	$formatRes =array();
	    	foreach($res as $oneR)
	    	{
	    		$formatRes[]=$oneR['user_id'];
	    	}
	    	return $formatRes;
		}
		
		
		/*
		 * 功能函数：
		 * 根据uid查询并生成一个表单项
		 * @uid input, user id
		 * return  html code
		 */
		public function expertItem($uid)
		{
			
			$user = M('user');
			$u_res=$user->where('user_id='.$uid)->find(); //从user表中取出用户信息
			$designer_name = $u_res['name'];
			$designer_type = $u_res['author_type'];
			$designer_addr = $u_res['address'];
			$designer_co = $u_res['company'];
			$designer_desc = $u_res['desc'];
			
			$html="<!-- start of one designer desc -->
			<div class=\"main_zhuanjia2m\">  

<div class=\"main_zhuanjia2m_1\">
  <ul>
    <li class=\"main_zhuanjia2m_1m\">
    
    <a href=\"__ROOT__/Expert/et\" target=\"_blank\">
    <img src=\"\" width=\"116\" height=\"145\" /></a>
    
    
    
    </li>
     <li class=\"main_zhuanjia2m_1n\">
     <p class=\"main_zhuanjia2m_1nw\">
     <a href=\"__ROOT__/Expert/et\" target=\"_blank\">".$designer_name."</a></p>
     <p class=\"main_zhuanjia2m_1ne\">$designer_type</p>
     <p class=\"main_zhuanjia2m_1nq\">来自：$designer_addr</p>
     <p class=\"main_zhuanjia2m_1nq\">公司：$designer_co</p>

     		<span class=\"add_gz55813\"><p class=\"main_zhuanjia2m_1nr\" onclick=\"return addattention(55813,'false')\"></p></span>
	  
     </li>
  </ul>
  <ul>

  <li style=\" font-size:10px; color:#B2B2B2; padding-top:15px; font-size:12px; clear:both;\">个人简介&nbsp; &nbsp;<span style='font-style:italic;'>04月28日 10:42</span></li>
  <li class=\"main_zhuanjia2m_1d\">".$designer_desc."</li>
  </ul>
  </div>
  <!-- start of three thumb picture -->
<div class=\"main_zhuanjia2m_2\">
  <ul>
	    <li  style='height:220px;float: left; width: 146px; margin: 0 18px 0 0; overflow: hidden; display: block;padding: 0;'>
	    
    
   <div class=\"main_zhuanjia2m_2mn\"> 
   <div style=\" list-style:0px; line-height:0px;\"> <a href=\"http://www.xinwo.com/index.php?module=index&action=big_img&id=102445\" target=\"_blank\">
   <img src=\"http://www.xinwo.com/templates/weibo/SWFUpload/file/2013-04/s/xinwo13671168985968.jpg\" width=\"141\" /></a>
    </div>
    
      <div style=\" line-height:0px; font-size:0px; height:2px;\"><img src=\"i_images/main_199.jpg\" width=\"146\" height=\"2\" /></div>
	</div>
    </li> 
	    <li  style='height:220px;float: left; width: 146px; margin: 0 18px 0 0; overflow: hidden; display: block;padding: 0;'>
    
   <div class=\"main_zhuanjia2m_2mn\"> 
   <div style=\" list-style:0px; line-height:0px;\"> 
   <a href=\"http://www.xinwo.com/index.php?module=index&action=big_img&id=102444\" target=\"_blank\">
   	<img src=\"templates/weibo/SWFUpload/file/2013-04/s/xinwo13671168539497.jpg\" width=\"141\" />
   	</a>
    </div>
    
      <div style=\" line-height:0px; font-size:0px; height:2px;\">
      	<img src=\"__PUBLIC__/images/main_199.jpg\" width=\"146\" height=\"2\" /></div>
		</div>
    </li> 
	    
	    <!--<li class=\"main_zhuanjia2m_2mn\"><img src=\"i_images/main_123.jpg\" width=\"141\" height=\"150\" /></li>     
    <li class=\"main_zhuanjia2m_2mn\"><img src=\"i_images/main_123.jpg\" width=\"141\" height=\"189\" /></li>   --> 
  </ul>
  </div>
</div> <!-- end of one designer desc -->
";
		
			return $html;
		}
		
	}