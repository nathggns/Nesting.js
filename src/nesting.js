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
});