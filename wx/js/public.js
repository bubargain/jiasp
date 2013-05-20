// JavaScript Document
//定义
function Trim(str) 
{
	return str.replace(/^ +/,"").replace(/ +$/,"");
}

function checkByteLength(str,minlen,maxlen) 
{
	if (str==null)
	{
		return false;
	}
	var l = str.length;
	var blen = 0;
	for(i=0; i<l; i++) 
	{
		if ((str.charCodeAt(i) & 0xff00) != 0) 
		{
			blen ++;
		}
		blen ++;
	}
	if (blen > maxlen || blen < minlen) 
	{
		return false;
	}
	return true;
}

function isNumberContinue(str)
{
	var patn1 =   /^[0-9_]+$/;
	var ascendNumber=0;
	var descendNumber=0;
	for (var i = 1; i < str.length; i++) 
	{
		if (str.charAt(i).charCodeAt() != (str.charAt(i-1).charCodeAt() + 1)) 
		{
			ascendNumber = 1;
			break;
		}
	}	
	for (i = 0; i < (str.length - 1); i++) 
	{
		if (str.charAt(i).charCodeAt() != (str.charAt(i+1).charCodeAt() + 1)) 
		{
			descendNumber = 1;
			break;
		}
	}
	if(descendNumber == 0 || ascendNumber == 0)
	{
		return 1;
	}
	else
	{
		return 0;
	}
}

function isSameLetter(str)
{
	var sameNumberFlag = 1;
	var patn1 =   /^[0-9]+$/;
	if(patn1.test(str))
	{
		for (var i = 0; i < str.length; i++)
		{
			if (str.charAt(0) != str.charAt(i))
			{
				sameNumberFlag = 0;
				break;
			}
		}          
	}
	else
	{
		for (var i = 0; i < str.length; i++)
		{
			if (str.charAt(0) != str.charAt(i))
			{
				sameNumberFlag = 0;
				break;
			}
		}
	}
	return sameNumberFlag;
}

function DataLength(fData)
{
	var intLength=0;
	for (var i=0;i<fData.length;i++) 
	{
		if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255))
			intLength=intLength+2;
		else
			intLength=intLength+1; 
	}
	return intLength;
}

function isDigit(NUM) 
{ 	
	if(Trim(NUM)=="")
	{
		return true;
	}
	var i,j,strTemp; 
	strTemp="0123456789"; 
	if (NUM.length==0)
	{
		return false ;
	}
	for (i=0;i<NUM.length;i++) 
	{ 
		j=strTemp.indexOf(NUM.charAt(i)); 
		if (j==-1) 
		{ 
			return false; 
		} 
	} 
	return true; 
}

function isAlpha(cCheck)
{
	return ((('a'<=cCheck) && (cCheck<='z')) || (('A'<=cCheck) && (cCheck<='Z')))
}

function IsURL(urlString)
{
	regExp = /(http[s]?|ftp):\/\/[^\/\.]+?\..+\w$/i;
	if(urlString.match(regExp))
	{
		return true;
	}
	else
	{
		return false;
	}
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

function isInteger( str )
{
	var regu = /^[-]{0,1}[0-9]{1,}$/; 
	return regu.test(str); 
} 

function isDecimal(str)
{
	if(isInteger(str))
	{
		return true;
	}
	var re = /^[-]{0,1}(\d+)[\.]+(\d+)$/;
	if (re.test(str))
	{
		if(RegExp.$1==0&&RegExp.$2==0)
		{
			return false;
		}
		return true;
	}
	else
	{
		return false;
	}
}

function URLEncode(clearString)
{
	var output = '';
	var x = 0;
	clearString = clearString.toString();
	var regex = /(^[a-zA-Z0-9_.]*)/;
	while (x < clearString.length) 
	{
	    var match = regex.exec(clearString.substr(x));
    	if (match != null && match.length > 1 && match[1] != '') 
		{
	        output += match[1];
    		x += match[1].length;
		}
		else
		{
			if (clearString[x] == ' ')
        		output += '+';
			else 
			{
				var charCode = clearString.charCodeAt(x);
				var hexVal = charCode.toString(16);
				output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();
			}
			x++;
		}
	}
	return output;
}

function IsEmail(mail)
{
    return(new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(mail));
}

function getLocTime(nS)
{
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, " - ").replace(/日/g, " "); 
}

