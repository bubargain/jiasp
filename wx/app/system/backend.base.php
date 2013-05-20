<?php

require_once(ROOT_PATH . '/app/system/app.base.php');
//后台管理系统基类
class BackendApp extends BaseApp
{
    function __construct()
    {
        $this->BackendApp();
    }
	
    function BackendApp()
    {
		parent::__construct();
		//先加载语言包文件
        Lang::load(lang_file('common'));
		if(APATH)
		{
	        Lang::load(lang_file(APATH . "/" . APP));
		}
		else
		{
			Lang::load(lang_file(APP));
		}
		//初始化访问者
		$this->_init_visitor();
		
		//如果未登录，首先要跳转到登录页
        if(!$this->visitor->has_login)
        {
            $this->login();
            exit;
        }
		
		//如果不是ajax调用
		if(!strpos(ACT,"ajax_"))
		{
			$this->InitMenu();		//非Ajax调用可以执行此操作
		}
    }
	
	//初始化菜单选择的参数，根据C和A进行设置
	function InitMenu()
	{
		/*
		$this->menu_app_act="index.php?c=";
		if(APATH)
		{
			$this->menu_app_act.=APATH . "_";
		}
		$this->menu_app_act.=APP;
		if(ACT && ACT!="default")
		{
			$this->menu_app_act.="&a=" . ACT;
		}
		
		$priv_actions_mod=M("sys/priv_actions");
		$this->menu_data=$priv_actions_mod->get_menu_data($this->menu_app_act);
		if($this->menu_data)
		{
			$this->menu_top_sel_id=$this->menu_data["collect_id"];
			$this->menu_top=$priv_actions_mod->get_top_collect($this->visitor->get("user_id"));
			$this->menu_left=$this->menu_top_sel_id?$priv_actions_mod->get_menu($this->visitor->get("user_id"),$this->menu_top_sel_id):array();
			$this->menu_left_sel_id=$this->menu_data["action_id"];
			
			$this->assign("collect_id",$cid);
			$this->assign("menu_id",$menu_id);
			$this->assign('top_menu', $top_menu);
			$this->assign('menu', $menu);
		}
		*/

		$menu_app_act="index.php?c=";
		if(APATH)
		{
			$menu_app_act.=APATH . "_";
		}
		$menu_app_act.=APP;
		if(ACT && ACT!="default")
		{
			$menu_app_act.="&a=" . ACT;
		}
		
		$priv_actions_mod=M("sys/priv_actions");
		$menu_data=$priv_actions_mod->get_menu_data($this->menu_app_act);
		if($menu_data)
		{
			$menu_top_sel_id=$menu_data["collect_id"];
			$menu_top=$priv_actions_mod->get_top_collect($this->visitor->get("user_id"));
			$this->assign('top_menu', $menu_top);
			$this->assign('menu_top_sel_id',$menu_top_sel_id);
			
			L("json");
			$json=new JSON;
			
			$script_data = "<script type='text/javascript'>";
			$script_data.="var menu_data = ";
			if($menu_top)
			{
				$script_data.=$json->encode($menu_top);
			}
			else
			{
				$script_data.="''";
			}
			$script_data.=";";
			$script_data.="</script>";
			$this->assign("menu_script",$script_data);
		}
	}
	
	//获取顶级菜单的id编号
	function GetTopMenuId()
	{
		return $this->menu_top_sel_id;
	}
	
	//获取子级菜单的id编号
	function GetLeftMenuId()
	{
		return $this->menu_left_sel_id;
	}
	
    function login()
    {
        if ($this->visitor->has_login)
        {
            $this->show_warning('has_login');
            return;
        }
        if (!IS_POST)
        {
            if (Conf::get('captcha_status.backend'))
            {
                $this->assign('captcha', 1);
            }
            $this->display('login.html');
        }
        else
        {
            if (Conf::get('captcha_status.backend') && base64_decode($_SESSION['captcha']) != strtolower($_POST['captcha']))
            {
                $this->show_warning('captcha_faild');
                return;
            }
            $user_name = trim($_POST['user_name']);
            $password  = $_POST['password'];

            $ms =& ms();
            $user_id = $ms->user->auth($user_name, $password);
            if (!$user_id)
            {
                //未通过验证，提示错误信息
                $this->show_warning($ms->user->get_error());

                return;
            }

            //通过验证，执行登陆操作
            if (!$this->_do_login($user_id))
            {
                return;
            }

            $this->show_message('login_successed',
                'go_to_admin', 'index.php');
        }
    }
	
