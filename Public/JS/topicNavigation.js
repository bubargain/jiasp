window.hzmr = window.hzmr || [];
/************* Start topicNavigation.js **************/


function expandStyles() {
	$('.filterlistitemHidden').removeClass('filterlistitemHidden');
	$('.filterlistExpand').hide();
	return false;
}

HZ.navigation.SideBar = new function() {
	var rootContainer, menuContainer, sideBarContainer, sideMenuElements,
		menuCollapseable = false,
		isShowinSideBar = false,
		currentOpenMenuName, 
		previousMouseX = 0,
		delayedHideMenuTimeout = null,
		delayedCollapseMenuTimeout = null,
		delayedTimeout = 300,
		defaultMainTopic = null,
		keepItOpen = false,	// convenient for debugging purposes.
		allMenus = {}; // array of all menus and their index;
	
	this.init = function(cfg) {
		//alert(0);
		rootContainer = $("#topicHomeContainer");
		
		menuContainer = $("#topicHomeMenu")
		sideBarContainer = $("#topicNavigationSideMenu");
		
		sideMenuElements = $(".topicHomeMenuMain a");
		 
		menuCollapseable = (rootContainer[0].className == "popupMode");
		
		menuContainer
			.mouseenter(handleMouseEnter)
			.mouseout(handleMouseOut)
			.mousemove(handleMouseMove);
		
		for (var i=0; i<sideMenuElements.length; i++) {
			allMenus[$(sideMenuElements[i]).attr("menuname")] = i;
		}
		defaultMainTopic = cfg.defaultMainTopic;
		updateContent("menu_" + defaultMainTopic);
	};
	
	function showMenu() {
		alert(1);
		$("select").blur();	// kill all sorts of regular select boxes
		if (delayedHideMenuTimeout) {
			clearTimeout(delayedHideMenuTimeout);
		}
		if (menuCollapseable) {
			rootContainer.addClass("popupModeOpen");
		}
		menuContainer.addClass("hovered");
		if (defaultMainTopic) {
			updateContent("menu_" + defaultMainTopic);
		}
	}
	function hideMenu() {
		alert(2);
		if (delayedHideMenuTimeout)
			clearTimeout(delayedHideMenuTimeout);
		delayedHideMenuTimeout = setTimeout(delayedHideMenu, delayedTimeout);
	}
	
	function delayedHideMenu() {
		if (keepItOpen)
			return;
		if (menuCollapseable) {
			rootContainer.removeClass("popupModeOpen");
			updateContent(null);
		}
		menuContainer.removeClass("hovered")
			.removeClass("expanded");
	}
	
	function expandSideBar() {
		isShowinSideBar = true;
		sideBarContainer.show();
		menuContainer.addClass("hovered")
			.addClass("expanded");
	};
	
	function collapseSideBar() {
		if (keepItOpen)
			return;
		if (delayedCollapseMenuTimeout)
			clearTimeout(delayedCollapseMenuTimeout);
		delayedCollapseMenuTimeout = setTimeout(delayedCollapseSideBar, delayedTimeout);
	}

	function delayedCollapseSideBar() {
		updateContent (null);
		isShowinSideBar = false;
		menuContainer.removeClass("expanded");
	};
	
	function handleMouseEnter(event) {
		alert('3');
		if (delayedCollapseMenuTimeout)
			clearTimeout(delayedCollapseMenuTimeout);
		if (delayedHideMenuTimeout)
			clearTimeout(delayedHideMenuTimeout);
		
		var target = $(event.target),
			topicId = target.attr("menuName"),
			topicNamespace = target.attr("topicNamespace");
		if (topicNamespace == "navigation")
		{
			updateContent(topicId);
			expandSideBar();
			// sideBarContainer.html(target.text());
		}
		previousMouseX = event.pageX;
	}
	function handleMouseMove(event) {
		alert('4');
		var target = $(event.target);
		var	menuName = target.attr("menuName");
		var	topicNamespace = target.attr("topicNamespace");
		if (menuName && topicNamespace != "navigation")
			collapseSideBar();
		else if (topicNamespace == "navigation")
		{
			expandSideBar();
			if (event.pageX < previousMouseX + 2)
			{
				updateContent(menuName)
				// sideBarContainer.html(target.text());
			}
		}
		previousMouseX = event.pageX;			
	}
	
	function updateContent(menuName) {
		if (currentOpenMenuName != menuName) {
			var bgImageDiv = $("#topicHomeImage")[0],
				menuId = allMenus[menuName],
				bgPosition = 0;
			if (menuId !== undefined) {
				bgPosition = menuId * 420;
			} else {
				menuName = "topicPaneMoreRooms";
			}

			currentOpenMenuName = menuName;
			bgImageDiv.style.backgroundPosition = "-" + bgPosition +"px center";
			
			sideBarContainer.children().each(
				function() {
					var id = this.id;
					if (id == menuName)
						$(this).show();
					else
						$(this).hide();
				}
			);
			sideMenuElements.each (
				function() {
					var item = $(this),
						itemMenuName = item.attr("menuname");
					if (itemMenuName == menuName)
						item.addClass("navigationExpandedItem");
					else
						item.removeClass("navigationExpandedItem");
				}
			);
		}
	}
	
	function handleMouseOut(event) {
		var bounds2 = UIHelper.getBounds(menuContainer[0]);
		var bounds3 = UIHelper.getBounds(sideBarContainer[0]);	
		
		var eventPos = getEventPosition(event);
		if (!UIHelper.isInsideRectangle(eventPos, bounds2) && !UIHelper.isInsideRectangle(eventPos, bounds3)) {
//				hideMenu();
//				collapseSideBar();
		}
	}
} ();

