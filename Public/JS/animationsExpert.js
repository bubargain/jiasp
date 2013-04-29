window.hzmr = window.hzmr || [];
/************* Start animations.js **************/
try {
function hitch (scope, method) {
	return function() {
		var args = Array.prototype.slice.call(arguments);
		if (args == null) args = [];
		return method.apply(scope, args);
	}
}

var AnimationTransformation = {
	neutralTransform: function(x) {
		return x;
	},	
	easeInOutSCurveTransform: function (x) {
		return 3*x*x - 2*x*x*x;
	},
	easeInOutSinTransform: function (x) {
		var v = Math.sin (x*Math.PI/2); 
		return v*v;
	},
	easeInOutSin2Transform: function (x) {
		var v = x - Math.sin (x*Math.PI*2)/(2*Math.PI); 
		return v*v;
	}
}

function Animation(duration, handlers, transform) {
	this.handlers = handlers;
	this.duration = duration;
	this.started = false;
	this.startTime = null;
	if (transform != null)
		this.transform = transform;
	else
		this.transform = AnimationTransformation.easeInOutSin2Transform;
	this.process = function (value) {
		value = this.transform(value);	
		for (i in this.handlers) {
			var handler = this.handlers[i];
			handler.handleAnimationProgress.apply (handler, [value]);
		}
	}
	this.finish = function () {
		for (i in this.handlers) {
			var handler = this.handlers[i];
			handler.handleAnimationFinished.apply (handler);
		}
	}
}


function SlideAnimationHandler (divElement, startPos, endPos) {
	this.divElement = divElement;
	this.x = startPos.x;
	this.y = startPos.y;
	this.dx = endPos.x - startPos.x;
	this.dy = endPos.y - startPos.y;
	this.lastProgress = 0;
	this.handleAnimationProgress = function (percentage) {
		var x = this.x + percentage*this.dx;
		var y = this.y + percentage*this.dy;
		divElement.style.top = y+"px";
		divElement.style.left = x+"px";
		this.lastProgress = percentage;
	}
	this.handleAnimationFinished = function () {
	}
}

function OpacityAnimationHandler (divElement, startOpacity, endOpacity) {
	this.divElement = divElement;
	this.startOpacity = startOpacity;
	this.endOpacity = endOpacity;
	this.handleAnimationProgress = function (percentage) {
		divElement.style.visibility = "visible";
		var alpha = this.startOpacity + percentage * (this.endOpacity - this.startOpacity);
		divElement.style.opacity = alpha;
		divElement.style.filter = "alpha(opacity=" + (alpha*100) + ")";
	}
	this.handleAnimationFinished = function () {
		if (this.endOpacity == 1 && divElement.style.removeAttribute) {
			divElement.style.removeAttribute('filter');
		}
	}
}

function DimensionsAnimationHandler (divElement, startDims, endDims) {
	this.divElement = divElement;
	this.w = startDims.w;
	this.h = startDims.h;
	this.dw = endDims.w - startDims.w;
	this.dh = endDims.h - startDims.h;
	this.lastProgress = 0;
	this.handleAnimationProgress = function (percentage) {
		var w = this.w + percentage*this.dw;
		var h = this.h + percentage*this.dh;
		divElement.style.width = w+"px";
		divElement.style.height = h+"px";
		this.lastProgress = percentage;
	}
	this.handleAnimationFinished = function () {
	}
}

function Animator() {
	this.animationThread = null;
	this.animations = [];
	this.addAnimation = function (animation) {
		this.animations.push (animation);
	}
	this.removeAnimation = function (animation) {
		for (i in this.animations) {
			if (this.animations[i] == animation) {
				this.animations.splice (i,1);
				return;
			}
		}
	}
	this.startAnimationsThread = function() {
		if (this.animationThread == null && this.animations.length>0) { 
			this.animationThread = setInterval (hitch(this, this.animate), 20);
		}
	}
	this.stopAnimationsThread = function() {				
		if ((this.animationThread != null) && (this.animations.length == 0)) {
			clearInterval (this.animationThread);
			this.animationThread = null;
		}
	}
	
	this.startAnimation = function (animation) {
		var time = new Date().getTime();
		if (animation.started == true)
			this.stopAnimation(animation);
		
		animation.started = true;
		animation.startTime = time;
		if (animation.progressCallback) 
			animation.progressCallback(0);
		
		this.startAnimationsThread();
	}

	this.stopAnimation = function(animation) {
		animation.process(1);
		animation.finish();
		this.stopAnimationsThread();
	}
	
	this.animate = function () {
		var time = new Date().getTime();
		var animations = this.animations.slice(0);
		for (i in animations) {
			var animation = animations[i];
			if (animation != null) {
				var percent = (time - animation.startTime) / (1000*animation.duration);
				if (percent >= 1) {
					this.removeAnimation (animation);
					this.stopAnimation (animation);
				} else {
					animation.process(percent);
				}
			}
		}
	}
}



window.hzmr.push("animations:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End animations.js  **************/
/************* Start viewProfile.js **************/
try {// <script>
HZ.ns("HZ.utils");

HZ.ns("HZ.userProfile.render");

HZ.userProfile.render.User = {
	allUsers:{},
	maxUsersToEnumerate: 5, // FeedUtils::MAX_USERS_TO_ENUMERATE

	_getUserLink:function(user) {
		if (user && user.n) {
			if (user.p)
				return HZ.utils.Links.getProfessionalLink(user.n);
			else
				return HZ.utils.Links.getUserLink(user.n);
		}
	},
	
	getUsersHtml:function(userIds) {
		if (userIds.constructor != Array)
			userIds = [userIds];
		var html = "";
		var sep = "";
		for (var j=0; j<userIds.length; j++) {
			var user = HZ.data.Users.get(userIds[j]);
			html += sep + "<a class='hzHouzzer hzHCUserName' href='"+this._getUserLink(user)+"' data-type='profile' data-id='"+user.n+"'>" + user.d + "</a>";
			sep = ", ";
			if (j == userIds.length-2)
				sep = " and ";
			if (j+1 == this.maxUsersToEnumerate)
			{
				var numOthers = userIds.length - (j+1);
				if (numOthers == 1) {
					continue;
				}
				if (numOthers > 1) {
					html += " and "+numOthers+" others";
				}
				break;
			}
			}
		return html;
	},

	getUserImageHtml:function(userId) {
		return HZ.ui.render.User.getUserImageHtml(userId, false);
		var user = HZ.data.Users.get(userId),
			userThumbUrl = HZ.utils.Links.getUserImageUrl(userId);
		if (user)
			return "<a href='" + this._getUserLink(user) + "' class='userImage'><img class='hzHouzzer hzHCUserImage' src='" + userThumbUrl + "' data-type='profile' data-id='"+user.n+"'></a>";
	}
}

var animator = new Animator();

var spaceBoxes = {
	1: {x:246, y:174}, 
	2: {x:160, y:174},
	3: {x:121, y:174}, 
	4: {x:82, y:85},
	5: {x:57, y:56},
	6: {x:186, y:174}
}
var spacesLayouts = {
	"mosaic_0":[1],
	"mosaic_1":[1],
	"mosaic_2":[3,3],
	"mosaic_3":[2,4,4],
	"mosaic_4":[6,5,5,5],
	"tags_2":[6,5,5,5],
	"tags_3":[6,5,5,5],
	"tags_4":[6,5,5,5],
	1: [1],
	2: [2,2],
	3: [2,3,3],
	4: [2,2,4,4],
	5: [2,4,4,4,4],
	6: [3,3,4,4,4,4],
	7: [2,4,4,4,4,4,4],
	8: [2,3,5,5,5,5,5,5],
	9: [5,5,5,5,5,5,5,5,5],
	10: [2,5,5,5,5,5,5,5,5,5],
	11: [2,3,5,5,5,5,5,5,5,5,5]
}

/* Helper function for rendering user image and user name, including links to the user page 
 * public functions all take userId(s).
 */


function getPageLinkHtml (page, className) {
	var classHtml = (typeof className == "undefined")?"":" class='"+className+"'";
	var html = "<a href='"+page.link+"'"+classHtml+">"+page.title+"</a>";
	return html;
}

function getMosaicHtmlForImgs(ids, getImgUrlFn, includeLinks, getImgLinksFn, groupLink, mosaicGroup) {
	var html = "",
		layout,
		firstTinyThumbIndex = null,
		tinyThumbsInRow = null,
		maxCount = mosaicGroup?4:11,
		count = Math.max(1,Math.min(ids.length,maxCount)),
		width = 246;
	
	if (mosaicGroup)
		layout = spacesLayouts[mosaicGroup+"_"+count];
	else {
		layout = spacesLayouts[count];
		switch (count) {
			case 2: width = 2*160 + 4; break;
			case 3: width = 160 + 2*121 + 8; break;
			case 4: width = 2*160 + 82 + 8; break;
			case 5: width = 160 + 2*82 + 8; break;
			case 6: width = 2*121 + 2*82 + 12; break;
			case 7: width = 160 + 3*82 + 12; break;
			case 8: width = 160 + 121 + 2*57 + 11; break;
			case 9: width = 3*57 + 9; break;
			case 10: width = 160 + 3*57 + 13; break;
			case 11: width = 160 + 121 + 3*57 + 16; break;
		}
	}
		
	if (groupLink)	
		html += "<a href='"+groupLink+"'>";
	
	html += "<div class='spaceBoxes' style='width:"+width+"px'>";

	for (var j=0; j<count; j++)
	{
		var id = ids[j],
			whiteBg = false,
			boxSize = layout[j],
			className = "spaceBox"+boxSize,
			width = spaceBoxes[boxSize].x,
			height = spaceBoxes[boxSize].y;
			
		if (height<100 && !tinyThumbsInRow) {
			firstTinyThumbIndex = j;
			tinyThumbsInRow = (count - j) / ((boxSize == 4)?2:3);
		}
		if (j == 0 || (firstTinyThumbIndex===0 && j%tinyThumbsInRow===0))
			className += " spaceBoxFirstColumn";
		if (j >= count - tinyThumbsInRow)
			className += " spaceBoxLastRow";

		if (id)
		{
			if (id["i"]) {// convert space objects to spaceIds
				whiteBg = id.w == 2;
				id = id.i;
			}
			var imgSrc = getImgUrlFn(id, width, height, whiteBg);
			if (includeLinks)
				html += "<a href='"+getImgLinksFn(id)+"'>";
			html += "<img src='"+imgSrc+"' class='" + className +"'>";
			if (includeLinks)
				html += "</a>";
		} else {
			html += "<img src='"+HZ.utils.Config.emptyGifData+"' class='grayFiller " + className +"'>";
		}
		if ((j-firstTinyThumbIndex) % tinyThumbsInRow + 1 == tinyThumbsInRow) {
			html += "<br>";
		}
	}
	html += "</div>";
	if (groupLink)
		html += "</a>";
	return html;
}

function getMosaicHtmlForSpaceIds(spaceIds, includeLinks, groupLink, mosaicGroup) {
	return getMosaicHtmlForImgs(spaceIds, $.proxy(HZ.utils.Links.getSpaceImageUrl, HZ.utils.Links), includeLinks, $.proxy(HZ.utils.Links.getSpaceLink, HZ.utils.Links), groupLink, mosaicGroup);
}

function getMosaicHtmlForImageIds(imageIds, includeLinks, groupLink, mosaicGroup) {
	return getMosaicHtmlForImgs(imageIds, $.proxy(HZ.utils.Links.getImageUrl, HZ.utils.Links), includeLinks, $.proxy(HZ.utils.Links.getSpaceLink, HZ.utils.Links), groupLink, mosaicGroup);
}

function getMosaicHtmlForFileIds(fileIds) {
	return getMosaicHtmlForImgs(fileIds, function(id) { return HZ.utils.Links.getFileImageUrl(id, 7); }, false);
}

function getMosaicHtmlForImages(images, includeLinks, groupLink, mosaicGroup) {
	var ids = new Array();
	var idToImageMap = {};
	for (var i=0; i<images.length; i++) {
		var id = images[i].id;
		ids.push(id);
		idToImageMap[id] = images[i];
	}
		return getMosaicHtmlForImgs(
		ids,
		function(id, width, height, whiteBg, timestamp) {
			return HZ.utils.Links.getImageUrl(id, width, height, whiteBg, idToImageMap[id].ts);
		},
		includeLinks, $.proxy(HZ.utils.Links.getSpaceLink, HZ.utils.Links), groupLink, mosaicGroup
	);
}

var ExpandableDiv = {
	register:function(divId) {
		var container = document.getElementById(divId+"Trimmed");
		var fullContent = document.getElementById(divId+"Content");
		if (UIHelper.getBounds(container).h < UIHelper.getBounds(fullContent).h) {
			var moreButton = document.createElement("div");
			moreButton.id = divId+"More";
			container.parentNode.appendChild(moreButton);
			moreButton.innerHTML = "<a class='colorLink' href='javascript:;' onclick='ExpandableDiv.expand(\""+divId+"\")'>More&nbsp;&raquo;</a>";
		}
	},
	expand:function(divId) {
		var container = document.getElementById(divId+"Trimmed");
		var fullContent = document.getElementById(divId+"Content");
		var moreButton = document.getElementById(divId+"More");

		moreButton.style.display="none";
		var bounds = UIHelper.getBounds(container);
		var width = bounds.w;
		var startHeight = bounds.h;
		var endHeight = UIHelper.getBounds(fullContent).h;
		var animationHandler1 = new DimensionsAnimationHandler (container, {w:width, h:startHeight}, {w:width, h:endHeight});
		var animation = new Animation(0.5, [animationHandler1], AnimationTransformation.easeInOutSCurveTransform);
		animator.addAnimation(animation);
		animator.startAnimation(animation);
	}
}

var TabbedContainers = {
	containers:{},
	inventory:{},
	activeTabs:[],
	activeHandler:null,
	animator: window.animator,
	
	registerTab:function(containerId, tabId, tabTitle, tabContentHandler) {
		if (!this.containers[containerId]) {
			this.containers[containerId] = {
				tabs:[], 
				tabsRowDiv:document.getElementById(containerId+"Tabs"),
				moreDiv:document.getElementById(containerId+"ContentMore"),
				mainContentDiv:document.getElementById(containerId+"ContentPane")
			};
		}
		
		var container = this.containers[containerId];
		tabTitle = "<span>"+tabTitle+"</span>";
		var tabDiv = document.createElement("li");
		tabDiv.id = "tab_"+tabId;
		tabDiv.classname = "tab";
		var itemsCount = tabContentHandler.getTotalItemCount();
		if (itemsCount>0) {
			if (itemsCount > 9999) {
				itemsCount = "9999+";
			}
			tabTitle += " <small>("+itemsCount+")</small>";
		}
		tabDiv.innerHTML = "<a href='javascript:;' onclick='TabbedContainers.switchTab(\""+containerId+"\",\""+tabId+"\")'>" + tabTitle + "</a>";
		container.tabsRowDiv.firstChild.appendChild(tabDiv);
			
		var div = document.createElement("div");
		div.className = "tabbedContentDiv";
		container.mainContentDiv.appendChild(div);
		container.tabs[tabId] = {id:tabId, title:tabTitle, contentDiv:div, contentHandler:tabContentHandler};
		
		tabContentHandler.containerId = containerId;
	},
	
	updateCount:function(tabId,itemsCount){
		var tabElement = document.getElementById("tab_"+tabId);
		var itemsCountElement = tabElement.getElementsByTagName("small")[0];
		if(typeof itemsCountElement == "undefined"){
			itemsCountElement = document.createElement("small");
			tabElement.getElementsByTagName("a")[0].appendChild(document.createTextNode(" "));
			tabElement.getElementsByTagName("a")[0].appendChild(itemsCountElement);
		}
		if (itemsCount>0) {
			if (itemsCount > 9999) {
				itemsCount = "9999+";
			}
		}
		itemsCountElement.innerHTML = "("+itemsCount+")";
	},
	
	getContentDiv:function(containerId, tabId) {
		return this.containers[containerId].tabs[tabId].contentDiv;
	},
	
	switchTab:function(containerId, tabId) {
		/* update the tabs */
		var container = this.containers[containerId];	// the current container
		var panel = container.tabsRowDiv;				// the div for the tabs
		var children = panel.getElementsByTagName("li");
		for (var i=0; i<children.length; i++)
		{
			var child = children[i];
			if (child.id == "tab_"+tabId)
				child.className = "tab selected";
			else
				child.className = "tab";
			child.getElementsByTagName("a")[0].blur();
		}
		/* update the panels - hide and show */
		for (var id in container.tabs) {
			var tab = container.tabs[id];
			tab.contentDiv.style.display = (tab.id == tabId)?"block":"none";
		}
		/* store pointer to current active tab and update screen */
		var tab = container.tabs[tabId];
		container.activeTab = tab;
		if (tab.contentHandler) {
			container.activeHandler = tab.contentHandler;
			if (!container.activeHandler.isRendered) {
				container.activeHandler.reset();
				container.activeHandler.refresh();
			}
			this.adjustTabHeight(containerId);
		}
	},
	
	hideContainer:function(containerId) {
		var containerDiv;
		containerDiv = document.getElementById(containerId + 'Div');
		if(containerDiv)
			containerDiv.style.display = 'none';
	},
	showExpandButton:function(containerId, display, title, callback) {
		var moreDiv = this.containers[containerId].moreDiv;
		var moreTitle = moreDiv.firstChild;
		moreDiv.style.display = display?"block":"none";
		/*
		if(!display) {
			moreDiv.style.height = "1px";
			moreDiv.style.overflow = "hidden";

		}
		*/
		moreTitle.innerHTML = "<img class='inventoryExpandArrow' src='"+HZ.utils.Config.emptyGifData+"'> "+title+" <img class='inventoryExpandArrow' src='"+HZ.utils.Config.emptyGifData+"'>";
	},
	
	expandCurrentTab:function(containerId) {
		var container = this.containers[containerId];
		var handler = container.activeHandler;
		if (handler) {
			handler.expand();
			this.adjustTabHeight(containerId);
		}
	},
	
	adjustTabHeight:function(containerId) {
		var container = this.containers[containerId];
//		var rect = UIHelper.getBounds(container.activeTab.contentDiv);
//		var targetHeight = Math.max(rect.h, 254);
//		var containerRect = UIHelper.getBounds(container.mainContentDiv);
//
//		var animationHandler1 = new DimensionsAnimationHandler (container.mainContentDiv, {w:containerRect.w, h:containerRect.h}, {w:containerRect.w, h:targetHeight});
//		var animation = new Animation(0.1, [animationHandler1], AnimationTransformation.easeInOutSCurveTransform);
//		this.animator.addAnimation(animation);
//		this.animator.startAnimation(animation);

		var handler = container.activeHandler;
		var expandButton = handler.getExpandButtonProperties();		
		this.showExpandButton(containerId, expandButton.enabled, expandButton.title);
	}
}


var PolaroidRenderer = {
	defaultItemsCount:3,
	getItemClassName:function(index) {
		return (index%3==2)?"inventoryItemLast":"inventoryItem";
	},
	render:function(item) {
		var description = "<span class='polaroidTitle'>"+item.description+"</span>";
		var shared = item.shared ? " - Shared" : "";
		var link = item.link;
		var count = item.count || "";
		if (count)
			count = " <small>("+count+" photo"+((count>1)?"s":"")+")</small>";
		var html = "";
		html += "<a href='"+link+"'><div class='polaroidItem'>";
		if (item.spaceIds)
			html += getMosaicHtmlForSpaceIds(item.spaceIds, false, null, 'mosaic');
		html += "<div class='polaroidDesc'>"+description+shared+count+"</div>";
		html += "</div></a>";		
		return html;
	}
}

var CommentRenderer = {
	defaultItemsCount:2,
	getItemClassName:function(index) {
		return "commentInventoryItem";
	},
	render:function(item) {
		var description = item.description;
		var link = item.link;
		var author = item.author;
		var html = "";
		html += "<div class='commentItem'>";
		if (item.spaceIds)
			html += getMosaicHtmlForSpaceIds(item.spaceIds, false, null, 'mosaic');
		html += "<div class='commentDesc'>"+HZ.userProfile.render.User.getUserImageHtml(author)+description+"</div>";
		html += "</div>";
		return html;
	}
}
	
var QuestionRenderer = {
	defaultItemsCount:2,
	getItemClassName:function(index) {
		return "questionInventoryItem";
	},
	render:function(item) {
		var isReply = item.isReply;
		var questionIsPoll = item.qIsPoll;
		var questionUser = item.userId;
		var questionTitle = item.title||"";
		var hasRealTitle = item.hasRealTitle;
		var questionText = item.text||"";
		var questionTimeAgo = item.timeAgo;
		var questionTopic = item.topic||"";
		var questionIconStrip = item.iconStrip;
		var link = item.link;
		var spaceId = item.spaceIds?item.spaceIds[0]:null;
		var questionIsPost = item.isPost;

		var html = "";
		html += "<div class='questionItem'>";
		var pollCorner = "";
		if (questionIsPoll){
			pollCorner = "<div class='pollCorner'></div>";
		}
		if (spaceId)
		{
			var imgSrc = HZ.utils.Links.getSpaceImageUrl (spaceId, 80, 80);
		} else {
			if (questionIsPoll) {
				var imgSrc = HZ.utils.Links.getPicUrl("genericPoll.png");
			} else {
				var imgSrc = HZ.utils.Links.getPicUrl("genericQuestion.png");
			}
		}
		html += "<div class='questionItemImage'><a href='"+link+"'>"+pollCorner+"<img src='"+imgSrc+
			"' class='questionImage0'></a></div>";
		if (!questionIsPost) {
			html += "<div class='questionTitle'><a href='"+link+"'>"+questionTitle+"</a></div>";
		}
		html += "<div class='questionItemDetail'>" + HZ.userProfile.render.User.getUserImageHtml(questionUser) +
				"<div class='questionItemText'><span class='questionAuthorName'>" +
				HZ.userProfile.render.User.getUsersHtml(questionUser) + " </span>";
		if (isReply){
			html += "commented:";
			link += "#comments";
		}
		else{
			if(questionText && hasRealTitle || questionIsPost){
				html += "posted:";
			} else{
				html += "started a discussion.<br/>";
			}
		}
		if(questionText&&(questionIsPost || (hasRealTitle || !hasRealTitle && isReply))){
			html += "<div><a href='"+link+"'>"+questionText+"</a></div>";
		}
		html += "<div class='questionInfo'>"+questionTimeAgo+" ago";
		if (!questionIsPost) {
			var topicLink = HZ.utils.Links.getQuestionTopicLink(questionTopic);
			html += " in <a href='"+topicLink+"' class='colorLink'>"+questionTopic+"</a>";
		}
		html += questionIconStrip;
		html += "</div></div></div></div>";
		return html;
	}
}

var FavesRenderer = {
	defaultItemsCount:99,
	galleryTpl: '<div class="faveItem">\n\
						<div class="faveImgDiv">\n\
							<a href="%link%"><img src="%img%" class="grayFiller faveImg"></a>\n\
						</div>\n\
						<div class="faveTitle"><a href="%link%">%title%</a></div>\n\
						<div class="faveDetail">by %userLink%</div>\n\
					</div>\n\
					<a href="javascript:;" title="Remove bookmark" class="deleteBookmark" op="u" fty="g" fid="%iid%"></a>',
	questionTpl: '<div class="faveItem">\n\
					<div class="faveImgDiv">\n\
						<a href="%link%"><img src="%img%" class="faveImg"></a>\n\
					</div>\n\
					<div class="faveTitle"><a href="%link%">%title%</a></div>\n\
					<div class="faveDetail">%action% by %userLink% %timeAgo% ago</div>\n\
				</div>\n\
				<a href="javascript:;" title="Remove bookmark" class="deleteBookmark" op="u" fty="q" fid="%iid%"></a>',
	getItemClassName:function(index) {
		return (index%2==0)?"faveInventoryItem":"faveInventoryItemLast";
	},
	render:function(item) {
		var html = "";
		if(item.fty=='q') {
			var isReply = item.isReply;
			var questionIsPoll = item.qIsPoll;
			var questionUser = item.userId;
			var questionTitle = item.title||"";
			var hasRealTitle = item.hasRealTitle;
			var questionTimeAgo = item.timeAgo;
			var link = item.link;
			var spaceId = item.spaceIds?item.spaceIds[0]:null;
			var action = "";
			if (spaceId)
			{
				var imgSrc = HZ.utils.Links.getSpaceImageUrl (spaceId, 40, 40);
			} else {
				if (questionIsPoll){
					var imgSrc = HZ.utils.Links.getPicUrl("genericPoll.png");
				}
				else{
					var imgSrc = HZ.utils.Links.getPicUrl("genericQuestion.png");
				}
			}
			if (isReply){
				action = "commented";
				link += "#comments";
			}
			else{
				action = "posted ";
			}
			html = HZ.utils.Html.template(this.questionTpl,{
				'%link%':item.link,
				'%img%':imgSrc,
				'%title%':item.title,
				'%action%':action,
				'%userLink%':HZ.userProfile.render.User.getUsersHtml(questionUser),
				'%timeAgo%':questionTimeAgo,
				'%iid%':item.id
			});
		}
		else {
			var spaceId = item.spaceIds[0];
			var imgSrc = '';
			if(spaceId==undefined) {
				imgSrc = HZ.utils.Config.emptyGifData;
			}
			else {
				imgSrc = HZ.utils.Links.getSpaceImageUrl (item.spaceIds[0], 40, 40);
			}
			
			html = HZ.utils.Html.template(this.galleryTpl,{
				'%link%':item.link,
				'%img%':imgSrc,
				'%title%':item.description,
				'%userImg%':HZ.userProfile.render.User.getUserImageHtml(item.userId),
				'%userLink%':HZ.userProfile.render.User.getUsersHtml(item.userId),
				'%iid%':item.id
			});
		}
		return html;
	},
	onRenderDone: function(){
		$('#inventoryContentPane').on('click','.deleteBookmark',function(){
			var $btn = $(this);
			var removeFave = function(){
				var op = $btn.attr('op'),
				fty = $btn.attr('fty'),
				fid = $btn.attr('fid');
				var url = '/follow'+'/op='+op+'/t='+fty+'/i='+fid;
				$.ajax({
					url:url,
					cache:false,
					type:'GET',
					success: function(data) {
						HZ.ui.yamdi.Common.hideAllDialogs();
						var dataObj = $.parseJSON(data);
						if(dataObj && dataObj.success=='true') {
							var inventory = favesInventory.inventory;
							var itemList = $.grep(inventory,function(a){return a.type==fty;});
							var items = itemList[0].items;
							for(var i = 0; i < items.length; i++) {
								var it = items[i];
								if(it.id==fid) {
									items.splice(i,1);
									break;
								}
							}
							favesInventory.reset();
							favesInventory.refresh();
							TabbedContainers.updateCount("faves", favesInventory.getTotalItemCount());
							TabbedContainers.switchTab("inventory","faves");
							HZ.ui.yamdi.Common.alert('Remove bookmark','Page is removed from your bookmarks.');
						}
						else {
							HZ.ui.yamdi.Common.alert('Remove Bookmarks failed', 'Error: '+dataObj.error);
						}
					}
				});
			}
			HZ.ui.yamdi.Common.confirm('Remove bookmark',
				'Are you sure you want to remove this from bookmarks?',
				'Remove',hitch(this,removeFave));
		});
		//only needs to be done once.
		FavesRenderer.onRenderDone = null;	
	}
}
var GFT = {	// Generic Feed Template
	getIdsArrayFromItemsArray:function(items) {
		var returnValue = [];
		for(var i=0; i<items.length; i++)
			returnValue.push (items[i].i);
		return returnValue;
	},
	getTextHtml:function (items) {
		if (items) {
			switch (items.t) {
				case "u": return HZ.userProfile.render.User.getUsersHtml (this.getIdsArrayFromItemsArray(items.d));
				case "g": return getPageLinkHtml ({title:items.d[0].t, link:HZ.utils.Links.getGalleryLink(items.d[0].i)});
				case "q":
					var text= "";
					if ((items.d[0].t) && (items.d[0].title))
						text = items.d[0].title+" - \""+items.d[0].t+"\"";
					else if (items.d[0].title)
						text = items.d[0].title;
					else if (items.d[0].t)
						text = items.d[0].t;
					return getPageLinkHtml ({title: text, link:HZ.utils.Links.getQuestionLink(items.d[0].i)});
				case "c": return items.d[0].t;
				case "a": return items.d[0].t;
                case "e": return getPageLinkHtml ({title:items.d[0].t, link:HZ.utils.Links.getViewEndorsementLink(items.d[0].i)});
				case "h": return getPageLinkHtml ({title:'photo', link:HZ.utils.Links.getSpaceLink(items.d[0].i)});
			}
		}
	},
	getShortTextHtml:function (items) {
		if (items) {
			switch (items.t) {
				case "u": return HZ.userProfile.render.User.getUsersHtml (this.getIdsArrayFromItemsArray(items.d));
				case "g": return getPageLinkHtml ({title:items.d[0].t, link:HZ.utils.Links.getGalleryLink(items.d[0].i)});
				case "q":
					var text= "";
					if (items.d[0].title)
						text = items.d[0].title;
					else if (items.d[0].t) {
						text = items.d[0].t;
						if (text.length > 110) {
							text = text.substring(0, 110) + "...";
						}
					}
					return getPageLinkHtml ({title: text, link:HZ.utils.Links.getQuestionLink(items.d[0].i)});
				case "c": 
					var text = items.d[0].t;
					if (text.length > 150) {
						text = text.substring(0, 150) + "...";
					}
					return text;
				case "a": 
					var text = items.d[0].t;
					if (text.length > 150) {
						text = text.substring(0, 150) + "...";
					}
					return text;
                case "e": return getPageLinkHtml ({title:items.d[0].t, link:HZ.utils.Links.getViewEndorsementLink(items.d[0].i)});
				case "h": return getPageLinkHtml ({title:'photo', link:HZ.utils.Links.getSpaceLink(items.d[0].i)});
			}
		}
	},
		getObjectLink:function (item) {
		if (item) {
			switch (item.t) {
				case "u": return HZ.utils.Links.getUserLink(item.d[0].i);
				case "g": return HZ.utils.Links.getGalleryLink(item.d[0].i);
				case "q": return HZ.utils.Links.getQuestionLink(item.d[0].i);
				case "c": return "javascript:;";
				case "e": return HZ.utils.Links.getViewEndorsementLink(item.d[0].i);
				case "h": return HZ.utils.Links.getSpaceLink(item.d[0].i);
			}
		}
	},
	getBestThumbHtml:function (item) {
		var spaces = item.o.h;
		var gallery = item.o.g;
		var project = item.o.pj;
		var question = item.o.q;
		var thumb = null;
		if (typeof spaces !== 'undefined')
			thumb = GFT.getThumbHtml(spaces);
		else if (typeof gallery !== 'undefined')
			thumb = GFT.getThumbHtml(gallery);
		else if (typeof project !== 'undefined' && typeof project.d[0].f !== 'undefined' && project.d[0].f.length>0)
			thumb = GFT.getThumbHtml(project);
		else if (typeof question !== 'undefined' && typeof question.d[0].imgs !== 'undefined' && question.d[0].imgs.length>0)
			thumb = GFT.getThumbHtml(question);
		return thumb;
	},
	getBestThumbHtmlForComment:function (item) {
		var gallery = item.o.g;
		var question = item.o.q;
		var answer = item.o.a;
		var comment = item.o.c;
		var thumb = null;
		if (typeof answer !== 'undefined' && typeof question !== 'undefined') {
			if(typeof answer.d[0].imgs !== 'undefined' && answer.d[0].imgs.length>0) {
				thumb = getMosaicHtmlForImages(answer.d[0].imgs, false, HZ.utils.Links.getQuestionLink(question.d[0].i), 'mosaic');
			} else {
				thumb = GFT.getBestThumbHtml(item)
			}
		} else if(typeof comment !== 'undefined' && typeof gallery !== 'undefined') {
			thumb = GFT.getThumbHtml(gallery);
		}
		return thumb;
	},
	getThumbHtml:function (items) {
		if (items) {
			switch (items.t) {
				case "g": return getMosaicHtmlForSpaceIds(items.d[0].f, false, HZ.utils.Links.getGalleryLink(items.d[0].i), 'mosaic');
				case "h": return getMosaicHtmlForSpaceIds(items.d, true);
				case "u": return HZ.userProfile.render.User.getUserImageHtml(items.d[0].i);
				case "q": return getMosaicHtmlForImages(items.d[0].imgs, false, HZ.utils.Links.getQuestionLink(items.d[0].i), 'mosaic');
				case "pj": return getMosaicHtmlForSpaceIds(items.d[0].f, false, HZ.utils.Links.getProjectLink(items.d[0].i), 'mosaic');
			}
		}
		return "";
	},
	getProductTagsHtml: function(items,photoUrl) {
		var html = '';
		var max = 3;
		var len = items.d.length;
		var l = Math.min(len,max);
		if(items) {
			html += '<div class="tagsfeed">';
			for(var i = 0; i<l; i++)
			{
				var item = items.d[i];
				html += '<div>';
				html += '<a href="'+HZ.utils.Links.getSpaceLink(item.i)+'">';
				html += '<img src="'+HZ.utils.Links.getSpaceImageUrl(item.i, 40, 40, true)+'"/>';
				html += item.t;
				html += '</a>';
				html += '</div>';
			}
			if(l != len && photoUrl)
			{
				html += '<div>';
				html += '<a href="'+photoUrl+'">See all tags &raquo;</a>';
				html += '</div>';
			}
			html += '</div>';
		}
		return html;
	},
	getTextTagsHtml: function(items,photoUrl) {
		var html = '';
		var max = 3;
		var len = items.d.length;
		var l = Math.min(len,max);
		if(items) {
			html += '<div class="tagsfeed">';
			for(var i = 0; i<l; i++)
			{
				var item = items.d[i];
				html += '<div>';
				html += '&quot;'+item.text+'&quot;';
				html += '</div>';
			}
			html += '<div>';
			html += '<a href="'+photoUrl+'">See all tags &raquo;</a>';
			html += '</div>';
			html += '</div>';
		}
		return html;
	},
	getGalleryTitleHtml: function(gallery) {
		var link = HZ.utils.Links.getGalleryLink(gallery.d[0].i);
		var subtitle = gallery.d[0].s || '';
		html = '<h3>'+GFT.getTextHtml(gallery)+'</h3>';
		html += '<p>'+subtitle+' <a class="colorLink" href="'+link+'">Full story &raquo;</a></p>';
		return html;
	}
}

var FeedTemplates = {
	1:	{
		type: "AddToIdeabook",
		render:function(item) {
			var users = item.o.u;
			var spaces = item.o.h;
			var count = item.o.h.c;
			var gallery = item.o.g;
			var photoText = count + " photo" + ((count>1)?"s":"");
			return {
				thumb: spaces?GFT.getThumbHtml(spaces):null,
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " added " + photoText + " to ideabook " + GFT.getTextHtml(gallery)
			}
		}
	},

	2:	{
		type: "AddProductToIdeabook",
		render:function(item) {
			var users = item.o.u;
			var spaces = item.o.h;
			var count = item.o.h.c;
			var gallery = item.o.g;
			var photoText = count + " product" + ((count>1)?"s":"");
			return {
				thumb: spaces?GFT.getThumbHtml(spaces):null,
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " added " + photoText + " to ideabook: " + GFT.getTextHtml(gallery)
			};
		}
	},
	
	3:	{
		type: "Follow",
		render:function(item) {
			var users = item.o.u;
			var followees = item.o.f;
			return {
				thumb: null,
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " is following " + GFT.getTextHtml(followees)
			}
		}
	},
	
	5:	{
		type: "ContributorFeaturedYourPhoto",
		render:function(item) {
			var users = item.o.u;
			var spaces = item.o.h;
			var gallery = item.o.g;
			var spaceIds = [];
			var photoText = (spaces.d.length > 1)?'photos':'photo';
			if (spaces && spaces.c > 0)
			{
				var i, c;
				for(i = 0, c = spaces.c; i < c; i++) {
					spaceIds.push(spaces.d[i].i);
				}
			}
			return {
				thumb: spaces?getMosaicHtmlForSpaceIds(spaceIds, true, null, 'mosaic'):null,
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " featured your "+photoText+" in ideabook",
				text: GFT.getGalleryTitleHtml(gallery)
			}
		}
	},
	6:	{
		type: "PhotoFeatured",
		render:function(item) {
			var users = item.o.u;
			var spaces = item.o.h;
			var gallery = item.o.g;
			var message = (spaces.d.length > 1)?"photos are":"photo is";
			var spaceIds = [];
			if (spaces && spaces.c > 0)
			{
				var i, c;
				for(i = 0, c = spaces.c; i < c; i++) {
					spaceIds.push(spaces.d[i].i);
				}
			}
			return {
				thumb: spaces?getMosaicHtmlForSpaceIds(spaceIds, true, null, 'mosaic'):null,
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + "'s "+message+" featured in an ideabook: ",
				text: GFT.getGalleryTitleHtml(gallery)
			}
		}
	},
	
	7:	{
		type: "Question",
		render:function(item) {
			var users = item.o.u;
			var spaces = item.o.h;
			var question = item.o.q;
			var topicLink = HZ.utils.Links.getQuestionTopicLink(question.d[0].topic);
			return {
				thumb:GFT.getBestThumbHtml(item),
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " posted in " + getPageLinkHtml({title:question.d[0].topic, link:topicLink}),
				text: "<div class='feedQuote'>" + GFT.getTextHtml(question) + "<div class='callToAction'><a href='"+GFT.getObjectLink(question)+"#addAnswer' class='colorLink'>Write a comment &raquo;</a></div></div>",
				icon: question.d[0].icon
			}
		}
	},

	8:	{
		type: "Answer",
		render:function(item) {
			var users = item.o.u;
			var question = item.o.q;
			var questionLink = HZ.utils.Links.getQuestionLink(question.d[0].i);
			var answer = item.o.a;
			var questionTitle = GFT.getTextHtml(question);
			return {
				thumb: GFT.getBestThumbHtml(item),
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " commented on " + getPageLinkHtml({title:questionTitle, link:questionLink}),
//				text: "<div class='feedQuote'><span class='feedQuestion'>Q</span>\"" + GFT.getTextHtml(question) + "\"</div><div class='feedQuote'><span class='feedAnswer'>A</span>\"" + answer.d[0].t + "\"</div>"
				text: "<div class='feedQuote'><a href='"+questionLink+"#"+answer.d[0].i+"'>\"" + answer.d[0].t + "\"</a><div class='callToAction'><a href='"+GFT.getObjectLink(question)+"#addAnswer' class='colorLink'>Write a comment &raquo;</a></div></div>",
				icon: question.d[0].icon
			}
		}
	},
	
	9:	{
		type: "Comment",
		render:function(item) {
			var users = item.o.u;
			var gallery = item.o.g;
			var comment = item.o.c;
			return {
				thumb: GFT.getThumbHtml(gallery),
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " commented on " + GFT.getTextHtml(gallery) + ":",
				text: "<div class='feedQuote'><a href='"+GFT.getObjectLink(gallery)+"#"+comment.d[0].i+"'>\"" + GFT.getTextHtml(comment) + "\"</a><div class='callToAction'><a href='"+GFT.getObjectLink(gallery)+"#addComment' class='colorLink'>Write a comment &raquo;</a></div></div>",
				icon: gallery.d[0].icon
			}
		}
	},
	
	10:	{
		type: "UploadPhoto",
		render:function(item) {
			var users = item.o.u;
			var spaces = item.o.h;
			var count = item.o.h.c;
			return {
				thumb: GFT.getThumbHtml(spaces),
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " uploaded " + count + " new photo" + ((count > 1)?"s":"")
			}
		}
	},

	11:	{
		type: "UploadProduct",
		render:function(item) {
			var users = item.o.u;
			var spaces = item.o.h;
			var count = item.o.h.c;
			var owner = item.o.o;
			return {
				thumb: GFT.getThumbHtml(spaces),
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " uploaded " + count + " new product" + ((count > 1)?"s":"") + " from " + GFT.getTextHtml(owner)
			}
		}
	},
	
	12:	{
		type: "TagProduct",
		render:function(item) {
			var users = item.o.u;
			var spaces = item.o.h;
			var products = item.o.t;
			
			return {
				thumb: GFT.getThumbHtml(spaces),
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " tagged a " + GFT.getTextHtml(spaces) + " with:",
				text: GFT.getProductTagsHtml(products, HZ.utils.Links.getSpaceLink(spaces.d[0].i))
			}
		}
	},
	13:	{
		type: "TagText",
		render:function(item) {
			var users = item.o.u;
			var spaces = item.o.h;
			var textTags = item.o.i;
			return {
				thumb: GFT.getThumbHtml(spaces),
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " tagged a " + GFT.getTextHtml(spaces) + " with:",
				text: textTags?GFT.getTextTagsHtml(textTags,HZ.utils.Links.getSpaceLink(spaces.d[0].i)):''
			}
		}
	},
	
	14: {
		type: "Receives a Recommendation",
		render:function(item) {
			var users = item.o.u;
			var targetPro = item.o.o;
			var endorsementData = item.o.e;
			var link = HZ.utils.Links.getViewEndorsementLink(endorsementData.d[0].i);
			return {
				uThumb: GFT.getThumbHtml(targetPro),
				action: GFT.getTextHtml(targetPro) + ' received a recommendation from ' + GFT.getTextHtml(users),
				text: '"'+GFT.getTextHtml(endorsementData)+'"'
			}
		}
	},
	15: {
		type: "Wrote a Recommendation",
		render:function(item) {
			var users = item.o.u;
			var targetPro = item.o.o;
			var endorsementData = item.o.e;
			var link = HZ.utils.Links.getViewEndorsementLink(endorsementData.d[0].i);
			return {
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + ' wrote a recommendation for ' + GFT.getTextHtml(targetPro),
				text: '"'+GFT.getTextHtml(endorsementData)+'"'
			}
		}
	},
	
	16: {
		type: "IdeabookPublished",
		render:function(item) {
			var users = item.o.u;
			var galleries = item.o.g;
			var link = HZ.utils.Links.getGalleryLink(galleries.d[0].i);
			var subtitle = item.o.g.d[0].s || '';
			return {
				thumb: GFT.getThumbHtml(galleries),
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " published an ideabook: ",
				text: GFT.getGalleryTitleHtml(galleries)
			}
			
		}
	},
	
	17:	{
		type: "UpdatedProfile",
		render:function(item) {
			var users = item.o.u;
			return {
				thumb: null,
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " updated their profile"
			}
		}
	},
	
	18:	{
		type: "Pending Recommendation",
		render:function(item) {
			var users = item.o.u;
			var endorsementData = item.o.e;
			var link = HZ.utils.Links.getViewEndorsementLink(endorsementData.d[0].i);
			return {
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + ' wrote you a recommendation that is <a href="'+link+'">pending your approval &raquo;</a>',
				text: '"'+GFT.getTextHtml(endorsementData)+'"'
			}
		}
	},
	
	19: {
		type: "IdeabookBookmarked",
		render:function(item) {
			var users = item.o.u;
			var galleries = item.o.f;
			return {
				thumb: GFT.getThumbHtml(galleries),
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " bookmarked an ideabook: ",
				text: GFT.getGalleryTitleHtml(galleries)
			}
			
		}
	},
	
	20: {
		type: "QuestionBookmarked",
		render:function(item) {
			var users = item.o.u;
			var spaces = item.o.h;
			var question = item.o.f;
			var topicLink = HZ.utils.Links.getQuestionTopicLink(question.d[0].topic);
			return {
				thumb: spaces?GFT.getThumbHtml(spaces):null,
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " bookmarked a discussion: ",
				text: "<div class='feedQuote'>" + GFT.getTextHtml(question) + "</div>",
				icon: question.d[0].icon
			}
		}
	},

	21:	{
		type: "VoteInPollOutgoing",
		render:function(item) {
			var users = item.o.u;
			var question = item.o.q;
			var images = question.d[0].imgs;
			var spaces = question.d[0].f;
			var thumbHtml = (spaces && spaces.length > 0) ? getMosaicHtmlForSpaceIds(spaces, false) :
				((images && images.length > 0) ? getMosaicHtmlForImages(images) : null);
			var topicLink = HZ.utils.Links.getQuestionLink(question.d[0].i);
			return {
				thumb: thumbHtml,
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " voted in the poll " + getPageLinkHtml({title:question.d[0].title, link:topicLink}),
				text: "<div class='feedPollVote feedQuote'>" + GFT.getTextHtml(question) + 
				"</div>"+getPageLinkHtml({title:"See Results", link:topicLink}, "feedPollVote dlgButton seeResultBtn"),
				icon: question.d[0].icon
			}
		}
	},
	
	22:	{
		type: "VoteInPollIncoming",
		render:function(item) {
			var users = item.o.u;
			var question = item.o.q;
			var images = question.d[0].imgs;
			var spaces = question.d[0].f;
			var thumbHtml = (spaces && spaces.length > 0) ? getMosaicHtmlForSpaceIds(spaces, false) :
				((images && images.length > 0) ? getMosaicHtmlForImages(images) : null);
			var topicLink = HZ.utils.Links.getQuestionLink(question.d[0].i);
			var title = "";
			if (question.d[0].title)
				title = question.d[0].title;
			else if (question.d[0].t) {
				var length = Math.max(110,question.d[0].t.length);
				title = question.d[0].t.substring(0,length);
			}
			return {
				thumb: thumbHtml,
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " voted in the poll " + getPageLinkHtml({title:title, link:topicLink}),
				text: "<div class='feedPollVote feedQuote'>" + GFT.getTextHtml(question) + 
					"</div>"+getPageLinkHtml({title:"Vote Now", link:topicLink}, "feedPollVote dlgButton voteBtn"),
				icon: question.d[0].icon
			}
		}
	},

	23:	{
		type: "AddToIdeabookForOwner",
		render:function(item) {
			var users = item.o.u;
			var spaces = item.o.h;
			var count = item.o.h.c;
			var gallery = item.o.g;
			var photoText = " your photo" + ((count>1)?"s":"");
			return {
				thumb: spaces?GFT.getThumbHtml(spaces):null,
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " added " + photoText + " to ideabook " + GFT.getTextHtml(gallery)
			}
		}
	},

	24:	{
		type: "AddProductToIdeabookForOwner",
		render:function(item) {
			var users = item.o.u;
			var spaces = item.o.h;
			var count = item.o.h.c;
			var gallery = item.o.g;
			var photoText = " your product" + ((count>1)?"s":"");
			return {
				thumb: spaces?GFT.getThumbHtml(spaces):null,
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " added " + photoText + " to ideabook: " + GFT.getTextHtml(gallery)
			};
		}
	},

	25:	{
		type: "Post",
		render:function(item) {
			var users = item.o.u;
			var question = item.o.q;
			var topicLink = HZ.utils.Links.getQuestionTopicLink(question.d[0].topic);
			return {
				thumb:GFT.getBestThumbHtml(item),
				uThumb: GFT.getThumbHtml(users),
				action: GFT.getTextHtml(users) + " ",
				text: "<div class='feedQuote'>" + GFT.getTextHtml(question) + "<div class='callToAction'><a href='"+GFT.getObjectLink(question)+"#addAnswer' class='colorLink'>Write a comment &raquo;</a></div></div>",
				icon: question.d[0].icon
			}
		}
	},
	
	26:	{
		type: "Like",
		
		render:function(item) {
			var users = item.o.u,
				question = item.o.q,
				gallery = item.o.g,
				answer = item.o.a,
				comment = item.o.c,
				spaces = item.o.h,
				link, title, text, thumb, actionText, descriptionText, icon,
				userCount = users.c;
			var result;
			thumb = GFT.getBestThumbHtml(item);
			if (question) {
				if(answer) {
					link = HZ.utils.Links.getQuestionLink(question.d[0].i);
					title = GFT.getShortTextHtml(question);
					if(thumb) {
						text = GFT.getTextHtml(answer);
					} else {
						text = GFT.getShortTextHtml(answer);
					}
					actionText = GFT.getTextHtml(users) + " like" + (userCount>1?"":"s") + " a comment on " + title;
					descriptionText = "<div class='feedQuote'><a href='"+link+"#"+answer.d[0].i+"'>\"" + text + "\"</a></div>";
				} else {
					actionText = GFT.getTextHtml(users) + " like" + (userCount>1?"":"s") + " a discussion: ";
					descriptionText = "<div class='feedQuote'>" + GFT.getTextHtml(question) + "</div>";
					icon = question.d[0].icon;
				}
				
			} else if (gallery) {
				if(comment) {
					link = HZ.utils.Links.getGalleryLink(gallery.d[0].i);
					title = GFT.getShortTextHtml(gallery);
					if(thumb) {
						text = GFT.getTextHtml(comment);
					} else {
						text = GFT.getShortTextHtml(comment);
					}
					actionText = GFT.getTextHtml(users) + " like" + (userCount>1?"":"s") + " a comment on " + title;
					descriptionText = "<div class='feedQuote'><a href='"+link+"#"+comment.d[0].i+"'>\"" + text + "\"</a></div>";
				} else {
					actionText = GFT.getTextHtml(users) + " like" + (userCount>1?"":"s") + " an ideabook: ";
					descriptionText = GFT.getGalleryTitleHtml(gallery);
				}
			}
			
			result = {
				thumb: thumb,
				uThumb: GFT.getThumbHtml(users),
				action: actionText,
				text: descriptionText
			};
			
			if(icon) {
				result.icon = icon;
			}
		
			return result;
		}
	}

}

var FeedBaseRenderer = {
	defaultItemsCount:10,
	getItemClassName:function() {return "feedItem"},
	showTimeAgo:false,
	render:function(item) {
		var html = "";	
		var template = FeedTemplates[item.t];
		if (template) {
			var result = template.render (item);
			var html = "<div class='feedUThumb'>"+result.uThumb+"</div>" +
				"<div class='feedDesc'>" +
				"<div class='feedAction'>" + result.action + "</div>";
			html += "<div class='feedInfo'>";
			if (this.showTimeAgo && item.e)
				html += "<span class='greyText'>" + item.e + " ago</span>";
			if (result.icon){
				if(this.showTimeAgo && item.e){
					html += " &middot; ";
				}
				html += result.icon;
			}
			html += "</div><div style='clear:both'></div>";
			if (result.thumb)
				html += "<div class='feedGraphic'>" + result.thumb + "</div>";
			if (result.text)
				html += "<div class='feedText'>" + result.text + "</div>";
			html += 
				"</div>";
			return html;			
		}
		else 
			return item.text;
	}
}
HZ.ns('HZ.feed.renderer');
HZ.feed.renderer.MyFeedHeaderRenderer = {
	renderHeader:function(headerData) {
		var html = '';
		var postDivs = $(".postToFollowers");
		if (postDivs.length == 1) {
			var postDiv = $(postDivs[0]);
			postDiv.detach();
			html += "<div class='postToFollowers'>";
			html += postDiv.html();
			html += "</div>";
		}

		var total = headerData.total;
		var newCount = headerData.newCount;
		if (newCount > 0) {
			html += "<div class='feedItem'><div class='feedDesc'><div class='feedAction' style='font-weight:bold;'>";
			var tabId = "myNotifications";
			var containerId = "feeds";
			var newCountText = "" + newCount + " new " + ((newCount > 1)? "notifications": "notification") + ". ";
			var linkText = "See all &raquo;";
			html += "You have " + newCountText;
			html += "<a href='javascript:;' onclick='TabbedContainers.switchTab(\""+containerId+"\",\""+tabId+"\")'>" + linkText + "</a>";
			html += "</div></div></div>";
		} else {
			//var linkText = "" + total + " " + ((total > 1)? "notifications": "notification") + ". ";
			//html += "You have ";
			//html += "<a href='javascript:;' onclick='TabbedContainers.switchTab(\""+containerId+"\",\""+tabId+"\")'>" + linkText + "</a>";
		}
		return html;
	}
}
HZ.feed.renderer.NotificationsHeaderRenderer = {
	renderHeader:function(headerData) {
		if (myFeedInventory.headerData.newCount > 0) {
			var timestamp = headerData.timestamp;
			var html = '';
			html += "<div id='notificationsHeader' class='feedItem'><div class='feedDesc'><div class='feedAction' style='font-weight:bold;'>";
			var linkText = "Clear New Notifications";
			html += "<a href='javascript:;' onclick='HZ.feed.clearNewNotifications(\"" + timestamp + "\");'>" + linkText + "</a>";
			html += "</div></div></div>";
			return html;
		}
		return '';
	}		
}
HZ.feed.renderer.SuggestionRenderer = {
	defaultItemsCount:10,
	getItemClassName:function() {return "suggItem"},
	showTimeAgo:false,
	renderUserImg:function(item) {
		var userLink = item.userLink;
		var html = '<div class="col suggUserImageDiv"><a href="'+userLink+'"><img src="'+item.userImg+'"></a></div>';
		return html;
	},
	renderFollowBtn:function(item) {
		var html = '';
		if(item.followButton)
		{
			var btn = item.followButton;
			var op = btn.isFollower?'u':'f';
			var onclickE = ' onclick=\'HZ.actions.Follow.updateFollow({"u":"'+btn.u+'","m":'+btn.m+'})\'';
			var onmouseoverE = ' onmouseover=\'HZ.actions.Follow.updateFollowBtn({"u":"'+btn.u+'","m":'+btn.m+'}, true)\'';
			var onmouseoutE = ' onmouseout=\'HZ.actions.Follow.updateFollowBtn({"u":"'+btn.u+'","m":'+btn.m+'}, false)\'';
			var evts = onclickE + onmouseoverE + onmouseoutE;
			html += '<a class="whitebutton" href="javascript:;"  title="Follow" id="followButton_'+btn.buttonId+'"'+evts+'>';
			html += 	'<div class="whitebuttonLeft">';
			html +=			'<div id="followButton_'+btn.buttonId+'_icon__" class="whitebuttonIcon buttonIconAddToIdeabook"></div>';
			html +=			'<div id="followButton_'+btn.buttonId+'_label__" class="label" style="color:black">'+btn.btnLabel+'</div>';
			html += 	'</div>';
			html += '</a>';
			html += '<input id="followOp_'+btn.buttonId+'" type="hidden" value="'+op+'"></input>';
		}
		return html;
	},
	
	renderNameAndBtn:function(item) {
		var html = '<div class="col suggNameBtn">';
		html += this.renderUserName(item);
		html += "<br/>";
		html += this.renderFollowBtn(item);
		html += '</div>';
		return html;
	},
	renderPhotos:function(item) {
		var max = 3;
		var html = '';
		if(item.photos && item.photos.length > 0)
		{
			html = '<div class="col suggPhotos">';
			var l = item.photos.length;
			for(var i = 0; i < l && i < max; i++){
				var space = item.photos[i];
				var sid = space.spaceId;
				var link = HZ.utils.Links.getSpaceLink(sid);
				var img = HZ.utils.Links.getSpaceImageUrl(sid,93,70);
				html +=  '<a rel="nofollow" href="'+link+'"><img src="'+img+'" height="70" width="93" class="galleryStripImage"></a>';
			}
			html += '</div>';
		}
		return html;
	},
	renderUserName:function(item) {
		var userLink = item.userLink;
		var html = '<a class="suggUserName colorLink" href="'+userLink+'">'+item.name+'</a>';
		return html;
	},
	render:function(item) {
		var html = "";
		html += this.renderUserImg(item);
		html += this.renderNameAndBtn(item);
		html += this.renderPhotos(item);
		return html;
	}
}
function InventoryPanel(tabId, itemsName, title) {
	this.containerId = null; // this value is set by the TabbedContainer, upon registering the panel
	this.tabId = tabId;
	this.itemsName = itemsName;
	this.inventory = [];
	this.drawnCount = 0;
	this.totalItemCount = 0;
	this.renderer = PolaroidRenderer;
	this.defaultContent = "";
	this.titleIsRendered = false;
	this.headerData = null;
	this.headerRenderer = null;
	this.headerIsRendered = false;
	this.renderHeaderWithDefaultContent = false;
	this.sortable = false;
	this.onUpdateSortable = null;
	this.isRendered = false;
	this.moveInventoryItem = function(old_index, new_index) {
		this.inventory.splice(new_index, 0, this.inventory.splice(old_index, 1)[0]);	
	},
	this.addItem = function(item) {
		this.inventory.push(item);
	}
	this.addItemToHead = function(item) {
		this.inventory.unshift(item);
	}
	this.setInventory = function(inventoryItems) {
		this.inventory = inventoryItems;
	}
	this.getTotalItemCount = function() {
		if (this.totalItemCount)
			return this.totalItemCount;
		else
			return this.getItemsCount();
	}
	this.setTotalItemCount = function(totalItemCount) {
		this.totalItemCount = totalItemCount;
	}
	this.getItemsCount = function() {
		return this.inventory.length;
	}
	this.reset = function() {
		this.drawnCount = 0;
		var div = TabbedContainers.getContentDiv(this.containerId, this.tabId);
		div.innerHTML = "";
		this.titleIsRendered = false;
		this.headerIsRendered = false;
	}
	this.refresh = function() {
		if (this.drawnCount == 0)
			this.populatePanel(0,this.renderer.defaultItemsCount);
	}
	this.expand = function() {
		if (this.drawnCount < this.inventory.length)
		{
			this.populatePanel(this.drawnCount, 200);
		}
	}
	this.getExpandButtonProperties = function(){
		var diff = this.inventory.length - this.drawnCount;
		return {
			enabled:(diff>0),
			title: "Show "+diff+" more "+itemsName
		}
	},
	this.renderHeader = function() {
		var html = '';
		if (this.headerRenderer && !this.headerIsRendered) {
			html += this.headerRenderer.renderHeader(this.headerData);
			this.headerIsRendered = true;
		}
		return html;
	}
	this.populatePanel = function(from, count) {
		var inv = this.inventory;
		var div = TabbedContainers.getContentDiv(this.containerId, this.tabId);
		
		var html = "";
		
		if (inv.length == 0)
		{
			if (this.renderHeaderWithDefaultContent)
				html += this.renderHeader();
			html += this.defaultContent;
		}
		else {
			if(title && !this.titleIsRendered) {
				html += "<h3>"+title+"</h3>";
				this.titleIsRendered = true;
			}
			html += this.renderHeader();
			
			for (var i=from; i<Math.min(inv.length, from+count); i++) {
				var item = inv[i];
				var renderer = window[item.renderer] || this.renderer;		
				var className = renderer.getItemClassName (i);
				//if(this.sortable) className += " move";
				html += "<div class='"+className+"'>" + renderer.render(item) + "</div>";
			}
			
			if(renderer.onRenderDone){
				renderer.onRenderDone.call();
			}
		}
		this.isRendered = true;
		$(div).append($(html));
		
		if(this.sortable){
			this.sortContentItems(div, this.onUpdateSortable);
		}
		this.drawnCount = Math.min(inv.length, from+count);
	},
	this.sortContentItems = function (contentDiv, callback) {
		var new_index, old_index, self = this;
		if(navigator.userAgent.toLowerCase().match(/firefox/)) {
			$('body').addClass('ff-hack');
			if(typeof ShareBar !== "undefined") {
				ShareBar.PARKED_TOP = 97;
				ShareBar.FORCE_LEFT = true;
				ShareBar.reposition();
				ShareBar.forceLeft();
			}
		}
		
		
		$(contentDiv).sortable({
			opacity: 0.8, 
			tolerance: 'pointer',
			update: function(event, ui){
				new_index = $(ui.item).index();
				// update inventory sequence
				self.moveInventoryItem(old_index, new_index)
				var ordering = $.map(self.inventory, function(elem, index){ 
					return elem.id; 
				});
				callback(ordering);
			},
			start: function(event, ui){
				old_index = $(ui.item).index();
			}
		});
	}
}
function MultiSectionPanel(tabId, itemsName, title)
{
	this.containerId = null; // this value is set by the TabbedContainer, upon registering the panel
	this.tabId = tabId;
	this.itemsName = itemsName;
	this.inventory = [];  //inventory is a collection of itemLists.
	this.renderer = null;	//set outside after init the panel
	this.defaultContent = "";
	this.titleIsRendered = false;
	this.headerData = null;
	this.headerRenderer = null;
	this.headerIsRendered = false;
	this.totalItemCount = 0;
	
	this.addList = function(title,type,items)
	{
		var itemList = {title:title,type:type,items:items};
		this.inventory.push(itemList);
	}

	this.getTotalItemCount = function() {
		if (this.totalItemCount)
			return this.totalItemCount;
		else
			return this.getItemsCount();
	}

	this.setTotalItemCount = function(totalItemCount) {
		this.totalItemCount = totalItemCount;
	}
	
	this.getItemsCount = function() {
		var count = 0;
		for(var i = 0,c=this.inventory.length; i<c; i++)
		{
			var itemList = this.inventory[i];
			count += itemList.items.length;
		}
		return count;
	}
	this.reset = function() {
		var div = TabbedContainers.getContentDiv(this.containerId, this.tabId);
		div.innerHTML = "";
		this.titleIsRendered = false;
		this.headerIsRendered = false;
	}
	this.refresh = function() {
		this.populatePanel();
	}
	this.getExpandButtonProperties = function(){
		return {
			enabled:false,
			title: ""
		}
	}
	this.populatePanel = function() {
		var inv = this.inventory;
		var div = TabbedContainers.getContentDiv(this.containerId, this.tabId);
		var renderer = this.renderer;
		var html = "";
		
		if (inv.length == 0)
			html = this.defaultContent;
		else {
			for (var i=0,c=inv.length; i<c; i++)
			{
				var itemList = inv[i];
				var items = itemList.items;
				var n = items.length;
				if(n > 0) {
					html += "<h3 class='sectionTitle'>"+itemList.title+"</h3>";
				}
				for (var j=0; j<n; j++) {
					var it = items[j];
					
					var className = renderer.getItemClassName(j);
					html += "<div class='"+className+"'>" + renderer.render(it) + "</div>";
				}
			}
			if(renderer.onRenderDone){
				renderer.onRenderDone.call();
			}
		}
		div.innerHTML += html;
	}
}
function EmptyPanel(tabId,defaultContent) {
	this.containerId = null; // this value is set by the TabbedContainer, upon registering the panel
	this.tabId = tabId;
	this.content = defaultContent || "";
	this.getTotalItemCount = function() {
		return 0;
	}
	this.getItemsCount = function() {
		return 0;
	}
	this.reset = function() {
		this.populatePanel();
	}
	this.refresh = function() {
		this.populatePanel();
	}
	this.populatePanel = function() {
		var div = TabbedContainers.getContentDiv(this.containerId, this.tabId);
		div.innerHTML = this.content;
	}
	this.getExpandButtonProperties = function(){
		return {
			enabled:false,
			title: ""
		}
	}	
}


window.hzmr.push("viewProfile:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End viewProfile.js  **************/
/************* Start newGallery.js **************/
try {// <script>
HZ.ns('HZ.galleries');
HZ.galleries.NewGalleryFormDialog = function () {
	
	var self = this;
	
	var newGalleryFormScreenTemplate = '<div class="newGalleryFormBody"><label for="newGalleryName">Ideabook Title</label>' +
										'<br/>' +
										'<input type="text" id="newGalleryName" name="newGalleryName" maxlength="%MAX%" value="%NEW_GALLERY_NAME%"/>' +
										'<br/><br/>' +
										'<input type="hidden" id="allowDuplicate" name="allowDuplicate" value="false"/>' +
										'<label for="newGalleryDescription">Enter ideabook notes here</label>' +
										'<br/>' +
										'<textarea id="newGalleryDescription" name="newGalleryDescription" rows="5"></textarea>' +
										'<div style="clear:both"></div>' +
										'</div>';
	
	var newGalleryNameInput, newGalleryDescriptionInput, newGalleryForm;
	
	//calling the super class constructor
	HZ.galleries.NewGalleryFormDialog.superclass.constructor.call(this);
	
	this.prepare = function (newGalleryNameMaxLength, defaultNewGalleryName) {
		var bodyHtml = HZ.utils.Html.template(newGalleryFormScreenTemplate,{
				'%MAX%': newGalleryNameMaxLength,
				'%NEW_GALLERY_NAME%': defaultNewGalleryName});
		
		var body = $(bodyHtml);

		//init this dialog
		var dialogSettings = {
			title: 'Create a New Ideabook',
			formName: 'newGalleryForm',
			dialogClassName: 'newGalleryDlg',
			body: body,
			controls: [HZ.ui.AjaxThrobber.getThrobber(),
						HZ.ui.InputButtonUtils.createSecondaryInputButton("Cancel","",function(){HZ.ui.Yamdi.hide(self);}),
						HZ.ui.InputButtonUtils.createPrimaryInputButton("Create", "createIdeabookBtn", null, true)],
			onViewLoaded: onDialogViewLoaded,
			onViewUnloaded: onDialogViewUnloaded
		};
		self.init(dialogSettings);
		
		newGalleryForm = self.getForm();
		newGalleryNameInput = body.find('#newGalleryName');
		newGalleryDescriptionInput = body.find('#newGalleryDescription');
		
		//bind events
		newGalleryForm.bind('submit',function () {
			self.submitNewGallery();
			return false;
		});
	};
	
	var checkFormError = function () {
		var errorMsg = null;
		if (newGalleryNameInput.val() == '') {
			errorMsg = "Please enter a title for the new ideabook.";
		}
		
		return errorMsg;
	};
	
	this.submitNewGallery = function () {
		var errorMsg, newGalleryNameVal, newGalleryDescriptionVal, allowDuplicate;
		
		errorMsg = checkFormError();
		if (!errorMsg) {
			self.hideStatus();
			newGalleryNameVal = newGalleryNameInput.val();
			newGalleryDescriptionVal = newGalleryDescriptionInput.val();
			allowDuplicate = newGalleryForm.find('#allowDuplicate').val();
			
			HZ.ui.AjaxThrobber.setInCall(true);
			HZ.ajaz.Services.newGallery(newGalleryNameVal, newGalleryDescriptionVal, allowDuplicate, onAjaxComplete);
		}
		else {
			self.showStatus(errorMsg);
			newGalleryNameInput.one('keydown', function () {
									self.hideStatus();
								})
								.focus();
		}
		return false;
	};
	
	this.setAllowDuplicate = function (isAllow) {
		newGalleryForm.find('#allowDuplicate').val(isAllow);
	};
	
	var onAjaxComplete = function (response) {
		HZ.ui.AjaxThrobber.setInCall(false);
		if(response.success == 'true') {
			
			var galleryName = newGalleryNameInput.val(),
				galleryLink = response.linkToGallery,
				galleryId = response.galleryId,
				selfCreatedGalleryCount = response.selfCreatedGalleryCount;
				
			$(self).trigger('complete',[galleryName, galleryLink, galleryId, selfCreatedGalleryCount]);
		}
		else {
			if (response.notitle === true){
				self.showStatus(response.error);
				newGalleryNameInput.one('keydown', function(){
										self.hideStatus();
									})
									.focus();
			}

			if (response.duplicate === true){
				$(self).trigger('confirmDuplicate',response.error);
			}

			else
			{
				$(self).trigger('internalError', 'Cannot create ideabook.  Please try again later.');
			}
		}
	};
	
	var onDialogViewLoaded = function () {
		HZ.ui.AjaxThrobber.setInCall(false);
		self.hideStatus();
		self.setAllowDuplicate(false);
		newGalleryNameInput.focus().select();
	}
	
	var onDialogViewUnloaded = function () {
		self.hideStatus();
	}
};
HZ.extend(HZ.galleries.NewGalleryFormDialog, HZ.ui.yamdi.Dialog);

HZ.galleries.ConfirmDuplicateDialog = function () {
	
	//calling the super class constructor
	HZ.galleries.ConfirmDuplicateDialog.superclass.constructor.call(this);
	
	var self = this;
	
	var cancelDupBtn = HZ.ui.InputButtonUtils.createSecondaryInputButton(
								"Go Back", 
								"cancelDuplication",
								function () {
									$(self).trigger('cancelDup');
								});
	var createDupBtn = HZ.ui.InputButtonUtils.createPrimaryInputButton(
								"Create",
								"createDuplication",
								function () {
									$(self).trigger('submitDup');
								});
	
	this.prepare = function () {
		var dialogSettings = {
			title: 'Create a New Ideabook',
			dialogClassName: 'newGalleryDlg',
			controls: [HZ.ui.AjaxThrobber.getThrobber(), cancelDupBtn, createDupBtn]
		};
		
		self.init(dialogSettings);
	};
	
	this.setDisplayMessage = function (message) {
		self.setBody(message);
	};
	
	
};
HZ.extend(HZ.galleries.ConfirmDuplicateDialog, HZ.ui.yamdi.Dialog);

HZ.galleries.NewGallery = new (function () {
	var newGalleryFormDialog, confirmDuplicateDialog;
	
	this.prepareDialogs = function (newGalleryNameMaxLength, defaultNewGalleryName, callback) {

		newGalleryFormDialog = new HZ.galleries.NewGalleryFormDialog();
		newGalleryFormDialog.prepare(newGalleryNameMaxLength, defaultNewGalleryName);

		confirmDuplicateDialog = new HZ.galleries.ConfirmDuplicateDialog();
		confirmDuplicateDialog.prepare();
				
		// dialog transitions
		$(newGalleryFormDialog).bind('confirmDuplicate', function (ev, errorMsg) {
			confirmDuplicateDialog.setDisplayMessage(errorMsg);
			HZ.ui.Yamdi.switchDialog(confirmDuplicateDialog);
		});
		$(newGalleryFormDialog).bind('internalError', function (ev, errorMsg) {
			HZ.ui.Yamdi.hide(newGalleryFormDialog);
			HZ.ui.yamdi.Common.alert('Create a New Ideabook', errorMsg);
		});
		$(newGalleryFormDialog).bind('complete', function (ev, galleryName, galleryLink, galleryId, selfCreatedGalleryCount) {
			var props = {
				id: galleryId,
				description: galleryName,
				link: galleryLink,
				count: "0",
				spaceIds: []
			};
			HZ.ui.Yamdi.hide(newGalleryFormDialog);
			if (ideabooksInventory && TabbedContainers) {
				ideabooksInventory.setSelfCreatedGalleryCount(selfCreatedGalleryCount);
				var newItemCount = ideabooksInventory.getTotalItemCount();
				ideabooksInventory.addItemToHead(props);
				ideabooksInventory.reset();
				ideabooksInventory.refresh();
				ideabooksInventory.setTotalItemCount(newItemCount+1);
				TabbedContainers.updateCount("ideabooks", ideabooksInventory.getTotalItemCount());
				TabbedContainers.switchTab("inventory","ideabooks");
			}
			if(callback && typeof callback == "function") {
				callback();
			}
		});
		
		$(confirmDuplicateDialog).bind('cancelDup', function () {
			newGalleryFormDialog.setAllowDuplicate(false);
			HZ.ui.Yamdi.switchDialog(newGalleryFormDialog);
		});
		
		$(confirmDuplicateDialog).bind('submitDup', function () {
			newGalleryFormDialog.setAllowDuplicate(true);
			newGalleryFormDialog.submitNewGallery();
		})
	}

	this.showNewGalleryFormDialog = function () {
		newGalleryFormDialog.resetForm();
		HZ.ui.Yamdi.show(newGalleryFormDialog);
	}
})();

window.hzmr.push("newGallery:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End newGallery.js  **************/
/************* Start spaceActions.js **************/
try {// <script>

	
function showAddToMyGalleryForm (spaceId) {
}	

function showPostToForumForm (spaceId, ownedByPro) {
}


HZ.ns("HZ.spaceActions");

/* **************************************************************************
 * Add to Ideabook 
 * ************************************************************************** */

HZ.spaceActions.AddToIdeabookDialog = new function() {
	var FORM_SCREEN = 0,
		CONFIRM_SCREEN = 1,
		spaceId = null,
		galleries = null,
		galleriesById = null,
		lastGalleryId = null,
		defaultGalleryTitle = null,
		view = null,	// jQuery object
		delegate = null,
		showIdeabookConfirm = true,
		commentField, privacyField, postToFbField, galleryChoiceField, newGalleryTitleField, galleryChoiceRadio, addToMyGalleryForm;
	
	this.init = function (_spaceId) {
		spaceId = _spaceId;
	};

	this.setDelegate = function (_delegate) {
		delegate = _delegate;
	};
	
	this.setGalleries = function (_galleries) {
		galleries = _galleries;
		galleriesById = {};
		if (galleries.recent && galleries.recent.length > 0)
		{
			for (var i in galleries.recent)
			{
				var gallery = galleries.recent[i];
				galleriesById[gallery.id] = gallery;
			}
		}
		if (galleries.own && galleries.own.length > 0)
		{
			for (var i in galleries.own)
			{
				var gallery = galleries.own[i];
				galleriesById[gallery.id] = gallery;
			}
		}
		if (galleries.shared && galleries.shared.length > 0)
		{
			for (var i in galleries.shared)
			{
				var gallery = galleries.shared[i];
				galleriesById[gallery.id] = gallery;
			}
		}
	};
	
	this.getGalleries = function () {
		return galleries;
	}
	
	this.setShowIdeabookConfirm = function(_showIdeabookConfirm) {
		showIdeabookConfirm = _showIdeabookConfirm;
	};
	
	this.setLastGalleryId = function (_lastGalleryId) {
		lastGalleryId = _lastGalleryId;
	};
	
	this.getLastGalleryId = function () {
		return lastGalleryId;
	};
	
	this.setDefaultGalleryTitle = function (_defaultGalleryTitle) {
		defaultGalleryTitle = _defaultGalleryTitle;
	};

	var handleGalleryChanged = function(event) {
		if (event)
		{
			switch (event.target.id) {
			case "gallerySelector":
				addToMyGalleryForm.selectGallery[0].checked=true;
				break;
			case "newGalleryTitle":
				addToMyGalleryForm.selectGallery[1].checked=true;
				break;
			default:
			}
		}

		if (addToMyGalleryForm && addToMyGalleryForm.selectGallery[0].checked)
		{
			// disable FB UI when adding to a private Ideabook
			if (galleryChoiceField.options.length > 0 && galleryChoiceField.options[galleryChoiceField.selectedIndex])
			{
				var galleryId = galleryChoiceField.options[galleryChoiceField.selectedIndex].value;
				var gallery = galleriesById[galleryId];
				if (gallery && gallery.isPrivate)
				{
					HZ.publish.Manager.setActionEnabled(true);
					$("#addToIdeabookDialog").addClass("disableFbTimelineUI");
					return;
				}
			}
		}

		HZ.publish.Manager.setActionEnabled(true);
		$("#addToIdeabookDialog").removeClass("disableFbTimelineUI");
	};

	this.getView = function () {
		// return a jQuery contents object
		if (!view) {
			view = $("<div id='addToIdeabookDialog'></div>")
				.addClass("dialogFrame")
				.append(
					"<div id='addToIdeabookDialog_"+FORM_SCREEN+"'>"
					+ "<div class='dialogTitle'>Add to Ideabook</div>"
					+ "<div class='dialogBody'>"
					+ "<form id='addToMyGalleryForm' name='addToMyGalleryForm' action='javascript:;'>"
					+ "<div class='dialogStatus' id='addToGalleryFormError'></div>"
					+ "<div class='dialogCaption'>What do you like about this space?</div>"
					+ "<div><textarea id='gallerySpaceComments' name='gallerySpaceComments'></textarea></div>"
					+ "<div id='gallerySpaceCommentsPrivacyDiv'><input id='gallerySpaceCommentsPrivacy' name='gallerySpaceCommentsPrivacy' type='checkbox' /><label for='gallerySpaceCommentsPrivacy'> make comment private</label></div>"
					+ "<table cellpadding=0 cellspacing=0 border=0 class='chooseGallery'>"
						+ "<tr><td width=50%><input id='existingGalleryRadio' type='radio' class='radio' name='selectGallery' value='existingGallery' /><label for='existingGalleryRadio'> existing ideabook:</label></td>"
						+ "<td class='inputField'><select id='gallerySelector' name='galleryId'></select></td></tr>"
						+ "<tr><td><input id='newGalleryRadio' type='radio' class='radio' name='selectGallery' value='newGallery' /><label for='newGalleryRadio'> or new ideabook:</label></td>"
						+ "<td class='inputField'><input id='newGalleryTitle' type='text' name='newGalleryTitle' value='' maxlength='71' /></td></tr>"
					+ "</table>"
					+ "<div id='postToFacebookDiv'><input id='postToFacebook' name='postToFacebook' type='checkbox' /><img src='http://www.houzz.com/res/1593/pic/spacer.gif?v=1593' />"
					+ "<span><label for='postToFacebook'>Add to Timeline</label></span><div id='postToFacebookNew'>NEW!</div>"
					+ "</div>"
					+ "<div id='postToFacebookToolTip'>"
					+ "<div class='leftTriangle'></div>"
					+ "<div class='toolTip'><span id='fbToolTip'>Share this photo with your friends on Facebook.</span><span id='fbToolTipPrivate'>Add to Timeline is disabled for private Ideabooks</span></div>"
					+ "</div>"
					+ "<div style='clear: both;'></div>"
					+ "</form>"
					+ "<div class='dialogControls'></div>"
					+ "</div></div>"
				)
				.append(
					"<div id='addToIdeabookDialog_"+CONFIRM_SCREEN+"'>"
					+ "<div class='dialogTitle'>This photo has been added to <a class='colorLink' href='' id='addToIdeabookGalleryLink'>your ideabook</a></div><div class='dialogBody'>"
					//+ "<div class='dialogCaption'>This photo has been added to your ideabook</div>"
					+ "<div class='addToIdeabookInfo'><div id='addToIdeabookImage'></div><div id='addToIdeabookFacebook'></div><div style='clear: both;'></div></div>"
					+ "<a id='addToIdeabookCTAMsg' class='colorLink' href='http://www.houzz.com/professionals#' target='_blank'>Ready to Renovate?  Find a local Pro &raquo;</a>"
					+ "<div id='addToIdeabookConfirmMsg'></div>"
					+ "<div class='dialogControls'></div>"
					+ "</div></div>"				
				);
				
			$("body").append(view);

			var cancelButton = HZ.ui.InputButtonUtils.createSecondaryInputButton("Cancel","",$.proxy(cancel,this));
			var addToIdeabookButton = HZ.ui.InputButtonUtils.createPrimaryInputButton("Add to Ideabook","",$.proxy(addToIdeabook,this));
			$("#addToIdeabookDialog_"+FORM_SCREEN+" .dialogControls", view)
				.append (HZ.ui.AjaxThrobber.getThrobber())
				.append (cancelButton)
				.append (addToIdeabookButton);

			var doneButton = HZ.ui.InputButtonUtils.createPrimaryInputButton("Done","",$.proxy(cancel,this));
			$("#addToIdeabookDialog_"+CONFIRM_SCREEN+" .dialogControls", view)
				//.append ("<a href='' class='colorLink' id='addToIdeabookGalleryLink'>Go to your ideabook &raquo;</a>")
				.append (doneButton);
			
			$("#postToFacebookDiv").mouseenter(function() {
				$("#postToFacebookToolTip").removeClass("hideToolTip");
			});
				
			commentField = $("#gallerySpaceComments")[0];
			privacyField = $("#gallerySpaceCommentsPrivacy")[0];
			galleryChoiceField = $("#gallerySelector")[0];
			galleryChoiceRadio = document.getElementsByName("selectGallery");
			newGalleryTitleField = $("#newGalleryTitle")[0];
			// set private reference to form that is used in handleGalleryChanged
			addToMyGalleryForm = document.forms.addToMyGalleryForm; 

			$("#gallerySelector").change(handleGalleryChanged);
			$("#gallerySelector").focus(handleGalleryChanged);
			$("#newGalleryTitle").focus(handleGalleryChanged);
			$("#existingGalleryRadio").click(handleGalleryChanged);
			$("#newGalleryRadio").click(handleGalleryChanged);
		}
		return view;
	};

	this.viewLoaded = function () {
		// reset the form:
		showError("");
		commentField.value = "";
		privacyField.checked = false;
		HZ.ui.AjaxThrobber.setInCall(false);
		this.updateGalleriesList();
		// show the first screen:
		showScreen(FORM_SCREEN);
		commentField.focus();

		HZ.publish.Manager.initAction("fb_publish_addtoideabook",
            function(val) {
		        var postToFbField = $("#postToFacebook")[0];
		        if (postToFbField)
			        postToFbField.checked = (val == 1 || val == 2);
            },
            function() {
            	var postToFbField = $("#postToFacebook")[0];
                return postToFbField ? (postToFbField.checked ? 1 : 0) : null;
            }
        );

		if (HZ.publish.Manager.isUiShown()) {
			$("#addToIdeabookDialog").removeClass("fbTimelineDisabled");
		} else {
			$("#addToIdeabookDialog").addClass("fbTimelineDisabled");
		}
		
		if (HZ.publish.Manager.isPromoShown()) {
			$("#addToIdeabookDialog").removeClass("hideFbPromo");
		    $("#postToFacebookToolTip").removeClass("hideToolTip");
		}
		else {
			$("#addToIdeabookDialog").addClass("hideFbPromo");
			$("#postToFacebookToolTip").addClass("hideToolTip");
			
			$("#postToFacebookDiv").mouseleave(function() {
				$("#postToFacebookToolTip").addClass("hideToolTip");
			});
		}
	};
	
	this.updateGalleriesList = function () {
		var featured, gallery;

		// populate the Questions Topic list:
		galleryChoiceField.length = 0;
		
		if (galleries.recent.length > 0)
			HZ.ui.Utils.addOptionToSelect (galleryChoiceField, "-------- recently used: --------", -1);
			
		for (var i=0; i<galleries.recent.length; i++) {
			gallery = galleries.recent[i];
			featured = gallery.featured?"[featured] ":"";
			HZ.ui.Utils.addOptionToSelect (galleryChoiceField, featured + gallery.title, gallery.id, gallery.id == lastGalleryId, gallery.id == lastGalleryId);
		}
		
		if (galleries.recent.length > 0)
			HZ.ui.Utils.addOptionToSelect (galleryChoiceField, "-------- your ideabooks: --------", -1);

		for (var i=0; i<galleries.own.length; i++) {
			gallery = galleries.own[i];
			featured = gallery.featured?"[featured] ":"";
			HZ.ui.Utils.addOptionToSelect (galleryChoiceField, featured + gallery.title, gallery.id, gallery.id == lastGalleryId, gallery.id == lastGalleryId);			
		}
		
		if (galleries.shared.length > 0)
			HZ.ui.Utils.addOptionToSelect (galleryChoiceField, "-------- shared ideabooks: --------", -1);
		
		for (var i=0; i<galleries.shared.length; i++) {
			gallery = galleries.shared[i];
			HZ.ui.Utils.addOptionToSelect (galleryChoiceField, "[shared] " + gallery.title, gallery.id, gallery.id == lastGalleryId, gallery.id == lastGalleryId);
		}
		
		if (galleries.own.length || galleries.shared.length) {
			galleryChoiceRadio[0].checked = true;
			newGalleryTitleField.value = "";
		} else {
			galleryChoiceRadio[1].checked = true;
			newGalleryTitleField.value = defaultGalleryTitle;
		}

		handleGalleryChanged(null);
	}
	
	this.viewUnloaded = function () {};
	
	function showScreen(screenId) {
		var divId = "addToIdeabookDialog_" + screenId;
		view.children().each(
			function(i) {
				this.style.display = (this.id == divId)?"block":"none";
			}
		)
		delegate.center();
	}	

	function addToIdeabook() {
		if (HZ.ui.AjaxThrobber.isInCall())
			return;

		// validation:
		showError("");
		if ((document.forms.addToMyGalleryForm.selectGallery[1].checked && UIHelper.trim(newGalleryTitleField.value) == "") ||
				(document.forms.addToMyGalleryForm.selectGallery[0].checked && galleryChoiceField.selectedIndex < 0))
			return showError ("Please enter a title for a new ideabook");
		if (document.forms.addToMyGalleryForm.selectGallery[0].checked && galleryChoiceField.options[galleryChoiceField.selectedIndex].value < 0)
			return showError ("Please select an ideabook");

		HZ.publish.Manager.processAction($.proxy(processAddToIdeabook, this), true);
	}

	function processAddToIdeabook() {

		var params = '/id='+spaceId;

		if (document.forms.addToMyGalleryForm.selectGallery[1].checked) {
			params += '/gtitle='+encodeURIComponent(encodeURIComponent(newGalleryTitleField.value));
		} else {
			var galleryId = galleryChoiceField.options[galleryChoiceField.selectedIndex].value;
			params += '/gid='+galleryId;
		}

		var privacy = privacyField.checked?1:3;
		params += '/privacy='+privacy;
		params += '/comments='+encodeURIComponent(encodeURIComponent(commentField.value));

		HZ.ui.AjaxThrobber.setInCall(true);
		ajaxc.makeRequest('/addToGallery','a', params, $.proxy(addToIdeabookCallback, this),'');
	}

	function addToIdeabookCallback(data) {
		HZ.ui.AjaxThrobber.setInCall(false);
		if (data.success == "true") {
			this.setLastGalleryId(data.galleryId);
			if (data.isNewGallery == "true") {
				galleries.own.unshift({id:data.galleryId, title:data.galleryTitle});
				this.updateGalleriesList();
			}

			_gaq.push(['_trackEvent', 'AddToIdeabookDialog', 'added', (HZ.publish.Manager.isPublishExpected() ? "timeline" : "no_timeline")]);

			var userFbOptIn = HZ.publish.Manager.isPrefChanged() && HZ.publish.Manager.isPublishExpected();
			if (showIdeabookConfirm)
			    updateConfirmScreen(data, userFbOptIn);
			else
				cancel(); // done; just close this dialog
		} else {
			var link="";
			if(data.galleryId){
				link = "<br/><a class='boldLink colorLink' style='position:relative;top:5px;' href='http://www.houzz.com/ideabooks/"+data.galleryId+"/thumbs'>Go to your ideabook &raquo;</a>"
			}
			showError(data.error+link);
		}
	}

	function updateConfirmScreen(data, userFbOptIn) {
		var galleryUrl = HZ.utils.Links.getGalleryLink(data.galleryId);
		$("#addToIdeabookImage")
			.empty()
			.append ("<img src='"+data.imageUrl+"'>");
		$("#addToIdeabookFacebook")
			.empty()
			.append ("Like this photo on facebook!<br>"
				+ "<iframe src='http://www.facebook.com/plugins/like.php?href="+data.spaceUrl+"&layout=button_count&show_faces=false&width=80&height=21&action=like&font=arial&colorscheme=light&ref=addibk' "
				+ "scrolling='no' frameborder='0' allowTransparency='true' id='addToIdeabookFacebookFrame'></iframe>"
			);
		$("#addToIdeabookConfirmMsg").empty();
		if (userFbOptIn)
		{
			$("#addToIdeabookConfirmMsg")
			.append ("<div>Photos saved to your public ideabooks will now be shared to your Facebook timeline.<br /><br /><a href='http://www.houzz.com/editProfile2' class='colorLink'>You can edit this setting at any time.</a></div>");
		}
		if (data.isProduct === true) {
			$("#addToIdeabookCTAMsg").hide();
		} else {
			HZ.utils.Logger.sendEventLog('atici');
			$("#addToIdeabookCTAMsg")
				.unbind("mousedown")
				.bind("mousedown", function(){HZ.utils.Logger.sendEventLog('aticfp') })
				.show();
		}	
		$("#addToIdeabookGalleryLink")
			.attr("href", galleryUrl);
		
		showScreen(CONFIRM_SCREEN);
	}

	function cancel () {
		delegate.hide(null);
	}

	function showError(message) {
		$("#addToGalleryFormError")
			.empty()
			.append(message);
		if (message) {
			$("#addToGalleryFormError").show();
		}
		else {
			$("#addToGalleryFormError").hide();
		}

	}
};













/* **************************************************************************
 * Questions
 * ************************************************************************** */

HZ.spaceActions.QuestionDialog = new function() {
	var WAIT_SCREEN = 0,
		CHOOSE_SCREEN = 1,
		WRITE_SCREEN = 2,
		CONFIRM_SCREEN = 3,
		space = null,
		spaceId = null,
		view = null,	// jQuery object
		delegate = null,
		titleField, commentField,	// fields for
		submitButton, createNewButton,
		showLinkOnNewWindow = false, viewInitialized = false;

	this.JSON_KEY_DAILY_QUESTIONS_QUOTA_EXCEEDED = null;
	this.JSON_KEY_SPACE_ID = null;
	this.JSON_KEY_QUESTIONS = null;


	var waitScreen = "<div id='questionDialog_"+WAIT_SCREEN+"'>"
		+ "<div class='dialogTitle'>Ask a question about this photo. </div><div class='dialogBody'>"
		+ "<div class='dialogCenterCaption'>Please wait..." + HZ.ui.AjaxThrobber.getThrobber() + "</div>"
		+ "<div class='dialogControls'></div>"
		+ "</div></div>";
	var chooseQuestionScreen = "<div id='questionDialog_"+CHOOSE_SCREEN+"'>"
		+ "<div class='dialogTitle'>Ask a question about this photo. </div><div class='dialogBody'>"
		+ "<div class='dialogStatus' id='questionQuotaExceeded'>You've reached the maximum number of questions permitted per day. Please visit us again tomorrow if you have more questions.</div>"
		+ "<div class='dialogCaption' id='questionsListCaption'>The answer you need may already be here:</div>"
		+ "<div class='dialogList' id='questionsList'></div>"
		+ "<div class='dialogControls'></div>"
		+ "</div></div>";
	var writeQuestionScreen = "<div id='questionDialog_"+WRITE_SCREEN+"'>"
		+ "<div class='dialogTitle'>Ask a question about this photo. </div><div class='dialogBody'>"
			+ "<form id='askQuestionForm' name='postToForumForm' action='javascript:;'>"
			+ "<div class='dialogStatus' id='questionFormError'></div>"
			+ "<div><input id='askQuestionInputTitle' type='text' maxlength='110' placeholder='Write your question here. (ex: Love the chair! Where is it from?)'></div>"
			+ "<div><textarea id='askQuestionInputComment' placeholder='Tell us the details here.'></textarea></div>"
			+ "<div id='questionsGuidelines'>"
				+ "<div id='questionGuidelinesBody'>Pros on Houzz are encouraged but not obligated to answer questions.<br/><br/>Polite questions are more likely to receive responses.</div>"
			+ "</div>"
			+ "<input type='submit' style='display:none'></input>"
			+ "<div class='dialogControls'></div>"
		+ "</form></div></div>";
	var confirmScreen = "<div id='questionDialog_"+CONFIRM_SCREEN+"'>"
		+ "<div class='dialogTitle'>Your question was posted.</div><div class='dialogBody'>"
		+ "<div id='askQuestionConfirmationMessage'></div>"
		+ "<div class='dialogControls'></div>"
		+ "</div></div>";

	this.init = function (_spaceId, _ownedByPro) {
		spaceId = _spaceId;
	}

	this.setDelegate = function (_delegate) {
		delegate = _delegate;
	};

	this.setShowLinkOnNewWindow = function (_showLinkOnNewWindow) {
		showLinkOnNewWindow = _showLinkOnNewWindow;
	};

	this.openQuestionPage = function(questionId) {
		var link = HZ.utils.Links.getQuestionLink(questionId);

		if (showLinkOnNewWindow)
			window.open(link);
		else
			window.location = link;
	};

	this.getView = function () {
		// return a jQuery contents object
		if (!view) {
			var iter = 0;
			view = $("<div id='askQuestionDialog'></div>")
				.addClass("dialogFrame")
				.append(waitScreen)
				.append(chooseQuestionScreen)
				.append(writeQuestionScreen)
				.append(confirmScreen);

			submitButton = HZ.ui.InputButtonUtils.createPrimaryInputButton("Submit","",$.proxy(submitQuestion,this));

//			$(createButton("Submit", null, "submitNewQuestion", null))
//				.click ($.proxy(submitQuestion, this));

//			createNewButton = $(createButton("I have another question", null, "createNewQuestionsButton", null))
//				.click ($.proxy(showWriteQuestionScreen, this));

			createNewButton = HZ.ui.InputButtonUtils.createPrimaryInputButton("I have another question","",$.proxy(showWriteQuestionScreen,this));
			$("body").append(view);
			$("#questionDialog_"+WAIT_SCREEN+" .dialogControls", view)
				.append(HZ.ui.InputButtonUtils.createSecondaryInputButton("Cancel", null, null, null, null, "cancelButton"));
			$("#questionDialog_"+CHOOSE_SCREEN+" .dialogControls", view)
				.append(HZ.ui.InputButtonUtils.createSecondaryInputButton("Cancel", null, null, null, null, "cancelButton"))
				.append(createNewButton);
			$("#questionDialog_"+WRITE_SCREEN+" .dialogControls", view)
				.append(HZ.ui.AjaxThrobber.getThrobber())
				.append(HZ.ui.InputButtonUtils.createSecondaryInputButton("Cancel", null, null, null, null, "cancelButton"))
				.append(submitButton);
//			$("#questionDialog_"+CONFIRM_SCREEN+" .dialogControls", view)
//				.append(HZ.ui.InputButtonUtils.createPrimaryInputButton("OK", null, null, null, null, "cancelButton"));

			$(".cancelButton",view).click ($.proxy (cancel, this));


			titleField = $("#askQuestionInputTitle")[0];
			commentField = $("#askQuestionInputComment")[0];
		}
		return view;
	};

	this.viewLoaded = function () {
		// reset the form:
		showError("");
		titleField.value = "";
		commentField.value = "";
		HZ.ui.AjaxThrobber.setInCall(false);
		if (!viewInitialized) {
			viewInitialized = true;
			$('[placeholder]','#askQuestionDialog').initPlaceHolders({
				saveContainer:'#askQuestionDialog',
				saveEvent:'submit.question'
			});
		}
		else {
			$('[placeholder]','#askQuestionDialog').initPlaceHolders('refresh');
		}
		// show the first screen:
		showWaitScreen();
	};

	this.viewUnloaded = function () {};

	function showScreen(screenId) {
		var divId = "questionDialog_" + screenId;
		view.children().each(
			function(i) {
				this.style.display = (this.id == divId)?"block":"none";
			}
		)
		delegate.center();
	}

	function cancel () {
		delegate.hide(null);
	}

	function showWaitScreen() {
		showScreen(WAIT_SCREEN);
		HZ.ui.AjaxThrobber.setInCall(true);
		HZ.spaceActions.getExistingQuestions(spaceId, $.proxy (getExistingQuestionsCallback, this));
	}

	function getExistingQuestionsCallback(data) {
		HZ.ui.AjaxThrobber.setInCall(false);
		if (data.success) {
			if (data[HZ.spaceActions.QuestionDialog.JSON_KEY_DAILY_QUESTIONS_QUOTA_EXCEEDED] || data[HZ.spaceActions.QuestionDialog.JSON_KEY_QUESTIONS].length > 0) {
				showChooseQuestionScreen(data);
			} else
				showWriteQuestionScreen();
		}
	}

	function showChooseQuestionScreen(data) {
		var questions = data[HZ.spaceActions.QuestionDialog.JSON_KEY_QUESTIONS];
		var spaceId = data[HZ.spaceActions.QuestionDialog.JSON_KEY_SPACE_ID];
		var quotaExceeded = data[HZ.spaceActions.QuestionDialog.JSON_KEY_DAILY_QUESTIONS_QUOTA_EXCEEDED];

		var html = "<ul>";
		for (var i=0; i<questions.length; i++) {
			var question = questions[i];
			html += "<li><a href='javascript:HZ.spaceActions.QuestionDialog.openQuestionPage("+question.questionId+")'>"+question.title+"</a>";
			switch (parseInt(question.numberOfAnswers)) {
				case 0: break;
				case 1: html += " <span class='reply'>(1 reply)</span>"; break;
				default: html += " <span class='reply'>("+question.numberOfAnswers+" replies)</span>"; break;
			}
		}
		html += "</ul>";
		$("#questionsList").empty()
			.append(html);
		$('#questionsListCaption')[0].style.display = (questions.length > 0)?"block":"none";
		$("#questionQuotaExceeded")[0].style.display = quotaExceeded?"block":"none";
		createNewButton[0].style.display = quotaExceeded?"none":"inline";
		showScreen(CHOOSE_SCREEN);
	};

	function showError(message) {
		$("#questionFormError")
			.empty()
			.append(message);
		if (message) {
			$("#questionFormError").show();
		}
		else {
			$("#questionFormError").hide();
		}
		$('[placeholder]','#askQuestionDialog').initPlaceHolders('refresh');
	}

	function showWriteQuestionScreen() {
		showScreen(WRITE_SCREEN);
	}

	function submitQuestion() {
		if (HZ.ui.AjaxThrobber.isInCall())
			return;

		$('#askQuestionDialog').trigger('submit.question');
		// Validation:
		var topic = 14,
			title = UIHelper.trim(titleField.value),
			comment = UIHelper.trim(commentField.value);

		if (title=="") {
			showError ("Please write your question.");
		} else {
			var params = '/id='+spaceId;
			params += '/title='+encodeURIComponent(encodeURIComponent(title));
			params += '/comments='+encodeURIComponent(encodeURIComponent(comment));
			params += '/topic='+topic;
			HZ.ui.AjaxThrobber.setInCall(true);
			ajaxc.makeRequest('/addToGallery','f', params, $.proxy (submitQuestionCallback, this),'');
		}
		return false;
	}

	function submitQuestionCallback(data) {
		HZ.ui.AjaxThrobber.setInCall(false);
		if (data.success == "true") {
			var discussionLink = HZ.utils.Links.getQuestionTopicLink('design dilemma'),
				message = "",
				questionsPR = "<a href='"+discussionLink+"' class='colorLink boldLink'>See what other Houzzers are working on&nbsp;&raquo;</a>";

			if (data.quotaReached)
				message += "Please note: You have reached the maximum number of questions permitted per day.";

			$("#askQuestionConfirmationMessage")
				.empty()
				.append(message);
			$("#questionDialog_"+CONFIRM_SCREEN+" .dialogControls").empty().append(questionsPR);
			showScreen(CONFIRM_SCREEN);
		} else {
			HZ.ui.Yamdi.hide(this);
			HZ.ui.yamdi.Common.alert(data.error);
		}
	}
};













/* **************************************************************************
 * Email
 * ************************************************************************** */

HZ.spaceActions.EmailDialog = new function() {
	var FORM_SCREEN = 0,
		CONFIRM_SCREEN = 1,
		defaultSubject, defaultMessage, type, referenceId,
		username, displayname, selfEmail, editLink,
		view = null,	// jQuery object
		delegate = null,
		toField, subjectField, messageField,
		submitButton, viewInitialized=false,
		proType = 10,
		proReplyType = 23;

	//for pro type, reference_id is username, default subject is display name
	this.initPro = function (_type, _displayname, _username, _defaultMessage, _selfEmail, _editLink, _defaultSubject) {
		type = _type;
		username= _username;
		displayname = _displayname;
		selfEmail = _selfEmail;
		editLink = _editLink;
		defaultSubject = _defaultSubject || "Houzz project inquiry";
		if (_defaultMessage == undefined)
			defaultMessage = this["DEFAULT_MESSAGE_"+type];
		else
			defaultMessage = _defaultMessage || "";
	}

	this.init = function (_type, _reference_id, _defaultSubject, _defaultMessage) {
		type = _type;
		referenceId = _reference_id || "";
		defaultSubject = _defaultSubject || "";
		if (_defaultMessage == undefined)
			defaultMessage = this["DEFAULT_MESSAGE_"+type];
		else
			defaultMessage = _defaultMessage || "";
	}

	this.setDelegate = function (_delegate) {
		delegate = _delegate;
	};

	this.getView = function () {
		// return a jQuery contents object
		if (!view) {
			if(type==23 || type==10) {
                view = $("<div id='emailDialog'></div>")
                        .addClass("dialogFrame")
                        .append("<div id='emailDialog_"+FORM_SCREEN+"'>"
                        + "<div class='dialogTitle'>To <span id='toDisplayName'>"+displayname+"</span></div><div class='dialogBody'>"
                        + "<div class='dialogStatus' id='emailFormError'></div>"
                        + "<input type='hidden' id='emailDialogTo' value='"+username+"'/>"
                        //+ "<span class='dialogInputTitle'>From&nbsp;&nbsp;"+selfEmail+" <a href='"+editLink+"' class='colorLink'>edit</a> </span>"
                        + "<span class='dialogInputTitle'>Subject</span>"
                        + "<input type='text' id='emailDialogSubject' class='emailFormInput' placeholder='enter your email subject here'>"
                        + "<span class='dialogInputTitle'>Message</span>"
                        + "<textarea id='emailDialogMessage' class='emailFormInput' style='height:80px;' placeholder = 'enter your email message here'></textarea>"
						+ (type==10 ? "<div class='proMessageDisclaimer'><input type='checkbox' id='confirmProMessage'/><div>I confirm this is a personal project inquiry and not a promotional<br/>message or solicitation.</div></div>" : "")
                        + "<div class='dialogControls'></div>"
                        + "</div></div>")
                        .append("<div id='emailDialog_"+CONFIRM_SCREEN+"'>"
                        + "<div class='dialogTitle'>Send a Message to <span id='toDisplayName2'>"+displayname+"</span></div><div class='dialogBody'>"
                        + "<div class='dialogCenterCaption' id='emailConfirmationMessage'></div>"
                        + "<div class='dialogControls'></div>"
                        + "</div></div>");
			} else {
				view = $("<div id='emailDialog'></div>")
					.addClass("dialogFrame")
					.append("<div id='emailDialog_"+FORM_SCREEN+"'>"
						+ "<div class='dialogTitle'>Send an Email</div><div class='dialogBody'>"
						+ "<div class='dialogStatus' id='emailFormError'></div>"
						+ "<span class='dialogInputTitle'>To</span>"
						+ "<textarea id='emailDialogTo' class='emailFormInput' style='height:34px;' placeholder = 'enter recipient emails, separated by commas'></textarea>"
						+ "<span class='dialogInputTitle'>Subject</span>"
						+ "<input type='text' id='emailDialogSubject' class='emailFormInput' placeholder='enter your email subject here'>"
						+ "<span class='dialogInputTitle'>Message</span>"
						+ "<textarea id='emailDialogMessage' class='emailFormInput' style='height:80px;' placeholder = 'enter your email message here'></textarea>"
						+ "<div class='dialogControls'></div>"
						+ "</div></div>")
					.append("<div id='emailDialog_"+CONFIRM_SCREEN+"'>"
						+ "<div class='dialogTitle'>Send an Email</div><div class='dialogBody'>"
						+ "<div class='dialogCenterCaption' id='emailConfirmationMessage'></div>"
						+ "<div class='dialogControls'></div>"
						+ "</div></div>");
			}

			submitButton = HZ.ui.InputButtonUtils.createPrimaryInputButton("Submit", "", $.proxy(submitEmail,this));
			$("body").append(view);
			$("#emailDialog_"+FORM_SCREEN+" .dialogControls", view)
				.append (HZ.ui.AjaxThrobber.getThrobber())
				.append(HZ.ui.InputButtonUtils.createSecondaryInputButton("Cancel", null, null, null, null, "cancelButton"))
				.append(submitButton);

			$("#emailDialog_"+CONFIRM_SCREEN+" .dialogControls", view)
				.append(HZ.ui.InputButtonUtils.createPrimaryInputButton("OK", null, null, null, null, "cancelButton"));

			$(".cancelButton",view).click ($.proxy (cancel, this));
			toField = $("#emailDialogTo")[0];
			subjectField = $("#emailDialogSubject")[0];
			messageField = $("#emailDialogMessage")[0];
		}
		return view;
	};

	this.viewLoaded = function () {
		// reset the form:
		showError("");
		toField.value = "";
		subjectField.value = defaultSubject;
		messageField.value = defaultMessage;
		if(type==23 || type==10) {
			$('#toDisplayName').text(displayname);
			$('#toDisplayName2').text(displayname);
			$('#emailDialogTo').val(username);
			if(type==10) {
				$('#confirmProMessage').prop('checked', false);
			}
		}
		HZ.ui.AjaxThrobber.setInCall(false);
		if(type==23) {
			$('#toDisplayName').text(displayname);
			$('#toDisplayName2').text(displayname);
			$('#emailDialogTo').val(displayname);
		}
		if (!viewInitialized) {
			viewInitialized = true;
			$('[placeholder]','#emailDialog').initPlaceHolders({
				saveContainer:'#emailDialog',
				saveEvent:'submit.email'
			});
		}
		else {
			$('[placeholder]','#emailDialog').initPlaceHolders('refresh');
		}
		// show the first screen:
		showScreen(FORM_SCREEN);
	};
	
	this.viewUnloaded = function () {};
	
	function showScreen(screenId) {
		var divId = "emailDialog_" + screenId;
		view.children().each(
			function(i) {
				this.style.display = (this.id == divId)?"block":"none";
			}
		);
		delegate.center();
	}	
	
	function cancel () {
		delegate.hide(null);
	}
	
	function showError(message) {
		$("#emailFormError")
			.empty()
			.append(message);
		if (message) {
			$("#emailFormError").show();
		}
		else {
			$("#emailFormError").hide();
		}
	}
	
	function submitEmail() {
		if (HZ.ui.AjaxThrobber.isInCall())
			return;
		
		$('#emailDialog').trigger('submit.email');
		// Validation:
		var to = toField.value,
			subject = subjectField.value,
			message = messageField.value;

		if(type==proType || type==proReplyType)
			to = username;
		if(type==proType && !$('#confirmProMessage').is(':checked')) {
			showError("Please confirm this is a person project inquiry");
		} else if (type!=proType && type!=proReplyType && !UIHelper.validateEmail(to,true)) {
			showError ("Please specify recipient email addresses, separated by commas");
		} else if (UIHelper.trim(subject) == "") {
			showError ("Please write an email subject");
		} else if (UIHelper.trim(message) == "") {
			showError ("Please write an email message");
		} else {
			HZ.ui.AjaxThrobber.setInCall(true);
			HZ.ajaz.Services.sendEmail(to, subject, message, type, referenceId, $.proxy (submitEmailCallback, this),'');
		}	
		return false;
	}
	
	function submitEmailCallback(data) {
		HZ.ui.AjaxThrobber.setInCall(false);
		var message = "";
		if (data.success == "true") {
			if(type==proType || proReplyType)
				var message = "Message sent successfully";
			else
				var message = "Email sent successfully.";
		} else {
			var message = data.error;
		}		
		$("#emailConfirmationMessage")
			.empty()
			.append(message);
		showScreen(CONFIRM_SCREEN);
	}
};















/* **************************************************************************
 * Embed
 * ************************************************************************** */
		



HZ.spaceActions.EmbedDialogClass = function () {
	var spaceId = null,
		largePhotoTextarea, smallPhotoTextarea,
		template = "<div class='dialogCaption'>Copy this code to embed this photo on your site:</div>"
			+ "<div class='dialogCaption' style='margin-top:10px;'>Large Image (500 pixels):</div>"
			+ "<textarea onclick='this.select()' readonly='readonly' class='embedPhoto500'></textarea>"
			+ "<div class='dialogCaption' style='margin-top:10px;'>Small Image (320 pixels):</div>"
			+ "<textarea onclick='this.select()' readonly='readonly' class='embedPhoto320'></textarea>"
			+ "<div class='dialogCaption' style='margin-top:10px;'>Wordpress <a href='http://www.houzz.com/buttonsAndBadges#shortcode'>Shortcode</a>:</div>"
			+ "<textarea onclick='this.select()' readonly='readonly' class='embedShortcode'></textarea>";
		
	HZ.spaceActions.EmbedDialogClass.superclass.constructor.call(this);

	this.prepare = function() {
		var okButton = HZ.ui.InputButtonUtils.createPrimaryInputButton(
									"Ok", 
									"cancel",
									$.proxy(cancel, this)
								);

		var body = $("<div>").append(template);
		largePhotoTextarea = $(".embedPhoto500", body);
		smallPhotoTextarea = $(".embedPhoto320", body);
		shortcodeTextarea = $(".embedShortcode", body);

		var dialogSettings = {
			title: 'Embed a Photo',
			body: body,
			dialogClassName: 'embedPhotoDialog',
			controls: [okButton],
			onViewLoaded: $.proxy(this.onViewLoaded, this)
		};

		this.init(dialogSettings);
	}

	this.setSpaceId = function (aSpaceId) {
		spaceId = aSpaceId;
	};

	this.onViewLoaded = function () {
		largePhotoTextarea.val("");
		smallPhotoTextarea.val("");
		shortcodeTextarea.val("");
		HZ.ajaz.Services.getEmbedSpaceCode(spaceId, $.proxy(updateTextareas, this));
	};

	function cancel () {
		this.getDelegate().hide(null);
	}

	function updateTextareas(data) {
		if (data.success) {
			largePhotoTextarea.val(data.largeImageEmbedCode);
			smallPhotoTextarea.val(data.smallImageEmbedCode);
			shortcodeTextarea.val(data.wordpressShortcode);
		}
	}
}
HZ.extend(HZ.spaceActions.EmbedDialogClass, HZ.ui.yamdi.Dialog);
HZ.spaceActions.EmbedDialog = new HZ.spaceActions.EmbedDialogClass();
HZ.spaceActions.EmbedDialog.prepare();

function showEmbedDialog (spaceId) {
	HZ.spaceActions.EmbedDialog.setSpaceId(spaceId);
	HZ.ui.Yamdi.show(HZ.spaceActions.EmbedDialog);
}





/* **************************************************************************
 * Social Networks Share
 * ************************************************************************** */
		
HZ.spaceActions.Share = {
	GOOGLE_PLUS: 0,
	FACEBOOK: 1,
	TWITTER: 2,
	openShareWindowForSpace: function(platform, spaceId) { // works only if the space is found in HZ.data.Spaces
		var space,
			link,
			title,
			caption,
			description,
			picLink,
			redirectLink,
			display;
		if (HZ.data && HZ.data.Spaces) {
			space = HZ.data.Spaces.get(spaceId);
			if (space) {
				link = HZ.utils.Links.getSpaceLinkWithSEO(space.id);
				title = space.t;
				if (platform == this.FACEBOOK) {
					var style = HZ.data.Styles.get(space.s),
						category = HZ.data.Categories.getCategoryById(space.cat),
						metroArea = space.ma,
						spaceOwner = HZ.data.Users.get(space.ow).d;
					if (style) {
						title += " - " + style;
					}
					if (category) {
						title += " - " + category.name;
					}
					if (metroArea) {
						title += " - " + metroArea;
					}
					if (spaceOwner) {
						title += " - by " + spaceOwner;
					}
					caption = "";
					description = "";
					picLink = HZ.utils.Links.getSpaceImageUrl(space.id, 200, 200, false);
					redirectLink = HZ.utils.Links.getFbFeedRedirectLink();
					display = "popup";
				}
				this.openShareWindow(platform, link, title, caption, description, picLink, redirectLink, display);
			}
		}
	},
	openShareWindow: function(platform, link, title, caption, description, picLink, redirectLink, display) {
		var url;
		switch (platform) {
			case this.FACEBOOK:
				url = "https://www.facebook.com/dialog/feed?app_id=" + HZ.utils.Config.fbAppId + 
					"&link=" + encodeURIComponent(link) + 
					"&picture=" + encodeURIComponent(picLink) + 
					"&name=" + encodeURIComponent(title) +
					"&caption=" + encodeURIComponent(caption) + 
					"&description=" + encodeURIComponent(description) + 
					"&redirect_uri=" + encodeURIComponent(redirectLink) + 
					"&display=" + encodeURIComponent(display);	
				break;
			case this.TWITTER:
				url = "http://twitter.com/intent/tweet?url=" + encodeURIComponent(link) + "&text=" + encodeURIComponent(title);
				break;
			case this.GOOGLE_PLUS:
				url = "https://plus.google.com/share?url=" + encodeURIComponent(link);
				break;
		}
		if (url) {
			window.open(url, "lbShare"+platform, "height=600,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
		}
	},
	populateToGallerySelect: function (galleryChoiceField, selectedGalleryId) {
		var f, gallery, featured, optionElement, $gallerySelect;
		
		//reuse the AddToIdeabookDialog galleries
		var galleries = HZ.spaceActions.AddToIdeabookDialog.getGalleries();
		
		$gallerySelect = $(galleryChoiceField);
		
		if (galleries.recent.length > 0) {
			$gallerySelect.append('<option value="-1" class="ui-combobox-exclude">-------- recently used: --------</option>')
		}
		
		for (var i=0; i<galleries.recent.length; i++) {
			gallery = galleries.recent[i];
			featured = gallery.featured?"[featured] ":"";
			optionElement = $('<option class="ui-combobox-exclude">');
			optionElement
				.text(featured + gallery.title)
				.attr('value', gallery.id);
			if (gallery.id == selectedGalleryId) {
				optionElement.attr('selected', true);
			}
			$gallerySelect.append(optionElement);
		}
		
		if (galleries.recent.length > 0) {
			$gallerySelect.append('<option value="-1" class="ui-combobox-exclude">-------- your ideabooks: --------</option>')
		}

		for (var i=0; i<galleries.own.length; i++) {
			gallery = galleries.own[i];
			featured = gallery.featured?"[featured] ":"";
			HZ.ui.Utils.addOptionToSelect (galleryChoiceField, featured + gallery.title, gallery.id, gallery.id == selectedGalleryId, gallery.id == selectedGalleryId);			
		}
		
		if (galleries.shared.length > 0) {
			$gallerySelect.append('<option value="-1" class="ui-combobox-exclude">-------- shared ideabooks: --------</option>')
		}
		
		for (var i=0; i<galleries.shared.length; i++) {
			gallery = galleries.shared[i];
			HZ.ui.Utils.addOptionToSelect (galleryChoiceField, "[shared] " + gallery.title, gallery.id, gallery.id == selectedGalleryId, gallery.id == selectedGalleryId);
		}
		
	}
}


window.hzmr.push("spaceActions:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End spaceActions.js  **************/
/************* Start questions.js **************/
try {// <script>
HZ.ns('HZ.questions');

HZ.questions.CreateQuestionForm = {
	choiceTpl:	'<tr class="choiceLine">'+
					'<td><input type="text" class="optionInput" name="newOption__TOKEN__" placeholder="Add option: enter text or paste a Houzz link."/>'+
					'<td>'+
					'<input type="file" class="optionFileInput" name="newOptionImage__TOKEN__"/>'+
					'<input type="hidden" class="optionHouseIdInput" name="newOptionHouseId__TOKEN__"/>'+
					'<div class="houseThumb"><img width="30" height="30"/><a href="javascript:;" class="removeThumb"></a></div>'+
					'</td>'+
				'</tr>',
	maxChoices: 20,
	init:function(){
		var self=this;	
				$('#editQuestion [placeholder]').initPlaceHolders();
		$('#expandFileInputs').click(function(){
			$buttonBox = $('#editQuestionAddPhotoButtonBox').show();
						if(!($.browser.msie))
			{
				$buttonBox.find('.editQuestionFileInput').first().click();
			}
			$(this).unbind('click');
			$(this).addClass('afterExpandFileInputs');
			return false;
		});
				$('.editQuestionFileInput').bind('change',function(){
			$(this).next('input').show();
		});
				$('#editQuestionTopicBox').bind('change',function(){
			var titleField = $("#editQuestionTitle");
			var bodyField = $("#editQuestionBody");
			var topicId = $('#editQuestionTopicBox option:selected').val();
			if(topicId == 100){
				$('#editQuestionAddChoicesContainer').show();
			} else {
				$('#editQuestionAddChoicesContainer').hide();
			}
			if(topicId == 11) {
				if(titleField.val() == titleField.attr("placeholder")) {
					titleField.val("");
				}
				if(bodyField.val() == bodyField.attr("placeholder")) {
					bodyField.val("");
				}
				titleField.attr("placeholder", "Example title: \"How do I add a collaborator to my ideabook\"");
				bodyField.attr("placeholder", "Tell us the details here. \"Using Houzz\" is a place to get technical support for the site and apps.");
			} else {
				if(titleField.val() == titleField.attr("placeholder")) {
					titleField.val("");
				}
				if(bodyField.val() == bodyField.attr("placeholder")) {
					bodyField.val("");
				}
				titleField.attr("placeholder", "Example title: \"Need help for my kitchen\" or \"Our new patio!\"");
				bodyField.attr("placeholder", "Tell us the details here. If you have them, be sure to attach photos!");
			}
			$('#editQuestion [placeholder]').initPlaceHolders("refresh");
		});
				$('.optionInput:last').live('focus',function(){
			self.addChoiceLine();
		});
				$('.optionInput').bind('paste', function(e){
			var $ele = $(this);
			setTimeout(function(){
				self.extractUrl($ele);
			},0);
		});
		$('.removeThumb').live('click', function() {
			var $choiceLine = $(this).parents('.choiceLine');
			$choiceLine.find('.optionFileInput').show();
			$choiceLine.find('.optionHouseIdInput').val('');
			$choiceLine.find('.houseThumb').hide();
		});
	},
	extractUrl: function($ele) {
		var val = $ele.val();
		var newVal = val.replace(HZ.utils.Links.spaceUrlRegex,function(ele){
			return function(str,p1,offset,s) {
				var res = str;
				var $choiceLine = $ele.parents('.choiceLine');
				$choiceLine.find('.optionHouseIdInput').val(p1);
				var params = [{name:'houseId',value:p1}];
				var title = str;
				HZ.ajaz.Services.getSpaceData(p1, 1, function(data) {
						if(data && data.success=='true' && data.results && data.results.spaceInfo) {
							HZ.data.Spaces.addAll(data.results.spaceInfo);
							if(data.results.images)
								HZ.data.Images.addAll(data.results.images);
							var sinfo = data.results.spaceInfo[p1];
							title = sinfo.t;
							$choiceLine.find('.optionFileInput').hide();
							$choiceLine.find('.houseThumb').find('img').attr('src',HZ.utils.Links.getSpaceImageUrl(p1, 30, 30, false));
							$choiceLine.find('.houseThumb').show();
						}
						res = title;
					}, {async:false});
				return res;
			}
		}($ele));
		$ele.val(newVal);
	},
	addChoiceLine: function(){
		var self = this;
		var $choiceLines = $('.choiceLine');
		var i = $choiceLines.length + 1;
				if(i > self.maxChoices)
			return;
		var str = this.choiceTpl.replace(/__TOKEN__/gi,i);
		var $newChoiceLine = $(str);
		$newChoiceLine.insertAfter($choiceLines.last());
		$newChoiceLine.find('.houseThumb').hide();
		$newChoiceLine.find('[placeholder]').blur();	//init the input field with placeholder text.
		$newChoiceLine.find('.optionInput').bind('paste', function(e){
			var $ele = $(this);
			setTimeout(function(){
				self.extractUrl($ele);
			},0);
		});
	},
	validate: function(){
		HZ.ui.InputButtonUtils.disableButton($('#editQuestionSubmitBtn'));
		var hasError = false;
		var requireTitle = true;
		var msg = "";
		var isPoll = $('#editQuestionTopicBox option:selected').val() == 100;
		if ($('input[name=topic]').val() == 16)
			requireTitle = false;
		if($('#editQuestionTopicBox').length>0 && $('#editQuestionTopicBox option:selected').val()==-1) {
			hasError = true;
			msg = "Please select a topic";
		}
		else if(requireTitle && ($('#editQuestionTitle').initPlaceHolders("getValue")=='')) {
			hasError = true;
			msg = "Please enter a title for your post";
		}
		else if($('#editQuestionBody').initPlaceHolders("getValue")=='') {
			hasError = true;
			msg = "Please enter details for your post";
		}
		else if(isPoll) {
			var numOfValidOptions = 0;
			$('.optionInput').each(function(){
				//need to have at least 2 options with text
				if($(this).initPlaceHolders("getValue").length > 0) {
					numOfValidOptions++;
				}
			});
			if(numOfValidOptions < 2){
				hasError = true;
				msg = "Please enter at least 2 options for your poll";
			}
		}
		
		if(hasError) {
			HZ.ui.InputButtonUtils.enableButton($('#editQuestionSubmitBtn'));
			$('#editQuestionMainDiv .errorMsg').html(msg).show();
			//$('#editQuestion [placeholder]').initPlaceHolders("refresh");
			return false;
		}
		else {
			$('#editQuestionMainDiv .errorMsg').html('').hide();
			return true;
		}
		return false;
	}
};

HZ.questions.VotePolls = {
	settings: {
		allowVoteFromVisitors: 1	
	},
	init: function(opts){
		var self = this;
		if(opts){
			self.settings = $.extend({},self.settings,opts);
		}
		$('.voteBtn').click(function(event){
			event.stopPropagation();
			var $voteBtn = $(this);
			var $pollOptionsContainer = $voteBtn.parent().find('.pollContainer');
			$pollOptionsContainer.toggle(0,function(){
				if ($pollOptionsContainer[0].style.display=='none'){
					if ($pollOptionsContainer.find('.voteMe').length == 0){
						$voteBtn.attr('value','Show Results');
					}
					else{
						$voteBtn.attr('value','Vote Now');
					}					
				}
				else{
					if ($pollOptionsContainer.find('.voteMe').length == 0){
						$voteBtn.attr('value','Hide Results');
					}
					else{
						$voteBtn.attr('value','Not Now');
					}
				}
			});
		});
				$('.voteMe').click(function(event){
					event.stopPropagation();
			if(self.settings.allowVoteFromVisitors || HZ.data.CurrentSessionUser) {
				var $btn = $(this);
				var voteId = $btn.attr('for');
				var qid = $btn.parents('.pollContainer').attr('qid');
								$pollEntry = $btn.parents('.pollEntry');
				$pollEntry.find('.voteMe').hide();
				$pollDisplays = $pollEntry.find('.optionVote');
				$pollDisplays.html('Submitting your vote...');

				HZ.ajaz.Services.createPollVote(qid, voteId, $.proxy(self.oncomplete,this));
			} else {
				HZ.auth.Manager.signup(self.settings.signUpSourceLink ? self.settings.signUpSourceLink : null);
			}
		});
		
	},
	oncomplete:function(obj){
		var oneVoteTpl='<div class="voteCount">1 Vote</div>';
		var voteCountTpl= '<div class="voteCount">__TOKEN__ Votes</div>';
		var gphTpl = '<div class="barGph"><div class="barGphBar" style="width:0%"/></div>';
		// Change the poll votes count: get the questionStatistics div first.
		var $viewQuestionPageStat = $pollEntry.parents('#left2ColContent').find('.questionStatistics');
		if(typeof obj.error == 'undefined') {
						var total = obj.results.total;
			var options = obj.results.options;
			var link = obj.pollUrl+"#pollOptions";
			var c = options.length;
			var callBackExecuted = false;
			function pollAnimationCallback(){
				if (callBackExecuted){
					return;
				}
				$pollEntry.find('.voteBtn').attr('value','Hide Results');
				// Whether the dom has a questionStatistics div.
				if ($viewQuestionPageStat.length==0 && $pollEntry.parents('#left2ColContent').length > 0){
					$viewQuestionPageStat = $('<div class="questionStatistics"></div>');
					$viewQuestionPageStat.insertAfter($pollEntry.find('div.questionInfo').find('a.colorLink'));
				}
				// Whether the dom has a vote icon.
				var $statContainsIcon = $viewQuestionPageStat.has('a.voteIcon');
				if ($statContainsIcon.length>0){
					var $voteIcon = $statContainsIcon.find('a.voteIcon');
					$voteIcon.attr('title',total+' votes');
					$voteIcon.html("<img src='http://www.houzz.com/res/1593/pic/spacer.gif?v=1593'>"+total);
				} else{
					$viewQuestionPageStat.append('&middot; <a class="voteIcon colorLink" title="'+total+' votes" href="'+
					link+'"><img src="http://www.houzz.com/res/1593/pic/spacer.gif?v=1593">'+total+'</a>');
				}
				callBackExecuted = true;
			}
			for(var i = 0; i < c; i++)
			{
				var id = options[i].id;
				var count = options[i].count;
				var percent = Math.floor(count/total * 100);
				var $display = $pollEntry.find('#optionVote'+id);
				var htmlStr = '';
				if(count==1){
					htmlStr += oneVoteTpl;
				} else {
					htmlStr = voteCountTpl.replace(/__TOKEN__/,count);
				}
				htmlStr += gphTpl;
				$display.html(htmlStr);
				$display.find('.barGphBar').animate({'width':percent+'%'},2000,pollAnimationCallback);
			}
		} else {
			$pollDisplays.html(obj.error);
		}
	}
};
HZ.questions.SlideShow = new (function(){
	this.init = function(config){
		var $thumbnails = $('div.photoThumbnail').find('a'),
		$largerImgs = $("#slideShowDiv img"),
		$largerImgInfos = $(".largerImgInfo");
		if ($thumbnails.length>0){
			function clickHandler(i){
				return function(){
						$(this).parents("#photoStrip").find(".currentThumbnail").removeClass("currentThumbnail").addClass("otherThumbnail");
						$(this).find("img").addClass("currentThumbnail");
						$largerImgs.hide();
						$largerImgInfos.hide();
						$($largerImgs[i]).show();
						$($largerImgInfos[i]).show();
						return false;
					};
			}
			for (var i=0;i<$thumbnails.length;i++){
				$($thumbnails[i]).click(clickHandler(i));
			}
		}
	};	
})();



window.hzmr.push("questions:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End questions.js  **************/
/************* Start activityFeed.js **************/
try {// <script>

/* Mosaic Widget */
;(function ( $ ) {

	$.widget( "hz.mosaic" , {
		//Options to be used as defaults
		options: {
			dataName: "hz"
		},
		_getAndValidateData: function (element, dataName, requiredAttributes) {
			var data = element.data(dataName);
			if (data === undefined) {
				throw "incompatible element, no data";
			}
			for (var i in requiredAttributes) {
				var requiredAttribute = requiredAttributes[i];
				// ensure one of the following exist if Array
				if (requiredAttribute instanceof Array) {
					var found = false;
					for (var j in requiredAttribute) {
						if (typeof data[(requiredAttribute[j])] !== "undefined" ) {
							found = true;
							break;
						}
					}
					if (!found) {
						throw "incompatible element, required attribute not found";
					}
				}
				// check attribute exists
				else if (typeof data[requiredAttribute] === "undefined" ) {
					throw "incompatible element, required attribute not found: "+requiredAttribute;
				}
			}
			return data;
		},
		_create: function () {
			// init data
			var commentsData = this._getAndValidateData(this.element,this.options.dataName,["includeLinks","groupLink","mosaicGroup"]);

			this.includeLinks = commentsData.includeLinks;
			this.groupLink = commentsData.groupLink;
			this.mosaicGroup = commentsData.mosaicGroup;
			var html = '';
			if (typeof commentsData.spaceIds !== 'undefined') {
				this.spaceIds = commentsData.spaceIds;
				html = getMosaicHtmlForSpaceIds(this.spaceIds, this.includeLinks, this.groupLink, this.mosaicGroup);
			}
			else {
				this.imageIds = commentsData.imageIds;
				html = getMosaicHtmlForImageIds(this.imageIds, this.includeLinks, this.groupLink, this.mosaicGroup);
			}
			this.element.append($(html));
		}
	});

})( jQuery );

/* Tab container Widget */
;(function ( $ ) {

	$.widget( "hz.tabContainer" , {

		_create: function () {
			this.tabs = $(this.element.find(".tabsSelector ul")[0]).find("li.tab");
			this.tabs.click($.proxy(this._switchTabEvent,this));

			this.contentPanes = this.element.find(".tabbedContentDiv");
			this._switchTab(this.tabs[0]);
		},

		_switchTabEvent: function(event) {
			this._switchTab(event.currentTarget);
		},

		_switchTab: function(selectedTab) {
			var index = this.tabs.index(selectedTab);
			$(this.tabs).removeClass("selected");
			$(selectedTab).addClass("selected");
			$(this.contentPanes).css("display","none");
			$(this.contentPanes[index]).css("display","block");
		}
	});

})( jQuery );

/* Show more Widget */
;(function ( $ ) {

	$.widget( "hz.showMore" , {

		options: {
			initialSize: 10,
			itemSelector: ".feedItem",
			template_post:'<div id="feedsContentMore" class="tabsContentMore" style="display: block;"><a href="javascript:;" class="feedsExpandButton"><img class="inventoryExpandArrow" src="'+HZ.utils.Config.emptyGifData+'"> __TITLE__ <img class="inventoryExpandArrow" src="'+HZ.utils.Config.emptyGifData+'"></a></div>'
		},
		_create: function () {
			var items = this.element.find(this.options.itemSelector);
			this.items = items;

			if (items.length > this.options.initialSize) {
				for (var i=this.options.initialSize; i<items.length; i++) {
					$(items[i]).hide();
				}
				var moreHtml = this.options.template_post.replace("__TITLE__","Show "+(items.length-this.options.initialSize)+" more Events");
				this.$moreHtml = $(moreHtml);
				this.$moreHtml.click($.proxy(this._showMoreEvent,this));
				this.$moreHtml.insertAfter(items[this.options.initialSize]);
			}
		},

		_showMoreEvent: function(event) {
			$(this.items).show();
			this.$moreHtml.remove();
		}
	});

})( jQuery );

/* Suggestions Widget */
;(function ( $ ) {

	$.widget( "hz.suggestions" , {

		options: {

		},
		_create: function () {
			var data = HZ.feed.data.suggestions.MySuggestionInventory.inventory;
			for(var i in data) {
				this.element.append("<div class='suggItem'>"+HZ.feed.renderer.SuggestionRenderer.render(data[i])+"</div>");
			}
		}
	});

})( jQuery );

/* Load more Widget */
;(function ( $ ) {

	var eventsInitialized = false;

	$.widget( "hz.loadMore" , {

		options: {
			feedContainer: ".feedContainer",
			incomingFeedClass :"incomingFeed",
			loadMore: ".loadMoreFeed",
			loadingClass: "loading"
		},
		_create: function () {
			if (!eventsInitialized)	{
				$(document).on("click",this.options.loadMore, function(event) {
					var widget = $(this).data("loadMore");
					$.proxy(widget._showMoreEvent,widget)(event);
				});
				eventsInitialized = true;
			}
			this.isIncoming = this.element.closest(this.options.feedContainer).hasClass(this.options.incomingFeedClass);
			this.isExecuting = false;
		},
		_beginExecute: function() {
			if (this.isExecuting)
				return false;
			this.isExecuting = true;
			this.element.addClass(this.options.loadingClass);
			return true;
		},
		_endExecute: function() {
			this.isExecuting = false;
			this.element.removeClass(this.options.loadingClass);
		},
		_showMoreEvent: function(event) {
			if (this._beginExecute())
			{
				if (this.isIncoming) {
					HZ.ajaz.Services.getIncomingFeedStories(HZ.activityFeed.Feed.feedOwner,HZ.activityFeed.Feed.incominglastActivities, $.proxy(this._handleAjaxResult,this));
				}
				else {
					HZ.ajaz.Services.getOutgoingFeedStories(HZ.activityFeed.Feed.feedOwner,HZ.activityFeed.Feed.outgoingLastActivities, $.proxy(this._handleAjaxResult,this));
				}
			}
		},
		_handleAjaxResult: function(result) {
			if (result.success) {
				if (result.feedItems) {
					var html = result.feedItems;
					this._loadItems(html);
				}
				var lastActivityTimes = result.lastFeedTimes;
				var hasMore = result.hasMore;
				if (this.isIncoming) {
					HZ.activityFeed.Feed.incominglastActivities = lastActivityTimes;
				}
				else {
					HZ.activityFeed.Feed.outgoingLastActivities = lastActivityTimes;
				}
				if (!hasMore) {
					this.element.remove();
				}
			}
			this._endExecute();
		},
		_loadItems: function (html) {
			$newItems = $("<div></div>").append(html);
			$newItems.find(HZ.activityFeed.Feed.config.mosaicImagesClass).mosaic();
			$newItems.hide();
			this.element.before($newItems);
			$newItems.fadeIn(400,function() {
				$newItems.find('textarea.commentBody').initPlaceHolders();
			});
		}
	});

})( jQuery );


HZ.ns("HZ.activityFeed");

HZ.activityFeed.Feed = new function() {
	this.config = {
		feedContainer:".feedContainer",
		incomingFeedClass:"incomingFeed",
		loadingClass: "loading",
		outgoingFeedContainer: "#outgoingFeedContainer",
		outgoingTab: "#activityTab",
		mosaicImagesClass: ".mosaicImages",
		feedsDiv: "#feedsDiv",
		loadMoreFeed: ".loadMoreFeed",
		mosaicImages: ".mosaicImages",
		suggestions: ".suggestionsContainer"
	};
	this.incomingLastActivities = null;
	this.outgoingLastActivities = null;
	this.feedOwner = null;

	this.init = function(customConfig) {
		this.config = $.extend(this.config, customConfig);

		$(this.config.feedsDiv).tabContainer();
		//$(".feedContainer").showMore();
		$(this.config.loadMoreFeed).loadMore();
		$(this.config.mosaicImages).mosaic();
		$(this.config.suggestions).suggestions();

				var outgoingTab = $(this.config.outgoingTab);
		if (outgoingTab.length > 0) {
			var outgoingLink = outgoingTab.closest("a");
			outgoingLink.click(function(event) {
				HZ.activityFeed.Feed.loadOutgoingFeed(event);
				outgoingLink.unbind('click');
			});
		}
	};

	this.loadOutgoingFeed = function() {
		var outgoingFeedContainer = $(this.config.outgoingFeedContainer)
		if (outgoingFeedContainer.length > 0) {
			outgoingFeedContainer.find(this.config.loadMoreFeed).trigger("click");
		}
	};
}();

HZ.activityFeed.NewDataHandler = function(onSuccess) {
	return function(ajaxResult,message,jqXhr) {
		if (ajaxResult.coreData) {
			var coreData = ajaxResult.coreData;
			// populate additions to the general collections:
			var collections = {
				"images":HZ.data.Images,
				"spaces":HZ.data.Spaces,
				"users":HZ.data.Users
			};
			for (var key in collections) {
				if (coreData[key]) {
					collections[key].addAll(coreData[key]);
				}
			}
		}
		if (onSuccess) {
			onSuccess(ajaxResult,message,jqXhr);
		}
	}
};


window.hzmr.push("activityFeed:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End activityFeed.js  **************/