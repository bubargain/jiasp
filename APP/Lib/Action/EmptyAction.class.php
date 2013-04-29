<?php
header("Content-Type:text/html; charset=utf-8");
	class EmptyAction extends Action{
		public function index(){
			$this->display("Error:404");
		}
	}