HZ.navigation.Utils = new function() {
	this.expandBox = function (boxId) {
		$("#" + boxId + " .filterBoxEntityHidden").removeClass("filterBoxEntityHidden");
		$("#" + boxId + "More").hide();
	}
	
	this.handleMetroAreaChanged = function (baseUrl) {
		var element = document.getElementById("metroAreaSelector");
		var value = element.options[element.selectedIndex].value;
		value = (value != "") ? "/"+ value : "";
		var query = (pageSearchQuery != null) ? "/"+pageSearchQuery : "";
		document.location = baseUrl + value + query;
	}

	this.handlePriceFilterChanged = function (baseUrl) {
		var priceFilterPrefix = "price--";
		var priceRangeDelimiter = "-to-";
		fromPrice = document.getElementById('fromPrice').value;
		toPrice = document.getElementById('toPrice').value;
		if ((fromPrice != "" && !$.isNumeric(fromPrice)) || (toPrice != "" && !$.isNumeric(toPrice))) {
			window.location.reload();
			return;
		}
		if (fromPrice != "" && toPrice != "")
		{
			fromPrice = parseInt(fromPrice);
			toPrice = parseInt(toPrice);
			if (fromPrice > toPrice) {
				window.location.reload();
				return;
			}
		}
				
		fromPrice = Math.max(0, fromPrice);
		if (toPrice != "") {
			toPrice = Math.max(0, toPrice);
		}
		replacedUrlParam = priceFilterPrefix + fromPrice + priceRangeDelimiter + toPrice;
		if(baseUrl.match(priceFilterPrefix)) {
			var pos=baseUrl.indexOf(priceFilterPrefix);
			matchingParam=baseUrl.substr(pos);
			var endPos=matchingParam.indexOf("/");
			if (endPos > -1)
			{
				matchingParam = matchingParam.substr(0, endPos);
			}
			document.location = baseUrl.replace(matchingParam, replacedUrlParam);
		}

	}
}();



/*************  End topicNavigation.js  **************/
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
					+ "<div id='postToFacebookDiv'><input id='postToFacebook' name='postToFacebook' type='checkbox' /><img src='http://www.houzz.com/res/1596/pic/spacer.gif?v=1596' />"
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


