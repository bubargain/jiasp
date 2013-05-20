// JavaScript Document
function initControlStatus(Name)
{
	$("#inf_" + Name).html("");
	$("#inf_" + Name).attr("class","info");
	SetControlStatus(Name,0);
}

function SetControlStatus(Name,nSet)
{
	if(nSet==0)
	{
		$("#img_" + Name).html("");
		$("#img_" + Name).attr("class","img_null");
	}
	else if(nSet==1)
	{	
		$("#img_" + Name).html("<img src=\"/images/ok.gif\"  width=\"19\" height=\"16\"/>");
		$("#img_" + Name).attr("class","img_visable");
	}
	else if(nSet==2)
	{
		$("#img_" + Name).html("<img src=\"/images/error.gif\"  width=\"19\" height=\"16\"/>");
		$("#img_" + Name).attr("class","img_error");			
	}
}

function CheckControlStatus(Name)
{
	if($("#img_" + Name).hasClass("img_visable")==true)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function CheckControlOnFocus(Field,Name,nMin,nMax)
{
	$("#inf_" + Field).attr("class","notetrue");
	if(nMin>0)
	{
		if(nMax>0)
		{
			$("#inf_" + Field).html(Name + "由" + nMin + "~" + nMax + "个字符组成");
		}
		else
		{
			$("#inf_" + Field).html(Name + "必须大于" + nMin + "个字符");
		}
	}
	else
	{
		$("#inf_" + Field).html(Name + "必须小于" + nMax + "个字符");
	}
	SetControlStatus(Field,0);	
}

function CheckControlOnBlue(Field,Name,nMin,nMax,bShowCheck)
{
	initControlStatus(Field);	
	var value=Trim($("#e_" + Field).val());
	if(value.length==0)
	{
		return;
	}
	if(nMin>0)
	{
		if(nMax>0)
		{
			if(value.length<nMin || value.length>nMax)
			{
				alert(Name + "由" + nMin + "～" + nMax + "个字符组成");
				SetControlStatus(Field,2);
				return;
			}
		}
		else
		{
			if(value.length<nMin)
			{
				alert(Name + "必须大于" + nMin + "个字符");
				SetControlStatus(Field,2);
				return;
			}
		}
	}
	else
	{
		if(value.length>nMax)
		{
			alert(Name + "必须小于" + nMax + "个字符");
			SetControlStatus(Field,2);
			return;
		}
	}
	if(bShowCheck)
	{
		SetControlStatus(Field,1);
	}
}

