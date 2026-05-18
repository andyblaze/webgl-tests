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

function prepStr($str, $enc='', $toArray=false) {

}

$tree = [];
$names = [];

foreach ( glob('scenes/*') as $path ) { 
    $tree[basename($path)] = [
        'config' => file_get_contents($path . '/config.js'),
        'shader' => '`' . file_get_contents($path . '/fs.frag') . '`'
    ];
} 
$js = [];
foreach ( $tree as $name=>$files ) {
    //$sceneCfg = ['config'=>$files['config'], 'shader'=>$files['shader']];
    $js[] = $name . ': {config: ' . $files['config'] . ', shader: ' . $files['shader'] . '}';
}
//$js = trim($js, ',');



$viewHtml = file_get_contents("view.html");
$viewHtml = str_replace(
    ['$$indices$$', '$$scenes$$'],
    ['"' . implode('","', array_keys($tree)) . '"', implode(',', $js)],
    $viewHtml
);

//echo $viewHtml;


$shaders = [
    'fragShaderCopy'=> 'fscopy.frag',
    'vertShader'=> 'vs.vert'//,
    //'fragShader'=> 'fs.frag'
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
