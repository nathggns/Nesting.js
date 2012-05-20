/* CSS Nesting Polyfill */
(function(window, document, undefined) {
	nesting = new (function() {/* Support library written specifically for nesting.js. */
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
		// Run callback when the request is done. Opera doesn't like support.event for this :/
		req.onload = function() {
			callback.call(nesting, req.responseText, req);
		};
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
	this.occurs = function(string, ochar) {
		var chrs = string.split(""),
			times = 0;

		this.each(chrs, function(chr, key) {
			if (chr === ochar) times++;
		});

		return times;
	};

	// Expose string.trim as a normal function
	this.trim = function(value) { return value.trim(); };

	// Get last element of an array
	this.last = function(array) { return array[array.length-1]; };
});// Normaliser for outputed css, as the parser destroys it.
this.normalise = function(blocks, mod) {
	if (typeof blocks === "string") return this.normalise([blocks], true);
	var support = this.support,
		replacements = [["\t",""],["\n", ""],[": ", ":"]];

	blocks = support.each(blocks, function(block) {
		for (var key in replacements) {
			var r = replacements[key];
			while (block !== block.replace(r[0], r[1]))
				block = block.replace(r[0], r[1]);
		}
		return block;
	});

	return mod ? blocks[0] : blocks;
};this.parse = function(content) {
	var chrs = content.split(''),
		blocks = [],
		buffer = '',
		level = 0,
		support = this.support;

	support.each(chrs, function(chr) {
		buffer += chr;
		switch (chr) {
			case '{':
				level++;
				break;
			case '}':
				level--;
				if (level === 0) {
					blocks.push(buffer);
					buffer = '';
				}
		};
	});

	newblocks = [];

	blocks = support.each(blocks, function(block) {
		// Skip special blocks. Will support @media in the future.
		var special = ["font-face", "media"],
			isSpecial = false;

		support.each(special, function(s) {
			if (block.replace("@" + s, "") !== block) isSpecial = true;
		});
		if (isSpecial) {
			newblocks.push(block);
			return block;
		}
		
		// Add this blocks to the stack
		var newblock = nesting.shift(block);
		newblocks.push(newblock[0]);
		(function(block) {
			if (block[1] != "") {
				newblocks.push(block[1][0]);
				arguments.callee(block[1]);
			};
		})(newblock);
	});

	return this.normalise(newblocks).join("");
};

this.shift = function(block, parent) {
	parent = parent || '';
	var level = 0,
		buffer = '',
		chrs = block.split(""),
		support = this.support,
		mode = 'normal',
		selector = '',
		newblock = '';

	support.each(chrs, function(chr, key) {
		if (mode === 'selector') {
			selector += chr;
		}
		if (level > 1) {
			buffer += chr;
		} else if (mode === 'normal' && chr != "&") {
			newblock += chr;
		}

		switch (chr) {
			case '&':
				if (level === 1) {
					mode = 'selector';
					chr = '';
				}
				break;
			case '{':
				mode = 'normal'
				level++;
				break;
			case '}':
				level--;
				break;
		};
	});
	if (selector.length > 0) {
		if (parent === '') {
			parent = block.split("{")[0].trim();
		};

		buffer = parent + " " + selector.trim() + buffer.trim();
		buffer = this.shift(buffer);
	};

	if (newblock === '') newblock = block;
	return [newblock, buffer];
};this.run = function() {
	var support = this.support,
		styleElements = document.head.getElementsByTagName('style'),
		linkElements = document.head.getElementsByTagName('link'),
		sources = [];

	// Add all style tags to sources stack
	support.each(styleElements, function(source) {
		sources.push({
			type: 'local',
			content: source.innerHTML,
			element: source
		});
	});

	// Add some link tags to source stack
	support.each(linkElements, function(source) {
		// Ignore if source.rel != "stylesheet"
		if (source.rel !== "stylesheet") return false;
		sources.push({
			type: 'remote',
			url: source.href,
			element: source
		});
	});

	// If no sources exist, we have no work to do, so stop the function
	if (sources.length < 1) return false;

	// Iterate over all of our sources, and do the real work
	support.each(sources, function(source) {
		// Cache the callee
		var callee = arguments.callee;
		// If the source is remote, fetch the content via AJAX
		if (source.type === "remote" && !source.content) {
			return support.request(source.url, function(content) {
				source.content = content;
				return callee(source);
			});
		};

		// Do a test to see if there actually is nesting.
		var chrs = source.content.split(""),
			level = 0,
			nested = false;

		for (var key in chrs) {
			var chr = chrs[key];
			if (chr === '{') level++;
			else if (chr === '}') level--;
			if (level > 1) {
				nested = true;
				break;
			};
		};

		// If there isn't nesting, move to the next source.
		if (!nested) return false;

		source.content = nesting.parse(source.content);

		// Replace the old source, with the new one
		if (source.type === "local") {
			var elem = source.element;
		} else {
			var elem = document.createElement("style");
			elem.type = "text/css";
		};
		elem.innerHTML = source.content;
		if (source.type !== "local") {
			document.head.appendChild(elem);
			source.element.parentNode.removeChild(source.element);
		};
	});
};	});
	// Run nesting.js
	nesting.support.ready(function() {
		// Run nesting.run as part of nesting
		nesting.run.call(nesting);
	});
})(window, document);