(function(window, document, undefined) {if (!window.Modernizr) {
	window.Modernizr = (function( window, document, undefined ) {
		var version = '2.5.3',
		Modernizr = {},

		docElement = document.documentElement,
		mod = 'modernizr',
		modElem = document.createElement(mod),
		mStyle = modElem.style,
		inputElem ,
		toString = {}.toString,    tests = {},
		inputs = {},
		attrs = {},
		classes = [],
		slice = classes.slice,
		featureName,
		_hasOwnProperty = ({}).hasOwnProperty, hasOwnProperty;

		if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
			hasOwnProperty = function (object, property) {
				return _hasOwnProperty.call(object, property);
			};
		}
		else {
			hasOwnProperty = function (object, property) { 
				return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
			};
		}


		if (!Function.prototype.bind) {
			Function.prototype.bind = function bind(that) {

				var target = this;

				if (typeof target != "function") {
					throw new TypeError();
				}

				var args = slice.call(arguments, 1),
						bound = function () {

						if (this instanceof bound) {

							var F = function(){};
							F.prototype = target.prototype;
							var self = new F;

							var result = target.apply(
								self,
								args.concat(slice.call(arguments))
							);
							if (Object(result) === result) {
								return result;
							}
							return self;

						} else {

							return target.apply(
								that,
								args.concat(slice.call(arguments))
							);

						}

				};

				return bound;
			};
		}

		function setCss( str ) {
			mStyle.cssText = str;
		}

		function setCssAll( str1, str2 ) {
			return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
		}

		function is( obj, type ) {
			return typeof obj === type;
		}

		function contains( str, substr ) {
			return !!~('' + str).indexOf(substr);
		}


		function testDOMProps( props, obj, elem ) {
			for ( var i in props ) {
					var item = obj[props[i]];
					if ( item !== undefined) {
						if (elem === false) return props[i];

						if (is(item, 'function')){
							return item.bind(elem || obj);
						}
						return item;
					}
			}
			return false;
		}



		for ( var feature in tests ) {
				if ( hasOwnProperty(tests, feature) ) {
						featureName  = feature.toLowerCase();
						Modernizr[featureName] = tests[feature]();

						classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
				}
		}


		setCss('');
		modElem = inputElem = null;


		Modernizr._version      = version;


		//Modernizr.testStyles    = injectElementWithStyles;
		return Modernizr;

	})(this, this.document);
};

if (!window.Modernizr.addTest) {
	Modernizr.addTest = function ( feature, test ) {
		if ( typeof feature == 'object' ) {
			for ( var key in feature ) {
				if ( hasOwnProperty( feature, key ) ) {
					Modernizr.addTest( key, feature[ key ] );
				}
			}
		} else {

			feature = feature.toLowerCase();
			if ( Modernizr[feature] !== undefined ) {
				return Modernizr;
			}
			test = typeof test == 'function' ? test() : test;
			Modernizr[feature] = test;
		}

		return Modernizr; 
	};
}

if (!window.Modernizr.testStyles) {
	Modernizr.testStyles = function( rule, callback, nodes, testnames ) {
		var style, ret, node,
			div = document.createElement('div'),
			body = document.body, 
			fakeBody = body ? body : document.createElement('body');

		if ( parseInt(nodes, 10) ) {
			while ( nodes-- ) {
				node = document.createElement('div');
				node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
				div.appendChild(node);
			}
		}

		style = ['&#173;','<style>', rule, '</style>'].join('');
		div.id = mod;
		(body ? div : fakeBody).innerHTML += style;
		fakeBody.appendChild(div);
		if(!body){
			fakeBody.style.background = "";
			docElement.appendChild(fakeBody);
		}

		ret = callback(div, rule);
			!body ? fakeBody.parentNode.removeChild(fakeBody) : div.parentNode.removeChild(div);

		return !!ret;

	}
}// IE XMLHttpRequest pollyfill
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
};var parse = function(css) {
	chars = css.split('');
		buffers = [''];
		level = 0;
		selectors = [];
		tree = [];
		modes = [];

	for (var key in chars) {
		var chr = chars[key],
			buff = buffers[level];

		buffers[level] += chr;

		switch (chr) {
			case '{':
				var parts = buff.split(";");
				buffers[level] = buff.replace(parts[parts.length-1], "");
				selectors.push(parts[parts.length-1]);
				buffers[++level] = '';
				break;
			case '}':
				var currentSelector = selectors.slice(0, level).join(" "),
					found = false, rules = buff.substr(0, buff.length-1).split(";");
				tree.push([currentSelector, rules]);
				buffers[level--] = '';
				selectors = currentSelector.split(" ");
				break;
		};
	};
	
	// Turn tree into css :D
	var css = '';

	for (var key in tree) {
		var block = tree[key],
			selector = block[0],
			rules = block[1];

		css += selector + "{" + rules.join(";") + ";}";
	};

	return css;
};var normalise = function(css) {
	var replacements = {
		"\n": "",
		"\t": "",
		": ": ":",
		" {": "{",
		" }": "}"
	};
	for (var key in replacements) {
		var result = replacements[key]
		while (css.replace(key, result) != css) css = css.replace(key, result);
	};
	return css;
};
if (!window.Modernizr || !Modernizr.addTest || !Modernizr.testStyles) return false;
Support.ready(function() {
	// Get style and link elements
	var styleElements = document.head.getElementsByTagName("style"),
		linkElements = document.head.getElementsByTagName("link"),
		sources = [];

	Support.each(styleElements, function(style) {
		sources.push({
			"type": "style",
			"content": style.innerHTML,
			"elem": style
		});
	});

	Support.each(linkElements, function(link) {
		// Ignore if it isn't a stylesheet
		if (link.rel != "stylesheet") return false;

		// Add to sources stack
		sources.push({
			"type": "link",
			"url": link.href,
			"elem": link
		});
	});

	// If there are no sources, just die.
	if (sources.length < 1) return false;

	// Iterate over the source, do the real work
	(function(key) {
		var source = sources[key], callee = arguments.callee;
		// If the content is in a seperate file, load the content via ajax
		if (source.type == "link" && !source.content) {
			return Support.request(source.url, function(content) {
				source.content = content;
				return callee(key);
			});
		}
		
		// Normalise the sources content
		source.content = normalise(source.content);
		
		// Tokenize and parse the content
		var content = parse(source.content);

		// Replace the old source with the new one!!
		if (content != source.content) {
			// Create a new source with the new content
			// var elem = document.createElement("style");
			// elem.type = "text/css";
			// elem.innerHTML = content;
			// document.head.appendChild(elem);

			if (source.type === "style") {
				var elem = source.elem;
			} else {
				var elem = document.createElement("style");
				elem.type = "text/css";
			};

			elem.innerHTML = content;

			// Replace the old one
			if (source.type !== "style") {
				document.head.appendChild(elem);
				source.elem.parentNode.removeChild(source.elem);
			}
		}
	})(0);
});})(window, document);