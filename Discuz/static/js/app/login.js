/*+--------------------------------------+
* 名称: login
* 功能: 处理登陆、注册相关操作
* anwsin官方:http://www.anwsion.com/
* developer:诸葛浮云
* Email:globalbreak@gmail.com 
* Copyright © 2012 - Anwsion社区, All Rights Reserved 
*+--------------------------------------+*/

//登陆背景图轮播
var logPicture = [
		{url:G_STATIC_URL + '/common/login_01.jpg',txt:'欢迎来到佳空间问答社区，<br/>关于居家设计的一切，或许答案都在这里。<br/><span class="i_cl_05"></span>'},
		{url:G_STATIC_URL + '/common/login_02.jpg',txt:'庆祝 佳空间 正式上线！<br/><span class="i_cl_05">欢迎空间设计爱好者注册</span>'},
		{url:G_STATIC_URL + '/common/login_03.jpg',txt:'佳空间是一个以家居视觉分享为主题的平台，帮助您发掘心目中的理想居家环境<br/><span class="i_cl_05">这里将是您的最好选择！</span>'}
];


(function($) {

	$.extend({
	
		//登陆
		login:{		
		
			//用户名
			userName : function(options) {
			
				var flgs = $.extend({
						fg : false, 			    //focus高亮，区别于登陆页面
						txt : _t('邮箱/用户名'),
						id : null 				//用户名ID
						
					},options || {});
					
				//onfocus
				$(flgs.id).val()=='' ? $(flgs.id).val(flgs.txt) :'';
				$(flgs.id).focus(function() {
					if( $(this).val() == flgs.txt) {
						 $(this).val('');
					}
					flgs.fg ? $(this).parent('li').addClass('cur') : 
						  $(this).addClass('i_cur');
				})
				
				//onblur
				.blur(function() {
					if( $(this).val().replace(/^\s+|\s+/g,'') == '') {
						 $(this).val(flgs.txt);
						 if($(this).parents('ul').attr('id') == 'weibo_bind') {
							 $('#bingglobal_err').removeClass('i_hide').find('span').html(_t('请输入用户名'));
						 }else{
						 	$.EveErr(_t('请输入用户名'));
						}
					}
					flgs.fg ? $(this).parent('li').removeClass('cur'): 
						  $(this).removeClass('i_cur');
				})
				
				//监测事件
				.keydown($(flgs.id).parents('ul').attr('id') == 'weibo_bind' ? function() {$('#bingglobal_err').addClass('i_hide')} :$.glo_Err);
				return this;
			},
			
			//密码
		   password: function(options) {
			   
				var flgs = $.extend({
						txtval:_t('密码'),
						txt:'#login_password_txt',
						pw:'#login_password',
						reg : false,			 //登陆与注册判断
						fg :false,				 //focus高亮，区别于登陆页面
						val:null
						
					},options ||{});
				
				 //txt onfocus
				 $(flgs.txt).focus(function() {
					$(this).addClass('i_hide');
					$(flgs.pw).removeClass('i_hide');
					$(flgs.pw).focus();
				 })
				 
				 //password onfocus
				$(flgs.pw).focus(function() {					
					flgs.fg ? $(this).parents('li').addClass('cur') : 
						  $(this).addClass('i_cur');	
					if(flgs.reg) {
						$.register.reg.pwhandle('focus',$(this));//注册页面
					}
				})
				
				//onblur
				.blur(function() {
					if($(this).val() =='') {
						$(this).addClass('i_hide');
						$(flgs.txt).removeClass('i_hide');
					}
					
					flgs.fg ? $(this).parents('li').removeClass('cur') :
						  $(this).removeClass('i_cur');
					
					flgs.val = $(this).val().replace(/^\s+|\s+/g,'');
					
					if (flgs.reg) {
						flgs.val.length > 16 ?
						$.register.reg.pwhandle('blur',$(this)):
						$.register.reg.pwhandle('right',$(this));
					}
				})
				
				//监测事件
				.keydown($(flgs.txt).parents('ul').attr('id') == 'weibo_bind' ? function() {$('#bingglobal_err').addClass('i_hide')} :$.glo_Err);
				return this;	  
		   },
		   
			//快捷键登陆ctrl+enter || enter
		   keyEve: function(fn) {
				$(document).keypress(function(e) {
					var e = e ? e : window.event;
					
					//兼容ie 
					if((e.ctrlKey && e.keyCode == 13) || (e.ctrlKey && e.keyCode == 10) || e.keyCode == 13) {
						if(fn!=null) {
							fn(e); 
						}
					}
				});
		   },
		   
		   
		   loginSubmit: function(fn) {				
				if($.trim($('#login_userName').val()) == '' ||  $('#login_userName').val() == _t('邮箱/用户名')) {
						
					$('#login_userName').focus();
					if($('#login_userName').parents('ul').attr('id') == 'weibo_bind') {
						 $('#bingglobal_err').removeClass('i_hide').find('span').html(_t('请输入用户名'));
					}else{
						$.EveErr(_t('请输入用户名'));
					}
					
					return false;
				}else{
					/*+--------------------------------------+
				    * 登陆页 vs 微博绑定页面调用
				    *+----------------------------------------+*/
					
					// md5 password...
					if (typeof(hex_md5) == 'function')
					{
						$('#login_password').val(hex_md5($('#login_password').val()));
					}
										
					if(fn !=null && fn.type == 'keypress') {
						ajax_post($('#login_form'), _login_form_processer); 
					 }else{
						if(fn!=null) {
							fn();
						}
					}
					return ;
				}
		   },
		   
		  /*+--------------------------------------+
		   * 登陆页 vs 微博绑定
		   * flgs默认为true（首页登陆） flas = false 为微博绑定
		   *+----------------------------------------+*/
		   info: function() {
		   	   var flgs = true ;
			   if($.isNull($('#login_userName')) && $.isNull($('#login_password'))) {
				   $.isNull($('#weibo_bind')) ? flgs = false : flgs;
					   this.userName({fg:flgs,id:'#login_userName'})
					   .password({fg:flgs});
			   }
			  
			   //登陆背景图轮换
			   if(flgs) {
				 !$.isNull($('#msn_login')) ? $.scrollPic().scroll() :'';
				 this.keyEve(this.loginSubmit); 
			   }
		   
		   }
		   
		}, //end login 
		
	   //报错事件
		 glo_Err: function() {
			  if(!$('#global_err').hasClass('i_hide')) {
				  $('#global_err').addClass('i_hide');
			  }   
		 },
		 
		 EveErr: function(html) {
			  $('#global_err').removeClass('i_hide').find('span').html(html);
		 },
		
		//邮箱验证
		email_verify: function() {
			$.login.password();
			$.register.s.authCode();
		},
		
		//密码找回
		pas_retrieve:function() {
			$.login.userName({id:'#login_userName'});
			$.register.s.authCode();
		},
		
		wb_Logins: function( flg ) {
			if($('#weibo_bind').css('display') == 'none') {
				$('#weibo_bind').fadeIn('slow');
				$('#weibo_login').hide();
				$(flg).find('em:first-child').addClass('cur');
			}else{
				$('#weibo_bind').hide();
				$('#weibo_login').fadeIn('slow');
				$(flg).find('em:first-child').removeClass('cur');
			}
		},
		//注册
		register:{
			
			//微博登陆
			s: {
				//用户名 密码
				callFn : function() {
				
					$.login.userName({
						id:'#login_account',
						txt:_t('邮箱')
					}).password({
						reg:false,
						txt:'#weibo_password_txt',
						pw:'#weibo_password'
					})
					
					//.keyEve(this.callback);
					return this;
				},
				
				callback: function(fn) {
					$.register.s.login(true, fn);
				},
				//验证码
				authCode: function(ev) {
					var  cd,val;
					cd = ev == null ? false : ev;  //默认为微博登陆 true为注册页面验证码
					$('#authCode').focus(function() {
						if($(this).val() == _t('验证码')) {
							$(this).val('');
						}
						
						//注册页面验证码
						if(cd) {
							$.register.reg.code('focus',$(this));
						}
						 $(this).addClass('i_cur');
					})
					
					//onblur
					.blur(function() {
						if( $(this).val() == '') {
							$(this).val(_t('验证码'));
						}
						val = $(this).val().replace(/^\s+|\s+/g,'');
						if(val.length < 4 && !cd) {
							$.EveErr(_t('验证码不正确'));
						}else if(cd) {
							//注册验证码
							if(val.length < 4 || val.length > 4) {
								$.register.reg.code('blur',$(this));
							}else{
								$.register.reg.code('right',$(this));
							}
							
						}
						 $(this).removeClass('i_cur');
					})
					
					.keypress($.glo_Err);
					return this;
				},
				
				//用户协议
				usr_Treaty: function() {
					
					$('#user_agreement').click(function() {
						if($('#user_agreement').attr('checked') != 'checked') {
							$.glo_Err();
						}
					})
				},
				
				EveClick: function() {
					$('#user_agre').css('display') == 'none' ? 						
					$('#user_agre').fadeIn('slow') :
					$('#user_agre').fadeOut('slow');
			},
				
				//登陆 ,参数flgs 如果为true则为微博登陆，false则为注册页面
				login: function(flgs, fn) {
					if(!flgs) {
						if($.trim($('#login_userName').val()) == '' ||  $.trim($('#login_userName').val()) == _t('用户名')) {
							$('#login_userName').focus();
							$.EveErr(_t('请输入用户名'));
							return false;
						}
					}
					
					if($.trim($('#login_account').val()) == '' ||  $.trim($('#login_account').val()) == _t('邮箱')) {
						$('#login_account').focus();
						$.EveErr(_t('请输入邮箱'));
						return false;
						
					}
					else
					{
						if (fn != null)
						{							
							fn();
						}
						
						return false;
					}
				},
			   info: function() {
					if($.isNull($('#login_account'))) {
						this.callFn().authCode().usr_Treaty();
						
						var txt_pw,
							 pw,
							 val,
						
						 txt_pw = $('#weibo_password_txt');
						 pw = $('#weibo_password');
						 //txt onfocus
						 $(txt_pw).focus(function() {
							$(this).addClass('i_hide');
							$(pw).removeClass('i_hide');
							$(pw).focus();
						 })
						 
						 //password onfocus
						$(pw).focus(function() {
						
							$(this).addClass('i_cur');	
						})
						
						//onblur
						.blur(function() {
							if($(this).val() =='') {
								$(this).addClass('i_hide');
								$(txt_pw).removeClass('i_hide');
							}
							
								  $(this).removeClass('i_cur');
							
							val = $(this).val().replace(/^\s+|\s+/g,'');
						})
						
						//监测事件
						.keydown($.glo_Err);	
					}
			   }	
			}, // end 微博登陆
			
			//注册页面
			reg:{
				//邮箱验证
				email:/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/,
					
				//提示框样式
				class_id:{
					blur:'reg_Err',
					focus:'reg_tips',
					right:'reg_right i_small',
					load:'login_load'
				},
				//用户名
				User:{
					focus: _t('请输入一个 2-14 位的用户名'),
					blur: '<em class="regErr_ico i_small"></em>' + _t('用户名不符合规则')
				},
				//账户
				Acc:{
					focus: _t('请输入你常用的电子邮箱作为你的账号'),
					blur: '<em class="regErr_ico i_small"></em>' + _t('邮箱格式不正确')
				},
				//密码
				Pw:{
					focus: _t('请输入 6-16 个字符, 区分大小写'),
					blur: '<em class="regErr_ico i_small"></em>' + _t('密码长度不正确')
				},
				//验证码
				Cd:{
					focus: _t('验证码不区分大小写点击图片可换一张'),
					blur: '<em class="regErr_ico i_small"></em>' + _t('验证码不正确')
				},
				//
				n:null, //缓存
				register: function() {
					
					var ln = $('#login_userName'),     //用户名
						la = $('#login_account'),     //账户
						_seif = this;
					
					return{
						
						//用户名
						username:function() {
							$(ln).val() == '' ? $(ln).val(_t('用户名')) :'';
							$(ln).focus(function() {
								var s = $(this);
								if(s.val() == _t('用户名')) {
									s.val('');
								}
								//_seif.n != null ? (_seif.tips(s,_seif.class_id.focus,_seif.n)) :
								_seif.tips($(this),_seif.class_id.focus,_seif.User.focus);

								if (s.val())
								{
									$.ajax({
										type:'GET',
										url:G_BASE_URL+"/account/ajax/check_username/",
										beforeSend: function() {
												_seif.tips(s,_seif.class_id.load,'');
										},
										success: function(x) {
											var result = new Function('return'+ x)();
											if(result.errno == -1) {
												_seif.tips(s,_seif.class_id.focus,_seif.n = result.err);	
											}
										}	
									});
								}
								
								s.addClass('i_cur');
							})
							
							.blur(function() {
								var s = $(this);

								if (s.val() == '') {
									s.val(_t('用户名'));
									_seif.tips(s, '', '');
								}
								else
								{
									$.ajax({
										type:'GET',
										url:G_BASE_URL+"/account/ajax/check_username/username-" + encodeURIComponent(s.val()),
										beforeSend: function() {
											_seif.tips(s,_seif.class_id.load,'');
										},
										success: function(x) {
											var result = new Function('return'+ x)();
											if(result.errno == 1) {
												_seif.tips(s,_seif.class_id.right,'');
											}else if(result.errno == -1) {
												_seif.tips(s,_seif.class_id.blur,'<em class="regErr_ico i_small"></em>'+result.err);
											}
										}
										
									});
								}

								s.removeClass('i_cur');
							})
							
							.keypress($.glo_Err);
							return this;
						},
						
						//账号
						accountnum:function() {
							
							$(la).val() == '' ? $(la).val(_t('邮箱')) :'';
							$(la).focus(function() {
								if($(this).val() == _t('邮箱')) {
									$(this).val('');
								}
								_seif.tips($(this),_seif.class_id.focus,_seif.Acc.focus);	
								$(this).addClass('i_cur');
							})
							
							.blur(function() {
								if($(this).val() == '') {
									$(this).val(_t('邮箱'));
								}
								if(_seif.email.test($(this).val())) {
									_seif.tips($(this),_seif.class_id.right,'');
								}else{
									_seif.tips($(this),_seif.class_id.blur,_seif.Acc.blur);
								}
								$(this).removeClass('i_cur');
							})
							
							.keypress($.glo_Err);
							return this;
						},
						
						//密码
						password: function() {
							$.login.password({reg:true}).keyEve(this.callback); //跟微博登陆判断共用
							return this;
						},
						
						//authCode
						authCode: function() {
							$.register.s.authCode(true);
							return this;
						},
						
						callback: function(fn) {
							$.register.s.login(false, fn);
						},
						
						info: function() {
							this.username().accountnum().password().authCode();
						}
						
					}
				},
				
				//提示框
				tips: function(obj,classname,html) {
					$( obj ).parent().find('span').eq(0).attr('class',classname).html(html);
				},
				
				//密码处理
				pwhandle: function(ev,o) { 
					if(ev =='blur') {
						this.tips(o,this.class_id.blur,this.Pw.blur);
					}else if(ev =='focus') {
						this.tips(o,this.class_id.focus,this.Pw.focus);
					}else if(ev =='right') {
						this.tips(o,this.class_id.right,'');
					}
				},
				
				//验证码处理
				code: function(ev,o) {
					if(ev =='blur') {
						this.tips(o,this.class_id.blur,this.Cd.blur);
					}else if(ev =='focus') {
						this.tips(o,this.class_id.focus,this.Cd.focus);	
					}else if(ev =='right') {
						this.tips(o,this.class_id.right,'');
					}	
				},
				
				//注册调用
				info: function() {
					if($.isNull($('#login_userName'))) {
						this.register().info();
					}
				}
				
			}
		}, //end r

	  /*+--------------------------------------+
	   * 页面调用
	   * 
	   *+--------------------------------------+*/
	   anwsion: function() {
		   
		   //首页登陆 微博绑定
			if($.isNull($('#user_login'))|| $.isNull($('#weibo_bind'))) {
				$.login.info();	
			}
			
			//注册页面 
			$.isNull($('#user_register')) ? $.register.reg.info() :'';
			
			//微博登录 
			$.isNull($('#weibo_login')) ? $.register.s.info() :'';
			
			//邮箱验证 
			$.isNull($('#email_verify')) ? $.email_verify() :'';
			
			//密码找回
			$.isNull($('#psw_retrieve')) ? $.pas_retrieve() :'';

	   },
	   
	   isNull: function( obj ) {
		  if(obj ==null) return ;
		  return typeof obj == 'object' && obj.length > 0 ? 
		  		  true : false;
	   },
	
		//切换 预载
		scrollPic : function() {
			var flgArr = [],flg = false;
			$(logPicture).each(function( f ) {
				flgArr[f] = new Image();
				flgArr[f].src = logPicture[ f ].url;
			})
			return this;
			
		},
		//切换效果
		scroll: function() {
			
			var ul = $('<ul/>')
				 xx ='',
				 setTimes =null,
				 flg = 1,
				 timer = 6000, //切换时间 间隔
				 domWidth = $(document).innerWidth(),
				 domHeight = $(document).innerHeight(),
				 flgs = $('<div/>')
				.attr('id','login_scroll')
				.addClass('i_pas i_hide')
				.css({
					height:domHeight,
					overflow:'hidden'
				})
				.appendTo(document.body)
				.fadeIn('slow');
				
				$(logPicture).each(function(x) {
						
					$('<li/>')
						.css({
							height:domHeight,
							backgroundImage:'url('+logPicture[x].url+')',
							opacity: x > 0 ? 0 :1,
							zIndex: x > 0 ? 1 : 2
						})
						.appendTo(ul)
				});
				
				$(ul)
					.attr('id','srcElem')
					.addClass('l_xUler')
					.appendTo(flgs)
					.fadeIn('slow');
				
				setTimes = setInterval(function() {
						 $('#login_explain').html($(logPicture)[flg].txt);
						 $('#srcElem > li')
							.eq(flg++)
							.animate({opacity:1,zIndex:2},'slow')
							.siblings()
							.animate({opacity:0,zIndex:1},'fast');
						
						flg >= $(logPicture).length ? flg = 0 : flg;
						
					},timer);
					
		}
		
	});

})(jQuery);

function _login_form_processer(result)
{
	if (typeof(result.errno) == 'undefined')
	{
		$.alert(result);
		
		$('#login_password').attr('value', '');
	}
	else if (result.errno != 1)
	{
		$('#login_password').attr('value', '');
		
		if (result.rsm)
		{	
			$.EveErr(result.err);
		}
		else
		{
			if (document.getElementById('tip_error_message'))
			{
				$('#tip_error_message').html(result.err).show();
			}	
			else{
				$.alert(result.err);
			}
		}
	}
	else
	{
		if (result.rsm && result.rsm.url)
		{
			window.location = decodeURIComponent(result.rsm.url);
		}
		else
		{
			window.location.reload();
		}
	}
}