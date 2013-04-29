<?php
header("Content-Type:text/html; charset=utf-8");
class IndexAction extends Action {
    public function index(){
    	
    	//load page head and foot
    	$this->head = $this->fetch('head'); 
    	$this->foot = $this->fetch('foot');
    	
    	
    	if(isset($_SESSION['user_id']))
    	{
    		
    	}
    	else	
    	{
    		$this->whetherLogin = "<div id=\"wb_login_btn\"></div>";
    	}
    	
    	$this->display();  
    	
    }
    
    public function login()
    {
    	if(!isset($_SESSION['user_id']))
     	{
    		$_SESSION['user_id'] = 1;
    		$_SESSION['user_name'] = 'admin';
     	}
     	$this->user_id = $_SESSION['user_id'];
     	$this->display();
    }
    
    
    public function head()
    {
    	
    	 //[test]:set session 
     	if(!isset($_SESSION['user_id']))
     	{
    		$_SESSION['user_id'] = 1;
    		$_SESSION['user_name'] = 'admin';
     	}
    	// $this->display();   	
    	
    }
    
    //test db connection
    public function test()
    {
    	$this->display();
    }
  
}