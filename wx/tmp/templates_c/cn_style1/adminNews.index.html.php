<!DOCTYPE html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width" />
<title>资讯列表-资讯管理</title>
</head>



<body>
<form method="get"  action="index.php">
    <div>
        <ul>
            <li>关键词：<input type="text" name="title" value="<?php echo $this->_var['params']['title']; ?>">  focus：<input type="text" name="focus" value="<?php echo $this->_var['params']['focus']; ?>"><input type="hidden" name="c" value="adminNews"> <input type="submit" value="检索"></li>
        </ul>
    </div>
</form>
<p><a href="index.php?c=adminNews&a=addNews">添加资讯</a> || <a href="index.php?c=keys">关键词维护</a> || <a href="index.php?c=count">数据统计</a></p>
<div>
    <?php $_from = $this->_var['list']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array'); }; $this->push_vars('', 'item');if (count($_from)):
    foreach ($_from AS $this->_var['item']):
?>
    <ul>
        <li>id:= <?php echo $this->_var['item']['id']; ?>, date_str :=<?php echo $this->_var['item']['date_str']; ?>, title:= <?php echo $this->_var['item']['title']; ?>
            <a href="index.php?c=adminNews&a=deleteNews&ids[]=<?php echo $this->_var['item']['id']; ?>" onclick="return window.confirm('确定删除?')">删除</a> || <a href="index.php?c=adminNews&a=editNews&id=<?php echo $this->_var['item']['id']; ?>" onclick="return window.confirm('are you sure about that?')">修改</a><?php if ($this->_var['item']['focus'] != 2): ?><a href="./down.php?start=<?php echo $this->_var['item']['id']; ?>&step=0&cid=<?php echo $this->_var['item']['id']; ?>" target="_blank">图片本地化</a><?php endif; ?></li>
    </ul>
    <?php endforeach; endif; unset($_from); ?><?php $this->pop_vars();; ?>
</div>
<div><?php echo $this->_var['pages']; ?></div>
</body>
</html>