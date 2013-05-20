<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>hi,there! </title>
</head>
<body>
    <div>Lucky for you!</div>
    <?php echo $this->_var['data']; ?>
    <?php

        echo count($data);
        for($i=0; $i<count($data);$i++)
        {
            echo "!";
            echo "<p>$data[$i].pic</p>";
        }
       ?>
</body>
</html>