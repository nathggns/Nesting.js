<?php
header("Content-type: text/javascript");
$files = array(
	"intro.js",
	"Modernizr.js",
	"support.js",
	"parser.js",
	"normalise.js",
	"nesting.js",
	"outro.js"
);

foreach ($files as $file) echo file_get_contents("../src/$file");