function StrToTimestamp(datestr)
{
    var new_str = datestr.replace(/:/g,"-");
    new_str = new_str.replace(/ /g,"-");
    var arr = new_str.split("-");
    var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
    return (datum.getTime()/1000);
}

function getLsh()
{
     d = new Date();							//Date 对象  启用基本存储器并取得系统日期和时间。
     var s = "";
     s += d.getYear();                      	//获取年份
     s += d.getMonth()+1;      					//获取月份
     s += d.getDate();                     		//获取日期
     s += d.getHours();                   		//获取小时
     s += d.getMinutes();                		//获取分钟
     s += d.getSeconds();               		//获取秒数
     s += d.getMilliseconds();                  //获取毫秒数
	 return s;
}

function getTodayTime()
{
     d = new Date();							//Date 对象  启用基本存储器并取得系统日期和时间。
     var s = d.getYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " 23:59:59"; //获取日期
	 return StrToTimestamp(s);
}

function mbStringLength(s)
{
	var totalLength = 0;
    var i;
    var charCode;
    for(i=0; i<s.length;i++)
	{
		charCode = s.charCodeAt(i);
        if(charCode<0x007f)
		{
			totalLength=totalLength+1;
		}
		else if((0x0080<=charCode)&&(charCode<=0x07ff))
		{
			totalLength+=2;
		}
		else if((0x0800<=charCode) && (charCode<=0xffff))
		{
			totalLength += 3;
		}
	}
	//alert(totalLength);
	return totalLength;
}

function getStringLength(s)
{
	var totalLength = 0;
    var i;
    var charCode;
    for(i=0; i<s.length;i++)
	{
		charCode = s.charCodeAt(i);
        if(charCode<0x007f)
		{
			totalLength=totalLength+1;
		}
		else
		{
			totalLength+=2;
		}
	}
	//alert(totalLength);
	return totalLength;
}

function subStr2(s,length)
{
	var totalLength = 0;
    var i,w;
	var j=0;
    var charCode;
    for(i=0; i<s.length;i++)
	{
		charCode = s.charCodeAt(i);
        if(charCode<0x007f)
		{
			w=1;
		}
		else
		{
			w=2;
		}
		totalLength+=w;
		if(totalLength>length)
		{
			j=i-1;
			break;
		}
	}
	if(j>0)
	{
		s=s.substring(0,j);
	}
	return s;
}

function Sleep(obj,iMinSecond)
{ 
	if (window.eventList==null) 
	window.eventList=new Array(); 
	var ind=-1;
	for (var i=0;i<window.eventList.length;i++)
	{  
		if (window.eventList[i]==null) 
		{
			window.eventList[i]=obj;   
			ind=i;
			break;
		}
	}
	if (ind==-1)
	{
		ind=window.eventList.length;
		window.eventList[ind]=obj;
	}
	setTimeout("GoOn(" + ind + ")",iMinSecond);
}

function GoOn(ind)
{ 
	var obj=window.eventList[ind];
	window.eventList[ind]=null;
	if (obj.NextStep) obj.NextStep();
	else obj();
}

function getAbsoluteHeight(ob)
{   
	return ob.offsetHeight;
}

function getAbsoluteWidth(ob)
{
     return ob.offsetWidth;
}   
  
function getAbsoluteLeft(ob)
{
	var mendingLeft = ob .offsetLeft;   
	while( ob != null && ob.offsetParent != null && ob.offsetParent.tagName != "BODY" )
	{
		mendingLeft += ob .offsetParent.offsetLeft;   
		ob = ob.offsetParent;   
	}
	return mendingLeft ;   
}   

function getAbsoluteTop(ob)
{
    var mendingTop = ob.offsetTop;   
    while( ob != null && ob.offsetParent != null && ob.offsetParent.tagName != "BODY" )
	{
		mendingTop += ob .offsetParent.offsetTop;   
        ob = ob .offsetParent;   
	}   
    return mendingTop;
}

function getFckEditorHTMLContents(EditorName)
{
	var oEditor = FCKeditorAPI.GetInstance(EditorName);
	return(oEditor.GetXHTML(true));
}

function replaceAll(str,sold,snew)
{
	while(str.indexOf(sold)>-1)
	{
		str=str.replace(sold,snew);
	}
	return str;
}

