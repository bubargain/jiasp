window.hzmr = window.hzmr || [];
/************* Start swfupload.js **************/
try {/**
 * SWFUpload: http://www.swfupload.org, http://swfupload.googlecode.com
 *
 * mmSWFUpload 1.0: Flash upload dialog - http://profandesign.se/swfupload/,  http://www.vinterwebb.se/
 *
 * SWFUpload is (c) 2006-2007 Lars Huring, Olov Nilz锟絥 and Mammon Media and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * SWFUpload 2 is (c) 2007-2008 Jake Roberts and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */


/* ******************* */
/* Constructor & Init  */
/* ******************* */
var SWFUpload;

if (SWFUpload == undefined) {
	SWFUpload = function (settings) {
		this.initSWFUpload(settings);
	};
}

SWFUpload.prototype.initSWFUpload = function (settings) {
	try {
		this.customSettings = {};	// A container where developers can place their own settings associated with this instance.
		this.settings = settings;
		this.eventQueue = [];
		this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
		this.movieElement = null;


		// Setup global control tracking
		SWFUpload.instances[this.movieName] = this;

		// Load the settings.  Load the Flash movie.
		this.initSettings();
		this.loadFlash();
		this.displayDebugInfo();
	} catch (ex) {
		delete SWFUpload.instances[this.movieName];
		throw ex;
	}
};

/* *************** */
/* Static Members  */
/* *************** */
SWFUpload.instances = {};
SWFUpload.movieCount = 0;
SWFUpload.version = "2.2.0 Beta 3";
//errors are defined in swfupload.errors.js
SWFUpload.FILE_STATUS = {
	QUEUED		 : -1,
	IN_PROGRESS	 : -2,
	ERROR		 : -3,
	COMPLETE	 : -4,
	CANCELLED	 : -5
};
SWFUpload.BUTTON_ACTION = {
	SELECT_FILE  : -100,
	SELECT_FILES : -110,
	START_UPLOAD : -120
};
SWFUpload.CURSOR = {
	ARROW : -1,
	HAND : -2
};
SWFUpload.WINDOW_MODE = {
	WINDOW : "window",
	TRANSPARENT : "transparent",
	OPAQUE : "opaque"
};

/* ******************** */
/* Instance Members  */
/* ******************** */

// Private: initSettings ensures that all the
// settings are set, getting a default value if one was not assigned.
SWFUpload.prototype.initSettings = function () {
	this.ensureDefault = function (settingName, defaultValue) {
		this.settings[settingName] = (this.settings[settingName] == undefined) ? defaultValue : this.settings[settingName];
	};
	
	// Upload backend settings
	this.ensureDefault("upload_url", "");
	this.ensureDefault("file_post_name", "Filedata");
	this.ensureDefault("post_params", {});
	this.ensureDefault("use_query_string", false);
	this.ensureDefault("requeue_on_error", false);
	this.ensureDefault("http_success", []);
	
	// File Settings
	this.ensureDefault("file_types", "*.*");
	this.ensureDefault("file_types_description", "All Files");
	this.ensureDefault("file_size_limit", 0);	// Default zero means "unlimited"
	this.ensureDefault("file_upload_limit", 0);
	this.ensureDefault("file_queue_limit", 0);

	// Flash Settings
	this.ensureDefault("flash_url", "swfupload.swf");
	this.ensureDefault("prevent_swf_caching", true);
	
	// Button Settings
	this.ensureDefault("button_image_url", "");
	this.ensureDefault("button_width", 1);
	this.ensureDefault("button_height", 1);
	this.ensureDefault("button_text", "");
	this.ensureDefault("button_text_style", "color: #000000; font-size: 16pt;");
	this.ensureDefault("button_text_top_padding", 0);
	this.ensureDefault("button_text_left_padding", 0);
	this.ensureDefault("button_action", SWFUpload.BUTTON_ACTION.SELECT_FILES);
	this.ensureDefault("button_disabled", false);
	this.ensureDefault("button_placeholder_id", null);
	this.ensureDefault("button_cursor", SWFUpload.CURSOR.ARROW);
	this.ensureDefault("button_window_mode", SWFUpload.WINDOW_MODE.WINDOW);
	
	// Debug Settings
	this.ensureDefault("debug", false);
	this.settings.debug_enabled = this.settings.debug;	// Here to maintain v2 API
	
	// Event Handlers
	this.settings.return_upload_start_handler = this.returnUploadStart;
	this.ensureDefault("swfupload_loaded_handler", null);
	this.ensureDefault("file_dialog_start_handler", null);
	this.ensureDefault("file_queued_handler", null);
	this.ensureDefault("file_queue_error_handler", null);
	this.ensureDefault("file_dialog_complete_handler", null);
	
	this.ensureDefault("upload_start_handler", null);
	this.ensureDefault("upload_progress_handler", null);
	this.ensureDefault("upload_error_handler", null);
	this.ensureDefault("upload_success_handler", null);
	this.ensureDefault("upload_complete_handler", null);
	
	this.ensureDefault("debug_handler", this.debugMessage);

	this.ensureDefault("custom_settings", {});

	// Other settings
	this.customSettings = this.settings.custom_settings;
	
	// Update the flash url if needed
	if (this.settings.prevent_swf_caching) {
		this.settings.flash_url = this.settings.flash_url + "?swfuploadrnd=" + Math.floor(Math.random() * 999999999);
	}
	
	delete this.ensureDefault;
};

SWFUpload.prototype.loadFlash = function () {
	if (this.settings.button_placeholder_id !== "") {
		this.replaceWithFlash();
	} else {
		this.appendFlash();
	}
};

// Private: appendFlash gets the HTML tag for the Flash
// It then appends the flash to the body
SWFUpload.prototype.appendFlash = function () {
	var targetElement, container;

	// Make sure an element with the ID we are going to use doesn't already exist
	if (document.getElementById(this.movieName) !== null) {
		throw "ID " + this.movieName + " is already in use. The Flash Object could not be added";
	}

	// Get the body tag where we will be adding the flash movie
	targetElement = document.getElementsByTagName("body")[0];

	if (targetElement == undefined) {
		throw "Could not find the 'body' element.";
	}

	// Append the container and load the flash
	container = document.createElement("div");
	container.style.width = "1px";
	container.style.height = "1px";
	container.style.overflow = "hidden";

	targetElement.appendChild(container);
	container.innerHTML = this.getFlashHTML();	// Using innerHTML is non-standard but the only sensible way to dynamically add Flash in IE (and maybe other browsers)

	// Fix IE Flash/Form bug
	if (window[this.movieName] == undefined) {
		window[this.movieName] = this.getMovieElement();
	}
	
	
};

// Private: replaceWithFlash replaces the button_placeholder element with the flash movie.
SWFUpload.prototype.replaceWithFlash = function () {
	var targetElement, tempParent;

	// Make sure an element with the ID we are going to use doesn't already exist
	if (document.getElementById(this.movieName) !== null) {
		throw "ID " + this.movieName + " is already in use. The Flash Object could not be added";
	}

	// Get the element where we will be placing the flash movie
	targetElement = document.getElementById(this.settings.button_placeholder_id);

	if (targetElement == undefined) {
		throw "Could not find the placeholder element.";
	}

	// Append the container and load the flash
	tempParent = document.createElement("div");
	tempParent.innerHTML = this.getFlashHTML();	// Using innerHTML is non-standard but the only sensible way to dynamically add Flash in IE (and maybe other browsers)
	targetElement.parentNode.replaceChild(tempParent.firstChild, targetElement);

	// Fix IE Flash/Form bug
	if (window[this.movieName] == undefined) {
		window[this.movieName] = this.getMovieElement();
	}
	
};

// Private: getFlashHTML generates the object tag needed to embed the flash in to the document
SWFUpload.prototype.getFlashHTML = function () {
	// Flash Satay object syntax: http://www.alistapart.com/articles/flashsatay
	return ['<object id="', this.movieName, '" type="application/x-shockwave-flash" data="', this.settings.flash_url, '" width="', this.settings.button_width, '" height="', this.settings.button_height, '" class="swfupload">',
				'<param name="wmode" value="', this.settings.button_window_mode , '" />',
				'<param name="movie" value="', this.settings.flash_url, '" />',
				'<param name="quality" value="high" />',
				'<param name="menu" value="false" />',
				'<param name="allowScriptAccess" value="always" />',
				'<param name="flashvars" value="' + this.getFlashVars() + '" />',
				'</object>'].join("");
};

// Private: getFlashVars builds the parameter string that will be passed
// to flash in the flashvars param.
SWFUpload.prototype.getFlashVars = function () {
	// Build a string from the post param object
	var paramString = this.buildParamString();
	var httpSuccessString = this.settings.http_success.join(",");
	
	// Build the parameter string
	return ["movieName=", encodeURIComponent(this.movieName),
			"&amp;uploadURL=", encodeURIComponent(this.settings.upload_url),
			"&amp;useQueryString=", encodeURIComponent(this.settings.use_query_string),
			"&amp;requeueOnError=", encodeURIComponent(this.settings.requeue_on_error),
			"&amp;httpSuccess=", encodeURIComponent(httpSuccessString),
			"&amp;params=", encodeURIComponent(paramString),
			"&amp;filePostName=", encodeURIComponent(this.settings.file_post_name),
			"&amp;fileTypes=", encodeURIComponent(this.settings.file_types),
			"&amp;fileTypesDescription=", encodeURIComponent(this.settings.file_types_description),
			"&amp;fileSizeLimit=", encodeURIComponent(this.settings.file_size_limit),
			"&amp;fileUploadLimit=", encodeURIComponent(this.settings.file_upload_limit),
			"&amp;fileQueueLimit=", encodeURIComponent(this.settings.file_queue_limit),
			"&amp;debugEnabled=", encodeURIComponent(this.settings.debug_enabled),
			"&amp;buttonImageURL=", encodeURIComponent(this.settings.button_image_url),
			"&amp;buttonWidth=", encodeURIComponent(this.settings.button_width),
			"&amp;buttonHeight=", encodeURIComponent(this.settings.button_height),
			"&amp;buttonText=", encodeURIComponent(this.settings.button_text),
			"&amp;buttonTextTopPadding=", encodeURIComponent(this.settings.button_text_top_padding),
			"&amp;buttonTextLeftPadding=", encodeURIComponent(this.settings.button_text_left_padding),
			"&amp;buttonTextStyle=", encodeURIComponent(this.settings.button_text_style),
			"&amp;buttonAction=", encodeURIComponent(this.settings.button_action),
			"&amp;buttonDisabled=", encodeURIComponent(this.settings.button_disabled),
			"&amp;buttonCursor=", encodeURIComponent(this.settings.button_cursor)
		].join("");
};

// Public: getMovieElement retrieves the DOM reference to the Flash element added by SWFUpload
// The element is cached after the first lookup
SWFUpload.prototype.getMovieElement = function () {
	if (this.movieElement == undefined) {
		this.movieElement = document.getElementById(this.movieName);
	}

	if (this.movieElement === null) {
		throw "Could not find Flash element";
	}
	
	return this.movieElement;
};

// Private: buildParamString takes the name/value pairs in the post_params setting object
// and joins them up in to a string formatted "name=value&amp;name=value"
SWFUpload.prototype.buildParamString = function () {
	var postParams = this.settings.post_params; 
	var paramStringPairs = [];

	if (typeof(postParams) === "object") {
		for (var name in postParams) {
			if (postParams.hasOwnProperty(name)) {
				paramStringPairs.push(encodeURIComponent(name.toString()) + "=" + encodeURIComponent(postParams[name].toString()));
			}
		}
	}

	return paramStringPairs.join("&amp;");
};

// Public: Used to remove a SWFUpload instance from the page. This method strives to remove
// all references to the SWF, and other objects so memory is properly freed.
// Returns true if everything was destroyed. Returns a false if a failure occurs leaving SWFUpload in an inconsistant state.
// Credits: Major improvements provided by steffen
SWFUpload.prototype.destroy = function () {
	try {
		// Make sure Flash is done before we try to remove it
		this.cancelUpload(null, false);
		
		// Remove the SWFUpload DOM nodes
		var movieElement = null;
		movieElement = this.getMovieElement();
		
		if (movieElement) {
			// Loop through all the movie's properties and remove all function references (DOM/JS IE 6/7 memory leak workaround)
			for (var i in movieElement) {
				try {
					if (typeof(movieElement[i]) === "function") {
						movieElement[i] = null;
					}
				} catch (ex1) {}
			}

			// Remove the Movie Element from the page
			try {
				movieElement.parentNode.removeChild(movieElement);
			} catch (ex) {}
		}
		
		
		// Remove IE form fix reference
		window[this.movieName] = null;

		// Destroy other references
		SWFUpload.instances[this.movieName] = null;
		delete SWFUpload.instances[this.movieName];

		this.movieElement = null;
		this.settings = null;
		this.customSettings = null;
		this.eventQueue = null;
		this.movieName = null;
		
		
		return true;
	} catch (ex1) {
		return false;
	}
};

// Public: displayDebugInfo prints out settings and configuration
// information about this SWFUpload instance.
// This function (and any references to it) can be deleted when placing
// SWFUpload in production.
SWFUpload.prototype.displayDebugInfo = function () {
	this.debug(
		[
			"---SWFUpload Instance Info---\n",
			"Version: ", SWFUpload.version, "\n",
			"Movie Name: ", this.movieName, "\n",
			"Settings:\n",
			"\t", "upload_url:               ", this.settings.upload_url, "\n",
			"\t", "flash_url:                ", this.settings.flash_url, "\n",
			"\t", "use_query_string:         ", this.settings.use_query_string.toString(), "\n",
			"\t", "requeue_on_error:         ", this.settings.requeue_on_error.toString(), "\n",
			"\t", "http_success:             ", this.settings.http_success.join(", "), "\n",
			"\t", "file_post_name:           ", this.settings.file_post_name, "\n",
			"\t", "post_params:              ", this.settings.post_params.toString(), "\n",
			"\t", "file_types:               ", this.settings.file_types, "\n",
			"\t", "file_types_description:   ", this.settings.file_types_description, "\n",
			"\t", "file_size_limit:          ", this.settings.file_size_limit, "\n",
			"\t", "file_upload_limit:        ", this.settings.file_upload_limit, "\n",
			"\t", "file_queue_limit:         ", this.settings.file_queue_limit, "\n",
			"\t", "debug:                    ", this.settings.debug.toString(), "\n",

			"\t", "prevent_swf_caching:      ", this.settings.prevent_swf_caching.toString(), "\n",

			"\t", "button_placeholder_id:    ", this.settings.button_placeholder_id.toString(), "\n",
			"\t", "button_image_url:         ", this.settings.button_image_url.toString(), "\n",
			"\t", "button_width:             ", this.settings.button_width.toString(), "\n",
			"\t", "button_height:            ", this.settings.button_height.toString(), "\n",
			"\t", "button_text:              ", this.settings.button_text.toString(), "\n",
			"\t", "button_text_style:        ", this.settings.button_text_style.toString(), "\n",
			"\t", "button_text_top_padding:  ", this.settings.button_text_top_padding.toString(), "\n",
			"\t", "button_text_left_padding: ", this.settings.button_text_left_padding.toString(), "\n",
			"\t", "button_action:            ", this.settings.button_action.toString(), "\n",
			"\t", "button_disabled:          ", this.settings.button_disabled.toString(), "\n",

			"\t", "custom_settings:          ", this.settings.custom_settings.toString(), "\n",
			"Event Handlers:\n",
			"\t", "swfupload_loaded_handler assigned:  ", (typeof this.settings.swfupload_loaded_handler === "function").toString(), "\n",
			"\t", "file_dialog_start_handler assigned: ", (typeof this.settings.file_dialog_start_handler === "function").toString(), "\n",
			"\t", "file_queued_handler assigned:       ", (typeof this.settings.file_queued_handler === "function").toString(), "\n",
			"\t", "file_queue_error_handler assigned:  ", (typeof this.settings.file_queue_error_handler === "function").toString(), "\n",
			"\t", "upload_start_handler assigned:      ", (typeof this.settings.upload_start_handler === "function").toString(), "\n",
			"\t", "upload_progress_handler assigned:   ", (typeof this.settings.upload_progress_handler === "function").toString(), "\n",
			"\t", "upload_error_handler assigned:      ", (typeof this.settings.upload_error_handler === "function").toString(), "\n",
			"\t", "upload_success_handler assigned:    ", (typeof this.settings.upload_success_handler === "function").toString(), "\n",
			"\t", "upload_complete_handler assigned:   ", (typeof this.settings.upload_complete_handler === "function").toString(), "\n",
			"\t", "debug_handler assigned:             ", (typeof this.settings.debug_handler === "function").toString(), "\n"
		].join("")
	);
};

/* Note: addSetting and getSetting are no longer used by SWFUpload but are included
	the maintain v2 API compatibility
*/
// Public: (Deprecated) addSetting adds a setting value. If the value given is undefined or null then the default_value is used.
SWFUpload.prototype.addSetting = function (name, value, default_value) {
    if (value == undefined) {
        return (this.settings[name] = default_value);
    } else {
        return (this.settings[name] = value);
	}
};

// Public: (Deprecated) getSetting gets a setting. Returns an empty string if the setting was not found.
SWFUpload.prototype.getSetting = function (name) {
    if (this.settings[name] != undefined) {
        return this.settings[name];
	}

    return "";
};



// Private: callFlash handles function calls made to the Flash element.
// Calls are made with a setTimeout for some functions to work around
// bugs in the ExternalInterface library.
SWFUpload.prototype.callFlash = function (functionName, argumentArray) {
	argumentArray = argumentArray || [];
	
	var movieElement = this.getMovieElement();
	var returnValue, returnString;

	// Flash's method if calling ExternalInterface methods (code adapted from MooTools).
	try {
		returnString = movieElement.CallFunction('<invoke name="' + functionName + '" returntype="javascript">' + __flash__argumentsToXML(argumentArray, 0) + '</invoke>');
		returnValue = eval(returnString);
	} catch (ex) {
		throw "Call to " + functionName + " failed";
	}
	
	// Unescape file post param values
	if (returnValue != undefined && typeof returnValue.post === "object") {
		returnValue = this.unescapeFilePostParams(returnValue);
	}

	return returnValue;
};


/* *****************************
	-- Flash control methods --
	Your UI should use these
	to operate SWFUpload
   ***************************** */

// WARNING: this function does not work in Flash Player 10
// Public: selectFile causes a File Selection Dialog window to appear.  This
// dialog only allows 1 file to be selected.
SWFUpload.prototype.selectFile = function () {
	this.callFlash("SelectFile");
};

// WARNING: this function does not work in Flash Player 10
// Public: selectFiles causes a File Selection Dialog window to appear/ This
// dialog allows the user to select any number of files
// Flash Bug Warning: Flash limits the number of selectable files based on the combined length of the file names.
// If the selection name length is too long the dialog will fail in an unpredictable manner.  There is no work-around
// for this bug.
SWFUpload.prototype.selectFiles = function () {
	this.callFlash("SelectFiles");
};


// Public: startUpload starts uploading the first file in the queue unless
// the optional parameter 'fileID' specifies the ID 
SWFUpload.prototype.startUpload = function (fileID) {
	this.callFlash("StartUpload", [fileID]);
};

// Public: cancelUpload cancels any queued file.  The fileID parameter may be the file ID or index.
// If you do not specify a fileID the current uploading file or first file in the queue is cancelled.
// If you do not want the uploadError event to trigger you can specify false for the triggerErrorEvent parameter.
SWFUpload.prototype.cancelUpload = function (fileID, triggerErrorEvent) {
	if (triggerErrorEvent !== false) {
		triggerErrorEvent = true;
	}
	this.callFlash("CancelUpload", [fileID, triggerErrorEvent]);
};

// Public: stopUpload stops the current upload and requeues the file at the beginning of the queue.
// If nothing is currently uploading then nothing happens.
SWFUpload.prototype.stopUpload = function () {
	this.callFlash("StopUpload");
};

/* ************************
 * Settings methods
 *   These methods change the SWFUpload settings.
 *   SWFUpload settings should not be changed directly on the settings object
 *   since many of the settings need to be passed to Flash in order to take
 *   effect.
 * *********************** */

// Public: getStats gets the file statistics object.
SWFUpload.prototype.getStats = function () {
	return this.callFlash("GetStats");
};

// Public: setStats changes the SWFUpload statistics.  You shouldn't need to 
// change the statistics but you can.  Changing the statistics does not
// affect SWFUpload accept for the successful_uploads count which is used
// by the upload_limit setting to determine how many files the user may upload.
SWFUpload.prototype.setStats = function (statsObject) {
	this.callFlash("SetStats", [statsObject]);
};

// Public: getFile retrieves a File object by ID or Index.  If the file is
// not found then 'null' is returned.
SWFUpload.prototype.getFile = function (fileID) {
	if (typeof(fileID) === "number") {
		return this.callFlash("GetFileByIndex", [fileID]);
	} else {
		return this.callFlash("GetFile", [fileID]);
	}
};

// Public: addFileParam sets a name/value pair that will be posted with the
// file specified by the Files ID.  If the name already exists then the
// exiting value will be overwritten.
SWFUpload.prototype.addFileParam = function (fileID, name, value) {
	return this.callFlash("AddFileParam", [fileID, name, value]);
};

// Public: removeFileParam removes a previously set (by addFileParam) name/value
// pair from the specified file.
SWFUpload.prototype.removeFileParam = function (fileID, name) {
	this.callFlash("RemoveFileParam", [fileID, name]);
};

// Public: setUploadUrl changes the upload_url setting.
SWFUpload.prototype.setUploadURL = function (url) {
	this.settings.upload_url = url.toString();
	this.callFlash("SetUploadURL", [url]);
};

// Public: setPostParams changes the post_params setting
SWFUpload.prototype.setPostParams = function (paramsObject) {
	this.settings.post_params = paramsObject;
	this.callFlash("SetPostParams", [paramsObject]);
};

// Public: addPostParam adds post name/value pair.  Each name can have only one value.
SWFUpload.prototype.addPostParam = function (name, value) {
	this.settings.post_params[name] = value;
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: removePostParam deletes post name/value pair.
SWFUpload.prototype.removePostParam = function (name) {
	delete this.settings.post_params[name];
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: setFileTypes changes the file_types setting and the file_types_description setting
SWFUpload.prototype.setFileTypes = function (types, description) {
	this.settings.file_types = types;
	this.settings.file_types_description = description;
	this.callFlash("SetFileTypes", [types, description]);
};

// Public: setFileSizeLimit changes the file_size_limit setting
SWFUpload.prototype.setFileSizeLimit = function (fileSizeLimit) {
	this.settings.file_size_limit = fileSizeLimit;
	this.callFlash("SetFileSizeLimit", [fileSizeLimit]);
};

// Public: setFileUploadLimit changes the file_upload_limit setting
SWFUpload.prototype.setFileUploadLimit = function (fileUploadLimit) {
	this.settings.file_upload_limit = fileUploadLimit;
	this.callFlash("SetFileUploadLimit", [fileUploadLimit]);
};

// Public: setFileQueueLimit changes the file_queue_limit setting
SWFUpload.prototype.setFileQueueLimit = function (fileQueueLimit) {
	this.settings.file_queue_limit = fileQueueLimit;
	this.callFlash("SetFileQueueLimit", [fileQueueLimit]);
};

// Public: setFilePostName changes the file_post_name setting
SWFUpload.prototype.setFilePostName = function (filePostName) {
	this.settings.file_post_name = filePostName;
	this.callFlash("SetFilePostName", [filePostName]);
};

// Public: setUseQueryString changes the use_query_string setting
SWFUpload.prototype.setUseQueryString = function (useQueryString) {
	this.settings.use_query_string = useQueryString;
	this.callFlash("SetUseQueryString", [useQueryString]);
};

// Public: setRequeueOnError changes the requeue_on_error setting
SWFUpload.prototype.setRequeueOnError = function (requeueOnError) {
	this.settings.requeue_on_error = requeueOnError;
	this.callFlash("SetRequeueOnError", [requeueOnError]);
};

// Public: setHTTPSuccess changes the http_success setting
SWFUpload.prototype.setHTTPSuccess = function (http_status_codes) {
	if (typeof http_status_codes === "string") {
		http_status_codes = http_status_codes.replace(" ", "").split(",");
	}
	
	this.settings.http_success = http_status_codes;
	this.callFlash("SetHTTPSuccess", [http_status_codes]);
};


// Public: setDebugEnabled changes the debug_enabled setting
SWFUpload.prototype.setDebugEnabled = function (debugEnabled) {
	this.settings.debug_enabled = debugEnabled;
	this.callFlash("SetDebugEnabled", [debugEnabled]);
};

// Public: setButtonImageURL loads a button image sprite
SWFUpload.prototype.setButtonImageURL = function (buttonImageURL) {
	if (buttonImageURL == undefined) {
		buttonImageURL = "";
	}
	
	this.settings.button_image_url = buttonImageURL;
	this.callFlash("SetButtonImageURL", [buttonImageURL]);
};

// Public: setButtonDimensions resizes the Flash Movie and button
SWFUpload.prototype.setButtonDimensions = function (width, height) {
	this.settings.button_width = width;
	this.settings.button_height = height;
	
	var movie = this.getMovieElement();
	if (movie != undefined) {
		movie.style.width = width + "px";
		movie.style.height = height + "px";
	}
	
	this.callFlash("SetButtonDimensions", [width, height]);
};
// Public: setButtonText Changes the text overlaid on the button
SWFUpload.prototype.setButtonText = function (html) {
	this.settings.button_text = html;
	this.callFlash("SetButtonText", [html]);
};
// Public: setButtonTextPadding changes the top and left padding of the text overlay
SWFUpload.prototype.setButtonTextPadding = function (left, top) {
	this.settings.button_text_top_padding = top;
	this.settings.button_text_left_padding = left;
	this.callFlash("SetButtonTextPadding", [left, top]);
};

// Public: setButtonTextStyle changes the CSS used to style the HTML/Text overlaid on the button
SWFUpload.prototype.setButtonTextStyle = function (css) {
	this.settings.button_text_style = css;
	this.callFlash("SetButtonTextStyle", [css]);
};
// Public: setButtonDisabled disables/enables the button
SWFUpload.prototype.setButtonDisabled = function (isDisabled) {
	this.settings.button_disabled = isDisabled;
	this.callFlash("SetButtonDisabled", [isDisabled]);
};
// Public: setButtonAction sets the action that occurs when the button is clicked
SWFUpload.prototype.setButtonAction = function (buttonAction) {
	this.settings.button_action = buttonAction;
	this.callFlash("SetButtonAction", [buttonAction]);
};

// Public: setButtonCursor changes the mouse cursor displayed when hovering over the button
SWFUpload.prototype.setButtonCursor = function (cursor) {
	this.settings.button_cursor = cursor;
	this.callFlash("SetButtonCursor", [cursor]);
};

/* *******************************
	Flash Event Interfaces
	These functions are used by Flash to trigger the various
	events.
	
	All these functions a Private.
	
	Because the ExternalInterface library is buggy the event calls
	are added to a queue and the queue then executed by a setTimeout.
	This ensures that events are executed in a determinate order and that
	the ExternalInterface bugs are avoided.
******************************* */

SWFUpload.prototype.queueEvent = function (handlerName, argumentArray) {
	// Warning: Don't call this.debug inside here or you'll create an infinite loop
	
	if (argumentArray == undefined) {
		argumentArray = [];
	} else if (!(argumentArray instanceof Array)) {
		argumentArray = [argumentArray];
	}
	
	var self = this;
	if (typeof this.settings[handlerName] === "function") {
		// Queue the event
		this.eventQueue.push(function () {
			this.settings[handlerName].apply(this, argumentArray);
		});
		
		// Execute the next queued event
		setTimeout(function () {
			self.executeNextEvent();
		}, 0);
		
	} else if (this.settings[handlerName] !== null) {
		throw "Event handler " + handlerName + " is unknown or is not a function";
	}
};

// Private: Causes the next event in the queue to be executed.  Since events are queued using a setTimeout
// we must queue them in order to garentee that they are executed in order.
SWFUpload.prototype.executeNextEvent = function () {
	// Warning: Don't call this.debug inside here or you'll create an infinite loop

	var  f = this.eventQueue ? this.eventQueue.shift() : null;
	if (typeof(f) === "function") {
		f.apply(this);
	}
};

// Private: unescapeFileParams is part of a workaround for a flash bug where objects passed through ExternalInterface cannot have
// properties that contain characters that are not valid for JavaScript identifiers. To work around this
// the Flash Component escapes the parameter names and we must unescape again before passing them along.
SWFUpload.prototype.unescapeFilePostParams = function (file) {
	var reg = /[$]([0-9a-f]{4})/i;
	var unescapedPost = {};
	var uk;

	if (file != undefined) {
		for (var k in file.post) {
			if (file.post.hasOwnProperty(k)) {
				uk = k;
				var match;
				while ((match = reg.exec(uk)) !== null) {
					uk = uk.replace(match[0], String.fromCharCode(parseInt("0x" + match[1], 16)));
				}
				unescapedPost[uk] = file.post[k];
			}
		}

		file.post = unescapedPost;
	}

	return file;
};

SWFUpload.prototype.flashReady = function () {
	// Check that the movie element is loaded correctly with its ExternalInterface methods defined
	var movieElement = this.getMovieElement();

	// Pro-actively unhook all the Flash functions
	if (typeof(movieElement.CallFunction) === "unknown") { // We only want to do this in IE
		this.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");
		for (var key in movieElement) {
			try {
				if (typeof(movieElement[key]) === "function") {
					movieElement[key] = null;
				}
			} catch (ex) {
			}
		}
	}
	
	this.queueEvent("swfupload_loaded_handler");
};


/* This is a chance to do something before the browse window opens */
SWFUpload.prototype.fileDialogStart = function () {
	this.queueEvent("file_dialog_start_handler");
};


/* Called when a file is successfully added to the queue. */
SWFUpload.prototype.fileQueued = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queued_handler", file);
};


/* Handle errors that occur when an attempt to queue a file fails. */
SWFUpload.prototype.fileQueueError = function (file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queue_error_handler", [file, errorCode, message]);
};

/* Called after the file dialog has closed and the selected files have been queued.
	You could call startUpload here if you want the queued files to begin uploading immediately. */
SWFUpload.prototype.fileDialogComplete = function (numFilesSelected, numFilesQueued) {
	this.queueEvent("file_dialog_complete_handler", [numFilesSelected, numFilesQueued]);
};

SWFUpload.prototype.uploadStart = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("return_upload_start_handler", file);
};

SWFUpload.prototype.returnUploadStart = function (file) {
	var returnValue;
	if (typeof this.settings.upload_start_handler === "function") {
		file = this.unescapeFilePostParams(file);
		returnValue = this.settings.upload_start_handler.call(this, file);
	} else if (this.settings.upload_start_handler != undefined) {
		throw "upload_start_handler must be a function";
	}

	// Convert undefined to true so if nothing is returned from the upload_start_handler it is
	// interpretted as 'true'.
	if (returnValue === undefined) {
		returnValue = true;
	}
	
	returnValue = !!returnValue;
	
	this.callFlash("ReturnUploadStart", [returnValue]);
};



SWFUpload.prototype.uploadProgress = function (file, bytesComplete, bytesTotal) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_progress_handler", [file, bytesComplete, bytesTotal]);
};

