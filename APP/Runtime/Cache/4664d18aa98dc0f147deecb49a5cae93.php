<?php if (!defined('THINK_PATH')) exit();?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns:og="http://ogp.me/ns#" xmlns:fb="http://ogp.me/ns/fb#">
<head >

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<meta name="keywords" content="空间设计,家居,居家装修,室内设计,设计师,装修,维护,家具,图片分享" />
<meta name="description" content ="佳空间是一个室内空间设计的视觉分享及社交化电话平台。我们帮助设计师和大众建立起沟通的桥梁，以设计为媒介，帮助用户发现心目中理想的家居风格，并寻找到合适的家修供应商" />

<link rel='stylesheet' type='text/css' href='__PUBLIC__/CSS/mainUpload.css' />
<link rel='stylesheet' type='text/css' href='__PUBLIC__/CSS/topicNavigationUpload.css' />
<link rel='stylesheet' type='text/css' href='__PUBLIC__/CSS/uploadUpload.css' />
<link rel='stylesheet' type='text/css' href='/jiasp2/Public/CSS/desc.css' />
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
<script language='javascript' type='text/javascript' src='__PUBLIC__/JS/mainUpload.js'></script>
<script language='javascript' type='text/javascript' src='__PUBLIC__/JS/buzzUpload.js'></script>
<script language='javascript' type='text/javascript' src='__PUBLIC__/JS/standardHeaderUpload.js'></script>
<script language='javascript' type='text/javascript' src='__PUBLIC__/JS/topicNavigationUpload.js'></script>
<script language='javascript' type='text/javascript' src='__PUBLIC__/JS/swfuploadUpload.js'></script>


			<meta name="robots" content="All" /> 
		    <meta name="rating" content="General" />
		    			<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
			<link rel="shortcut icon" href="__PUBLIC__/images/favicon.png" type="image/x-icon"/>
			
						
	        <title>空间-聚集国内外设计师的居家设计分享平台</title>
<noscript> 
<img src="http://b.scorecardresearch.com/p?c1=2&c2=10128082&c3=&c4=&c5=&c6=&c15=&cv=2.0&cj=1" /> 
</noscript> 
  
		</head>
			<body>
				
	<?php echo ($head); ?>
<div id='mainArea' class='shortHeader'>	
	<div id='mainContent'>
		<div class="progression">
		<span class="step2">步骤一：上传设计图片</span>
		<span class="step1">
							步骤二: 添加设计描述
						</span>
		</div><!--  end of progression -->
		
		<form class="stdForm gallery" method="post"  enctype="multipart/form-data" id="upload" name="upload" action="__ROOT__/Usr/descUpload">
		
		<div class="formSection">
				<table class="hzChoiceTabs">
					<tr>
							<td class="hzChoice toGallery selected">
				<div class="expanded">
					<div class="hzChoiceTitle">图片已保存，请继续添加说明</div>
					<div class="hzChoiceText">谈谈您的创意来源，设计感悟，使用的元素等,让大众更懂你！</div>
				</div>
				
			</td>
				
						</tr>
				</table>
			</div>
		<div id='leftPicCol'>
       		<br/>
			<span class="colorLink">您上传的图片：</span><br/><br/>
			<img src="<?php echo ($image); ?>"></img>
			
		</div> <!-- end of leftPicCol -->
		<div id="rightPicCol" style=" min-height:350px">
            <div class="formSection padded">
            	<span>设计者:&nbsp;&nbsp;&nbsp;&nbsp;</span>
               
              <input style="width:100px" value="本人" type="text" name="ipDesigner"/>
           </div>
			<div class="formSection padded">
            
				<span>设计描述：</span>
				<textarea rows="5" cols="30" name="taDesc"></textarea>
			</div>
            <div class="formSection padded">
            <table >
			<tr>
				<td><span>硬装参考价格：</span></td>
				<td><select name="stHardPartCost">
					<option values='-1'>--选择一个硬装参考价格区间</option>
                    <option value='1'>0 - 50 元/平 </option>
                  <option value='2'>50 - 100 元/平</option>
                    <option value="3">100 - 200 元/平</option>
                    <option value="4">200 - 500 元/平</option>
                    <option value="5">500 - 1000 元/平</option>
                    <option value="6"> 1000元/平 以上</option>
                  <option value="-1"> 浮动</option>
			  </select></td>
			</tr>
            <tr style="height:10px">
            </tr>
			<tr>
				<td><span>适用面积：</span></td>
				<td><select name="stRoomSize">
					<option value='-1'> --选择设计空间面积</option>
                    <option value='1'> < 5平 </option>
                    <option value="2"> 5 - 10 平米 </option>
                    <option value="3"> 10 - 20 平 </option>
                    <option value="4"> 20 - 30 平 </option>
                     <option value="5"> 30 - 50 平 </option>
                    <option value="6"> > 50平 </option>
                  <option value='-1'> 浮动</option>
				</select></td>
			</tr>
            <tr style="height:10px">
            </tr>
            <tr>
				<td><span>风格：</span></td>
				<td><select name="stRoomStyle">
					<option value='-1'> --选择设计风格</option>
                    <option value='1'> 现代 </option>
                    <option value="2"> 古典 </option>
                    <option value="3"> 日式 </option>
                    <option value="4"> 欧美 </option>
                    <option value="5"> 简约 </option>
                  <option value='-1'> 其他</option>
				</select></td>
			</tr>
            </table>
            </div>
			<div class="formSection padded">
				<span>家具列表：</span>
				<table class="tbProductList" id="tbProductList" cellspacing="0" cellpadding="5" border="0">
					<tr>
						<th>产品名称及型号</th>
						<th>品牌</th>
						<th>参考链接</th>
					</tr>
					<tr>
						<td ><input name="ipProductName0" type="text"  style="width:100px"></input></td>
						<td  ><input name="ipProductBrand0" type="text" style="width:60px"></input></td>
						<td ><input name="ipProductSite0" type="text"  style="width:150px"></input></td>
					</tr>
				</table>
                <input name='txtTRLastIndex' type='hidden' id='txtTRLastIndex' value="1" />
                <input name="txtPicId" type='hidden' value='<?php echo ($pic_id); ?>'/>
                <a href="javascript:addSignRow();"><span class='colorLink'>继续添加</span></a>
                <span id="addTrAlert"  style="display:none; color:red;"> * 最多添加8种产品</span>
			</div>
		<div class="emptySpace">
        	<input id="submitBtn" type="submit" class="hzBtn primary " value="确定"   name="submitBtn"/>
        </div>
		</div> <!-- end of rightPicCol -->
        
		</form>
			
	</div> <!-- end of mainContent -->

</div> <!-- end of mainArea -->

<script language="javascript" type='text/javascript' src="__PUBLIC__/JS/tableOperation.js"></script>



<?php echo ($foot); ?>
</body>
</html>