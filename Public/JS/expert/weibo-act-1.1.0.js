// JavaScript Document
var username
var truename
var my_id
var photo
var t_uid
$(document).ready(function(){
						   if($("#username").length>0)
                           {
                               username=$("#username").val();
							   truename = $("#truename").val();
							   my_id = $("#js_uid").val();//鍙栧緱鐢ㄦ埛id
							   role_id=$("#roleid").val();
							   photo=$("#user_photo").val();
							   t_uid=$("#t_uid").val();
							   if(role_id=='0')
							   {
								    $.dialog.open('index.php?module=weibo&action=reg_add',{title:'婵€娲绘柊绐濅汉浜哄府',id:'reg_add',lock: true});
							   }
							   setTimeout('publics()', 10000);//ms
                            }
							$("#right").load('index.php?module=weibo&action=right');
							$("#right2").load('index.php?module=weibo&action=right2&uid='+t_uid);
			})//鍒濆鍖栫敤鎴峰悕


function publics(){
//var myDate = new Date();
//$("#pubs").html(myDate.getSeconds());
$.post("index.php?module=weibo&action=pub_msg",function(data){
        $("#pub_li").html('');	
		var flog=false;
		if(data)
		{
		  $.each(data,function(i,itmes){
			
			if(i=='message')
			{
		       $("#pub_li").append('<li>'+itmes+'鏉℃柊绉佷俊锛�<a href="index.php?module=weibo&action=message&uid="'+my_id+'>鏌ョ湅绉佷俊</a></li>');
			}
			if(i=='huifu')
			{
				$("#pub_li").append('<li>'+itmes+'鏉℃柊璇勮锛�<a href="index.php?module=weibo&action=myreply&uid="'+my_id+'>鏌ョ湅璇勮</a></li>');
			}
			if(i=='attention')
			{
				$("#pub_li").append('<li>'+itmes+'涓柊绮変笣锛�<a href="index.php?module=weibo&action=attention&t=fensi&uid="'+my_id+'>鏌ョ湅绮変笣</a></li>');
			}
			if(i=='call_me')
			{
				$("#pub_li").append('<li>'+itmes+'鏉℃柊@鎻愬埌鎴戯紝<a href="index.php?module=weibo&action=call_me&uid="'+my_id+'>鏌ョ湅@鎴�</a></li>');
			}
			if(i=='favorite')
			{
				$("#pub_li").append("<li>浣犳湁"+itmes+"绡囧井鍗氳鏀惰棌銆�<a href='#' onclick='know(\""+i+"\");'>鐭ラ亾浜�</a></li>");
			}
			if(i=='zhuanfa')
			{
				$("#pub_li").append("<li>浣犳湁"+itmes+"绡囧井鍗氳杞彂銆�<a href='#' onclick='know(\""+i+"\");'>鐭ラ亾浜�</a></li>");
			}
			if(i=='like')
			{
				$("#pub_li").append("<li>浣犳湁"+itmes+"绡囧崥鏂囪鍠滄銆�<a href='#' onclick='know(\""+i+"\");'>鐭ラ亾浜�</a></li>");
			}
/*			if(i=='flog')
			{
				$("#pub_li").append("<li>鎮ㄦ湁"+itmes+"寮犲浘鐗囪鏀跺綍銆�<a href='#' onclick='know(\""+i+"\");'>鐭ラ亾浜�</a></li>");
			}*/
			flog=true;
		  });	
		  if(flog)
		  {
		  $("#pubs").show(3);
		  }
		}
		else
		{
			
			$("#pubs").hide();
		}
		setTimeout('publics()', 10000);//ms
															 
	},'json');

}

function know(type)
{
	$.post('index.php?module=weibo&action=ajax',{'type':type,'act':'know'},function(data){
	});
	$("#pubs").hide();
}


function successed(msg)
{
	$.dialog.tips('鏁版嵁姝ｅ湪鎻愪氦..', 2);
    $.dialog.tips(msg);
}
function login()
{

	if($("#js_uid").val()=='')
	{
		// $.dialog.open('index.php?module=weibo&action=reg',{title:'璇风櫥褰曟柊绐濆井鍗�',id:'logins'});
		$.dialog.open('index.php?module=index&action=reg',{title:'璇风櫥褰曟柊绐濈綉',id:'logins',width:730, height:355});
		 return false;
	}
	else
	{
		return true;
	}
}
function reg()
{

	if($("#js_uid").val()=='')
	{
		 $.dialog.open('index.php?module=index&action=regs',{title:'鍥捐氨娉ㄥ唽',id:'reg',width:730});
		 return false;
	}
	else
	{
		return true;
	}
}
function regs()
{

	if($("#js_uid").val()=='')
	{
		/*var isFirefox=navigator.userAgent.indexOf("Firefox")
	if(isFirefox>0){*/
			$.dialog.open('index.php?module=weibo&action=quick_regs_eml',{title:'娉ㄥ唽浜轰汉甯�',id:'regs'});
	/*}else{
			$.dialog.open('index.php?module=weibo&action=quick_regs_eml',{title:'娉ㄥ唽浜轰汉甯�',id:'regs',width:'781', height:'215'});
	}*/
		 
		 return false;
	}
	else
	{
		return true;
	}
}
function tanchu(msg,n)
{
		/*var dgs = new $.dialog({ id:'test2', html:msg , timer:n,  width:300, height:200, minBtn:true, btnBar:false, maxBtn:false, rang:true ,autoSize:true });
        dgs.ShowDialog();
		*/
		$.dialog.open(msg);
		
		return false;
}

