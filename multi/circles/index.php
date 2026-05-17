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

$tree = [];
foreach ( glob('scenes/*') as $name ) {
    $tree[basename($name)] = [];
} 
foreach ( $tree as $name=>$arr ) {
    $dir = 'scenes/' . $name . '/';
    $tree[$name]['config'] = file_get_contents($dir . 'config.js');
    $tree[$name]['shader'] = '`' . file_get_contents($dir . 'fs.frag') . '`';
}
$js = '';
foreach ( $tree as $name=>$files ) {
    //$sceneCfg = ['config'=>$files['config'], 'shader'=>$files['shader']];
    $js .= $name . ': {config: ' . $files['config'] . ', shader: ' . $files['shader'];
}
$js .= '}';


$viewHtml = file_get_contents("view.html");
$viewHtml = str_replace(
    '$$scenes$$',
    $js,
    $viewHtml
);

//echo $viewHtml;


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
