<?php 

//admin_newsControl类定义

class admin_ruleControl extends FrontendApp
{
	public $ruleM;
	
	function __construct()
    {
		$this->admin_ruleControl();
	}
	
	function admin_ruleControl()
	{
		parent::__construct();
		$this->ruleM=M("admin/rule");
	}
	
	function defaultAction()
	{
		if(!IS_POST)
		{
			$type=G2Int("type");			
			$sQuery="select * from admin_rule where type=" . $type;
			$data=$this->ruleM->getRow($sQuery);
			if(!$data)
			{
				$data=array(
					"type"=>$type,
					"style"=>1,
					"img_show"=>1,
				);
			}
			else
			{
				$data["img_show"]=1;
			}
			
			if(($type>1 && $type<=4) || $data["style"]==1)
			{
				$data["img_show"]=0;				
			}
			
			$this->assign("data",$data);
			$this->display("admin/rule.index.html");
		}
		else
		{
			echo "该功能暂时先屏蔽！";
			return;
			
			$data=array(
				"type"=>P2Int("combo_type"),
				"style"=>P2Int("combo_style"),
				"title"=>ToText(P("e_title")),
				"description"=>ToText(P("e_description")),
				"img_url"=>P("e_img_url"),
				"link"=>P("e_link"),
				"usable"=>P("ck_usable")=="on"?1:0,
			);
			
			if($data["type"]==0)
			{
					$this->show_message('请选择类型!','back_list','index.php?c=admin_rule');
					exit;				
			}
			
			if($data["style"]==1)
			{
				//描述不能为空
				if(!$data["description"])
				{
					$this->show_message('描述不能为空!','back_list','index.php?c=admin_rule');
					exit;
				}
			}
			else if($data["style"]==2)
			{
				//标题，图片，链接不能为空
				
				if(!$data["title"])
				{
					$this->show_message('标题不能为空!','back_list','index.php?c=admin_rule');
					exit;
				}		
				
				if(!$data["img_url"])
				{
					$this->show_message('图片地址不能为空!','back_list','index.php?c=admin_rule');
					exit;
				}

				if(!$data["link"])
				{
					$this->show_message('链接地址不能为空!','back_list','index.php?c=admin_rule');
					exit;
				}

			}
			
			$sQuery="select id from admin_rule where type=" . $data["type"];
			$nId=(int)$this->ruleM->getOne($sQuery);
			if($nId>0)
			{
				$where="id=" . $nId;
				$this->ruleM->edit($where, $data);
			}
			else
			{
				$this->ruleM->add($data);
			}
			$this->assign("data",$data);
			
			$this->show_message('保存成功!','back_list','index.php?c=admin_rule&type=' . $data["type"]);
		}
	}
		

}

?>