var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encode64(input)
{
      input = escape(input);
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      do {
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
            keyStr.charAt(enc1) + 
            keyStr.charAt(enc2) + 
            keyStr.charAt(enc3) + 
            keyStr.charAt(enc4);
         chr1 = chr2 = chr3 = "";
         enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);

      return output;
}

function decode64(input)
{
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
         alert("There were invalid base64 characters in the input text.\n" +
               "Valid base64 characters are A-Z, a-z, 0-9, '+', '/', and '='\n" +
               "Expect errors in decoding.");
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      do {
         enc1 = keyStr.indexOf(input.charAt(i++));
         enc2 = keyStr.indexOf(input.charAt(i++));
         enc3 = keyStr.indexOf(input.charAt(i++));
         enc4 = keyStr.indexOf(input.charAt(i++));

         chr1 = (enc1 << 2) | (enc2 >> 4);
         chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
         chr3 = ((enc3 & 3) << 6) | enc4;

         output = output + String.fromCharCode(chr1);

         if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
         }
         if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
         }

         chr1 = chr2 = chr3 = "";
         enc1 = enc2 = enc3 = enc4 = "";

      } while (i < input.length);

      return unescape(output);
}

function ToDate(timestamp)
{
	d = new Date(timestamp); 
	var jstimestamp = (d.getFullYear())+"-"+(d.getMonth()+1)+"-"+(d.getDate())+" "+(d.getHours())+":"+(d.getMinutes())+":"+(d.getSeconds()); 
	return jstimestamp; 
}

function getRadioBoxValue(radioName)
{
	var obj = document.getElementsByName(radioName);
    for(i=0; i<obj.length; i++)
	{
		if(obj[i].checked)
		{
			return obj[i].value;
		}
	}
    return "undefined";
}

function GetFileExt(file)
{
	if(file=="")
	{
		return "";
	}
	while(file.indexOf("\\") != -1)
	{
		file = file.slice(file.indexOf("\\") + 1);
	}
	var ext = file.slice(file.indexOf(".")).toLowerCase();
	return ext;
}

/** 
* 防范SQL注入漏洞，检测输入的字符 
* 需要检测的特殊字符及字符串有：",","-","/","\\","'","%",""" 
* @param  strInput 待检测的字符 
* @author Tony Lin Added on 2008-10-21 
*/ 
function checkInputChar(strInput)
{
	var forbidChar = new Array(",","-","/","\\","'","%","\"");
	for (var i = 0;i < forbidChar.length ; i++)
	{
		if(strInput.indexOf(forbidChar[i]) >= 0)
		{
			return forbidChar[i];
		}
	}
	return "";
} 

function GetBrosweType()
{
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	if (window.ActiveXObject)
		Sys.ie = ua.match(/msie ([\d.]+)/)[1]
	else if (document.getBoxObjectFor)
		Sys.firefox = ua.match(/firefox\/([\d.]+)/)[1]
	else if (window.MessageEvent && !document.getBoxObjectFor)
		Sys.chrome = ua.match(/chrome\/([\d.]+)/)[1]
	else if (window.opera)
		Sys.opera = ua.match(/opera.([\d.]+)/)[1]
	else if (window.openDatabase)
		Sys.safari = ua.match(/version\/([\d.]+)/)[1];
	return Sys;
}

function isExist(variable)
{
	return typeof(variable)=='undefined' ? false : true;
}

function ToImageUbb(content)
{
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/smile.gif\" alt=\"微笑\" />","[~i1]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/tongue.gif\" alt=\"吐舌头\" />","[~i2]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/titter.gif\" alt=\"偷笑\" />","[~i3]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/laugh.gif\" alt=\"大笑\" />","[~i4]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/sad.gif\" alt=\"难过\" />","[~i5]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/wronged.gif\" alt=\"委屈\" />","[~i6]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/fastcry.gif\" alt=\"快哭了\" />","[~i7]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/cry.gif\" alt=\"哭\" />","[~i8]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/wail.gif\" alt=\"大哭\" />","[~i9]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/mad.gif\" alt=\"生气\" />","[~ia]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/knock.gif\" alt=\"敲打\" />","[~ib]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/curse.gif\" alt=\"骂人\" />","[~ic]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/crazy.gif\" alt=\"抓狂\" />","[~id]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/angry.gif\" alt=\"发火\" />","[~ie]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/ohmy.gif\" alt=\"惊讶\" />","[~if]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/awkward.gif\" alt=\"尴尬\" />","[~ig]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/panic.gif\" alt=\"惊恐\" />","[~ih]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/shy.gif\" alt=\"害羞\" />","[~ii]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/cute.gif\" alt=\"可怜\" />","[~ij]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/envy.gif\" alt=\"羡慕\" />","[~ik]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/proud.gif\" alt=\"得意\" />","[~il]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/struggle.gif\" alt=\"奋斗\" />","[~im]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/quiet.gif\" alt=\"安静\" />","[~in]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/shutup.gif\" alt=\"闭嘴\" />","[~io]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/doubt.gif\" alt=\"疑问\" />","[~ip]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/despise.gif\" alt=\"鄙视\" />","[~iq]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/sleep.gif\" alt=\"睡觉\" />","[~ir]");
	content=content.replace("<img src=\"includes/ubb/xheditor_emot/default/bye.gif\" alt=\"再见\" />","[~is]");
	return content;
}