function size_num(){
	$("#tonggao").hide();
	$("#t_num").show();	
}
function size_tonggao()
{
	var cont=$("#content").val();
	if(cont==""){
		$("#t_num").hide();
		$("#tonggao").show();	
	}
}
function size_change()
{
	var cont=$("#content").val();
	var siz = getByteLen(cont);
	var siz_num = 280-siz;	
	if(Math.floor(siz_num/2)<0){
		$("#t_num").html("璇锋枃鏄庡彂瑷€锛屽凡缁忚秴杩�<span style='color:red;font-size:18px;'>"+Math.floor(siz_num/2)*(-1)+"</span>瀛�");
	}else{
		$("#t_num").html("璇锋枃鏄庡彂瑷€锛岃繕鍙互杈撳叆<span style='font-size:18px;color:black;'>"+Math.floor(siz_num/2)+"</span>瀛�");
	}
	//$("#sizes").html(Math.floor(siz_num/2));
}

function check(id,h)
{
    if(!login())
	{
		return false;
		
	}

	var cont=$("#content").val();
	cont = cont.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	//var hot_title=$("#hot_title").val();
	//var hot_title_a=$("#hot_title_a").val();
	//cont=cont.replace(hot_title,hot_title_a);
	cont=cont.replace(/^\s+|\s+$/g,"");
	if(cont==''||cont=='#鍦ㄨ繖閲岃緭鍏ヤ綘鎯宠璇寸殑璇濋#'){
	    	alert('璇峰～鍐欏井鍗氬唴瀹�');
    }else{
		if(getByteLen(cont)>280){
			successed('瀛楁暟瓒呰繃140瀛�');
			$("#content").val(cont);
			return false;
		}
//------------鍚屾鏂版氮------------------------------------------------------
if($("#api_cheeck").val()==1){
		
	$.post('index.php?module=weibo&action=api_update_ajax',{'content':cont},function(data){
		$type=$(data).find("root").text();
			//alert($type);
		
	});
}

//------------------------------------------------------------------
		var hotid=$("#hotid").val();
		var star=cont.indexOf('#');
		var end=cont.indexOf('#',star+1);
		if(star+1<end){
			var cont_1=cont.substring(star+1,end);
			hot_typ=1;
		}else{
			var cont_1="";
			hot_typ=0
		}
		if(hot_typ==1&&hotid==0){
			cont=cont.replace("#"+cont_1+"#","<a href='index.php?module=weibo&action=hot_topic_personal&hot_uid="+id+"&hot_title="+cont_1+"'>#"+cont_1+"#</a>");
		}else{
			cont=cont.replace("#"+cont_1+"#","<a href='index.php?module=weibo&action=hot_topic&hot_topic="+hotid+"'>#"+cont_1+"#</a>");
		}
		
	   $("#content")[0].value='';

	   $.post('index.php?module=weibo&action=ajax',{'content':cont,'act':'frist','hotid':hotid,'hot_typ':hot_typ},function(data){
																	if(h!="0"){
																			 var nid=$(data).find("root").text();
																			if($(".t_weibo2_6").first().length>0)
																			{
																				$(".t_weibo2_6").first().before("<div class='t_weibo2_6' id=fy"+nid+"><div class='t_weibo2_6_1'><a href='index.php?module=weibo&action=mysay&uid="+id+"'><img src='"+photo+"' width='50' height='50' /></div><div class='t_weibo2_6_2'><ul><li class='t_weibo2_6_2_1'><span class='t_weibo2_6_2_1m'><a href='index.php?module=weibo&action=mysay&uid="+id+"'>"+truename+"</a></span><img src='weibo/images/images_wb/xinw7.jpg'/>锛�"+cont+"<br /><span id='show_img"+nid+"'></span></li><li class='t_weibo2_6_2_2'><span class='t_weibo2_6_2_2m'><span class='t_weibo2_6_2_2m_1'>1鍒嗛挓鍓�</span></span><span class='t_weibo2_6_2_2n'><a href='javascript:void(0);' onclick='deletes("+nid+")'>鍒犻櫎</a> | <a href='javascript:void(0);' onclick='zhuan(0,"+nid+","+nid+","+my_id+")'>杞彂</a><a href='javascript:void(0);'> |鍒嗕韩鑷虫柊娴� </a> |<a href='javascript:void(0);' onclick='reply_1("+nid+")'>璇勮</a>锛�<span id='replyed_num"+nid+"'>0</span>锛�</a></span></li></ul><div class='zhuanhui' id='zh_"+nid+"'><div id='actions"+nid+"'></div><span id='zhuanhui"+nid+"'><div id='rep"+nid+"'></div></span><div id='repcont"+nid+"'></div></div></div></div>");

																			}
																			else
																			{
																				$(".kehushouyen2mn1sv4").append("<div class='t_weibo2_6' id=fy"+nid+"><div class='t_weibo2_6_1'><a href='index.php?module=weibo&action=mysay&uid="+id+"'><img src='"+photo+"' width='50' height='50' /></div><div class='t_weibo2_6_2'><ul><li class='t_weibo2_6_2_1'><span class='t_weibo2_6_2_1m'><a href='index.php?module=weibo&action=mysay&uid="+id+"'>"+truename+"</a></span><img src='weibo/images/images_wb/xinw7.jpg'/>锛�"+cont+"<br /><span id='show_img"+nid+"'></span></li><li class='t_weibo2_6_2_2'><span class='t_weibo2_6_2_2m'><span class='t_weibo2_6_2_2m_1'>1鍒嗛挓鍓�</span></span><span class='t_weibo2_6_2_2n'><a href='javascript:void(0);' onclick='deletes("+nid+")'>鍒犻櫎</a> | <a href='javascript:void(0);' onclick='zhuan(0,"+nid+","+nid+","+my_id+")'>杞彂</a><a href='javascript:void(0);'> |鍒嗕韩鑷虫柊娴� </a> |<a href='javascript:void(0);' onclick='reply_1("+nid+")'>璇勮</a>锛�<span id='replyed_num"+nid+"'>0</span>锛�</a></span></li></ul><div class='zhuanhui' id='zh_"+nid+"'><div id='actions"+nid+"'></div><span id='zhuanhui"+nid+"'><div id='rep"+nid+"'></div></span><div id='repcont"+nid+"'></div></div></div></div>");
																			}
																			showimg(nid);
																	}
																 });
		var sey_num=$("#sey_num").html();
		var all_say=$("#sey_num1").html();
		$("#sey_num").html(sey_num*1+1);
		$("#sey_num1").html(all_say*1+1);
		$("#up3").html("");
		$("#up4").html("");
		$("#r_imag0").html("");
	}

}
//鏂版氮璁よ瘉
function creat_picture(){

	$.post('index.php?module=weibo&action=api_ajax',{},function(data){
		$type=$(data).find("root").text();
		//alert($type);
		if($type=="ok"){
			window.location.href="index.php?module=weibo&action=api_href&tp=1";
		}else{
			$("#api_cheeck").val("1");
		}
	});
}


