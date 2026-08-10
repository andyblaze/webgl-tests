<?php 
include('php/utils.php');

$ctrlsBuilder = new ControlsBuilder(new Controls());

$ctrlsCfg = json_decode(file_get_contents('ctrls-config.json'));

$material = $ctrlsBuilder->build($ctrlsCfg->material, 'material');
$lights = $ctrlsBuilder->buildLights($ctrlsCfg->lights);
$maps = $ctrlsBuilder->build($ctrlsCfg->maps, 'maps');

$lightsCfg = 'const lightsCfg = ' . json_encode($ctrlsCfg->lights) . ';'; 

$data = [
    'css' => link_tag('css/sys.css'),
    'lightsCfg' => $lightsCfg,
    'material' => $material,
    'lights' => $lights,
    'maps' => $maps
];

$html = file_get_contents('php/view.html');

foreach ( $data as $key=>$val ) {
    $html = str_replace('{{' . $key . '}}', $val, $html);
}

echo $html; 
