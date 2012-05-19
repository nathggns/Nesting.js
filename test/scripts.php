<?php
header("Content-type: text/javascript");
$config = json_decode(file_get_contents(("../build_config.json")), true);
$files = $config['files'];

foreach ($files as $file) echo file_get_contents("../src/$file");