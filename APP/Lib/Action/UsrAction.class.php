<?php
header("Content-Type:text/html; charset=utf-8");
import ('Lib.Widget.gallery',APP_PATH,'.php');

	class UsrAction extends Action {
		
		//display upload.html page
		public function upload()
		{
			$this->head = $this->fetch('Index:head');
			$this->foot = $this->fetch('Index:foot');
			
			$this->display();
		}
		
		//display desc.html page
		public function desc()
		{
			$this->head = $this->fetch('Index:head');
			$this->foot = $this->fetch('Index:foot');
			$pic_id = $_GET['_URL_'][3];
			$this->pic_id = $pic_id;
			if(isset($_SESSION['user_id']))  //防止盗链
			{
				$user_id = $_SESSION['user_id'];
				//防止修改他人的图片
				if($this->verifyAuthor($pic_id,$user_id))
				{
					$Pic = M('Pics');
					$res = $Pic->where('pic_id='.$pic_id." AND uploader_id=".$user_id)->find();
					$link = $res['link'];
					//如果是本地测试环境，则使用本地地址
					if(!C("SAE_OR_NOT"))
						$link2 = str_replace('./',C('WEBSITE_ADD') , $link);
					else
						$link2=C('PIC_SERVER').$link;
					$imageLink= $link2.'s_'.$res['name']; // get image address (small size)	

					
					$this->image = $imageLink;
					$this->display(); 
				}
				else 
					$this->error('You have no right to modify this picture',U('Usr:upload'));
			
				
			}
		}
		
		
		/*
		 * Check whether user has the right to modify one picture
		 * 
		 */
		
		public function verifyAuthor($pic_id=24,$user_id=2)
		{
			$User = M('Pics');
			$res = $User->where('pic_id='.$pic_id." AND uploader_id=".$user_id)->find();
			if($res != null && $res != false)
				return true;	
			else
				 return false;
		}
		
		/*
		 * Form reaction function
		 * upload file into picture folder ,meanwhile set up db record
		 */
		Public function picUpload(){
				
			if(isset($_SESSION['user_id']))
			{	
				$userId = $_SESSION['user_id'];
				$roomType = $_REQUEST['galleryId'];
				
				
				$savePath = './Public/Uploads/u'.$userId.'/'.$roomType.'/';// 设置附件上传目录
				
				import('@.ORG.UploadFile');
				$upload = new UploadFile();// 实例化上传类
				$upload->maxSize  = 10485760 ;// 设置附件上传大小,small than 10mb
				$upload->allowExts  = array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型
				$upload->savePath =  $savePath;
				$upload->imageClassPath     = '@.ORG.Image';
				
				$upload->thumb = true;
				$upload->thumbRemoveOrigin  = true;
				//set thumb info
				$upload->thumbMaxWidth = '1024,500'; //缩略图片大小
				$upload->thumbMaxHeight = '2048,1000';
				$upload->thumbPrefix = 'm_,s_';
				//$upload->thumbPath = './Public/Uploads/Thumb/u'.$userId.'/'.$roomType.'/';
				$upload->saveRule  = 'uniqid';
				
				 if(!$upload->upload()) {// 上传错误提示错误信息
				$this->error($upload->getErrorMsg());
				 }else{// 上传成功 获取上传文件信息
				$infoList =  $upload->getUploadFileInfo();
				 }
				 
				 // 保存表单数据 包括附件数据
				$pic = M("Pics"); // 实例化User对象
				
				foreach($infoList as &$info)
				{
					$data['name'] = $info['savename']; // 保存重命名后的图片，不加前缀
					$data['createat'] = date('Y-m-d H:i',time());
					$data['uploader_id']=$_SESSION['user_id'];
					$data['link']= $info['savepath'];
					$data['room'] =$roomType;
					$pic_id = $pic->add($data); // 写入用户数据到数据库
					$_POST['pic_id'] = $pic_id;
				}
				$tmpDb = array('pic_id' => $pic_id);
				$this->redirect('Usr/desc', $tmpDb,0,'Upload Succeed...');  
			 }
			else 
			{
				$this->redirect('Index/login','',3,"Please login first!");
			}
		}
		
		public function test()
		{
			echo time();
		}
		
		/*
		 * Form reaction
		 * Add description to picture uploaded and save into db table 'pics'
		 */
		public function descUpload()
		{
			if(isset($_REQUEST['txtPicId']))
			{
				$pic_id = $_REQUEST['txtPicId'];
				
				
				//Update picture description
				$pic = M('Pics');
				$data['desc'] = $_REQUEST['taDesc'];
				$data['designer']=$_REQUEST['ipDesigner'];
				$data['hard_design_cost'] = $_REQUEST['stHardPartCost'];
				$data['size'] = $_REQUEST['stRoomSize'];
				$data['style'] = $_REQUEST['stRoomStyle'];
				$res = $pic->where('pic_id='.$pic_id)->save($data);
				
				//Add products which included in this picture
				$productNum = $_REQUEST['txtTRLastIndex'];
				for($i=0;$i<$productNum; $i++)
				{
					$product = M('Product');
					$pdata['name']=$_REQUEST['ipProductName'.$i];
					$pdata['brand']=$_REQUEST['ipProductBrand'.$i];
					$pdata['link']=$_REQUEST['ipProductSite'.$i];
					if($pdata['name'] != '' && $pdata['brand'] != '')
					{
						$pdata['pic_id'] = $pic_id;
						$product ->add($pdata);		
					}
				}
				
				
				if($res != false)
				{
					$this->success('添加完成！您可以继续添加其他设计图...',U("Usr/upload"));
				}
				else
					$this->error("添加图片描述失败");
			}
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	}