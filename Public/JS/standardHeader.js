/**
 * 
 */
window.hzmr = window.hzmr || [];
/************* Start standardHeader.js **************/
try {//<script>
	
if (navigator.platform && navigator.platform.indexOf("Win") == 0) document.write ("<style>#navHeader .tabTitle, #navMyHouzz .tabTitleSmallBottom{font-weight:bold}</style>");
HZ.ns("HZ.navigation");
HZ.navigation.NavBar = new function() {
	var defaultPlaceHolderText = "Search...",
		placeHolderText,
		searchClassPlaceholder = "searchPlaceholder",
		locationQuery = null,
		isEmpty = false,
		isCollapsed = null,
		isSearchFocused = false,
		searchInput, searchTypeButton, searchTypeOptions, searchTypeSelect, searchSubmitButton,
		searchInputBg,
		navBar,
		autoSuggestSearchTypes,
		browseDescriptor = null,
		sfle = null,
		ssle = null,
		bdle = null,
		searchOptions = [],
		selectedOptionIndex = null,
        keywordAutoSuggest = null,
		collapsedMenus,
		openMenuOnHover = true,
		lockSearch = false,
		collapseMode = 1,
		currentOpenMenuId,
		menuCloseTimeout;
		
	this.addQueryIdentifier = false;
	
	this.toggleLockSearch = function() {
		lockSearch = !lockSearch;
	}
	this.toggleMenuHover = function() {
		openMenuOnHover = !openMenuOnHover;
	}
	
	this.init = function(cfg) {
        keywordAutoSuggest = new HZ.navigation.AutoSuggest();
		autoSuggestSearchTypes = cfg.autoSuggestSearchTypes;
		cfg.clickCallback = $.proxy(this.handleSearchSubmitButtonClicked, this);
        keywordAutoSuggest.init(cfg);
		sfle = cfg.sfle;
		ssle = cfg.ssle;
		bdle = cfg.bdle;
		
		searchInput = document.searchForm.search;
		searchTypeButton = $("#navSearchTypeButton");
		searchTypeOptions = $("#navSearchTypeOptions");
		searchSubmitButton = $("#navSearchSubmitButton");
		searchTypeSelect = $("#navSearchTypeSelect");
		searchInputBg = $("#navSearchInputBg");
		navBar = document.getElementById ("navContainer");
		searchOptions = cfg.searchOptions;
		collapseMode = cfg.collapseMode;
		locationQuery = cfg.locationQuery;
		openMenuOnHover = (cfg.menuMode == 1);
		for (var i=0; i<searchOptions.length; i++) {
			if (searchOptions[i].label == cfg.searchText) {
				this.selectSearchOption(i, true);
			}
		}

		$(searchInput)
			.focus($.proxy(this.handleSearchFocus, this))

//		searchTypeButton
//			.focus(
//				function() {searchTypeSelect.focus();}
//			);
		searchTypeSelect
			.change ($.proxy(this.handleSearchSelectChanged, this))
			.keyup ($.proxy(this.handleSearchSelectChanged, this))
			.focus (function() {
				searchTypeSelect.parent().addClass ("navSearchTypeFocused");
			})
			.blur(function() {
				searchTypeSelect.parent().removeClass ("navSearchTypeFocused");
			});
			
		HZ.utils.MenuTrapper.registerMenu("userDropDownMenu", "userAccountMenu", this.openUserMenu, this.closeUserMenu, true);
		if (searchInput.value == "" || searchInput.value==placeHolderText) {
			searchInput.value = placeHolderText;
			$(searchInput).addClass(searchClassPlaceholder);
			isEmpty = true;
		}
		
		$(window).bind("scroll", $.proxy(this.updateScroll, this));
		
		this.updateSearchBar();
		this.updateScroll();
		
		collapsedMenus = $(".navBlockExpandable", navBar);
		collapsedMenus
			.mouseover($.proxy(this.handleMenuMouseOver, this))
			.mouseout($.proxy(this.handleMenuMouseOut, this))
			.click($.proxy(this.handleMenuClick, this));
	}
	
	this.setBrowseDescriptor = function(descriptor) {
		browseDescriptor = descriptor;
		HZ.utils.Logger.sendEventLog(bdle, {bd:browseDescriptor});
	}

	function updateOpenMenu(menuId) {
		// special case for updating the Cart menu
		if (menuId == "navMyCart" && menuId != currentOpenMenuId) {
			HZ.cart.Actions.notifyCartVisible();
		}

		currentOpenMenuId = menuId;
		collapsedMenus.each(function (index, element) {
			var id = element.id,
				menuLookup = "#" + id + "Exp";
			if (id == currentOpenMenuId) {
				$(menuLookup).show();
				$(element).addClass("navBlockExpanded");
			} else {
				$(menuLookup).hide();
				$(element).removeClass("navBlockExpanded");
			}
		});
	}
	
	this.handleMenuMouseOver = function(e) {
		if (openMenuOnHover)
		{
			if (menuCloseTimeout) {
				clearTimeout(menuCloseTimeout);
				menuCloseTimeout = null;
			}
			var id = e.currentTarget.id;
			updateOpenMenu(id);
		}
	}

	this.handleMenuMouseOut = function(e) {
		if (openMenuOnHover)
		{
			if (menuCloseTimeout) {
				clearTimeout(menuCloseTimeout);
			}
			menuCloseTimeout = setTimeout(
				$.proxy(function() {
					updateOpenMenu(null);
				}, this), 30);
		}
	}
	
	this.handleMenuClick = function(e) {
		if (openMenuOnHover || e.clientY > 45) {
			return true;
		} else {
			var id = e.currentTarget.id;
			for (var i=0 ;i<collapsedMenus.length; i++) {
				if (collapsedMenus[i].id == id) {
					if (id != currentOpenMenuId)
						updateOpenMenu(id);
					else
						updateOpenMenu(null);
					e.stopPropagation();
					HZ.utils.BlurTrapper.registerElements(e.currentTarget, $.proxy(this.handleMenuDismiss, this));
//					$(document).bind('click.menuDismiss', $.proxy(this.handleMenuDismiss, this));
					return false;
				}
			}
			this.handleMenuDismiss(e);
			return true;
		}
	}
	this.handleMenuDismiss = function (e) {
		updateOpenMenu(null);
	}

	this.handleSearchTypeOptionClicked = function(index) {
		this.selectSearchOption(index);
		searchInput.focus();
		updateOpenMenu(null);
	}
	
	this.handleSearchTypeButtonClicked = function() {
		searchInput.focus();
	}
	
	this.handleSearchSubmitButtonClicked = function() {
		searchInput.focus();
		this.handleSearchSubmit();
	}
	this.handleSearchSelectChanged = function() {
		var i = searchTypeSelect[0].selectedIndex;
		this.selectSearchOption(i);
	}
	this.selectSearchOption = function(index) {
		var option = searchOptions[index];
		if (option) {
			selectedOptionIndex = index;
			searchTypeButton
				.attr('etype', option.etype)
				.children("span").html(option.label);
			searchTypeSelect[0].selectedIndex = index;

			var allowAutoComplete = $.inArray(option.etype, autoSuggestSearchTypes);
			if (!allowAutoComplete || allowAutoComplete == -1) {
				keywordAutoSuggest.setEnabled(false);
			} else {
				keywordAutoSuggest.setEnabled(true);
			}

			this.updatePlaceholderText (option.hint || defaultPlaceHolderText);
	
			this.updateInputWidth();
		}
	}

	this.updateInputWidth = function () {
		var width = $("#navSearch").width() - 103;
		if (isSearchFocused) {
			searchInputBg.width(width - searchTypeButton.width());
			$(searchInput).width(searchInputBg.width() - 20);
		} else {
			$(searchInput).width("");
			searchInputBg.width("");
		}
		return;
		var inputBox = $('#searchInput'),
		    searchMenuBtn = $('#searchMenuBtn');
		if(searchOptions[selectedOptionIndex].label == 'Professionals') {
			inputBox.removeAttr('style');
		}
		else {
			inputBox.width(468 - searchMenuBtn.outerWidth() - (inputBox.outerWidth() - inputBox.width()));
		}
	}
	
	this.updatePlaceholderText = function(newPlaceholderText) {
		newPlaceholderText = UIHelper.truncate(newPlaceholderText, 28, UIHelper.TRUNCATE_WHITE_SPACES, true);
		var shouldChangeText = searchInput.value == placeHolderText;
	
		placeHolderText = (newPlaceholderText == null) ? defaultPlaceHolderText : newPlaceholderText;
		$(searchInput).attr("placeholder", placeHolderText);
		if (shouldChangeText) {
			searchInput.value = placeHolderText;
		}
	}
	
	this.updateSearchBar = function() {
		if (navBar) {
			navBar.className = (lockSearch || isSearchFocused)?"searchFocused":"";
			keywordAutoSuggest.setEnabled(true);
		}
		if (isEmpty) {
			searchInput.value = placeHolderText;
			$(searchInput).addClass(searchClassPlaceholder);
			$(searchInput).attr("placeholder", placeHolderText);
		}
		this.updateInputWidth();
	}

	this.clear = function() {
		isEmpty = true;
		searchInput.value = "";
		this.updateSearchBar();
	}

	this.handleSearchBlur = function() {
		isEmpty = (searchInput.value == "");
		isSearchFocused = false;
		this.updateSearchBar();
		this.updateScroll();
	}
	
	this.handleSearchFocus = function() {
		isSearchFocused = true;
		if (searchInput.value == placeHolderText) {
			searchInput.value = "";
			$(searchInput).removeClass(searchClassPlaceholder);
			isEmpty = false;
		}
		this.updateSearchBar();
		this.updateScroll();
		HZ.utils.BlurTrapper.registerElements($("#navSearch")[0], $.proxy(this.handleSearchBlur, this));		
		
		HZ.utils.Logger.sendEventLogOnce(sfle);
	}

	this.searchTypeFocus = function() {
	}

	this.searchTypeBlur = function() {
	}

	this.cleanQuery = function(searchQuery) {
		searchQuery = searchQuery.replace(/\/|\\/g, "");
		searchQuery = searchQuery.replace(/\-/g, "_");
		searchQuery = searchQuery.replace(/\s+/g,"-");
		return encodeURIComponent(searchQuery);
	}

	this.handleSearchSubmit = function() {
		var searchQuery = $.trim(searchInput.value);
		var searchLabel = searchOptions[selectedOptionIndex].label;
		if (searchLabel == 'Professionals')	{
			if (searchInput.value == placeHolderText) {
				searchQuery = "";
			}
			var searchLocation = this.getProfessionalSearchUrl(searchQuery);
			if (searchLocation != "") {
				HZ.utils.Logger.sendEventLogOnce(ssle, {query:searchQuery, searchType:searchLabel, bd:browseDescriptor});
				setTimeout (function() {
					window.location = searchLocation;
				}, 50);
			}
		} else {
			if (searchQuery == placeHolderText || searchQuery == "") {
				return false;
			}
			var searchTarget = searchOptions[selectedOptionIndex].url;
			if(searchTarget.match("%40%40%40")) {
				var newLocation = searchTarget.replace(/%40%40%40/, this.cleanQuery(searchQuery));
			} else {
				var newLocation = searchTarget + this.cleanQuery(searchQuery);
			}
						if (searchOptions[selectedOptionIndex].indented && this.addQueryIdentifier) {
				newLocation += "-";
			}				
			HZ.utils.Logger.sendEventLogOnce(ssle, {query:searchQuery, searchType:searchLabel, bd:browseDescriptor});
			setTimeout (function() {
				window.location = newLocation;
			}, 50);
			
		}
		return false;
	}

	this.getProfessionalSearchUrl = function(searchQuery) {
		var separator = "/",
			url = document.URL,
			sortReview = separator + "sortReviews",
			proUrl = "http://www.houzz.com/professionals",
			append = "",
			searchTarget = searchOptions[selectedOptionIndex].url;
			
		if(url.indexOf(proUrl)!=-1 && url.indexOf(sortReview)!=-1)
			append = sortReview;

		if(searchQuery=="" && locationQuery=="")
			return "";
		
		if(locationQuery=="")
			return window.location = searchTarget+separator+"s"+separator+searchQuery+append;
		else if(searchQuery=="")
			return searchTarget+separator+"c"+separator+locationQuery+append;
		else
			return searchTarget+separator+"s"+separator+searchQuery+separator+"c"+separator+locationQuery+append;
	}
	
	this.updateScroll = function(e) {
		var collapsed;
		switch (collapseMode) {
			case 0:
				collapsed = !isSearchFocused;
				break;
			case 1:
				collapsed = !isSearchFocused && ((collapseMode == 2) || UIHelper.getScrollXY()[1] > 12);
				break;
			case 2:
				collapsed = false;
				break;
		}
		if (collapsed !== isCollapsed) {
			isCollapsed = collapsed;
			if (isCollapsed) {
				$("#navContainer").addClass("narrow");
			} else {
				$("#navContainer").removeClass("narrow");
			}
		}
	}
	
	this.openUserMenu = function() {
		document.getElementById ("tabMyHouzzMenu").className = "expanded";
	}
	
	this.closeUserMenu = function() {
		document.getElementById ("tabMyHouzzMenu").className = "selected";
	}
}();


/* 
 * Blur Trapper
 * 
 * Helper class for identifying clicks on the page that are outisde a scope of a set of HTML elements.
 */
HZ.utils.BlurTrapper = new (function () {
	var traps;
	
/* 
 * Registers elements that should be inspected for mouse clicks; mouse clicks outisde the element will invoke the callback handler.
 * @param commonParent - a single element that will be traced up to; if the event comes from a child of this element - it is not considered a blurring click
 * @param callback - callback function to be invoked in case of blur.
 * 
 * Registered elements get cleared from the trapper once they callback has been invoked.
 */
	this.registerElements = function(commonParent, callback) {
		if (traps == null) {
			$(document).bind('mousedown.clickTrapper', $.proxy(this.handleClick, this));
			traps = {};
		}
		traps[commonParent] = [commonParent, callback];
	}

	this.handleClick = function (e) {
		var commonParent, inside, node, callback;
		for (var i in traps) {
			inside = false;
			commonParent = traps[i][0];
			node = e.target;
			while (node) {
				if (node == commonParent) {
					inside = true; 
					break;
				}
				node = node.parentNode;
			}
			if (!inside) {
				var callback = traps[i][1];
				delete (traps[i]);
				// console.log("Blur");
				callback();
				return true;
			}
		}
		if (getObjectCount(traps) == 0) {
			$(document).unbind('.clickTrapper');
			traps = null;
		}
	}
	
	function getObjectCount(o) {	// helper function, check size of the traps.
		var c = 0;
		for (var k in o) { if (o.hasOwnProperty(k)) { ++c; } }
		return c;
	}
});

HZ.navigation.AutoSuggest = function(){
	var searchInputBox = null,
	    searchTypeMenu = null,
	    autoSuggContainer = null,
		enabled = false,
		active = false,
        self = this,
		hideContainerTimeout = null,
	    autoSuggConfig = {
			enabled: false,
			currentInput: '',
			selectedIndex: -1,
			autoSuggList:null,
			autoSuggNum: 10
	    };
        
	this.init = function (config) {
		searchInputBox = $(config.searchInputBoxId); // $("#navSearchInput");
		autoSuggContainer = $(config.autoSuggestContainerId); // $("#navSearchAutoSuggestContainer");
		searchTypeMenu = $(config.searchTypeButtonId);
		autoSuggConfig.selectedIndex = -1;
        autoSuggConfig.enabled = config.autoComplete;
		autoSuggConfig.clickCallback = config.clickCallback;
		this.setEnabled(true);
		searchInputBox.focus($.proxy(this.handleInputBoxFocus, this));
		searchInputBox.blur($.proxy(this.handleInputBoxBlur, this));
		// 
	}

    function keyPress(e) {
		if (!enabled || !active) {
			return;
		}
		switch (e.keyCode) {
			case 27 : //KEY_ESC
				if(autoSuggConfig.selectedIndex != -1) {
					$(".autoSugg:nth-child("+ (autoSuggConfig.selectedIndex+1) + ")" , autoSuggContainer).removeClass('selected');
					autoSuggConfig.selectedIndex = -1;
					searchInputBox.val(autoSuggConfig.currentInput);
				}
				this.hide();
				return;
				
			case 13: //ENTER - submit form
			case 37: //KEY_LEFT
			case 39: //KEY_RIGHT
				return true;
			case 38: //KEY_UP
				moveSelection(-1);
				break;
			case 40: //KEY_DOWN
				moveSelection(1);
				break;
			default:
				this.delay($.proxy(this.lookupAutoSuggest, this), 100);	
				return;
		}	
		e.stopImmediatePropagation();
		e.preventDefault();
	}
    
	function moveSelection(direction){
		if(autoSuggConfig.autoSuggList && autoSuggConfig.autoSuggList.length > 0) {
			var selectedIndex = autoSuggConfig.selectedIndex,
			    numOfResults = autoSuggConfig.autoSuggNum;
			autoSuggContainer.show();
			selectedIndex += direction;
			selectedIndex = (selectedIndex + numOfResults) % numOfResults;
			$(".autoSugg:nth-child("+ (autoSuggConfig.selectedIndex+1) + ")" , autoSuggContainer).removeClass('selected');
			$(".autoSugg:nth-child("+ (selectedIndex+1) + ")", autoSuggContainer).addClass('selected');
			searchInputBox.val(autoSuggConfig.autoSuggList[selectedIndex]);
			autoSuggConfig.selectedIndex = selectedIndex;
		} else {
			return true;
		}
	} 
    
    function highlightSrchTerms(value, terms) {
		var searchTerms = terms.split(" ");
		$.each(searchTerms, function(idx, term){
			value = value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<b>$1</b>");
		});
		return value;
	}    
       
    //delay user operation(i.e. keyboard input) for a certain time
    this.delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    this.lookupAutoSuggest = function(e) {
		var input = searchInputBox, 
		    inputText = input.val(),
		    etype = parseInt(searchTypeMenu.attr('etype'));
		autoSuggConfig.currentInput = inputText;
		// if entity type is space, force it to all
		if(etype==3) etype = "";
		HZ.ajaz.Services.autoCompleteKeyword(inputText, etype, $.proxy(this.handleAutoSuggestData, this));
	};
	
	this.handleAutoSuggestData = function(result){
		// if(inputText != autoSuggConfig.currentInput) return;
		var inputText = searchInputBox.val()
		if(result.success == "true") {
			if(result.autocompleteList.length == 0) {
				self.hide();
			} else {
				autoSuggContainer.html("");
				var newAutoSuggList = [];
				$(result.autocompleteList).each( function(index,elem){
					newAutoSuggList[index] = elem;
					$("<div class='autoSugg'>" + highlightSrchTerms(elem, inputText) + "</div>")
						.mouseover(function(e){
							$(".autoSugg:nth-child("+ (autoSuggConfig.selectedIndex+1) + ")" , autoSuggContainer).removeClass('selected');
							$(this).addClass('selected');	
							autoSuggConfig.selectedIndex = index;
						})
						.mouseout(function(e){
							$(this).removeClass('selected');	
							autoSuggConfig.selectedIndex = -1;
						})
						.click(function(e){
							searchInputBox.val(elem);
							self.hide();
							if (autoSuggConfig.clickCallback)
								autoSuggConfig.clickCallback();
						})
						.appendTo(autoSuggContainer);	
				});
				autoSuggConfig.selectedIndex = -1;
				autoSuggConfig.autoSuggList = newAutoSuggList;
				this.show();
			}
		} else {
			return;
		} 
	};
	
	this.show = function() {
		if (autoSuggContainer && active) {
			clearTimeout(hideContainerTimeout);
			autoSuggContainer.show();
		}
	};
	this.hide = function() {
		if (autoSuggContainer) {
			hideContainerTimeout = setTimeout (function() { autoSuggContainer.hide(); }, 200);
		}
	}
	this.setEnabled = function(value) {
		if(!autoSuggConfig.enabled || !searchInputBox) return;
		enabled = value;
	}
	this.handleInputBoxFocus = function() {
		this.show();
		active = true;
		searchInputBox.unbind('keydown');
		searchInputBox.keydown($.proxy(keyPress, this));
	}

	this.handleInputBoxBlur = function() {
		active = false;
		this.hide();
		searchInputBox.unbind('keydown');
	}	
	
};

HZ.ns("HZ.cart");
HZ.cart.Actions = new (function () {
	var self = this,
		MAX_DISPLAY_CART_COUNT = 9;
	this.addItem = function (itemId, quantity) {
		HZ.ui.yamdi.Common.loading("Adding item to cart");
		HZ.ajaz.Services.Cart.addItem(itemId, quantity, onAddItemResponse);
	};
	
	this.notifyCartVisible = function() {
		var cartDiv = $('#myCartMenuContent');
		if (!cartDiv.is('.loading,.loaded')) {
			cartDiv.addClass('loading');
			HZ.ajaz.Services.Cart.getCartDetails(function (response) {
				self.updateHeader(response.cartHeaderHTML, response.cartCount);
				cartDiv.removeClass('loading').addClass('loaded');
			});
		}
	};
	
	var onAddItemResponse = function (response) {
		if (response && response.success == 'true') {
			if (response.cartHeaderHTML) {
				HZ.ui.yamdi.Common.hideAllDialogs();
				HZ.ui.yamdi.Common.confirm("", "This item has been added to your cart.", 
										"Check Out Now", function() {
											window.location.href = HZ.utils.Config.viewShoppingCartUrl;
										}, 
										"Keep Shopping");
				self.updateHeader(response.cartHeaderHTML, response.cartCount);
			}
			else {
				displayMsg("Add item to cart","This item is not available.  Please try again later.");
			}
		}
		else {
			displayMsg("Add item to cart","This item is not available.  Please try again later.");
		}
	};
	
	var displayMsg = function (title, message) {
		HZ.ui.yamdi.Common.hideAllDialogs();
		HZ.ui.yamdi.Common.alert(title, message);
	};
	
	this.updateHeader = function (cartHeaderHtml, count) {
		if (cartHeaderHtml)
		{
			$('#myCartMenuContent').html(cartHeaderHtml);
		}
		if (count != undefined)
		{
			if (count > 0) {
				count = count > MAX_DISPLAY_CART_COUNT ? MAX_DISPLAY_CART_COUNT + "+" : count;
				$('#navMyCartCount').html(count);
			} else {
				$('#navMyCartCount').html("");
			}
				
		}
	};
	
})();


window.hzmr.push("standardHeader:1589");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End standardHeader.js  **************/
