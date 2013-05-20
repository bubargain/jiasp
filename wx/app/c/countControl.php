<?php
define("TOKEN", "ymall");

class countControl extends FrontendApp
{
	function defaultAction()
	{
        $arr = array(
            'day'=>'日统计',
            'week'=>'周统计',
        );

        echo '======<a href="?c=count&a=day">日统计</a>====== <br />';
        echo '======<a href="?c=count&a=week">周统计</a>====== <br />';
		
		echo '======<a href="?c=count&a=load">日关键词导出</a>====== <br />';
        /**
        /*
        $this->assign("data",$arr);
        $this->display("count.index.html");
         * */
	}
	
	function loadAction() {
		Svc("count");
        $time = mktime(0,0,0,date('m'), (date('d') - 1), date('Y'));

        $countSvc = new CountService($time);
		
		$list = $countSvc->getByDay();
		
		ob_start();
		echo '<table border="1"><tr><td>id</td><td>user_id</td><td>keyword</td><td>type</td><td>event</td></tr>';
		foreach($list as $row) {
			echo '<tr><td>'.$row['id'].'</td><td>'.$row['user_id'].'</td><td>'.$row['keyword'].'</td><td>'.$row['type'].'</td><td>'.$row['event'].'</td></tr>';
		}		
		echo '</table>';
		$result_str = ob_get_contents();
		ob_clean();
		
		$this->makeExcel($result_str, date('Y/m/d', $time) . '微信搜索词报表');		
	}
	
	public function makeExcel($string, $title) {
        $result_str  = '<head><meta http-equiv="Content-Type" content="text/html;charset=gb2312"></head>'.$string;
        header("Content-Type:text/plain;charset=utf-8");
        header('Content-Transfer-Encoding: gbk');
        header('Content-Type: application/vnd.ms-excel;');
        header("Content-type: application/x-msexcel");
        header(iconv('UTF-8', 'GBK//IGNORE', 'Content-Disposition: attachment; filename="' . $title . '.xls"'));
        echo iconv('UTF-8', 'GBK//IGNORE', $result_str);
	}

    function dayAction()
    {
        Svc("count");
        $time = mktime(0,0,0,date('m'), (date('d') - 1), date('Y'));

        $countSvc = new CountService($time);

        $data = array();

        $data['activeUser'] = $countSvc->dayActiveUsers();
        $data['activeTimes'] = $countSvc->dayActiveTimes();
        $data['subscribe'] = $countSvc->daySubscribeTimes();
        $data['unsubscribe'] = $countSvc->dayUnsubscribeTimes();

        $data['pre'] = $data['activeUser'] ?  $data['activeTimes'] / $data['activeUser'] : 0;
        $day = $countSvc->getDayTime();
        echo date('Y/m/d H:i:s', $day['start']) . '---' . date('Y/m/d H:i:s', $day['end']) . '<br />';
		echo '新增关注人次 =: ' . $data['subscribe'] . '<br />';
        echo '取消关注人次 =: ' . $data['unsubscribe'] . '<br />';
        echo '活跃用户 =: ' . $data['activeUser'] . '<br />';
        echo '用户输入总数 =: ' . $data['activeTimes'] . '<br />';
        echo '活跃用户每人平均的输入个数 =: ' . $data['pre'] . '<br />';
        
        //.每天，活跃用户总数：今日有任何输入的人总数
        //.每天，用户输入总数（包括任何输入）
        //.每天，活跃用户每人平均的输入个数=3/2
/*
        $this->assign("data",$data);
        $this->display("count.day.html");
*/

    }

    function weekAction() {
        Svc("count");
        $time = mktime(0,0,0,date('m'), (date('d') - 1), date('Y'));
        $countSvc = new CountService($time);

        $data = array();
        /**
         * 1.每天，纵轴：人数[0-20万] 横轴：一个用户总输入个数[0-1000]
         * 2.每天，活跃用户保留率：今日活跃用户，第二天依然活跃的
         */
/*
        $this->assign("data",$data);
        $this->display("count.week.html");
*/
    }

}