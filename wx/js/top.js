// JavaScript Document
function SetHomepage()
{
    if (document.all)
    {
        document.body.style.behavior='url(#default#homepage)';
        document.body.setHomePage('http://www.dpnew.com');
    }
    else if (window.sidebar)
    {
        if(window.netscape)
        {
            try
            {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            }
            catch(e)
            {
                alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true!");
            }
         }
         var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components. interfaces.nsIPrefBranch);
         prefs.setCharPref('browser.startup.homepage','http://www.dpnew.com');
     }
}

function AddToFavorite()
{
     if((typeof window.sidebar == 'object') && (typeof window.sidebar.addPanel == 'function'))
     { 
         window.sidebar.addPanel("www.dpnew.com点评网","http://www.dpnew.com","大量点评尽在www.dpnew.com点评网"); 
     }
     else
     { 
         window.external.AddFavorite("http://www.dpnew.com","www.dpnew.com点评网"); 
     } 
}

function btnSearch()
{
	var k=$("k");
	if(k.value.length>0)
	{
		window.location.href="/search.php?k=" + encodeURIComponent(k.value);
	}
}

function k_onkeydown(e)
{
	if(window.event.keyCode==13)
	{
		var k=$("k");
		if(k.value.length==0)
		{
			return false;
		}
		window.location.href="/search.php?k=" + encodeURIComponent(k.value);
	}
}

function exit()
{
	//用ajax调用退出功能后，重新调整首页显示状态
	var span_logininfo=$("span_logininfo");
	var url="/member/login.php?act=exit";
	var myAjax=new Ajax.Request(url,{method:'get',onComplete: OnExit});
}

function OnExit(response)
{
	window.location.href="/index.php";
}

function login(url)
{
	//先在session中记录login的进入点
	var path="/includes/session.php?type=SetOriginalUrl&url=" + url;
	//alert(path);
	var myAjax=new Ajax.Request(path,{method:'get',onComplete: OnLoginTop});
}

function OnLoginTop(response)
{
	window.location.href="/member/login.php";
}

