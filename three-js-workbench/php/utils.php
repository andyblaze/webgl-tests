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

function slider(string $name, object $val, string $index, $property='', $prefix='') {
    $min  = $val->min  ?? 0;
    $max  = $val->max  ?? 1;
    $step = $val->step ?? 0.01;
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    return "<label>
        {$lbl}: <span id=\"{$name}-lbl\">{$val->value}</span> 
        <input type=\"range\" id=\"{$name}-slider\" min=\"{$min}\" max=\"{$max}\" step=\"{$step}\" value=\"{$val->value}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$val->type}\" data-index=\"{$index}\" autocomplete=\"off\" />
    </label>";
}

function colorPicker(string $name, object $val, string $index, $property='', $prefix='color-') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    return "<label class=\"color-ctrl\">
        {$lbl}: <span id=\"{$name}-lbl\">{$val->value}</span>
        <input type=\"color\" id=\"{$name}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$val->type}\" data-index=\"{$index}\" value=\"{$val->value}\" autocomplete=\"off\" />
    </label>";
}

function lightColor(string $name, object $light, string $index, $property='', $prefix='') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    return "<label class=\"color-ctrl\">
        {$lbl}: <span id=\"{$name}-lbl\">{$light->color}</span>
        <input type=\"color\" id=\"{$name}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"str\" data-index=\"{$index}\" value=\"{$light->color}\" data-lightid=\"{$name}\" data-lighttype=\"{$light->sort}\" autocomplete=\"off\" />
    </label>";
}

function lightSlider(string $name, object $light, string $index, $property='', $prefix='') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    return "<label>
        {$lbl}: <span id=\"{$name}-lbl\">{$light->intensity}</span> 
        <input type=\"range\" id=\"{$name}-slider\" min=\"0\" max=\"5\" step=\"0.5\" value=\"{$light->intensity}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"int\" data-index=\"{$index}\" data-lightid=\"{$name}\" data-lighttype=\"{$light->sort}\" autocomplete=\"off\" />
    </label>";
}

function lightPos(string $name, object $light, string $axis, int $key, string $index, $property='', $prefix='') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    $name .= $key;
    $val = $light->pos->{$axis};
    $lblId = "{$axis}{$key}-lbl";
    return "<label>
        {$lbl}: <span id=\"{$lblId}\">{$light->pos->x}</span> 
        <input type=\"range\" id=\"{$name}-slider\" min=\"-10\" max=\"10\" step=\"1\" value=\"{$val}\" data-label=\"{$lblId}\" data-property=\"{$prop}\" data-type=\"int\" data-index=\"{$index}\" data-axis=\"{$axis}\" data-lightid=\"{$name}\" data-lighttype=\"{$light->sort}\" autocomplete=\"off\" />
    </label>";
}

function pre($data) {
    echo '<pre>'; var_dump($data); echo '</pre>';
}