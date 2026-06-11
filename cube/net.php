<?php 

function pre($data) {
    echo '<pre>'; var_dump($data); echo '</pre>';
}

function crop($src, $dest, $coords, $face) {
    if ( ! is_dir($dest) )
        mkdir($dest);
    $fname = substr($face, 0, 1) . '.jpg';
    $img = imagecreatetruecolor($coords->w, $coords->h);

    imagecopy($img, $src, 0, 0, $coords->x, $coords->y, $coords->w, $coords->h);

    imagejpeg($img, $dest . '/' . $fname);
    imagedestroy($img);
}

$json = file_get_contents('php://input');

$json = (object)json_decode($json);

$imgIn = imagecreatefromjpeg($json->image);
unset($json->image);
foreach( $json as $face=>$coords )
    crop($imgIn, 's', $coords, $face);
imagedestroy($imgIn);