function showimg(nid){
	$.post('index.php?module=weibo&action=ajax',{'fid':nid,'act':'im'},function(data){
		 var s_img=$(data).find("root").text();
		$("#show_img"+nid).append(s_img);
	});

}

function reply_1(id)
{
	if(!login())
	{
		return false;
	}
	var k=$("#actions"+id).html();
	if(k!=""){
		$("#actions"+id).html("");	
	}else{
		$("#actions"+id).load('index.php?module=weibo&action=huifu_cont1&tid='+id);
	}
	//setCursor(document.getElementById('re_cont'+id),0,0);

}
function reply_2(id)
{
	if(!login())
	{
		return false;
	}
	var k=$("#actions"+id).html();
	if(k!=""){
		$("#actions"+id).html("");	
	}else{
		$("#actions"+id).load('index.php?module=weibo&action=huifu_cont2&tid='+id);
	}
	//setCursor(document.getElementById('re_cont'+id),0,0);

}
function reply_3(id,u_truename)
{
	$("#re_cont"+id).val("鍥炲@"+u_truename+":");	
	setCursor(document.getElementById('re_cont'+id),100,0);
}
function reply_4(id)
{
	if(!login())
	{
		return false;
	}
	var k=$("#actions"+id).html();
	if(k!=""){
		$("#actions"+id).html("");	
	}else{
		$("#actions"+id).load('index.php?module=weibo&action=huifu_cont3&tid='+id);
	}
	//setCursor(document.getElementById('re_cont'+id),0,0);

}
function replyed_new(id,t)
{
	if(!login())
	{
		return false;
	}
	//鍒ゆ柇鏄惁鐧诲綍
	var Cont=$("#re_cont"+id).val();
	if(Cont==""){
		alert('璇峰～鍐欏洖澶嶅唴瀹�');
		return false;
	}
	if(t==3){
		$("#re_cont"+id).val("鍥炲@"+truename+":");		
	}else{
		$("#re_cont"+id).val("");
	}

	if(getByteLen(Cont)>280){
			successed('鍥炲鍐呭宸茶秴杩�140涓瓧');
			$("#re_cont"+id).val(Cont);
			return false;
	}
	$.post('index.php?module=weibo&action=ajax',{'re_cont':Cont,'act':'reply','rootid':id},function(data){
																			 var nid=$(data).find("root").text(); 
																			if(t==1){
																				$("#rep"+id).replaceWith("<div id='rep"+id+"'></div><div class='t_huifuyiji'><dl class='t_huifuyiji_1'><dt class='t_huifuyiji_2'><a href='index.php?module=weibo&action=mysay&uid="+id+"'><img src='"+photo+"' width='40' height='40' /></a></dt><dd class='t_huifuyiji_3'><span><a href='index.php?module=weibo&action=mysay&uid="+id+"'>"+truename+"</a></span>锛�"+Cont+" </dd></dl><div class='t_huifuyiji_4'><span class='t_huifuyiji_4_1'>1鍒嗛挓鍓�</span><span class='t_huifuyiji_4_2'> <a href='javascript:void(0);' onclick='reply_2("+nid+");'>鍥炲锛�<span id='replyed_num"+nid+"'>0</span>锛�</a></span></div><div id='actions"+nid+"'></div></div>");
																			}else{
																				$("#rep"+id).replaceWith("<div id='rep"+id+"'></div><div class='t_erjihuifu2'><dl class='t_huifuyiji_1m'><dt class='t_huifuyiji_2m'><a href='index.php?module=weibo&action=mysay&uid="+id+"'><img src='"+photo+"' width='30' height='30' /></a></dt><dd class='t_huifuyiji_3m'><span><a href='index.php?module=weibo&action=mysay&uid="+id+"'>"+truename+"</a></span>锛�"+Cont+" </dd></dl><div class='t_huifuyiji_4k'><span class='t_huifuyiji_4_1'>1鍒嗛挓鍓�</span><span class='t_huifuyiji_4_2'> <a href='javascript:void(0);' onclick='reply_3("+id+",\""+truename+"\");'>鍥炲</a></span></div></div>");
																			}
																				//showimg(nid);
																		 });
	var replyed_num=$("#replyed_num"+id).html();
	$("#replyed_num"+id).html(replyed_num*1+1);
	
}  