window.hzmr.push("spaceActions:1596");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End spaceActions.js  **************/
/************* Start sns.js **************/
try {//<script>
HZ.ns("HZ.sns");

HZ.sns.JsSdk = {};
HZ.sns.JsSdk.init = function() {};
HZ.sns.JsSdk.setFbTokenExpiration = function() {};
HZ.sns.JsSdk.isFbTokenExpired = function() {};
HZ.sns.JsSdk.getFbAccessToken = function() {};

HZ.tmpFbLoader = new function() {
	
	var	fbAppId = '143965932308817',
		isInitialized = false,
		fbUserId = null,
		fbFirstName = null,
		fbLastName = null,
		fbEmail = null,
		fbAccessToken = null,
		fbTokenExpiration = 0,
		fbAuthResponse = null,
		isLoggedIn = false;

	this.setFbAppId = function(_appId) {
		fbAppId = _appId;
	};

	this.getFbAppId = function() {
		return fbAppId;
	};

	/**
		* returns true if the FB js sdk reports that the current page has a logged-in FB user
		* Note: this value is only valid after a call to either getLoginStatus or requestFbAuth
		*/
	this.isFbLoggedIn = function() {
		return isLoggedIn;
	};

	/**
		* returns the FB user id of the currently FB logged-in user, if available.  This will only be set
		* if the user has authorized the application, and if a call to either requestFbAuth or getFbLoginStatus
		* has been made previously.
		*/
	this.getFbUserId = function() {
		return fbUserId;
	};

	/**
		* only set if loadUserData has been called
		*/
	this.getFbLastName = function() {
		return fbLastName;
	};

	/**
		* only set if loadUserData has been called
		*/
	this.getFbFirstName = function() {
		return fbFirstName;
	};

	/**
		* only set if loadUserData has been called
		*/
	this.getFbEmail = function() {
		return fbEmail;
	};

	this.getFbAccessToken = function() {
		return fbAccessToken;
	};
	
	/**
	 * This function was used to load fb sdk asynchronously before.
	 * Now we use it to bind callback to the fbJsLoaded event if fb js sdk is not loaded yet, 
	 * otherwise run the callback directly.
	 */
	this.init = function(callback) {
		if(callback && typeof callback == "function") {
			if(!isInitialized) {
				$(document).bind('fbJsLoaded', callback);
			} else {
				callback();
			}
		}
	};
	
	this.loadFbJsSdk = function() {
		window.fbAsyncInit = function() {
			requireInitialization();
			$(document).trigger("fbJsLoaded");
		};
		// Load the SDK Asynchronously
		(function(d){
			// create required fb-root div
			if (!d.getElementById('fb-root')) {
				var firstChild = d.body.firstChild;
				var fbRootDiv = d.createElement('div');
				fbRootDiv.id = 'fb-root';
				d.body.insertBefore(fbRootDiv, firstChild);
			}
			var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement('script'); js.id = id; js.async = true;
			js.src = "//connect.facebook.net/en_US/all.js";
			ref.parentNode.insertBefore(js, ref);
		}(document));
	};

	this.setFbTokenExpiration = function(_expirationTime) {
		fbTokenExpiration = _expirationTime;
	};

	this.getFbTokenExpiration = function() {
		return fbTokenExpiration;
	};

	/**
		* convenience method that returns true if the current time is greater than the stored FB
		* access token expiration time
		*/
	this.isFbTokenExpired = function() {
		var currTime = (new Date()).getTime() * 0.001;
		return currTime > fbTokenExpiration;
	};

	function requireInitialization() {
		if (!isInitialized) {
			FB.init({
				appId      : fbAppId, // App ID
				status     : false, 
				cookie     : true, 
				xfbml      : true,
				channelUrl : 'http://www.houzz.com/res/1596/pic/channel.html?v=1596'
			});

			isInitialized = true;
		}
	}

	/**
		* returns the response (if any) from the most recent requestFbAuth or getFbLoginStatus call
		* Note - in FB terms this is the response from either the FB.login or FB.getLoginStatus call
		*/
	this.getFbAuthResponse = function() {
		return fbAuthResponse;
	};

	/**
		* update the stored access token, user id and token expiration with the specified
		* response from FB (if the status is "connected"; e.g. user is logged into FB and has authorized
		* this app id)
		*/
	function setFbResponse(response) {
		fbAuthResponse = response;
		if (response) {
			if (response.status == "connected") {
				isLoggedIn = true;
				fbAccessToken = response.authResponse.accessToken;
				fbUserId = response.authResponse.userID;
				// assume that access token is ok on the client side and set default expiration
				var currTime = (new Date()).getTime() * 0.001;
				fbTokenExpiration = currTime + parseInt(response.authResponse.expiresIn, 10);
			}
			else if (response.status == "not_authorized") {
				isLoggedIn = true;
			} else {
				isLoggedIn = false;
			}
		}
	}

	/**
		* requests and stores the first name, last name, and email (if available) of the currently
		* logged in user; either getFbLoginStatus or requestFbAuth must have been called previously
		* to have an active access token
		*/
	function loadUserData(callback) {
		HZ.sns.JsSdk.graphApi("/me", function(response) {
			if (response.first_name)
				fbFirstName = response.first_name;
			if (response.last_name)
				fbLastName = response.last_name;
			if (response.email)
				fbEmail = response.email;

			if (typeof callback == "function")
				callback();
		});
	}

	/**
		* wrapper for FB.login call; request a set of permissions from the user for this FB app id
		* Note - this will result in a pop-up dialog from FB
		*
		* failCallback - called instead of callback if the response from FB is not status "connected"
		* doloadUserData - if true, the loadUserData function is called after a successful login and before
		*                  the callback is triggered 
		* optParams - (optional) object map of parameters to pass into the FB.login call
		*/
	this.requestFbAuth = function(requestedScope, callback, failCallback, doLoadUserData, optParams) {
		requireInitialization();

		if (!requestedScope)
			requestedScope = '';

		var loginParams = {scope: requestedScope};
		if (optParams) {
			loginParams = $.extend(loginParams, optParams);
		}

		FB.login(function(response) {
			setFbResponse(response);

			if (response && response.status == "connected") {
				if (doLoadUserData) {
					loadUserData(callback);
				}
				else {
					if (typeof callback == "function")
						callback();
				}
			}
			else {
				if (typeof failCallback == "function")
					failCallback();
			}
		}, 
		loginParams
		);
	};

	/**
		* wrapper for FB.api; either getFbLoginStatus or requestFbAuth must have been called previously
		* to obtain and set an active access token
		*/
	this.graphApi = function(path, callback) {
		FB.api(path, callback);
	};

	/**
		* calls FB.getLoginStatus, updating the stored access token and expiration time
		*/	
	this.getFbLoginStatus = function(callback) {
		requireInitialization();

		if (fbAuthResponse)
		{
			if (typeof callback == "function")
				callback(fbAuthResponse);
		}
		else
		{
			FB.getLoginStatus(function(response) {
				setFbResponse(response);

				if (typeof callback == "function")
					callback(response);
			});
		}
	};
	// Write something on Feed
	this.postToFeed = function(link, title, description, picture, redirectUrl) {
		var obj = {
			method: 'feed',
			redirect_uri: redirectUrl,
			link: link,
			picture: picture,
			name: title,
			caption: '',
			description: description
		};

		var callback = function(response) {
		};

		FB.ui(obj, callback);
	};
};

if (HZ.tmpFbLoader) {
	HZ.sns.JsSdk = HZ.tmpFbLoader;
	$(document).ready(HZ.sns.JsSdk.loadFbJsSdk);
}




window.hzmr.push("sns:1596");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End sns.js  **************/
/************* Start publishManager.js **************/
try {		
//<script>
		HZ.ns("HZ.ajaz.FbUser");
		HZ.ajaz.FbUser.fbUserDisconnect = function(onSuccess, extras) {
			var params = [
				{name:'op',value:'d'}
			];
			
			var url = "\/fbUser";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		};
		
		HZ.ajaz.FbUser.fbUserUpdate = function(onSuccess, extras) {
			var params = [
				{name:'op',value:'u'},
				{name:'i',value:HZ.sns.JsSdk.getFbAppId()},
				{name:'t',value:HZ.sns.JsSdk.getFbAccessToken()},
			];
			
			var url = "\/fbUser";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		};
				HZ.ajaz.FbUser.fbPublishUpdate = function(actionType, userPref, onSuccess, extras) {
			var params = [
				{name:'op',value:'p'},
				{name:'a',value:actionType},
				{name:'up',value:userPref},
				{name:'i',value:HZ.sns.JsSdk.getFbAppId()},
				{name:'t',value:(userPref == 1 ? HZ.sns.JsSdk.getFbAccessToken() : "")},
			];
			
			var url = "\/fbUser";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		};
				HZ.ajaz.FbUser.findFbFriends = function(af, onSuccess, extras) {
			var paramValue = af ? '1' : '0';
			var params = [
				{name:'op',value:'fbf'},
				{name:'af',value:paramValue},
				{name:'i',value:HZ.sns.JsSdk.getFbAppId()},
				{name:'t',value:HZ.sns.JsSdk.getFbAccessToken()},
			];
			
			var url = "\/fbUser";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		};

				HZ.ajaz.FbUser.followFbFriends = function(updateProfile, onSuccess, extras) {
			var params = [
				{name:'op',value:'ffbf'},
				{name:'i',value:HZ.sns.JsSdk.getFbAppId()},
				{name:'t',value:HZ.sns.JsSdk.getFbAccessToken()},
				{name:'fbup',value:updateProfile},
			];
			
			var url = "\/fbUser";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		};

		HZ.ajaz.FbUser.JSON_KEY_REDIRECT_URL = "r";
		HZ.ajaz.FbUser.JSON_KEY_FIRST_NAME = "fn";
		HZ.ajaz.FbUser.JSON_KEY_LAST_NAME = "ln";
		HZ.ajaz.FbUser.JSON_KEY_FB_UID = "fbuid";
		HZ.ajaz.FbUser.JSON_KEY_USER_IMG_SQUARE = "squi";


		HZ.ajaz.FbUser.fbSentRequests = function(requestId, recipients, onSuccess, extras) {
			var params = [
				{name:'op',value:'sr'},
				{name:'rid',value:requestId},
				{name:'r_ids',value:recipients},
			];
			
			var url = "\/fbUser";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		};

				HZ.ajaz.FbUser.EVENT_FMF_PV = "fbinvites_pv";
		HZ.ajaz.FbUser.EVENT_FMF_HEADER = "fbinvites_header";
		HZ.ajaz.FbUser.EVENT_FMF_FOOTER = "fbinvites_footer";
		HZ.ajaz.FbUser.MAX_REQUESTS = 50;
		HZ.ajaz.FbUser.REQUEST_MSG = "Join me on Houzz, the online destination for home remodeling and design!";
		HZ.ajaz.FbUser.REQUEST_TITLE = "Invite your friends to Houzz!";

        // <script>
HZ.ns("HZ.publish");

HZ.publish.Manager = new function() {
    var actionType = null,
    publisherInfo = null,
    actionTypeInfo = null,
    isEnabled = false, // whether the current publisher type is enabled/disabled from server-side state
    isActionEnabled = false, // enable/disable publishing based upon client-side state
    isUiShown = false,
    isPrefChanged = false,
    isPublishExpected = false,
    isLoginAttempted = false, // whether or not the user was shown an FB login dialog as part of the publish flow
    getPrefCallback = null,
    setPrefCallback = null,
    actionCallback = null,
	isAboutToSaveSetting = null;

    this.init = function() {
        if (publisherInfo["fb"] && HZ.sns.JsSdk.isFbTokenExpired()) {
            HZ.sns.JsSdk.init(function() { HZ.sns.JsSdk.getFbLoginStatus(); });
        }
    };
    
	this.initAction = function(_actionType, _setPrefCallback, _getPrefCallback) {
		actionType = _actionType;

		if (!actionTypeInfo[actionType] || !publisherInfo[actionTypeInfo[actionType]["t"]]) {
			isEnabled = false;
			isUiShown = false;
			return;
		}

		isEnabled = true;
		isActionEnabled = true;
		isPrefChanged = false;
		isPublishExpected = false;
		isLoginAttempted = false;
		getPrefCallback = _getPrefCallback;
		setPrefCallback = _setPrefCallback;

		// determine UI visibility
		isUiShown = false;
		if (actionTypeInfo[actionType]["u"] != 1 && (HZ.sns.JsSdk.isFbLoggedIn() || !HZ.sns.JsSdk.isFbTokenExpired())) {
			isUiShown = true;

			// if visible, setup correct UI
			setUserPref(actionTypeInfo[actionType]["u"]);
		}
	};

	function getUserPref()
	{
		var val = null;

		if (typeof getPrefCallback == "function") {
			val = getPrefCallback();
		}
		
		return val;
	}

	function setUserPref(val)
	{
		if (typeof setPrefCallback == "function") {
			setPrefCallback(val);
		}
	}

	this.setPublisherInfo = function(_publisherInfo) {
		publisherInfo = _publisherInfo;
	};
	
	this.setActionTypeInfo = function(_actionTypeInfo) {
		actionTypeInfo = _actionTypeInfo;
	};

	this.setActionType = function(_actionType) {
	    actionType = _actionType;
	};
	
	this.isEnabled = function() {
		return isEnabled;
	};

	this.isUiShown = function() {
		return isUiShown;
	};

	this.isPromoShown = function() {
		// promo is shown if UI is visible and the user hasn't expressed a preference yet
		return isUiShown && actionTypeInfo[actionType]["u"] == 2	};

	this.isPublishExpected = function() {
		return isPublishExpected;
	};

	this.isPrefChanged = function() {
		return isPrefChanged;
	};
	
	this.isAboutToSaveSetting = function() {
		return isAboutToSaveSetting ? true : false;
	};
	
	this.setActionEnabled = function(val) {
		isActionEnabled = val;
	};

	this.processAction = function(_callback, _saveSetting) {
		actionCallback = _callback;
		var saveSetting = _saveSetting;
		var userPref = null;
		
		if (isUiShown && isActionEnabled) {
			userPref = getUserPref();

			if (userPref != actionTypeInfo[actionType]["u"]) {
				if (_saveSetting) {
					isPrefChanged = true;
					actionTypeInfo[actionType]["u"] = userPref;
				}
			}

			var fbAuthCallback = function() {
				handleProcessAction(actionCallback, saveSetting, userPref);
			};

			// always prompt user for FB auth, as updated permissions model may result in more
			// users with valid auth but no publish_actions perms
			if (userPref == 1) {
				isLoginAttempted = true;
				HZ.sns.JsSdk.requestFbAuth("publish_actions", fbAuthCallback, fbAuthCallback, false);
				return;
			}
		}

		handleProcessAction(actionCallback, saveSetting, userPref);
	};

	function handleProcessAction(actionCallback, saveSetting, userPref) {
		// if unspecified, default to whats saved
		if (typeof userPref === "undefined" || userPref === null)
		{
			userPref = actionTypeInfo[actionType]["u"];
		}
		isPublishExpected = isEnabled && userPref == 1 && isActionEnabled;

		// send back refreshed tokens and/or update user pref
		if (isEnabled && (isPrefChanged || (isPublishExpected && HZ.sns.JsSdk.getFbAccessToken()))) {
			if (isLoginAttempted && HZ.sns.JsSdk.isFbTokenExpired()) {
				// if user canceled out of FB auth, then consider that an opt-out decision
				userPref = 0;
				isPublishExpected = false;
			}
			if (saveSetting) {
				HZ.ajaz.FbUser.fbPublishUpdate(actionType, userPref, (typeof actionCallback == "function" ? actionCallback : null));
			} else {
				HZ.ajaz.FbUser.fbUserUpdate(typeof actionCallback == "function" ? actionCallback : null);
			}
		}
		else {
			if (typeof actionCallback == "function")
				actionCallback();
		}
	}
};

// </script>


window.hzmr.push("publishManager:1596");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End publishManager.js  **************/
/************* Start snsUpsell.js **************/
try {//<script>

HZ.ns("HZ.sns");  // should already be defined by sns.js, but just in case

HZ.sns.upsell = new function() {

	function processFbConnect(updateUserProfile) {
		HZ.ui.yamdi.Common.hideAllDialogs();
		
		// show wait dialog...
		HZ.ui.yamdi.Common.loading("Connecting with Facebook...");
		
		// make request to process
		HZ.ajaz.FbUser.followFbFriends((updateUserProfile ? "y" : "n"), handleConnectSuccess);
	}

	function handleFbAuthResponse() {
		if (HZ.sns.JsSdk.getFbAccessToken()) {
			// prompt user to determine their user profile update preference
			HZ.ui.yamdi.Common.confirm("Do you also want to use your name and profile photo?","","Yes",function() { processFbConnect(true); },"No",function() { processFbConnect(false); });
		}
		else {
			// assume user canceled out of auth dialog, nothing to do
		}
	}
	
	function handleConnectSuccess(resp) {
		if (resp && resp.success == "true") {
			if (resp[HZ.ajaz.FbUser.JSON_KEY_REDIRECT_URL]) {
				window.location = resp[HZ.ajaz.FbUser.JSON_KEY_REDIRECT_URL];
			}
			else {
				// success returned, but missing a redirect url
				window.location.reload(true);
			}
		}
		else {
			// an error occurred, apologize to user
			HZ.ui.yamdi.Common.hideAllDialogs();
			HZ.ui.yamdi.Common.alert("Please try again!", "We're sorry, but we encountered unexpected issues connecting to Facebook - please try again!");
		}
	}

	this.handleFbConnectUpsell = function() {
		HZ.sns.JsSdk.requestFbAuth("publish_actions", handleFbAuthResponse, handleFbAuthResponse, false);
	};
	
};



window.hzmr.push("snsUpsell:1596");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End snsUpsell.js  **************/