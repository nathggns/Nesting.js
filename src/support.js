// IE XMLHttpRequest pollyfill
if (typeof window.XMLHttpRequest === 'undefined' && typeof window.ActiveXObject === 'function') {
		window.XMLHttpRequest = function() {
			try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch (e) {};
			try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch (e) {};
			return new ActiveXObject('Microsoft.XMLHTTP');
		};
};
window.Support = {
	'event': function(elem, event, callback) {
		if (document.addEventListener) {
			elem.addEventListener(event, callback);
			return true;
		} else if (document.attachEvent) {
			document.attachEvent("on" + event, callback);
			return true;
		};
		return false;
	},
	'ready': function(callback) {
		if (document.addEventListener) return Support.event(document, 'DOMContentLoaded', callback);
		(function() {
			try {
				document.documentElement.doScroll("left", 1);
			} catch (e) {
				return setTimeout(arguments.callee, 1);
			};
			callback.call(document);
		})();
	},
	'request': function(url, callback) {
		var req = new XMLHttpRequest;
		req.open('GET', url);
		Support.event(req, 'load', function() {
			callback(req.responseText, req);
		});
		req.send();
	},
	'each': function(array, callback) {
		for (var key = 0; key < array.length; key++) {
			callback(array[key], key, array);
		};
	},
	'last': function(arr) {
		return arr[arr.length-1];
	}
};