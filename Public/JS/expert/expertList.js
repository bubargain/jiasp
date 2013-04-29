$(window).scroll(function () {
	if($(window).scrollTop()>20){
		$("#mx").hide();
		$("#mx1").show();
	}else{
		$("#mx1").hide();
		$("#mx").show();
	}

});

function seach(form){
	if(form="form1"){
		document.form1.submit();
	}else{
		document.form2.submit();
	}
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
					$(".add_gz"+id).html("<p class='main_zhuanjia2m_1nr' onclick='return addattention("+id+",\"false\")'></p>");
				}
				if(tp=='ok'&&type=='false'){
					$(".add_gz"+id).html("<p class='main_zhuanjia2m_1nrt' onclick='return addattention("+id+",\"true\")''></p>");		
				}
					
		});
} 


function tuijian(id,tp){
	$.post('index.php?module=index&action=tuijian_ajax',{'act':'zhuanjia_tuijian','tid':id,'tp':tp},function(data){
		$type=$(data).find("root").text();
			//alert($type);
			if(tp==0){
				successed('推荐成功');
				$("#tuijian"+id).html("<a href='javascript:void(0);' onclick='tuijian("+id+",1);'>取消推荐</a>");
			}else{
				successed('取消推荐成功');
				$("#tuijian"+id).html("<a href='javascript:void(0);' onclick='tuijian("+id+",0);'>推荐</a>");
			}
		
	});
}

function publics(){

	$.post("index.php?module=weibo&action=pub_msg",function(data){
			var flog=false;
			var count = 0;
			if(data)
			{
				
			  $.each(data,function(i,itmes){
				count=count+itmes;
				/*
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
				if(i=='hot')
				{
					$("#pub_li").append("<li>浣犵殑璇濋鏈�"+itmes+"涓汉鍥磋<a href='#' onclick='know(\""+i+"\");'>鐭ラ亾浜�</a></li>");
				}
				*/
//				flog=true;
			  });	
			  if(count>0)
			  {
			  $(".msgs").html(count);		  
			  $(".msg").html(count);		  
			  }else{		  	
			  $(".msgs").hide();
			  $(".msg").hide();
			  	}
			}
			else
			{
				$(".msgs").hide();
				$(".msg").hide();
			}
			setTimeout('publics()', 10000);//ms
																 
		},'json');
}
