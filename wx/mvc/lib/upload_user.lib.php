<?php



/*
上传图片
$fileElementName 上传控件FILE名称
$dir 指定的存储路径
$new_name 指定的新文件名
$display_name 界面上显示别名
$label 标签集(阳光,时尚,新潮)
$label_info 标签集带权重的详细描述(阳光100,时尚50,新潮30)
$description 描述
$score 需要多少积分才能下载
*/
function UploadUserFile($fileElementName,$visitor,$dir="",$new_name="",$display_name="",$label="",$label_info="",$description="",$score=0)
{
	$ret=array(
		"status"=>"",
		"msg"=>"",
		"file_name"=>"",		//文件名
		"file_ext"=>"",			//文件类型
		"file_size"=>"",		//文件尺寸
		"file_path"=>"",		//文件相对路径
		"file_path_abs"=>"",	//文件绝对路径（物理存储路径）
	);

	if(empty($_FILES[$fileElementName])) {
		return $ret;
	}

	if(!empty($_FILES[$fileElementName]['error']))
	{
		$ret["status"]="error";
		switch($_FILES[$fileElementName]['error'])
		{
			case '1':
				$ret["msg"] = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
				break;
			case '2':
				$ret["msg"] = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
				break;
			case '3':
				$ret["msg"] = 'The uploaded file was only partially uploaded';
				break;
			case '4':
				$ret["status"] = "";
				$ret["msg"] = 'No file was uploaded.';
				break;
			case '6':
				$ret["msg"] = 'Missing a temporary folder';
				break;
			case '7':
				$ret["msg"] = 'Failed to write file to disk';
				break;
			case '8':
				$ret["msg"] = 'File upload stopped by extension';
				break;
			case '999':
			default:
				$ret["msg"] = 'No error code avaiable';
		}
		return $ret;
	}
	elseif(empty($_FILES[$fileElementName]['tmp_name']) || $_FILES[$fileElementName]['tmp_name'] == 'none')
	{
		$ret["status"]="error";
		$ret["msg"] = 'No file was uploaded..';
		return $ret;
	}
	else 
	{
		//上传程序：
		//1，用户的上传表usr_upload
		//2，相关板块的上传数据处理与填写
		
		$file_ext=GetFileTypeName($_FILES[$fileElementName]['name']);
		$file_type=$_FILES[$fileElementName]['type'];
		$file_size=@filesize($_FILES[$fileElementName]['tmp_name']);

		if(!$dir)
		{
			$dir="data/files/" . date("Ymd",time());
		}
		if(!file_exists(ROOT_PATH . "/" . $dir))
		{
			makeDir(ROOT_PATH . "/" . $dir);
		}
		
		if(!$new_name)
		{
			$new_name=GetLsh() . "." . $file_ext;
		}

		$file_path = $dir . "/" . $new_name;			//文件路径
		$file_path_abs = ROOT_PATH . "/" . $file_path;		//文件绝对路径
		
		file_exists($file_path_abs) && @unlink($file_path_abs);
		
		if(@copy($_FILES[$fileElementName]['tmp_name'], $file_path_abs) || @move_uploaded_file($_FILES[$fileElementName]['tmp_name'], $file_path_abs)) 
		{
			@unlink($_FILES[$fileElementName]['tmp_name']);
			
			$ret["status"]="ok";						//状态
			$ret["file_name"]=$new_name;				//文件名
			$ret["display_name"]=$display_name?$display_name:$ret["file_name"];			//显示名称
			$ret["file_ext"]=$file_ext;					//文件类型
			$ret["file_size"]=$file_size;				//文件尺寸
			$ret["file_path"]=$file_path;				//文件相对路径
			$ret["file_path_abs"]=$file_path_abs;		//文件绝对路径（物理存储路径）
			$ret["file_id"]=0;							//上传的文件id编号
			
			//生成上传记录
			$user_id=0;
			if($visitor)
			{
				$user_id=$visitor->get('user_id');
			}
			$aryData=array(
				"user_id"=>$user_id,												//用户id编号 int
				"file_name"=>$ret["file_name"],										//上传资源的文件名称(实际文件名) varchar
				"disp_filename"=>$display_name?$display_name:$ret["file_name"],		//显示的文件名 varchar
				"file_ext"=>$ret["file_ext"],										//上传资源的扩展名 varchar
				"file_time"=>time(),												//文件时间 bigint
				"mimetype"=>$file_type,												//文件类型 varchar
				"file_path"=>$file_path,											//上传资源的url地址 varchar
				"file_size"=>$file_size,											//文件尺寸 int
				"label"=>$label,													//标签集名称 varchar
				"label_info"=>$label_info,											//标签集的详细(标签名/权重的结构) text
				"description"=>$description,										//上传资源的描述 text
				"add_time"=>time(),													//上传时间 int
				"is_allow"=>0,														//是否通过审核 int
				"allow_user_id"=>0,													//审核的用户id编号 int
				"allow_time"=>0,													//审核通过的时间 int
				"is_delete"=>0,														//是否被删除 int
				"delete_desc"=>"",													//删除原因 text
				"score"=>$score,													//下载需要的分值 int
				"count_download"=>0,												//下载次数 int
				"out_type"=>"",														//外部资源类型
				"out_id"=>0);														//外部资源id编号
				
			$uploadM=M1("usr/upload");
			$ret["file_id"]=$uploadM->add($aryData);
		}
		else
		{
			@unlink($_FILES['Filedata']['tmp_name']);
			$ret["status"]="error";
			$ret["msg"] = '抱歉图片上传失败!';				
		}
		return $ret;
	}
	return $ret;
}

?>