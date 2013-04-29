<?php if (!defined('THINK_PATH')) exit();?><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta property="wb:webmaster" content="f9811d176ed0769c" />



<!-- weibo login widget -->
<script src=" http://tjs.sjs.sinajs.cn/open/api/js/wb.js?appkey=3180752751" type="text/javascript" charset="utf-8"></script> 
<script>
	function login()
	{
		WB2.login(function(){
			//callback function
			});
	}
	
	WB2.anyWhere(function(W){
	    W.widget.connectButton({
	        id: "wb_connect_btn",
	        type: '3,2',
	        callback : {
	            login:function(o){
	                //alert(o.screen_name)
	            },
	            logout:function(){
	                alert('logout');
	            }
	        }
	    });
	});
</script> 

<div id="navContainer">
	<div id="navHeader" class='unsigned  '>
		<ul id="navTabs">
			<li id="navHome">
				<a href="__ROOT__/Index/index">
					
				</a>
			</li>
		<li id='navBrowse' class='navBlockExpandable navBlock'>
			<a href="__ROOT__/Space/index" class="tabOff">
				<div class='tabBody'><span class='tabTitle'>欣赏居家设计</span></div>
			</a>
			
            
            <!-- topNavigatiion sideBar-->
            	<div id='navBrowseExp' class='navExpandedMenuWrapper'>
					<div class='navExpandedMenu navRoundedBottomBorder'><div id='topicHomeContainer'>
							<table id='topicHomeMenu' cellpadding=0 cellspacing=0 border=0>
							<tr valign=top>
								<td>
								<ul class='topicHomeMenuMain'>
								<li class='navigationItemMoreRoomsLi'>
								<a class='navigationItem homeMenuTopicLine navigationItemAllRooms' href='http://www.houzz.com/photos' menuName='menu_allRooms' topicNamespace='navigation'>All Rooms & Styles</a></li>
								<li><a class='navigationItem homeMenuTopicLine' href='http://www.houzz.com/photos/floors-windows-and-doors' menuName='menu_739' topicNamespace='navigation' lidx='14'>Windows & Doors</a></li>
								</ul>
								</td>
								<td id='topicNavigationSideMenuContainer'>
									<div id='topicNavigationSideMenu'>
								    
								    
								    <div id='menu_allRooms' class='topicNavigationSideMenu'>
										<table class='topicNavigationSideMenuTable' cellpadding=0 cellspacing=0 border=0>
											<colgroup><COL WIDTH=170 /><COL WIDTH=170 /></colgroup>
										<tr valign=top><td colspan=2><div class='topicTitle'><a href='http://www.houzz.com/photos'>All Photos <span>&raquo;</span></a></div>
										</td></tr>
										<tr valign=top>
										<td class='topicItemsGroup'><a class='topicItem' href='http://www.houzz.com/photos/contemporary'>Contemporary</a><a class='topicItem' href='http://www.houzz.com/photos/eclectic'>Eclectic</a><a class='topicItem' href='http://www.houzz.com/photos/modern'>Modern</a><a class='topicItem' href='http://www.houzz.com/photos/traditional'>Traditional</a></td><td class='topicItemsGroup'><a class='topicItem' href='http://www.houzz.com/photos/asian'>Asian</a><a class='topicItem' href='http://www.houzz.com/photos/mediterranean'>Mediterranean</a><a class='topicItem' href='http://www.houzz.com/photos/tropical'>Tropical</a>
										</td></tr>
										<tr valign=top>
											<td colspan=2>
											<div class='topicTitle'><a href='http://www.houzz.com/photos/products'>All Products <span>&raquo;</span></a></div>
											</td></tr>
										<tr valign=top>
											<td class='topicItemsGroup'><a class='topicItem' href='http://www.houzz.com/photos/contemporary/products'>Contemporary</a><a class='topicItem' href='http://www.houzz.com/photos/eclectic/products'>Eclectic</a><a class='topicItem' href='http://www.houzz.com/photos/modern/products'>Modern</a><a class='topicItem' href='http://www.houzz.com/photos/traditional/products'>Traditional</a></td>
											<td class='topicItemsGroup'><a class='topicItem' href='http://www.houzz.com/photos/asian/products'>Asian</a><a class='topicItem' href='http://www.houzz.com/photos/mediterranean/products'>Mediterranean</a><a class='topicItem' href='http://www.houzz.com/photos/tropical/products'>Tropical</a></td>
										</tr>
											</table>
								 </div> <!-- end of menu-allRooms -->
								 	<div id='menu_739' class='topicNavigationSideMenu'><table class='topicNavigationSideMenuTable' cellpadding=0 cellspacing=0 border=0><colgroup><COL WIDTH=170 /><COL WIDTH=170 /></colgroup><tr valign=top><td colspan=2><div class='topicTitle'><a href='http://www.houzz.com/photos/floors-windows-and-doors'>Floors, Windows & Doors Products <span>&raquo;</span></a></div></td></tr><tr valign=top><td class='topicItemsGroup'><a class='topicItem' href='http://www.houzz.com/photos/windows'>Windows</a><a class='topicItem' href='http://www.houzz.com/photos/skylights'>Skylights</a><a class='topicItem' href='http://www.houzz.com/photos/doors'>Doors</a><a class='topicItem' href='http://www.houzz.com/photos/knobs'>Knobs</a><a class='topicItem' href='http://www.houzz.com/photos/floors'>Floors</a></td><td class='topicItemsGroup'><a class='topicItem' href='http://www.houzz.com/photos/curtains/pt-739'>Curtains</a><a class='topicItem' href='http://www.houzz.com/photos/curtain-poles'>Curtain Poles</a><a class='topicItem' href='http://www.houzz.com/photos/blinds'>Blinds</a><a class='topicItem' href='http://www.houzz.com/photos/cellular-shades'>Cellular Shades</a></td></tr></table></div>
									<div id='topicPaneMoreRooms' class='topicNavigationSideMenu'>
									<table class='topicNavigationSideMenuTable' cellpadding=0 cellspacing=0 border=0><colgroup><COL WIDTH=170 /><COL WIDTH=170 /></colgroup><tr valign=top><td colspan=2><div class='topicTitle'><span class='noLinkTopicTitle'>More Photos by Room</span></div></td></tr><tr valign=top><td class='topicItemsGroup'><a class='topicItem' href='http://www.houzz.com/photos/basement'>Basement</a><a class='topicItem' href='http://www.houzz.com/photos/entry'>Entry</a><a class='topicItem' href='http://www.houzz.com/photos/garage-and-shed'>Garage and Shed</a><a class='topicItem' href='http://www.houzz.com/photos/home-gym'>Gym</a></td><td class='topicItemsGroup'><a class='topicItem' href='http://www.houzz.com/photos/hall'>Hall</a><a class='topicItem' href='http://www.houzz.com/photos/laundry-room'>Laundry</a><a class='topicItem' href='http://www.houzz.com/photos/staircase'>Staircase</a><a class='topicItem' href='http://www.houzz.com/photos/wine-cellar'>Wine Cellar</a></td></tr><tr valign=top><td colspan=2><div class='topicTitle'><span class='noLinkTopicTitle'>More Products by Room</span></div></td></tr><tr valign=top><td class='topicItemsGroup'><a class='topicItem' href='http://www.houzz.com/photos/entry-products'>Entry</a><a class='topicItem' href='http://www.houzz.com/photos/garage-and-shed-products'>Garage and Shed</a><a class='topicItem' href='http://www.houzz.com/photos/hall-products'>Hall</a></td><td class='topicItemsGroup'><a class='topicItem' href='http://www.houzz.com/photos/laundry-products'>Laundry</a>
									<a class='topicItem' href='http://www.houzz.com/photos/wine-cellar-products'>Wine Cellar</a>
									</td></tr>
									</table>
									</div>
									</div><!-- end of topicNavigationSideMenu -->
									<div id='topicHomeImage'></div>
								</td>
							</tr>
							</table>
					</div>
						<script>HZ.navigation.SideBar.init({"defaultMainTopic":"allRooms"});</script>
				</div>
			 </div> <!-- end of navBrowseExp -->
            
            
            
            
            
            
            
            
            
            
		</li>
		<li id='navProfessionals' class='navBlock'><a href="__ROOT__/Expert" class="tabOff"><div class='tabBody'><span class='tabTitle'>本地专家</span></div>
								</a></li>
							<li id='navIdeabooks' class='navBlock'><a href="" class="tabOff"><div class='tabBody'><span class='tabTitle'>我的创意空间</span></div></a></li>
							<li id='navIdeabooks' class='navBlock'><a href="__ROOT__/Discuz" target="_blank" class="tabOff"><div class='tabBody'><span class='tabTitle'>设计问答</span></div></a></li>
                            <li id="navSearch" class="navBlock searchMid">
				
				<div id="navSearchAutoSuggestContainer" class="autoSuggContainer" style="display:none;"></div>
			</form>
		</li>
		<li id='navUpload' class='navBlock navBlockDouble'>
		<a href="__ROOT__/Usr/upload" class="tabOff"><div class='tabBody'><span class='tabTitleSmallTop'><img src='__PUBLIC__/pic/spacer.gif?v=1589'/></span>
		<span class='tabTitleSmallBottom'>上传</span></div></a></li>		
		<li id="navSignIn"  style=" margin-top:10px" >
				<div id="wb_connect_btn"></div>
		</li>
		
		
		
	</ul>
	</div>
	
</div>