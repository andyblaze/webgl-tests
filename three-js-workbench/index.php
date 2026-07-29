<?php 

include('php/utils.php');
$data = [
    'css' => link_tag('css/sys.css')
];

extract($data);

include('php/view.php');