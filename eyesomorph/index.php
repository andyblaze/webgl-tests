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

$viewHtml = file_get_contents("view.html");

$shaders = [
    'fragShaderCopy'=> 'fscopy.frag',
    'vertShader'=> 'vs.vert',
    'fragShader'=> 'fs.frag'
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
