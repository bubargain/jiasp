<?php 
date_default_timezone_set("Asia/Shanghai");

echo date("Y-m-d",1343293786);

$str = '{id:1,c:2}';
echo preg_replace('/([a-zA-Z]+)/', '"\1"', $str);

?>