SWFUpload.prototype.uploadError = function (file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_error_handler", [file, errorCode, message]);
};

SWFUpload.prototype.uploadSuccess = function (file, serverData) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_success_handler", [file, serverData]);
};

SWFUpload.prototype.uploadComplete = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_complete_handler", file);
};

/* Called by SWFUpload JavaScript and Flash functions when debug is enabled. By default it writes messages to the
   internal debug console.  You can override this event and have messages written where you want. */
SWFUpload.prototype.debug = function (message) {
	this.queueEvent("debug_handler", message);
};


/* **********************************
	Debug Console
	The debug console is a self contained, in page location
	for debug message to be sent.  The Debug Console adds
	itself to the body if necessary.

	The console is automatically scrolled as messages appear.
	
	If you are using your own debug handler or when you deploy to production and
	have debug disabled you can remove these functions to reduce the file size
	and complexity.
********************************** */
   
// Private: debugMessage is the default debug_handler.  If you want to print debug messages
// call the debug() function.  When overriding the function your own function should
// check to see if the debug setting is true before outputting debug information.
SWFUpload.prototype.debugMessage = function (message) {
	if (this.settings.debug) {
		var exceptionMessage, exceptionValues = [];

		// Check for an exception object and print it nicely
		if (typeof message === "object" && typeof message.name === "string" && typeof message.message === "string") {
			for (var key in message) {
				if (message.hasOwnProperty(key)) {
					exceptionValues.push(key + ": " + message[key]);
				}
			}
			exceptionMessage = exceptionValues.join("\n") || "";
			exceptionValues = exceptionMessage.split("\n");
			exceptionMessage = "EXCEPTION: " + exceptionValues.join("\nEXCEPTION: ");
			SWFUpload.Console.writeLine(exceptionMessage);
		} else {
			SWFUpload.Console.writeLine(message);
		}
	}
};

