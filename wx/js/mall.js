jQuery.extend({
  getCookie : function(sName) {
    var aCookie = document.cookie.split("; ");
    for (var i=0; i < aCookie.length; i++){
      var aCrumb = aCookie[i].split("=");
      if (sName == aCrumb[0]) return decodeURIComponent(aCrumb[1]);
    }
    return '';
  },
  setCookie : function(sName, sValue, sExpires) {
    var sCookie = sName + "=" + encodeURIComponent(sValue);
    if (sExpires != null) sCookie += "; expires=" + sExpires;
    document.cookie = sCookie;
  },
  removeCookie : function(sName) {
    document.cookie = sName + "=; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
  }
});
function drop_confirm(msg, url){
    if(confirm(msg)){
        window.location = url;
    }
}

/* 显示Ajax表单 */
function ajax_form(id, title, url, width)
{
    if (!width)
    {
        width = 400;
    }
    var d = DialogManager.create(id);
    d.setTitle(title);
    d.setContents('ajax', url);
    d.setWidth(width);
    d.show('center');

    return d;
}
function go(url){
    window.location = url;
}

function change_captcha(jqObj){
    jqObj.attr('src', SITE_URL + '/index.php?app=captcha&' + Math.round(Math.random()*10000));
}

/* 格式化金额 */
function price_format(price){
    if(typeof(PRICE_FORMAT) == 'undefined'){
        //PRICE_FORMAT = '&yen;%s';
        PRICE_FORMAT = '%s';
    }
    price = number_format(price, 2);
    price = yokaprice_format(price);

    return PRICE_FORMAT.replace('%s', price);
}
/* 123,233,123.60 */
function yokaprice_format(price_str)
{
	var t = price_old = price_new = pre = '';
	var pre = ',';
	var i = 0;
	var arr=price_str.split("");
	while(t = arr.pop())
	{
		i++;
		price_old = t + '' + price_old;
		if(t == '.')
		{
			price_new = price_old;
			i = 0;
		}
		else
		{
			if(i == 4)
			{			
				price_new = t + pre + price_new;
				i = 1;
			}
			else
			{
				price_new = t + '' + price_new;
			}
			
		}
	}
	if(GetStrRight(price_new,".")=="00")
	{
		price_new=GetStrLeft(price_new,".");
	}
	return price_new;
}

function number_format(num, ext){
    if(ext < 0){
        return num;
    }
    num = Number(num);
    if(isNaN(num)){
        num = 0;
    }
    var _str = num.toString();
    var _arr = _str.split('.');
    var _int = _arr[0];
    var _flt = _arr[1];
    if(_str.indexOf('.') == -1){
        /* 找不到小数点，则添加 */
        if(ext == 0){
            return _str;
        }
        var _tmp = '';
        for(var i = 0; i < ext; i++){
            _tmp += '0';
        }
        _str = _str + '.' + _tmp;
    }else{
        if(_flt.length == ext){
            return _str;
        }
        /* 找得到小数点，则截取 */
        if(_flt.length > ext){
            _str = _str.substr(0, _str.length - (_flt.length - ext));
            if(ext == 0){
                _str = _int;
            }
        }else{
            for(var i = 0; i < ext - _flt.length; i++){
                _str += '0';
            }
        }
    }

    return _str;
}

/* 收藏商品 */
function collect_goods(id)
{
    var url = SITE_URL + '/index.php?app=my_favorite&act=add&type=goods&ajax=1';
    $.getJSON(url, {'item_id':id}, function(data){
		if (1 == data.retval)
		{
			if ('重复收藏同一商品。' == data.msg)
			{
				$($('.fowi')).html('您已经收藏过该商品<br /><a href="' + SITE_URL + '/index.php?app=my_favorite">查看收藏夹>></a>');
				Exes('YO.Plugin.winOpen',this,358,147,'#zbox1');
				return;
			}
			$('.favorite_title').text(data.msg);
			Exes('YO.Plugin.winOpen',null,358,147,'#zbox3');
		}
        else if ('收藏商品成功。' == data.msg)
        {
			Exes('YO.Plugin.winOpen',null,358,147,'#zbox3');
        }
		else if('您需要先登录才可以执行该操作' == data.msg)
		{
			firstVerifyLogin("",true,"collect_goods("+id+")"); //登陆验证 add by Alan
			return;
			notice_str = "<p>"+data.msg + "</p><p><a href='" + SITE_URL + "/index.php?app=member&act=login'>进入登录页面</a>&nbsp;&nbsp;<a href='index.php?app=member&act=register'>进入注册页面</a></p>";
			$('.fowi').html(notice_str);
			Exes('YO.Plugin.winOpen',null,358,147,'#zbox1');
		}
		else
		{
			$('.fowi').text(data.msg);
			Exes('YO.Plugin.winOpen',null,358,147,'#zbox1');
		}
    });
}