function ReImageUbb(content)
{
	content=content.replace("[~i1]","<img src=\"includes/ubb/xheditor_emot/default/smile.gif\" alt=\"微笑\" />");
	content=content.replace("[~i2]","<img src=\"includes/ubb/xheditor_emot/default/tongue.gif\" alt=\"吐舌头\" />");
	content=content.replace("[~i3]","<img src=\"includes/ubb/xheditor_emot/default/titter.gif\" alt=\"偷笑\" />");
	content=content.replace("[~i4]","<img src=\"includes/ubb/xheditor_emot/default/laugh.gif\" alt=\"大笑\" />");
	content=content.replace("[~i5]","<img src=\"includes/ubb/xheditor_emot/default/sad.gif\" alt=\"难过\" />");
	content=content.replace("[~i6]","<img src=\"includes/ubb/xheditor_emot/default/wronged.gif\" alt=\"委屈\" />");
	content=content.replace("[~i7]","<img src=\"includes/ubb/xheditor_emot/default/fastcry.gif\" alt=\"快哭了\" />");
	content=content.replace("[~i8]","<img src=\"includes/ubb/xheditor_emot/default/cry.gif\" alt=\"哭\" />");
	content=content.replace("[~i9]","<img src=\"includes/ubb/xheditor_emot/default/wail.gif\" alt=\"大哭\" />");
	content=content.replace("[~ia]","<img src=\"includes/ubb/xheditor_emot/default/mad.gif\" alt=\"生气\" />");
	content=content.replace("[~ib]","<img src=\"includes/ubb/xheditor_emot/default/knock.gif\" alt=\"敲打\" />");
	content=content.replace("[~ic]","<img src=\"includes/ubb/xheditor_emot/default/curse.gif\" alt=\"骂人\" />");
	content=content.replace("[~id]","<img src=\"includes/ubb/xheditor_emot/default/crazy.gif\" alt=\"抓狂\" />");
	content=content.replace("[~ie]","<img src=\"includes/ubb/xheditor_emot/default/angry.gif\" alt=\"发火\" />");
	content=content.replace("[~if]","<img src=\"includes/ubb/xheditor_emot/default/ohmy.gif\" alt=\"惊讶\" />");
	content=content.replace("[~ig]","<img src=\"includes/ubb/xheditor_emot/default/awkward.gif\" alt=\"尴尬\" />");
	content=content.replace("[~ih]","<img src=\"includes/ubb/xheditor_emot/default/panic.gif\" alt=\"惊恐\" />");
	content=content.replace("[~ii]","<img src=\"includes/ubb/xheditor_emot/default/shy.gif\" alt=\"害羞\" />");
	content=content.replace("[~ij]","<img src=\"includes/ubb/xheditor_emot/default/cute.gif\" alt=\"可怜\" />");
	content=content.replace("[~ik]","<img src=\"includes/ubb/xheditor_emot/default/envy.gif\" alt=\"羡慕\" />");
	content=content.replace("[~il]","<img src=\"includes/ubb/xheditor_emot/default/proud.gif\" alt=\"得意\" />");
	content=content.replace("[~im]","<img src=\"includes/ubb/xheditor_emot/default/struggle.gif\" alt=\"奋斗\" />");
	content=content.replace("[~in]","<img src=\"includes/ubb/xheditor_emot/default/quiet.gif\" alt=\"安静\" />");
	content=content.replace("[~io]","<img src=\"includes/ubb/xheditor_emot/default/shutup.gif\" alt=\"闭嘴\" />");
	content=content.replace("[~ip]","<img src=\"includes/ubb/xheditor_emot/default/doubt.gif\" alt=\"疑问\" />");
	content=content.replace("[~iq]","<img src=\"includes/ubb/xheditor_emot/default/despise.gif\" alt=\"鄙视\" />");
	content=content.replace("[~ir]","<img src=\"includes/ubb/xheditor_emot/default/sleep.gif\" alt=\"睡觉\" />");
	content=content.replace("[~is]","<img src=\"includes/ubb/xheditor_emot/default/bye.gif\" alt=\"再见\" />");
	return content;
}