SWFUpload.Console = {};
SWFUpload.Console.writeLine = function (message) {
	var console, documentForm;

	try {
		console = document.getElementById("SWFUpload_Console");

		if (!console) {
			documentForm = document.createElement("form");
			document.getElementsByTagName("body")[0].appendChild(documentForm);

			console = document.createElement("textarea");
			console.id = "SWFUpload_Console";
			console.style.fontFamily = "monospace";
			console.setAttribute("wrap", "off");
			console.wrap = "off";
			console.style.overflow = "auto";
			console.style.width = "700px";
			console.style.height = "350px";
			console.style.margin = "5px";
			documentForm.appendChild(console);
		}

		console.value += message + "\n";

		console.scrollTop = console.scrollHeight - console.clientHeight;
	} catch (ex) {
		alert("Exception: " + ex.name + " Message: " + ex.message);
	}
};


window.hzmr.push("swfupload:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End swfupload.js  **************/
/************* Start swfupload.errors.js **************/
try {//<script>

if (SWFUpload == undefined) {
	var SWFUpload = {};
}

SWFUpload.QUEUE_ERROR = {
	QUEUE_LIMIT_EXCEEDED	  		: -100,
	FILE_EXCEEDS_SIZE_LIMIT  		: -110,
	ZERO_BYTE_FILE			  		: -120,
	INVALID_FILETYPE		  		: -130
};
SWFUpload.UPLOAD_ERROR = {
	HTTP_ERROR				  		: -200,
	MISSING_UPLOAD_URL	      		: -210,
	IO_ERROR				  		: -220,
	SECURITY_ERROR			  		: -230,
	UPLOAD_LIMIT_EXCEEDED	  		: -240,
	UPLOAD_FAILED			  		: -250,
	SPECIFIED_FILE_ID_NOT_FOUND		: -260,
	FILE_VALIDATION_FAILED	  		: -270,
	FILE_CANCELLED			  		: -280,
	UPLOAD_STOPPED					: -290
};

SWFUpload.ERROR_MESSAGES = {};
SWFUpload.ERROR_MESSAGES[SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED] = "You have attempted to queue too many files.";
SWFUpload.ERROR_MESSAGES[SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT] = "File is too big.";
SWFUpload.ERROR_MESSAGES[SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE] = "Cannot upload Zero Byte files.";
SWFUpload.ERROR_MESSAGES[SWFUpload.QUEUE_ERROR.INVALID_FILETYPE] = "Invalid File Type.";

SWFUpload.ERROR_MESSAGES[SWFUpload.UPLOAD_ERROR.HTTP_ERROR] = "Server cannot accept this upload.";
SWFUpload.ERROR_MESSAGES[SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL] = "Upload URL is missing.";
SWFUpload.ERROR_MESSAGES[SWFUpload.UPLOAD_ERROR.IO_ERROR] = "Server (IO) Error.";
SWFUpload.ERROR_MESSAGES[SWFUpload.UPLOAD_ERROR.SECURITY_ERROR] = "Security Error.";
SWFUpload.ERROR_MESSAGES[SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED] = "Upload limit exceeded.";
SWFUpload.ERROR_MESSAGES[SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED] = "Upload failed.";
SWFUpload.ERROR_MESSAGES[SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND] = "Specified File ID not founded.";
SWFUpload.ERROR_MESSAGES[SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED] = "Failed Validation. Upload skipped.";
SWFUpload.ERROR_MESSAGES[SWFUpload.UPLOAD_ERROR.FILE_CANCELLED] = "Upload cancelled by user.";
SWFUpload.ERROR_MESSAGES[SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED] = "Upload stopped unexpectedly.";

window.hzmr.push("swfupload.errors:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End swfupload.errors.js  **************/
/************* Start swfupload.queue.js **************/
try {/*
	Queue Plug-in
	
	Features:
		*Adds a cancelQueue() method for cancelling the entire queue.
		*All queued files are uploaded when startUpload() is called.
		*If false is returned from uploadComplete then the queue upload is stopped.
		 If false is not returned (strict comparison) then the queue upload is continued.
		*Adds a QueueComplete event that is fired when all the queued files have finished uploading.
		 Set the event handler with the queue_complete_handler setting.
		
	*/

var SWFUpload;
if (typeof(SWFUpload) === "function") {
	SWFUpload.queue = {};
	
	SWFUpload.prototype.initSettings = (function (oldInitSettings) {
		return function () {
			if (typeof(oldInitSettings) === "function") {
				oldInitSettings.call(this);
			}
			
			this.customSettings.queue_cancelled_flag = false;
			this.customSettings.queue_upload_count = 0;
			
			this.settings.user_upload_complete_handler = this.settings.upload_complete_handler;
			this.settings.user_upload_start_handler = this.settings.upload_start_handler;
			this.settings.upload_complete_handler = SWFUpload.queue.uploadCompleteHandler;
			this.settings.upload_start_handler = SWFUpload.queue.uploadStartHandler;
			
			this.settings.queue_complete_handler = this.settings.queue_complete_handler || null;
		};
	})(SWFUpload.prototype.initSettings);

	SWFUpload.prototype.startUpload = function (fileID) {
		this.customSettings.queue_cancelled_flag = false;
		this.callFlash("StartUpload", [fileID]);
	};

	SWFUpload.prototype.cancelQueue = function () {
		this.customSettings.queue_cancelled_flag = true;
		this.stopUpload();
		
		var stats = this.getStats();
		while (stats.files_queued > 0) {
			this.cancelUpload();
			stats = this.getStats();
		}
	};
	
	SWFUpload.queue.uploadStartHandler = function (file) {
		var returnValue;
		if (typeof(this.customSettings.user_upload_start_handler) === "function") {
			returnValue = this.customSettings.user_upload_start_handler.call(this, file);
		}
		
		// To prevent upload a real "FALSE" value must be returned, otherwise default to a real "TRUE" value.
		returnValue = (returnValue === false) ? false : true;
		
		this.customSettings.queue_cancelled_flag = !returnValue;

		return returnValue;
	};
	
	SWFUpload.queue.uploadCompleteHandler = function (file) {
		var user_upload_complete_handler = this.settings.user_upload_complete_handler;
		var continueUpload;
		
		if (file.filestatus === SWFUpload.FILE_STATUS.COMPLETE) {
			this.customSettings.queue_upload_count++;
		}

		if (typeof(user_upload_complete_handler) === "function") {
			continueUpload = (user_upload_complete_handler.call(this, file) === false) ? false : true;
		} else {
			continueUpload = true;
		}
		
		if (continueUpload) {
			var stats = this.getStats();
			if (stats.files_queued > 0 && this.customSettings.queue_cancelled_flag === false) {
				this.startUpload();
			} else if (this.customSettings.queue_cancelled_flag === false) {
				this.queueEvent("queue_complete_handler", [this.customSettings.queue_upload_count]);
				this.customSettings.queue_upload_count = 0;
			} else {
				this.customSettings.queue_cancelled_flag = false;
				this.customSettings.queue_upload_count = 0;
			}
		}
	};
}

window.hzmr.push("swfupload.queue:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End swfupload.queue.js  **************/
/************* Start fileprogress.js **************/
try {// <script>
/*
	A simple class for displaying file information and progress
	Note: This is a demonstration only and not part of SWFUpload.
	Note: Some have had problems adapting this class in IE7. It may not be suitable for your application.
*/

// Constructor
// file is a SWFUpload file object
// targetID is the HTML element id attribute that the FileProgress HTML structure will be added to.
// Instantiating a new FileProgress object with an existing file will reuse/update the existing DOM elements
function FileProgress(file, targetID) {
	var fileProgressTemplate = 
	'<div class="progressContainer">' +
		'<div class="polaroid">' +
			'<div class="progressWrapper">' +
				'<div class="progress"></div>' +
			'</div>' +
		'</div>' +
		'<div class="fileStatus">' +
			'<div class="fileName"></div>' +
			'<div class="status"></div>' +
		'</div>' +
	'</div>鈥�';

	
	var targetElement = null;
	this.fileProgressID = file.id;

	this.fileProgressWrapper = $('#'+this.fileProgressID);
	if (this.fileProgressWrapper.length == 0) {
		this.fileProgressWrapper = $(fileProgressTemplate).attr('id', this.fileProgressID);

		this.fileProgressElement = this.fileProgressWrapper.find('.progress');
		this.fileProgressWrapper.find('.fileName').text(file.name);

		targetElement = $('#'+targetID);
		targetElement.show();
		targetElement.append(this.fileProgressWrapper);
	} else {
		this.fileProgressElement = this.fileProgressWrapper.find('.progress');
	}
}
FileProgress.prototype.setProgress = function (percentage) {
	this.fileProgressElement.css('height', percentage + '%');
};
FileProgress.prototype.setComplete = function () {
	this.fileProgressWrapper.attr('class','progressContainer completed');
	var oSelf = this;
	setTimeout(function () {
		oSelf.disappear();
	}, 10000);
};
FileProgress.prototype.setError = function () {
	this.fileProgressWrapper.attr('class','progressContainer error');

//	var oSelf = this;
//	setTimeout(function () {
//		oSelf.disappear();
//	}, 5000);
};
FileProgress.prototype.setCancelled = function () {
	this.fileProgressWrapper.attr('class','progressContainer cancelled');

//	var oSelf = this;
//	setTimeout(function () {
//		oSelf.disappear();
//	}, 2000);
};
FileProgress.prototype.setStatus = function (status) {
	this.fileProgressWrapper.find('.status').text(status);
};

// Show/Hide the cancel button
FileProgress.prototype.toggleCancel = function (show, swfUploadInstance) {
	return;
};

// Fades out and clips away the FileProgress box.
FileProgress.prototype.disappear = function () {

	this.fileProgressWrapper.animate({'height':0,'opacity':0});
};

window.hzmr.push("fileprogress:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End fileprogress.js  **************/
/************* Start categoryChooser.js **************/
try {
//		<script>
HZ.ui.CategoryChooser = new (function() {
	var categoryNameInput = null,		// the input text
		categoryIdInput = null,			// the hidden input with the category id
		categoriesDiv = null,			// popup div
		isShowingCategoryDiv = false,	// indicator that the popup is showing
		currentCategoryId = null,		// default category
		currentRootCategory = null,
		rootCategoryIds = [],			// ordered list of permitted root category ids
		rootCategoryLookup = "",		// helper string to quickly determine if a root category is allowed
		hideCategoriesTimeout = null,	//
		hasContent = false,				// helper boolean, determines whether or not to include a separator between different sections of the chooser.
		showRootCategories = true,		// indicates whether or not to show the root categories at the bottom of the categories div
		jQueryPluginMode = false		
		
	this.handleInputFocused = function(event) {
		var target = event.target;
		if (isShowingCategoryDiv) {
			if (target == categoryNameInput[0])
			{
				addLog ("Already focused, continuing...");
				return;	// in case of repeated focus to the same element
			}
			else 
				disconnectJQueryHandlers(); // in case of focus on a different element
		}
		
		jQueryPluginMode = true;
		categoryNameInput = $(target);
		addLog (categoryNameInput + " - " + categoryNameInput.attr("categoryId"));
		var properties = {	// take properties from INPUT attributes.
			currentCategoryId: categoryNameInput.attr("categoryId"),
			rootCategoryIds: (categoryNameInput.attr("rootCategoryIds") || "").split (","),
			showRootCategories: categoryNameInput.attr("showRootCategories")
		}

		this.init (properties);
		
		// Associate with corresponding input field for the actual category id.
		var inputId = categoryNameInput.attr("categoryIdInputId");
		categoryIdInput = $("#"+inputId);
		
		connectJQueryHandlers();
		
		lookupCategory();
		updateCategoryInputField();
		showCategories();			
		positionCategoriesDiv();
//		categoriesDiv.show();
	}
	
	function connectJQueryHandlers() {
		addLog ("connecting to "+categoryNameInput[0].id);
		categoryNameInput
			.attr("autocomplete", "off")
			.bind("keyup.categoryChooser", $.proxy(handleKeyUp, this))
			.bind("keydown.categoryChooser", $.proxy(handleKeyDown, this))
			.bind("blur.categoryChooser", $.proxy(handleInputBlur, this))
			.bind("paste.categoryChooser", $.proxy(handlePaste, this));
		$(window).bind("resize.categoryChooser", $.proxy(positionCategoriesDiv, this));
	}
	
	function disconnectJQueryHandlers() {	
		addLog ("disconnecting from "+categoryNameInput[0].id);
		if (categoryNameInput) {
			categoryNameInput
				.unbind("keyup.categoryChooser")
				.unbind("keydown.categoryChooser")
				.unbind("blur.categoryChooser");
		}
		$(window).unbind("resize.categoryChooser");	
	}
	/*
	 * Initialize the selector.
	 * properties include @param categoryId - the default selected category
	 * @param categoryIds - a sorted list of available root category ids
	 * 
	 * if the CategorySelector is not properly initialized, it will take the category id passed in the CategoryInput field,
	 * and use it for currentCategoryId and derive the only available rootCategoryIds.
	 */
	this.init = function(properties) {
		currentCategoryId = properties.currentCategoryId;
		currentRootCategory = HZ.data.Categories.getRootCategoryById(currentCategoryId);

		rootCategoryIds = properties.rootCategoryIds;
		rootCategoryLookup = rootCategoryIds.join();
		showRootCategories = properties.showRootCategories == null 
			|| properties.showRootCategories.toLowerCase() === 'true';
		
		if (categoriesDiv == null) {
			addLog ("Creating categoriesDiv for the first time")
			categoriesDiv = $("<div/>")
				.attr("id","categorySelectorDropdown")
				.addClass("categorySelector")
				.click($.proxy(handleCategoryClicked, this))
				.bind('contextmenu rightclick', function(e) { 
					e.preventDefault(); 
					showCategories();
					grabCategoriesFocus();					
					return false;
				});
			$("body").append(categoriesDiv);
		}
	}

	/*
	 * Connect the CategorySelector to the two input fields and create the floating popup div.
	 */
//	this.connect = function (textInputFieldId, categoryInputFieldId) {
//		categoryNameInput = $("#" + textInputFieldId)
//			.focus($.proxy(handleInputFocus, this))
//			.blur($.proxy(handleInputBlur, this))
//			.keyup($.proxy(lookupCategory, this))
//			;
//		
//		categoryIdInput = $("#" + categoryInputFieldId);
//		
//		updateCategoryInputField();
//	};
	
	/* Change root category from an external screen event; also opens the categories div  */
	this.changeRootCategory = function(textInputFieldId, categoryId) {
		addLog ("changeRootCategory");
		var inputField = $("#"+textInputFieldId),
			categoryName;
		
		if (currentRootCategory && currentRootCategory.categoryId == categoryId)
			categoryId = currentCategoryId;
		categoryName = HZ.data.Categories.getCategoryById(categoryId).name;
		hideCategories();
		inputField.attr("categoryId", categoryId)
			.val(categoryName)
			.focus();
	}
	
	/* Event handlers */
//	function handleInputFocus(event) {
//		lookupCategory();
//		updateCategoryInputField();
//		showCategories();
//	}
	
	function handleInputBlur(event) {
		// hide categories div when input blurs
		if (hideCategoriesTimeout)
			clearTimeout(hideCategoriesTimeout);
		hideCategoriesTimeout = setTimeout (hideCategories, 200);
		updateCategoryInputField();		
	}

	function handleKeyDown(event) {
		if (event.keyCode == 9) {
			handleKeyUp(event);
		}
		return true;
	}
	function handleKeyUp(event) {
		switch (event.keyCode) {
			case 27:
				categoriesDiv.hide();
				isShowingCategoryDiv = false;
				break;
			case 9:
			case 13:
				var categoryLinks = categoriesDiv.find(".categorySelectorSearchResults a");
				if (categoryLinks.length == 1)
				{
					currentCategoryId = $(categoryLinks[0]).attr("catId");
					if (currentCategoryId) {
						currentRootCategory = HZ.data.Categories.getRootCategoryById(currentCategoryId);				
						updateCategoryInputField();
						lookupCategory();
					}					
				}
				break;

			default:
				if (!isShowingCategoryDiv) {
					showCategories();
				}
				lookupCategory();
				break;
		}
		return false;
	}
	
	function handlePaste(event) {
		setTimeout (grabPastedText, 0);
	}
	
	function grabPastedText() {
		var value = UIHelper.trim(categoryNameInput.val()).toLowerCase(),
			category = HZ.data.Categories.categoriesNamesHash[value];
			
		if (category) {
			currentCategoryId = category.categoryId;
			currentRootCategory = HZ.data.Categories.getRootCategoryById(currentCategoryId);
			updateCategoryInputField();
			lookupCategory();
		}
	}

	/* Update the input fields upon changes to the selected categories */
	function updateCategoryInputField () {
		addLog ("updateCategoryInputField");
		
		var category = HZ.data.Categories.getCategoryById(currentCategoryId);
		var newCategoryName = getCategoryName(category);
		addLog ("old:"+categoryNameInput.val() + " new:"+newCategoryName);
		addLog ("old:"+categoryIdInput.val() + " new:"+currentCategoryId);
		var isChanged = (categoryNameInput.val() != newCategoryName) || (categoryIdInput.val() != currentCategoryId);
		addLog ("isChanged:"+isChanged);
		categoryIdInput.val(category.categoryId);
		if (jQueryPluginMode) {
			categoryNameInput.attr("categoryId", category.categoryId);
		}
		//fire change event
		if (isChanged) {
			categoryNameInput.val(newCategoryName);
			categoryNameInput.trigger('change.categoryChooser');
		}
	}
	
	function positionCategoriesDiv() {
		var offset = categoryNameInput.offset(),
			screenBounds = UIHelper.getScreenBounds(),
			inputWidth = categoryNameInput.outerWidth(),
			divWidth = categoriesDiv.outerWidth();

		offset.top += 24;
		if (divWidth > inputWidth && offset.left + divWidth > screenBounds.w)
			offset.left = offset.left - divWidth + inputWidth;
		addLog("Positioning categories div: " + offset.left + ":" + offset.top);
		categoriesDiv.offset(offset);
	}
	/*
	 * Returns a CSS class; first time - returns nothing, in subsequent calls - return a class with top margin.
	 */
	function getContentSeparatorClass() {
		if (hasContent)
			return "categorySelectorMargin";
		else {
			hasContent = true;
			return "";
		}
	}
	
	function lookupCategory() {
		addLog("lookupCategory");
		var value = UIHelper.trim(categoryNameInput.val()).toLowerCase();
		var currentCategory = HZ.data.Categories.getCategoryById(currentCategoryId);
		if (value == "") {
			currentCategory = currentRootCategory;
			value = "";
			populateCategoriesDiv(currentCategory);
		} else if (value == currentCategory.name) {
			populateCategoriesDiv(currentCategory);
		} else {
			if (value.length > 2) {
				var suggestedCategories = [];
				for (var key in HZ.data.Categories.categoriesNamesHash) {
					if (key.indexOf (value) >= 0) {
						var foundCategory = HZ.data.Categories.categoriesNamesHash[key];
						var foundRootCategory = HZ.data.Categories.getRootCategoryById(foundCategory.categoryId);
						if (foundRootCategory.categoryId == currentRootCategory.categoryId)
							suggestedCategories.push (foundCategory);
					}
				}
				populateCategoriesDiv(null,suggestedCategories);
			} else {
				populateCategoriesDiv(null,null);
			}
		}
	}
	
	function populateCategoriesDiv(category, searchResults) {
		addLog("populateCategoriesDiv " + category + " " + searchResults);
		var html = "";
		hasContent = false;
		if (category) {
			html += getCategoriesOptions();
		} else {
			if (searchResults && searchResults.length) {
				var title = "Suggested "+currentRootCategory.name + " categories:";
				
				html += "<div class='categorySelectorSearchResults'><div class='categorySelectorSearchResultsCaption " + getContentSeparatorClass() + "'>" + title + "</div>";
				html += getCategoriesHTML (searchResults);
				html += "</div>"
			} else {
				html += "<div class='categorySelectorSearchResultsCaption " + getContentSeparatorClass() + "'>No such category</div>";
			}
		}
		html += getRootCategoriesHTML();
		if ((category && currentCategoryId == category.categoryId && category.children && category.children.length) || (searchResults && searchResults.length)) {
			html += "<a class='categorySelectorClose' href='javascript:;' name='close'>[X]</a>";
		}
		categoriesDiv.empty()
			.html(html);	
		positionCategoriesDiv();
	}


	function hideCategories() {
		addLog ("hideCategories");
		if (hideCategoriesTimeout)
			clearTimeout(hideCategoriesTimeout);
		hideCategoriesTimeout = null;
		if (categoriesDiv) {
			categoryNameInput.removeClass('choosingCaty');
			categoriesDiv[0].style.left = "-1000px";
			// categoriesDiv.hide();
			updateCategoryInputField();
		}
		isShowingCategoryDiv = false;
		if (jQueryPluginMode) {
			disconnectJQueryHandlers();
		}
	}
	
	function grabCategoriesFocus() {
		addLog ("grabCategoriesFocus");
		if (hideCategoriesTimeout) {
			clearTimeout (hideCategoriesTimeout);
			hideCategoriesTimeout = null;
		}
		try {
			categoryNameInput.focus();
			// document.getElementById("uploadCategoriesOptionsFocus").focus();
		} catch (err) {};
	}	
	
	function showCategories() {
		addLog("showCategories");
		if (hideCategoriesTimeout) {
			clearTimeout (hideCategoriesTimeout);
			hideCategoriesTimeout = null;
		}
		if (categoriesDiv.html().length > 1) {
			isShowingCategoryDiv = true;
			categoriesDiv.show();
			categoryNameInput.addClass('choosingCaty');
		}
	}	
	
	function handleCategoryClicked(event) {
		addLog("handleCategoryClicked");
		var target = event.target;
		grabCategoriesFocus();
		if (target && target.tagName == "B") {
			target = target.parentNode;
		}
		if (target && target.tagName == "A") {
			event.preventDefault();
			if ($(target).attr("name") == "close") {
				handleXButton();
			} else {			
				currentCategoryId = $(target).attr("catId");
				if (currentCategoryId) {
					currentRootCategory = HZ.data.Categories.getRootCategoryById(currentCategoryId);				
					updateCategoryInputField();
					lookupCategory();
				}
			}
		}
		if (isShowingCategoryDiv) {
			showCategories();
		} else {
			hideCategories();
		}
	}

	function handleXButton() {
		hideCategories();
		// document.upload.uploadCategoriesOptionsFocus.blur();
	}
	
	function getCategoriesOptions() {
		var html = "";
		if (currentCategoryId > 0) {
			if (currentCategoryId > 10) {
				var cat = HZ.data.Categories.getCategoryById (currentCategoryId),
					sep = "",
					breadcrumbs = "";
				while (cat != null) {
					var catHTML = "<b>" + getCategoryName (cat) + "</b>"; 
					if (cat.categoryId != currentCategoryId)
						catHTML = getCategoryHTML (cat, false);
					breadcrumbs = catHTML + sep + breadcrumbs;
					cat = cat.parent;
					sep = " &gt; ";
				}
				html = "<div class='categorySelectorBreadcrumbs " + getContentSeparatorClass() + "'>" + breadcrumbs + "</div>";
				hasContent = true;
			}
			cat = HZ.data.Categories.getCategoryById (currentCategoryId);
			if (cat.children.length > 0) {
				var title = cat.categoryId < 10?(UIHelper.ucwords(currentRootCategory.name) + " categories"):"Available subcategories";
				html += "<div class='categorySelectorCaption " + getContentSeparatorClass() + "'>"+title+":</div>";
				html += getCategoriesHTML(cat.children);
			}
		}
		return html;
	}
	
	/* 
	 * Returns a list of alternative category groups, based on the available 
	 */
	function getRootCategoriesHTML() {
		var sep = "",
			categoryId, category, categoryName,
			html = ""
		
		if (showRootCategories && currentCategoryId < 10 && rootCategoryIds.length > 1) {
			html = "<div class='categorySelectorOtherGroups " + getContentSeparatorClass() + "'><span class='categorySelectorCaption'>Switch to another category group: </span>";
			for (var i=0; i<=rootCategoryIds.length; i++) {
				categoryId = rootCategoryIds[i];

				if (currentRootCategory.categoryId != categoryId) {
					category = HZ.data.Categories.getCategoryById(categoryId);
					if (category) {
						html += sep + "<b>" + getCategoryHTML(category, false) + "</b>";
						sep = ", ";
					}
				}
			}
			html += "</div>";
		}
		return html;
	}

	/* 
	 * Convert a list of categories to HTML table, including hints to subcategories
	 */
	function getCategoriesHTML(categories) {
		var html = "<table cellpadding=0 cellspacing=0 border=0 class='categoriesTable'><tr valign=top><td>",
			itemsPerColumn = Math.ceil(categories.length/3),
			i;
			
		for (i=0; i<categories.length; i++) {
			html += getCategoryHTML (categories[i], true) + "<br>";
			if (i%itemsPerColumn == itemsPerColumn-1 && i<categories.length-1)
				html += "</td><td>";
		}
		html += "</td></tr></table>";
		return html;
	} 
	
	function getCategoryHTML(category, indicateChildren) {
		var arrow = (indicateChildren && category.children.length > 0)?" &gt;":"";
		return "<a href='javascript:;' catId='"+category.categoryId+"' class='colorLink' tabindex=-1>" + getCategoryName(category) + arrow + "</a>";
	}
	/* 
	 * Utility functions
	 */
	function getCategoryName(category) {
		var name = UIHelper.ucwords(category.name);
		return name.replace (/And/g, "and");
	}
	
	function addLog(str) {
//		console.log(str);
	}	
}) ();

(function($) {
	$.fn.attachCategoryChooser = function(){
		if (!this || this.length == 0)
			return;
		// connect the categoy chooser to on focus event
		this.focus($.proxy(HZ.ui.CategoryChooser.handleInputFocused, HZ.ui.CategoryChooser));
		// pre-populate the div based on the category Id
		var categoryId = this.attr("categoryId"),
			categoryIdInputId = this.attr("categoryIdInputId"),
			category = HZ.data.Categories.getCategoryById(categoryId),
			name = UIHelper.ucwords(category.name).replace (/And/g, "and");
			
		// populate the name input field with the category name:
		this.val(name);	
		
		// populate the categoryId input field with the category id:
		$("#"+categoryIdInputId).val(categoryId);
		
		return this;
	};

})(jQuery);


window.hzmr.push("categoryChooser:1593");
} catch (err) {HZ.utils.Logger.sendJsExceptionStackTrace(err)}

/*************  End categoryChooser.js  **************/