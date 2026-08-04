<?php 
include('php/utils.php');

$controls = new Controls();

$ctrlsCfg = json_decode(file_get_contents('ctrls-config.json'));

$ctrls = $lights = '';
foreach ( $ctrlsCfg->material as $ctrlSet ) { 
    $wrapTagOpen = $wrapTagClose = '';
    if ( $ctrlSet->wrapping === true ) {
        $wrapTagOpen = "<div class=\"{$ctrlSet->wrapClass}\">";
        $wrapTagClose = '</div>';
    }
    $ctrls .= $wrapTagOpen;
    foreach ( $ctrlSet->controls as $key=>$val ) {
        if ( $val->ctrl === "range" )
            $ctrls .= $controls->slider($key, $val, 'material');
        if ( $val->ctrl === "color" )
            $ctrls .= $controls->colorPicker($key, $val, 'material');        
    }
    $ctrls .= $wrapTagClose;
}
$lightsCfg = 'const lightsCfg = ' . json_encode($ctrlsCfg->lights) . ';'; 

foreach ( $ctrlsCfg->lights as $key=>$light ) {
    $lights .= '<div class="col-2">' .
        $controls->lightColor($light->sort . $key, $light, 'lights', 'color') . 
        $controls->lightSlider($light->sort . $key, $light, 'lights', 'intensity') . 
    '</div>';

    if ( isset($light->pos) ) {
        $lights .= '<div class="col-3">' . 
            $controls->lightPos($light->sort, $light, 'x', $key, 'lights', 'pos') . 
            $controls->lightPos($light->sort, $light, 'y', $key, 'lights', 'pos') . 
            $controls->lightPos($light->sort, $light, 'z', $key, 'lights', 'pos') . 
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
