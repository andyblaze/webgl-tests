<?php 
include('php/utils.php');

$ctrlsCfg = json_decode(file_get_contents('ctrls-config.json'));
$ctrls = $lights = '';
foreach ( $ctrlsCfg->material as $key=>$val ) {
    if ( $val->ctrl === "range" )
        $ctrls .= slider($key, $val, 'material');
    if ( $val->ctrl === "color" )
        $ctrls .= colorPicker($key, $val, 'material');
}
$lightsCfg = 'const lightsCfg = ' . json_encode($ctrlsCfg->lights) . ';'; 

foreach ( $ctrlsCfg->lights as $key=>$light ) {
    $lights .= '<div class="col-2">' .
        lightColor($light->sort . $key, $light, 'lights', 'color') . 
        lightSlider($light->sort . $key, $light, 'lights', 'intensity') . 
    '</div>';

    if ( isset($light->pos) ) {
        $lights .= '<div class="col-3">' . 
            lightPos($light->sort, $light, 'x', $key, 'lights', 'pos') . 
            lightPos($light->sort, $light, 'y', $key, 'lights', 'pos') . 
            lightPos($light->sort, $light, 'z', $key, 'lights', 'pos') . 
        '</div>';
    }
}

$data = [
    'css' => link_tag('css/sys.css'),
    'lightsCfg' => $lightsCfg,
    'ctrls' => $ctrls,
    'lights' => $lights
];

$html = file_get_contents('php/view.html');

foreach ( $data as $key=>$val ) {
    $html = str_replace('{{' . $key . '}}', $val, $html);
}

echo $html;
