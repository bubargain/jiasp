window.hzmr = window.hzmr || [];
/************* Start main.js **************/
try {// <script>
var HZ = HZ || {};
HZ.ns = function (ns_string) {
	var parts = ns_string.split('.'),
		parent = HZ;
		
	if(parts[0] === "HZ") {
		parts = parts.slice(1);
	}
	for (var i = 0; i < parts.length; i+= 1) {
		if(typeof parent[parts[i]] === "undefined")	{
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;
};

HZ.ns("HZ.utils");
HZ.ns("HZ.modules");
HZ.ns('HZ.ajaz.AjaxReq');

HZ.ajaz.AjaxReq = new (function(){
	var seq = 0;
	var defaults = {
		url: '',
		type: 'POST',
		cache:false,
		dataType:'json'
	};
	
	var serializeParams = function(params){
		var paramStr = "/";
		$.each(params,function(index,param){
			paramStr += param.name + '=' + encodeURIComponent(param.value) + '/';
		});
		return paramStr;
	};
	
	this.send = function(url,params,onSuccess,extras) {
		extras = extras || {};
		var options = {url:url,data:params,success:onSuccess};
		
		var settings = $.extend({},defaults,options,extras);
		
		params.push({name:'ajaxRequestId',value:seq++});
		if(settings.type=='GET' && (typeof settings.data != 'string')) {
			settings.data = serializeParams(params);
			if(settings.cache === false) {
				settings.data += '__='+encodeURIComponent((new Date()).getTime());
				settings.cache = true;
			}
			settings.url += settings.data;
			settings.data = '';
		}
		$.ajax(settings);
	}
	
	//set the default error handler for all jquery ajax calls
	$.ajaxSetup({
		statusCode: {
			0: function () {
				displayMsg('Please verify you are connected to the internet');
			},
			401: function () {
				alert('Bad request error [401].\n\nPlease refresh page and try again.\n\nIf problem persists, please email support@houzz.com');
			},
			404: function () {
				alert('Requested page not found [404].\n\nPlease refresh page and try again.\n\nIf problem persists, please email support@houzz.com');
			},
			500: function () {
				alert('Internal Server Error [500].\n\nPlease refresh page and try again.\n\nIf problem persists, please email support@houzz.com');
			}
		},
		error: function (jqXHR, status) {
					if(jqXHR.status === 0) {
						displayMsg('Please verify you are connected to the internet');
					} else if (status === 'parsererror') {
						displayMsg('Requested JSON parse failed.');
					} else if (status === 'timeout') {
						displayMsg('Request timed out');
					} else if (status === 'abort') {
						displayMsg('Ajax request aborted');
					} else {
						alert('Request failed.\n\nPlease refresh page and try again.\n\nIf problem persists, please email support@houzz.com');
					}
				}
	});
	
	var displayMsg = function(msg) {
			}
})();

HZ.ns('HZ.ajaz.Services');

var httpRequest = false;
var searchText = "";
var isMSIE = /*@cc_on!@*/false;

if (navigator.platform && navigator.platform.indexOf("Win") == 0) document.write ("<style>#tabs{font-weight:bold}</style>");

/*!
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 *
 */

// @win window reference
// @fn function reference
function contentLoaded(win, fn) {

	var done = false, top = true,

	doc = win.document, root = doc.documentElement,

	add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
	rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
	pre = doc.addEventListener ? '' : 'on',

	init = function(e) {
		if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
		(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
		if (!done && (done = true)) fn.call(win, e.type || e);
	},

	poll = function() {
		try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
		init('poll');
	};

	if (doc.readyState == 'complete') fn.call(win, 'lazy');
	else {
		if (doc.createEventObject && root.doScroll) {
			try { top = !win.frameElement; } catch(e) { }
			if (top) poll();
		}
		doc[add](pre + 'DOMContentLoaded', init, false);
		doc[add](pre + 'readystatechange', init, false);
		win[add](pre + 'load', init, false);
	}

}

function C2AjaxRequest()
{
	var ajaxResponseHandler;
	var url;
	var operation;
	var parameters;
	var data;
	
	this.init = function(url,operation,parameters,ajaxResponseHandler,data)
	{
		this.url = url;
		this.operation = operation;
		this.parameters = parameters;
		this.ajaxResponseHandler = ajaxResponseHandler;
		this.data = data;
	}
	
	this.getUrl = function()
	{
		return this.url;
	}
	
	this.getOperation = function()
	{
		return this.operation;
	}
	
	this.getParamters = function()
	{
		return this.parameters;
	}
	
	this.getAjaxResponseHandler = function()
	{
		return this.ajaxResponseHandler;
	}
	
	this.getData = function()
	{
		return this.data;
	}
}

function C2Ajax() 
{
	var ajaxRequestId;
	var ajaxRequests;
	var self=this;

	this.init = function()
	{
		this.ajaxRequestId = 0;
		this.ajaxRequests = new Array();
	}

	this.makeRequest = function(url,operation,parameters,ajaxResponseHandler,data)
	{
		this.ajaxRequestId++;
		var ajaxRequest = new C2AjaxRequest;
		ajaxRequest.init(url,operation,parameters,ajaxResponseHandler,data);
		this.ajaxRequests[this.ajaxRequestId] = ajaxRequest;
		var httpRequest = false;
		if (window.XMLHttpRequest) 
		{ // Mozilla, Safari,...
			httpRequest = new XMLHttpRequest();
			if (httpRequest.overrideMimeType) 
			{
				httpRequest.overrideMimeType('text/xml');
			}
		} 
		else if (window.ActiveXObject) 
		{ // IE
			try 
			{
				httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e) 
			{
				try 
				{
					httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
				} 
				catch (e) 
				{
				}
			}
		}
		if (!httpRequest) 
		{
			alert('An error has occurred. Please refresh the page'); // Cannot create XMLHTTP instance
			return false;
		}
		var callback = this.handleResponse;
		httpRequest.onreadystatechange = function(){callback(httpRequest)};
		if (parameters != '') parameters += '/';
		parameters += 'op='+operation+'/__='+encodeURIComponent((new Date()).getTime()) + '/ajaxRequestId='+ this.ajaxRequestId;
		httpRequest.open('GET', url + parameters, true);
		httpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		httpRequest.send(null);
	}
	
	this.handleResponse = function(httpRequest)
	{
		if (httpRequest.readyState == 4) 
		{
			if (httpRequest.status == 200) 
			{
				var result = httpRequest.responseText.toString();
				if (result)
				{	
					var resultObj = JSON.parse(result);
					if (resultObj)
					{
						var requestId = resultObj.ajaxRequestId;
						if (requestId && requestId>0)
						{
							var ajaxRequest = self.ajaxRequests[requestId];
							if (ajaxRequest)
							{
								var ajaxResponseHandler = ajaxRequest.getAjaxResponseHandler();
								if (ajaxResponseHandler) ajaxResponseHandler(resultObj,ajaxRequest);
							}
						}
					}
				}
			}
			else if(httpRequest.status == 401) {
				alert('Bad Request Error [401].\n\nPlease refresh page and try again.\n\nIf problem persists, please email support@houzz.com');
			}
			else if (httpRequest.status == 404) {
				alert('Requested page not found [404].\n\nPlease refresh page and try again.\n\nIf problem persists, please email support@houzz.com');
			}
			else if (httpRequest.status == 500) {
				alert('Internal Server Error [500].\n\nPlease refresh page and try again.\n\nIf problem persists, please email support@houzz.com');
			}
		}	
	}
	this.patchSpecialChars = function (str) {
		return str.replace(/\%2F/g, "[[2f]]")
			.replace(/\%0A/g, "[[0a]]");
	}
}

var ajaxc = new C2Ajax();
ajaxc.init();

/* 
 * Helper class for opening drop-down menus. 
 * Register your menu using this class's function registerMenu() 
 * @param triggerDivId - the div id that triggers opening the menu
 * @param contentDivId - the div id that contains the menu contents. This div's style will set to "inline" or "none" on click.
 * @param openCallback - callback function whenever the menu got opened, can be null.
 * @param closeCallback - callback function whenever the menu got closed, can be null. 
 * @param toggleOnTrigger - indicates that the triggerDivId functions as open/close, not just for opening.
 */
HZ.utils.MenuTrapper = new function() {
	var menus = [],
		eventHandler = null,
		ignoreNextEvent = false,
		openMenuId = null;
	
	this.registerMenu = function (triggerDivId, contentDivId, openCallback, closeCallback, toggleOnTrigger) {
		var triggerDiv = document.getElementById(triggerDivId);
		if (triggerDiv) {
			menus[triggerDivId] = {
				triggerDiv:triggerDiv,
				contentDiv:document.getElementById(contentDivId),
				openCallback:openCallback,
				closeCallback:closeCallback,
				isOpen:false,
				toggleOnTrigger:toggleOnTrigger
			}
			EventConnector.connect(triggerDiv, "onclick", this, 
				function(event) {
					this.handleClick(event, triggerDivId);
				}
			);
		}
	}
	
	this.handleClick = function(e, id) {
		e = e || window.event;
		if (!id && openMenuId && menus[openMenuId]) {
			if (ignoreNextEvent) {
				ignoreNextEvent = false;
				return;
			}			
			var bounds1 = UIHelper.getBounds(menus[openMenuId].contentDiv);
			var bounds2 = UIHelper.getBounds(menus[openMenuId].triggerDiv);
			var eventPos = getEventPosition(e);
			if (!UIHelper.isInsideRectangle(eventPos, bounds1) && !UIHelper.isInsideRectangle(eventPos, bounds2)) {
				this.toggleMenu(openMenuId);
			}
		}
		if (id && menus[id] && (!menus[id].isOpen || menus[id].toggleOnTrigger)) {
			this.toggleMenu(id);
		}
	}

	this.toggleMenu=function (menuId) {
		if (openMenuId && menuId != openMenuId) {	// close currently open menu
			this.toggleMenu(openMenuId)
		}
		if (menuId == openMenuId) {
			this.showMenu(menuId, false);
			openMenuId = null;
		} else {
			this.showMenu(menuId, true);
			openMenuId = menuId;
		}
		if (openMenuId && eventHandler == null) {
			eventHandler = EventConnector.connect(document, "onclick", this, this.handleClick);
			ignoreNextEvent = true;
		} else if (openMenuId == null && eventHandler != null) {
			EventConnector.disconnect(eventHandler);
			eventHandler = null;
		}		
	}
	
	this.showMenu = function(id, show) {
		menus[id].isOpen = show;
		menus[id].contentDiv.style.display = show?"inline":"none";
		if (show && menus[id].openCallback)
			menus[id].openCallback();
		else if (menus[id].closeCallback)
			menus[id].closeCallback();
	}
}


function inputFocus(o,defaultText)
{
	var defaultText = (defaultText == null) ? "" : defaultText;
	var className = o.className;
	if (className.length <= 5 || className.substring(className.length-5) !== "Focus")
	{
		o.className = className + "Focus";
		if (o.value == defaultText) o.value="";
	}
}

function inputBlur(o,defaultText)
{
	var defaultText = (defaultText == null) ? "" : defaultText;
	var className = o.className;
	if (className.length > 5 && className.substring(className.length-5) == "Focus")
	{
		o.className = className.substring(0,className.length-5);
		if (o.value == "") o.value=defaultText;
	} 
}

function getCookie( check_name ) {
	var a_all_cookies = document.cookie.split( ';' );
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false; // set boolean t/f default f
	
	for ( i = 0; i < a_all_cookies.length; i++ )
	{
		a_temp_cookie = a_all_cookies[i].split( '=' );		
		
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
	
		if ( cookie_name == check_name )
		{
			b_cookie_found = true;
			if ( a_temp_cookie.length > 1 )
			{
				cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			return cookie_value;
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if ( !b_cookie_found )
	{
		return null;
	}
}	

function setCookie( name, value, expires, path, domain, secure ) 
{
	var today = new Date();
	today.setTime( today.getTime() );
	
	if ( expires )
	{
	expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date( today.getTime() + (expires) );
	
	document.cookie = name + "=" +escape( value ) +
	( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) + 
	( ( path ) ? ";path=" + path : "" ) + 
	( ( domain ) ? ";domain=" + domain : "" ) +
	( ( secure ) ? ";secure" : "" );
}

function addLoadEvent(func) 
{
  var oldonload = window.onload;
  if (typeof window.onload != 'function') 
  {
    window.onload = func;
  } else 
  {
    window.onload = function() 
    {
      if (oldonload) 
      {
        oldonload();
      }
      func();
    }
  }
}

function isMouseReallyOut(e,elementName)
{
	if (!e) var e = window.event;
	
		
	var element = document.getElementById(elementName);
	if (element == null)
		return false;
		
	var eventPos = getEventPosition(e);
	var elementPos = getElementPosition(element);
	
	if (eventPos.x > elementPos.x && eventPos.y > elementPos.y && 
		eventPos.x < elementPos.x+element.offsetWidth && eventPos.y < elementPos.y+element.offsetHeight)
		return false;
	return true;		
}

function return2br(st) 
{
	return st.replace(/(\r\n|[\r\n])/g, "<br />");
}

function br2return(st)
{
	return st.replace(/<br\s*\/?>/gi,"\n");
}
function addQuoteSlashes(st) 
{
	return st.replace(/(\")/g, "&quot;");
}

function findPos(obj)
{
 var curleft = 0;
 var curtop = 0;
 if (obj.offsetParent)
 {
  while (obj.offsetParent)
  {
   curleft += obj.offsetLeft-obj.scrollLeft;
   curtop += obj.offsetTop-obj.scrollTop;
   var position='';
   if (obj.style&&obj.style.position) position=obj.style.position.toLowerCase();
   if ((position=='absolute')||(position=='relative')) break;
   while (obj.parentNode!=obj.offsetParent) {
    obj=obj.parentNode;
    curleft -= obj.scrollLeft;
    curtop -= obj.scrollTop;
   }
   obj = obj.offsetParent;
  }
 }
 else {
     if (obj.x)
      curleft += obj.x;
  if (obj.y)
      curtop += obj.y;
    }
 return {left:curleft,top:curtop};
}

function getEventPosition(e)
{
	var posx = 0, 
		posy = 0;
	if (e.pageX || e.pageY)
	{
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY)
	{
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	return {x:parseInt(posx),y:parseInt(posy)};
}
function getElementPosition(obj) {
	var left = 0, top = 0, width=obj.offsetWidth, height=obj.offsetHeight;
	if (obj.offsetParent) {
		do {
			left += obj.offsetLeft;
			top += obj.offsetTop;
		} while (obj = obj.offsetParent);
	} else if (obj.x) {
		left += obj.x;
		top += obj.y;
	}
  return {x:parseInt(left),y:parseInt(top),w:width,h:height};
}

function centerControl(ctrl, width, height, referenceElement)
{
	var divLeft, divTop;
	var screenSize = UIHelper.getScreenBounds();
	if(ctrl != null) {
		if(ctrl.style.display != 'none') {
    	divLeft = ((screenSize.w - width) / 2);
    	divTop = ((screenSize.h - height) / 2);
      if(document.documentElement != null) {
        if (document.body.scrollTop > 0) {
        	divLeft = divLeft + document.body.scrollLeft;
        	divTop = divTop + document.body.scrollTop;	     	
				} else {
        	divLeft = divLeft + document.documentElement.scrollLeft;
        	divTop = divTop + document.documentElement.scrollTop;
        }
      } else {
      	divLeft = divLeft + document.body.scrollLeft;
        divTop = divTop + document.body.scrollTop;
      }
      UIHelper.setPosition(ctrl, divLeft, divTop, referenceElement);
    }
  }
}
 
function changeGalleryStripBorderColor(divContainer,newBorderColor)
{
	var o=divContainer.childNodes[0];
	for (i=0;i < o.childNodes.length;i++) o.childNodes[i].style.borderColor=newBorderColor;
}

function textAreaCharCounter(textarea, maxChars,charLeftText)
{
	charLeft = maxChars-textarea.value.length;
	if (charLeft < 0) charLeft = 0;
	if (charLeftText) charLeftText.innerHTML= ''+charLeft;
	if(textarea.value.length <= maxChars) return;
	textarea.value = textarea.value.substr(0, maxChars);
}

function inputCharCounter(inputElement, maxChars,charLeftText)
{
	charLeft = maxChars-inputElement.value.length;
	if (charLeftText) charLeftText.innerHTML= ''+charLeft;
}
function validateColorValue(o,withNumberSign,defaultValue)
{
	var strPattern = /^[0-9a-f]{6}$/i; 
	if (withNumberSign) strPattern = /^#[0-9a-f]{6}$/i; 
	if (!strPattern.test(o.value)) o.value = defaultValue; 
}
function alignPopupMenu (popupMenuName, popupButtonName, hAlign, delta) {
	var popupMenu = document.getElementById (popupMenuName);
	var popupButton = document.getElementById (popupButtonName);
	var mPos = getElementPosition(popupMenu);
	var pos = getElementPosition(popupButton);
	var ref = getElementPosition(popupButton.parentNode);
	var x = pos.x - ref.x + hAlign[0]*pos.w - hAlign[1]*mPos.w;
	var y = pos.y - ref.y + pos.h;
	popupMenu.style.left = x + (delta.x || 0) +  "px";
	popupMenu.style.top = y + (delta.y || 0) + "px";	
}
alignPopupMenu.R2R = [1,1];
alignPopupMenu.R2L = [0,1];
alignPopupMenu.L2R = [1,0];
alignPopupMenu.L2L = [0,0];

function togglePopupMenu (popupMenuName, popupButtonName, show) {
	var popupMenu = document.getElementById (popupMenuName);
	if (popupMenu) {
		popupMenu.style.display = show?"inline":"none";
	}
	var popupButton = document.getElementById(popupButtonName);
	if (popupButton) {
		if (show) {
			popupButton.className = popupButton.className + " selected";
		} else {
			popupButton.className = popupButton.className.replace(/selected/g,"");
		}
	}		
}

function showMenu(menuId)
{
	var menu = document.getElementById(menuId+'Menu');
	var btnPos = findPos(document.getElementById(menuId+'MenuBtn'));
	menu.style.display = "block";
	var menuLeft = parseInt(btnPos.left);
	var menuTop = parseInt(btnPos.top) + 20;  // calculate 20 from height of item
	menu.style.left = menuLeft + "px";
	menu.style.top = menuTop + "px";
}
function hideMenu(menuId)
{	
	var menu = document.getElementById(menuId+'Menu');
	menu.style.display = "none";
}
function menuSelect(o,menuId)
{
	document.getElementById(menuId+'menuBtn').innerHTML = o.innerHTML;
	//onMenuSelect(parseInt(o.id.substring(10+strlen(menuId))));   -- strlen, pass onMenuSelect
	hideMenu(menuId);
}
function adjustFeaturedGalleryHeight(divId) 
{
	var t  = document.getElementById(divId+"Title");
	var tl = document.getElementById(divId+"TitleLink");
	if (t && tl && tl.offsetHeight>24) 
	{
		t.style.top = (-tl.offsetHeight - 12) + "px";
		t.style.height = (tl.offsetHeight) + "px";
	}
}
function adjustFeaturedGalleriesHeight(divId,divCount)
{
	for (divIter=0;divIter<divCount;divIter++) 
	{
		adjustFeaturedGalleryHeight(divId+divIter);
	}
}
function getButtonHtml(buttonText,isLarge,id,buttonClass,buttonStyle,isSubmit,onClick,additionalHtml,buttonLink)
{
	var buttonHtml = "<button " + ((id=="")?"":("id='"+id+"'"));
	buttonHtml += " class='"+((isLarge)?"largeButton":"stdButton")+" "+buttonClass+"'";
	buttonHtml += ((buttonStyle=="")?"":" style='"+buttonStyle+"'");
	buttonHtml += ((isSubmit)?" type='submit'":"");
	if (buttonLink!="") onClick += "window.location='"+buttonLink+"';return false;";
	buttonHtml += ((onClick=="")?"":" onclick=\""+onClick+"\"");
	buttonHtml += " "+additionalHtml+">"+buttonText+"</button>";	
	return buttonHtml;
}

function disableForm(form) 
{
	for (i = 0; i < form.length; i++) 
	{
		var tempobj = form.elements[i];
		if (tempobj.type.toLowerCase() == "submit" || tempobj.type.toLowerCase() == "reset")
			tempobj.disabled = true;
	}
}
function focusOnSubmit(form)
{
	for (i = 0; i < form.length; i++) 
	{
		var tempobj = form.elements[i];
		if (tempobj.type.toLowerCase() == "submit")
		{
			tempobj.focus();
			return;
		}
	}
}
function preventImageDrag(event) {
	if (event && event.preventDefault && event.button != 2) event.preventDefault();	
}
function addHrefToURL(text,newWindow) {
	var url_matches = [/(https?:\/\/([-\w\.]+)+(:\d+)?(\/([-\w/_\.]*(\?\S+)?)?)?)/g, /([wW]{3}\.([-\w\.]+)+(:\d+)?(\/([-\w/_\.]*(\?\S+)?)?)?)/g];
	var replacement = "<a href='$1'>$1</a>";
	if (newWindow)
		replacement = "<a href='$1' target='_blank'>$1</a>";
	for (var i=0; i < 2; i++) {
		newText = text.replace (url_matches[i], replacement);
		if (newText != text)
			return newText;
	}
	return text;
}
var pageSearchQuery="";
function handleStyleSelectorChanged(baseUrl) {
	var element = document.getElementById("styleSelector");
	var value = element.options[element.selectedIndex].value;
	value = (value != "") ? "/"+ value : "";
	var matches = baseUrl.match(/^(.*\/photos)(\/.*)$/);
	var query = (pageSearchQuery != null) ? "/"+pageSearchQuery : "";
	document.location = matches[1] + value + matches[2] + query;
}
/* TODO: remove this function once we switch to Topic Navigation */
function handleMetroAreaSelectorChanged(baseUrl) {
	var element = document.getElementById("metroAreaSelector");
	var value = element.options[element.selectedIndex].value;
	value = (value != "") ? "/"+ value : "";
	var query = (pageSearchQuery != null) ? "/"+pageSearchQuery : "";
	document.location = baseUrl + value + query;
}
function alignElement(elementId, contextId, parentId)
{
		var adContainer = document.getElementById(contextId);
		var adTag = document.getElementById(elementId);
		var mainContent = document.getElementById(parentId);
		if (adContainer && adTag && mainContent)
		{
			var adContainerX = getElementPosition(adContainer).x;
			var adContainerY = getElementPosition(adContainer).y;
			var mainContentX = getElementPosition(mainContent).x;
			var mainContentY = getElementPosition(mainContent).y;
			adTag.style.left = (adContainerX - mainContentX) + "px";
			adTag.style.top = (adContainerY - mainContentY) + "px";
		}
}

function mixin(target, source) {
	if (!target) target={};
	var empty = {};
	for (var name in source){
		var s = source[name];
		if(!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))){
			target[name] = s;
		}
	}
	return target;
}

function hitch (scope, method) {
	return function() {
		var args = Array.prototype.slice.call(arguments);
		if (args == null) args = [];
		return method.apply(scope, args);
	}
}

EventConnector = {
	createDispatcher:function() {
		var dispatcher = {listeners:[]};
		var func = function(event, operation, values) {
			if (!event) {
				if (operation=="add") {
					this.listeners.push(values); 
					return this.listeners.length-1;
				} else if (operation=="remove" && typeof(values) == "number" && values < this.listeners.length) {
					this.listeners.splice(values,1);
					return this.listeners.length;
				}
			}
			for (var i=0; i < this.listeners.length; i++) {
				var object = this.listeners[i][0];
				var method = this.listeners[i][1];
				method.apply (object, arguments);
			}
		};
		return hitch (dispatcher, func);
	},
	
	connect:function(obj, event, context, method) {
		if (obj[event] == null)
			obj[event] = EventConnector.createDispatcher();
		var l = obj[event].apply(obj, [null, "add", [context, method]]);
		return [obj, event, l];
	},
	
	disconnect:function(handler) {
		if (!handler) 
			return;
		var obj = handler[0];
		var event = handler [1];
		if (obj[event] != null) {
			var i = obj[event].apply(obj, [null, "remove", handler[2]]);
			if (i == 0)
				obj[event] = null;
		}
	}
}

var UIHelper = {
/* Element positioning functions */
	ALIGN_TOP_LEFT:[0,0],
	ALIGN_TOP_CENTER:[0.5,0],
	ALIGN_TOP_RIGHT:[1,0],
	ALIGN_MIDDLE_RIGHT:[1,0.5],
	ALIGN_BOTTOM_RIGHT:[1,1],
	ALIGN_BOTTOM_CENTER:[0.5,1],
	ALIGN_BOTTOM_LEFT:[0,1],
	ALIGN_MIDDLE_LEFT:[0,0.5],
	ALIGN_MIDDLE_CENTER:[0.5,0.5],

	getSpaceImageURL:function (spaceId, thumbnail) {
		return "http://st.houzz.com/simages/"+spaceId+"_0_"+thumbnail+"-.jpg";
	},
	getProfessionalImageURL:function (professionalId, thumbnail) {
		return "http://st.houzz.com/prof_images/"+professionalId+"_"+thumbnail+".jpg";
	},
	defaultUserImageURL: "http://st.houzz.com/user_images/"+"d1"+"_"+2+".gif",
	getUserImageURL:function (userName, thumbnail, refresh) {
		if(userName==null) {
			return this.defaultUserImageURL;
		}
		else {
			var randStr = refresh?'?'+Math.floor(Math.random()*1000001):'';
			return "http://st.houzz.com/user_images/"+userName+"_"+thumbnail+".jpg"+randStr;
		}
	},
	getImageSize:function (space, thumbnail) {
		var max=0;
		var r = space.height/space.width;
		switch (thumbnail) {
			case 0:	max = 80; break;
			case 1:	max = 160; break;
			case 2:	max = 240; break;
			case 3:	max = 320; break;
			case 4:	max = 640; break;
			case 5: return {w:75, h:55};
			case 6: return {w:160, h:120};
			case 7: return {w:240, h:190};
			case 8: return {w:500, h:500*r};
			case 9:	max = 990; break;
			case 14: max = 2560; break;
		}
		if (space.width > space.height)
			return {w:max, h: max*r};
		else
			return {w:max/r, h:max};
	},

	getSpaceURL:function(spaceId) {
		return "/photos/"+spaceId;
	},

	getProfessionalURL:function(professionalId) {
		return "/professional/"+professionalId;
	},
	getUserURL:function(userName, isProfessional) {
		if (isProfessional)
			return "/pro/"+userName;
		else
			return "/user/"+userName;
	},

	isIE6:window.external && typeof window.XMLHttpRequest == "undefined",
	isIE7:navigator.userAgent.toLowerCase().indexOf( "msie 7." )!=-1,
	isiPad:navigator.userAgent.match(/iPad/i) != null,
	isiPhone:(navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null),
	isChrome:navigator.userAgent.match(/Chrome/i) != null,
	isAndroid:navigator.userAgent.match(/Android/i) != null,
	isSafari:(navigator.userAgent.match(/Safari/i) && !navigator.userAgent.match(/Chrome/i)),
	isMSIE:navigator.userAgent.match(/MSIE/i) != null,
	isMobileDevice:this.isiPad || this.isiPhone || this.isAndroid,
	getScreenBounds: function() {
		if (window.opera && typeof window.innerWidth)
		return {
			x:0, y:0, 
			w:window.innerWidth-16,
			h:window.innerHeight
		}
		var t = document.compatMode=='CSS1Compat';
		return {
			x:0, y:0, 
			w:t?document.documentElement.clientWidth:document.body.clientWidth,
			h:t?document.documentElement.clientHeight:document.body.clientHeight
		}
	},
	setBounds:function(element,x,y,w,h) {
		var b = x;
		if (typeof(x) != "object") {
			b = {x:x, y:y, w:w, h:h};
		}
		var keyValues = {left:"x", top:"y", width:"w", height:"h"};
		for (var key in keyValues) {
			var v = b[keyValues[key]];
			element.style[key] = (typeof(v)=="string")?v:(Math.round(v)+"px");
		} 
	},
	centerElement:function(element,refElement) {
		var b;
		if (refElement) b = this.getBounds(refElement);
		else b = this.getScreenBounds()
		var r = this.getAlignedBoundRect(this.getBounds(element), b, this.ALIGN_MIDDLE_CENTER, true);
		this.setPosition(element,r);
	},
	getBounds:function(element, refElement) {
		var bounds = getElementPosition(element);
		if (refElement) {
			var refBounds = getElementPosition(refElement);
			bounds.x -= refBounds.x;
			bounds.y -= refBounds.y;
		}
		return bounds; 
	},
	setPosition:function(element,x,y,refElement) {
		if (typeof(x) == "object") {
			y = x.y;
			x = x.x;
		}
		if (refElement) {
			var refPos = this.getBounds(refElement);
			y -= refPos.y;
			x -= refPos.x;
		}
		var s = element.style;
		s.top = Math.round(y)+"px";
		s.left = Math.round(x)+"px";
	},
	getAlignedBoundRect:function(box, targetBox, alignment, inside, delta) {
		if (typeof (targetBox) == "object" && targetBox.parentNode != null)
			targetBox = this.getBounds(targetBox);
		if (typeof (box) == "object" && box.parentNode != null)
			box = this.getBounds(box);
			
		if (!delta)	delta = {x:0,y:0};
		var ax = alignment[0];
		var ay = alignment[1];
		var x = targetBox.x + ax*targetBox.w - (inside?ax:(1-ax))*box.w + delta.x;
		var y = targetBox.y + ay*targetBox.h - (inside?ay:(1-ay))*box.h + delta.y;
		return {x:x, y:y, w:box.w, h:box.h};
	},
	isInsideRectangle:function(point, rect) {
		return ((point.x >= rect.x) && (point.x <= rect.x+rect.w) &&
				(point.y >= rect.y) && (point.y <= rect.y+rect.h))
	},
/* Modal Dialogs */
	initModalPlaceholder:function() {
		if (this.baseDiv)
			return;
	
		var e = document.createElement("div");
		e.id = "modalPlaceholder";
		e.style.position = this.isIE6?"absolute":"fixed";
		document.body.insertBefore(e, document.body.firstChild);
		this.baseDiv = e;
	
		var bg = document.createElement("div");
		bg.id = "modalPlaceholderBG";
		this.setBounds(bg,0,0,"100%",(this.isIE6?"2000px":"100%"));
		e.appendChild(bg);
		
		e2 = document.createElement ("div");
		e2.id = "modalDialogContainer";
		e.appendChild(e2)
		this.modalDialogDiv = e2;
	},
	showModalDialog:function(shouldHandleResize) {
		this.initModalPlaceholder();
		this.showingModal = true;
		this.baseDiv.style.display = "block";
		this.reposition();
		if (shouldHandleResize) {
			this.handler1 = EventConnector.connect (window, "onresize", this, this.reposition);
			this.handler2 = EventConnector.connect (window, "onscroll", this, this.resetTop);
		}
		$("html").addClass("modalDialog");
		return this.modalDialogDiv;
	},
	showModalLayer:function(rootDiv) {
		if (this.isIE6 || this.isIE7) return;
		this.showModalDialog(true);
	},
	hideModalDialog:function() {
		if (!this.showingModal) return;
		this.baseDiv.style.display = "none";
		EventConnector.disconnect(this.handler1);
		EventConnector.disconnect(this.handler2);
		$("html").removeClass("modalDialog");
	},
	hideModalLayer:function() {
		if (this.isIE6 || !this.showingModal) return;
		this.hideModalDialog();
	},
	reposition:function() {
		this.centerElement(this.modalDialogDiv);
	},
	resetTop:function() {
		if (this.isIE6) {
			var scrollTop = 0;
			if (document.documentElement)
				scrollTop = document.documentElement.scrollTop;
			else if (document.body)
				scrollTop = document.body.scrollTop;
			this.baseDiv.style.top = scrollTop+"px";
		}
	},
	getScrollXY: function() {
	  var scrOfX = 0, scrOfY = 0;
	  if( typeof( window.pageYOffset ) == 'number' ) {
	    //Netscape compliant
	    scrOfY = window.pageYOffset;
	    scrOfX = window.pageXOffset;
	  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
	    //DOM compliant
	    scrOfY = document.body.scrollTop;
	    scrOfX = document.body.scrollLeft;
	  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
	    //IE6 standards compliant mode
	    scrOfY = document.documentElement.scrollTop;
	    scrOfX = document.documentElement.scrollLeft;
	  }
	  return [ scrOfX, scrOfY ];
	},
	validateEmail:function(emailString, allowMultiple) {
		var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  // see: 
		var strings = [emailString];
		if (allowMultiple) {
			var strings = emailString.split(",");
		}
		var valid = false;
		for (var i=0; i<strings.length; i++) {
			var str = UIHelper.trim(strings[i]);
			if (str) {
				if (!emailPattern.test(str))
					return false;
				else
					valid = true;
			}
		}
		return valid;
	},	
	trim:function(str) {
		return str.replace(/^\s+|\s+$/g,"");
	},
	ucwords:function(str) { // see: http://phpjs.org/functions/ucwords:569
		return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
			return $1.toUpperCase();
		});
	},
	stringToHtml:function(str) {
		return str.replace(/\n/g,"<br>");
	},
	convertLinksInString:function(str) {
		return str
			.replace(/<\s*a\s+([^>]*)?\>/gi, "<a rel=\"nofollow\" target=\"_blank\" $1>")
			.replace(/(^|[\n \(])([\w]+?:\/\/[\w\#$%&~/.,\-;:=?@\[\]+]*)/gi, "$1<a rel=\"nofollow\" target=\"_blank\" href=\"$2\">$2</a>")
	},
	truncate:function(str, maxLength, breakChars, withEllipsis) {
		if (str.length <= maxLength)
			return str;
		var l=Math.min(maxLength-(withEllipsis?3:0), str.length);
		var length = l;
		if (breakChars != null) {
			while (length > 0) {
				var c = str.charAt(length);
				if (breakChars.indexOf(c) > -1)
					break;
				else
					length--;
			}
			if (length == 0)
				length = l;
		}
		var returnValue = str.substring(0, length)+ (withEllipsis?"...":"");
		return returnValue;
	},
	TRUNCATE_WHITE_SPACES:" \t\n\r",
	TRUNCATE_BR: "\n\r"
			
}

/* Homepage dropdown menus */
var MenusHelper = {
	menus:{},
	registerMenu:function(menuId, menuDiv) {
		HZ.utils.MenuTrapper.registerMenu(menuDiv+"Title", menuDiv+"Body", 
			function(){
				MenusHelper.openMenu(menuId);
			}, 
			function(){
				MenusHelper.closeMenu(menuId);
			}, 
			true);
		
		if (this.menus[menuId] == null) {
			this.menus[menuId] = {
				body:document.getElementById(menuDiv+"Body"),
				title:document.getElementById(menuDiv+"Title")
			}
		}  
	},
	closeMenu:function(menuId) {
		if (menuId && this.menus[menuId]) {
			menu = this.menus[menuId];
			menu.title.className = "homepageMenuTitle";
		}
	},
	openMenu:function(menuId) {
		menu = this.menus[menuId];
		menu.title.className = "homepageMenuTitle homepageMenuTitleSelected";
		alignPopupMenu(menu.body.id, menu.title.id, alignPopupMenu.R2R, {x:0,y:-1});
	}
} 


var AddToIdeabookDialog = {
	spaceId:null,
	callback:null,
	render:function(context) {
		window.addToMyGalleryDialogCallback = hitch (this, function (data) {
			if (this.callback)
				this.callback(data);
		});
		showAddToMyGalleryForm(this.spaceId);
	}
}

var PhotoContextMenu = {
	show:function(event, spaceId) {
		if (this.contextMenuDiv == null) {
			this.contextMenuDiv = document.getElementById ("PhotoContextMenu");
			if (!this.contextMenuDiv)
				return;
		}
		e = event || window.event;
		this.spaceId = spaceId;
		var eventPos = getEventPosition(e);
		var rootPosition = {x:0,y:0}; 
		UIHelper.setPosition(this.contextMenuDiv, 8+eventPos.x-rootPosition.x, 8+eventPos.y-rootPosition.y, document.getElementById('mainContent'));
		this.contextMenuDiv.style.display='block';
		var inputField = document.getElementById('PhotoContextMenuFocus');
		if (inputField)	
			inputField.focus();
		this.contextMenuShowing = true;
		return false;
	},
	dismiss:function(event) {
		this.contextMenuShowing = false;
		setTimeout (hitch(this,this.hide),200);
	},
	hide:function() {
		if (!this.contextMenuShowing)
			this.contextMenuDiv.style.display='none';
	},
	openSpaceInNewWindow:function() {
		var url = UIHelper.getSpaceURL(this.spaceId);
		window.open(url);
	},
	addToIdeabook:function() {
		if (window.addToIdeabookURL)
			document.location = addToIdeabookURL;
		else {
			AddToIdeabookDialog.spaceId = this.spaceId;
			AddToIdeabookDialog.render(null);
		}
	}
}

HZ.utils.Print = {
	printUrl:function(url, popup) {
		if (popup) {
			win = window.open(url);
		}
		else {
			var pf = document.getElementById('printFriendly');
			if (pf != null) {
				pf.src = url;
			}
		}
	},
	handlePrintFrameLoaded:function() {
		if (document.getElementById('printFriendly').src != '') {
			frames['printFriendly'].focus();
			frames['printFriendly'].print();
		}
	},
	printSpace:function(spaceId, popup) {
		var url = HZ.utils.Config.baseSpaceLink + spaceId;
		popup = popup || false;
		if (popup)
		{
			url += "/ac=print";
		}
		this.printUrl(url, popup);
	},
	printGallery:function(galleryId, privacyToken, popup) {
		var url = HZ.utils.Config.basePrintGalleryLink + galleryId + "/thumbs/";
		popup = popup || false;
		if (privacyToken) {
			url += "/pt="+privacyToken;
		}
		this.printUrl(url, popup);
	}
}

var appPromoClick = function() {
	var img = document.createElement('IMG');
	img.style.cssText="width:1px;height:1px;position:absolute;left:-1000px";
	var src = 'http://www.houzz.com/res/1593/pic/ap_s.gif?v=1593';
	src = src + '&r=' + (new Date()).getTime();
	img.setAttribute("src",src);
	document.body.appendChild(img);
}

HZ.utils.Config = {
	baseUrl:"http://www.houzz.com",
	shortBaseUrl: "houzz.com",
	vNum:1593,
	fbAppId:143965932308817,
	filesBaseUrl:"http://st.houzz.com/files/",
	errorLogger:"jsErr",
	baseCssPath:"/res/1593/css/",
	basePicPath:"/res/1593/pic/",
	baseUserLink:"/user/",
	baseProLink:"/pro/",
	baseEditProfileLink: "/editProfile2/",
	baseSpaceLink:"/photos/",
	baseBrowseLink:"/photos/",
	baseEditSpaceLink:"/edit/",
	baseDynamicImageUrl:"http://st.houzz.com/fimgs/",
	baseStaticImageUrl:"http://st.houzz.com/simgs/",
	baseSpaceDynamicImageUrl:"http://st.houzz.com/fimages/",
	baseSpaceStaticImageUrl:"http://st.houzz.com/simages/",
	baseUserImageUrl:"http://st.houzz.com/", /* TODO: remove this, user images should be the same as sharded images */
	baseGalleryLink:"/ideabooks/",
	baseProjectLink:"/projects/",
	baseQuestionLink:"/discussions/",
	basePrintSpaceLink:"/printSpace/",
	basePrintGalleryLink:"/printGallery/",
	baseViewEndorsementUrl:"/viewEndorsement/",
	baseMobileSigninLink:"/signin/",
	baseMobileSignupLink:"/signup/",
	baseFbFeedRedirectLink:"/fbFeed/",
	baseEventLogLink:"/ajaxEventLogger/",
	browseBuyerOrdersUrl:"http://www.houzz.com/browseBuyerOrders",
	emptyGifData:UIHelper.isIE7?"http://www.houzz.com/res/1593/pic/spacer.gif?v=1593":"data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw%3D%3D",
	swfUploadUrl:"http://www.houzz.com/res/1593/pic/swfupload_f10.swf?v=1593",
	uploadSpacesUrl:"http://www.houzz.com/uploadSpaces",
	uploadProductFeedUrl:"http://www.houzz.com/uploadProductFeed",
	uploadOrderFeedUrl:"http://www.houzz.com/uploadOrderFeed",
	baseOrganizeUrl:"http://www.houzz.com/organizeCollection",
	viewShoppingCartUrl: "http://www.houzz.com/viewCart"
}

HZ.utils.Logger = {
	eventCounter:0,
	sendError:function(error) {
		if (error.errorReported)
			return false;
		// ignore History.js errors on Safari private browsing mode, nol_t errors generated by Nielsen tracking
		var ignoreMsgRegex = /quota_exceeded|nol_t/i;
		// ignore fb connect lib, quantcast tracking, google plus and GA tracking errors
		var ignoreFileRegexes = [
			/connect\.facebook\.net/i,
			/edge\.quantserve\.com/i,
			/apis\.google\.com/i,
			/secure-us\.imrworldwide/i,
			/google-analytics\.com/i,
			/indystar\.com\/scripts/i,
			/platform\.twitter\.com/i,
			/ad\.doubleclick\.net/i
		];
		if (error.msg && ignoreMsgRegex.exec(error.msg)) {
			return;  // ignore these errors
		}
		for (var i in ignoreFileRegexes) {
			if (error.file && ignoreFileRegexes[i].exec(error.file)) {
				return;
			}
		}

		var bounds = UIHelper.getScreenBounds();
		var jsFiles = [];
		if (window.hzmr) {
			for (var i=0; i<window.hzmr.length; i++) {
				jsFiles.push (window.hzmr[i].match(/(.*):/)[1]);
			}
			jsFiles = jsFiles.join(",");
		}
		var src = HZ.utils.Config.baseUrl + "/" + HZ.utils.Config.errorLogger 
			+ "/m=" + encodeURIComponent(error.msg)
			+ "/f=" + (error.file ? encodeURIComponent(error.file) : "")
			+ "/l=" + (error.line ? encodeURIComponent(error.line) : "")
			+ "/url=" + (error.url? encodeURIComponent(error.url) : "")
			+ "/cws=" + bounds.w + ":" + bounds.h
			+ "/b=" + navigator.appName
			+ "/v=" + navigator.appVersion 
			+ "/ce=" + navigator.cookieEnabled  
			+ "/p=" + navigator.platform
			+ "/j=" + jsFiles
			+ "/st=" + (error.st ? encodeURIComponent(error.st) : "")
			+ "/r=" + (document.referrer ? encodeURIComponent(document.referrer) : "");
		
		src = src.replace (/\%2F/g, "[[2f]]");
		(new Image()).src = src;
	},
	sendMessage:function(msg) {
		this.sendError({msg:msg});
	},
	sentEventLogEvents:{},
	sendEventLogOnce:function(eventName, eventMessage) {
		if (eventName && !this.sentEventLogEvents[eventName] && this.sendEventLog(eventName, eventMessage)) {
			this.sentEventLogEvents[eventName] = true;
		} else {
		}
	},
	sendEventLog:function(eventName, eventMessage) {
		eventMessage = eventMessage?JSON.stringify (eventMessage):"";
		if (eventName && document.images) {
			var i=new Image(),
				src = HZ.utils.Config.baseUrl + HZ.utils.Config.baseEventLogLink
				+ "evtName=" + eventName + "/"
				+ "evtMessage=" + encodeURIComponent(eventMessage) + "/"
				+ "iid=" + HZ.data.IID + "/"
				+ "ec=" + this.eventCounter;
			this.eventCounter++;
			src = src.replace (/\%2F/g, "[[2f]]");
			i.src=src;
			try{
				document.body.appendChild(i);
				i.style.position="absolute";
				i.style.left="-100px";
				i.style.top="-100px";
				return true;
			} catch (err) {
				
			}
		}
	},
	parseExceptionFileAndLine:function(line) {
		var m = line.match (/(.*)@(.*):([0-9]{1,})/);
		if (m) {
			var a = {func:m[1], file:m[2], line:m[3]};
			a.file = a.file.replace(/&v=\d*/, "");
			a.file = a.file.replace(/http.*js\/script\?f=/, "");
			return a;
		} else 
			return null;
	},
	sendJsException:function(msg, file, line) {
		HZ.utils.Logger.sendError({msg:msg, file:file, line:line, url:window.location.href, st:HZ.utils.Logger.stackTrace});
		this.stackTrace = null;
		throw (msg + " - " + file + ":" + line);	// make sure the exception shows up in firebug etc.
		return false;
	}
}

window.onerror = HZ.utils.Logger.sendJsException;

HZ.utils.Links = {
	C:HZ.utils.Config,
	getPicUrl:function (fileName) {
		return this.C.baseUrl + this.C.basePicPath + fileName+"?"+HZ.utils.Config.vNum;
	},
	getGalleryLink:function(galleryId) {
		return this.C.baseUrl + this.C.baseGalleryLink + galleryId;
	},
	getSpaceLink:function(spaceId) {
		return this.C.baseUrl + this.C.baseSpaceLink + spaceId;
	},
	getProjectLink: function (projId) {
		return this.C.baseUrl + this.C.baseProjectLink + projId;
	},
	getSpaceLinkWithSEO:function(spaceId, title, style, category, metro) {
		var categoryStr = "-";
		if (spaceId && !title && !style && !category && !metro && HZ.data && HZ.data.Spaces) {
			var space = HZ.data.Spaces.get(spaceId);
			if (space) {
				category = HZ.data.Categories.getCategoryById(space.cat);
				if (category && category.categoryId != 4)
					categoryStr = category.name;
				style = HZ.data.Styles.get(space.s);
				metro = space.ma;
				title = space.t;
			}
		}
		var seoText = title;
		if (style)
			seoText += "-" + style;
		if (category)
			seoText += "-" + categoryStr;
		if (metro)
			seoText += "-" + metro;
		seoText = this.cleanSEOText(seoText);
		return this.getSpaceLink(spaceId) + "/" + seoText;
	},
	getEditSpaceLink:function(spaceId) {
		return this.C.baseUrl + this.C.baseEditSpaceLink + "id=" + spaceId;
	},
	log:function(message) {
		if (window.console) { console.log(message); }
	},
	getSpaceImageUrl:function(spaceId, width, height, whiteBg, timestamp, imageIndex) {
		var imageId = null,
			imageIndex = imageIndex || 0,
			timestamp = timestamp || 0,
			space = HZ.data.Spaces.get(spaceId);
			
		if (space && space.iids && space.iids[imageIndex]) {
			imageId = space.iids[imageIndex];
			var image = HZ.data.Images.get(imageId);
			if (image) {
				timestamp = image.ts;
				if (!whiteBg)
					whiteBg = image.bg;
			} else {
				this.log ("couldn't find image: " + imageId);
			}
		} else {
			this.log ("Missing image for space id " + spaceId + ". Make sure it's in HZ.data.Images!");
		}
		timestamp = timestamp?timestamp:"0000";
		whiteBg = whiteBg?1:0;
		if (imageId)
			return this.C.baseDynamicImageUrl + imageId + "_" + timestamp + "-w" + width + "-h" + height + "-b" + whiteBg + "-p0--home-design.jpg";			
		else {
		// TODO: Send report back to server 
			return this.C.baseSpaceDynamicImageUrl + spaceId +"_" + timestamp + "-w" + width + "-h" + height + "-b" + whiteBg + "-p0--.jpg";
		}
	},
	getSpaceImageThumbUrl:function (spaceId, thumbnail, timestamp, imageIndex) {
		var imageId = null,
			imageIndex = imageIndex || 0,
			timestamp = timestamp || 0,
			space = HZ.data.Spaces.get(spaceId);

		if (space && space.iids && space.iids[imageIndex]) {
			imageId = space.iids[imageIndex];
			var image = HZ.data.Images.get(imageId);
			if (image) {
				timestamp = image.ts;
			} else {
				this.log ("couldn't find image: " + imageId);
			}
		} else {
			this.log ("Missing image for space id " + spaceId + ". Make sure it's in HZ.data.Images!");
		}
		
		timestamp = timestamp?timestamp:"0000";
		if (imageId)
			return this.C.baseStaticImageUrl+imageId+"_"+thumbnail+"-"+timestamp+"/home-design.jpg";
		else {
		// TODO: Send report back to server 
			return this.C.baseSpaceStaticImageUrl + spaceId+"_0_"+thumbnail+"-"+timestamp+".jpg";
		}
	},
	getImageUrl:function(imageId, width, height, whiteBg, timestamp) {
		timestamp = timestamp?timestamp:"0000";
		whiteBg = whiteBg?1:0;
		return this.C.baseDynamicImageUrl+imageId+"_"+timestamp+"-w"+width+"-h"+height+"-b"+whiteBg+"-p0--home-design.jpg";
	},
	getSpaceImageSeoThumbUrl:function (spaceId, thumbnail, styleStr, category, imageIndex) {
		var categoryStr = "-",
			seoText, 
			space = HZ.data.Spaces.get(spaceId),
			imageId = null,
			image = null,
			timestamp = null,
			imageIndex = imageIndex || 0;
			
			
		if (!styleStr) {
			styleStr = "-";
		}
		if (category && category.categoryId != 4) {
			categoryStr = category.name;
		}		
		seoText = styleStr + "-" + categoryStr;
		seoText = seoText.replace(/[^a-zA-Z0-9_-]/g,"-");
		if (space && space.iids && space.iids[imageIndex]) {
			imageId = space.iids[imageIndex];
			var image = HZ.data.Images.get(imageId);
			if (image) {
				timestamp = image.ts;
			} else {
				this.log ("couldn't find image: " + imageId);
			}

		}

		timestamp = timestamp || "0000";
		if (imageId) {
			if (!seoText)
				seoText = 'home-design';
			return this.C.baseStaticImageUrl + imageId + "_" + thumbnail + "-" + timestamp + "/" + seoText + ".jpg";
		}
		else
			return this.C.baseSpaceStaticImageUrl + spaceId + "_0_" + thumbnail + "-" + timestamp + "-" + seoText + ".jpg";
	},
	getFileImageUrl:function(fileId, thumbNumber) {
		return this.C.filesBaseUrl + fileId +"_"+thumbNumber+".jpg";
	},
	getQuestionLink:function(questionId) {
		return this.C.baseUrl + this.C.baseQuestionLink + questionId;
	},
	getQuestionLinkWithSEO:function(questionId, title, body) {
		var seoText = title;
		if (seoText == "" || seoText == null) {
			seoText = body;
			if (seoText != "") {
				seoText = seoText.substring(0, 40);
			}
		}
		seoText = this.cleanSEOText(seoText);
		return this.getQuestionLink(questionId) + "/" + seoText;
	},
	getQuestionCommentLinkWithSEO:function(questionId, title, body) {
		return this.getQuestionLinkWithSEO(questionId, title, body) + "#comments";
	},
	getQuestionTopicLink:function(topicName){
		topicName = topicName||"";
		var topicLink = this.C.baseUrl + this.C.baseQuestionLink + topicName.replace(/&/g," and ").replace(/\s+/g,"-");
		if(topicName !== "Pro-to-Pro") {
			topicLink = topicLink.toLowerCase();
		}
		return topicLink;
	},
	getUserLink:function(userId) {
		return this.C.baseUrl + this.C.baseUserLink + userId;
	},
	getUserImageUrl:function (userId, thumbnail, refresh) {
		var user = HZ.data.Users.get(userId),
			timestamp, imageId;
		if (user) {
			if (imageId = user.iid) {
				var image = HZ.data.Images.get(imageId);
				if (image) {
					timestamp = refresh?Math.random(100000) : (image.ts || "0000");
					return this.C.baseStaticImageUrl + imageId + "_" + thumbnail + "-" + timestamp + "/" + user.n + ".jpg";
				} else {
					this.log ("couldn't find image: " + imageId);
				}
			} else {
				return this.getPicUrl("user_"+thumbnail+".gif");
			}
		} else {
			this.log ("Missing user for user id " + userId + ". Make sure it's in HZ.data.Users!");
			return this.getPicUrl("user_"+thumbnail+".gif");
		}
	},
	getProfessionalLink:function(proName) {
		return this.C.baseUrl + this.C.baseProLink + proName;
	},
	getEditProfileLink:function(userId) {
		var link = this.C.baseUrl + this.C.baseEditProfileLink;
		if(userId) {
			link += "userName=" + userId;
		}
		return link;
	},
	getViewEndorsementLink:function(endorsementId) {
		return this.C.baseUrl + this.C.baseViewEndorsementUrl + endorsementId;
	},
	getUserPhotosLink: function (userId) {
		return this.C.baseUrl + this.C.baseBrowseLink + 'users/' + userId;
	},
	getUserGalleriesLink: function (userId) {
		return this.C.baseUrl + this.C.baseGalleryLink + 'users/' + userId;
	},
	getOrganizeLink: function (subjectType, subjectId, ownerUserName) {
		var link = this.C.baseOrganizeUrl;
		link += '/type='+subjectType + '/id=' + subjectId + '/action=edit';
		if (ownerUserName && ownerUserName != null && ownerUserName != '') {
			link += '/owner=' + ownerUserName;
		}
		return link;
	},
	getCssUrl:function(cssFileName) {
		if(!HZ.utils.Html.strEndsWith(cssFileName,'.css')) {
			cssFileName = cssFileName+'.css';
		}
		return this.C.baseUrl + this.C.baseCssPath + cssFileName + '?v=' + this.C.vNum;
	},
	cleanSEOText:function(seoText) {
		if (seoText == "" || seoText == null)
			return seoText;
		return seoText.replace(/[^a-zA-Z0-9_-]/g,"-");
	},
	spaceUrlRegex: new RegExp("(?:http://)?(?:www.)?"+HZ.utils.Config.shortBaseUrl+HZ.utils.Config.baseSpaceLink+"(\\d+)(?:/[A-Za-z0-9_-]+)?"),
    // adapted from: http://www.webtoolkit.info/javascript-base64.html
    keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // adapted from: http://www.webtoolkit.info/javascript-base64.html
    utf8_encode:function(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },
    // adapted from: http://www.webtoolkit.info/javascript-base64.html
    base64Encode:function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = this.utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) +
            this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4);

        }

        return output;        
    },
	getMobileSigninLink:function(redirectUrl) {
    	var params = "";
    	if (redirectUrl) {
        	params = "u=" + this.base64Encode(redirectUrl);
    	}
		return this.C.baseUrl + this.C.baseMobileSigninLink + params;
	},
	getMobileSignupLink:function(redirectUrl) {
    	var params = "";
    	if (redirectUrl) {
        	params = "u=" + this.base64Encode(redirectUrl);
    	}
		return this.C.baseUrl + this.C.baseMobileSignupLink + params;
	},
	getFbFeedRedirectLink:function(eventType) {
		var params="";
		if (eventType) {
			params = "type=" + eventType;
		}
		return this.C.baseUrl + this.C.baseFbFeedRedirectLink + params;
	}
}

HZ.utils.PageTitles = {

		getViewSpacePageTitle:function(title, style, category, metro, professionalName) {
			header = title;
			if (style)
				header += " - " + style;
			if (category)
				header += " - " + category;
			if (metro)
				header += " - " + metro;
			if (professionalName)
				header += " - " + professionalName;
			return header;
		}
}

HZ.utils.Html = new (function(){
	this.escapeHtmlEntities = function (text) {
		return text.replace(/[\u00A0-\u2666<>\&]/g, function(c) { return '&' + 
		  entityTable[c.charCodeAt(0)] || '#'+c.charCodeAt(0) + ';'; });
	};
	// all HTML4 entities as defined here: http://www.w3.org/TR/html4/sgml/entities.html
	// added: amp, lt, gt, quot and apos
	var entityTable = { 34 : 'quot', 38 : 'amp', 39 : 'apos', 60 : 'lt', 62 : 'gt', 160 : 'nbsp', 161 : 'iexcl', 162 : 'cent', 163 : 'pound', 164 : 'curren', 165 : 'yen', 166 : 'brvbar', 167 : 'sect', 168 : 'uml', 169 : 'copy', 170 : 'ordf', 171 : 'laquo', 172 : 'not', 173 : 'shy', 174 : 'reg', 175 : 'macr', 176 : 'deg', 177 : 'plusmn', 178 : 'sup2', 179 : 'sup3', 180 : 'acute', 181 : 'micro', 182 : 'para', 183 : 'middot', 184 : 'cedil', 185 : 'sup1', 186 : 'ordm', 187 : 'raquo', 188 : 'frac14', 189 : 'frac12', 190 : 'frac34', 191 : 'iquest', 192 : 'Agrave', 193 : 'Aacute', 194 : 'Acirc', 195 : 'Atilde', 196 : 'Auml', 197 : 'Aring', 198 : 'AElig', 199 : 'Ccedil', 200 : 'Egrave', 201 : 'Eacute', 202 : 'Ecirc', 203 : 'Euml', 204 : 'Igrave', 205 : 'Iacute', 206 : 'Icirc', 207 : 'Iuml', 208 : 'ETH', 209 : 'Ntilde', 210 : 'Ograve', 211 : 'Oacute', 212 : 'Ocirc', 213 : 'Otilde', 214 : 'Ouml', 215 : 'times', 216 : 'Oslash', 217 : 'Ugrave', 218 : 'Uacute', 219 : 'Ucirc', 220 : 'Uuml', 221 : 'Yacute', 222 : 'THORN', 223 : 'szlig', 224 : 'agrave', 225 : 'aacute', 226 : 'acirc', 227 : 'atilde', 228 : 'auml', 229 : 'aring', 230 : 'aelig', 231 : 'ccedil', 232 : 'egrave', 233 : 'eacute', 234 : 'ecirc', 235 : 'euml', 236 : 'igrave', 237 : 'iacute', 238 : 'icirc', 239 : 'iuml', 240 : 'eth', 241 : 'ntilde', 242 : 'ograve', 243 : 'oacute', 244 : 'ocirc', 245 : 'otilde', 246 : 'ouml', 247 : 'divide', 248 : 'oslash', 249 : 'ugrave', 250 : 'uacute', 251 : 'ucirc', 252 : 'uuml', 253 : 'yacute', 254 : 'thorn', 255 : 'yuml', 402 : 'fnof', 913 : 'Alpha', 914 : 'Beta', 915 : 'Gamma', 916 : 'Delta', 917 : 'Epsilon', 918 : 'Zeta', 919 : 'Eta', 920 : 'Theta', 921 : 'Iota', 922 : 'Kappa', 923 : 'Lambda', 924 : 'Mu', 925 : 'Nu', 926 : 'Xi', 927 : 'Omicron', 928 : 'Pi', 929 : 'Rho', 931 : 'Sigma', 932 : 'Tau', 933 : 'Upsilon', 934 : 'Phi', 935 : 'Chi', 936 : 'Psi', 937 : 'Omega', 945 : 'alpha', 946 : 'beta', 947 : 'gamma', 948 : 'delta', 949 : 'epsilon', 950 : 'zeta', 951 : 'eta', 952 : 'theta', 953 : 'iota', 954 : 'kappa', 955 : 'lambda', 956 : 'mu', 957 : 'nu', 958 : 'xi', 959 : 'omicron', 960 : 'pi', 961 : 'rho', 962 : 'sigmaf', 963 : 'sigma', 964 : 'tau', 965 : 'upsilon', 966 : 'phi', 967 : 'chi', 968 : 'psi', 969 : 'omega', 977 : 'thetasym', 978 : 'upsih', 982 : 'piv', 8226 : 'bull', 8230 : 'hellip', 8242 : 'prime', 8243 : 'Prime', 8254 : 'oline', 8260 : 'frasl', 8472 : 'weierp', 8465 : 'image', 8476 : 'real', 8482 : 'trade', 8501 : 'alefsym', 8592 : 'larr', 8593 : 'uarr', 8594 : 'rarr', 8595 : 'darr', 8596 : 'harr', 8629 : 'crarr', 8656 : 'lArr', 8657 : 'uArr', 8658 : 'rArr', 8659 : 'dArr', 8660 : 'hArr', 8704 : 'forall', 8706 : 'part', 8707 : 'exist', 8709 : 'empty', 8711 : 'nabla', 8712 : 'isin', 8713 : 'notin', 8715 : 'ni', 8719 : 'prod', 8721 : 'sum', 8722 : 'minus', 8727 : 'lowast', 8730 : 'radic', 8733 : 'prop', 8734 : 'infin', 8736 : 'ang', 8743 : 'and', 8744 : 'or', 8745 : 'cap', 8746 : 'cup', 8747 : 'int', 8756 : 'there4', 8764 : 'sim', 8773 : 'cong', 8776 : 'asymp', 8800 : 'ne', 8801 : 'equiv', 8804 : 'le', 8805 : 'ge', 8834 : 'sub', 8835 : 'sup', 8836 : 'nsub', 8838 : 'sube', 8839 : 'supe', 8853 : 'oplus', 8855 : 'otimes', 8869 : 'perp', 8901 : 'sdot', 8968 : 'lceil', 8969 : 'rceil', 8970 : 'lfloor', 8971 : 'rfloor', 9001 : 'lang', 9002 : 'rang', 9674 : 'loz', 9824 : 'spades', 9827 : 'clubs', 9829 : 'hearts', 9830 : 'diams', 34 : 'quot', 38 : 'amp', 60 : 'lt', 62 : 'gt', 338 : 'OElig', 339 : 'oelig', 352 : 'Scaron', 353 : 'scaron', 376 : 'Yuml', 710 : 'circ', 732 : 'tilde', 8194 : 'ensp', 8195 : 'emsp', 8201 : 'thinsp', 8204 : 'zwnj', 8205 : 'zwj', 8206 : 'lrm', 8207 : 'rlm', 8211 : 'ndash', 8212 : 'mdash', 8216 : 'lsquo', 8217 : 'rsquo', 8218 : 'sbquo', 8220 : 'ldquo', 8221 : 'rdquo', 8222 : 'bdquo', 8224 : 'dagger', 8225 : 'Dagger', 8240 : 'permil', 8249 : 'lsaquo', 8250 : 'rsaquo', 8364 : 'euro' }
  
	this.strEndsWith = function(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
	var entitySymbols = {'amp':'&','lt':'<','gt':'>'};
	this.unescapeHtmlEntities = function (text) {
		return text.replace(/\&([a-zA-Z])+;/g, function(c){
			var code = c.substring(1,c.length-1);
			code = code.toLowerCase();
			return entitySymbols[code] || c;
		});
	}
	this.template = function(tmpl,map) {
		var out = tmpl.replace(/%(\w+)%/g,function(c) {
			var val = map[c];
			if(val) {
				return val;
			}
			else if(val==''){
				return val;
			}
			else {
				return '';
			}
		});
		return out;
	};
	
	this.navigateTo = function (url)
	{
		window.location=url;
		return false;
	};
	
	this.postToUrl = function(actionUrl) {
		if(actionUrl && actionUrl!='')
		{
			var frm = $('<form method="post" action="'+actionUrl+'" style="display:hidden"></form>');
			var csrfInput = $('<input type="hidden" name="__ct">').val(HZ.data.CSRFToken);
			frm.append(csrfInput).appendTo('body');
			frm[0].submit();
		}
	};
})();


//simple inheritance connecting the prototype chain
/*
*	Usage:
*	var BaseClass = function () {};
*	
*	var MyClass = function () {
*		//calling the super class constructor
*		MyClass.superclass.constructor.call(this);
*	};
*	HZ.extend(MyClass, BaseClass);	//extends BaseClass
*	
*	var foo = new MyClass();	//instantiates MyClass
*  
 */
HZ.extend = function (childClass, parentClass) {
	var F = function(){};
	F.prototype = childClass.prototype;
	childClass.prototype = new F();
	childClass.prototype.constructor = childClass;
	childClass.superclass = parentClass.prototype;
}

window.hzmr.push("main:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End main.js  **************/
/************* Start errSt.js **************/
try {HZ.utils.Logger.getShortStackTraceLine = function(line) {
	return line.replace(/&v=\d*/, "").replace(/http.*js\//, "");
};
HZ.utils.Logger.sendJsExceptionStackTrace = function(e) {
	var st = printStackTrace({guess:false, e:e}),
		str = "", sep = "";
	for (var i=0; i<st.length; i++) {
		str += sep + this.getShortStackTraceLine(st[i]);
		sep = ";"
	}
	HZ.utils.Logger.stackTrace = str;
	throw (e);	// Let the exception handler send the exception
};
function printStackTrace(a){a=a||{guess:true};var b=a.e||null,c=!!a.guess;var d=new printStackTrace.implementation,e=d.run(b);return c?d.guessAnonymousFunctions(e):e}printStackTrace.implementation=function(){};printStackTrace.implementation.prototype={run:function(a,b){a=a||this.createException();b=b||this.mode(a);if(b==="other"){return this.other(arguments.callee)}else{return this[b](a)}},createException:function(){try{this.undef()}catch(a){return a}},mode:function(a){if(a["arguments"]&&a.stack){return"chrome"}else if(a.stack&&a.sourceURL){return"safari"}else if(a.stack&&a.number){return"ie"}else if(typeof a.message==="string"&&typeof window!=="undefined"&&window.opera){if(!a.stacktrace){return"opera9"}if(a.message.indexOf("\n")>-1&&a.message.split("\n").length>a.stacktrace.split("\n").length){return"opera9"}if(!a.stack){return"opera10a"}if(a.stacktrace.indexOf("called from line")<0){return"opera10b"}return"opera11"}else if(a.stack){return"firefox"}return"other"},instrumentFunction:function(a,b,c){a=a||window;var d=a[b];a[b]=function(){c.call(this,printStackTrace().slice(4));return a[b]._instrumented.apply(this,arguments)};a[b]._instrumented=d},deinstrumentFunction:function(a,b){if(a[b].constructor===Function&&a[b]._instrumented&&a[b]._instrumented.constructor===Function){a[b]=a[b]._instrumented}},chrome:function(a){var b=(a.stack+"\n").replace(/^\S[^\(]+?[\n$]/gm,"").replace(/^\s+(at eval )?at\s+/gm,"").replace(/^([^\(]+?)([\n$])/gm,"{anonymous}()@$1$2").replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm,"{anonymous}()@$1").split("\n");b.pop();return b},safari:function(a){return a.stack.replace(/\[native code\]\n/m,"").replace(/^(?=\w+Error\:).*$\n/m,"").replace(/^@/gm,"{anonymous}()@").split("\n")},ie:function(a){var b=/^.*at (\w+) \(([^\)]+)\)$/gm;return a.stack.replace(/at Anonymous function /gm,"{anonymous}()@").replace(/^(?=\w+Error\:).*$\n/m,"").replace(b,"$1@$2").split("\n")},firefox:function(a){return a.stack.replace(/(?:\n@:0)?\s+$/m,"").replace(/^[\(@]/gm,"{anonymous}()@").split("\n")},opera11:function(a){var b="{anonymous}",c=/^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;var d=a.stacktrace.split("\n"),e=[];for(var f=0,g=d.length;f<g;f+=2){var h=c.exec(d[f]);if(h){var i=h[4]+":"+h[1]+":"+h[2];var j=h[3]||"global code";j=j.replace(/<anonymous function: (\S+)>/,"$1").replace(/<anonymous function>/,b);e.push(j+"@"+i+" -- "+d[f+1].replace(/^\s+/,""))}}return e},opera10b:function(a){var b=/^(.*)@(.+):(\d+)$/;var c=a.stacktrace.split("\n"),d=[];for(var e=0,f=c.length;e<f;e++){var g=b.exec(c[e]);if(g){var h=g[1]?g[1]+"()":"global code";d.push(h+"@"+g[2]+":"+g[3])}}return d},opera10a:function(a){var b="{anonymous}",c=/Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;var d=a.stacktrace.split("\n"),e=[];for(var f=0,g=d.length;f<g;f+=2){var h=c.exec(d[f]);if(h){var i=h[3]||b;e.push(i+"()@"+h[2]+":"+h[1]+" -- "+d[f+1].replace(/^\s+/,""))}}return e},opera9:function(a){var b="{anonymous}",c=/Line (\d+).*script (?:in )?(\S+)/i;var d=a.message.split("\n"),e=[];for(var f=2,g=d.length;f<g;f+=2){var h=c.exec(d[f]);if(h){e.push(b+"()@"+h[2]+":"+h[1]+" -- "+d[f+1].replace(/^\s+/,""))}}return e},other:function(a){var b="{anonymous}",c=/function\s*([\w\-$]+)?\s*\(/i,d=[],e,f,g=10;while(a&&a["arguments"]&&d.length<g){e=c.test(a.toString())?RegExp.$1||b:b;f=Array.prototype.slice.call(a["arguments"]||[]);d[d.length]=e+"("+this.stringifyArguments(f)+")";a=a.caller}return d},stringifyArguments:function(a){var b=[];var c=Array.prototype.slice;for(var d=0;d<a.length;++d){var e=a[d];if(e===undefined){b[d]="undefined"}else if(e===null){b[d]="null"}else if(e.constructor){if(e.constructor===Array){if(e.length<3){b[d]="["+this.stringifyArguments(e)+"]"}else{b[d]="["+this.stringifyArguments(c.call(e,0,1))+"..."+this.stringifyArguments(c.call(e,-1))+"]"}}else if(e.constructor===Object){b[d]="#object"}else if(e.constructor===Function){b[d]="#function"}else if(e.constructor===String){b[d]='"'+e+'"'}else if(e.constructor===Number){b[d]=e}}}return b.join(",")},sourceCache:{},ajax:function(a){var b=this.createXMLHTTPObject();if(b){try{b.open("GET",a,false);b.send(null);return b.responseText}catch(c){}}return""},createXMLHTTPObject:function(){var a,b=[function(){return new XMLHttpRequest},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml3.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")}];for(var c=0;c<b.length;c++){try{a=b[c]();this.createXMLHTTPObject=b[c];return a}catch(d){}}},isSameDomain:function(a){return typeof location!=="undefined"&&a.indexOf(location.hostname)!==-1},getSource:function(a){if(!(a in this.sourceCache)){this.sourceCache[a]=this.ajax(a).split("\n")}return this.sourceCache[a]},guessAnonymousFunctions:function(a){for(var b=0;b<a.length;++b){var c=/\{anonymous\}\(.*\)@(.*)/,d=/^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,e=a[b],f=c.exec(e);if(f){var g=d.exec(f[1]);if(g){var h=g[1],i=g[2],j=g[3]||0;if(h&&this.isSameDomain(h)&&i){var k=this.guessAnonymousFunction(h,i,j);a[b]=e.replace("{anonymous}",k)}}}}return a},guessAnonymousFunction:function(a,b,c){var d;try{d=this.findFunctionName(this.getSource(a),b)}catch(e){d="getSource failed with url: "+a+", exception: "+e.toString()}return d},findFunctionName:function(a,b){var c=/function\s+([^(]*?)\s*\(([^)]*)\)/;var d=/['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function\b/;var e=/['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(?:eval|new Function)\b/;var f="",g,h=Math.min(b,20),i,j;for(var k=0;k<h;++k){g=a[b-k-1];j=g.indexOf("//");if(j>=0){g=g.substr(0,j)}if(g){f=g+f;i=d.exec(f);if(i&&i[1]){return i[1]}i=c.exec(f);if(i&&i[1]){return i[1]}i=e.exec(f);if(i&&i[1]){return i[1]}}}return"(?)"}}


window.hzmr.push("errSt:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End errSt.js  **************/
/************* Start jqUtils.js **************/
try {// <script>
/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

HZ.ns('HZ.utils');
//deprecated, use yamdi
HZ.utils.ModalPopup = {
	isInit:false,
	tpl:"<div id='hzPopup'><a class='hzPopupClose' href='javascript:;'></a><div id='hzPopupContent'></div></div>",
	$container:null,
	$closeBtn:null,
	$content:null,
	onHide:null,
	layer:null,
	init:function() {
		var self=this;
		this.isInit = true;
		this.$container = $(this.tpl);
		this.$container.hide();
		$('body').append(this.$container);
		this.$closeBtn = $('a.hzPopupClose');
		this.$content = $('#hzPopupContent');
		this.$closeBtn.click(function(){
			self.hide();
		});
	},
	hide:function() {
		if(this.onHide!=null){
			this.onHide.call();			
		}
		UIHelper.hideModalDialog();
	},
	stashLayer: function() {
		this.$container.hide();
		$('body').append(this.$container);
	},
	show:function(content) {
		if(!this.isInit){
			this.init();
		}
		var old = this.$content.children()[0];
		if(old != content)
		{
			$('body').append(old);
			$(old).hide();
		}
		this.$content.append(content);
		this.$container.show();
		$(content).show();
		var layer = UIHelper.showModalDialog(true);
		this.stashLayer();
		$(layer).empty();
		$(layer).append(this.$container);
		this.$container.show();
		this.layer = layer;
		this.center();
	},
	center:function() {
		UIHelper.centerElement(this.layer);
	},
	//deprecated, use yamdi
	alert:function(title,message) {
		var self = this;
		var $alertDiv = $('#hzPopupAlert');
		if ($alertDiv.size()==0) {
			$alertDiv = $('<div id="hzPopupAlert"><h3></h3>'+
							'<div class="hzPopupAlertContent"></div>'+
							'<div class="dialogControls"></div>'+
						'</div>');
			$alertDiv.find('.dialogControls')
				.append(HZ.ui.InputButtonUtils.createPrimaryInputButton("OK", "", 
					function(){
						self.hide();
					}
				));
		}
		$alertDiv.find('h3').text(title);
		$alertDiv.find('.hzPopupAlertContent').html(message);
		self.show($alertDiv[0]);
	},
	//deprecated, use yamdi
	confirm : function(title,msg,cancelFunc,cancelText,okFunc,okText) {
		var self = this;
		var $alertDiv = $('#hzPopupConfirm');
		if ($alertDiv.size()==0) {
			$alertDiv = $('<div id="hzPopupConfirm"><h3></h3>'+
							'<div class="hzPopupConfirmContent"></div>'+
							'<div class="dialogControls"></div>'+
						'</div>');
			$alertDiv.find('.dialogControls')
				.append(HZ.ui.InputButtonUtils.createSecondaryInputButton(cancelText, "",null,null,null,"cancel"))
				.append(HZ.ui.InputButtonUtils.createPrimaryInputButton(okText, "",null,null,null,"confirm"));
		}
		$alertDiv.find('input.cancel').val(cancelText).unbind('click').one('click',cancelFunc);
		$alertDiv.find('input.confirm').val(okText).unbind('click').one('click',function(){
			okFunc.call();
			self.hide();
		});
		$alertDiv.find('h3').text(title);
		$alertDiv.find('.hzPopupConfirmContent').html(msg);
		
		self.show($alertDiv[0]);
	}
};

HZ.ns('HZ.actions');
HZ.actions.Favorites = new (function(){
	//private
	var defaults = {
		favoriteText: "Add to Bookmarks",
		unfavoriteText: "Remove from Bookmarks",
		favoriteButtonLabel: "Bookmark",
		unfavoriteButtonLabel: "Unbookmark",
		favoriteButtonIngLabel: "Bookmarked",
		favoriteIconClass: "buttonIconBookmark",
		favoriteIconIngClass: "buttonIconBookmarkGray",
		unfavoriteIconClass: "buttonIconUnfeature",
		ajaxUrl: "/follow"
	}
	var settings = defaults;
	
	//public
	this.init = function(opts) {
		if(opts){
			settings = $.extend({},defaults,opts);
		}
	};
	
	this.updateFavoriteBtn = function(srcElement, hover) {
		var $btn = $(srcElement);
		var btnId = $btn.attr("id");
		var $icon = $btn.find('#'+btnId+'_icon__');
		var $btnLabel = $btn.find('#'+btnId+'_label__');
		
		if(hover) {
			$icon.removeClass(settings.favoriteIconIngClass).addClass(settings.unfavoriteIconClass);
			$btnLabel.css({"padding-left": "1px"});
			$btnLabel.text(settings.unfavoriteButtonLabel);
		} else {
			$icon.removeClass(settings.unfavoriteIconClass).addClass(settings.favoriteIconIngClass);
			$btnLabel.css({"padding-left": "2px"});
			$btnLabel.text(settings.favoriteButtonIngLabel);
		}
	};
	
	var onMouseOverFun = function() {
		HZ.actions.Favorites.updateFavoriteBtn(this, true);
	};

	var onMouseOutFun = function() {
		HZ.actions.Favorites.updateFavoriteBtn(this, false);
	};
	
	this.updateFavorites = function(srcElement) {
		var self = this;
		var $btn = $(srcElement);
		var btnId = $btn.attr('id');
		var op = $btn.attr('fop'),
			objectType = $btn.attr('fty'),
			objectId = $btn.attr('fid');
			
		var url = settings.ajaxUrl+'/op='+op+'/t='+objectType+'/i='+objectId;
		$.ajax({
			url:url,
			cache:false,
			type:'GET',
			success: function(data) {
				var dataObj = $.parseJSON(data);
				if(dataObj && dataObj.success=='true') {
					var $icon = $btn.find('#'+btnId+'_icon__');
					var $btnLabel = $btn.find('#'+btnId+'_label__');
					var $btnActionCount = $btn.find(".whitebuttonRight");
					
					var pressed = (op=='f');
					if(pressed){
						$btnLabel.text(settings.favoriteButtonIngLabel);
						$btnLabel.css({"padding-left": "2px"});
						$btn.attr('title',settings.unfavoriteText);
						$btn.attr('fop','u');
						if($btnActionCount.length > 0) {
							$btnActionCount[0].innerHTML = dataObj.followersCount ? dataObj.followersCount : (parseInt($btnActionCount[0].innerHTML, 10)+1);
						} else {
							$btnActionCount = $('<div class="whitebuttonRight">1</div>');
							$btn.append($btnActionCount);
						}
						$btn.bind("mouseover", onMouseOverFun).bind("mouseout", onMouseOutFun);
						$icon.removeClass(settings.favoriteIconClass).addClass(settings.favoriteIconIngClass);
						HZ.ui.yamdi.Common.alert('Add to Bookmarks',
								'Successfully added to your bookmarks.  You can now access your bookmarks from your profile page.');
					}
					else {
						$btnLabel.text(settings.favoriteButtonLabel);
						$btn.attr('title',settings.favoriteText);
						$btn.attr('fop','f');
						if($btnActionCount.length > 0) {
							var newCount = dataObj.followersCount ? dataObj.followersCount : (parseInt($btnActionCount[0].innerHTML, 10)-1);
							if(newCount < 1) {
								$btnActionCount.remove();
							} else {
								$btnActionCount[0].innerHTML = newCount;
							}
						}
						$btn.removeAttr("onmouseover").removeAttr("onmouseout").unbind("mouseover").unbind("mouseout");
						$icon.removeClass(settings.unfavoriteIconClass).removeClass(settings.favoriteIconIngClass).addClass(settings.favoriteIconClass);
						HZ.ui.yamdi.Common.alert('Removed from Bookmarks','Successfully removed page from bookmarks.');
					}
				}
				else {
					HZ.ui.yamdi.Common.alert('Add to Bookmarks failed', 'Error: '+dataObj.error);
				}
			}
		});
	}
})();

/*
 * jQuery autoResize (textarea auto-resizer)
 * @copyright James Padolsey http://james.padolsey.com
 * @version 1.04
 */
(function($){

	var uid = 'ar' + +new Date,

		defaults = autoResize.defaults = {
			onResize: function(){},
			onBeforeResize: function(){return 123},
			onAfterResize: function(){return 555},
			animate: {
				duration: 200,
				complete: function(){}
			},
			extraSpace: 50,
			minHeight: 'original',
			maxHeight: 500,
			minWidth: 'original',
			maxWidth: 500
		};

	autoResize.cloneCSSProperties = [
		'lineHeight', 'textDecoration', 'letterSpacing',
		'fontSize', 'fontFamily', 'fontStyle', 'fontWeight',
		'textTransform', 'textAlign', 'direction', 'wordSpacing', 'fontSizeAdjust',
		'paddingTop', 'paddingLeft', 'paddingBottom', 'paddingRight', 'width', 
		'marginTop', 'marginLeft', 'marginBottom', 'marginRight'
	];

	autoResize.cloneCSSValues = {
		position: 'absolute',
		top: -9999,
		left: -9999,
		opacity: 0,
		overflow: 'hidden'
	};

	autoResize.resizableFilterSelector = [
		'textarea:not(textarea.' + uid + ')',
		'input:not(input[type])',
		'input[type=text]',
		'input[type=password]',
		'input[type=email]',
		'input[type=url]'
	].join(',');

	autoResize.AutoResizer = AutoResizer;

	$.fn.autoResize = autoResize;

	function autoResize(config) {
		this.filter(autoResize.resizableFilterSelector).each(function(){
			new AutoResizer( $(this), config );
		});
		return this;
	}

	function AutoResizer(el, config) {

		if (el.data('AutoResizer')) {
			el.data('AutoResizer').destroy();
		}

		config = this.config = $.extend({}, autoResize.defaults, config);
		this.el = el;

		this.nodeName = el[0].nodeName.toLowerCase();

		this.originalHeight = el.height();
		this.previousScrollTop = null;

		this.value = el.val();

		if (config.maxWidth === 'original') config.maxWidth = el.width();
		if (config.minWidth === 'original') config.minWidth = el.width();
		if (config.maxHeight === 'original') config.maxHeight = el.height();
		if (config.minHeight === 'original') config.minHeight = el.height();

		if (this.nodeName === 'textarea') {
			el.css({
				resize: 'none',
				overflowY: 'hidden'
			});
		}

		el.data('AutoResizer', this);

		// Make sure onAfterResize is called upon animation completion
		config.animate.complete = (function(f){
			return function() {
				config.onAfterResize.call(el);
				return f.apply(this, arguments);
			};
		}(config.animate.complete));

		this.bind();

	}

	AutoResizer.prototype = {

		bind: function() {
			var self = this;
			var check = $.proxy(function(){
				this.check();
				return true;
			}, this);

			this.unbind();

			this.el
				.bind('keyup.autoResize', check)
				//.bind('keydown.autoResize', check)
				.bind('change.autoResize', check)
				.bind('paste.autoResize', function() {
					setTimeout(function() { check(); }, 0);
				})
				.bind('refreshSize.autoResize', function() {
					self.prevValue = "";
					self.previousScrollTop = -9999;
					check();
				});

			if (!this.el.is(':hidden')) {
				this.check(null, true);
			}

		},

		unbind: function() {
			this.el.unbind('.autoResize');
		},

		createClone: function() {

			var el = this.el,
				clone = this.nodeName === 'textarea' ? el.clone() : $('<span/>');

			this.clone = clone;

			$.each(autoResize.cloneCSSProperties, function(i, p){
				clone[0].style[p] = el.css(p);
			});

			clone
				.removeAttr('name')
				.removeAttr('id')
				.addClass(uid)
				.attr('tabIndex', -1)
				.css(autoResize.cloneCSSValues);

			if (this.nodeName === 'textarea') {
				clone.height('auto');
			} else {
				clone.width('auto').css({
					whiteSpace: 'nowrap'
				});
			}

		},

		check: function(e, immediate) {

			if (!this.clone) {
		this.createClone();
		this.injectClone();
			}

			var config = this.config,
				clone = this.clone,
				el = this.el,
				value = el.val();

			// Do nothing if value hasn't changed
			if (value === this.prevValue) { return true; }
			this.prevValue = value;

			if (this.nodeName === 'input') {

				clone.text(value);

				// Calculate new width + whether to change
				var cloneWidth = clone.width(),
					newWidth = (cloneWidth + config.extraSpace) >= config.minWidth ?
						cloneWidth + config.extraSpace : config.minWidth,
					currentWidth = el.width();

				newWidth = Math.min(newWidth, config.maxWidth);

				if (
					(newWidth < currentWidth && newWidth >= config.minWidth) ||
					(newWidth >= config.minWidth && newWidth <= config.maxWidth)
				) {

					config.onBeforeResize.call(el);
					config.onResize.call(el);

					el.scrollLeft(0);

					if (config.animate && !immediate) {
						el.stop(1,1).animate({
							width: newWidth
						}, config.animate);
					} else {
						el.width(newWidth);
						config.onAfterResize.call(el);
					}

				}

				return;

			}

			// TEXTAREA

			clone.width(el.width()).height(0).val(value).scrollTop(10000);

			var scrollTop = clone[0].scrollTop;

			// Don't do anything if scrollTop hasen't changed:
			if (this.previousScrollTop === scrollTop) {
				return;
			}

			this.previousScrollTop = scrollTop;

			if (scrollTop + config.extraSpace >= config.maxHeight) {
				el.css('overflowY', '');
				scrollTop = config.maxHeight;
				immediate = true;
			} else if (scrollTop <= config.minHeight) {
				scrollTop = config.minHeight;
			} else {
				el.css('overflowY', 'hidden');
				scrollTop += config.extraSpace;
			}
			
			//also factor in the final rendered height of the clone
			scrollTop += clone.height();
			config.onBeforeResize.call(el);
			config.onResize.call(el);

			// Either animate or directly apply height:
			if (config.animate && !immediate) {
				el.stop(1,1).animate({
					height: scrollTop
				}, config.animate);
			} else {
				el.height(scrollTop);
				config.onAfterResize.call(el);
			}

		},

		destroy: function() {
			this.unbind();
			this.el.removeData('AutoResizer');
			this.clone.remove();
			delete this.el;
			delete this.clone;
		},

		injectClone: function() {
			(
				autoResize.cloneContainer ||
				(autoResize.cloneContainer = $('<arclones/>').appendTo('body'))
			).append(this.clone);
		}

	};

})(jQuery);

/*
 * 	Character Count Plugin - jQuery plugin
 * 	Dynamic character count for text areas and input fields
 *	written by Alen Grakalic	
 *	http://cssglobe.com/post/7161/jquery-plugin-simplest-twitterlike-dynamic-character-count-for-textareas
 *
 *	Copyright (c) 2009 Alen Grakalic (http://cssglobe.com)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
 
(function($) {

	$.fn.charCount = function(options){
	  
		// default configuration properties
		var defaults = {	
			allowed: 140,		
			warning: 25,
			css: 'counter',
			counterElement: 'span',
			cssWarning: 'warning',
			cssExceeded: 'exceeded',
			cssDone: 'done',
			counterText: ''
		}; 
			
		var options = $.extend({},defaults, options); 
		
		function calculate(obj){
			var count = $(obj).val().length;
			var available = options.allowed - count;
			if(available <= options.warning && available >= 0){
				$(obj).next().addClass(options.cssWarning).removeClass(options.cssDone);
			} else {
				$(obj).next().removeClass(options.cssWarning+' '+options.cssDone);
			}
			if(available < 0){
				$(obj).next().addClass(options.cssExceeded).removeClass(options.cssDone);
			} else {
				$(obj).next().removeClass(options.cssExceeded+' '+options.cssDone);
			}
			$(obj).next().html(options.counterText + available);
		};
				
		this.each(function() {  			
			$(this).after('<'+ options.counterElement +' class="' + options.css + '">'+ options.counterText +'</'+ options.counterElement +'>');
			calculate(this);
			$(this).keyup(function(){calculate(this)});
			$(this).change(function(){calculate(this)});
		});
	  
	};

})(jQuery);

// jQuery plugin: PutCursorAtEnd 1.0
// http://plugins.jquery.com/project/PutCursorAtEnd
// by teedyay
//
// Puts the cursor at the end of a textbox/ textarea

// codesnippet: 691e18b1-f4f9-41b4-8fe8-bc8ee51b48d4
(function($)
{
    jQuery.fn.putCursorAtEnd = function()
    {
    return this.each(function()
    {
        $(this).focus()

        // If this function exists...
        if (this.setSelectionRange)
        {
        // ... then use it
        // (Doesn't work in IE)

        // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
        var len = $(this).val().length * 2;
        this.setSelectionRange(len, len);
        }
        else
        {
        // ... otherwise replace the contents with itself
        // (Doesn't work in Google Chrome)
        $(this).val($(this).val());
        }

        // Scroll to the bottom, in case we're in a tall textarea
        // (Necessary for Firefox and Google Chrome)
        this.scrollTop = 999999;
    });
    };
})(jQuery);

/**
 *
 *	$('#annoyingDiv').parkable();
 *	page that uses this pluggin needs to define the .float and .parked in css
 *	example:
 *	#annoyingDiv.float {
 *		position: fixed;
 *		top: 25px;  //usually the height of the collapsed header
 *	}
 *	#annoyingDiv.parked {
 *		position:relative;
 *	}
 *	
 *	floatStarts - content starts 'floating' once user scroll past this point.
 *			if not specified, it just start floating once the window scrolls past the top of the content.
 *	parkedTop - use if you have some vertical adjustments for the parked class.
 *	$('#annoyingDiv').parkable({floatStarts:50});
 */
(function($)
{
	var defaults = {
		'floatStarts' : null,
		'parkedTop' : 0
	};
	$.fn.parkable = function(options)
	{
		return this.each(function(){
			var $this = $(this);
			var settings = $.extend(true,{},defaults,options);
			
			if (settings.floatStarts == null) {
				settings.floatStarts = $this.offset().top;
			}
			$this.addClass('parked');
			$(window).scroll(function(){
				var winscroll = UIHelper.getScrollXY();
				if(winscroll[1] > settings.floatStarts - settings.parkedTop){
					if($this.hasClass('parked'))
					{
						$this.removeClass('parked').addClass('float');
					}
				}
				else {
					if($this.hasClass('float'))
					{
						$this.removeClass('float').addClass('parked');
					}
					
				}
			});
			
			
		});
	}
})(jQuery);

//peakable pluggin: turns any div into expand/collapsable
//usage:
//$('.details').peekable();
//attaches a "more/less" link for each matched element only when the content overflows the containing div.
//
//usage setContent:
//$('#dummy').peekable('setContent',contentHTML);
//allows reuse of a peekable.  sets the content, and re-initialize peekable
//
//$('#dummy').peekable('hide');
//hides the content and the peekable links
//
//$('#dummy').peekable('show');
//shows the content and the peekable links
//
//$('#dummy').peekable('destroy');
//remove peakable properties of element.

(function($){
    var defaults = {
        moreHtml: '<a class="hzPeekLink" href="javascript:;">more&nbsp;<span class="downChevron">&nbsp;&nbsp;</span></a>',
        lessHtml: '<a class="hzPeekLink" href="javascript:;"><span class="upChevron">&nbsp;&nbsp;</span>&nbsp;less</a>'
    };
    var methods = {
        init: function(options) {
            var settings = $.extend({},defaults,options);
            return this.each(function(){
                var $ele = $(this);
                var data = $ele.data('peekable')||{};
                //save settings
                data.settings = settings;
                var collapsedHeight = $ele.height();
                var scrollHeight = this.scrollHeight;
                var expandedHeight = scrollHeight - $ele.css('paddingTop').replace('px','') - $ele.css('paddingBottom').replace('px','');
                var maxHeight = $ele.css('maxHeight'); //checks if element has maxHeight set.
                data.maxHeight = maxHeight;
                if(expandedHeight > collapsedHeight) {
                    //needs expand/collapse
                    //if it has maxHeight, remove it since we have collapsedHeight already.
                    if(maxHeight != 'none') {
                        $ele.css({'maxHeight':'none','height':collapsedHeight+'px'});
                    }
                    var $moreLink = $('<div class="hzPeek moreLink" />').html(settings.moreHtml);
                    $moreLink.click(function(){
                        if($ele.height() == collapsedHeight) {
                            //expand
                            $ele.css({'height':collapsedHeight});
                            $ele.stop(1,1).animate({height:expandedHeight},300);
                            this.innerHTML = settings.lessHtml;
                            $(this).removeClass('moreLink').addClass('lessLink');
                        }
                        else {
                            //collapse
                            $ele.stop(1,1).animate({height:collapsedHeight},300);
                            this.innerHTML = settings.moreHtml;
                            $(this).removeClass('lessLink').addClass('moreLink');
                        }
                    });
                    $ele.after($moreLink);
                }
                //saving data
                $ele.data('peekable',data);
            });
        },
		refresh: function() {
			//collapse the container, reset maxHeight if it was originally there
			this.each(function(){
				var $ele = $(this);
				var data = $ele.data('peekable');
				//restore original height/maxheight
				if(data && data.maxHeight && data.maxHeight != 'none')
				{
					$ele.css({height:'auto',maxHeight:data.maxHeight});
				}
				//remove more/less link
				$ele.next('.hzPeek').remove();
            });
			return methods.init.apply(this);
		},
        setContent: function(content) {
            this.each(function(){
				var $ele = $(this);
				$ele.html(content);
            });
			return methods.refresh.apply(this);
        },
		hide: function () {
			this.hide();
			this.find('+ .hzPeek').hide();
			return this;
		},
		show: function () {
			this.show();
			this.find('+ .hzPeek').show();
			return this;
		},
		destroy: function () {
			return this.each(function(){
                var $ele = $(this),
					$moreLink = $ele.next(".hzPeek"),
					data = $ele.data('peekable')||{};
				if ($moreLink) {
					$ele.css("height","");
					if (data.maxHeight) {
						$ele.css("maxHeight",data.maxHeight);
					}
					$moreLink.remove();
				}
				$ele.removeData('peekable');
            });			
		}
    };
    $.fn.peekable = function(method) {
        if( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.peekable' );
        }
    };
})(jQuery);



//pagination pluggin: separate long list into pages
//usage:
//$('ul.list').pagination();
(function($){
    var defaults = {
		itemsPerPage: 10,
		maxPage: 10,
		prev: "Prev",
		next: "Next"
//		css:{".navLinks a":{"color":"#3D8901", "text-decoration":"none", "font-size":"12px"}}
    };
    var disabledLinkCss = {
		color: "grey",
		cursor: "default",
		"text-decoration": "none"
    };
    var methods = {
        init: function(options) {
			var $list = $(this);
            var settings = $.extend({},defaults,options);
			var data = $list.data('pagination')||{};
			//save settings
			data.settings = settings;
			if ($list.length>settings.itemsPerPage) {
				var page=0;
				var $pageLinks = $("<span class='navLinks'></span>");
				var $container = $list.parent();
				var $link;
				if ($list.is("li")){
					$container = $container.parent();
					var $listParent = $list.parent().empty().clone();
				}
				$container.empty();
				for (page=0;page<$list.length/settings.itemsPerPage && page<settings.maxPage;page++){
					var $pageItem = $("<div class='page"+page+"' style='display:none;height:inherit;'></div>");
					var $pageContent = $list.slice(page*settings.itemsPerPage,(page+1)*settings.itemsPerPage);
					if (settings.itemsType==="li"){
						var $newList = $listParent.clone();
						$newList.append($pageContent);
						$pageItem.append($newList);
					} else{
						$pageItem.append($pageContent);
					}
					$container.append($pageItem);
				}
				$container.find(".page0").show();
				$pageLinks.append("<a class='prevLink' href='#'>&laquo;&nbsp;"+settings.prev+"</a>&nbsp;");
				$pageLinks.append("<a class='nextLink' href='#'>"+settings.next+"&nbsp;&raquo;</a>");
				$container.append($pageLinks);
				if (settings.css)
				{
					$.each(settings.css,function(key,value){
						$(key).css(value);
					});
				}
				$list.data('color',$("a.nextLink").css("color"));
				$list.data('cursor',$("a.nextLink").css("cursor"));
				$list.data('text-decoration',$("a.nextLink").css("text-decoration"));
				$("a.prevLink").addClass("disabled").css(disabledLinkCss);
				$pageLinks.find("a:not(disabled)").click(function jumpToPage(event){
					$link = $(this);
					var $currentPage = $container.find("[class^=page]:visible");
					if ($link.hasClass("prevLink")){
						var $prevPage = $currentPage.prev("[class^=page]");
						if ($prevPage.length>0){
							$currentPage.hide();
							$currentPage.prev("[class^=page]").show();
							$pageLinks.find("a.disabled").removeClass("disabled").
								css("color",$list.data('color')).
								css("cursor",$list.data('cursor')).
								css("text-decoration",$list.data('text-decoration'));
							if ($prevPage.prev("[class^=page]").length==0){
								$link.addClass("disabled").css(disabledLinkCss);
							}
						}

					} else if ($link.hasClass('nextLink')){
						var $nextPage = $currentPage.next("[class^=page]");
						if ($nextPage.length>0){
							$currentPage.hide();
							$nextPage.show();
							$pageLinks.find("a.disabled").removeClass("disabled").
								css("color",$list.data('color')).
								css("cursor",$list.data('cursor')).
								css("text-decoration",$list.data('text-decoration'));
							if($nextPage.next("[class^=page]").length==0){
								$link.addClass("disabled").css(disabledLinkCss);
							}
						}
					}
					event.preventDefault();
				});
				$pageLinks.on("click","a.disabled",function disable(event){
					event.preventDefault();
				});
			}
			//saving data
			$list.data('pagination',data);
        }
    };
	
    $.fn.pagination = function(method) {
        if( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.pagination' );
        }
    };
})(jQuery);

//initPlaceHolders pluggin: cross-browser support for the HTML5 placeholder attribute on input fields
//http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
//usage: $('[placeholder]').initPlaceHolders()	//enable for all elements with the attribute placeholder
(function($) {
	//feature detection
	var hasHtml5Support = ('placeholder' in (document.createElement('input')));
	var beforeFormSave = function () {
				$(this).find('[placeholder]').each(function() {
					var input = $(this);
					if (input.val() == input.attr('placeholder')) {
					  input.val('');
					}
					input.removeClass('placeholder');
				  });
			};
	var defaults = {
			saveContainer: 'form',
			saveEvent: 'submit'
		};
	var methods = {
		init: function(options) {
			var settings = $.extend({},defaults,options);
			
			if(hasHtml5Support) {
				return this;
			}
			this.live('focus',function() {
			  var input = $(this);
			  if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			  }
			}).live('blur',function() {
			  var input = $(this);
			  if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			  }
			}).blur()
			.parents(settings.saveContainer).bind(settings.saveEvent, beforeFormSave);
			return this;
		},
		getValue: function() {
			if(hasHtml5Support) {
				return this.val();
			}
			if(this.val()==this.attr('placeholder')) {
				return '';
			}
			return this.val();
		},
		refresh: function() {
			if(hasHtml5Support){
				return this;
			}
			return this.each(function(){
				$(this).trigger('blur');
			});
		}
	};
	$.fn.initPlaceHolders = function(method) {
		if( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.initPlaceHolders' );
		}
	}
})(jQuery);


/* Disable selection plugin for JQuery, lifted from: http://stackoverflow.com/questions/2700000/how-to-disable-text-selection-using-jquery/2700029#2700029 */
(function($){
$.fn.disableSelection = function() {
    return this.each(function() {           
        $(this).attr('unselectable', 'on')
               .css({
                   '-ms-user-select':'none',
                   '-moz-user-select':'none',
                   '-webkit-user-select':'none',
                   'user-select':'none'
               })
               .each(function() {
                   this.onselectstart = function() { return false; };
               });
    });
};
})(jQuery);




/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
* Licensed under the MIT License (LICENSE.txt).
*
* Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
* Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
* Thanks to: Seamus Leahy for adding deltaX and deltaY
*
* Version: 3.0.6
*
* Requires: 1.2.2+
*/
(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);
// equlizedHeights - make the passed-in elements have the same(tallest) height or the specified height;
// usage: $('.photos').equalizeHeights(); 
// usage: $('.photos').equalizeHeights('300px');
(function($)
{
	$.fn.equalizeHeights = function(fixHeight){
		var maxHeight = fixHeight || 
			Math.max.apply(null, this.map(function(){ return $(this).height(); }).get());
		return this.each(function(){
			$(this).height(maxHeight);
		});
	}
})(jQuery);

//
(function($){
var defaults = {
	images: [],
	width: 0,
	height: 0
};
var methods = {
	init: function(options){
		var settings = $.extend(defaults, options);
		return this.each(function(){
			var imgArr = [], pic = $(this);
			settings.images =  pic.attr('sids').split(",");
			settings.width = pic.width();
			settings.height = pic.height();
			settings.defaultUrl = pic.attr('src');

			for (var y=0; y< settings.images.length; y++){
				if (settings.images[y]) {
					var url = HZ.utils.Links.getSpaceImageUrl(settings.images[y], settings.width, settings.height, false);
					imgArr.push(url);
					var o =$("<img>").attr("src",url);
					$("body").append(o); o.remove(); 
				}
			}
			/*			
			$.each(imgArr, function(index, record) {
				var o =$("<img>").attr("src",record);
				$("body").append(o); o.remove(); 
			});
			*/
			pic.mousemove(function(e) {
				pic.attr("src",imgArr[Math.floor((e.pageX - pic.offset().left) / (pic.width()/imgArr.length))]);
			});
			pic.error(function(e){
				console.log("error");
				pic.attr("src", settings.defaultUrl);
			});
		});
	}	
};

$.fn.picsBox = function(method) {
	if( methods[method] ) {
        	return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
        	return methods.init.apply( this, arguments );
        } else {
        	$.error( 'Method ' +  method + ' does not exist on jQuery.myPlugin' );
        }
};
})(jQuery);

/*
 * tipBubble pluggin
 * usage: 
 * $('#pointAtMe').tipBubble({
    content: 'hi there<br/>how are you doing?<br/>just being polite :)',
    point: 'north',
    onHide: function() {
        $(this).append('<br/>enough said');
    }
});鈥�
				
 * bubble of the target gets reused.
 *	$('#pointAtMe').tipBubble({content:'hello world'});
 *	$('#pointAtMe').tipBubble({content:'hello again', point:'south'});  //this doesn't create another bubble div
 *	or can use the show() method:
 *	$('#pointAtMe').tipBubble('show',{content:hello again', point: 'south'});
 *	
 * bubble over 2 or more different targets can be reused by specifying the id option
 *	$('#pointAtMe').tipBubble({content:'hello world', id:'formFieldsTip'});
 *	$('#pointAtMe2').tipBubble({content:'hey you', id:'formFieldsTip'}); //this doesn't create another bubble div
 *	
 * options:
 *		id: id of bubble.  if not provided, always create a new one.  
 *			if provided, will create one on first time, reuse same one on subsequent calls.  defaults to null.
 *		content: what goes inside the bubble,
 *		borderColor: if not specified, no border will be applied to the bubble
 *					if specified, 1px solid border will be applied to the bubble.
        point: which direction tip points toward: 'north', 'north right', 'south', 'south right', 'east', 'west'.  
				defaults to west.
        width: width in pixel of the bubble.  defaults at 200,
        offsetX: how many pixels left from where the bubble be rendered
        offsetY: how many pixels down from where the bubble be rendered
        attachTo: selector of the element the bubble will be appened to.  
					if not specified, always attached to the same parent as the target.
					if "body", will attached below body and "absolute" positioning will be used.  target position is relative to the document.
        showCloseBtn: show the 'x' icon on upper left, defaults to true.
        onHide: the callback function after the bubble is hidden.
 */
(function($) {
    var defaults = {
		id: null,
        content: '',
		borderColor: null,
		position: 'relative',
        point: 'west',
        width: 200,
        offsetX: 0,
        offsetY: 0,
        attachTo: null,
		showCloseBtn: true,
        onHide: null,
		fadeDuration: 400
    };
    var closeLinkTemplate = '<a href="javascript:;" class="close"></a>';
    var tipXHeight = 31,
        tipXWidth = 40;
    var tipYHeight = 10,
        tipYWidth = 15;
	var repositionBubble = function (target, bubble, settings) {
		var bubbleClass = settings.borderColor?"hzBubbleBorder":"hzBubble";
		var attachTo = settings.attachTo?$(settings.attachTo):null;
		var closeBubbleLink;

		bubble.hide()
				.empty()
				.attr('class',bubbleClass);
		
		var targetPosition = target.position();
		
		if (settings.attachTo == "body") {
				settings.position = 'absolute';
				targetPosition = target.offset();
		}
		
		if (settings.position == 'absolute') {
			bubble.css('position','absolute');
		}

		bubble.append(settings.content);

		var bubbleTop = 0, bubbleLeft = 0, bubbleRight = 0;
		if (attachTo) {
			attachTo.append(bubble);
		}
		else {
			target.after(bubble);
		}

		if (settings.showCloseBtn) {
			closeBubbleLink = $(closeLinkTemplate);
			bubble.append(closeBubbleLink);
			closeBubbleLink.click(function() {
				bubble.fadeOut(settings.fadeDuration);
				if (settings.onHide) {
					settings.onHide.apply(target[0]);
				}
			});
		}

		var marginTop = parseInt(target.css('margin-top')),
			marginLeft = parseInt(target.css('margin-left'));

		if (isNaN(marginTop)) {
			marginTop = 0;
		}

		if (isNaN(marginLeft)) {
			marginLeft = 0;
		}
		bubble.addClass(settings.point);
		if (settings.borderColor) {
			bubble.css({'border': '1px solid '+settings.borderColor});
			// Need deal with pointer's border too!
		}
		if (!settings.showCloseBtn) {
			bubble.css('padding','10px');
		}
		if (settings.position == 'absolute')
		{
			if (settings.point == 'west') {
				bubbleTop = targetPosition.top + marginTop + target.outerHeight() / 2 - tipXHeight + settings.offsetY;
				bubbleLeft = targetPosition.left + marginLeft + target.outerWidth() + settings.offsetX;
			}
			else if (settings.point == 'east') {
				bubbleTop = targetPosition.top + marginTop + target.outerHeight() / 2 - tipXHeight + settings.offsetY;
				bubbleLeft = targetPosition.left + marginLeft - bubble.outerWidth() - tipXWidth + settings.offsetX;
			}
			else if (settings.point == 'north' || settings.point == 'north left' || settings.point == 'north right') {
				bubbleTop = targetPosition.top + marginTop + target.outerHeight() + tipYHeight + settings.offsetY;
				bubbleLeft = targetPosition.left + marginLeft + settings.offsetX;
			}
			else if (settings.point == 'south' || settings.point == 'south left' || settings.point == 'south right') {
				bubbleTop = targetPosition.top + marginTop - bubble.outerHeight() - tipYHeight + settings.offsetY;
				bubbleLeft = targetPosition.left + marginLeft + settings.offsetX;
			}
			bubbleRight = $(document).width() - targetPosition.left - marginLeft - target.width();
		}
		if(settings.point.match(/right/)) {
			bubble.css({
				'width': settings.width,
				'top': bubbleTop + 'px',
				'left': '',
				'right': bubbleRight + 'px'
			});
		} else {
			bubble.css({
				'width': settings.width,
				'top': bubbleTop + 'px',
				'left': bubbleLeft + 'px',
				'right': ''
			});
		}
		bubble.fadeIn(settings.fadeDuration);
		target.data('bubble', {
			bubble: bubble,
			settings: settings
		});
	};
    var methods = {
        init: function(options) {
			var settings;
			
			if ($(this).data('bubble')) {
				methods.show.apply(this,[options]);
				return;
			}
			
            settings = $.extend({}, defaults, options);
            return this.each(function() {
                var target = $(this);
				var bubble;
				var bubbleData = target.data('bubble');
				if (bubbleData) {
					//if this is not the first time the bubble is loaded for this specific target
					bubble= bubbleData.bubble;
					//override settings in the bubbleData with passed in options
					var settings2 = $.extend(bubbleData.settings, options);
					repositionBubble(target, bubble, settings2);
				}
				else {
					//this is the first time for this target, create the bubble if id is not specified
					if (settings.id) {
						bubble = $('#'+settings.id);
						if (bubble.length == 0) {
							//if such bubble div with id doesn't exist, create a new one with the id
							bubble = $("<div class='"+(settings.borderColor?"hzBubbleBorder":"hzBubble")+"'></div>");
							bubble.attr('id',settings.id);
						}
					}
					else {
						bubble = $("<div class='"+(settings.borderColor?"hzBubbleBorder":"hzBubble")+"'></div>");
					}
					
					//position the bubble
					repositionBubble(target,bubble,settings);
				}
            });
        },
		hide: function (options) {
			var bubbleData = $(this).data('bubble');
			if (bubbleData) {
				//TODO: needs to make onhide callback
				var settings = bubbleData.settings;
				if (options) {
					settings = $.extend(bubbleData.settings,options);
				}
				bubbleData.bubble.fadeOut(settings.fadeDuration);
			}
		},
		show: function (options) {
			var target = $(this);
			var bubbleData = target.data('bubble');
			if (bubbleData) {
				var settings = bubbleData.settings;
				if (options) {
					settings = $.extend(bubbleData.settings,options);
				}
				var bubble = bubbleData.bubble;
				repositionBubble(target,bubble,settings);
			}
		}
    };
    $.fn.tipBubble = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tipBubble');
        }
    };
})(jQuery);


// Autosize 1.15.2 - jQuery plugin for textareas
// (c) 2013 Jack Moore - jacklmoore.com
// license: www.opensource.org/licenses/mit-license.php

(function ($) {
	var
	defaults = {
		className:'autosizejs',
		append:"",
		callback:false
	},
	hidden = 'hidden',
	borderBox = 'border-box',
	lineHeight = 'lineHeight',

	// border:0 is unnecessary, but avoids a bug in FireFox on OSX (http://www.jacklmoore.com/autosize#comment-851)
	copy = '<textarea tabindex="-1" style="position:absolute; top:-9999px; left:-9999px; right:auto; bottom:auto; border:0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden;"/>',

	// line-height is conditionally included because IE7/IE8/old Opera do not return the correct value.
	copyStyle = [
		'fontFamily',
		'fontSize',
		'fontWeight',
		'fontStyle',
		'letterSpacing',
		'textTransform',
		'wordSpacing',
		'textIndent'
	],
	oninput = 'oninput',
	onpropertychange = 'onpropertychange',

	// to keep track which textarea is being mirrored when adjust() is called.
	mirrored,

	// the mirror element, which is used to calculate what size the mirrored element should be.
	mirror = $(copy).data('autosize', true)[0];

	// test that line-height can be accurately copied.
	mirror.style.lineHeight = '99px';
	if ($(mirror).css(lineHeight) === '99px') {
		copyStyle.push(lineHeight);
	}
	mirror.style.lineHeight = '';

	$.fn.autosize = function (options) {
		options = $.extend({}, defaults, options || {});

		if (mirror.parentNode !== document.body) {
			$(document.body).append(mirror);
		}

		return this.each(function () {
			var
					ta = this,
					$ta = $(ta),
					minHeight = $ta.height(),
					maxHeight = parseInt($ta.css('maxHeight'), 10),
					active,
					resize,
					boxOffset = 0,
					value = ta.value,
					callback = $.isFunction(options.callback);

			if ($ta.data('autosize')) {
				// exit if autosize has already been applied, or if the textarea is the mirror element.
				return;
			}

			if ($ta.css('box-sizing') === borderBox || $ta.css('-moz-box-sizing') === borderBox || $ta.css('-webkit-box-sizing') === borderBox) {
				boxOffset = $ta.outerHeight() - $ta.height();
			}

			resize = $ta.css('resize') === 'none' ? 'none' : 'horizontal';

			$ta.css({
				overflow:hidden,
				overflowY:hidden,
				wordWrap:'break-word',
				resize:resize
			}).data('autosize', true);

			// Opera returns '-1px' when max-height is set to 'none'.
			maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

			function initMirror() {
				mirrored = ta;
				mirror.className = options.className;

				// mirror is a duplicate textarea located off-screen that
				// is automatically updated to contain the same text as the
				// original textarea.  mirror always has a height of 0.
				// This gives a cross-browser supported way getting the actual
				// height of the text, through the scrollTop property.
				$.each(copyStyle, function (i, val) {
					mirror.style[val] = $ta.css(val);
				});
			}

			// Using mainly bare JS in this function because it is going
			// to fire very often while typing, and needs to very efficient.
			function adjust() {
				var height, overflow, original;

				if (mirrored !== ta) {
					initMirror();
				}

				// the active flag keeps IE from tripping all over itself.  Otherwise
				// actions in the adjust function will cause IE to call adjust again.
				if (!active) {
					active = true;
					mirror.value = ta.value + options.append;
					mirror.style.overflowY = ta.style.overflowY;
					original = parseInt(ta.style.height, 10);

					// Update the width in case the original textarea width has changed
					mirror.style.width = $ta.width() + 'px';

					// Needed for IE7 to reliably return the correct scrollHeight
					mirror.scrollTop = 0;
					// Set a very high value for scrollTop to be sure the
					// mirror is scrolled all the way to the bottom.
					mirror.scrollTop = 9e4;
					height = mirror.scrollTop;
					// Note to self: replace the previous 3 lines with 'height = mirror.scrollHeight' when dropping IE7 support.

					if (height > maxHeight) {
						height = maxHeight;
						overflow = 'scroll';
					} else if (height < minHeight) {
						height = minHeight;
					}
					height += boxOffset;
					ta.style.overflowY = overflow || hidden;

					if (original !== height) {
						ta.style.height = height + 'px';
						if (callback) {
							options.callback.call(ta);
						}
						$ta.trigger("autosize");
					}

					// This small timeout gives IE a chance to draw it's scrollbar
					// before adjust can be run again (prevents an infinite loop).
					setTimeout(function () {
						active = false;
					}, 1);
				}
			}

			if (onpropertychange in ta) {
				if (oninput in ta) {
					// Detects IE9.  IE9 does not fire onpropertychange or oninput for deletions,
					// so binding to onkeyup to catch most of those occassions.  There is no way that I
					// know of to detect something like 'cut' in IE9.
					ta[oninput] = ta.onkeyup = adjust;
				} else {
					// IE7 / IE8
					ta[onpropertychange] = adjust;
				}
			} else {
				// Modern Browsers
				ta[oninput] = adjust;

				// The textarea overflow is now hidden, but Chrome doesn't reflow the text to account for the
				// new space made available by removing the scrollbars. This workaround causes Chrome to reflow the text.
				ta.value = '';
				ta.value = value;
			}

			$(window).resize(adjust);

			// Allow for manual triggering if needed.
			$ta.bind('autosize', adjust);

			// Call adjust in case the textarea already contains text.
			adjust();
		});
	};
}(jQuery));


window.hzmr.push("jqUtils:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End jqUtils.js  **************/
/************* Start core.js **************/
try {// <script>
	
HZ.ns("HZ.data");

HZ.data.GenericCollection = function() {
	var data = {};
	var length = 0;
	
	this.put = function(key, value) {
		if (!data.hasOwnProperty(key))
			length++;
		data[key] = value;
	};
	
	this.get = function(key) {
		if (data[key])
			return data[key];
		else
			return null;
	};

	this.addAll = function(data) {
		var i;
		for (i in data) {
			this.put (i, data[i]);
		}
	};

	this.length = function() {
		return length;
	};
	
	this.getCollection = function () {
		return data;
	};
};

HZ.data.Categories = {
	categoriesHash:null,
	categoriesNamesHash:null,
	parseCategoriesTree:function (node) {
		if (node) {
			if (node.categoryId) {
				this.categoriesHash[node.categoryId] = node;
				this.categoriesNamesHash[node.name] = node;
			}
			if (node.children)
				for (var i=0; i < node.children.length; i++) {
					this.parseCategoriesTree (node.children[i]);
					node.children[i].parent = node;
				}  
			else
				node.children = [];
		}
	},
	init:function(categoriesTree) {
		this.categoriesHash = {};
		this.categoriesNamesHash = {};
		for (var i=0; i<categoriesTree.length; i++)
			this.parseCategoriesTree (categoriesTree[i]);
	},
	getCategoryById:function(id) {
		if (this.categoriesHash == null)
			this.init();
		return this.categoriesHash[id];
	},
	getRootCategoryById:function(id) {
		var category = this.getCategoryById (id);
		while (category && category.categoryId>9)
			category = category.parent;
		return category;
	}
};

HZ.data.SessionUser = function(_userId, _userName, _loginName) {
	var userId = _userId,
		userName = _userName,
		loginName = _loginName;

		this.getUserId = function() {
			return userId;
		};
		this.getUserName = function() {
			return userName;
		};
		this.getLoginName = function () {
			return loginName;
		};
};


HZ.data.Spaces = new HZ.data.GenericCollection();
HZ.data.Images = new HZ.data.GenericCollection();
HZ.data.Users = new HZ.data.GenericCollection();
HZ.data.Galleries = new HZ.data.GenericCollection();
HZ.data.Projects = new HZ.data.GenericCollection();
HZ.data.Questions = new HZ.data.GenericCollection();
HZ.data.ImageTags = new HZ.data.GenericCollection();
HZ.data.Comments = new HZ.data.GenericCollection();
HZ.data.Styles = new HZ.data.GenericCollection();
HZ.data.MetroAreas = new HZ.data.GenericCollection();
HZ.data.Contexts = new HZ.data.GenericCollection();
HZ.data.ProductAds = new HZ.data.GenericCollection();
HZ.data.PPCAds = new HZ.data.GenericCollection();
HZ.data.PhotoAds = new HZ.data.GenericCollection();
HZ.data.BannerAds = new HZ.data.GenericCollection();
HZ.data.HouzzImpTracking = new HZ.data.GenericCollection();
HZ.data.HouzzClkTracking = new HZ.data.GenericCollection();
HZ.data.PaidProAds = new HZ.data.GenericCollection();
HZ.data.Recommendations = new HZ.data.GenericCollection();
HZ.data.ProductsInfo = new HZ.data.GenericCollection();
HZ.data.Variations = new HZ.data.GenericCollection();
HZ.data.Currencies = new HZ.data.GenericCollection();
HZ.data.ProfessionalTypes = new HZ.data.GenericCollection();
HZ.data.Availabilities = new HZ.data.GenericCollection();
HZ.data.CurrentSessionUser = null;
HZ.data.CSRFToken = null;
HZ.data.IID = Math.ceil(Math.random()*10000000000000000);


HZ.data.Categories.init([{"categoryId":"1","name":"spaces","children":[{"categoryId":"1022","name":"basement"},{"categoryId":"1007","name":"bathroom"},{"categoryId":"1008","name":"bedroom"},{"categoryId":"1021","name":"closet"},{"categoryId":"1006","name":"dining room"},{"categoryId":"1002","name":"entry"},{"categoryId":"1001","name":"exterior"},{"categoryId":"1004","name":"family room"},{"categoryId":"1024","name":"garage and shed"},{"categoryId":"1012","name":"hall"},{"categoryId":"1023","name":"home gym"},{"categoryId":"1010","name":"home office"},{"categoryId":"1009","name":"kids"},{"categoryId":"1005","name":"kitchen"},{"categoryId":"1014","name":"landscape"},{"categoryId":"1020","name":"laundry room"},{"categoryId":"1003","name":"living room"},{"categoryId":"1017","name":"media room"},{"categoryId":"1013","name":"patio"},{"categoryId":"1015","name":"pool"},{"categoryId":"1019","name":"porch"},{"categoryId":"1018","name":"powder room"},{"categoryId":"1011","name":"staircase"},{"categoryId":"1016","name":"wine cellar"}]},{"categoryId":"2","name":"products","children":[{"categoryId":"2004","name":"accessories and decor","children":[{"categoryId":"13019","name":"artwork"},{"categoryId":"13016","name":"books"},{"categoryId":"13001","name":"candles and candle holders"},{"categoryId":"13002","name":"clocks"},{"categoryId":"13022","name":"decals"},{"categoryId":"13003","name":"fireplace accessories"},{"categoryId":"13027","name":"fireplaces"},{"categoryId":"13005","name":"frames"},{"categoryId":"13006","name":"holiday decorations"},{"categoryId":"13020","name":"home electronics"},{"categoryId":"13018","name":"home fragrance"},{"categoryId":"13004","name":"indoor fountains"},{"categoryId":"13011","name":"indoor pots and planters"},{"categoryId":"13021","name":"magazine racks"},{"categoryId":"13007","name":"mirrors"},{"categoryId":"13026","name":"paints stains and glazes"},{"categoryId":"13009","name":"pet accessories"},{"categoryId":"13010","name":"pillows"},{"categoryId":"13024","name":"plants"},{"categoryId":"13012","name":"rugs"},{"categoryId":"13023","name":"screens and wall dividers"},{"categoryId":"13025","name":"stencils"},{"categoryId":"13013","name":"throws"},{"categoryId":"13014","name":"vases"},{"categoryId":"13015","name":"wallpaper"},{"categoryId":"13017","name":"waste baskets"}]},{"categoryId":"2003","name":"bath products","children":[{"categoryId":"12005","name":"bath and spa accessories"},{"categoryId":"12007","name":"bath mats"},{"categoryId":"12015","name":"bathroom countertops"},{"categoryId":"12008","name":"bathroom faucets"},{"categoryId":"12001","name":"bathroom mirrors"},{"categoryId":"12009","name":"bathroom sinks"},{"categoryId":"12017","name":"bathroom storage"},{"categoryId":"12014","name":"bathroom tile"},{"categoryId":"12013","name":"bathroom vanities and sink consoles"},{"categoryId":"12010","name":"bathtubs"},{"categoryId":"12016","name":"shower caddies"},{"categoryId":"12002","name":"shower curtains"},{"categoryId":"12011","name":"showers"},{"categoryId":"12006","name":"toilet accessories"},{"categoryId":"12012","name":"toilets"},{"categoryId":"12003","name":"towel bars and hooks"},{"categoryId":"12004","name":"towels"}]},{"categoryId":"2006","name":"bedroom products","children":[{"categoryId":"15002","name":"bedding","children":[{"categoryId":"15006","name":"bed pillows"},{"categoryId":"15007","name":"bedskirts"},{"categoryId":"15003","name":"duvet covers"},{"categoryId":"15004","name":"quilts"},{"categoryId":"15014","name":"shams"},{"categoryId":"15005","name":"sheet sets"}]},{"categoryId":"15009","name":"bedroom benches"},{"categoryId":"15008","name":"beds"},{"categoryId":"15012","name":"dressers chests and bedroom armoires"},{"categoryId":"15010","name":"headboards"},{"categoryId":"15001","name":"makeup mirrors"},{"categoryId":"15011","name":"nightstands and bedside tables"},{"categoryId":"15013","name":"sofa beds"}]},{"categoryId":"2017","name":"fabric","children":[{"categoryId":"26002","name":"outdoor fabric"},{"categoryId":"26001","name":"upholstery fabric"}]},{"categoryId":"2010","name":"floors","children":[{"categoryId":"19003","name":"carpet flooring"},{"categoryId":"19004","name":"floor tiles"},{"categoryId":"19002","name":"laminate flooring"},{"categoryId":"19005","name":"vinyl flooring"},{"categoryId":"19001","name":"wood flooring"}]},{"categoryId":"2005","name":"furniture","children":[{"categoryId":"14003","name":"armchairs"},{"categoryId":"14012","name":"bar carts"},{"categoryId":"14011","name":"bar tables"},{"categoryId":"14009","name":"benches"},{"categoryId":"14016","name":"buffets and sideboards"},{"categoryId":"14008","name":"chairs"},{"categoryId":"14006","name":"coffee tables"},{"categoryId":"14004","name":"day beds and chaises"},{"categoryId":"14015","name":"dining chair cushions"},{"categoryId":"14014","name":"dining chairs and benches"},{"categoryId":"14013","name":"dining tables"},{"categoryId":"14002","name":"love seats"},{"categoryId":"14005","name":"ottomans and cubes"},{"categoryId":"14018","name":"rocking chairs"},{"categoryId":"14001","name":"sectional sofas"},{"categoryId":"14007","name":"side tables and accent tables"},{"categoryId":"14010","name":"sofas"}]},{"categoryId":"2015","name":"hardware","children":[{"categoryId":"24005","name":"brackets"},{"categoryId":"24001","name":"handles"},{"categoryId":"24002","name":"knobs"},{"categoryId":"24003","name":"pulls"},{"categoryId":"24004","name":"switchplates"}]},{"categoryId":"2008","name":"home office products","children":[{"categoryId":"17007","name":"bulletin board"},{"categoryId":"17003","name":"cable management"},{"categoryId":"17004","name":"desk accessories"},{"categoryId":"17001","name":"desks"},{"categoryId":"17005","name":"filing cabinets and carts"},{"categoryId":"17002","name":"task chairs"}]},{"categoryId":"2018","name":"housekeeping","children":[{"categoryId":"27001","name":"cleaning supplies"},{"categoryId":"27005","name":"ladders and step stools"},{"categoryId":"27004","name":"laundry products","children":[{"categoryId":"18004","name":"clothesline"},{"categoryId":"18005","name":"dryer racks"},{"categoryId":"18006","name":"hampers"},{"categoryId":"18007","name":"ironing board covers"},{"categoryId":"18002","name":"ironing boards"},{"categoryId":"18003","name":"irons"},{"categoryId":"18001","name":"laundry room appliances"},{"categoryId":"18008","name":"utility tubs"}]},{"categoryId":"27002","name":"mops brooms and dustpans"},{"categoryId":"27003","name":"vacuum cleaners"}]},{"categoryId":"2007","name":"kids products","children":[{"categoryId":"16005","name":"baby bedding"},{"categoryId":"16015","name":"baby swings and bouncers"},{"categoryId":"16006","name":"baby toys"},{"categoryId":"16002","name":"changing tables"},{"categoryId":"16013","name":"children lighting"},{"categoryId":"16003","name":"crib accessories"},{"categoryId":"16001","name":"cribs"},{"categoryId":"16007","name":"highchairs"},{"categoryId":"16008","name":"kids bedding"},{"categoryId":"16004","name":"kids beds"},{"categoryId":"16011","name":"kids chairs"},{"categoryId":"16012","name":"kids decor"},{"categoryId":"16019","name":"kids dressers"},{"categoryId":"16017","name":"kids rugs"},{"categoryId":"16010","name":"kids tables"},{"categoryId":"16009","name":"kids toys"},{"categoryId":"16020","name":"mobiles"},{"categoryId":"16018","name":"nursery decor"},{"categoryId":"16014","name":"rocking chairs and gliders"},{"categoryId":"16016","name":"toy storage"}]},{"categoryId":"2001","name":"kitchen products","children":[{"categoryId":"10001","name":"aprons"},{"categoryId":"10002","name":"bar stools and counter stools"},{"categoryId":"10036","name":"cabinet and drawer organizers"},{"categoryId":"10004","name":"cookware and bakeware"},{"categoryId":"10003","name":"dish racks"},{"categoryId":"10005","name":"dishtowels"},{"categoryId":"10006","name":"food containers and storage"},{"categoryId":"10010","name":"kitchen cabinets"},{"categoryId":"10011","name":"kitchen countertops"},{"categoryId":"10007","name":"kitchen faucets"},{"categoryId":"10032","name":"kitchen islands and kitchen carts"},{"categoryId":"10008","name":"kitchen sinks"},{"categoryId":"10034","name":"kitchen tile"},{"categoryId":"10033","name":"kitchen tools"},{"categoryId":"10030","name":"kitchen trash cans"},{"categoryId":"10013","name":"knives and chopping boards"},{"categoryId":"10014","name":"major kitchen appliances","children":[{"categoryId":"10020","name":"cooktops"},{"categoryId":"10018","name":"dishwashers"},{"categoryId":"10035","name":"gas ranges and electric ranges"},{"categoryId":"10016","name":"kitchen hoods and vents"},{"categoryId":"10017","name":"microwave"},{"categoryId":"10019","name":"ovens"},{"categoryId":"10015","name":"refrigerators and freezers"}]},{"categoryId":"10037","name":"oven mitts and pot holders"},{"categoryId":"10022","name":"pantry"},{"categoryId":"10024","name":"pot racks"},{"categoryId":"10025","name":"small kitchen appliances","children":[{"categoryId":"10027","name":"blenders and food processors"},{"categoryId":"10029","name":"coffee makers and tea kettles"},{"categoryId":"10026","name":"toasters"}]},{"categoryId":"10031","name":"wine racks"}]},{"categoryId":"2011","name":"lighting","children":[{"categoryId":"20001","name":"bathroom lighting and vanity lighting"},{"categoryId":"20013","name":"ceiling fans"},{"categoryId":"20002","name":"ceiling lighting"},{"categoryId":"20003","name":"chandeliers"},{"categoryId":"20004","name":"floor lamps"},{"categoryId":"20008","name":"kitchen lighting and cabinet lighting"},{"categoryId":"20005","name":"lamp shades"},{"categoryId":"20006","name":"light bulbs"},{"categoryId":"20007","name":"pendant lighting"},{"categoryId":"20009","name":"recessed lighting"},{"categoryId":"20010","name":"table lamps"},{"categoryId":"20011","name":"track lighting"},{"categoryId":"20012","name":"wall sconces"}]},{"categoryId":"2014","name":"outdoor products","children":[{"categoryId":"23012","name":"fencing"},{"categoryId":"23007","name":"firepits"},{"categoryId":"23016","name":"gardening tools"},{"categoryId":"23008","name":"gazebos"},{"categoryId":"23011","name":"greenhouses"},{"categoryId":"23001","name":"grills"},{"categoryId":"23032","name":"hammocks"},{"categoryId":"23013","name":"irrigation equipment"},{"categoryId":"23018","name":"outdoor decor","children":[{"categoryId":"23029","name":"bird baths"},{"categoryId":"23028","name":"bird feeders"},{"categoryId":"23030","name":"birdhouses"},{"categoryId":"23027","name":"doormats"},{"categoryId":"23031","name":"garden sculptures"},{"categoryId":"23021","name":"holiday outdoor decorations"},{"categoryId":"23019","name":"house numbers"},{"categoryId":"23020","name":"mailboxes"},{"categoryId":"23022","name":"outdoor fountains"},{"categoryId":"23023","name":"outdoor planters"}]},{"categoryId":"23017","name":"outdoor lighting"},{"categoryId":"23003","name":"outdoor pillows"},{"categoryId":"23005","name":"outdoor playsets"},{"categoryId":"23025","name":"outdoor rugs"},{"categoryId":"23006","name":"outdoor swingsets"},{"categoryId":"23004","name":"outdoor umbrellas"},{"categoryId":"23002","name":"patio furniture and outdoor furniture","children":[{"categoryId":"23035","name":"outdoor chairs"},{"categoryId":"23037","name":"outdoor chaise lounges"},{"categoryId":"23034","name":"outdoor sofas"},{"categoryId":"23036","name":"outdoor stools and benches"},{"categoryId":"23033","name":"outdoor tables"}]},{"categoryId":"23010","name":"prefab studios"},{"categoryId":"23014","name":"retainer walls"},{"categoryId":"23009","name":"sheds"},{"categoryId":"23015","name":"swimming pools and spas"}]},{"categoryId":"2013","name":"storage and organization","children":[{"categoryId":"22012","name":"baskets"},{"categoryId":"22001","name":"bookcases cabinets and computer armoires"},{"categoryId":"22004","name":"closet organizers"},{"categoryId":"22005","name":"clothes and shoes organizers"},{"categoryId":"22006","name":"clothes racks"},{"categoryId":"22002","name":"coat stands and umbrella stands"},{"categoryId":"22014","name":"hall trees"},{"categoryId":"22007","name":"hooks and hangers"},{"categoryId":"22008","name":"media storage"},{"categoryId":"22009","name":"medicine cabinets"},{"categoryId":"22010","name":"shoeracks"},{"categoryId":"22013","name":"storage boxes"},{"categoryId":"22011","name":"wall shelves"}]},{"categoryId":"2002","name":"tabletop","children":[{"categoryId":"11012","name":"barware"},{"categoryId":"11005","name":"dinnerware"},{"categoryId":"11006","name":"flatware"},{"categoryId":"11007","name":"glassware"},{"categoryId":"11009","name":"napkin rings"},{"categoryId":"11011","name":"serveware"},{"categoryId":"11008","name":"table linens"}]},{"categoryId":"2012","name":"window treatments","children":[{"categoryId":"21006","name":"cellular shades"},{"categoryId":"21008","name":"curtain poles"},{"categoryId":"21001","name":"curtains"},{"categoryId":"21004","name":"roller blinds"},{"categoryId":"21007","name":"roman blinds"},{"categoryId":"21005","name":"venetian blinds"},{"categoryId":"21003","name":"vertical blinds"},{"categoryId":"21002","name":"window blinds"}]},{"categoryId":"2016","name":"windows and doors","children":[{"categoryId":"25002","name":"front doors"},{"categoryId":"25001","name":"garage doors"},{"categoryId":"25003","name":"interior doors"},{"categoryId":"25004","name":"screen doors"},{"categoryId":"25005","name":"skylights"},{"categoryId":"25006","name":"windows"}]}]},{"categoryId":"3","name":"drawings","children":[{"categoryId":"3006","name":"details"},{"categoryId":"3004","name":"exterior elevation"},{"categoryId":"3001","name":"floor plan"},{"categoryId":"3003","name":"interior elevation"},{"categoryId":"3007","name":"rendering"},{"categoryId":"3005","name":"section"},{"categoryId":"3002","name":"site and landscape plan"}]},{"categoryId":"5","name":"before photos"},{"categoryId":"4","name":"other"}]);
HZ.data.Styles.addAll({"2":"asian","3":"contemporary","4":"eclectic","9":"mediterranean","5":"modern","7":"traditional","8":"tropical"});
HZ.data.MetroAreas.addAll({"104":"Adelaide","72":"Albuquerque","71":"Amsterdam","34":"Atlanta","96":"Auckland","28":"Austin","65":"Baltimore","43":"Birmingham","58":"Boise","37":"Boston","54":"Bridgeport","83":"Brisbane","102":"Bristol","66":"Burlington","60":"Calgary","84":"Cedar Rapids","52":"Charleston","44":"Charlotte","20":"Chicago","59":"Cincinnati","68":"Cleveland","98":"Columbus","45":"Dallas","35":"Dc Metro","42":"Denver","47":"Detroit","93":"Dublin","88":"Edmonton","103":"Glasgow","57":"Grand Rapids","22":"Hawaii","23":"Hong Kong","46":"Houston","91":"Huntington","56":"Indianapolis","78":"Jackson","97":"Jacksonville","50":"Kansas City","77":"Las Vegas","89":"Little Rock","21":"London","2":"Los Angeles","55":"Louisville","81":"Manchester NH","100":"Manchester UK","70":"Melbourne","75":"Mexico City","26":"Miami","74":"Milwaukee","48":"Minneapolis","62":"Montreal","51":"Nashville","30":"New Orleans","1":"New York","79":"Newark","82":"Oklahoma City","86":"Omaha","87":"Orange County","95":"Orlando","94":"Ottawa","99":"Perth","39":"Philadelphia","29":"Phoenix","41":"Portland","90":"Portland Maine","101":"Portsmouth","80":"Providence","73":"Raleigh","49":"Richmond","67":"Sacramento","63":"Salt Lake City","38":"San Diego","12":"San Francisco","64":"San Luis Obispo","76":"Santa Barbara","25":"Seattle","69":"St Louis","61":"Sydney","53":"Tampa","24":"Tel Aviv","36":"Toronto","40":"Vancouver","85":"Wichita","92":"Wilmington","33":"Other Metro"});
HZ.data.Currencies.addAll({"1":"$","2":"EUR ","3":"CAD ","4":"GBP ","5":"AUD "});
HZ.data.ProfessionalTypes.addAll({"43":"Agents & Brokers","30":"Appliances","1":"Architects & Designers","20":"Artists and Artisans","26":"Bedding and Bath","25":"Building Supplies","50":"Cabinets & Cabinetry","52":"Carpenters","18":"Carpet and Flooring","15":"Closet & Home Storage Designers","51":"Decks, Patios & Outdoor Enclosures","11":"Design-build Firms","48":"Doors","53":"Driveways & Paving","39":"Electrical Contractors","34":"Env. Services and Restoration","54":"Fencing & Gates","19":"Fireplaces","21":"Furniture and Accessories","49":"Garage Doors","29":"Garden and Landscape Supplies","3":"General Contractors","44":"Home Builders","5":"Home Media Design & Installation","7":"Home Stagers","35":"HVAC Contractors","2":"Interior Designers & Decorators","55":"Ironwork","28":"Kids and Nursery","8":"Kitchen & Bath Designers","23":"Kitchen and Bath","46":"Kitchen & Bath Remodelers","6":"Landscape Architects & Designers","33":"Landscape Contractors","56":"Lawn & Sprinklers","13":"Lighting","9":"Media and Bloggers","57":"Outdoor Audio\/Visual","58":"Outdoor Play Systems","27":"Paint & Wall Coverings","10":"Photographers","38":"Plumbing Contractors","14":"Pools and Spas","40":"Roofing & Gutters","41":"Rubbish Removal","36":"Septic Tanks and Systems","47":"Siding & Exterior Contractors","37":"Solar Energy Contractors","32":"Specialty Contractors","59":"Sport Courts","60":"Staircases","45":"Stone, Pavers & Concrete","22":"Tile, Stone & Countertops","42":"Tree Services","61":"Upholstery","17":"Window Treatments","16":"Windows","62":"Wine Cellars"});
HZ.data.Availabilities.addAll({"0":"Unknown","1":"Available","2":"Not Available"});


window.hzmr.push("core:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End core.js  **************/
/************* Start ui.js **************/
try {// <script>

HZ.ns('HZ.ui');

HZ.ui.Utils = {
	getBoundRect:function (origRect, boundRect) {
		var w = origRect.w,
			h = origRect.h,
			maxWidth = boundRect.w,
			maxHeight = boundRect.h,
			r, dr, dw, dh;
			
		if (w == 0 || h == 0 || (w == maxWidth && h == maxHeight))
			return {w:w, h:h, x:0, y:0};

		r = w/h;
		dr = maxWidth / maxHeight;
		if (dr>r)
		{
			h = Math.min(h, maxHeight);
			w = 2 * Math.round(r * h / 2);
		} else 
		{
			w = Math.min(w, maxWidth);
			h = 2 * Math.round(w / (2 * r));
		}
		dw = Math.round((maxWidth - w) / 2);
		dh = Math.round((maxHeight - h) / 2);
		return {w:w, h:h, x:dw, y:dh};
	},
	addOptionToSelect:function(selectNode, text, value, defaultSelected, selected) {
		// Could be replaced with jQuery equivalent of this code, to support HTML in the title.
		var option = new Option (text, value, defaultSelected, selected);		
		selectNode.options[selectNode.options.length] = option;
	}
}

HZ.ui.ButtonFactory = {
	buttons:{},
	ordinalId:0,

	buttonClicked:function(id) {
		if (this.buttons[id] && this.buttons[id].enabled && this.buttons[id].onclick)
			this.buttons[id].onclick();
	},
	
	createDarkLinkButton:function(label, id, onclick, tooltip) {
		return this.createButton(label, id, "uiLinkDark", "", onclick, tooltip);
	},
	createDarkImageButton:function(label, id, imageClassName, onclick, tooltip) {
		return this.createButton(label, id, "uiButtonDark", imageClassName, onclick, tooltip);
	},	
	createButton:function(label, id, baseClass, imageClassName, onclick, tooltip) {
		var button = document.createElement("a");
		var className = baseClass || ""; 
		if (imageClassName)
			className += " uiImageButton";
		if (!label) {
			className += " uiButtonNoLabel";
			label = "";
		}
		if (!id)
			id = "_button_" + (this.ordinalId++);
		button.className = className;
		button.href = "javascript:;";
		button.id = id;
		if (tooltip)
			button.title = tooltip;
		
		var html = "<span>";
		if (imageClassName)
			html += "<img src='"+HZ.utils.Config.emptyGifData+"' class='uiButtonIcon"+imageClassName+"'/>";
		html += label+"</span>";
		button.innerHTML = html;

		this.buttons[id] = {onclick:onclick, enabled:true, button:button};
		button.onclick = function() {
			HZ.ui.ButtonFactory.buttonClicked(id);
		};
		
		return button;
	},
	/*
	 *deprecated, use HZ.ui.InputButtonUtils
	 */
	createSubmitButton:function(title, id, className, onclick) {
		var button = document.createElement("a");
		if (!id)
			id = "_button_" + (this.ordinalId++);
		button.href = "javascript:;";
		button.id = id;

		button.className = "standardButton" + (className?" "+className:"");
		button.innerHTML = "<span>"+title+"</span>";
		this.buttons[id] = {onclick:onclick, enabled:true, button:button};
		button.onclick = function() {
			HZ.ui.ButtonFactory.buttonClicked(id);
		};
		return button;
	},
	
	setTitle:function(title,id) {
		var node = this.buttons[id].button.firstChild;
		if (node.children.length == 2)
			node = node.children[1];
		node.innerHTML = title;
	},
	
	setEnabled:function(id, enabled) {
		if (this.buttons[id]) {
			this.buttons[id].enabled = enabled;
		}
	}
}

HZ.ui.InputButtonUtils = new (function() {
	var ordinalId = 0;
	//returns a jQuery object - an <input> with type button or submit
	var createButton = function(title, id, btnClass, type, onclickFn,disabled, extraClass, extraAttrs) {
		type = type==null?'button':type;
		disabled = disabled==null?false:disabled;
		extraClass = !extraClass?'':extraClass;
		extraAttrs = !extraAttrs?'':extraAttrs;
		id = !id?generateBtnId():id;
		var btn = $('<input value="'+title+'" type="'+type+'" '+extraAttrs+'/>');
		btn.attr('id',id)
			.attr('class',btnClass+' '+extraClass);
		if(disabled) btn.attr('disabled','disabled');
		if(onclickFn) {
			btn.bind('click',onclickFn);
		}
		return btn;
	}
	
	var generateBtnId = function() {
		return '_inputBtn_' + ordinalId++;
	}
	this.createPrimaryInputButton = function(title, id, onclickFn, isSubmit, disabled, extraClass,extraAttrs) {
		var type = isSubmit?'submit':'button';
		return createButton(title, id, 'hzBtn primary', type, onclickFn, disabled, extraClass, extraAttrs);
	}
	
	this.createSecondaryInputButton = function(title, id, onclickFn, isSubmit, disabled, extraClass,extraAttrs) {
		var type = isSubmit?'submit':'button';
		return createButton(title, id, 'hzBtn secondary', type, onclickFn, disabled, extraClass, extraAttrs);
	}
	
	this.createWarningInputButton = function(title, id, onclickFn, isSubmit, disabled, extraClass,extraAttrs) {
		var type = isSubmit?'submit':'button';
		return createButton(title, id, 'hzBtn warning', type, onclickFn, disabled, extraClass, extraAttrs);
	}
	
	this.disableButton = function (button) {
		if (button.is('input')) {
			button.attr('disabled', 'disabled');
		}
	}
	
	this.enableButton = function (button) {
		if (button.is('input')) {
			button.removeAttr('disabled');
		}
	}
})();

/* **************************************************************************
 * Yamdi - Yet Another Modal Dialog Implementation 
 * ************************************************************************** */

HZ.ui.Yamdi = new function() {
	var root, bg, stash, container,
		dragOrigin = null,
		closeButton = null,
		content = null,	// points to the content of the given dialog
		callback = null,
		dialog = null;
		
	var self = this;
	this.init = function() {
		if (root)
			return;
		root = $("<div></div>")
			.attr("id", "yamdiPlaceholder");
		root[0].style.position = this.isIE6?"absolute":"fixed";
		document.body.insertBefore(root[0], document.body.firstChild);
	
		bg = $("<div></div>")
			.attr("id", "yamdiBg");
		root.append(bg);
		UIHelper.setBounds(bg[0],0,0,"100%","100%");
		
		stash = $("<div></div>")
			.attr("id", "yamdiStash");
		root.append(stash);
			
		container = $("<div id='yamdiContainer'><a id='yamdiCloseButton' class='closeButton' href='javascript:;'></a><div id='yamdiDragZone'></div><div id='yamdiContent'></div></div>");
		root.append(container);
		closeButton = $('#yamdiCloseButton');
		content = $('#yamdiContent');
			
		$("#yamdiDragZone")
			.mousedown($.proxy(this.handleMouseDown, this))
			.mouseup($.proxy(this.handleMouseUp, this));

		closeButton.click(function (ev) {
			ev.preventDefault();  //for IE8 in conjunction to onbeforeunload, need to disable the link default behavior
			self.hide();
		});
		
		// nullify the init function
		this.init = function() {};
	};
	
	this.show = function(_dialog, _callback) {
		this.init();
		
		callback = _callback;
		dialog = _dialog;
		dialog.setDelegate(this);

		content.append(dialog.getView());	// attach the dialog's contents to the content box

		root.show();
		$("html").addClass("yamdiModal");
		$(window).bind('resize.yamdi', this.center);
		$(document).bind('keydown.yamdi', this.handleKeyDown);
		$(document).bind('mousemove.yamdi', this.handleMouseMove);
		dialog.viewLoaded();
		this.center();
	};
	
	this.handleKeyDown = function (event) {
		var e = event || window.event;
 		if (e.type == "keydown" && e.keyCode == 27)
			self.hide();
//		return false;
	};
	
	this.handleMouseDown = function (event) {
		var e = event || window.event;
		dragOrigin = getEventPosition(e);
		container.addClass("yamdiDrag");
		e.returnValue = false;
		if (e.preventDefault)
			e.preventDefault();
		return false;
	}
	
	this.handleMouseMove = function (event) {
		var e = event || window.event;
		if (dragOrigin != null) {
			var eventPos = getEventPosition(e);
			var dx = eventPos.x - dragOrigin.x;
			var dy = eventPos.y - dragOrigin.y;
			var bounds = container.position();
			bounds.left += dx;
			bounds.top += dy;
			UIHelper.setPosition(container[0], bounds.left, bounds.top);
			dragOrigin = eventPos;
			e.returnValue = false;
			if (e.preventDefault)
				e.preventDefault();
		}
		return false;
	}
	this.handleMouseUp = function (event) {
		dragOrigin = null;
		container.removeClass("yamdiDrag");
		if (event)
			event.preventDefault();
		return false;
	}	
	
	this.hide = function(status) {
		if (!root) {
			return;
		}
		root.hide();
		$(window).unbind('.yamdi');
		$(document).unbind('.yamdi');
		$("html").removeClass("yamdiModal");		
		this.handleMouseUp();
		
		dialog.viewUnloaded();
		dialog.setDelegate(null);
		
		stash.append(dialog.getView());	// detach the dialog's contents from the content box
		if (callback) {
			callback(dialog, status);
		}
	};
	
	this.switchDialog = function (toDialog) {
		dialog.viewUnloaded();
		dialog.setDelegate(null);
		
		stash.append(dialog.getView());	// detach the dialog's contents from the content box
		
		dialog = toDialog;
		dialog.setDelegate(this);

		content.append(dialog.getView());	// attach the dialog's contents to the content box

		dialog.viewLoaded();
		this.center();
	};
	
	this.center = function() {
		UIHelper.centerElement(container[0]);
	};
	
};

HZ.ui.AjaxThrobber = new function() {	// TODO: integrate into the AJAX calls to capture the return value and hide the in call.
	var isInCall = false;
	this.getThrobber = function () {
		return ("<span class='dialogThrobber'><img src='" + HZ.utils.Config.emptyGifData + "'></span>");
	};
	this.isInCall = function() {
		return isInCall;
	};
	this.setInCall = function (value) {
		isInCall =  value;
		if (value)
			$("#yamdiPlaceholder").addClass ("inAjaxCall");
		else
			$("#yamdiPlaceholder").removeClass ("inAjaxCall");
	};
}();

HZ.ns('HZ.ui.render');

HZ.ui.render.User = {
	_getUserLink:function(user) {
		if (user && user.n) {
			if (user.p)
				return HZ.utils.Links.getProfessionalLink(user.n);
			else
				return HZ.utils.Links.getUserLink(user.n);
		}
	},

	getUsersHtml:function(userIds, newWindowOnClick) {
		if (userIds.constructor != Array)
			userIds = [userIds];
		var html = "";
		var sep = "";
		for (var j=0; j<userIds.length; j++) {
			var user = HZ.data.Users.get(userIds[j]);
			var targetStr = newWindowOnClick?"target=\'_blank\'":"";
			html += sep + "<a href='"+this._getUserLink(user)+ "' " + targetStr + " >" + user.d + "</a>";
			sep = ", ";
		}
		return html;
	},
	
	getUserHtml:function(userId, newWindowOnClick, userLink) {
		var user = HZ.data.Users.get(userId);
		var targetStr = newWindowOnClick?"target=\'_blank\'":"";
		if (user) {
			userLink = userLink == null ? this._getUserLink(user) : userLink;
			return "<a href='" + userLink + "' " + targetStr + " >" + user.d + "</a>";
		}
	},

	getUserImageHtml:function(userId, newWindowOnClick, userLink) {
		var user = HZ.data.Users.get(userId);
		var userImageSrc = HZ.utils.Links.getUserImageUrl(userId, 0, 0);
		var targetStr = newWindowOnClick?"target=\'_blank\'":"";
		if (user) {
			userLink = userLink == null ? this._getUserLink(user) : userLink;
			return "<a href='" + userLink + "' " + targetStr + " class='userImage'><img src='" + userImageSrc + "'></a>";
		}
	},
	
	getProfessionalTypeName:function(user) {
		if (user && user.p && user.pt) {
			var typeName = HZ.data.ProfessionalTypes.get(user.pt);
			if (typeName) {
				return typeName;
			}
			else {
				return "";
			}
		}
		return "";
	}
}

HZ.ns('HZ.ui.yamdi');

HZ.ui.yamdi.Dialog = function() {
	var view = null,
		delegate = HZ.ui.Yamdi,
		viewTemplate =	"<div class='dialogFrame'>"+
							"<div class='hzDlgScrn'><form action='javascript:;'>"	+
								"<div class='dialogTitle'></div>"+
								"<div class='dialogStatus'></div>"+
								"<div class='dialogBody'></div>"+
								"<div class='dialogControls'></div>"+
							"</form></div>"+
						"</div>",
		defaults = {
			title: null,
			body: null,
			controls: null,
			formName: null,
			formSubmitTo: null,
			dialogClassName: null,
			onViewLoaded: function() {},
			onViewUnloaded: function() {}
		},
		settings,
		self = this;
	
	this.init = function (options) {
		if (options == null) {
			settings = defaults;
		}
		else {
			settings = $.extend(true,{},defaults,options)
		}
	};
	
	
	this.getView = function() {		
		if (!view) {
			view = $(viewTemplate);
			if(settings.dialogClassName) {
				view.addClass(settings.dialogClassName);
			}
			if(settings.formName) {
				view.find('form').attr('name',settings.formName).attr('id',settings.formName);
			}
			if(settings.formSubmitTo) {
				view.find('form').attr('action',settings.formSubmitTo);
			}
			if(settings.title) {
				view.find('.dialogTitle').append(settings.title);
			}

			if(settings.body) {
				view.find('.dialogBody').append(settings.body);
			}

			var btnsDiv = view.find('.dialogControls');

			if(settings.controls) {
				$.each(settings.controls, function(idx,elem){
					btnsDiv.append(elem);
				});
			}
			else {
				//just have a close button as default
				btnsDiv.append(HZ.ui.InputButtonUtils.createPrimaryInputButton(
											"OK", 
											null, 
											function(){
												self.getDelegate().hide(self);
											})
				);
			}
		}
		return view;
	};
	this.resetForm = function() {
		var frm = this.getView().find('form')[0];
		if(frm) {
			frm.reset();
		}
	};

	this.getForm = function() {
		return this.getView().find('form');
	}
	this.getTitle = function() {
		return this.getView().find('.dialogTitle');
	};
	this.setTitle = function(title) {
		this.getTitle().empty().append(title);
	};
	
	this.getBody = function() {
		return this.getView().find('.dialogBody');
	};
	this.setBody = function(body) {
		this.getBody().empty().append(body);
	};
	
	this.getControls = function() {
		return this.getView().find('.dialogControls');
	};
	
	this.setControls = function(controls) {
		this.getButtons().empty().append(buttons);
	};
	
	this.showStatus = function (messageBody) {
		this.getView().find('.dialogStatus').empty().append(messageBody).slideDown();
	};
	
	this.hideStatus = function () {
		this.getView().find('.dialogStatus').hide();
	};
	
	this.getDelegate = function() {
		return delegate;
	};
	
	this.setDelegate = function(d) {
		delegate = d;
	};
	this.setViewLoaded = function (onViewLoaded) {
		settings.onViewLoaded = onViewLoaded;
	};
	this.setViewUnloaded = function (onViewUnloaded) {
		settings.onViewUnloaded = onViewUnloaded;
	};
	this.viewLoaded = function () {
		settings.onViewLoaded.call(this);
	};
	
	this.viewUnloaded = function () {
		settings.onViewUnloaded.call(this);
	};
};

HZ.ui.yamdi.Common = new (function(){
	var alertDlg,
		confirmDlg, cancelBtn, confirmBtn,
		loadingDlg;
	
	this.alert = function(title,messageBody) {
		if(alertDlg==null){
			alertDlg = new HZ.ui.yamdi.Dialog();
			alertDlg.init({
				dialogClassName: 'alertDlg'
			});
		}
		alertDlg.setTitle(title);
		alertDlg.setBody(messageBody);
		
		HZ.ui.Yamdi.show(alertDlg);
	};
	//just a dialog with no buttons with a message below a throbber.  caller needs to close it.
	this.loading = function (messageTxt) {
		if(loadingDlg == null) {
			loadingDlg = new HZ.ui.yamdi.Dialog();
			loadingDlg.init({
				title: '',
				dialogClassName: 'alertDlg',
				controls: []
			});
		}
		loadingDlg.setBody('<div class="hzLoadingDlgThrobber"></div><div class="hzLoadingDlgMessage">'+messageTxt+'</div>');
		HZ.ui.Yamdi.show(loadingDlg);
	};
	
	var showConfirmDialog = function(title,messageBody,okText,okCallback,cancelText,cancelCallback,isWarning,onViewLoaded,onViewUnloaded) {
		if (!onViewLoaded) {
			onViewLoaded = function () {};
		}
		if (!onViewUnloaded) {
			onViewUnloaded = function () {};
		}
		var controls;
		var defaultCancelText = 'Cancel';
		if(confirmDlg == null) {
			cancelBtn = HZ.ui.InputButtonUtils.createSecondaryInputButton(defaultCancelText, "hzConfirmDlgCancelBtn");
			if (isWarning) {
				confirmBtn = HZ.ui.InputButtonUtils.createWarningInputButton(okText, "hzConfirmDlgOKBtn");
			}
			else {
				confirmBtn = HZ.ui.InputButtonUtils.createPrimaryInputButton(okText, "hzConfirmDlgOKBtn");
			}
			
			
			controls = [HZ.ui.AjaxThrobber.getThrobber(),cancelBtn,confirmBtn];
			
			confirmDlg = new HZ.ui.yamdi.Dialog();
			var initSettings = {
				dialogClassName: 'confirmDlg',
				controls: controls
			};
			confirmDlg.init(initSettings);
		}
		
		HZ.ui.AjaxThrobber.setInCall(false);
		HZ.ui.InputButtonUtils.enableButton(confirmBtn);
		
		confirmDlg.setTitle(title);
		confirmDlg.setBody(messageBody);
		confirmDlg.setViewLoaded(onViewLoaded);
		confirmDlg.setViewUnloaded(onViewUnloaded);

		if(!cancelText || cancelText=='') {
			cancelText = defaultCancelText;
		}
		cancelBtn.val(cancelText).unbind('click').one('click',function(){
			if(cancelCallback) {
				cancelCallback.call();
			}
			else {
				HZ.ui.Yamdi.hide(confirmDlg);
			}
		});
		confirmBtn.val(okText).unbind('click').one('click',function(){
			HZ.ui.AjaxThrobber.setInCall(true);
			okCallback.call();
			HZ.ui.InputButtonUtils.disableButton(confirmBtn);
		});
		
		if (isWarning) {
			confirmBtn.removeClass('primary').addClass('warning');
		}
		else {
			confirmBtn.removeClass('warning').addClass('primary');
		}
		HZ.ui.Yamdi.show(confirmDlg);
	};
	
	this.confirm = function(title,messageBody,okText,okCallback,cancelText,cancelCallback,onViewLoaded, onViewUnloaded) {
		showConfirmDialog(title,messageBody,okText,okCallback,cancelText,cancelCallback,false,onViewLoaded,onViewUnloaded);
	};
	
	this.areYouSure = function(title,messageBody,okText,okCallback,cancelText,cancelCallback) {
		showConfirmDialog(title,messageBody,okText,okCallback,cancelText,cancelCallback,true);
	};
	
	this.hideAllDialogs = function () {
		HZ.ui.Yamdi.hide(null);
	};
})();


window.hzmr.push("ui:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End ui.js  **************/