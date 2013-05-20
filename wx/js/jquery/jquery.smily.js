/*20091205 Design By Marcho,ryeen.com*/	
	var faceUrl="/images/mind/" //头像路径
	var faceLeft=22 //定义距离输入框的相对左边距
	var faceNums=8  //定义头像数量
I();
C();
G(textId,faceLeft);
R();

//窗口改变时自动调整位置
$(window).resize(function(){
G(textId,faceLeft);
});

//将表情标题及内容写入BODY
function I() {	
	msg="<style>#faceContent{width:364px; position:absolute;border:1px solid #aaa;border-top:none;display:none;z-index:9999; text-align:center;padding:3px;padding-bottom:6px;background:#fff;} #faceContent a img{float:left;cursor:pointer;margin:1px 1px; border:#cacaca 1px solid}  #faceContent a:hover img{border:1px solid #f51d69}   #faceTitle{height:22px; width:36px; position:absolute; background:url("+faceUrl+"first.gif) no-repeat center center #fff;border:1px solid #aaa;border-bottom:none;'}</style>"
	msg=msg+"<div id='faceTitle' style='cursor:pointer'></div>"
	msg=msg+"<div id='faceContent'></div>"
	$("body").append(msg);
}

//将表情循环插入页面中
function IF() {	
	$("#faceContent").html("");
	for(var i=0;i<faceNums;i++){
		str=faceUrl+i+".gif";
		$("#faceContent").append("<a href='javascript:'><img src="+str+" fn=[@"+i+"@] /></a>");
	}
}

//控制表情区位置
function G(obj,L) {	
	var O=$("#"+obj).offset();
	var top=O.top;
	var left=O.left;
	$("#faceTitle").css("top",top-22+"px");
	$("#faceTitle").css("left",left+L+"px");
	$("#faceContent").css("top",top+1+"px");
	$("#faceContent").css("left",left+L+"px");
}

//替换页面中的表情代码为图片
function R(){
		rContent=$("#"+replaceId).html();
		rContent = rContent.replace(/\[@/g, "<img src="+faceUrl+"");
		rContent = rContent.replace(/\@]/g, ".gif />"); 
		$("#"+replaceId).html(rContent);
}

//表情点击显示效果
function C(){
	$("#faceTitle").click(
	function(event){
	$("#faceContent").toggle();
	IF();
	$("#faceContent img").click(function(){
	$("#"+textId).append($(this).attr("fn"))	
	})
	event.stopPropagation();
	});
	$("body").click(
	function(){
	$("#faceContent").hide();
	});
}