    /**
     * 执行登陆操作
     *
     * @param int $user_id
     * @return bool
     */
    function _do_login($user_id)
    {
        $mod_user = M('sys/member', true, true);
		
		//1，验证用户是否管理员
		$sQuery="select a.user_id,a.group_id,b.username,c.nickname,c.level,c.signature,c.area_id,d.is_sigstatus,d.is_showemail,d.is_invisible,
					e.ip_last,e.time_last_login,e.time_reg from sys_priv_admin as a 
					inner join sys_member as b on a.user_id=b.user_id
					left join sys_member_info as c on c.user_id=b.user_id
					left join sys_member_setup as d on d.user_id=b.user_id
					left join sys_member_track as e on e.user_id=b.user_id
					where a.user_id=" . $user_id;

		$user_info=$mod_user->getRow($sQuery);

        if (!$user_info)
        {
            $this->show_warning('not_admin');
            return false;
        }
		
        //2 分派身份
        $this->visitor->assign(array(
            'user_id'       => $user_info['user_id'],
            'group_id'      => $user_info['group_id'],
            'username'      => $user_info['username'],
            'nickname'      => $user_info['nickname'],
            'level'         => $user_info['level'],
            'signature'     => $user_info['signature'],
            'area_id'       => $user_info['area_id'],
            'is_sigstatus'  => $user_info['is_sigstatus'],
            'is_showemail'  => $user_info['is_showemail'],
            'is_invisible'  => $user_info['is_invisible'],
            'ip_last'       => $user_info['ip_last'],
            'time_last_login' => $user_info['time_last_login'],
            'time_reg'      => $user_info['time_reg']
        ));

        //3 更新登录信息
		$time = gmtime();
		$ip=GetClientIP();
		$sQuery="update sys_member_track set time_last_login=" . $time . ",ip_last='" . $ip . "',count_login=count_login+1 where user_id=" . $user_id;
		$mod_user->db->query($sQuery);
        return true;
    }

    function logout()
    {
		/*
        parent::logout();
        $this->show_message('logout_successed',
            'go_to_admin', 'index.php');
		*/
    }
	
    function _init_visitor()
    {
        $this->visitor =& env('visitor', new AdminVisitor());
    }
	
    /**
     *    初始化Session
     *
     *    @param    none
     *    @return    void
     */
    function _init_session()
    {
        L('session');
        $db = dbMysqlConnection::getMaster();
        $this->_session = new SessionProcessor($db, '`ecm_sessions`', '`ecm_sessions_data`', 'YMALL_ID');
        define('SESS_ID', $this->_session->get_session_id());
		//添加购物车相关表绑定到session表中，用于过时清除
		$this->_session->add_related_table('`ecm_cart`', 'cart', 'session_id', 'user_id=0');
        $this->_session->my_session_start();
		env('session', $this->_session);
    }
	
    /* 清除缓存 */
    function _clear_cache()
    {
        $cache_server =& cache_server();
        $cache_server->clear();
    }	
	
}

/**
 *    后台访问者
 *
 *    @author    Garbin
 *    @usage    none
 */
class AdminVisitor extends BaseVisitor
{
    var $_info_key = 'admin_info';
    /**
     *    获取用户详细信息
     *
     *    @author    Garbin
     *    @param    none
     *    @return    void
     */
    function _get_detail()
    {
		$mod_user = M('sys/member',true, true);
		
		$sQuery="select a.user_id,a.group_id,b.username,c.nickname,c.level,c.signature,c.area_id,d.is_sigstatus,d.is_showemail,d.is_invisible,
					e.ip_last,e.time_last_login,e.time_reg from sys_priv_admin as a 
					inner join sys_member as b on a.user_id=b.user_id
					left join sys_member_info as c on c.user_id=b.user_id
					left join sys_member_setup as d on d.user_id=b.user_id
					left join sys_member_track as e on e.user_id=b.user_id
					where a.user_id=" . $this->info['user_id'];
		$detail=$mod_user->getRow($sQuery);
        unset($detail['user_id'], $detail['username'], $detail['time_reg'], $detail['time_last_login'], $detail['ip_last']);
        return $detail;
    }
}


/* 实现消息基础类接口 */
class MessageBase extends BackendApp {};

/* 实现模块基础类接口 */
class BaseModule  extends BackendApp {};

/* 消息处理器 */
require(ROOT_PATH . '/app/system/message.base.php');

?>