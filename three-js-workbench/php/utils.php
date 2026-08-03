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

class Controls {
    public function __construct() {
        
    }
    public function saneItems(string $name, string $property, string $prefix) {
        $lbl = ucfirst(str_replace('-', ' ', $name));
        $prop = $property === '' ? $name : $property;
        $name = $prefix . $name;
        return [$lbl, $prop, $name];    
    }
    public function html(string $type, mixed $val, string $name, string $property, string $prefix) {
        list($lbl, $prop, $name) = $this->saneItems($name, $property, $prefix);
        $tagOpen = "<label class=\"{$type}-ctrl\">
                    {$lbl}: <span id=\"{$name}-lbl\">{$val}</span>";

        $tagClose = '</label>';
    }
    public function slider(string $name, object $item, string $index, $property='', $prefix='') {

    }
    public function colorPicker(string $name, object $item, string $index, $property='', $prefix='color-') {

    }
}

function saneItems(string $name, string $property, string $prefix) {
    $lbl = ucfirst(str_replace('-', ' ', $name));
    $prop = $property === '' ? $name : $property;
    $name = $prefix . $name;
    return [$lbl, $prop, $name];    
}

function slider(string $name, object $item, string $index, $property='', $prefix='') {
    $min  = $item->min  ?? 0;
    $max  = $item->max  ?? 1;
    $step = $item->step ?? 0.01;
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    return "<label class=\"slider-ctrl\">
        {$lbl}: <span id=\"{$name}-lbl\">{$item->value}</span> 
        <input type=\"range\" id=\"{$name}-slider\" value=\"{$item->value}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$item->type}\" data-index=\"{$index}\" min=\"{$min}\" max=\"{$max}\" step=\"{$step}\" autocomplete=\"off\" />
    </label>";
}

function colorPicker(string $name, object $item, string $index, $property='', $prefix='color-') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    return "<label class=\"color-ctrl\">
        {$lbl}: <span id=\"{$name}-lbl\">{$item->value}</span>
        <input type=\"color\" id=\"{$name}-color\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"{$item->type}\" data-index=\"{$index}\" value=\"{$item->value}\" autocomplete=\"off\" />
    </label>";
}

function lightColor(string $name, object $light, string $index, $property='', $prefix='color-') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    return "<label class=\"color-ctrl\">
        {$lbl}: <span id=\"{$name}-lbl\">{$light->color}</span>
        <input type=\"color\" id=\"{$name}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"str\" data-index=\"{$index}\" value=\"{$light->color}\" data-lightid=\"{$light->id}\" data-lighttype=\"{$light->sort}\" autocomplete=\"off\" />
    </label>";
}

function lightSlider(string $name, object $light, string $index, $property='', $prefix='') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    return "<label>
        {$lbl}: <span id=\"{$name}-lbl\">{$light->intensity}</span> 
        <input type=\"range\" id=\"{$name}-slider\" min=\"0\" max=\"5\" step=\"0.5\" value=\"{$light->intensity}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" data-type=\"int\" data-index=\"{$index}\" data-lightid=\"{$light->id}\" data-lighttype=\"{$light->sort}\" autocomplete=\"off\" />
    </label>";
}

function lightPos(string $name, object $light, string $axis, int $key, string $index, $property='', $prefix='') {
    list($lbl, $prop, $name) = saneItems($name, $property, $prefix);
    $name .= $key;
    $val = $light->pos->{$axis};
    $lblId = "{$axis}{$key}-lbl";
    return "<label>
        {$lbl}: <span id=\"{$lblId}\">{$light->pos->x}</span> 
        <input type=\"range\" id=\"{$name}-slider\" min=\"-10\" max=\"10\" step=\"1\" value=\"{$val}\" data-label=\"{$lblId}\" data-property=\"{$prop}\" data-type=\"int\" data-index=\"{$index}\" data-axis=\"{$axis}\" data-lightid=\"{$light->id}\" data-lighttype=\"{$light->sort}\" autocomplete=\"off\" />
    </label>";
}

function pre(mixed $data) {
    echo '<pre>'; var_dump($data); echo '</pre>';
}