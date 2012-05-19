// Normaliser for outputed css, as the parser destroys it.
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
};