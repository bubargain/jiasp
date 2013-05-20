<?php

class CountService
{
    private $day = null;

    public function __construct($day) {
        $this->userLogS = DBS("text");
        $this->userS = DBS("text");		//获取Slave数据库Model
        $this->day = $day;
    }

    public function dayActiveUsers() {
        $day = $this->getDayTime();
        $sql = "select count(*) from (select 1 from weixinuserlog where addtime>={$day['start']} and addtime<{$day['end']} and `type`='text' group by user_id) as tt ";
        return $this->userS->getOne($sql);
    }

    public function dayActiveTimes() {
        $day = $this->getDayTime();
        $sql = "select count(*) from weixinuserlog where addtime>={$day['start']} and addtime<{$day['end']} and `type`='text'";
        return $this->userS->getOne($sql);
    }

	public function daySubscribeTimes() {
        $day = $this->getDayTime();
		$sql = "select count(*) from weixinuserlog where addtime>={$day['start']} and addtime<{$day['end']} and `event`='subscribe'";
        return $this->userS->getOne($sql);
    }

    public function dayUnsubscribeTimes() {
        $day = $this->getDayTime();
		$sql = "select count(*) from weixinuserlog where addtime>={$day['start']} and addtime<{$day['end']} and `event`='unsubscribe'";
        return $this->userS->getOne($sql);
    }
	
	public function getByDay() {
		$day = $this->getDayTime();
        $sql = "select * from weixinuserlog where addtime>={$day['start']} and addtime<{$day['end']} and `type`='text'";
        return $this->userS->getRows($sql);
	}

    public function getDayTime() {
        $day_str = date('Y-m-d', $this->day);
        $day = explode('-', $day_str);
        $start = mktime(0,0,0,$day[1],$day[2],$day[0]);
        $end = mktime(0,0,0,$day[1],($day[2] + 1),$day[0]);
        return array('start'=>$start, 'end'=>$end);
    }

}