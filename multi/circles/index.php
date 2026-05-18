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

$names = [];
$js = [];

foreach ( glob('scenes/*') as $path ) { 
    $name = basename($path);
    $names[] = $name;
    $cfg = file_get_contents($path . '/config.js');
    $shdr = data2str(file_get_contents($path . '/fs.frag'), '`');
    $js[] = $name . ': {config: ' . $cfg . ', shader: ' . $shdr . '}';
} 

$viewHtml = file_get_contents("view.html");
$viewHtml = str_replace(
    ['$$indices$$', '$$scenes$$'],
    [data2str($names, '"', '","'), data2str($js, '', ',')],
    $viewHtml
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

echo str_replace(
    '{{shaders}}',
    "<script type=\"text/javascript\">{$shaderJS}</script>\n",
    $viewHtml
);