function collect_goods2(id,fav_id)
{
    var url = SITE_URL + '/index.php?app=my_favorite&act=add&type=goods&ajax=1';
    $.getJSON(url, {'item_id':id}, function(data)
	{
		if (1 == data.retval || '收藏商品成功。' == data.msg || '重复收藏同一商品。'==data.msg)
		{
			$("#" + fav_id).html("<li style='color:#f00;list-style:none;'>收藏过啦</li>");
			window.winClose();
        }
		else if('您需要先登录才可以执行该操作' == data.msg)
		{
			firstVerifyLogin("",true,"collect_goods2("+id+",'"+fav_id+"')"); //登陆验证 add by Alan
			return ;
		}
    });
}

/* 收藏店铺 */
function collect_store(id)
{
    var url = SITE_URL + '/index.php?app=my_favorite&act=add&type=store&jsoncallback=?&ajax=1';
    $.getJSON(url, {'item_id':id}, function(data){
        alert(data.msg);
    });
}
/* 火狐下取本地全路径 */
function getFullPath(obj)
{
    if(obj)
    {
        //ie
        if (window.navigator.userAgent.indexOf("MSIE")>=1)
        {
            obj.select();
            return document.selection.createRange().text;
        }
        //firefox
        else if(window.navigator.userAgent.indexOf("Firefox")>=1)
        {
            if(obj.files)
            {
                return obj.files.item(0).getAsDataURL();
            }
            return obj.value;
        }
        return obj.value;
    }
}

/**
 *    启动邮件队列
 *
 *    @author    Garbin
 *    @param     string req_url
 *    @return    void
 */
function sendmail(req_url)
{
    $(function(){
        var _script = document.createElement('script');
        _script.type = 'text/javascript';
        _script.src  = req_url;
        document.getElementsByTagName('head')[0].appendChild(_script);
    });
}
/* 转化JS跳转中的 ＆ */
function transform_char(str)
{
    if(str.indexOf('&'))
    {
        str = str.replace(/&/g, "%26");
    }
    return str;
}

/**	
 * 用户登陆验证,
 * 如用户没有登陆则显示登陆悬浮层, 返回结果有两种方式，1.URL直接跳转，2.执行的JS方法,两种方法只可选择一种. 优先级是 js方法、URL 跳转
 * 如果设置redirect为false则登陆后不执行任何操作.
   =============================
   @param url as string 执行跳转的URL
   @param redirect as bool 是否执行跳转.
   @param onsuccess_js as string 操作成功后执行的JS function
 * @author Alan
 * @return void;
**/

function firstVerifyLogin(url,redirect,onsuccess_js)
{
	$.getJSON(SITE_URL + "/index.php?app=member&act=verifyLogin",'', function(data){
		if ('no_login' == data.retval)
		{
			location.href=SITE_URL + "/index.php?app=member&act=login&ret_url=" + encodeURIComponent(url);
		}
		else
		{
			if(redirect)
			{
				location.href=url;
			}
		}
    });
}

//搜索框处理
function onsearchFormSubmit() {
    var params = {};
    params.cate_id = '';
    params.brand = '';
    params.price = '';
    params.property = '';
    params.keyword = '';
	params.extra = '';
	params.from = '';
    params.sort = '0';
    params.page = 1;
    var k = $("#searchText").val();
    if($.trim(k) != "请输入要查询的信息"){
        if(k) {
            $("#yoMall_Search_Keyword").val(k);
            params.keyword = k;
        }

        goStaticGoodsUrl(params);
        return true;
    }else{
        return false;
    }
}


