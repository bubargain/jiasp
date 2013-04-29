window.hzmr = window.hzmr || [];
/************* Start upload.js **************/
try {// <script>

imageSizeRatio = 1.3333333;
thumbImageLargeSideMaxSize = 120;
selectedImageId = 0;
origImageWidth = new Array();
origImageHeight = new Array();
selectedMetro = 0;

function isImageOk(img) 
{
    if (!img.complete) return false;
    if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) return false;
    return true;
}

function resizeImage(image,imageLargeSideMaxSize)
{	
	imageSmallSideMaxSize = imageLargeSideMaxSize / imageSizeRatio;
	imageWidth = image.width;
	imageHeight = image.height;
	if (((imageWidth/imageHeight) >= imageSizeRatio) && (imageWidth > imageLargeSideMaxSize))
	{
		image.width = imageLargeSideMaxSize;
		image.height = imageLargeSideMaxSize * imageHeight/imageWidth;
	} else if (((imageWidth/imageHeight) < imageSizeRatio) && (imageHeight > imageSmallSideMaxSize))
	{
		image.height = imageSmallSideMaxSize;
		image.width = imageSmallSideMaxSize * imageWidth/imageHeight;
	} 	
}

function resizeThumbImages()
{
	pageImageNum = 0;
	while (image=document.getElementById('pageImage'+String(pageImageNum)))
	{
		origImageWidth['pageImage'+pageImageNum] = image.width;
		origImageHeight['pageImage'+pageImageNum] = image.height;
		resizeImage(image,thumbImageLargeSideMaxSize);
        if (isImageOk(image)) 
        	image.style.display='inline';
        	else image.style.display='none';
		pageImageNum++;		
	}
}

function selectImage(thumbImage)
{
	if (null != thumbImage) 
	{
		selectedImage=document.getElementById('selectedImage');
		selectedImage.src = thumbImage.src;
		selectedImage.width = origImageWidth[thumbImage.id];
		selectedImage.height = origImageHeight[thumbImage.id];
		resizeImage(selectedImage,380);
		document.upload.selectedImagesUrls.value = selectedImage.src;
	}
}

function showMoreImageUploadLines()
{
	additionalImages=document.getElementById('additionalImagesDiv');
	if (additionalImages) additionalImages.style.display='block';
	additionalImagesLink=document.getElementById('additionalImagesLinkDiv');
	if (additionalImagesLink) additionalImagesLink.style.display='none';	
}

function resetForm(imageId)
{
	resizeThumbImages();
	selectedImageId = imageId;
	selectImage(document.getElementById('pageImage'+String(imageId)));
}

function toggleNewProject(o,newProjectValue)
{
	var newProjectDiv = document.getElementById('newProjectDiv');
	if (o.value == newProjectValue)  {
		newProjectDiv.style.display='block';
		$('#newProjectDiv input.uploadInput[name="projectName"]').focus();
	}
	else newProjectDiv.style.display='none';
}
//TODO PHIL remove this
function rootCategoryChangeEvent(newRootCategoryId)
{
	var metroSelectors = $("#metroInput select");
	var metroInputContainer = $("#metroInput");

	$('#categoryId').attr('value',newRootCategoryId);

		if (newRootCategoryId == 1 || newRootCategoryId == 3) {
				if (!metroInputContainer.is(":visible")) {
			if (metroSelectors.length == 1)
				metroSelectors[0].value = selectedMetro;
			metroInputContainer.show();
		}
	}
	else {
		if (metroInputContainer.is(":visible"))
		{
			metroInputContainer.hide();
						if (metroSelectors.length == 1) {
				selectedMetro = metroSelectors[0].value;
				metroSelectors[0].value = 0;
			}
		}
	}
}

