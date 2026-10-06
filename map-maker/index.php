<?php 

$ctrlsData = [
    "height" => ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0.25],
    "perlin" => ["min" => 0.01, "max" => 1, "step" => 0.01, "value" => 0.5],
    "scale" => ["min" => 0.001, "max" => 0.25, "step" => 0.001, "value" => 0.1],
    "strength" => ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0.25],
    "contrast" => ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0.25],
    "exaggeration" => ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0.25],
    "radial" => ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0.25],
    "twist" => ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0.25],
    "terrace" => ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0.25],
    "ripple" => ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0.25],
    "warp" => ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0.25],
    "blur" => ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0.25],
    "ridge" => ["min" => 0, "max" => 1, "step" => 0.01, "value" => 0.25],
];

/*
        <label>Strength: <span id="strength-lbl">10</span>
            <input type="range" min="0.1" max="20" step="0.1" value="10" id="strength" data-label="strength-lbl" data-type="float" />
        </label>
        <label>Contrast: <span id="contrast-lbl">1</span>
            <input type="range" min="0.1" max="3" step="0.1" value="1" id="contrast" data-label="contrast-lbl" data-type="float" />
        </label>
        <label>Exaggeration: <span id="exaggeration-lbl">0</span>
            <input type="range" min="0" max="6" step="0.1" value="0" id="exaggeration" data-label="exaggeration-lbl" data-type="float" />
        </label>
        <label>Radial: <span id="radial-lbl">0</span>
            <input type="range" min="0" max="1" step="0.01" value="0" id="radial" data-label="radial-lbl" data-type="float" />
        </label>
        <label>Twist: <span id="twist-lbl">0</span>
            <input type="range" min="0" max="1" step="0.01" value="0" id="twist" data-label="twist-lbl" data-type="float" />
        </label>
        <label>Terrace: <span id="terrace-lbl">0</span>
            <input type="range" min="0" max="1" step="0.01" value="0" id="terrace" data-label="terrace-lbl" data-type="float" />
        </label>
        <label>Ripple: <span id="ripple-lbl">0</span>
            <input type="range" min="0" max="1" step="0.01" value="0" id="ripple" data-label="ripple-lbl" data-type="float" />
        </label>
        <label>Warp: <span id="warp-lbl">0</span>
            <input type="range" min="0" max="50" step="0.01" value="0" id="warp" data-label="warp-lbl" data-type="float" />
        </label>
        <label>Blur: <span id="blur-lbl">0</span>
            <input type="range" min="0" max="100" step="0.1" value="0" id="blur" data-label="blur-lbl" data-type="float" />
        </label>
        <label>Ridge: <span id="ridge-lbl">0</span>
            <input type="range" min="0" max="1" step="0.01" value="0" id="ridge" data-label="ridge-lbl" data-type="float" />
        </label>
*/

function makeCtrl($name, $data) {
    $d = (object)$data;
    return "\n<label>{$name}: <span id=\"{$name}-lbl\">{$d->value}</span>
            <input type=\"range\" min=\"{$d->min}\" max=\"{$d->max}\" step=\"{$d->max}\" value=\"{$d->value}\" id=\"{$name}\" data-label=\"{$name}-lbl\" data-type=\"float\" />
        </label>\n";
}

$ctrls = '';

foreach ( $ctrlsData as $key => $val )
    $ctrls .= makeCtrl($key, $val);

$html = file_get_contents('view.html');

echo str_replace('{{ctrls}}', $ctrls, $html);
        