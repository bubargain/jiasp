<?php if (!defined('THINK_PATH')) exit();?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<meta name="keywords" content="空间设计,家居,居家装修,室内设计,设计师,装修,维护,家具,图片分享" />
<meta name="description" content ="佳空间是一个室内空间设计的视觉分享及社交化电话平台。我们帮助设计师和大众建立起沟通的桥梁，以设计为媒介，帮助用户发现心目中理想的家居风格，并寻找到合适的家修供应商" />

<link rel='stylesheet' type='text/css' href='__PUBLIC__/CSS/1.css' />
<link rel='stylesheet' type='text/css' href='__PUBLIC__/CSS/topicNavigationSpace.css' />
<link rel='stylesheet' type='text/css' href='__PUBLIC__/CSS/3.css' />
<link rel="stylesheet" media="screen" type="text/css" href="__PUBLIC__/zoomPic/css/zoomimage.css" />
 <link rel="stylesheet" media="screen" type="text/css" href="__PUBLIC__/zoomPic/css/layout.css" />
    <link rel="stylesheet" media="screen" type="text/css" href="__PUBLIC__/zoomPic/css/custom.css" />


         
	<style type="text/css">
	a{text-decoration:none; color:gray;}
	a:hover{color:#F60;}
	div.page{border:1px solid #d4d4d4; background:#333;color:white; padding:5px 15px;float:auto; width:800px;margin:2px;text-align:right}
	</style>

<script type="text/javascript" src="__PUBLIC__/zoomPic/js/jquery.js"></script>
<script type="text/javascript" src="__PUBLIC__/zoomPic/js/eye.js"></script>
<script type="text/javascript" src="__PUBLIC__/zoomPic/js/utils.js"></script>
<script type="text/javascript" src="__PUBLIC__/zoomPic/js/zoomimage.js"></script>
<script language='javascript' type='text/javascript' src='__PUBLIC__/JS/main.js'></script>
<script language='javascript' type='text/javascript' src='__PUBLIC__/JS/buzzAjaxSpace.js'></script>

<script language='javascript' type='text/javascript' src='__PUBLIC__/JS/standardHeader.js'></script>
<script language='javascript' type='text/javascript' src='__PUBLIC__/JS/topicNavigationSpace.js'></script>
<script language='javascript' type='text/javascript' src='__PUBLIC__/JS/Browse.js'></script>
			<meta name="robots" content="All" /> 
		    <meta name="rating" content="General" />
		    			<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
			<link rel="shortcut icon" href="__PUBLIC__/images/favicon.png" type="image/x-icon"/>
			
						
	        <title>空间-聚集国内外设计师的居家设计分享平台</title>

  
		</head>
<body>
				
<?php echo ($head); ?>

	
<div id='mainArea' class='tallHeader'>
	<!-- 内容主体 -->

	<div id='mainContent'>
	<!-- 左边栏 -->		
		<div id="left2ColBContent">
			<div id='roomFilter' class="filterBox filterBoxList"><div class="filterBoxHeader">按房屋类型</div>
				<ul class="filterBoxBody">
					<li class='filterBoxEntity'><a class='filterBoxLabel' href='__ROOT__/Space/kitchen'>厨房</a></li>
					<li class='filterBoxEntity'><a class='filterBoxLabel' href='__ROOT__/Space/bath'>卫生间</a></li>
					<li class='filterBoxEntity'><a class='filterBoxLabel' href='__ROOT__/Space/bedroom'>卧室</a></li>
					<li class='filterBoxEntity'><a class='filterBoxLabel' href='__ROOT__/Space/living'>客厅</a></li>
					<li class='filterBoxEntity'><a class='filterBoxLabel' href='__ROOT__/Space/dining'>餐厅</a></li>
					<li class='filterBoxEntity'><a class='filterBoxLabel' href='__ROOT__/Space/kids'>儿童房</a></li>
					<li class='filterBoxEntity'><a class='filterBoxLabel' href='__ROOT__/Space/home-office'>书房</a></li>
					<li class='filterBoxEntity'><a class='filterBoxLabel' href='__ROOT__/Space/closet'></a></li>
					<li class='filterBoxEntity filterBoxEntityHidden'><a class='filterBoxLabel' href='__ROOT__/Space/basement'>阳台</a></li>
					<li class='filterBoxEntity filterBoxEntityHidden'><a class='filterBoxLabel' href='__ROOT__/Space/StoreRoom'>储藏室</a></li>
					<li class='filterBoxEntity filterBoxEntityHidden'><a class='filterBoxLabel' href='__ROOT__/Space/WholeRoom'>整体设计</a></li>
					<li class='filterBoxEntity filterBoxEntityHidden'><a class='filterBoxLabel' href='__ROOT__/Space/OtherDesign'>其他</a></li>
					<li class='filterBoxEntity' id='roomFilterMore'><a class='filterBoxLabel' href='javascript:;' onclick='HZ.navigation.Utils.expandBox("roomFilter")'>More Rooms <span class='downChevron'>&nbsp;&nbsp;&nbsp;</span></a></li>	
				</ul>
			</div>	<!--  end of roomFilter -->	
			</div> <!--  end of left2ColBContent -->
			
			<!--右边栏 -->
			<div id="right2ColBContent" class="browsePhotos">
				
				<div class="browseListBody" id="browseSpacesContext">
					<!--  sample one -->
                    
          	 <?php echo ($item); ?>
					
					
					<div class="result page"><?php echo ($page); ?></div>
				</div> <!--  end of browseListBody -->
			</div> <!--  end of right2ColBContent -->
			
			
			<script>
							//设置点击图片显示大图的方式
							$('a.customGal').zoomimage({
									controlsTrigger: 'mouseover',
									className: 'custom',
									shadow: 40,
									controls: false,
									opacity: 1,
									centered:true,
									beforeZoomIn: function(boxID) {
										$('#' + boxID)
											.find('img')
											.css('opacity', 0)
											.animate(
												{'opacity':1},
												{ duration: 500, queue: false }
											);
									},
									beforeZoomOut: function(boxID) {
										$('#' + boxID)
											.find('img')
											.css('opacity', 1)
											.animate(
												{'opacity':0},
												{ duration: 500, queue: false }
											);
									}
								});
							
				 </script>
			
			
			
		</div> <!--  end of mainContent -->
	</div><!--  end of mainArea -->


<div id='mainContentSeparator'></div>

<?php echo ($foot); ?>
</body>
</html>