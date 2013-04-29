window.hzmr = window.hzmr || [];
/************* Start like.js **************/
try {//<script>
HZ.ns('HZ.like');

HZ.like.LikeDialog = function () {
	//calling the super class constructor
	HZ.like.LikeDialog.superclass.constructor.call(this);
	
	var self= this, list;
	
	this.prepare = function () {
		var body = $('<div id="hzlikeListContainer"><ul></ul></div>');
		list = body.find('ul');
		var dialogSettings = {
			title: 'People who like this',
			body: body,
			onViewLoaded: onViewLoaded
		};
		self.init(dialogSettings);
	};
	
	this.appendToLikeList = function (like) {
		list.append(like);
	};
	
	var onViewLoaded = function() {
		list.empty();
	};
};
HZ.extend(HZ.like.LikeDialog, HZ.ui.yamdi.Dialog);


HZ.like.Like = new (function(){
	var likeDialog,
		settings,
		defaults;
	
	defaults = {
		likeAction: "like",
		unlikeAction: "unlike",
		showlikeAction: "showlikes",
		placeholder: "@@item@@",
		likeText: "Like this @@item@@",
		unlikeText: "Stop liking this @@item@@",
		likeButtonLabel: "Like",
		likeButtonIngLabel: "Liked",
		unlikeButtonLabel: "Unlike",
		likeIconClass: "buttonIconLike",
		unlikeIconClass: "buttonIconUnfeature",
		likeIconIngClass: "buttonIconLikeGray"
	}
	
	this.init = function(config) {
//		People who like this
		if(config) {
			settings = $.extend({}, defaults, config);
		}
		if (HZ.data.CurrentSessionUser) {
			$(document).on("click","a.like",function(event) {
				var target = this;
				execute(settings.likeAction,target);
				event.preventDefault();
			});
			$(document).on("click","a.unlike",function(event) {
				var target = this;
				execute(settings.unlikeAction,target);
				event.preventDefault();
			});
		} else {
			$(document).on("click","a.like,a.unlike",function(event){
				HZ.auth.Manager.signup(HZ.ajaz.Like.SOURCE_LINK_LIKE, null, window.location.href);
				event.preventDefault();
			});
		}
		
		//prepare the dialog
		likeDialog = new HZ.like.LikeDialog();
		likeDialog.prepare();
		
		$(document).on("click","a.likeIcon",function(event) {
			var target = this;
			execute(settings.showlikeAction,target);
			event.preventDefault();
		});
	};
	
	// Likes on Galleries and Questions
	this.updateLikes = function(btnSelector) {
		var $btn = $(btnSelector);
		var btnId = $btn.attr('id');
		var op = $btn.attr('lop'),
			objectType = $btn.attr('loty'),
			objectId = $btn.attr('loid');
		var likeText,
			unlikeText;
		
		var onClickFun = function() {
			HZ.like.Like.updateLikes(btnSelector);
		};
		
		var onMouseOverFun = function() {
			HZ.like.Like.updateLikeBtn(this, true);
		};
		
		var onMouseOutFun = function() {
			HZ.like.Like.updateLikeBtn(this, false);
		}
			
		HZ.ajaz.Like.like(op,objectId,objectType, 
			function(obj){
				if(obj && obj.success == "true") {
					var $icon = $btn.find('#'+btnId+'_icon__');
					var $btnLabel = $btn.find('#'+btnId+'_label__');
					var $btnActionCount = $btn.find(".whitebuttonRight");
					if(op == settings.likeAction){
						$btnLabel.css({"padding-right": "3px", "padding-left": "2px"});
						$btnLabel.text(settings.likeButtonIngLabel);
						unlikeText = settings.unlikeText.replace(settings.placeholder, (objectType==1?"ideabook":(objectType==5?"discussion":"item")));
						$btn.attr('title',unlikeText);
						$btn.attr('lop',settings.unlikeAction);
						if($btnActionCount.length > 0) {
							$btnActionCount[0].innerHTML = (obj.formattedLikeCount ? obj.formattedLikeCount : (parseInt($btnActionCount[0].innerHTML, 10) + 1));
						} else {
							$btnActionCount = $('<div class="whitebuttonRight">1</div>');
							$btn.append($btnActionCount);
						}
						$btn.bind("mouseover", onMouseOverFun).bind("mouseout", onMouseOutFun);
						$icon.removeClass(settings.likeIconClass).addClass(settings.likeIconIngClass);
					}
					else if (op == settings.unlikeAction){
						$btnLabel.text(settings.likeButtonLabel);
						likeText = settings.likeText.replace(settings.placeholder, (objectType==1?"ideabook":(objectType==5?"discussion":"item")));
						$btn.attr('title',likeText);
						$btn.attr('lop',settings.likeAction);
						if($btnActionCount.length > 0) {
							var newCount = (obj.formattedLikeCount ? obj.formattedLikeCount : (parseInt($btnActionCount[0].innerHTML, 10) - 1));
							if(newCount < 1) {
								$btnActionCount.remove();
							} else {
								$btnActionCount[0].innerHTML = newCount;
							}
						}
						$btn.removeAttr("onmouseover").removeAttr("onmouseout").unbind("mouseover").unbind("mouseout");
						$icon.removeClass(settings.likeIconIngClass).removeClass(settings.unlikeIconClass).addClass(settings.likeIconClass);
					}
				}
			}
		);
	};
	this.updateLikeBtn = function(srcElement, hover) {
		
		var $btn = $(srcElement);
		var btnId = $btn.attr("id");
		var $icon = $btn.find('#'+btnId+'_icon__');
		var $btnLabel = $btn.find('#'+btnId+'_label__');
		
		if(hover) {
			$icon.removeClass(settings.likeIconIngClass).addClass(settings.unlikeIconClass);
			$btnLabel.css({"padding-right": 0,  "padding-left": "0px"});
			$btnLabel.text(settings.unlikeButtonLabel);
		} else {
			$icon.removeClass(settings.unlikeIconClass).addClass(settings.likeIconIngClass);
			$btnLabel.css({"padding-right": "3px",  "padding-left": "2px"});
			$btnLabel.text(settings.likeButtonIngLabel);
		}
	}
	// Likes on Comments
	function execute(_action,target) {
		var $target = $(target);
		var objectType = $target.attr("data-object-type");
		var objectId = $target.attr("data-object-id");
		var isSelf = parseInt($target.attr("data-self"), 10);
		
		if (_action == settings.showlikeAction){
			HZ.ui.Yamdi.show(likeDialog);
		}
		HZ.ajaz.Like.like(_action,objectId,objectType,
			function(obj){
				var $likeContainer = $target.parents(".likeContainer");
				if(obj && obj.success == "true") {
					// variables needed for like and unlike;
					var numberOfLikes = obj.numberOfLikes;
					var $unlikeLink = $likeContainer.find('.unlike');
					var $likeLink = $likeContainer.find('.like');
					var $likeIcon = $likeContainer.find('.likeIcon');
					var $dot = $likeContainer.find('.likeSeparator');
					var $likeDotPrefix = $likeContainer.find('.likeDotPrefix');
					var textOnHover = "";
					// variable needed for likeList;
					var userList = obj.userList;
					if(_action == settings.likeAction){
						if (numberOfLikes==1){
							textOnHover = "You like this.";
						} else if (numberOfLikes > 1){
							textOnHover = "You and "+(numberOfLikes-1)+" people like this.";
						}
						$target.hide();
						$unlikeLink.show();
						if ($likeIcon.length==0){
							$dot = $("<span class='likeSeparator'>&middot; </span>");
							$likeIcon = $('<a class="likeIcon colorLink" data-object-type="'+objectType+'" data-object-id="'+objectId+'"  href="#"></a>');
							$likeContainer.append($dot);
							$likeContainer.append($likeIcon);
						}
						$likeIcon.attr("title",textOnHover);
						$likeIcon.html("<img src='"+HZ.utils.Config.emptyGifData+"'/>"+numberOfLikes);
					}
					else if (_action == settings.unlikeAction){
						$target.hide();
						if(isSelf != 1) {
							$likeLink.show();
						} else {
							$likeDotPrefix.remove();
						}
						if (numberOfLikes ==0){
							$dot.remove();
							$likeIcon.remove();
						} else if (numberOfLikes > 0){
							if(numberOfLikes == 1) {
								textOnHover = "1 person likes this."
							} else {
								textOnHover = numberOfLikes+" people like this."
							}
							$likeIcon.attr("title",textOnHover);
							$likeIcon.html("<img src='"+HZ.utils.Config.emptyGifData+"'/>"+numberOfLikes);
						}
					}
					else if (_action == settings.showlikeAction){
						var count = userList.length;
						var link, userName, userImage, $userImg, $userTextInfo;
						var likes = [];
						for (var i=0;i<count;i++){
							var $li = $("<li></li>");
							var likeItem = userList[i];
							link = likeItem["link"];
							userName = likeItem["userName"];
							userImage = likeItem["userImage"];
							$userImg = $("<a class='likeUserImg' href='"+link+"'><img width='40' height='40' src='"+userImage+"'/></a>");
							$userTextInfo = $("<div class='likeUserTextInfo'><a class='colorLink' href='"+link+"'>"+userName+"</a></div><div style='clear:both'></div>");
							$li.append($userImg).append($userTextInfo);
							likeDialog.appendToLikeList($li);
							HZ.ui.Yamdi.center();// Need to center the dialog after load the list.
						}
						
					}
				}
				else {
					//Error
					if (_action == settings.showlikeAction){
						HZ.ui.Yamdi.hide(likeDialog);
						var errorMsg = "Cannot get the list of people who like this.<br/>"+obj.error+"<br/>Please try it later.";
						HZ.ui.yamdi.Common.alert("Internal Error",errorMsg);
					}
				}
			}
		);
	}
})();

window.hzmr.push("like:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End like.js  **************/
/************* Start hoverCard.js **************/
try {// <script>

HZ.ns('HZ.utils');
HZ.utils.HoverCard = new (function() {
	var cachedVal = {};
	var cfg,
		defaults = {
					cardContentWidth: 428,
					statCardWidth: 86,
					reviewCardWidth: 100,
					isTouchDev: 0
				};
	var	hoverCardWidth;
	var userCardHtmlTmpl = "<div class='hzHoverCard'>\n\
		<div class='hzHoverCardContent'>\n\
			<div class='upper'>\n\
				<a target='_blank' href='%PROFILELINK%'><img class='hzHoverCardUserThumb' src='%USERTHUMB%'/></a>\n\
				<div class='hzHoverCardUserName'>\n\
					<a class='nameLink' target='_blank' href='%PROFILELINK%'>%USERNAME%</a>\n\
				</div>\n\
				%USERDESC%\n\
			</div>\n\
			%FOLLOW%\n\
			%IDEABOOK%\n\
			%PROJECT%\n\
			%COMMENT%\n\
			<div class='hzHCClearFix'></div>\n\
		</div>\n\
		</div>";
	var proCardHtmlTmpl = "<div class='hzHoverCard'>\n\
		<div class='hzHoverCardContent'>\n\
			<div class='upper'>\n\
				<a target='_blank' href='%PROFILELINK%'><img class='hzHoverCardUserThumb' src='%USERTHUMB%'/></a>\n\
				<div class='hzHoverCardUserName'>\n\
					<a target='_blank' class='nameLink' href='%PROFILELINK%'>%USERNAME%</a>\n\
				</div>\n\
				%PRODESC%\n\
			</div>\n\
			%FOLLOW%\n\
			%PROCARD%\n\
			%IDEABOOK%\n\
			%PROJECT%\n\
			%COMMENT%\n\
			<div class='hzHCClearFix'></div>\n\
		</div>\n\
		</div>";
	
	var callback = function(dataType, dataId, result) {
		var userDetail;
		var savedCopy = {};
		var $srcElement = $(this);
		if(result && result.success == "true") {
			userDetail = result.userDetail;
			// Cache data in case needed later
			savedCopy[dataType] = {};
			savedCopy[dataType][dataId] = userDetail;
			cachedVal = $.extend(true, cachedVal, savedCopy);
			drawHoverCard(userDetail, $srcElement, dataType, dataId);
		}
	};
	
	var getHoverCardHtml = function(userDetail, dataType, dataId) {
		var isPro,
			username,
			displayName,
			thumbUrl,
			profileLink,
			location,
			allowFollow,
			isFollower,
			galCount,
			projCount,
			cmtCount,
			reviewRating,
			numReview,
			reviewLink,
			galLink,
			prjLink,
			proType;
		var flBtnDispMode = 1,
			flAjaxParamUser = "u",
			flAjaxParamBtnMode = "m",
			flSrcElement = "s";
		var descHtml = "",
			followBtnHtml = "",
			followHtml = "",
			galleryHtml = "",
			projectHtml = "",
			commentHtml = "",
			proCardHtml = "",
			htmlResult = "";
			
		var proCardClass = "";
		
		isPro = userDetail.isPro;
		username = userDetail.uname;
		displayName = userDetail.name;
		thumbUrl = userDetail.pic;
		profileLink = userDetail.link;
		location = userDetail.loc;
		allowFollow = userDetail.allowFollow;
		isFollower = userDetail.isFollower;
		galCount = userDetail.galCount;
		projCount = userDetail.projCount;
		cmtCount = userDetail.cmtCount;
				
		reviewRating = userDetail.reviewRating;
		numReview = userDetail.numReview;
		reviewLink = userDetail.reviewLink;
		proType = userDetail.proType;
		
		galLink = userDetail.galLink;
		prjLink = userDetail.prjLink;
		
		hoverCardWidth = cfg.cardContentWidth;
		
		if(allowFollow == 1) {
			if(isFollower == 1) {
				var followBtnClasses = "hzBtn primary profileBtnFollowing";
				var followBtnText = "Following";
				var followOp = "u";
			} else if(isFollower == 0) {
				var followBtnClasses = "hzBtn primary profileBtnFollow";
				var followBtnText = "Follow";
				var followOp = "f";
			}
			if (HZ.data.CurrentSessionUser) {
				var clickHandler = "HZ.actions.Follow.updateFollow({"+flAjaxParamUser+": \""+username+"\", "+flAjaxParamBtnMode+": \""+flBtnDispMode+"\", "+flSrcElement+": this"+"}); HZ.utils.HoverCard.toggleFollowStatus(\""+dataType+"\", \""+dataId+"\"); return false;";
			} else {
				var clickHandler = "HZ.auth.Manager.signup(10); return false;"; // contribute to follow event sign up
			}
			var mouseoverHandler = "HZ.actions.Follow.updateFollowBtn({"+flAjaxParamUser+": \""+username+"\", "+flAjaxParamBtnMode+": \""+flBtnDispMode+"\", "+flSrcElement+": this"+"}, true);";
			var mouseoutHandler = "HZ.actions.Follow.updateFollowBtn({"+flAjaxParamUser+": \""+username+"\", "+flAjaxParamBtnMode+": \""+flBtnDispMode+"\", "+flSrcElement+": this"+"}, false);";
			followBtnHtml = "<input id='followButton_"+username+"' type='button' class='"+followBtnClasses+"' value='"+
				followBtnText+"' onclick='"+clickHandler+"' onmouseover='"+mouseoverHandler+"' onmouseout='"+mouseoutHandler+"'/>";
			followBtnHtml += "<input id='followOp_"+username+"' type='hidden' value='"+followOp+"'/>";
			followHtml = "<div class='hzFollowBtnWrapper'>"+followBtnHtml+"</div>";
		}
		followHtml = "<div class='statCard followStatCard'>"+followHtml+"</div>";
		// Ideabook
		galleryHtml = "<div class='statCard'><a target='_blank' href='"+ galLink + "'><div class='counter'>"+galCount+"</div><div class='itemName'>"+(galCount > 1 ? "Ideabooks":"Ideabook")+"</div></a></div>";
		// Project
		if(projCount > 0) {
			projectHtml = "<div class='statCard'><a target='_blank' href='"+ prjLink + "'><div class='counter'>"+projCount+"</div><div class='itemName'>"+(projCount > 1 ? "Projects":"Project")+"</div></a></div>";
		} else {
			hoverCardWidth -= cfg.statCardWidth;
		}
		// Comment
		commentHtml = "<div class='statCard lastCard'><div class='counter'>"+cmtCount+"</div><div class='itemName'>"+(cmtCount > 1 ? "Comments":"Comment")+"</div></div>";
		if(isPro == 1) {
			// Write Pro Desc: ProType | Pro Loc
			if(proType && proType != "Not specified") {
				descHtml = proType;
			}
			if(location) {
				if(descHtml.length > 0) {
					descHtml += " | ";
				}
				descHtml += location;
			}
			if(descHtml) {
				descHtml = "<div class='hzHoverCardLoc'>"+descHtml+"</div>";
			}
			// Write Reviews
			if(numReview > 0) {
				proCardHtml += "<div class='classification counter'><div class='cover'></div><div class='progress' style='width: " +
					reviewRating*2 + "%'></div></div>";
				proCardHtml += "<div class='reviewNum itemName'>" + numReview + (numReview == 1 ? "&nbsp;Review" : "&nbsp;Reviews") + "</div>";
				proCardHtml = "<div class='statCard reviewCard'><a target='_blank' href='"+ reviewLink + "'>"+proCardHtml+"</a></div>";
			} else {
				hoverCardWidth -= cfg.reviewCardWidth;
			}
			// Write About Me
			htmlResult = HZ.utils.Html.template(proCardHtmlTmpl, {
				"%USERNAME%": displayName,
				"%PROFILELINK%": profileLink,
				"%USERTHUMB%": thumbUrl,
				"%PRODESC%": descHtml,
				"%FOLLOW%": followHtml,
				"%IDEABOOK%": galleryHtml,
				"%PROJECT%": projectHtml,
				"%COMMENT%": commentHtml,
				"%PROCARD%": proCardHtml
			});
		} else {
			hoverCardWidth -= cfg.reviewCardWidth;
			if(location) {
				descHtml += location;
			}
			if(descHtml) {
				descHtml = "<div class='hzHoverCardLoc'>"+descHtml+"</div>";
			}
			htmlResult = HZ.utils.Html.template(proCardHtmlTmpl, {
				"%USERNAME%": displayName,
				"%PROFILELINK%": profileLink,
				"%USERTHUMB%": thumbUrl,
				"%USERDESC%": descHtml,
				"%FOLLOW%": followHtml,
				"%IDEABOOK%": galleryHtml,
				"%PROJECT%": projectHtml,
				"%COMMENT%": commentHtml
			});
		}
		return htmlResult;
	};
	var drawHoverCard = function(userDetail, $srcElement, dataType, dataId) {
		var hoverCardHtml = getHoverCardHtml(userDetail, dataType, dataId);
		var point;
		var $hoverCard;
		
		var bottomHeight,
			upHeight,
			widthToRight;
			
		var hoverCardHeight = 110;
		
		upHeight = $srcElement.offset().top - $(document).scrollTop();
		bottomHeight = $(window).height() - upHeight - $srcElement.height();
		widthToRight = $(window).width() - ($srcElement.offset().left-$(document).scrollLeft());
		if(upHeight > (hoverCardHeight+45) || upHeight >= bottomHeight) {
			point = "south";
		} else {
			point = "north";
		}
		if(widthToRight < hoverCardWidth) {
			point += " right";
		}
		$hoverCard = $(hoverCardHtml);
		$hoverCard.css("width", hoverCardWidth);
		$hoverCard.data("srcElement", $srcElement);
		$srcElement.tipBubble({content:$hoverCard, borderColor: "#CCC", point:point, attachTo:'body', id:'hzHoverCardContainer', showCloseBtn:false, width:hoverCardWidth, fadeDuration: 1});
	};
	
	var destroyHoverCard = function($srcElement) {
		$srcElement.tipBubble('hide');
	};
	
	var eventHandler = function(event) {
		var srcElement = this,
			$srcElement = $(srcElement);
		var ajazTimer,
			dropDownTimer,
			ajazTimeout = 300,
			dropDownTimeout = 300;
		if(event.type == "mouseenter") {
			ajazTimer = setTimeout(function() {
				var dataType = $srcElement.attr("data-type"),
					dataId = $srcElement.attr("data-id");
				if(dataType && dataId) {
					// Try local cache
					if(cachedVal && cachedVal[dataType] && cachedVal[dataType][dataId]) {
						drawHoverCard(cachedVal[dataType][dataId], $srcElement, dataType, dataId);
					} else {
						// Otherwise, get the data from server
						HZ.ajaz.Services.getHoverCardData(dataType, dataId, $.proxy(callback, $srcElement, dataType, dataId));
					}
				}
			}, ajazTimeout);
			$srcElement.data("ajazTimer", ajazTimer);
		} else if(event.type == "mouseleave") {
			clearTimeout($srcElement.data("ajazTimer"));
			$("#hzHoverCardContainer").data("dropDownTimer", setTimeout(function() {
				destroyHoverCard($srcElement);
			}, dropDownTimeout));
		}
	};
	var touchDevEventHandler = function(event) {
		event.stopPropagation();
		event.preventDefault();
		var srcElement = this,
			$srcElement = $(srcElement);
		if($("#hzHoverCardContainer").is(":visible")) {
			destroyHoverCard($srcElement);
		} else {
			var dataType = $srcElement.attr("data-type"),
				dataId = $srcElement.attr("data-id");
			if(dataType && dataId) {
				// Try local cache
				if(cachedVal && cachedVal[dataType] && cachedVal[dataType][dataId]) {
					drawHoverCard(cachedVal[dataType][dataId], $srcElement, dataType, dataId);
				} else {
					// Otherwise, get the data from server
					HZ.ajaz.Services.getHoverCardData(dataType, dataId, $.proxy(callback, $srcElement, dataType, dataId));
				}
			}
		}
	}
	this.toggleFollowStatus = function(_dataType, _dataId) {
		if(cachedVal && cachedVal[_dataType] && cachedVal[_dataType][_dataId]) {
			cachedVal[_dataType][_dataId]["isFollower"] = 1-cachedVal[_dataType][_dataId]["isFollower"];
		}
	}
	this.init = function(_cfg) {
		cfg = $.extend({}, defaults, _cfg || {});
		if(cfg.isTouchDev) {
			$("body").on("click", ".hzHouzzer", touchDevEventHandler);
		} else {
			$("body").on("mouseenter mouseleave", ".hzHouzzer", eventHandler);
			$("body").on("mouseenter", "#hzHoverCardContainer", function() {
				clearTimeout($("#hzHoverCardContainer").data("dropDownTimer"));
			}).on("mouseleave", "#hzHoverCardContainer", function() {
				destroyHoverCard($(".hzHoverCard").data("srcElement"));
			});
		}
	}
})();

window.hzmr.push("hoverCard:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End hoverCard.js  **************/
/************* Start followButton.js **************/
try {// <script>
	
HZ.ns('HZ.actions.Follow');
HZ.actions.Follow = new (function(){
	//private
	var getIdForFollowObject = function(params) {
		if (params['u']) {
			return params['u'];
		} else {
			return params['t'] + '_' + params['i'];
		}
	};
	
	var getDisplayModeForFollowObject = function(params) {
		return params['m'];
	};
	
	var getElementIdForFollowButton = function(params) {
		return 'followButton_' + getIdForFollowObject(params);
	};
	
	var getTextElementIdForFollowButton = function(params) {
		return getElementIdForFollowButton(params) + '_label__';
	};

	var getElementIdForFollowButtonIcon = function(params) {
		return getElementIdForFollowButton(params) + '_icon__';
	};

	var getElementIdForFollowOperation = function(params) {
		return 'followOp_' + getIdForFollowObject(params);
	};
	
	var getFollowOperationElement = function(followButtonElement) {
		var operationElement = followButtonElement;
		do {
			operationElement = operationElement.nextSibling;
		} while (operationElement && operationElement.nodeType != 1);//Node.ELEMENT_NODE
		return operationElement;
	};
	
	var getFollowButtonLabelElement = function(followButtonElement) {
		var followButtonLabelElement = followButtonElement.getElementsByClassName("label")[0];
		return followButtonLabelElement ? followButtonLabelElement : null;
	};
	
	var getFollowButtonIconElement = function(followButtonElement) {
		var followButtonIconElement = followButtonElement.getElementsByClassName("whitebuttonIcon")[0];
		return followButtonIconElement ? followButtonIconElement : null;
	};
	
	var getButtonIconClassName = function(icon) {
		return "whitebuttonIcon buttonIcon" + icon;
	}
	
	var showFollowButton = function(params, buttonText) {
		if(params && params.s) {
			var buttonElement = params.s;
		} else {
			var buttonId = getElementIdForFollowButton(params);
			var buttonElement = document.getElementById(buttonId);
		}
		var displayMode = getDisplayModeForFollowObject(params);
		if(displayMode == '1') {
			buttonElement.value = buttonText;
			if (buttonText == 'Follow') {
				// Show FOLLOW button
				// remove unfollow button class
				buttonElement.className = buttonElement.className.replace(/(?:^|\s)profileBtnUnfollow(?!\S)/g , '' );
				buttonElement.className = buttonElement.className.replace(/(?:^|\s)profileBtnFollowing(?!\S)/g , '' );
				buttonElement.className += " profileBtnFollow";
			} else if (buttonText == 'Unfollow') {
				buttonElement.className = buttonElement.className.replace(/(?:^|\s)profileBtnFollow(?!\S)/g , '' );
				buttonElement.className = buttonElement.className.replace(/(?:^|\s)profileBtnFollowing(?!\S)/g , '' );
				buttonElement.className += " profileBtnUnfollow";
			} else if (buttonText == 'Following') {
				buttonElement.className = buttonElement.className.replace(/(?:^|\s)profileBtnUnfollow(?!\S)/g , '' );
				buttonElement.className = buttonElement.className.replace(/(?:^|\s)profileBtnFollow(?!\S)/g , '' );
				buttonElement.className += " profileBtnFollowing";
			} else {
				// non supported type. NOOP
				return;
			}
		} else {
			if(params && params.s) {
				var buttonTextElement = getFollowButtonLabelElement(params.s);
				var buttonIconElement = getFollowButtonIconElement(params.s);
			} else {
				var buttonTextId = getTextElementIdForFollowButton(params);
				var buttonIconId = getElementIdForFollowButtonIcon(params);
				var buttonTextElement = document.getElementById(buttonTextId);
				var buttonIconElement = document.getElementById(buttonIconId);
			}
			var color = null;
			var paddingRight = null;
			var iconClassName = "";

			if (buttonText == 'Follow') {
				// Show FOLLOW button
				if (displayMode == '3') {
					// icon mode
					paddingRight = '0px';
					iconClassName = getButtonIconClassName('AddToIdeabook');
					color = 'black';
				}
			} else if (buttonText == 'Unfollow') {
				// Show UNFOLLOW button
				if (displayMode == '3') {
					// icon mode
					color = 'black';
					paddingRight = '5px';
					iconClassName = getButtonIconClassName('Delete');
				}
			} else if (buttonText == 'Following') {
				// Show FOLLOWING button
				if (displayMode == '3') {
					// icon mode
					color = 'black';
					paddingRight = '0px';
					iconClassName = getButtonIconClassName('FeatureGray');
				}
			} else {
				// non supported type. NOOP
				return;
			}

			// update
			if (buttonTextElement) {
				// icon mode
				buttonTextElement.firstChild.nodeValue = buttonText;
				if (color)
					buttonTextElement.style.color = color;
				if (paddingRight)
					buttonTextElement.style.paddingRight = paddingRight;		
			} else {
				// profile mode
				buttonElement.innerHTML = buttonText;
				if (color)
					buttonElement.style.color = color;
				if (paddingRight)
					buttonElement.style.paddingRight = paddingRight;
			}
			if (buttonIconElement) {
				buttonIconElement.className = iconClassName;
			}
			if (buttonElement.title) {
				buttonElement.title = buttonText;
			}
		}
	}
	
		
	var followObjectAjaxHandler = function(resultObj,ajaxRequest)
	{
		if (resultObj.success == "true") {
			var params = ajaxRequest.getData();
			var opElem;
			if(params && params.s) {
				opElem = getFollowOperationElement(params.s);
			} else {
				var opId = getElementIdForFollowOperation(params);
				opElem = document.getElementById(opId);
			}
			if (ajaxRequest.getOperation() == 'f') {
				// show FOLLOWING button
				showFollowButton(params, 'Following');
				opElem.value = 'u';
			} else {
				// show FOLLOW button
				showFollowButton(params, 'Follow');
				opElem.value = 'f';
			}
		} else {
			if (resultObj.error == '2') {
				HZ.auth.Manager.signup(10);
			} else {
				var errorMessage = "Follow operation failed.";
				if (resultObj.error == '1')
				{
					errorMessage = "The user you are trying to follow has disabled this feature.";
				}
				if (resultObj.error == '4')
				{
					errorMessage = "To follow other people, you need to allow others to follow you. You can update your privacy settings on Edit Profile page.";
				}
				alert(errorMessage);
			}
		}				
	}
	//public
	this.updateFollow = function(params){
		var paramsString = "";
		for (var name in params) {
			paramsString = paramsString + '/' + name + '=' + params[name];
		}
		if(params && params.s) {
			var operationElem = getFollowOperationElement(params.s);
			var operation = operationElem ? operationElem.value : "";
		} else {
			var opId = getElementIdForFollowOperation(params);
			var operation = document.getElementById(opId).value;
		}
		if (operation) {
			ajaxc.makeRequest('http://www.houzz.com/follow', operation,paramsString,followObjectAjaxHandler,params);
		}
	}
	
	this.updateFollowBtn = function(params, focus){
		if(params && params.s) {
			var operationElem = getFollowOperationElement(params.s);
			var operation = operationElem ? operationElem.value : "";
		} else {
			var opId = getElementIdForFollowOperation(params);
			var operation = document.getElementById(opId).value;
		}

		if (operation == 'u') {
			if (focus)
				showFollowButton(params, 'Unfollow');
			else
				showFollowButton(params, 'Following');
		} else {
			// no op, if current operation is to follow
		}
	}
})();

window.hzmr.push("followButton:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End followButton.js  **************/