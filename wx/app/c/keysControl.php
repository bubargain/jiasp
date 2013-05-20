<?php
class keysControl extends FrontendApp
{
	function defaultAction()
	{
        $keysS = M("weixinkeys",false);
        $sql = "select * from weixinkeys where 1 order by id desc limit 10";
        $list = $keysS->getRows($sql);
        $this->assign("list",$list);
        $this->display("keys.index.html");
	}

    function saveAction() {
        if($_POST['keys']) {
            $keys = $pre = '';
            foreach($_POST['keys'] as $key) {
                if(!$key)
                    continue;
                $keys .= $pre . addslashes($key);
                $pre = ',';
            }
            if($keys) {
                $keysM = M("weixinkeys",false,true);
                $keysM->add(array('`keys`'=>$keys, '`ctime`'=>time()));
            }

        }
        header('location:index.php?c=keys');
    }

    function searchAction() {
        $keys = explode(',', urldecode($_GET['keys']));
        $list = array();
        $textS = M("text",false);
        foreach($keys as $key) {
            $params = array('focus'=>2,'title'=>$key);
            $list[$key] = $textS->getList($params, 'date_str desc ',  '0, 3');

        }
        $this->assign("list",$list);
        $this->display("keys.search.html");

    }

    function ajaxRefreshAction() {
        $id = $_GET['id'];
        if($id) {
            $date_str = isset($_GET['date']) ? strtotime($_GET['date']) : time();

            $textM = M("text",false,true);
            $conditions = 'id='.intval($id);
            $info = array('date_str'=>$date_str);

            return $textM->edit($conditions, $info);
        }
        return true;
    }
}