function faved(id)
{
	if(!login())
	{
		return false;
	}
	//鍒ゆ柇鏄惁鐧诲綍
	$.post('index.php?module=weibo&action=ajax',{'tid':id,'act':'faved'},function(data){
																					successed('鏀惰棌鎴愬姛');
																				 $("#action"+id).html('宸叉敹钘� | ');
																				// $("#success"+id).show(5);
																				// $("#success"+id).hide();
																				 });
}
function delfaved(id,rid)
{
	 if(!login())
	{
		return false;
		
	}
	var affirm = confirm("鎮ㄧ‘璁よ鍒犻櫎杩欐潯淇℃伅鍚楋紵");
	if(affirm){
		
		$.post('index.php?module=weibo&action=ajax',{'id':id,'act':'delfaved','rid':rid},function(data){
					$("#fy"+rid).remove();
						
			});
	}
}
function zhuan_new(id,fid,name,content,addtime,num,t)
{
	if(!login())
	{
		return false;
	}
	var k=$("#actions"+id).html();
	if(k!=""){
		$("#actions"+id).html("");
	 }else{
		$("#actions"+id).html("<ul><li class='t_huifu1'><img src='weibo/images/images_wb/xinw12.jpg' width='530' height='10' /></li><li class='t_huifu2'><div class='t_huifu2_1'><div class='t_huifu2_1m'><input type='text' name='textfield2' id='re_cont_z"+id+"' class='t_biaodan1'/></div><div class='t_huifu2_1n'><input type='submit' name='button2' id='button2' value=''  class='t_but2' onclick='zhuan_fa("+id+","+fid+",\""+name+"\",\""+content+"\",\""+addtime+"\",\""+num+"\");'/></div></div></li><li class='t_huifu3'><img src='images/images_wb/xinw10.jpg' width='530' height='3' /></li></ul>");
		if(t=='forwald'){
			$("#re_cont_z"+id).val('@'+name+':'+content);
			setCursor(document.getElementById('re_cont_z'+id),0,0);
		}
	 }
	
}
function zhuan_fa(id,fid,name,content,addtime,num){
	var cont = $("#re_cont_z"+id).val();
	if(cont==""){
		cont = "寰崥杞彂";
	}
	$.post('index.php?module=weibo&action=ajax',{'tid':fid,'act':'zhuan','cont':cont},function(data){
												var nid=$(data).find("root").text(); 
												 $("#actions"+id).html("");
												$(".t_weibo2_6").first().before("<div class='t_weibo2_6' id=fy"+nid+"><div class='t_weibo2_6_1'><a href='index.php?module=weibo&action=mysay&uid="+id+"'><img src='"+photo+"' width='50' height='50' /></div><div class='t_weibo2_6_2'><ul><li class='t_weibo2_6_2_1'><span class='t_weibo2_6_2_1m'><a href='index.php?module=weibo&action=mysay&uid="+id+"'>"+truename+"</a></span><img src='images/images_wb/xinw7.jpg'/>锛�"+cont+"</li><span id='show_huifu"+nid+"'></span><li class='t_weibo2_6_2_2'><span class='t_weibo2_6_2_2m'><span class='t_weibo2_6_2_2m_1'>1鍒嗛挓鍓�</span></span><span class='t_weibo2_6_2_2n'><a href='javascript:void(0);' onclick='deletes("+nid+")'>鍒犻櫎</a> | <span id='action"+nid+"'><a href='javascript:void(0);' onclick='faved("+nid+")'>鏀惰棌</a> | </span><a href='javascript:void(0);' onclick='zhuan_new("+nid+")'>杞彂</a><a href='javascript:void(0);'> |鍒嗕韩鑷虫柊娴� </a> |<a href='javascript:void(0);' onclick='reply_1("+nid+")'>璇勮</a>锛�<span id='replyed_num"+nid+"'>0</span>锛�</a></span></li></ul><div id='actions"+nid+"'></div><div class='zhuanhui' style='display:none;' id='zh_"+nid+"'><div id='actions"+nid+"'></div><span id='zhuanhui"+nid+"'><div id='rep"+nid+"'></div></span><div id='repcont"+nid+"'></div></div></div></div>");
												var ft = $("#ft"+id).html();
												if(ft!=""){
															$("#show_huifu"+nid).append(ft);
														}else{
															var ft = $("#fwbshui"+id).html();
										$("#show_huifu"+nid).append("<span id='ft"+nid+"'><ul><li class='t_huifu1'><img src='images/images_wb/xinw8.jpg' width='530' height='10' /></li><li class='t_huifu2'><div class='t_huifu2_1'><div class='t_huifuyiji'><dl class='t_huifuyiji_1'><dd class='t_huifuyiji_3' style=' width:488px;'><span><a href='index.php?module=weibo&action=mysay&uid="+fid+"'>"+name+"</a></span><img src='images/images_wb/xinw7.jpg' />锛�"+content+"<span id='image"+nid+"'></span> </dd></dl><div class='t_huifuyiji_4'><span class='t_huifuyiji_4_1'>"+addtime+"</span><span class='t_huifuyiji_4_2'> <a href='index.php?module=weibo&action=say&sayid="+fid+"'>杞彂</a> | <a href='index.php?module=weibo&action=say&sayid="+fid+"'>璇勮</a>锛�<span id='replyed_num"+fid+"'>"+num+"</span>锛�</span></div></div></div></li><li class='t_huifu3'><img src='images/images_wb/xinw10.jpg' width='530' height='3' /></li></ul></span>");
															var image_z=$("#image"+id).html();
															$("#image"+nid).html(image_z);
														}
													successed('杞浇鎴愬姛');
												});
}

function zhuan_new_say(id,fid,name,content,addtime,num,t)
{
	if(!login())
	{
		return false;
	}
	var k=$("#actions"+id).html();
	if(k!=""){
		$("#actions"+id).html("");
		$("#say_fay"+id).css("display","block");
	 }else{
		$("#say_fay"+id).css("display","none");
		$("#actions"+id).html("<ul><li class='t_huifu1'><img src='images/images_wb/xinw12.jpg' width='530' height='10' /></li><li class='t_huifu2'><div class='t_huifu2_1'><div class='t_huifu2_1m'><input type='text' name='textfield2' id='re_cont_z"+id+"' class='t_biaodan1'/></div><div class='t_huifu2_1n'><input type='submit' name='button2' id='button2' value=''  class='t_but2' onclick='zhuan_fa_say("+id+","+fid+",\""+name+"\",\""+content+"\",\""+addtime+"\",\""+num+"\");'/></div></div></li><li class='t_huifu3'><img src='images/images_wb/xinw10.jpg' width='530' height='3' /></li></ul>");
		if(t=='forwald'){
			$("#re_cont_z"+id).val('@'+name+':'+content);
			setCursor(document.getElementById('re_cont_z'+id),0,0);
		}
	 }
	
}
function zhuan_fa_say(id,fid,name,content,addtime,num){
	 if(!login())
	{
		return false;
		
	}
	var cont = $("#re_cont_z"+id).val();
	if(cont==""){
		cont = "寰崥杞彂";
	}
	$.post('index.php?module=weibo&action=ajax',{'tid':fid,'act':'zhuan','cont':cont},function(data){
		successed('鎭枩鎮ㄨ浆鍙戞垚鍔�');
		$("#actions"+id).html("");
	});
}


