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