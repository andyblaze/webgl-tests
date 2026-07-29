<?php 

include('php/utils.php');
$data = [
    'css' => link_tag('css/sys.css')
];

$html = file_get_contents('php/view.html');

foreach ( $data as $key=>$val ) {
    $html = str_replace('{{' . $key . '}}', $val, $html);
}

echo $html;