//璁剧疆鍏夋爣浣嶇疆
function setCursor(el,st,end) {
	if(el.setSelectionRange) {
		el.focus();
		el.setSelectionRange(st,end);
	} else {
		if(el.createTextRange) {
			range=el.createTextRange();
			range.collapse(true);
			range.moveEnd('character',end);
			range.moveStart('character',st);
			range.select();
		}
	}
}

//杩斿洖val鐨勫瓧鑺傞暱搴�   
function getByteLen(val) {   
var len = 0;   
for (var i = 0; i < val.length; i++) {   
if (val.charCodeAt(i) > 128) //鍏ㄨ   
len += 2;   
else   
len += 1;   
}   
return len;   
}  
//杩斿洖val鍦ㄨ瀹氬瓧鑺傞暱搴ax鍐呯殑鍊�   
function getByteVal(val, max) {   
var returnValue = '';   
var byteValLen = 0;   
for (var i = 0; i < val.length; i++) {   
if (val[i].match(/[^\x00-\xff]/ig) != null)   
byteValLen += 2;   
else   
byteValLen += 1;   
if (byteValLen > max)   
break;   
returnValue += val[i];   
}   
return returnValue;   
} 

function tops(id)//鍠滄
{
	 if(!login())
	{
		return false;
		
	}
	$.post('index.php?module=weibo&action=ajax',{'tid':id,'act':'top'},function(data){
																				if($(data).find('root').text()>0)
																				{
																					successed('鎺ㄨ崘鎴愬姛');
																					}
																				});
}

function zhuanbo_new(id,name,count,title,u_name)//杞浇
{
 if(!login())
{
	return false;
		
}
$.post('index.php?module=weibo&action=ajax',{'tid':id,'act':'zhuanbo'},function(data){
															var nid = $(data).find('root').text();
															if($(data).find('root').text()>0)
															{
																	successed('杞浇鎴愬姛');
															}
																		
															});
	
}


//鍒犻櫎鍙戣█
function deletes(id,type,rid,fid,say)
{
	 if(!login())
	{
		return false;
		
	}
	var affirm = confirm("鎮ㄧ‘璁よ鍒犻櫎杩欐潯淇℃伅鍚楋紵");
	if(affirm){
		if(type==0){
			type = 'fayan';
		}
		if(type==1){
			type = 'bowen_huifu';
		}
		if(rid==""){
			rid=0;
		}
		$.post('index.php?module=weibo&action=ajax',{'id':id,'act':'deletes','type':type,'rid':rid},function(data){
					//alert($(data).find("root").text());
					$("#fy"+id).remove();
					if(rid==0){
						var replyed_num=$("#replyed_num"+fid).html();
					$("#replyed_num"+fid).html(replyed_num*1-1);
					}else{
						var replyed_num=$("#replyed_num"+rid).html();
					$("#replyed_num"+rid).html(replyed_num*1-1);
					}
					if(say=='y'){
					window.history.back(-1);
					//window.location.href="index.php?module=weibo&action=mysay";
					}
			});
	}
}
//鍠滄
function like(id)
{
if(!login())
{
	return false;
		
}
	$.post('index.php?module=weibo&action=ajax',{'id':id,'act':'like'},function(data){
			if($(data).find("root").text()=='no'){
				alert('瀵逛笉璧凤紝鎮ㄥ凡缁忚〃杩囨€併€�');
			}else{
				var likes=$("#likes"+id).html();
				$("#likes"+id).html(likes*1+1);
			}
		});
}



function reply_bowen1(id)
{
	 if(!login())
	{
		return false;
		
	}
	var k=$("#actions"+id).html();
	if(k!=""){
		$("#actions"+id).html("");	
	}else{
		$("#actions"+id).load('index.php?module=weibo&action=huifu_cont_bowen1&tid='+id);
	}
	//setCursor(document.getElementById('re_cont'+id),0,0);

}
function reply_bowen2(id)
{
	 if(!login())
	{
		return false;
		
	}
	var k=$("#actions"+id).html();
	if(k!=""){
		$("#actions"+id).html("");	
	}else{
		$("#actions"+id).load('index.php?module=weibo&action=huifu_cont_bowen2&tid='+id);
	}
	//setCursor(document.getElementById('re_cont'+id),0,0);

}
function reply_bowen3(id,u_truename)
{
	$("#re_cont"+id).val("鍥炲@"+u_truename+":");	
	setCursor(document.getElementById('re_cont'+id),100,0);
}


function replyed_bowen_new(id,t)
{
	if(!login())
	{
		return false;
	}
	//鍒ゆ柇鏄惁鐧诲綍
	var Cont=$("#re_cont"+id).val();
	if(Cont==""){
		alert('璇峰～鍐欏洖澶嶅唴瀹�');
		return false;
	}
	if(t==3){
		$("#re_cont"+id).val("鍥炲@"+truename+":");		
	}else{
		$("#re_cont"+id).val("");
	}

	if(getByteLen(Cont)>280){
			successed('鍥炲鍐呭宸茶秴杩�140涓瓧');
			$("#re_cont"+id).val(Cont);
			return false;
	}

	$.post('index.php?module=weibo&action=ajax',{'re_cont':Cont,'act':'reply_bowen','bid':id,'tp':t},function(data){
																			 var nid=$(data).find("root").text(); 
																			if(t==1){
																				$("#rep"+id).replaceWith("<div id='rep"+id+"'></div><div class='t_huifuyiji'><dl class='t_huifuyiji_1'><dt class='t_huifuyiji_2'><a href='index.php?module=weibo&action=mysay&uid="+id+"'><img src='"+photo+"' width='40' height='40' /></a></dt><dd class='t_huifuyiji_3'><span><a href='index.php?module=weibo&action=mysay&uid="+id+"'>"+truename+"</a></span>锛�"+Cont+" </dd></dl><div class='t_huifuyiji_4'><span class='t_huifuyiji_4_1'>1鍒嗛挓鍓�</span><span class='t_huifuyiji_4_2'> <a href='javascript:void(0);' onclick='reply_bowen2("+nid+");'>鍥炲</a></span></div><div id='actions"+nid+"'></div></div>");
																			}else{
																				$("#rep"+id).replaceWith("<div id='rep"+id+"'></div><div class='t_erjihuifu2'><dl class='t_huifuyiji_1m'><dt class='t_huifuyiji_2m'><a href='index.php?module=weibo&action=mysay&uid="+id+"'><img src='"+photo+"' width='40' height='40' /></a></dt><dd class='t_huifuyiji_3m'><span><a href='index.php?module=weibo&action=mysay&uid="+id+"'>"+truename+"</a></span>锛�"+Cont+" </dd></dl><div class='t_huifuyiji_4k'><span class='t_huifuyiji_4_1'>1鍒嗛挓鍓�</span><span class='t_huifuyiji_4_2'> <a href='javascript:void(0);' onclick='reply_bowen3("+id+",\""+truename+"\");'>鍥炲</a></span></div></div>");
																			}
																				//showimg(nid);
																		 });
	var replyed_num=$("#replyed_num"+id).html();
	$("#replyed_num"+id).html(replyed_num*1+1);
	
} 