//TODO PHIL remove this
function uploadTypeSelectEvent(element,type)
{
	$("ul#uploadTypeSelector li").removeClass("on");
	$(element).addClass("on");
	if (type == 'ideabook')
	{
		$("#galleryFields").show();
		$("#projectFields").hide();
		$("#dosAndDonts").hide();
	}
	else if (type == 'project')
	{
		$("#galleryFields").hide();
		$("#projectFields").show();
		$("#dosAndDonts").show();
	}
}

$(document).ready(function(){
	var currentO = 0;
	$("#rr").click(function(){
		currentO += 90;
		currentO = currentO % 360;
		$("#spaceImage").rotate(currentO);
		$("#rotateDeg").val(currentO);
	});
	$("#rl").click(function(){
		currentO -= 90;
		currentO = (currentO+360) % 360;
		$("#spaceImage").rotate(currentO % 360);
		$("#rotateDeg").val(currentO);
	});
	$('.keywordsInput').charCount({
		allowed: 700,
		counterText: "Characters left: ",
		counterElement: "div"
	});
	//TODO PHIL remove this
	var toGallerySelect = $('#toGallerySelect');
	if (toGallerySelect.length > 0) {
		HZ.spaceActions.Share.populateToGallerySelect(toGallerySelect[0], 0);
	}
	
		$("#uploadTypeSelector li:first").click();

});


