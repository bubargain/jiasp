window.hzmr = window.hzmr || [];
/************* Start BuzzAjaxRequest.php Ajax Connector **************/
try {//<script>
		HZ.ajaz.Services.movePhotos = function(houseIds, fromGalleryId, toGalleryId, isNewGallery, newGalleryTitle, onSuccess, extras) {
			var params = [
				{name:'houseIds',value:houseIds},
				{name:'fromGalleryId',value:fromGalleryId},
				{name:'toGalleryId',value:toGalleryId},
				{name:'newIdeabook',value:isNewGallery},
				{name:'newGalleryTitle',value:newGalleryTitle},
				{name:'moveAction',value:'move'}
			];
			
			var url = "\/buzzAjaxRequest";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		};
		
		HZ.ajaz.Services.copyPhotos = function(houseIds, fromGalleryId, toGalleryId, isNewGallery, newGalleryTitle, onSuccess, extras) {
			var params = [
				{name:'houseIds',value:houseIds},
				{name:'fromGalleryId',value:fromGalleryId},
				{name:'toGalleryId',value:toGalleryId},
				{name:'newIdeabook',value:isNewGallery},
				{name:'newGalleryTitle',value:newGalleryTitle},
				{name:'moveAction',value:'copy'}
			];
			
			var url = "\/buzzAjaxRequest";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		};
				HZ.ajaz.Services.removePhotos = function(fromGalleryId,houseIds,onSuccess,extras) {
			var params = [
				{name:'houseIds',value:houseIds},
				{name:'fromGalleryId',value:fromGalleryId},
				{name:'moveAction',value:'remove'}
			];
			
			var url = "\/buzzAjaxRequest";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		}
				HZ.ajaz.Services.deleteIdeabook = function(galleryId,onSuccess,extras) {
			var params = [
				{name:'fromGalleryId',value:galleryId},
				{name:'moveAction',value:'delete'}
			];
			
			var url = "\/buzzAjaxRequest";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		}
				HZ.ajaz.Services.saveOrder = function(galleryId,houseIds,onSuccess,extras) {
			var params = [
				{name:'fromGalleryId',value:galleryId},
				{name:'houseIds',value:houseIds},
				{name:'moveAction',value:'order'}
			];
			
			var url = "\/buzzAjaxRequest";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		}
				HZ.ajaz.Services.saveComment = function(galleryId,houseIds,buzzComment,buzzPrivacy,onSuccess,extras) {
			var params = [
				{name:'fromGalleryId',value:galleryId},
				{name:'houseIds',value:houseIds},
				{name:'buzzComment',value:buzzComment},
				{name:'buzzPrivacy',value:buzzPrivacy},
				{name:'moveAction',value:'comment'}
			];
			
			var url = "\/buzzAjaxRequest";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		}
				HZ.ajaz.Services.changeTitle = function(galleryId,title,onSuccess,extras) {
			var params = [
				{name:'fromGalleryId',value:galleryId},
				{name:'galleryTitle',value:title},
				{name:'moveAction',value:'changeTitle'}
			];
			
			var url = "\/buzzAjaxRequest";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		}
				HZ.ajaz.Services.changeSubtitle = function(galleryId,subtitle,onSuccess,extras) {
			var params = [
				{name:'fromGalleryId',value:galleryId},
				{name:'gallerySubtitle',value:subtitle},
				{name:'moveAction',value:'changeSubtitle'}
			];
			
			var url = "\/buzzAjaxRequest";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		}
				HZ.ajaz.Services.changeDescription = function(galleryId,description,onSuccess,extras) {
			var params = [
				{name:'fromGalleryId',value:galleryId},
				{name:'galleryDescription',value:description},
				{name:'moveAction',value:'changeDescription'}
			];
			
			var url = "\/buzzAjaxRequest";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		}
				HZ.ajaz.Services.changeGalleryMeta = function(galleryId, title, subtitle, description, galleryCategory, onSuccess,extras) {
			var params = [
				{name:'fromGalleryId',value:galleryId},
				{name:'moveAction',value:'changeMeta'}
			];
			
			if (title != null) {
				params.push({name:'galleryTitle',value:title});
			}
			if (subtitle != null) {
				params.push({name:'gallerySubtitle',value:subtitle});
			}
			if (description != null) {
				params.push({name:'galleryDescription',value:description});
			}
			if (galleryCategory != null) {
				params.push({name:'galleryCategory',value:galleryCategory});
			}
			var url = "\/buzzAjaxRequest";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		}
		

window.hzmr.push("BuzzAjaxRequest:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End BuzzAjax Ajax Connector  **************/
/************* Start SendEmailRequest.php Ajax Connector **************/
try {HZ.ajaz.Services.sendEmail = function (to, subject, message, type, referenceId, onSuccess, extras) {
	var params = [
		{name:'emailTo',value:to},
		{name:'emailSubject',value:subject},
		{name:'emailMessage',value:message},
		{name:'type',value:type},
		{name:'refId',value:referenceId}
	];
	var url = '/sendEmail';

	HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
};


window.hzmr.push("SendEmailRequest:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End SendEmail Ajax Connector  **************/
/************* Start GetEmbedSpaceCodeRequest.php Ajax Connector **************/
try {		HZ.ajaz.Services.getEmbedSpaceCode = function(spaceId, onSuccess) {
			var params = [
				{name:'spaceId',value:spaceId}
			];
			var extras = {
				type: 'GET'
			};
			var url = "\/getEmbedSpaceCode";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		}
	

window.hzmr.push("GetEmbedSpaceCodeRequest:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End GetEmbedSpaceCode Ajax Connector  **************/
/************* Start GetQuestionsForSpaceRequest.php Ajax Connector **************/
try {//<script>
	HZ.ns("HZ.spaceActions");	
	HZ.spaceActions.getExistingQuestions = function(spaceId, callback) {
		var params = '/id='+spaceId;
		ajaxc.makeRequest('/getQuestionsForSpace','', params, callback,'');
	}

	

window.hzmr.push("GetQuestionsForSpaceRequest:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End GetQuestionsForSpace Ajax Connector  **************/
/************* Start CartActionsRequest.php Ajax Connector **************/
try {//<script>
        // Defineing a new package name "Cart"
        HZ.ns('HZ.ajaz.Services.Cart');
		HZ.ajaz.Services.Cart.addItem = function(productId, quantity, onSuccess, extras) {
			var params = [
				{name:'ac', value:'0'},
				{name:'pId', value:productId},
				{name:'q', value:quantity}
			];
			var url = "\/editCart";
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		};
        HZ.ajaz.Services.Cart.updateItem = function(cartItemId, quantity, productId, onSuccess, extras) {
			var params = [
				{name:'ac', value:'1'},
				{name:'ciId', value:cartItemId},
				{name:'q', value:quantity},
				{name:'pId', value:productId}
			];
			var url = "\/editCart";
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		};
        HZ.ajaz.Services.Cart.removeItem = function(cartItemId, onSuccess, extras) {
			var params = [
				{name:'ac', value:'2'},
				{name:'ciId', value:cartItemId}
			];
			var url = "\/editCart";
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		};
        HZ.ajaz.Services.Cart.updateShippingMethod = function(vendorId, shippingClass, shippingMethod, onSuccess, extras) {
			var params = [
				{name:'ac', value:'4'},
				{name:'vId', value:vendorId},
				{name:'smId', value:shippingMethod},
				{name:'scls', value:shippingClass}
			];
			var url = "\/editCart";
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		};
        HZ.ajaz.Services.Cart.addItem = function(productId, quantity, onSuccess, extras) {
			var params = [
				{name:'ac', value:'0'},
				{name:'pId', value:productId},
				{name:'q', value:quantity}
			];
			var url = "\/editCart";
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		};
		HZ.ajaz.Services.Cart.getCartDetails = function (onSuccess, extras) {
			var params = [
				{name:'ac', value:'5'}
			];
			var url = "\/editCart";
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		}
	    

window.hzmr.push("CartActionsRequest:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End CartActions Ajax Connector  **************/
/************* Start LikeRequest.php Ajax Connector **************/
try {//<script>
		HZ.ns("HZ.ajaz.Like");
		HZ.ajaz.Like.like = function(action,objectId,objectType,onSuccess,extras) {
			var params = [
				{name:'action',value:action},
				{name:'objectId',value:objectId},
				{name:'objectType',value:objectType}
			];
			
			var url = "\/like";
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		}
		HZ.ajaz.Like.SOURCE_LINK_LIKE = 8;
	

window.hzmr.push("LikeRequest:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End Like Ajax Connector  **************/
/************* Start HoverCardRequest.php Ajax Connector **************/
try {//<script>
		HZ.ajaz.Services.getHoverCardData = function (dataType, dataId, onSuccess) {
			var params = [
				{name:'type', value: dataType},
				{name:'id', value: dataId}
			];
			var url = '/hoverCard';
			
			HZ.ajaz.AjaxReq.send(url,params,onSuccess);
		};
	    

window.hzmr.push("HoverCardRequest:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End HoverCard Ajax Connector  **************/
/************* Start CheckNameAvailabilityRequest.php Ajax Connector **************/
try {var CheckNamAvailabilityAjaxController = {
	checkName:function(userName, callback) {
		var params = '/u='+userName;
		ajaxc.makeRequest('http://www.houzz.com/checkNameAvailability','u',params,callback,'');		
	},
	checkEmail:function(email, callback) {
		var params = '/e='+email;
		ajaxc.makeRequest('http://www.houzz.com/checkNameAvailability','e',params,callback,'');		
	}
}
	

window.hzmr.push("CheckNameAvailabilityRequest:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End CheckNameAvailability Ajax Connector  **************/
/************* Start SearchKeywordRequest.php Ajax Connector **************/
try {		HZ.ajaz.Services.autoCompleteKeyword = function(textFragment, type, onSuccess, extras) {
			var params = [
				{name:'query',value:textFragment},
				{name:'type',value:type}
			];
			var url = "\/searchKeyword";
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		}
		

window.hzmr.push("SearchKeywordRequest:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End SearchKeyword Ajax Connector  **************/
/************* Start AjaxEventLoggerRequest.php Ajax Connector **************/
try {//<script>
		HZ.ajaz.Services.ajaxEventLogger = function(eventName, eventCount, eventMessage, onSuccess, extras) {
			var params = [
				{name:'evtName',value:eventName},
				{name:'evtCount',value:eventCount},
				{name:'evtMessage',value:eventMessage},
			];
			var url = "\/ajaxEventLogger";
			HZ.ajaz.AjaxReq.send(url,params,onSuccess,extras);
		}
	

window.hzmr.push("AjaxEventLoggerRequest:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End AjaxEventLogger Ajax Connector  **************/