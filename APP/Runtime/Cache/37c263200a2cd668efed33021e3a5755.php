<?php if (!defined('THINK_PATH')) exit();?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<meta name="keywords" content="空间设计,家居,居家装修,室内设计,设计师,装修,维护,家具,图片分享" />
<meta name="description" content ="佳空间是一个室内空间设计的视觉分享及社交化电话平台。我们帮助设计师和大众建立起沟通的桥梁，以设计为媒介，帮助用户发现心目中理想的家居风格，并寻找到合适的家修供应商" />

<link rel='stylesheet' type='text/css' href='__PUBLIC__/CSS/1.css' />
<link rel='stylesheet' type='text/css' href='__PUBLIC__/CSS/2.css' />
<link rel='stylesheet' type='text/css' href='__PUBLIC__/CSS/3.css' />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script type="text/javascript">
if (typeof jQuery === 'undefined')
{
	var e = document.createElement('script');
	e.src = 'localhost/Public/JS/jquery-1.7.1.min.js';
	e.type='text/javascript';
	document.getElementsByTagName("head")[0].appendChild(e);
}
</script>

<link href="__PUBLIC__/CSS/Expert/css.css" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="__PUBLIC__/JS/slide.js"></script>
<script language="javascript" src="__PUBLIC__/JS/weibo-act-1.1.0.js"></script>
<script language="javascript" src="__PUBLIC__/JS/artDialog4.1.7/jquery.artDialog.js?skin=idialog"></script>
<script language="javascript" src="__PUBLIC__/JS/artDialog4.1.7/plugins/iframeTools.js"></script>
<link href="http://www.xinwo.com/i_style/tc_css.css" rel="stylesheet" type="text/css">

<script type="text/javascript" src="__PUBLIC__/JS/expert/expertList.js"> </script> 



			<meta name="robots" content="All" /> 
		    <meta name="rating" content="General" />
		    <link rel="shortcut icon" href="__PUBLIC__/images/favicon.png" type="image/x-icon"/>
			
						
	        <title>空间-聚集国内外设计师的居家设计分享平台</title>
<noscript> 
<img src="http://b.scorecardresearch.com/p?c1=2&c2=10128082&c3=&c4=&c5=&c6=&c15=&cv=2.0&cj=1" /> 
</noscript> 
  
		</head>
			<body>
				
<?php echo ($head); ?>




<style type="text/css">
#bg{width:100%;height:100%;top:0px;left:0px;position:absolute;filter: Alpha(opacity=50);opacity:0.5; background:#000000; display:none; z-index:1;}
#popbox{position:absolute;width:958px; height:400px; left:12%;  top:50%;margin:-200px 0 0 -200px;   display:none; background:#666666;}


ul,li {list-style-type:none; text-transform:capitalize;}
.clear {clear:both; *display:inline;/*IE only*/}

/*menu*/
#nav { display:block;}
#nav .jquery_out {float:left;display:block;}



#nav .mainlevel {float:left;  /*IE6 only*/ /*IE7 only*/}


#nav .mainlevel ul {display:none; position:absolute; top:34px;}


.log {text-align:center; color:skyblue; line-height:24px; text-transform:capitalize; margin:50px auto;}


img{ border:0px; margin:0px; padding:0px;}

</style>


<!------------------------------------------------->

<input type="hidden" name="reg_type" id="reg_type" value="">
<input type="hidden" name="js_uid" id="js_uid" value="" />
<input type="hidden" name="username" id="username" value="" />
<input type="hidden" name="truename" id="truename" value="" />
<input type="hidden" name="user_photo" id="user_photo" value="" />

 <!--弹出层标签 page-->
<div id="page"></div>
<!--
<a id="returnTop" href="javascript:;">回到顶部</a>--> 
<!------------------------------------------------->



<div class="main_top"  id="mx" style="position:fixed;">

