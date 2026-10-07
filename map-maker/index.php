<?php 

$ctrlsData = [
    "height" =>         ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0.25],
    "perlin" =>         ["min" => 0.01, "max" => 1, "step" => 0.01, "value" => 0.5],
    "scale" =>          ["min" => 0.001, "max" => 0.25, "step" => 0.001, "value" => 0.1],
    "contrast" =>       ["min" => 0.1, "max" => 3, "step" => 0.1, "value" => 1],
    "radial" =>         ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0],
    "twist" =>          ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0],
    "terrace" =>        ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0],
    "ripple" =>         ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0],
    "warp" =>           ["min" => 0, "max" => 50, "step" => 0.01, "value" => 0],
    "pinch" =>          ["min" => -1, "max" => 1, "step" => 0.01, "value" => 0],
    "shear" =>          ["min" => -1, "max" => 1, "step" => 0.1, "value" => 0],
    "wave" =>           ["min" => 0, "max" => 50, "step" => 0.1, "value" => 0]
];

$postProcess = [
    "strength" =>       ["min" => 0, "max" => 20, "step" => 0.1, "value" => 10],
    "ridge" =>          ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0],
    "exaggeration" =>   ["min" => 0, "max" => 6, "step" => 0.1, "value" => 0],
    "blur" =>           ["min" => 0, "max" => 100, "step" => 0.01, "value" => 0]
];

$geometries = [
    "sphere",
    "box",
    "cone",
    "cylinder",
    "capsule",
    "dodecahedron",
    "torus",
    "torusknot"
];

function makeSelect($id, $opts) {
    $htm = "<select id=\"{$id}\">";
    foreach ( $opts as $key => $val ) {
        $sel = $key === 0 ? ' selected="selected"' : '';
        $txt = ucfirst($val);
        $htm .= "<option value=\"{$val}\"{$sel}>{$txt}</option>";
    }
    $htm .= '</select>';
    return $htm;
}

function makeCtrl(string $name, array $data) {
    $d = (object)$data;
    return "\n<label>{$name}: <span id=\"{$name}-lbl\">{$d->value}</span>
            <input type=\"range\" min=\"{$d->min}\" max=\"{$d->max}\" step=\"{$d->step}\" value=\"{$d->value}\" id=\"{$name}\" data-label=\"{$name}-lbl\" data-type=\"float\" />
        </label>\n";
}

$ctrls = '';
$post = '';

foreach ( $ctrlsData as $key => $val )
    $ctrls .= makeCtrl($key, $val);

foreach ( $postProcess as $key => $val )
    $post .= makeCtrl($key, $val);

$select = makeSelect('geometry-change', $geometries);

$html = file_get_contents('view.html');

echo str_replace(['{{ctrls}}', '{{post}}', '{{select}}'], [$ctrls, $post, $select], $html);
        