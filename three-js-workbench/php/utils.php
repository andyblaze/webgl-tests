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

        $tagOpen = "\n<label class=\"{$type}-ctrl\">
                    {$lbl}: <span id=\"{$name}-lbl\">{$val}</span>";

        $ctrl = "\n<input type=\"{$type}\" id=\"{$name}\" value=\"{$val}\" data-label=\"{$name}-lbl\" data-property=\"{$prop}\" autocomplete=\"off\"";

        $tagClose = " /></label>\n";
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
    public function associative(string $key, object $item, string $index, bool $hasImage) {
        $img = $imgData = '';
        if ( true === $hasImage ) {
            $img = "<img id=\"{$key}-img\" class=\"assoc-img\" src=\"\" />";
            $imgData = " data-mapsrc=\"\" data-img=\"{$key}-img\"";
        }
        return "{$img}<label class=\"assoc\">
            <span id=\"{$key}-lbl\"></span>
            <input type=\"range\" min=\"0\" step=\"1\" value=\"0\" class=\"associative\" data-lbl=\"{$key}-lbl\" data-assoc=\"{$key}s\" data-property=\"{$key}\" data-type=\"{$item->type}\" data-index=\"{$index}\" autocomplete=\"off\"{$imgData} />        
        </label>";
    }
    public function lightColor(string $name, object $light, string $index, $property='', $prefix='color-') {
        list($tagOpen, $ctrl, $tagClose) = $this->html('color', $light->color, $name, $property, $prefix);

        $ctrl .=  " data-type=\"color\" data-index=\"{$index}\" data-lightid=\"{$light->id}\" data-lighttype=\"{$light->sort}\"";
        return $tagOpen . $ctrl . $tagClose;
    }
    public function lightSlider(string $name, object $light, string $index, $property='', $prefix='') {
        list($tagOpen, $ctrl, $tagClose) = $this->html('range', $light->intensity, $name, $property, $prefix);
        $ctrl .=  " data-type=\"int\" data-index=\"{$index}\" data-lightid=\"{$light->id}\" data-lighttype=\"{$light->sort}\" min=\"0\" max=\"5\" step=\"1\"";
        return $tagOpen . $ctrl . $tagClose;
    }
    public function lightPos(string $name, object $light, string $axis, int $key, string $index, $property='', $prefix='') {
        list($lbl, $prop, $name) = $this->saneItems($name, $property, $prefix);
        $name .= $key;
        $val = $light->pos->{$axis};
        $lblId = "{$axis}{$key}-lbl";
        return "\n<label>
            {$lbl}: <span id=\"{$lblId}\">{$light->pos->x}</span> 
            <input type=\"range\" id=\"{$name}-slider\" min=\"-20\" max=\"20\" step=\"1\" value=\"{$val}\" data-label=\"{$lblId}\" data-property=\"{$prop}\" data-type=\"int\" data-index=\"{$index}\" data-axis=\"{$axis}\" data-lightid=\"{$light->id}\" data-lighttype=\"{$light->sort}\" autocomplete=\"off\" />
        </label>\n";
    }
}

class ControlsBuilder {
    private ?Controls $controls = null;
    public function __construct(object $controls) {
        $this->controls = $controls;
    }
    public function build(array $ctrls, string $index) {
        $html = '';
        foreach ( $ctrls as $ctrlSet ) { 
            $wrapTagOpen = $wrapTagClose = '';
            if ( $ctrlSet->wrapping === true ) {
                $wrapTagOpen = "<div class=\"{$ctrlSet->wrapClass}\">";
                $wrapTagClose = '</div>';
            }
            $html .= $wrapTagOpen;
            foreach ( $ctrlSet->controls as $key=>$val ) {
                if ( $val->ctrl === "range" )
                    $html .= $this->controls->slider($key, $val, $index);
                if ( $val->ctrl === "color" )
                    $html .= $this->controls->colorPicker($key, $val, $index);  
                if ( $val->ctrl === "assoc" )
                    $html .= $this->controls->associative($key, $val, 'maps', true);                     
            }
            $html .= $wrapTagClose;
        }
        return $html;       
    }
    public function buildLights(array $lights) {
        $html = '';
        foreach ( $lights as $key=>$light ) {
            $html .= '<div class="col-2">' .
                $this->controls->lightColor($light->sort . $key, $light, 'lights', 'color') . 
                $this->controls->lightSlider($light->sort . $key, $light, 'lights', 'intensity') . 
            '</div>';

            if ( isset($light->pos) ) {
                $html .= '<div class="col-3">' . 
                    $this->controls->lightPos($light->sort, $light, 'x', $key, 'lights', 'pos') . 
                    $this->controls->lightPos($light->sort, $light, 'y', $key, 'lights', 'pos') . 
                    $this->controls->lightPos($light->sort, $light, 'z', $key, 'lights', 'pos') . 
                '</div>';
            }
        }
        return $html;
    }
}

function pre(mixed $data) {
    echo '<pre>'; var_dump($data); echo '</pre>';
}