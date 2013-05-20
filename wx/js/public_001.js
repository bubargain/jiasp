// JavaScript Document
function initControlStatus(Name)
{
	var infName="inf_" + Name;
	var x=$(infName);
	if(x)
	{
		x.className="note";
		x.innerHTML="";
	}
	SetControlStatus(Name,0);
}

function SetControlStatus(Name,nSet)
{
	var imgName="img_" + Name;
	var img=$(imgName);
	if(img)
	{
		if(nSet==0)
		{
			img.className="img_null";
			img.innerHTML="";
		}
		else if(nSet==1)
		{
			img.className="img_visable";
			img.innerHTML="<img src=\"/images/ok.gif\"  width=\"19\" height=\"16\"/>";
		}
		else if(nSet==2)
		{
			img.className="img_visable";
			img.innerHTML="<img src=\"/images/error.gif\"  width=\"19\" height=\"16\"/>";	
		}
	}
}

function CheckControlStatus(Name)
{
	var img=$("img_" + Name);
	if(img)
	{
		if(img.className=="img_visable")
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}