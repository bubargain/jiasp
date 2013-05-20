<?php

@session_start();

/*
//获取随机字符
$old_rndstring="";
$rndstring = "";
if(isset($_SESSION["checkcode"]))
{
	$old_rndstring=$_SESSION["checkcode"];
}
while(true)
{
	$rndstring="";
	for($i=0; $i<5; $i++)
	{
		$cc=rand(0,5);
		for($j=0;$j<$cc;$j++)
		{
			rand(65,90);
		}
		$rndstring .= chr(rand(65,90));
	}
	//echo "old=" . $old_rndstring . "<br />\n";
	//echo "new=" . $rndstring . "<br />\n";
	if($old_rndstring==$rndstring)
	{
		$cc=rand(0,5);
		for($j=0;$j<$cc;$j++)
		{
			rand(65,90);
		}
	}
	else
	{
		break;
	}
}
*/

$rndstring = "";

srand((double)microtime()*100000000);
for($i=0; $i<5; $i++)
{
	for($j=0;$j<microtime();$j++)
	{
		$temp=mt_rand(65,90);
	}
	$rndstring .= chr(mt_rand(65,90));
}

$_SESSION["checkcode"]=$rndstring;

//如果支持GD，则绘图
if(function_exists("imagecreate"))
{
	//Firefox部份情况会多次请求的问题，5秒内刷新页面将不改变session
	$ntime = time();
	$rndcodelen = strlen($rndstring);

	//创建图片，并设置背景色
	$im = imagecreate(60,20);
	ImageColorAllocate($im, 255,255,255);

	//背景线
	$lineColor1 = ImageColorAllocate($im,240,220,180);
	$lineColor2 = ImageColorAllocate($im,250,250,170);
	for($j=3;$j<=16;$j=$j+3)
	{
		imageline($im,2,$j,58,$j,$lineColor1);
	}
	for($j=2;$j<52;$j=$j+(mt_rand(3,6)))
	{
		imageline($im,$j,2,$j-6,18,$lineColor2);
	}

	//画边框
	$bordercolor = ImageColorAllocate($im, 0x99,0x99,0x99);
	imagerectangle($im, 0, 0, 59, 19, $bordercolor);

	//输出文字
	$fontColor = ImageColorAllocate($im, 58,61,50);
	for($i=0;$i<$rndcodelen;$i++)
	{
		$bc = mt_rand(0,1);
		$rndstring[$i] = strtoupper($rndstring[$i]);
		imagestring($im, 5, $i*10+6, mt_rand(2,4), $rndstring[$i], $fontColor);
	}

	header("Pragma:no-cache\r\n");
	header("Cache-Control:no-cache\r\n");
	header("Expires:0\r\n");

	//输出特定类型的图片格式，优先级为 gif -> jpg ->png
	if(function_exists("imagejpeg"))
	{
		header("content-type:image/jpeg\r\n");
		imagejpeg($im);
	}
	else
	{
		header("content-type:image/png\r\n");
		imagepng($im);
	}
	ImageDestroy($im);
	exit();
}
else
{
	//不支持GD，只输出字母 ABCD
	$_SESSION['dd_ckstr'] = "abcd";
	$_SESSION['dd_ckstr_last'] = '';
	header("content-type:image/jpeg\r\n");
	header("Pragma:no-cache\r\n");
	header("Cache-Control:no-cache\r\n");
	header("Expires:0\r\n");
	$fp = fopen("data/vdcode.jpg","r");
	echo fread($fp,filesize("data/vdcode.jpg"));
	fclose($fp);
	exit();
}
?>