this.parse = function(content) {
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

		buffer = parent + selector.replace("\n", "").replace("\t", "") + buffer.trim();
		buffer = this.shift(buffer);
	};

	if (newblock === '') newblock = block;
	return [newblock, buffer];
};