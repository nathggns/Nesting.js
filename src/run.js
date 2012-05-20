this.run = function() {
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
		// If there isn't nesting, move to the next source.
		if (support.occurs(source.content, "{") < 2) return false;

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
};