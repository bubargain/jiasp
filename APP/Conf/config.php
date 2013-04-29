<?php
return array(	
	'DEFAULT_MODULE'     => 'Index', //默认模块
    'URL_MODEL'          => '2', //URL模式
    'SESSION_AUTO_START' => true, //是否开启session
	 'DB_TYPE'   => 'mysql', // 数据库类型
        'DB_HOST'   => 'localhost', // 服务器地址
        'DB_NAME'   => 'jiasp', // 数据库名
        'DB_USER'   => 'root', // 用户名
        'DB_PWD'    => 'bubargain2012', // 密码
        'DB_PORT'   =>  3306, // 端口
        'DB_PREFIX' => 'jiasp_', // 数据库表前缀 
		'VAR_URL_PARAMS' => '_URL_',
		'SAE_OR_NOT' =>'true',  //local test enviroment
		'WEBSITE_ADD' => 'http://www.jiasp.com/',  //website address
		'PIC_SERVER' => 'http://121.199.29.18/',  // picture sever address
		'UPLOAD_ADD'  => './Public/Uploads/',
		'TMPL_PARSE_STRING'  =>array(
				 //'__PUBLIC__' => '/jiasp2/Public', // 更改默认的/Public 替换规则
				 '__JS__' => '/Public/JS/', // 增加新的JS类库路径替换规则
				 '__UPLOAD__' => '/Uploads', // 增加新的上传路径替换规则
			 ),
	//'配置项'=>'配置值'
);
?>