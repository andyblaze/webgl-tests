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
$lightsCfg = 'const lightsCfg = [
    {"type": "ambient", "color": "#ffffff", "intensity": 2},
    {"type": "directional", "color": "#c60000", "intensity": 2, "pos": { "x": 0, "y": 8, "z": 0 }},
    {"type": "directional", "color": "#00c600", "intensity": 2, "pos": { "x": -8, "y": 8, "z": 7 }}
];';

foreach ( $ctrlsCfg->lights as $key=>$light ) {
    $name = $light->type . $key;
    $lbl = ucfirst(str_replace('-', ' ', $name));
    $lights .= "<label>
        {$lbl}: <span id=\"{$name}-lbl\">{$light->intensity}</span> 
        <input type=\"range\" id=\"{$name}-slider\" min=\"0\" max=\"5\" step=\"0.5\" value=\"{$light->intensity}\" data-label=\"{$name}-lbl\" data-property=\"intensity\" data-type=\"{$light->type}\" data-index=\"lights\" data-lightid=\"{$name}\" autocomplete=\"off\" />
    </label>";
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
