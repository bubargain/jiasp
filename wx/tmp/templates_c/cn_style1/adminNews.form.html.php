<!DOCTYPE html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width" />
<title>资讯添加-资讯管理</title>

    <script type="text/javascript" charset="utf-8" src="mvc/ueditor/editor_config.js"></script>
    <script type="text/javascript" charset="utf-8" src="mvc/ueditor/editor_all_min.js"></script>
</head>

<body>
<form method="post" action="index.php?c=adminNews&a=<?php if ($this->_var['info']['id']): ?>editNews&id=<?php echo $this->_var['info']['id']; ?><?php else: ?>addNews<?php endif; ?>" onsubmit="return fn_submit()">
    <div>
        <ul>
            <li>标题：<input type="text" name="title" value="<?php echo $this->_var['info']['title']; ?>"> </li>
            <li>
			<img id="pic_box" src="<?php if ($this->_var['info']['pic']): ?><?php echo $this->_var['info']['pic']; ?><?php endif; ?>">
			</li>
            <li style="display:none">来源：<input type="hidden" name="from" value=""> </li>
            <li style="display:none">类型：<input type="hidden" name="focus" value="2"> </li>
			<li style="display:none">概要：<input type="hidden" name="description" value=""></li>
            <li>日期：<input type="text" name="date_str" value="<?php echo $this->_var['info']['date_str']; ?>"> </li>            
            <li>信息：<script  id="editor" type="text/plain"><?php echo $this->_var['info']['neirong']; ?></script><input type="hidden" id="neirong"  name="neirong"> </li>
			<li><input type="submit" value="保存"></li>		
		</ul>		
    </div>	
</form>
</div>
<script type="text/javascript" src="http://mj1.yokacdn.com/includes/libraries/javascript/jquery-1.7.1.min.js" charset="utf-8"></script>
<script type="text/javascript">
    //实例化编辑器
    var ue = UE.getEditor('editor');

    function fn_submit() {
        $("#neirong").val(UE.getEditor('editor').getContent());
        return true;
    }
</script>
</body>
</html>