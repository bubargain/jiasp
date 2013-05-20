<?php
/**
 * tools for image to local
 * hask 单张图都抓取失败会导致
 */
define('ROOT_PATH', __DIR__);
include ROOT_PATH . '/mvc/lib/img.lib.php';
include ROOT_PATH . '/mvc/lib/Snoopy.lib.php';
/* 取得内容信息 */
$cid = intval($_GET['cid']);
$lnk = mysql_connect($_SERVER['SDB3_SERVER_WEIXIN'], $_SERVER['SDB3_USER_WEIXIN'], $_SERVER['SDB3_PASS_WEIXIN'])
    or die ('Not connected : ' . mysql_error());

mysql_select_db($_SERVER['SDB3_DB_WEIXIN'], $lnk) or die ('Can\'t use foo : ' . mysql_error());
mysql_set_charset('utf8',$lnk);

$result = mysql_query("SELECT id,`focus`,`neirong` FROM `text` WHERE id >= $cid and `focus`<>2 order by id asc limit 2");
$row = mysql_fetch_array($result, MYSQL_ASSOC);
$next_row = mysql_fetch_array($result, MYSQL_ASSOC);
mysql_free_result($result);
mysql_close($lnk);

if (!$row)
    die('执行完成');

/* 取得内容中图片信息 */
$imgArr = array();
$pat = '/<img.+?src=["|\'](http:\/\/[^"\']*)?["|\']/';
preg_match_all($pat, $row['neirong'], $imgArr);
if(empty($imgArr))
    go_next($next_row);

/* 处理图片本地化 */
$imgObj = new imageProcessor();
$base_img_url = 'http://mp1.yokacdn.com/data/files/upload';
$base_img_path = realpath(ROOT_PATH . '/../../' . 'data/files/upload');
$path = $base_img_path . '/' . ($cid % 200) . '/';

$snoopy = new Snoopy();
$snoopy->agent = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:21.0) Gecko/20100101 Firefox/21.0 FirePHP/0.7.2"; //伪装浏览器
$snoopy->accept = 'image/png,image/*;q=0.8,*/*;q=0.5'; //伪装来源页地址 http_referer

while($img = array_pop($imgArr[1])) {
    if ( strrpos($img, 'mp1.yokacdn.com') || strrpos($img, 'mp1.yokacdn.com') ) {
        $row['pic'] = $img;
        continue;
    }

    $tmp = '/tmp/' . md5($img);
    if(!img2local($snoopy, $img, $tmp))
        continue;

    if(!$status = $imgObj->make_thumb($tmp, 480, 0, $path))
        continue;

    $thumb_image = str_replace($base_img_path, '', $status);
    $row['neirong'] = str_replace($img, $base_img_url . $thumb_image, $row['neirong']);

    $row['pic'] = $row['pic'] ? $row['pic'] : $base_img_url . $thumb_image;

    $lnk = mysql_connect($_SERVER['MDB_SERVER_WEIXIN'], $_SERVER['MDB_USER_WEIXIN'], $_SERVER['MDB_PASS_WEIXIN'])
    or die ('Not connected : ' . mysql_error());

    mysql_select_db($_SERVER['MDB_DB_WEIXIN'], $lnk) or die ('Can\'t use foo : ' . mysql_error());
    mysql_set_charset('utf8',$lnk);

    $sql = "update text set pic='".$row['pic']."', neirong ='". addslashes($row['neirong']) ."' where id =".$cid;
    $result = mysql_query($sql, $lnk);
    mysql_free_result($result);
    mysql_close($lnk);

    unlink($tmp);
    break;
}

$imgArr[1] ? go_next($row) : go_next($next_row);


function go_next($row) {
    $start = isset($_GET['start']) ? $_GET['start'] : $_GET['cid'];
    $step = isset($_GET['step']) ? $_GET['step'] : 1000;
    $end = $start + $step;

    if($row['id']>($start + $step) || $row['id']<$start) {
        die("[$start , $end] id={$row['id']} 执行ok");
    }

    $url = "?start=$start&step=$step&cid={$row['id']}";
    if($_GET['debuger'] == 'wanjl') {
        echo "<a href=\"$url&debuger=wanjl\">[$start : $end] =: {$row['id']} </a>";
    }
    else {
        echo '<script>document.location.href="' . $url . '";</script>';
    }
    exit();
}

/**
 * @param $snoopy
 * @param $url
 * @param $file
 */
function img2local($snoopy, $url, $file) {
    $info = parse_url($url);
    $snoopy->host = $info['host']; //伪装来源页地址 http_referer
    $snoopy->referer = host2referer($snoopy->host);

    $snoopy->rawheaders["X_FORWARDED_FOR"] = "119.75.217." . rand(3, 250); //伪装ip  119.75.217.56

    $snoopy->fetch($url); //获取所有内容
    if($snoopy->status != 200)
        return false;

    return file_put_contents($file, $snoopy->results);
}

/**
 * @param $host
 * @return string
 * @desc host => referer
 */
function host2referer($host) {
    $array = array(
        //haibao
        'cdn2.hbimg.cn'=>'http://www.haibao.com/',
        'cdn4.hbimg.cn'=>'http://www.haibao.com/',
        'cdn6.hbimg.cn'=>'http://www.haibao.com/',
    );
    return isset($array[$host]) ? $array[$host] : 'http://www.baidu.com';
}

