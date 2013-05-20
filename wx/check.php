<?php
/**
 * tools for image to local
 * hask 单张图都抓取失败会导致
 */
define('ROOT_PATH', __DIR__);
include ROOT_PATH . '/mvc/lib/img.lib.php';
include ROOT_PATH . '/mvc/lib/Snoopy.lib.php';
/* 取得内容信息 */
$start = isset($_GET['start']) ? $_GET['start'] : 0;
$step = isset($_GET['step']) ? $_GET['step'] : 1000;

$lnk = mysql_connect($_SERVER['SDB3_SERVER_WEIXIN'], $_SERVER['SDB3_USER_WEIXIN'], $_SERVER['SDB3_PASS_WEIXIN'])
    or die ('Not connected : ' . mysql_error());

mysql_select_db($_SERVER['SDB3_DB_WEIXIN'], $lnk) or die ('Can\'t use foo : ' . mysql_error());
mysql_set_charset('utf8',$lnk);

$end = $start + $step ;
$result = mysql_query("SELECT id,`focus`,`neirong` FROM `text` WHERE id >= $start and id<$end");
$pat = '/<img.+?src=["|\'](http:\/\/[^"\']*)?["|\']/';
if(!$result) {
	die('执行完成');
}

while($row = mysql_fetch_array($result, MYSQL_ASSOC)) {	
	preg_match_all($pat, $row['neirong'], $imgArr);
	$num = count($imgArr[1]);
	if($num<2 || $num >20) {
		$ids[] = $row['id'];
	}
}

mysql_free_result($result);
mysql_close($lnk);

if($ids) {
	$lnk = mysql_connect($_SERVER['MDB_SERVER_WEIXIN'], $_SERVER['MDB_USER_WEIXIN'], $_SERVER['MDB_PASS_WEIXIN'])
    or die ('Not connected : ' . mysql_error());

    mysql_select_db($_SERVER['MDB_DB_WEIXIN'], $lnk) or die ('Can\'t use foo : ' . mysql_error());
    mysql_set_charset('utf8',$lnk);

    $sql = "delete from text where id in( ". implode(',', $ids ) . ") ";
	die("ok");
	/*
    $result = mysql_query($sql, $lnk);
    mysql_free_result($result);
    mysql_close($lnk);
	*/
}
$start += $step;
go_next($start, $step);

function go_next($start, $step) {
    
    $url = "?start=$start&step=$step";
    if($_GET['debuger'] == 'wanjl') {
        echo "<a href=\"$url&debuger=wanjl\">[$start : $end] =: go </a>";
    }
    else {
        echo '<script>document.location.href="' . $url . '";</script>';
    }
    exit();
}
