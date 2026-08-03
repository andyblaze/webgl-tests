<?php

define('IN_PRODUCTION', false);

define('BASE_URL', (IN_PRODUCTION === true ? 'https://mediagraphic.co.uk/particle-workspace/' : 'http://127.0.0.1/_webgl-tests/three-js-workbench/'));

function url($u='') {
    return BASE_URL . $u;
}

function link_tag(string $cssFile) {
    return '<link rel="stylesheet" href="' . url($cssFile) . '" type="text/css">' . PHP_EOL;
}

function meta(string $name, string $content) {
    return "<meta name=\"{$name}\" content=\"{$content}\">\n";
}

function meta_prop(string $prop, string $content) {
    return "<meta property=\"{$prop}\" content=\"{$content}\">\n";
}

class Controls {
    public function __construct() {}
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

        $ctrl = "\n<input type=\"{$type}\" id=\"{$name}\" value=\"{$val}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" autocomplete=\"off\"";

        $tagClose = ' /></label>';
        return [$tagOpen, $ctrl, $tagClose];
    }
    public function slider(string $name, object $item, string $index, $property='', $prefix='') {
        $min  = $item->min  ?? 0;
        $max  = $item->max  ?? 1;
        $step = $item->step ?? 0.01;
        list($tagOpen, $ctrl, $tagClose) = $this->html('range', $item->value, $name, $property, $prefix);
        $ctrl .=  " data-type=\"{$item->type}\" data-index=\"{$index}\" min=\"{$min}\" max=\"{$max}\" step=\"{$step}\"";
        return $tagOpen . $ctrl . $tagClose;
    }
    public function colorPicker(string $name, object $item, string $index, $property='', $prefix='') {
        list($tagOpen, $ctrl, $tagClose) = $this->html('color', $item->value, $name, $property, $prefix);
        $ctrl .=  " data-type=\"{$item->type}\" data-index=\"{$index}\"";
        return $tagOpen . $ctrl . $tagClose;
    }
    public function lightColor(string $name, object $light, string $index, $property='', $prefix='color-') {
        list($tagOpen, $ctrl, $tagClose) = $this->html('color', $light->color, $name, $property, $prefix);

        $ctrl .=  " data-type=\"str\" data-index=\"{$index}\" data-lightid=\"{$light->id}\" data-lighttype=\"{$light->sort}\"";
        return $tagOpen . $ctrl . $tagClose;
    }
    public function lightSlider(string $name, object $light, string $index, $property='', $prefix='') {
        list($tagOpen, $ctrl, $tagClose) = $this->html('range', $light->intensity, $name, $property, $prefix);
        $ctrl .=  " data-type=\"int\" data-index=\"{$index}\" data-lightid=\"{$light->id}\" data-lighttype=\"{$light->sort}\" min=\"0\" max=\"5\" step=\"0.5\"";
        return $tagOpen . $ctrl . $tagClose;
    }
    public function lightPos(string $name, object $light, string $axis, int $key, string $index, $property='', $prefix='') {
        list($lbl, $prop, $name) = $this->saneItems($name, $property, $prefix);
        $name .= $key;
        $val = $light->pos->{$axis};
        $lblId = "{$axis}{$key}-lbl";
        return "<label>
            {$lbl}: <span id=\"{$lblId}\">{$light->pos->x}</span> 
            <input type=\"range\" id=\"{$name}-slider\" min=\"-10\" max=\"10\" step=\"1\" value=\"{$val}\" data-label=\"{$lblId}\" data-property=\"{$prop}\" data-type=\"int\" data-index=\"{$index}\" data-axis=\"{$axis}\" data-lightid=\"{$light->id}\" data-lighttype=\"{$light->sort}\" autocomplete=\"off\" />
        </label>";
    }
}

function pre(mixed $data) {
    echo '<pre>'; var_dump($data); echo '</pre>';
}