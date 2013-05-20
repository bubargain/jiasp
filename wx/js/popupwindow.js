// JavaScript Document
var popup_dragging = false;
var popup_target;
var popup_mouseX;
var popup_mouseY;
var popup_mouseposX;
var popup_mouseposY;
var popup_oldfunction;
function popup_display(x)
{
	var win = window.open();
	for(var i in x)
	{
		win.document.write(i+' = '+x[i]+'<br>');
	}
}
// ----- popup_mousedown -------------------------------------------------------
function popup_mousedown(e)
{
	var ie = navigator.appName == "Microsoft Internet Explorer";
	if(ie && window.event.button != 1)
	{
		return;
	}
	if(!ie && e.button != 0)
	{
		return;
	}
	popup_dragging = true;
	popup_target = this['target'];
	popup_mouseX = ie ? window.event.clientX : e.clientX;
	popup_mouseY = ie ? window.event.clientY : e.clientY;
	if(ie)
		popup_oldfunction = document.onselectstart;
	else
		popup_oldfunction = document.onmousedown;
	if(ie)
		document.onselectstart = new Function("return false;");
	else
		document.onmousedown = new Function("return false;");
}
// ----- popup_mousemove -------------------------------------------------------
function popup_mousemove(e)
{
	if(!popup_dragging)
		return;
	var ie = navigator.appName == "Microsoft Internet Explorer";
	var element = document.getElementById(popup_target);
	var mouseX = ie ? window.event.clientX : e.clientX;
	var mouseY = ie ? window.event.clientY : e.clientY;
	element.style.left = (element.offsetLeft+mouseX-popup_mouseX)+'px';
	element.style.top = (element.offsetTop +mouseY-popup_mouseY)+'px';
	popup_mouseX = ie ? window.event.clientX : e.clientX;
	popup_mouseY = ie ? window.event.clientY : e.clientY;
}
// ----- popup_mouseup ---------------------------------------------------------
function popup_mouseup(e)
{
	if(!popup_dragging)
	{
		return;
	}
	popup_dragging = false;
	var ie = navigator.appName == "Microsoft Internet Explorer";
	var element = document.getElementById(popup_target);
	if(ie)
	{
		document.onselectstart = popup_oldfunction;
	}
	else
	{
		document.onmousedown = popup_oldfunction;
	}
}
// ----- popup_exit ------------------------------------------------------------
function popup_exit(e)
{
	var ie = navigator.appName == "Microsoft Internet Explorer";
	var element = document.getElementById(popup_target);
	popup_mouseup(e);
	element.style.visibility = 'hidden';
	element.style.display = 'none';
}
// ----- popup_show ------------------------------------------------------------
function popup_show(id)
{
	element = document.getElementById('popup'+id);
	drag_element = document.getElementById('popup_drag'+id);
	exit_element = document.getElementById('popup_exit'+id);
	element.style.position = "absolute";
	element.style.visibility = "visible";
	element.style.display = "block";
	var width=element.style.width.replace("px","");
	var height=element.style.height.replace("px","");
	
	var x=0;
	var y=0;
	if(document.documentElement)
	{
		x=document.documentElement.scrollLeft;
		y=document.documentElement.scrollTop;
	}
	else
	{
		x=document.body.scrollLeft;
		y=document.body.scrollTop;
	}
	
	var l=(screen.width - width) / 2 + x;
	var t=(screen.height - height) / 2 + y - 60;
	element.style.left=l+"px";
	element.style.top=t+"px";
	drag_element['target'] = 'popup'+id;
	drag_element.onmousedown = popup_mousedown;
	exit_element.onclick = popup_exit;
}

function popup_show_pos(id,left,top)
{
	element = document.getElementById('popup'+id);
	drag_element = document.getElementById('popup_drag'+id);
	exit_element = document.getElementById('popup_exit'+id);
	element.style.position = "absolute";
	element.style.visibility = "visible";
	element.style.display = "block";
	var width=element.style.width.replace("px","");
	var height=element.style.height.replace("px","");
	
	var x=0;
	var y=0;
	if(document.documentElement)
	{
		x=document.documentElement.scrollLeft;
		y=document.documentElement.scrollTop;
	}
	else
	{
		x=document.body.scrollLeft;
		y=document.body.scrollTop;
	}
	
	element.style.left=left+"px";
	element.style.top=top+"px";
	drag_element['target'] = 'popup'+id;
	drag_element.onmousedown = popup_mousedown;
	exit_element.onclick = popup_exit;
}

// ----- popup_mousepos --------------------------------------------------------
function popup_mousepos(e)
{
	var ie = navigator.appName == "Microsoft Internet Explorer";
	popup_mouseposX = ie ? window.event.clientX : e.clientX;
	popup_mouseposY = ie ? window.event.clientY : e.clientY;
}
// ----- Attach Events ---------------------------------------------------------
if (navigator.appName == "Microsoft Internet Explorer")
	document.attachEvent('onmousedown', popup_mousepos);
else document.addEventListener('mousedown', popup_mousepos, false);
if (navigator.appName == "Microsoft Internet Explorer")
	document.attachEvent('onmousemove', popup_mousemove);
else document.addEventListener('mousemove', popup_mousemove, false);
if (navigator.appName == "Microsoft Internet Explorer")
	document.attachEvent('onmouseup', popup_mouseup);
else document.addEventListener('mouseup', popup_mouseup, false);