//鏌ョ湅宸蹭笂浼犲浘鐗囩偣閫夈€�
function show_chak(img_d,fengge,kongjian,huxing){
			var url = "index.php?module=weibo&action=imag_upload_ajax&img_d="+img_d+"&fengge="+fengge+"&kongjian="+kongjian+"&huxing="+huxing;
			$.get(url, function(data){
				var img = $(data).find("root").text();
				//alert(img);
				if(img=='ok'){
					alert("瀵逛笉璧凤紝鎮ㄤ竴娆℃渶澶氬彧鑳藉彂琛ㄥ洓寮犲浘鐗�");
					return;
				}else{
					$('#up4').html(img);
					
				}	
			}); 

		}
//鍥剧墖绫诲瀷鐐归€夈€�
function imag_type_chak(imag_type,k,n){
	for(var j =k; j<=3; j++){
		var url = "index.php?module=weibo&action=imag_upload_ajax&imag_type="+imag_type+"&typ=imag_type_chak&k="+j+"&n="+n;
			$.get(url, function(data){
				 //alert($(data).find("root").text());
			});

	}
			var ks2 = k+1;
			for(var j =k; j<4; k++){
				var ks = k+1;
				for(var i =0; i<document.getElementById("imag_type"+n+ks).options.length; i++)
				{
					if (document.getElementById("imag_type"+n+ks).options[i].value == imag_type)
					{
						document.getElementById("imag_type"+n+ks).options[i].selected = true;
					}
				}
			}			

}

//鍥剧墖绛涢€夈€�
function imag_chak(imag_type,n){
		var fengge = $('#imag_type_1').val();
		var kongjian = $('#imag_type_2').val();
		var huxing = $('#imag_type_3').val();
		$("#imag_chak").load('index.php?module=weibo&action=load_imag_upload&fengge='+fengge+'&kongjian='+kongjian+'&huxing='+huxing);
		//$("#imag_chak").load('index.php?module=weibo&action=load_imag_upload&imag_type='+imag_type+'&n='+n);
	}

function tanchu_url(url){
	 if(!login())
	{
		return false;
		
	}
	$.dialog.open(url,{title:'鍙戠淇�',id:'test'});
	// var dgss = new $.dialog({ id:'test',title:'鍙戠淇�',loadingText:'璇风◢绛�...', page:url,width:460,height:280,autoSize:true });
         //dgss.ShowDialog();
}


//鍥剧墖涓婁紶鐩稿叧
//鐐瑰嚮鍑虹幇鏄剧ず灞�

		function show_up1(t){
			if(FlashSetup == 0)
				CheckFlash(0);
			else{
				if(FlashVer < 10)
					CheckFlash(1);
			}

			if(t==0&&$("#r_imag0").html()!=""){
				$("#r_imag0").html("");
			}else{
				$("#r_imag0").load('index.php?module=weibo&action=image_up1');	
			}
		}

		function show_img1(){
			$("#r_imag0").load('index.php?module=weibo&action=image_up2');		
		}

		function page(n)
		{
			$("#r_imag0").load('index.php?module=weibo&action=image_up2&page='+n);
		}

		function dle_img(k){
			
			var url = "index.php?module=weibo&action=imag_upload_ajax&typ=dle&k="+k;
			$.get(url, function(data){
			});
			$("span[name='im_"+k+"']").remove();

		}

function addattention(id,type){
	if(!login())
	{
		return false;
		
	}
	$.post('index.php?module=weibo&action=ajax',{'id':id,'act':'guanzhu_add','type':type},function(data){
				//alert($(data).find("root").text());
				var tp=$(data).find("root").text();
				if(tp=='ok'&&type=='true'){
					$(".add_gz"+id).html("<a href='#' onclick='return addattention("+id+",\"false\")'><img src='images/images_wb/xinw15.jpg' align='left' /></a>");
				}
				if(tp=='ok'&&type=='false'){
					$(".add_gz"+id).html("<a href='#' onclick='return addattention("+id+",\"true\")'><img src='images/images_wb/xinw45.jpg' align='left' /></a>");
				}
				if(tp=='same')
				{
					successed('鑷繁灏变笉鐢ㄥ叧娉ㄨ嚜宸变簡鍚�');
				}
				if(tp=='repeat')
				{
					successed('鎮ㄥ凡鍏虫敞杩囨鐢ㄦ埛');
				}	
		});
} 

//鍏ㄩ€�
function SelectAll() {
	 if(!login())
	{
		return false;
		
	}
	 var checkboxs=document.getElementsByName("checkbox[]");
	 for (var i=0;i<checkboxs.length;i++) {
	  var e=checkboxs[i];
	  e.checked=!e.checked;
	 }

}

