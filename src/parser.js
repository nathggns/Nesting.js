var parse = function(css) {
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
};