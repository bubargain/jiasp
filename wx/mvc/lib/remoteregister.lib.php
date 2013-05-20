<?php

function remote_register($uid,$nickname,$password,$email,$type)
{
	$url="http://www.travelformore.cn/index.php?c=member&a=remote_register&uid=" . urlencode($uid) . "&nickname=" . urlencode($nickname) . "&password=" . urlencode($password) . "&email=" . urlencode($email) . "&type=" . $type;
	$html=file_get_contents($url);
	return $html;
}

?>