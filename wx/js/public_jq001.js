// JavaScript Document
function initControlStatus(Name)
{
	var inf="#inf_" + Name;
	$(inf).attr("class","content_note");
	$(inf).html("");
	SetControlStatus(Name,0);
}

function SetControlStatus(Name,nSet)
{
	var img="#img_" + Name;
	if(nSet==0)
	{
		$(img).attr("class","content_img_null");
		$(img).html("");
	}
	else if(nSet==1)
	{
		$(img).attr("class","content_img_visible");
		$(img).html("<img src=\"/images/ok.gif\"  width=\"19\" height=\"16\"/>");		
	}
	else if(nSet==2)
	{
		$(img).attr("class","content_img_visible");
		$(img).html("<img src=\"/images/error.gif\"  width=\"19\" height=\"16\"/>");
	}
}

function CheckControlStatus(Name)
{
	var img="#img_" + Name;
	if($(img).attr("class")=="content_img_visible")
	{
		return false;
	}
	return true;
}

function CheckCvString(name,nMin,nMax)
{
	$("#inf_" + name).html("");
	var cv=$("#e_" + name).val();
	if(nMin>0)
	{
		if(nMax>0)
		{
			if(cv.length<nMin || cv.length>nMax)
			{
				$("#inf_" + name).html("Length must be between " + nMin + " to " + nMax + " characters.");
				SetControlStatus(name,2);
				return;
			}
		}
		else
		{
			if(cv.length<nMin)
			{
				$("#inf_" + name).html("Length must be greater than " + nMin + ".");
				SetControlStatus(name,2);
				return;
			}
		}
	}
	else if(max>0)
	{
		if(cv.length>nMax)
		{
			$("#inf_" + name).html("Length must be less than " + nMax + ".");
			SetControlStatus(name,2);
			return;
		}
	}
	var ck=checkInputChar(cv);
	if(ck!="")
	{
		$("#inf_" + name).html("Contains illegal characters [ " + ck + " ] ！");
		SetControlStatus(name,2);
		return;		
	}
	SetControlStatus(name,0);
}

function CheckCvInterger(name)
{
	$("#inf_" + name).html("");
	var cv=$("#e_" + name).val();
	if(!isInteger(cv))
	{
		$("#inf_" + name).html("Must be a number.");
		SetControlStatus(name,2);
		return;
	}
	SetControlStatus(name,0);
}

function CheckCvDecimal(name)
{
	$("#inf_" + name).html("");
	var cv=$("#e_" + name).val();
	if(!isDecimal(cv))
	{
		$("#inf_" + name).html("Must be a number.");
		SetControlStatus(name,2);
		return;
	}
	SetControlStatus(name,0);
}

function CheckCv(name,display_name)
{
	if(!CheckControlStatus(name))
	{
		alert("[" + display_name + "] input error!");
		return false;
	}
	return true;
}

function CheckCvEditNotNull(name,display_name)
{
	if(!CheckControlStatus(name) || $("#e_" + name).val()=="")
	{
		alert("[" + display_name + "] input error!");
		return false;
	}
	return true;
}

function CheckCvFile(name)
{
	var filepath=$("input[name='file_" + name + "']").val();
	if(filepath!="")
	{
		var extStart=filepath.lastIndexOf(".")+1;
		var ext=filepath.substring(extStart,filepath.length).toLowerCase();
		if(ext!="jpg"&&ext!="jpeg"&&ext!="gif"&&ext!="png")
		{
			 alert("只能上传jpg、jpeg、gif、png类型的图片");
			 return false;
		}
		return true;
	}
	return false;
}

