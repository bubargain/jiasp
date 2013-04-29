<?php
return array(	
	 'DB_TYPE'   => 'mysql', // 数据库类型
        'DB_HOST'   => SAE_MYSQL_HOST_M, // 服务器地址
        'DB_NAME'   => SAE_MYSQL_DB, // 数据库名
        'DB_USER'   => SAE_MYSQL_USER, // 用户名
        'DB_PWD'    => SAE_MYSQL_PASS, // 密码
        'DB_PORT'   =>  SAE_MYSQL_PORT, // 端口
        'DB_PREFIX' => 'jiasp_', // 数据库表前缀 
		'VAR_URL_PARAMS' => '_URL_',
		'SAE_OR_NOT' =>'true',  //SINA SAE ENVIROMENT
		'WEBSITE_ADD' => 'http://jiasp.sinaapp.com/',  //website address
		'PIC_SERVER' => 'http://jiasp-public.stor.sinaapp.com/',
		'UPLOAD_ADD'  => './public/uploads',
		'TMPL_PARSE_STRING'  =>array(
				
				 '__JS__' => '/Public/JS/', // 增加新的JS类库路径替换规则
				 '__UPLOAD__' => '/Uploads', // 增加新的上传路径替换规则
			 ),
	//'配置项'=>'配置值'
);
?>