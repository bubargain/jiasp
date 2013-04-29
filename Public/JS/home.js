window.hzmr = window.hzmr || [];
/************* Start home.js **************/
try {// <script>
var FeaturedSpacesAjaxController = {
	getFeaturedSpaces:function(offset, category, style, metroArea, callback) {
		var params = '/offset='+offset;
		params += '/cat='+category;
		params += '/style='+style;
		params += '/met='+metroArea;
        ajaxc.makeRequest('/getFeaturedSpaces','f',params,callback,'');
	},
	getFeaturedSpaces2:function(offset, thumbSize, callback) {
		var params = '/offset='+offset;
		params += '/tNum='+thumbSize;
		ajaxc.makeRequest('/getFeaturedSpaces','f2',params,callback,'');
	},
	getRecommendedSpaces:function(spacesSubset, category, callback) {
		var givenSpacesIds = spacesSubset.join(",");
		var params = '/bs='+givenSpacesIds;
		params += '/cat='+category;
		ajaxc.makeRequest('/getFeaturedSpaces','r',params,callback,'');		
	},
	publishGallerySpacesToHomeSlideshow:function(gid, callback) {
		var params = '/gid='+gid;
		ajaxc.makeRequest('/getFeaturedSpaces','p',params,callback,'');
	}
}
	var selectedHPGalleryImage = 0;
var featuredHPGalleryImageUrls = new Array();

function selectHPGalleryImage(num)
{
	galleryImg = document.getElementById('homePageGalleryImg');
	galleryImg.src = featuredHPGalleryImageUrls[num];
	selectedHPGalleryImage = num;
}

var timerId = null;
var timerCount = 0;

function nextHPGalleryImage()
{
	selectHPGalleryImage((1 + selectedHPGalleryImage) % featuredHPGalleryImageUrls.length);	
}

function setTimer()
{
	clearTimer();
	timerId = setTimeout("updateTimer()", 4500);
}

function updateTimer() 
{
	clearTimer();
	nextHPGalleryImage();
	if (timerCount + 1 < 4*featuredHPGalleryImageUrls.length) 
	{
		timerId = setTimeout("updateTimer()", 4500);
		timerCount++;
	}
}

function clearTimer()
{
	if (timerId) 
	{
		clearTimeout(timerId);
	}
}
HZ.ns("HZ.home");
HZ.home.Page = new (function(){
	this.followSuggestedUser = function (source, hzUsername, callback) {
		var source = $(source);
		var operation = (source.hasClass('following')) ? 'u' : 'f';
		var paramsString = '/'+'u' + '=' + encodeURIComponent(hzUsername);
		ajaxc.makeRequest('http://www.houzz.com/follow', operation, paramsString, function(response) {
			if (response && response.success == "true") {
				if( source.hasClass('following')) {
					source.text('Follow');
					source.removeClass('following');
				} else {
					source.addClass('following');
					source.text('Following');
				}
			} else {
				//source.text('Failed');
			}
			if (typeof callback == "function")
				callback(response);
		});
	}
	this.scrollToHere = function() {
		var element = $('.scrollToggle');
		var scrollPosition;
		if(element.hasClass('down')) {
			element.removeClass('down');
			scrollPosition = element.offset().top - 50;
		} else {
			scrollPosition = 0;
			element.addClass('down');
		}
		element.data('scrolling', true);
		$('html, body').animate({scrollTop:scrollPosition}, 'slow', function(){
			element.data('scrolling', false);
		});
	};
})();

window.hzmr.push("home:1589");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End home.js  **************/
