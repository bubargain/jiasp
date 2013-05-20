<?php 

class adminNewsControl extends FrontendApp
{
    function defaultAction()
	{
        $params = array();
        /* 处理搜索信息 */
        $params['focus'] = isset($_GET['focus']) ? intval($_GET['focus']) : null;
        $params['from'] = isset($_GET['from']) ? trim($_GET['from']) : null;
        $params['title'] = isset($_GET['title']) ? trim($_GET['title']) : null;
        $params['date_str'][] = isset($_GET['start']) ? strtotime($_GET['start']) : null;
        if(isset($_GET['start']) || isset($_GET['end'])) {
            $params['date_str']['start'] = isset($_GET['start']) ? strtotime($_GET['start']) : null;
            $params['date_str']['end'] = isset($_GET['end']) ? strtotime($_GET['end']) : null;
        }

        $textSlave = M("text",false);
        $total = $textSlave->getListCnt($params);

        /* 处理翻页信息 */
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $url = preg_replace('/([?|&]page=\d+)/', '', $_SERVER['REQUEST_URI']);
        L('page');
        $pageObj = new SubPages($url, 10, $total, $page);
        $sort = isset($_GET['sort']) ? $_GET['sort'] : 'id desc';
        $limit = $pageObj->GetLimit();

        $list = array();
        if($total) {
            $list = $textSlave->getList($params, $sort, $limit);
        }

        /* 页面显示 */
        $this->assign('params', $_GET);
        $this->assign('list', $list);
        $this->assign('pages', $pageObj->GetPageHtml());

        $this->display("adminNews.index.html");
	}

    function addNewsAction() {
        if(IS_POST) {
            $data['`title`'] = addslashes($_POST['title']);
            $data['`from`'] = addslashes($_POST['from']);
            $data['`focus`'] = intval($_POST['focus']);
            $data['`neirong`'] = addslashes($_POST['neirong']);
            $data['`description`'] = addslashes(strip_tags($_POST['description']));
            $data['`date_str`'] = isset($_POST['date_str']) ? strtotime($_POST['date_str']) : 0;
			$data['`hash_key`'] = md5($_POST['title']);

            /* 图片本地化处理 */
            $pat = '/<img.+?src=["|\']([^"\']*)?["|\']/';
            if(preg_match($pat, $_POST['neirong'], $matches)) {
                $data['`pic`'] = $matches[1];
            }
            else {
                $data['`pic`'] = '';
            }

            /* 数据保存 */
            $textMaster = M("text",false,true);
            $textMaster->add($data);

            $this->show_message('保存成功',
                '新闻列表', 'index.php?c=adminNews&focus=2'
            );
        }
        else {
            $info['date_str'] = date('Y/m/d H:i:s');
            $this->assign('info', $info);
            $this->display("adminNews.form.html");
        }
    }

    function editNewsAction() {
        $id = intval($_GET['id']);
        $textMaster = M("text",false,true);
        $sql = "select * from text where id=" . $id;
        $info = $textMaster->getRow($sql);

        if(!$info)
            throw new \Exception('无效的url:' . $id);

        if(IS_POST) {
            $data['`title`'] = addslashes($_POST['title']);
            $data['`from`'] = addslashes($_POST['from']);
            $data['`focus`'] = intval($_POST['focus']);
            $data['`neirong`'] = addslashes($_POST['neirong']);
            $data['`description`'] = addslashes(strip_tags($_POST['description']));
            $data['`date_str`'] = isset($_POST['date_str']) ? strtotime($_POST['date_str']) : 0;

			$data['`hash_key`'] = md5($_POST['title']);

            /* 图片本地化处理 */
            $pat = '/<img.+?src=["|\']([^"\']*)?["|\']/';
            if(preg_match($pat, $_POST['neirong'], $matches)) {
                $data['`pic`'] = $matches[1];
            }
            else {
                $data['`pic`'] = '';
            }

            /* 数据保存 */
            $where = 'id='.$id;
            $textMaster->edit($where, $data);

            $this->show_message('保存成功',
                '新闻列表', 'index.php?c=adminNews&focus=2'
            );
        }
        else {
            $info['date_str'] = ($info['date_str']) ? date('Y/m/d H:i:s', $info['date_str']) : date('Y/m/d H:i:s');
            $this->assign('info', $info);
            $this->display("adminNews.form.html");
        }
    }

    function deleteNewsAction() {
        if(!$_GET['ids'])
            throw new \Exception('无效的url: ids');

        $where = $pre = '';
        foreach($_GET['ids'] as $_id) {
            $where .= $pre . intval($_id);
            $pre = ',';
        }
        if($where) {
            $where = ' id in ('.$where.')';
            $textMaster = M("text",false,true);
            $textMaster->delete($where);
            $this->show_message('删除成功',
                '新闻列表', 'index.php?c=adminNews&focus=2'
            );
        }
        else {
            $this->show_message('删除失败',
                '新闻列表', 'index.php?c=adminNews&focus=2'
            );
        }
    }

	function distinctAction() {
		$textSlave = M("text",false);
		$sql = "select `id`,`hash_key` from `text` order by id desc";
		$list = $textSlave->getRows($sql);
		$all = $del = 0;
		$map = array();

		foreach($list as $row) {
			$all++;
			if(isset($map[$row['hash_key']])) {
				$ids[] = $row[id];
				$del++;
			}
			else {
				$map[$row['hash_key']] = 1;
			}
		}
		
		if($del) {
			$textMaster = M("text",false,true);
			$sql = "delete from `text` where id in(".implode(',', $ids).")";
			$textMaster->query($sql);
		}

		echo "ok.	total : $all, delete: $del";
	}
}

?>