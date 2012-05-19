/* Support library written specifically for nesting.js. */
this.support = new (function() {
	// Basic Event Handler. Should work in all browsers
	this.event = function(element, event, callback) {
		// Decide what event handler function we use
		if (document.addEventListener) {
			element.addEventListener(event, callback);
		} else if (document.attachEvent) {
			element.attachEvent("on" + event, callback);
		} else { return false; };

		return true;
	};

	// DOM Ready Event Handler, basically a wrapper for support.event in modern browsers
	this.ready = function(callback) {
		if (document.addEventListener)
			return this.event(document, 'DOMContentLoaded', callback);
		// Do scroll hack for IE.
		// Tries to use the DOM, if it can't, tries again until it can.
		(function() {
			try {
				document.documentElement.doScroll("left", 1);
			} catch(e) {
				return setTimeout(arguments.callee, 1);
			};
			callback.call(document);
		})();
	};

	// Ajax Helper.
	// First thing to do, is make IE act like modern browsers
	if (typeof window.XMLHttpRequest === 'undefined' && 
		typeof window.ActiveXObject === 'function') {
		window.XMLHttpRequest = function() {
			try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch (e) {};
			try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch (e) {};
			return new ActiveXObject('Microsoft.XMLHTTP');
		};
	};
	// Create the helper. Gonna do it asynchronously
	this.request = function(url, callback, mode) {
		var req = new XMLHttpRequest;
		req.open(mode || 'GET', url);
		// Run callback when the request is done. Gonna use support.event
		this.event(req, 'load', function() {
			callback.call(nesting, req.responseText, req);
		});
		// Send the request
		req.send();
	};

	// Loop helper. Can be used like PHPs array_map, or jQuery.each
	this.each = function(array, callback) {
		for (var key = 0; key < array.length; key++) {
			array[key] = callback.call(nesting, array[key], key, array);
		};
		return array;
	};

	// Occurs helper
	this.occurs = function(string, char) {
		var chrs = string.split(""),
			times = 0;

		this.each(chrs, function(chr, key) {
			if (chr === char) times++;
		});

		return times;
	};

	// Expose string.trim as a normal function
	this.trim = function(value) { return value.trim(); };

	// Get last element of an array
	this.last = function(array) { return array[array.length-1]; };
});