function addressadd()
{
	 if(!login())
	{
		return false;
		
	}
	document.form1.submit(); 
	//alert('娣诲姞鎴愬姛');
	successed('鍏虫敞鎴愬姛');
}

function province(pid)
{
		$.post("index.php?module=weibo&action=json",{'act':'province'},function(json){
       
         $.each(json,function(i,items){  
		 if(items.ProName==pid)
		 {
          $("#province").append('<option value='+items.PROID+' selected>'+items.ProName+'</option>');     
		 }
		 else
		 {
		  $("#province").append('<option value='+items.PROID+'>'+items.ProName+'</option>'); 	 
		 }
		 });																			   
																				   },"json");
}

function citys(cid){
	$("#city").html("");
	if($("#province").val()!="")
	{
	    $("#city").removeAttr("disabled");
	}
	else
	{
		$("#city").attr("disabled","disabled");
	}
	$.post("index.php?module=weibo&action=json",{'act':'city'},function(json){
		$.each(json,function(i,item){
							 if(item.ProID==$("#province").val())
							 {
								 if(item.CityName==cid)
								 {
								      $("#city").append('<option value='+item.CityID+' selected>'+item.CityName+'</option>');
								 }
								 else{
									   $("#city").append('<option value='+item.CityID+'>'+item.CityName+'</option>');
									 }
								 }
							 });															
		},"json");
}

//@TA
function ta_upload(url)
{
	if(!login())
	{
		return false;
		
	}
	$.dialog.open(url,{title:'@TA',id:'ta',width:'660',height:'500'});
}
//鎼滅储涓嬫媺
function search_up(){
	var search = $("#search").val();
	if(search=="鎼滅储寰崥銆佹壘浜恒€佽瘽棰�"){
		$("#search").val("");
	}else{	
		if(search==""){
			$("#search_up").css("display","none");
		}else{
			$("#search_up").css("display","block");
			$(".seach_content").html(search);
		}
	}
}
function search_up_hed(){
	var search = $("#search").val();
	if(search==""){
		$("#search").val("鎼滅储寰崥銆佹壘浜恒€佽瘽棰�");
	}
	setTimeout("$('#search_up').css('display','none')",200)
}
function search_url(url){
	var search = $("#search").val();
	window.location.href="index.php?module=weibo&action="+url+"&search="+search;
}

//鍙戣捣璇濋鏄剧ず灞�

function hot_show(t){
	if(t==0&&$("#r_imag0").html()!=""){
			$("#r_imag0").html("");
	}else{
			
			$("#r_imag0").load('index.php?module=weibo&action=hot_show');	
	}
}
function hot_cont_show(title,hot_id){
	var content = $("#content").val();
	if(title){
		$("#content").val(content+"#"+title+"#");
		siz = getByteLen("#"+title+"#");
		$("#hotid").val(hot_id);
	}else{
		$("#content").val(content+"#鍦ㄨ繖閲岃緭鍏ヤ綘鎯宠璇寸殑璇濋#");
		siz = getByteLen("#鍦ㄨ繖閲岃緭鍏ヤ綘鎯宠璇寸殑璇濋#");
	}
	//var cont=$("#content").val();
	var siz_1 = getByteLen(content);
	setCursor(document.getElementById('content'),siz_1/2+1,siz_1/2+siz/2);
	$("#r_imag0").html("");
}

//image-------------------------------------鍥剧€戦儴鍒�-------------------------------------------------------------------------

function img_like(id)
{
	if(!login())
	{
		return false;
	}
	$.post('index.php?module=weibo&action=ajax',{'id':id,'act':'img_like'},function(data){
			if($(data).find("root").text()=='no'){
				successed('瀵逛笉璧凤紝鎮ㄥ凡缁忚〃杩囨€併€�');
			}else{
				successed('鍠滄鎴愬姛');
				var likes=$("#good"+id).html();
				if(likes=="&nbsp;")
				$("#good"+id).html(1);
				else
				$("#good"+id).html(likes*1+1);
			}
		});
	
}

//鍏虫敞鐢ㄦ埛 id 鐢ㄦ埛ID type:鍏虫敞/鍙栨秷鍏虫敞(true)
function img_addattention(id,type){
	if(!login())
	{
		return false;
	}
	$.post('index.php?module=weibo&action=ajax',{'id':id,'act':'guanzhu_add','type':type},function(data){
				//alert($(data).find("root").text());
				var tp=$(data).find("root").text();
				if(tp=='ok'&&type=='true'){
					$(".attention"+id).html("<a href='#' onclick='return img_addattention("+id+",\"false\")'>+鍏虫敞</a>");
				}
				if(tp=='ok'&&type=='false'){
					$(".attention"+id).html("<a href='#' onclick='return img_addattention("+id+",\"true\")'>鍙栨秷鍏虫敞</a>");
				}
				if(tp=='same')
				{
					successed('鑷繁灏变笉鐢ㄥ叧娉ㄨ嚜宸变簡鍚�');
				}
					
		});
} 


//璇勮

function pinglun(id)
{
	if(!login())
	{
		return false;
	}
    location.href='index.php?module=index&action=cablet&pic='+id;
}

//鍥炲 
function img_reply(uid,tid,hid)
{
	if(!login())
	{
		return false;
	}
    location.href='index.php?module=weibo&action=say&uid='+uid+'&sayid='+tid+'&hid='+hid;
}

