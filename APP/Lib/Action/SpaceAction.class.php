<?php
header("Content-Type:text/html; charset=utf-8");
import ('Lib.Widget.gallery',APP_PATH,'.php');
	class SpaceAction extends Action {
		
		public function _empty(){
           
            $this->index();
        }
		
        
        /*
         * Display index page
         * 未选择细分分类的主页面
         */
		public function index($p=25){
			
			import("@.ORG.Page");       //导入分页类
	        $Form   =   M('Pics');
	        $count  = $Form->count();    //计算总数
	        $limit =6;//一页显示6张图片
	        $Page = new Page($count, $limit); 
      
        // 模拟设置分页额外传入的参数
		
	        $Page->parameter    =   'search=key&name=thinkphp';
	        // 设置分页显示
	        $Page->setConfig('header', '张图片');
	        $Page->setConfig('first', '<<');
	        $Page->setConfig('last', '>>');
	        $page = $Page->show();
	        $this->assign("page", $page);
        
	    	$this->head = $this->fetch("Index:head");
			$this->foot = $this->fetch("Index:foot");
	    	
			$showList = $this->choosePic($p=$Page->firstRow,$limit=$Page->listRows);
			$Item = new Item();
			$this->item =  $Item->getItems($showList);
			
			$this->display();  
	    	
	    }
	    
	    /*
	     * 选择要展示的图片，并返回图片id
	     * Input:
	     * 		$p     int,开始位置
	     *      $type  int,
	     *      $room  int,房间类型
	     *      $sytle int,房间风格
	     *      $size  int,房间大小
	     *      $hardDesignCost int,硬装价格区间
	     *  Output:
	     *  	成功返回 Array数组，包含多个图片的id。失败返回Null
	     */
	    
	    public function choosePic($p=0,$limit=6,$size=0,$room=0,$style=0,$type=0,$hardDesignCost=0)
	    {
	    	//如果用户选择了筛选条件，则查询时添加对应选项
	    	if($size != 0) $condition['size'] = $size;
	    	if($room != 0 )$condition['room'] = $room;
	    	if($style!= 0 )$condition['style'] = $style;
	    	if($hardDesingCost != 0) $condition['hard_design_cost'] = $hardDesignCost;
	    	if($type != 0) $condition['type']=$type;
	    	
	    
	    	$pics = M('Pics');
	    	$res = $pics->where($condition)->order('likes desc')->limit($p.','.$limit)->field("pic_id")->select();
	    	//格式化输出
	    	$formatRes =array();
	    	foreach($res as $oneR)
	    	{
	    		$formatRes[]=$oneR['pic_id'];
	    	}
	    	return $formatRes;
	    }
	    
	    
	    
	    
	   
	}
	
	
	//生成一个图片元素的html展示
	class Item {
		
		
		/*
		 * 获取多个图片信息
		 * Input: $ItemList (Array数组，包含多张图片的pic_id）
		 * Output: 图片展示的html代码
		 *  
		 */
		
		public function getItems($ItemList)
		{
			$res="";
			foreach ($ItemList as $Item)
			{
				$res =$res.$this->getOneItem($Item);
			}
			return $res;
		}
		
		/*
		 * 获取单张图片信息
		 * Input: $ItemList (Int类型，包含单张图片的pic_id）
		 * Output: 图片展示的html代码
		 *  
		 */
	    public function getOneItem($number)
	    {
	    	//读取pic信息
	    	$pic = M('Pics');
	    	$res = $pic->where('pic_id='.$number)->find();
	    	if($res!=null && $res!= false ) //找到对应图片
	    	{
				//如果是本地测试环境，则用本地链接
				if(!C('SAE_OR_NOT'))
	    			$link = str_replace('./', C("WEBSITE_ADD"), $res['link']);
				else 
					$link = C("PIC_SERVER").$res['link'];
	    		$th_imgURL = $link.'s_'.$res['name']; //small size thumb address
				$md_imgURL = $link.'m_'.$res['name']; //middle size pic address
	    		$likeNumber = $res['likes'];
		    	
	    		//获取上传者信息	
	    		$user=M('User');
	    		$uRes= $user->where('user_id='.$res['uploader_id'])->find();    	
	    		$userName = $uRes['name'];
		    	$userPage = $uRes['link'];
		    	$userHeadURL=$uRes['head_link'];
		    	
		    	//自定义类，用于将ID转变为文字描述
		    	$IdTransfer = new IdToItem(); 
		    	
		    	//获取硬装成本价格区间ID
		    	$hardDesignCostId = $res['hard_design_cost'];
		    	//将ID转变成价格区间描述
		    	$hardDesignCost = $IdTransfer->getHardDesignCost($hardDesignCostId);
		    	
		    	$sizeId = $res['size'];   	
		    	$roomSize = $IdTransfer->getSize($sizeId);
		    	
		    	//读取图片中涉及的产品列表
		    	$productList = " <span style=' float:left;margin:0 0 0 10px'>家具及周边列表:</span><br/><span>
											<ul>";
		    	$product = M('Product');
		    	$proRes = $product->where('pic_id='.$res['pic_id'])->select();
		    	foreach($proRes as $oneProRes)
					$productList =	$productList."<li><a href='http://".$oneProRes['link']."' target='_blank' class=\"colorLink\">".$oneProRes['name']."</a></li>";
				$productList = $productList."</ul></span>	";
		    	
				
		    	$desc = $res['desc'];
		    	
		    	$item = "<div class=\"ic whiteCard xl first\" style=\"width:830px\">
							<div class=\"imageWrapper black\" oncontextmenu=\"PhotoContextMenu.show(event,&quot;988515&quot;);return false;\">
								<div class=\"imageArea\">
									<a class=\"customGal\" title='by ".$userName."' href='".$md_imgURL."'>
										<img class=\"space\" src='".$th_imgURL."' sid=\"988515\" height=\"440\" width=\"550\" onmousedown=\"preventImageDrag(event)\" ondragstart=\"return false\" onselectstart=\"return false\">
																			</a>
								</div>
								<div class=\"promote\" onclick=\"HZ.auth.Manager.signup(1)\" style=\"top:175px;left:105px; width:300px\">
									<span class=\"likeIt\">喜欢?</span><br>
									<a href=\"__ROOT__/Index/login\"  class=\"buzzLink\">保存到我的创意册 »</a>
								</div>
									</div>
								<!-- 右侧说明栏 -->
							   <div class=\"photoMeta\">		
									<div class=\"uploader\">
										<a href='".$userPage."'>
											<img class=\"userThumb hzHouzzer hzHCUserImage\" src='".$userHeadURL."' data-type=\"profile\" data-id=\"denisederingdesign\">
										</a>
											<span class=\"userName\"> by <a class=\"colorLink hzHouzzer hzHCUserName\" href='".$userPage."' data-type=\"profile\" data-id=\"denisederingdesign\">".$userName."</a>
											</span>
									</div> <!--  end of uploader -->
									
									<div class=\"stats\">
										<span class=\"ideabooks\">
											<a class=\"viewBuzzes colorLink\" >".$likeNumber."</a>人喜欢
										</span>
										<br>
										<div class=\"vspace10\"></div>
										
									
									</div> <!-- end of stats -->
									
									<div class=\"photoDescription\" style=\"min-height: 80px;\"> 
									    <span style=' float:left;margin:0 0 0 10px'>设计师： <a href=\"\" class=\"colorLink\">".$res['designer']." </a></span><br/>
										<span style=' float:left;margin:0 0 0 10px'>硬装参考价格： <a href=\"\" class=\"colorLink\">".$hardDesignCost." 元/平</a></span><br/>
										<span style=' float:left;margin:0 0 0 10px'>房间大小： <a href=\"\" class=\"colorLink\">".$roomSize." </a></span><br/>
										<div class=\"vsspace10\"></div>
										
										".$productList."
																		
									</div> <!--  end of photoDescription -->
									
									<div class=\"photoDescription\" style=\"height: 115px;\">
										<span style=' float:left;margin:0 0 0 10px'>设计者描述：<br/>".$desc."</span>
									</div> <!--  end of photoDescription -->
									<div class=\"shareBtns\">
										<a class=\"email textIcon first\" title=\"Email this photo\" href=\"javascript:;\" onclick=\"javascript:showSendSpaceEmailDialog(988515, 988515, false);return false;\">Email</a>
										<span class=\"pipe\">|</span>
										
										<a class=\"f icon\" href=\"javascript:;\" onclick=\"HZ.spaceActions.Share.openShareWindowForSpace(1,988515);return false;\" title=\"Share a link on weibo\"></a>
										<span class=\"pipe\">|</span>
										
									</div><!--  end of shareBtns -->	
							</div><!--  end of photoMeta -->
							<div class=\"photoFooter\">
								<a class=\"colorHover noHoverLink\" title=\"Go to photo page\" href=\"__ROOT__/Space/988515/Garden-Design-traditional-landscape-chicago\">»</a>
							</div>
	</div> <!-- end of sample one  -->";
		    	return $item;
		    	
	    	}//end of if
	    }
	}