window.hzmr.push("upload:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End upload.js  **************/
/************* Start hzSwfUpload.js **************/
try {//<script>
	
HZ.ns('HZ.upload.SWFUpload');
HZ.upload.SWFUpload = function (options) {
	var self = this;
	
	var afterUploadComplete = null;
	
	this.uploadErrors = []; //an array of upload errors {file:'frontPorch.jpg',errorCode:<<errorCode>>}
	
	this.setAfterUploadComplete = function (afterUploadCompleteHandler) {
		afterUploadComplete = afterUploadCompleteHandler;
	};
	
	this.setParams = function (params) {
		self.swfUploadObject.setPostParams(params);
	};
	
	this.startUpload = function () {
		self.swfUploadObject.startUpload();
	};
	
	var fileQueued = function (file) {
		try {
			var progress = new FileProgress(file, self.swfUploadObject.customSettings.progressTarget);
			$('#noFlashTrigger').hide();
			//progress.setStatus("Pending...");
			//progress.toggleCancel(true, this);
		} catch (ex) {
			self.swfUploadObject.debug(ex);
		}
	};
	
	var fileQueueError = function (file, errorCode, message) {
		try {
			self.uploadErrors.push({
								file:file.name,
								error:errorCode
							});
			if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
				alert("You have attempted to queue too many files.\n" + (message === 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
				return;
			}

			var progress = new FileProgress(file, self.swfUploadObject.customSettings.progressTarget);
			progress.setError();
			progress.toggleCancel(false);
			var errorMsg = SWFUpload.ERROR_MESSAGES[errorCode];
			if (file !== null) {
				progress.setStatus(errorMsg);
			}
			self.swfUploadObject.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
		} catch (ex) {
			self.swfUploadObject.debug(ex);
		}
	};
	
	var fileDialogComplete = function (numFilesSelected, numFilesQueued) {
			};
	
	var uploadStart = function (file) {
		try {
					var progress = new FileProgress(file, self.swfUploadObject.customSettings.progressTarget);
			progress.setStatus("Uploading...");
			progress.toggleCancel(true, this);
		}
		catch (ex) {}

		return true;
	};
	
	var uploadProgress = function (file, bytesLoaded, bytesTotal) {
		try {
			var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);

			var progress = new FileProgress(file, self.swfUploadObject.customSettings.progressTarget);
			progress.setProgress(percent);
			progress.setStatus("Uploading... "+percent+"%");
		} catch (ex) {
			self.swfUploadObject.debug(ex);
		}
	};
	
	var uploadSuccess = function (file, serverData) {
		try {
			var progress = new FileProgress(file, self.swfUploadObject.customSettings.progressTarget);
			progress.setComplete();
			progress.setStatus("Complete.");
			progress.toggleCancel(false);

		} catch (ex) {
			self.swfUploadObject.debug(ex);
		}
	}

	var uploadError = function (file, errorCode, message) {
		try {
			var progress = new FileProgress(file, self.swfUploadObject.customSettings.progressTarget);
			progress.setError();
			progress.toggleCancel(false);
			
			self.uploadErrors.push({
								file:file.name,
								error:errorCode
							});
			switch (errorCode) {
			case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
				// If there aren't any files left (they were all cancelled) disable the cancel button
				if (this.getStats().files_queued === 0) {
					$('#'+self.swfUploadObject.customSettings.cancelButtonId).attr('disabled','disabled');
				}
				progress.setStatus("Cancelled");
				progress.setCancelled();
				break;
			case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
				progress.setStatus("Stopped");
				break;
			default:
				progress.setStatus(SWFUpload.ERROR_MESSAGES[errorCode]);
				self.swfUploadObject.debug("ErrorCode:"+errorCode+" "+SWFUpload.ERROR_MESSAGES[errorCode]+" - " + 
										"File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			}
		} catch (ex) {
			self.swfUploadObject.debug(ex);
		}
	};

	var uploadComplete = function (file) {
		var stats = self.swfUploadObject.getStats();
		queueComplete(stats.successful_uploads);
		if (stats.files_queued === 0) {
			$('#'+self.swfUploadObject.customSettings.cancelButtonId).attr('disabled','disabled');
			if (stats.successful_uploads > 0 && afterUploadComplete) {
				afterUploadComplete.apply(self);
			}
		}	
	};

	// This event comes from the Queue Plugin
	var queueComplete = function (numFilesUploaded) {
		var status = document.getElementById("divStatus");
		status.innerHTML = numFilesUploaded + " file" + (numFilesUploaded === 1 ? "" : "s") + " uploaded.";
	};
	
	var defaults = {
		flash_url : HZ.utils.Links.getPicUrl("swfupload_f10.swf"),
		upload_url: HZ.utils.Config.uploadSpacesUrl,	// Relative to the SWF file
		file_size_limit : "30 MB",
		file_types : "*.jpg;*.jpeg;*.gif;*.png",
		file_types_description : "All Files",
		file_upload_limit : 100,
		file_queue_limit : 0,
		custom_settings : {
			progressTarget : "fsUploadProgress",
			cancelButtonId : "btnCancel"
		},
		debug: false,

		// Button settings
		button_image_url: HZ.utils.Links.getPicUrl("selectPhotoFiles.png"),
		button_width: "130",
		button_height: "18",
		button_placeholder_id: "spanButtonPlaceHolder",

		file_queued_handler : fileQueued,
		file_queue_error_handler : fileQueueError,
		file_dialog_complete_handler : fileDialogComplete,
		upload_start_handler : uploadStart,
		upload_progress_handler : uploadProgress,
		upload_error_handler : uploadError,
		upload_success_handler : uploadSuccess,
		upload_complete_handler : uploadComplete,
		queue_complete_handler : queueComplete	// Queue plugin event
	};
	
	var settings;
	if (options === undefined) {
		settings = defaults;
	}
	else {
		settings = $.extend({},defaults,options);
	}
	this.swfUploadObject = new SWFUpload(settings);
};

window.hzmr.push("hzSwfUpload:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End hzSwfUpload.js  **************/
/************* Start jQ-AjaxFileUpload.js **************/
try {/*
// jQuery Ajax File Uploader
//
// @author: Jordan Feldstein <jfeldstein.com>
//
//  - Ajaxifies an individual <input type="file">
//  - Files are sandboxed. Doesn't matter how many, or where they are, on the page.
//  - Allows for extra parameters to be included with the file
//  - onStart callback can cancel the upload by returning false
//	https://github.com/jfeldstein/jQuery.AjaxFileUpload.js
*/


(function($) {
    $.fn.ajaxfileupload = function(options) {
        var settings = {
          params: {},
          action: '',
          onStart: function() { console.log('starting upload'); console.log(this); },
          onComplete: function(response) { console.log('got response: '); console.log(response); console.log(this); },
          onCancel: function() { console.log('cancelling: '); console.log(this); },
          valid_extensions : ['gif','png','jpg','jpeg'],
          submit_button : null
        };

        var uploading_file = false;

        if ( options ) { 
          $.extend( settings, options );
        }


        // 'this' is a jQuery collection of one or more (hopefully) 
        //  file elements, but doesn't check for this yet
        return this.each(function() {
          var $element = $(this);

          // Skip elements that are already setup. May replace this 
          //  with uninit() later, to allow updating that settings
          if($element.data('ajaxUploader-setup') === true) return;

          $element.change(function()
          {
            // since a new image was selected, reset the marker
            uploading_file = false;

            // only update the file from here if we haven't assigned a submit button
            if (settings.submit_button == null)
            {
              upload_file();
            }
          });

          if (settings.submit_button == null)
          {
            // do nothing
          } else
          {
            settings.submit_button.click(function()
            {
              // only attempt to upload file if we're not uploading
              if (!uploading_file)
              {
                upload_file();
              }
            });
          }

          var upload_file = function()
          {
            if($element.val() == '') return settings.onCancel.apply($element, [settings.params]);

            // make sure extension is valid
            var ext = $element.val().split('.').pop().toLowerCase();
            if($.inArray(ext, settings.valid_extensions) == -1)
            {
              // Pass back to the user
              settings.onComplete.apply($element, [{status: false, message: 'The select file type is invalid. File must be ' + settings.valid_extensions.join(', ') + '.'}, settings.params]);
            } else
            { 
              uploading_file = true;

              // Creates the form, extra inputs and iframe used to 
              //  submit / upload the file
              wrapElement($element);

              // Call user-supplied (or default) onStart(), setting
              //  it's this context to the file DOM element
              var ret = settings.onStart.apply($element);

              // let onStart have the option to cancel the upload
              if(ret !== false)
              {
                $element.parent('form').submit();
              }
            }
          };

          // Mark this element as setup
          $element.data('ajaxUploader-setup', true);

          /*
          // Internal handler that tries to parse the response 
          //  and clean up after ourselves. 
          */
          var handleResponse = function(loadedFrame, element) {
            var response, responseStr = loadedFrame.contentWindow.document.body.innerHTML;
            try {
              response = $.parseJSON($.trim(responseStr));
              //response = JSON.parse(responseStr);
            } catch(e) {
              response = responseStr;
            }

            // Tear-down the wrapper form
            element.siblings().remove();
            element.unwrap();

            uploading_file = false;

            // Pass back to the user
            settings.onComplete.apply(element, [response, settings.params]);
          };

          /*
          // Wraps element in a <form> tag, and inserts hidden inputs for each
          //  key:value pair in settings.params so they can be sent along with
          //  the upload. Then, creates an iframe that the whole thing is 
          //  uploaded through. 
          */
          var wrapElement = function(element) {
            // Create an iframe to submit through, using a semi-unique ID
            var frame_id = 'ajaxUploader-iframe-' + Math.round(new Date().getTime() / 1000)
            $('body').append('<iframe width="0" height="0" style="display:none;" name="'+frame_id+'" id="'+frame_id+'"/>');
            $('#'+frame_id).load(function() {
              handleResponse(this, element);
            });

            // Wrap it in a form
            element.wrap(function() {
              return '<form action="' + settings.action + '" method="POST" enctype="multipart/form-data" target="'+frame_id+'" />'
            })
            // Insert <input type='hidden'>'s for each param
            .after(function() {
              var key, html = '';
              for(key in settings.params) {
                html += '<input type="hidden" name="' + key + '" value="' + settings.params[key] + '" />';
              }
              return html;
            });
          }



        });
      }
})( jQuery );

window.hzmr.push("jQ-AjaxFileUpload:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End jQ-AjaxFileUpload.js  **************/
/************* Start uploadSpaces2.js **************/
try {// <script>

HZ.ns('HZ.upload');
HZ.upload.UploadSpaces = new (function () {
	var formMode, 
		noFlashUpload = false;
	var uploadForm, newProjectNameFldRow, submitBtn;
	var self = this;
	
	this.swfUpload = null;
	
	this.init = function (mode) {
		if (mode) {
			formMode = mode;
		}
		else {
			formMode = 'project';
		}
		
				if ($('#uploadPhotosFlds').hasClass('noFlash'))
		{
			noFlashUpload = true;
		}
		if (!noFlashUpload)
		{
			initSWFUpload();
		}
		$('#noFlashTrigger').click(onNoFlashTriggerClick);
		
		
		$('.hzChoice').click(function () {
			onChoiceTabClick($(this));
		});
		
		$('#switchToProjectModeLink').click(function () {
			onChoiceTabClick($('.hzChoice.toProject'))
		});
		
		uploadForm = $('form#upload');
		newProjectNameFldRow = $('#newProjectNameFldRow');
		submitBtn = $('#submitBtn');
		
		var toGallerySelect = $('#gallerySelect');
		if (toGallerySelect.length > 0) {
			HZ.spaceActions.Share.populateToGallerySelect(toGallerySelect[0], 0);
		}
		
		toGallerySelect.change(onGallerySelectChange);
		
		$('input[name="category"]').change(onRootCategoryChange);
		
		submitBtn.click(submitSWFForm);
		self.populateToProjectSelect($('#projectSelect'));
		
	};
	
	var initSWFUpload = function() {
		self.swfUpload = new HZ.upload.SWFUpload();
		self.swfUpload.setAfterUploadComplete(function () {
			onAfterUploadComplete(this.uploadErrors);
		});
	};
	
	var onAfterUploadComplete = function (uploadErrors) {
		var link = null;
		if (formMode == 'gallery') {
			link = HZ.utils.Links.getOrganizeLink('gallery', -2);
		}
		else {
			link = HZ.utils.Links.getOrganizeLink('proj', -2);
		}

		if (uploadErrors && uploadErrors.length > 0) {
			link += '/uploadErr=';
			for (var i = 0; i < uploadErrors.length; i++) {
				var uploadErr = uploadErrors[i];
				link += encodeURI(uploadErr.file)+'_:_'+uploadErr.error;
				if (i != uploadErrors.length -1) {
					link += '_,_';
				}
			}
		}
		window.location = link;
	};
	var onNoFlashTriggerClick = function () {
		$('#uploadPhotosFlds').removeClass('flash').addClass('noFlash');
		noFlashUpload = true;
	};
	
	var onRootCategoryChange = function (ev) {
		var target = $(this);
		var category = target.val();
		var metroFldRow = $('#metroFldRow');
		if (category == '2') {
			metroFldRow.hide();
		}
		else {
			metroFldRow.show();
		}
	};
	
	var onGallerySelectChange = function (ev) {
		var target = $(this);
		if (target.val() == 'NewIdeabook') {
			$('#newGalleryNameFldRow').show();
		}
		else {
			$('#newGalleryNameFldRow').hide();
		}
	};
	
	var submitSWFForm = function (ev) {		
		var params = {};
		var projectSelect = $('#projectSelect'),
			gallerySelect = $('#gallerySelect'),
			newProjectNameFld = $('#newProjectNameFld'),
			newGalleryNameFld = $('#newGalleryNameFld');
		var fileCount = 0;
		if (noFlashUpload) {
			if ($('input[type="file"]').val()!="") {
				fileCount = 1;
			}
		}
		else {
			fileCount = $('.progressContainer').length;
		}
		if (fileCount == 0) {
			self.alert('Upload photos', 'Please select at least one photo file to upload.');
		}
		else if (formMode == 'project' && projectSelect.val() == 'NewProject' && $.trim(newProjectNameFld.val()) == "") {
			self.alert('Upload photos to a project', 'Please enter a new project name.');
		}
		else if (formMode == 'project' && projectSelect.val() <= 0) {
			self.alert('Upload photos to a project', 'Please select an existing project or create a new one.');
		}
		else if (formMode == 'gallery' && gallerySelect.val() == 'NewIdeabook' && $.trim(newGalleryNameFld.val()) == "") {
			self.alert('Upload photos to an ideabook', 'Please enter a new ideabook name');
		}
		else if (formMode == 'gallery' && $('#gallerySelect').val() <= 0) {
			self.alert('Upload photos to an ideabook', 'Please select an existing ideabook or create a new one.');
		}
		else
		{	
			submitBtn.attr('disabled','disabled');
			var paramArray = uploadForm.serializeArray();
			$.each(paramArray, function (index, param) {
				params[param.name] = param.value;
			});
			if (noFlashUpload) {
				noFlashUploadSubmit(params);
			}
			else {
				swfUploadSubmit(params);
			}
		}
	};
	
	var noFlashUploadSubmit = function (params) {
		$('input[type="file"]').ajaxfileupload({
			'action': HZ.utils.Config.uploadSpacesUrl,
			'params': params,
			'onStart' : function () {},
			'onComplete' : function (response,settings) {
				if (!response) {
					self.alert('Select file to upload', 'Server cannot accept this upload');
				}
				if (response.status == false) {
					self.alert('Select file to upload', response.message);
				}
				else {
					onAfterUploadComplete();
				}
			}
		}).trigger('change');
	};
	
	var swfUploadSubmit = function (params) {
		self.swfUpload.setParams(params);		
		self.swfUpload.startUpload();
	};
		
	var onChoiceTabClick = function (target) {
		if (target.hasClass('selected')) {
			return;
		}
		$('.hzChoice').removeClass('selected');
		target.addClass('selected');
		
		if (target.hasClass('toProject')) {
			switchMode('project');
		}
		else if (target.hasClass('toGallery')) {
			switchMode('gallery');
		}
	};
	
	var switchMode = function (switchToMode) {
		if (switchToMode == 'project') {
			uploadForm.removeClass('gallery').addClass('project');
			uploadForm.find('#uploadToFld').val('project');
			$('.progression .step2').text('Step 2: Describe photos');
			formMode = 'project';
		}
		else if (switchToMode == "gallery") {
			uploadForm.removeClass('project').addClass('gallery');
			$('.progression .step2').text('Step 2: Tell us what you like about the photos');
			uploadForm.find('#uploadToFld').val('gallery');
			formMode = 'gallery';
		}
	};
	
	this.populateToProjectSelect = function (selectElement) {
		var projects = HZ.data.Projects.getCollection();
		var projectsArray = [];
		var optionsHTML = "";
		//sort alphabetically
		for (var i in projects) {
			projectsArray.push([i, projects[i]]);
		}
		projectsArray.sort(function (a, b) {
			if (a[1] == b[1]) {
				return 0;
			}
			if (a[1] < b[1]) {
				return -1;
			}
			if (a[1] > b[1]) {
				return 1;
			}
		});
		var j, p;
		//populate the select
		for (j = 0; j < projectsArray.length; j++) {
			p = projectsArray[j];
			optionsHTML += '<option value="'+p[0]+'">'+p[1]+'</option>';
		}
		
		selectElement.append(optionsHTML);
		
		selectElement.change(function () {
			if ($(this).val() == 'NewProject') {
				newProjectNameFldRow.show();
			}
			else {
				newProjectNameFldRow.hide();
			}
		})
	};
	
	this.alert = function (title, message) {
		HZ.ui.yamdi.Common.hideAllDialogs();
		HZ.ui.yamdi.Common.alert(title,message);
	};
})();


window.hzmr.push("uploadSpaces2:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End uploadSpaces2.js  **************/