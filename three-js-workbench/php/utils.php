<?php

define('IN_PRODUCTION', false);

define('BASE_URL', (IN_PRODUCTION === true ? 'https://mediagraphic.co.uk/particle-workspace/' : 'http://127.0.0.1/_webgl-tests/three-js-workbench/'));

function url($u='') {
    return BASE_URL . $u;
}

function link_tag($cssFile) {
    return '<link rel="stylesheet" href="' . url($cssFile) . '" type="text/css">' . PHP_EOL;
}

function meta($name, $content) {
    return "<meta name=\"{$name}\" content=\"{$content}\">\n";
}

function meta_prop($prop, $content) {
    return "<meta property=\"{$prop}\" content=\"{$content}\">\n";
}

function saneItems($name, $property, $prefix) {
    $lbl = ucfirst(str_replace('-', ' ', $name));
    $prop = $property === '' ? $name : $property;
    $name = $prefix . $name;
    return [$lbl, $prop, $name];    
}

function slider1($name, $val, $min=0, $max=1, $step=0.01, $type='flt', $property='', $prefix='') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    return "<label>
      {$lbl}: <span id=\"{$name}-lbl\">{$val}</span> 
      <input type=\"range\" id=\"{$name}-slider\" min=\"{$min}\" max=\"{$max}\" step=\"{$step}\" value=\"{$val}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$type}\" />
    </label>";
}

function slider(string $name, object $val, $property='', $prefix='') {
    $min  = $val->min  ?? 0;
    $max  = $val->max  ?? 1;
    $step = $val->step ?? 0.01;
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    return "<label>
        {$lbl}: <span id=\"{$name}-lbl\">{$val->value}</span> 
        <input type=\"range\" id=\"{$name}-slider\" min=\"{$min}\" max=\"{$max}\" step=\"{$step}\" value=\"{$val->value}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$val->type}\" />
    </label>";
}

function colorPicker(string $name, object $val, $property='', $prefix='color-') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    return "<label class=\"color-ctrl\">
        {$lbl}: <span id=\"{$name}-lbl\">{$val->value}</span>
        <input type=\"color\" id=\"{$name}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$val->type}\" value=\"{$val->value}\" />
    </label>";
}

function pre($data) {
    echo '<pre>'; var_dump($data); echo '</pre>';
}