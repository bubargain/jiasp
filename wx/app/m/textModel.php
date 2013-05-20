<?php
//textModel类定义

class textModel extends dbModel
{
	public $_prefix = '';	
	public $table  = 'text';
	public $prikey = 'id';
	public $_name  = 'title';

    private function whereParams($params) {
        $sql = " 1";
        if($params['from'])
            $sql .= " and `from`='{$params['from']}'";

        if(isset($params['focus']))
            $sql .= " and `focus`='{$params['focus']}'";

        if($params['title'])
            $sql .= " and `title` like '%{$params['title']}%'";

        if($params['date_str']) {
            if($params['date_str']['start'])
                $sql .= " and `date_str` > {$params['date_str']['start']}";

            if($params['date_str']['end'])
                $sql .= " and `date_str` > {$params['date_str']['end']}";
        }
        return $sql;
    }

    public function getList($params = array(), $sort = 'id desc ', $limit = '0, 10') {
        $where = self::whereParams($params);
        $sql = "select * from text where " . $where . ' order by ' . $sort . ' limit ' . $limit;
        //$this->db = dbMysqlManager::getMaster();
        return $this->db->getAll($sql);
    }

    public function getListCnt($params = array()) {
        $where = self::whereParams($params);
        $sql = "select count(*) from text where " . $where;
        //$this->db = dbMysqlManager::getMaster();
        return $this->db->getOne($sql);
    }

    function add($data) {
        //$this->db = dbMysqlConnection::getMaster();

        return parent::add($data);
    }

    function edit($where, $data) {
        //$this->db = dbMysqlConnection::getMaster();
        return parent::edit($where, $data);
    }

    function delete($where) {
        //$this->db = dbMysqlConnection::getMaster();
        $sql = "delete from text where " . $where;
        $this->db->query($sql);
    }
}

?>