<style type="text/css">
#bg{width:100%;height:100%;top:0px;left:0px;position:absolute;filter: Alpha(opacity=50);opacity:0.5; background:#000000; display:none; z-index:1;}
#popbox{position:absolute;width:958px; height:400px; left:12%;  top:50%;margin:-200px 0 0 -200px;   display:none; background:#666666;}
#signin_menu {
	-moz-border-radius-topleft:5px;
	-moz-border-radius-bottomleft:5px;
	-moz-border-radius-bottomright:5px;
	-webkit-border-top-left-radius:5px;
	-webkit-border-bottom-left-radius:5px;
	-webkit-border-bottom-right-radius:5px;	border:1px transparent;

	position:absolute;
	width:174px; z-index:10000000000000000000000000;
	text-align:left;

	top: 38px; 
	right: -38px; 

	margin-right: 150px; *z-index:10000000;
	*top: 40px;
	color:#789;

}
#topnav:hover #signin_menu{display:block;}
#topnav #signin_menu{display:none;}
.msgs{width:31px; height:20px; line-height:20px; text-align:center; background:__PUBLIC__/images/main_046.png; position:absolute; top:12px; left:130px; font-size:12px; color:#fff; font-weight:bold;}
.msg{width:28px; height:15px; line-height:15px; text-align:center; background:__PUBLIC__/images/main_46.png; position:absolute; top:2px; left:730px; font-weight:bold; font-size:12px;}
.msg a:link{ color:#fff;}
.msg a:visited{ color:#fff;}
.msg a:hover{ color:#fff;}
</style>





<script type="text/javascript" >
$(document).ready(function() {	
	
	if($(".mian2011").length > 0){
		pai();
		if(request('action') == 'all_tp' || request('action') == 'tupu'){
		tug_gun('#page_num','#page_url','#bot');
		}else if(request('action') == 'fensi'){
		fensi_gun('#page_num','#page_url','#bot');
			}else{
		gun('#page_num','#page_url','#bot');
			}
	}
		
	if($("#gotopbtn").length > 0){
	
		bot_sbu();
		}
		
/*if(request('action') == 'cablet' ){
		var id=request('id');		
		img_yb_load(id);
}*/

//初始化用户名
   if($("#username").length>0)
         {	                      
	   publics();
       }
});
</script>

<div class=" hes_dao" style=" position:relative; z-index:10000000000000000000000000000000000000000000000000000000000000000">

</div>

 <script type="text/javascript">
			$(document).ready(function()
			{
				
				$("#form1").load('__ROOT__/APP/Tpl/Expert/cityList.html');
			});
		</script>





<div class="main_top2">

 <div class="main_top2_2" style=" position:relative;">
 	
 	<form name="form1" id="form1" action="__ROOT__/Expert/expertList?action=zhuanjia" method="post"> 
   	
	</form>

<!--<div style=" width:12px; height:22px; position:absolute; left:5px; top:13px; background:#fff;"></div>-->

</div>
  </div>
  
</div>
<div id="bg">   </div>
      
      
   <div id="popbox" style=" width:958px; height:395px; position:absolute;  margin-left:auto; margin-right:auto;  z-index:1; display:;" ><img src="i_images/main_wxtu1.png" border="0" usemap="#Map" />
<map name="Map" id="Map"><area shape="rect" coords="923,4,954,38" href="#" onclick="pupclose()"/></map></div>
<script type="text/javascript">
function pupopen(){
	        document.getElementById("bg").style.display="block";
            document.getElementById("popbox").style.display="block" ;	
	}

function pupclose(){
document.getElementById("bg").style.display="none";
            document.getElementById("popbox").style.display="none" ;	
}
</script>
<div style=" width:100%; height:54px; position:fixed;float:left; z-index:1; display:none; " id="mx1">
<div style=" width:100%; background:#fff;  overflow:hidden;">

  
  </div> 
  
 <div style=" width:100%; background:url(i_images/main_258.png); height:6px;"></div>
</div>
<div style=" height:90px;visibility:hidden;"></div>  <div style=" width:100%;  height:6px;"></div>

<!---->

<div class="main_mid">
<div class="main_zhuanjia" >
<div class="main_zhuanjiam">

<div class="main_zhuanjia2"  style="min-height:600px">
<?php echo ($count); ?><br/>
<?php echo ($items); ?>






</div> <!-- end of main_zhuanjia2 :designer list -->
<!--分页-->
	<div class="main_zhuanjia3 result page">
	
		<?php echo ($page); ?>
	</div>
<!--end-->
</div>
</div>
</div>



<style>


.rollBox{width:1000px;overflow:hidden;}

.rollBox .Cont{width:1000px;overflow:hidden;float:left;}
.rollBox .ScrCont{width:10000000px;}
.rollBox .Cont .pic{width:125px;float:left;text-align:center; margin-left:9px; margin-right:9px;}
.rollBox .Cont .pic img{display:block;margin:0 auto; border:0px;}


.rollBox #List1,.rollBox #List2{float:left;}


</style>

    
 <?php echo ($foot); ?>
</body>
</html>