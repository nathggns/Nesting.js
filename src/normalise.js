var normalise = function(css) {
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