function goStaticGoodsUrl(params) {
		/* 定义静态化地址的顺序 */
		var BASE_STATIC_RULE = [ 'cate_id', 'brand', 'price', 'property',
				'keyword', 'extra','from','sort', 'page' ];
		var url = val = pre = '';
		if (undefined == params) {
			return false;
		}
		for ( var i = 0; i < BASE_STATIC_RULE.length; i++) {
			for ( var p in params) {
				if (BASE_STATIC_RULE[i] == p) {
					val = eval('params.' + p);
					if (undefined == val) {
						val = '';
					}
					if (val && p == 'keyword') {
						val = encodeURIComponent(val);
					}
					url += pre + val;
					pre = '_';
				}
			}
			//url = encodeURIComponent(url);
		}
		var searchurl = SITE_URL + '/search/' + url + '.html';
		window.location = searchurl;
		return false;
	}

function GetStrLeft(str,sSep)
{
	var sRet="";
	var nPos=str.indexOf(sSep);
	if(nPos>0)
	{
		sRet=str.substring(0,nPos);
	}
	return sRet;
}

function GetStrRight(str,sSep)
{
	var sRet="";
	var nPos=str.indexOf(sSep);
	if(nPos>0)
	{
		nPos=nPos+1;
		sRet=str.substring(nPos,str.length);
	}
	return sRet;
}

function GetRStrLeft(str,sSep)
{
	var sRet="";
	var nPos=str.lastIndexOf(sSep);
	if(nPos>0)
	{
		sRet=str.substring(0,nPos);
	}
	return sRet;
}

function GetRStrRight(str,sSep)
{
	var sRet="";
	var nPos=str.lastIndexOf(sSep);
	if(nPos>0)
	{
		nPos=nPos+1;
		sRet=str.substring(nPos,str.length);
	}
	return sRet;
}

/**
 * 检查input文件中的图片文件的大小是否超出指定的字节数
 * @param obj   the file input object
 * @param maxLength  the max bytes of image file
 * @author xwarrior at 2012.4.6
 */
function  checkImageFileSize(obj,maxLength) {
	    if( obj == null || obj.value == ''){
	    	return true;
	    }
	   
		var   ImageSys = {};  
		if (navigator.userAgent.indexOf( "MSIE" )>0) {    
		     ImageSys.ie=true ;  
		}     
		if (isFirefox=navigator.userAgent.indexOf( "Firefox" )>0){     
		     ImageSys.firefox=true ;  
		}   

	    var  filesize = 0;  
	    if ( ImageSys.firefox ){  
	        filesize = obj.files[0].size;  
	    }else   if ( ImageSys.ie ){  
	        var  filePath = obj.value;  
	        var  image= new  Image();     
	        image.dynsrc=filePath;     
	        filesize=image.fileSize;      
	    }else{
	    	 //other browser don't support,need server side validate
	    	  try{
	    		    var img = new Image();
               	    img.src = obj.value;
                	img.style.display='none';
                	document.body.appendChild(img);
                    setTimeout( function(){  
                                      document.body.removeChild(img);
                                  },1500);
              	filesize = img.fileSize;
	    	  }catch(e){
	    		  //browser don't support filesize
	    		  filesize = -1;
	    	  }
	    }
	    if(typeof(filesize)=="undefined")
		{
			return true;
		}
		else
		{
		    return filesize < maxLength;
		}
	   
}

/**
 * 检查店铺收藏
 * author:wujiang
 * date:2012-5-6-11
 * @param store_id
 */
function check_store_collect(store_id){
	url=SITE_URL + "/index.php?app=goods&act=is_collect_store&store_id=" + store_id;
    $.get(url, function(data){
		$("#div_fav").show();
		data=data.replace(/(^\s+)|(\s+$)/g, "");
		if(data=="1")
		{
			$("#div_fav_store").html("店铺已收藏");
		}
		else
		{
			$("#div_fav_store").html("<a href='javascript:;' class='pro_btn por_btnColl' onclick='fav_store(" + store_id + ");return false;'>收藏本店</a>");
		}
    });
}

//收藏本店
function fav_store(store_id)
{
    var url = SITE_URL + '/index.php?app=my_favorite&act=add&type=store&ajax=1';
    $.getJSON(url, {'item_id':store_id}, function(data)
	{
		if (1 == data.retval || '收藏店铺成功。' == $.trim(data.msg))
		{
			$("#div_fav_store").html("店铺已收藏");
        }
		else if('您需要先登录才可以执行该操作' == data.msg)
		{
			login_first=true;
			firstVerifyLogin("",true,"fav_store("+store_id+")"); //登陆验证 add by Alan
			return;
		}
    });
}