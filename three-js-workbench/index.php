<?php 
include('php/utils.php');

$ctrlsCfg = json_decode(file_get_contents('ctrls-config.json'));
$ctrls = '';
foreach ( $ctrlsCfg->material as $key=>$val ) {
    if ( $val->ctrl === "range" )
        $ctrls .= slider($key, $val);
    if ( $val->ctrl === "color" )
        $ctrls .= colorPicker($key, $val);
}

$data = [
    'css' => link_tag('css/sys.css'),
    'ctrls' => $ctrls
];

$html = file_get_contents('php/view.html');

foreach ( $data as $key=>$val ) {
    $html = str_replace('{{' . $key . '}}', $val, $html);
}

echo $html;