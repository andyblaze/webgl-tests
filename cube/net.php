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

///$json = '{"image":"s5.jpg","top":{"x":811,"y":863,"w":811,"h":811},"center":{"x":811,"y":1674,"w":811,"h":811},"bottom":{"x":811,"y":2485,"w":811,"h":811},"extension":{"x":811,"y":3296,"w":811,"h":811},"left":{"x":0,"y":1674,"w":811,"h":811},"right":{"x":1622,"y":1674,"w":811,"h":811}}';

$json = (object)json_decode($json);

$imgIn = imagecreatefromjpeg($json->image);
unset($json->image);
foreach( $json as $face=>$coords )
    crop($imgIn, 's', $coords, $face);
imagedestroy($imgIn);