(function($){
    // the code of this function is from     
    // http://lucassmith.name/pub/typeof.html    
    $.type = function(o) {    
        var _toS = Object.prototype.toString;    
        var _types = {    
            'undefined': 'undefined',    
            'number': 'number',    
            'boolean': 'boolean',    
            'string': 'string',    
            '[object Function]': 'function',    
            '[object RegExp]': 'regexp',    
            '[object Array]': 'array',    
            '[object Date]': 'date',    
            '[object Error]': 'error'    
        };    
        return _types[typeof o] || _types[_toS.call(o)] || (o ? 'object' : 'null');    
    };    
    // the code of these two functions is from mootools    
    // http://mootools.net    
    var $specialChars = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' };    
    var $replaceChars = function(chr) {    
        return $specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);    
    };    
    $.toJSON = function(o) {
        var s = [];    
        switch ($.type(o)) {    
            case 'undefined':    
                return 'undefined';    
                break;    
            case 'null':    
                return 'null';    
                break;    
            case 'number':    
            case 'boolean':    
            case 'date':    
            case 'function':    
                return o.toString();    
                break;    
            case 'string':    
                return '"' + o.replace(/[\x00-\x1f\\"]/g, $replaceChars) + '"';    
                break;    
            case 'array':    
                for (var i = 0, l = o.length; i < l; i++) {
                    s.push($.toJSON(o[i]));
                }
                return '[' + s.join(',') + ']';    
                break;    
            case 'error':    
            case 'object':    
                for (var p in o) {    
                    s.push(p + ':' + $.toJSON(o[p]));    
                }    
                return '{' + s.join(',') + '}';    
                break;    
            default:    
                return '';    
                break;    
        }    
    };    
    $.evalJSON = function(s) {    
        if ($.type(s) != 'string' || !s.length) return null;    
        return eval('(' + s + ')');    
    };    
})(jQuery);

//按指定精度做四舍五入
function  ForDight(Dight,How)     
{     
	Dight=Math.round(Dight*Math.pow(10,How))/Math.pow(10,How);
	return Dight;
}

function ToInt(val)
{
	var ret=0;
	if(typeof(val)=='undefined')
	{
		return ret;
	}
	if(val==null)
	{
		return ret;
	}
	if(val=="")
	{
		return ret;
	}
	if(val.length==0)
	{
		return ret;
	}
	if(isDigit(val)==false)
	{
		return ret;
	}	
	val=parseInt(val);
	if(val=="NaN")
	{
		return ret;
	}
	return val;
}

function ToFloat(val)
{
	var ret=0;
	if(typeof(val)=='undefined')
	{
		return ret;
	}
	if(val==null)
	{
		return ret;
	}	
	if(val=="")
	{
		return ret;
	}
	if(val.length==0)
	{
		return ret;
	}	
	val=parseFloat(val);
	if(isNaN(val))
	{
		return ret;
	}
	return parseFloat(val.toFixed(2));
}

function ToInt1(val)
{
   return parseInt(val)||0;
}

function ToFloat1(val)
{
   return parseFloat(val)||0;
}

function ToStr(val)
{
	var ret="";
	if(typeof(val)=='undefined')
	{
		return ret;
	}
	if(val==null || val=="null")
	{
		return ret;
	}
	return val;
}

function EncodeJson(input)
{
	if(!input)
	{
		return '"null"';
	}
    switch (input.constructor)
	{
		case String: return '"' + input + '"';
		case Number: return '"' + input.toString() + '"';
		case Boolean: return '"' + input.toString() + '"';
		case Array:
			var buf = [];
			for(i in input)
			{
				buf.push(EncodeJson(input[i]));
			}
			return '[' + buf.join(',') + ']';
		case Object:
			var buf = [];
			for (k in input)
			{
				buf.push('"' + k + '":' + EncodeJson(input[k]))
			}
			return '{' + buf.join(',') + '}';
		default:
			return 'null';
	}
}

//记录集状态
function GetRdStatus(status)
{
	var ary_status=Array("<span style='color:#090;'>有效</span>","<span style='color:#F00;'>停用</span>","<span style='color:#FC3;'>取消</span>","<span style='color:#000;'>弃置</span>");
	if(status>=0 && status<=ary_status.length)
	{
		return ary_status[status];
	}
	return "";
}

Date.prototype.format = function(format){
	var o = {
		"M+" :  this.getMonth()+1,  //month
		"d+" :  this.getDate(),     //day
		"h+" :  this.getHours(),    //hour
		"m+" :  this.getMinutes(),  //minute
		"s+" :  this.getSeconds(), //second
		"q+" :  Math.floor((this.getMonth()+3)/3),  //quarter
		"S"  :  this.getMilliseconds() //millisecond
	}
 
	if(/(y+)/.test(format)){
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
 
	for(var k in o){
		if(new RegExp("("+ k +")").test(format)){
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		}
	}
	return format;
}

function unixtimeToString(ltime)
{
	var d = new Date(); 
	var localOffset = d.getTimezoneOffset() * 60000; //时间偏移值
	var unixTimestamp = new Date(ltime*1000+localOffset);
	commonTime = unixTimestamp.format("yyyy-MM-dd hh:mm");
	return commonTime;
}

function unixtimeToDateString(ltime)
{
	var d = new Date(); 
	var localOffset = d.getTimezoneOffset() * 60000; //时间偏移值
	var unixTimestamp = new Date(ltime*1000+localOffset);
	commonTime = unixTimestamp.format("yyyy-MM-dd");
	return commonTime;
}

function GetRStatus(nStatus)
{
	var status=new Array("有效", "停用", "取消", "弃置");
    return status[nStatus];
}

function SetDomain()
{
	document.domain=www_site_url.replace("http://www.","");		//	"geekswe.cc";
}

function checkFloat(event)
{
	var e=window.event || event;
	var target=e.srcElement || e.target;
	var k=e.keyCode;
	if(isFunKeyFloat(k))
	{
		return true;
	}
	var c=getChar(k);
	if(target.value.length=='' && (c=='_' || c=='+'))
	{
		return true;
	}
	if(isNaN(target.value+getChar(k)))
	{
		return false;
	}
	return true;
}

function isFunKeyFloat(code)
{
	//8  --> Backspace
	//35 --> End
	//36 --> Home
	//37 --> Left Arrow
	//39 --> Right Arrow
	//46 --> Delete
	//112 ~ 123 --> F1 ~ F12
	var funKeys=[8,35,36,37,39,46];
	for(var i=112;i<=123;i++)
	{
		funKeys.push(i);
	}
	for(var i=0;i<funKeys.length;i++)
	{
		if(funKeys[i]==code)
		{
			return true;
		}
	}
	return false;
}

function checkInt(event)
{
	var e=window.event || event;
	var target=e.srcElement || e.target;
	var k=e.keyCode;
	if(isFunKeyInt(k))
	{
		return true;
	}
	if(k==110 || k==190)
	{
		return false;
	}
	var c=getChar(k);
	if(target.value.length=='' && (c=='_' || c=='+'))
	{
		return true;
	}
	if(isNaN(target.value+getChar(k)))
	{
		return false;
	}
	return true;
}

function isFunKeyInt(code)
{
	//8  --> Backspace
	//35 --> End
	//36 --> Home
	//37 --> Left Arrow
	//39 --> Right Arrow
	//46 --> Delete
	//112 ~ 123 --> F1 ~ F12
	var funKeys=[8,35,36,37,39,46];
	for(var i=112;i<=123;i++)
	{
		funKeys.push(i);
	}
	for(var i=0;i<funKeys.length;i++)
	{
		if(funKeys[i]==code)
		{
			return true;
		}
	}
	return false;
}

function getChar(k)
{
	if(k>=48 && k<=57)
	{
		return String.fromCharCode(k);
	}
	if(k>=96 && k<=105)
	{
		return String.fromCharCode(k-48);
	}
	if(k==110 || k==190)
	{
		return ".";
	}
	if(k==109 || k==189)
	{
		return "-";
	}
	if(k==107 || k==187)
	{
		return "+";
	}
	return "#";
}
