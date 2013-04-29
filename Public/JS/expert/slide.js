//menu
$(document).ready(function(){
  	
	  	$('li.mainlevel').mousemove(function(){
	  		$(this).find('ul').show();	  		
	  		});
 
  $('li.mainlevel').mouseleave(function(){  
  		$(this).find('ul').hide();
  });
  
});// JavaScript Document