//涓婁紶鍥剧墖
function upload()
{
	if(!login())
	{
		return false;
		
	}
	var isFirefox=navigator.userAgent.indexOf("Firefox")
	if(isFirefox>0){
		$.dialog.open('index.php?module=weibo&action=img_home',{title:'涓婁紶鍥剧墖',id:'imgs'});
	}else{
		$.dialog.open('index.php?module=weibo&action=img_home',{title:'涓婁紶鍥剧墖',id:'imgs',width:'660',height:'500'});
	}
}
//鍥剧墖鍥炲
function reply_image2(id)
{
	if(!login())
	{
		return false;
	}
	var k=$("#actions"+id).html();
	if(k!=""){
		$("#actions"+id).html("");	
	}else{
		$("#actions"+id).load('index.php?module=weibo&action=huifu_image&tid='+id);
	}
	//setCursor(document.getElementById('re_cont'+id),0,0);

}
function replyed_image(id,t)
{
	if(!login())
	{
		return false;
	}
	//鍒ゆ柇鏄惁鐧诲綍
	var Cont=$("#re_cont"+id).val();
	if(Cont==""){
		alert('璇峰～鍐欏洖澶嶅唴瀹�');
		return false;
	}
	if(t==3){
		$("#re_cont"+id).val("鍥炲@"+truename+":");		
	}else{
		$("#re_cont"+id).val("");
	}

	if(getByteLen(Cont)>280){
			successed('鍥炲鍐呭宸茶秴杩�140涓瓧');
			$("#re_cont"+id).val(Cont);
			return false;
	}

	$.post('index.php?module=weibo&action=ajax',{'re_cont':Cont,'act':'reply','rootid':id},function(data){
																			 var nid=$(data).find("root").text(); 
																			if(t==1){
																				$("#rep"+id).replaceWith("<div id='rep"+id+"'></div><div class='t_weibo2_6'><div class='t_weibo2_6_1'><a href='index.php?module=weibo&action=mysay&uid="+id+"'><img src='"+photo+"'/></a></div><div class='t_weibo2_6_2'><ul><li class='t_weibo2_6_2_1' ><span class='t_weibo2_6_2_1m'><a href='index.php?module=weibo&action=mysay&uid="+id+"'>"+truename+"</a></span><img src='images/xinw7.jpg' />锛�"+Cont+" </li><li class='t_weibo2_6_2_2'><span class='t_weibo2_6_2_2m'><span class='t_weibo2_6_2_2m_1'>1鍒嗛挓鍓�</span></span><span class='t_weibo2_6_2_2n' style=' text-align:right;'> <a href='javascript:void(0);' onclick='reply_image2("+nid+");'>鍥炲锛�<span id='replyed_num"+nid+"'>0</span>锛�</a></span></li></ul><div id='actions"+nid+"'></div></div></div>");
																			}else{
																				$("#rep"+id).replaceWith("<div id='rep"+id+"'></div><div class='t_huifuyiji'><dl class='t_huifuyiji_1'><dt class='t_huifuyiji_2'><a href='index.php?module=weibo&action=mysay&uid="+id+"'><img src='"+photo+"' width='40' height='40' /></dt><dd class='t_huifuyiji_3'><span><a href='index.php?module=weibo&action=mysay&uid="+id+"'>"+truename+"</a></span>锛�"+Cont+"</dd></dl><div class='t_huifuyiji_4'><span class='t_huifuyiji_4_1'>1鍒嗛挓鍓�</span><span class='t_huifuyiji_4_2'> <a href='javascript:void(0);' onclick='reply_3("+id+",\""+truename+"\");'>鍥炲</a></span></div></div>");
																			}
																				//showimg(nid);
																		 });
	var replyed_num=$("#replyed_num"+id).html();
	$("#replyed_num"+id).html(replyed_num*1+1);
	
}

//娣樺疂椤靛洖澶�
function reply_image2_tao(id)
{
	var k=$("#actions"+id).html();
	if(k!=""){
		$("#actions"+id).html("");	
	}else{
		$("#actions"+id).load('index.php?module=weibo&action=huifu_image_tao&tid='+id);
	}
	//setCursor(document.getElementById('re_cont'+id),0,0);

}

function replyed_image_tao(id,t)
{	

	var Cont=$("#re_cont"+id).val();
	if(Cont==""){
		alert('璇峰～鍐欏洖澶嶅唴瀹�');
		return false;
	}
	if(t==3){
		$("#re_cont"+id).val("鍥炲@"+truename+":");		
	}else{
		$("#re_cont"+id).val("");
	}

	if(getByteLen(Cont)>280){
			successed('鍥炲鍐呭宸茶秴杩�140涓瓧');
			$("#re_cont"+id).val(Cont);
			return false;
	}
	$.post('index.php?module=weibo&action=ajax',{'re_cont':Cont,'act':'reply_tao','rootid':id},function(data){
																			 var nid=$(data).find("root").text(); 
																			if(t==1){
																				$("#rep"+id).replaceWith("<div id='rep"+id+"'></div><div class='t_weibo2_6'><div class='t_weibo2_6_1'><img src='photo/avatar_big/avatar_default.jpg'/></div><div class='t_weibo2_6_2'><ul><li class='t_weibo2_6_2_1' ><span class='t_weibo2_6_2_1m'>鍖垮悕鐢ㄦ埛</span><img src='images/xinw7.jpg' />锛�"+Cont+" </li><li class='t_weibo2_6_2_2'><span class='t_weibo2_6_2_2m'><span class='t_weibo2_6_2_2m_1'>1鍒嗛挓鍓�</span></span><span class='t_weibo2_6_2_2n' style=' text-align:right;'> <a href='javascript:void(0);' onclick='reply_image2_tao("+nid+");'>鍥炲</a></span></li></ul><div id='actions"+nid+"'></div></div></div>");
																			}else{
																				$("#rep"+id).replaceWith("<div id='rep"+id+"'></div><div class='t_huifuyiji'><dl class='t_huifuyiji_1'><dt class='t_huifuyiji_2'><img src='photo/avatar_big/avatar_default.jpg' width='40' height='40' /></dt><dd class='t_huifuyiji_3'><span>鍖垮悕鐢ㄦ埛</a></span>锛�"+Cont+"</dd></dl><div class='t_huifuyiji_4'><span class='t_huifuyiji_4_1'>1鍒嗛挓鍓�</span><span class='t_huifuyiji_4_2'> <a href='javascript:void(0);' onclick='reply_3("+id+",\"鍖垮悕鐢ㄦ埛\");'>鍥炲</a></span></div></div>");
																			}
																				//showimg(nid);
																		 });
	
}  