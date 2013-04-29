window.hzmr = window.hzmr || [];
/************* Start browse.js **************/
try {function chooseThumbImage(imageUrl,thumbNum)
{
	mainImg=document.getElementById('mainImage');
	mainImg.src = imageUrl;
	for (i=1;i<=10;i++)
	{
		thumbImage=document.getElementById('thumb'+i);
		thumbImage.className='viewImage'+((i==thumbNum)?'On':'');
	}
}
function expandDiv(divId, expand) {
	if(expand===undefined)	expand=true;
	var e1 = document.getElementById(divId+"Full");
	var e2 = document.getElementById(divId+"Partial");
	if (e1 && e2) {
		e1.style.display = expand?"inline":"none";
		e2.style.display = expand?"none":"inline";
	}
}

var searchWidgetLoaded=false;
function loadSearchWidget(searchWidgetDiv,backgroundColor,foregroundColor,widgetType)
{
	if (!searchWidgetLoaded) 
	{
		document.getElementById("searchWidgetPreview").style.backgroundColor = "#"+backgroundColor;
		searchWidgetDiv.innerHTML=getSearchWidgetHtml(200,backgroundColor,foregroundColor,widgetType,false,true);
		searchWidgetLoaded=true;
	}
}
function handleMouseOver(imageId) {
	elemId = "viewGalleryItemButtons"+imageId;
	// toggleButtonsRibbon(elemId, true);
	// toggleImageButton("addToIdeabook"+imageId,true);
	elemId = "imageOverlay" + imageId;
	toggleImageOverlay (elemId, true);
}
function handleMouseOut(imageId) {
	elemId = "viewGalleryItemButtons"+imageId;
	// toggleButtonsRibbon(elemId, false);
	// toggleImageButton("addToIdeabook"+imageId,false);
	elemId = "imageOverlay" + imageId;
	toggleImageOverlay (elemId, false);
}
function toggleImageButton(imageButtonId,expand) {
	var elem = document.getElementById(imageButtonId);
	if (elem) {
		var className = elem.className || "";
		r = className.match(/^(.*?)($|\s)/);
		if (r) {
			r = r[1];
			if (!expand)
				r += " " + r + "Collapsed";
			elem.className = r;
		}
	}
}
function toggleButtonsRibbon(ribbonId, display) {
	var elem = document.getElementById(ribbonId);
	if (display) {
		elem.style.opacity = 1;
	} else {
		elem.style.opacity = 0.5;
	}
}
function toggleImageOverlay(overlayId, display) {
	var elem = document.getElementById(overlayId);
	if (elem) 
		elem.style.display = display?"inline":"none";
		
}
function trimBottomPadding(imageId) {
	var elem1 = document.getElementById("floatingImage"+imageId);
	var elem2 = document.getElementById("itemText"+imageId);
	// console.log (elem1.offsetHeight + " : " + elem2.offsetHeight);
	if (!elem2 || elem1.offsetHeight > elem2.offsetHeight)
		elem1.style.paddingBottom = 0;
}

window.hzmr.push("browse:1591");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End browse.js  **************/