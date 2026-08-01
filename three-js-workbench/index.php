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
    $name = $light->type . $key;
    $lbl = ucfirst(str_replace('-', ' ', $name));

    $lights .= "<div class=\"col-2\"><label class=\"color-ctrl\">
        {$lbl}: <span id=\"{$name}-lbl\">{$light->color}</span>
        <input type=\"color\" id=\"{$name}\" data-label=\"{$name}-lbl\" data-property=\"color\" data-type=\"str\" data-index=\"lights\" value=\"{$light->color}\" autocomplete=\"off\" />
    </label>";

    $lights .= "<label>
        {$lbl}: <span id=\"{$name}-lbl\">{$light->intensity}</span> 
        <input type=\"range\" id=\"{$name}-slider\" min=\"0\" max=\"5\" step=\"0.5\" value=\"{$light->intensity}\" data-label=\"{$name}-lbl\" data-property=\"intensity\" data-type=\"{$light->type}\" data-index=\"lights\" data-lightid=\"{$name}\" autocomplete=\"off\" />
    </label></div>";
    if ( isset($light->pos) ) {
        $lights .= "<div class=\"col-3\">
        <label>
        {$lbl}: <span id=\"x{$key}-lbl\">{$light->pos->x}</span> 
        <input type=\"range\" id=\"{$name}-slider\" min=\"-10\" max=\"10\" step=\"1\" value=\"{$light->pos->x}\" data-label=\"x{$key}-lbl\" data-property=\"pos\" data-type=\"{$light->type}\" data-index=\"lights\" data-lightid=\"{$name}\" autocomplete=\"off\" />
    </label>
        <label>
        {$lbl}: <span id=\"y{$key}-lbl\">{$light->pos->y}</span> 
        <input type=\"range\" id=\"{$name}-slider\" min=\"-10\" max=\"10\" step=\"1\" value=\"{$light->pos->y}\" data-label=\"y{$key}-lbl\" data-property=\"pos\" data-type=\"{$light->type}\" data-index=\"lights\" data-lightid=\"{$name}\" autocomplete=\"off\" />
    </label>
        <label>
        {$lbl}: <span id=\"z{$key}-lbl\">{$light->pos->z}</span> 
        <input type=\"range\" id=\"{$name}-slider\" min=\"-10\" max=\"10\" step=\"1\" value=\"{$light->pos->z}\" data-label=\"z{$key}-lbl\" data-property=\"pos\" data-type=\"{$light->type}\" data-index=\"lights\" data-lightid=\"{$name}\" autocomplete=\"off\" />
    </label>
        </div>";
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
