// JavaScript Document
jQuery.validator.addMethod("is_int", function(value, element) {
   var aint=parseInt(value);	
    return aint>0&& (aint+"")==value;   
  }, "请输入一个数字.");
