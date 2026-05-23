<?php 

function readGl($n, $p, $f) {
    $fn = $p . $f;
    if ( file_exists($fn) ) { 
        $fc = file_get_contents($fn);

        $fc = str_replace("\\", "\\\\", $fc);
        $fc = str_replace("`", "\\`", $fc);

        return "const {$n} = `{$fc}`;\n";
    }
    else echo "File not found  -  " . $fn . "    <br>\n";
}

function pre($data) {
    echo '<pre>'; var_dump($data); echo '</pre>';
}

function data2str($data, $enc='', $separator='') {
    $result = $data;
    if ( $separator != '' ) {
        $result = implode($separator, $result);
    }
    return $enc . $result . $enc;
}

function scriptTag($js) {
    return "<script type=\"text/javascript\">\n{$js}\n</script>\n";
}

function createMeta($name, $path) {
    if ( file_exists($path . '/meta.json') ) return;
    $meta = '{
    "name": "%n%",
    "minTime": 10,
    "maxTime": 17
}';
    $fc = str_replace('%n%', $name, $meta);
    file_put_contents($path . '/meta.json', $fc);
}

$names = [];
$js = [];

foreach ( glob('scenes/*') as $path ) { 
    $name = basename($path);
    createMeta($name, $path);
    $names[] = $name;
    $cfg = file_get_contents($path . '/config.js');
    $shdr = data2str(file_get_contents($path . '/fs.frag'), '`');
    $meta = file_get_contents($path . '/meta.json');
    $js[] = $name . ': {config: ' . $cfg . ', shader: ' . $shdr . ', meta: ' . $meta .'}';
} 

$scenesClass = file_get_contents('js-php/scenes.js');

$scenesClass = str_replace(
    ['$$indices$$', '$$scenes$$'],
    [data2str($names, '"', '","'), data2str($js, '', ',')],
    $scenesClass
);

$shaders = [
    'fragShaderCopy'=> 'fscopy.frag',
    'vertShader'=> 'vs.vert'
];

$shaderJS = '';
$path = 'gl/';
foreach ($shaders as $name => $filename) {
    $shaderJS .= readGl($name, $path, $filename);
}

$viewHtml = file_get_contents('view.html');

header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

$timestamp = time();

echo str_replace(
    ['{{scenes}}', '{{shaders}}', '$$time$$'],
    [scriptTag($scenesClass), scriptTag($shaderJS), $timestamp],
    $viewHtml
);
