<?php

//用户管理辅助函数

//设置用户的模板信息
function SetUserInfo($template)
{
	$bLogin=isLogined();
	if($bLogin)
	{
		$template->assign("user",$_SESSION["user"]);
	}
	return $bLogin;
}

//用户是否已登录
function isLogined()
{
	//如果用户未登录，就转移到登录页面上去
	//先判断用户是否已登录？如果未登录的，则转到登录页面
	@session_start();
	$bLogin=false;
	if(isset($_SESSION["user"]))			//用户的id编号
	{
		if($_SESSION["user"]!="")
		{
			$bLogin=true;
		}
	}
	return $bLogin;
}

/*
//用户登录记录
function member_log_login($expired)
{
	if($expired==0)
	{
		$expired=3600;				//默认过期时间为1小时，即用户在1小时内如果无活动，则自动取消登录状态	
	}
	
	LoadModel("member_login");							//载入数据表操作模块
	$member_loginM=new member_loginModel("member_login","id");
	
	$time=time();
	
	$aryData=array(
                "userid"=>$_SESSION["user_uid"],						//用户id编号 int
                "user_session"=>md5($_SESSION["user_id"] . $time),		//用户登录会话编号 varchar
                "loginip"=>GetClientIP(),								//登录的ip地址 varchar
                "time_login"=>$time,									//登录的时间 bigint
                "time_expired"=>$time + $expired,						//过期时间 bigint
                "is_expired"=>0,										//是否已过期？ bigint
                "time_exit"=>0);										//退出时间 bigint

	$id_n=$member_loginM->AddByArray($aryData,true);			//AddByArray($data,$retid=true,$debug=false)
		
	if($id_n>0)
	{
		//以后要增加代码，修改用户表中的用户状态为在线状态，方法在header中增加一个计时函数，每个10分钟向服务器发一个心跳信息
		return true;
	}
	return false;
}
*/

?>