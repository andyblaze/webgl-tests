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

$names = [];
$js = [];
$meta = '';

foreach ( glob('scenes/*') as $path ) { 
    $name = basename($path);
    $names[] = $name;
    $cfg = file_get_contents($path . '/config.js');
    $shdr = data2str(file_get_contents($path . '/fs.frag'), '`');
    $js[] = $name . ': {config: ' . $cfg . ', shader: ' . $shdr . '}';
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

echo str_replace(
    ['{{scenes}}', '{{shaders}}'],
    [scriptTag($scenesClass), scriptTag($shaderJS)],
    $viewHtml
);
