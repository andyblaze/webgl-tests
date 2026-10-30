<?php 

require_once(__DIR__ . '/utils.php');

require_these([
    'color-gd',
    'output',
    'copier',
    'image-gd'
]);

$im = new ImageGd(256, 256);
$col = new ColorGd(255, 0, 0);
$red = $im->colorallocate($col);
$im->fill(2, 2, $red)
    ->grayscale()
    ->rotate(23, 56)
    ->crop(2, 2, 129, 200)
    ->mirror()
    ->scale(120, 120)
    ->flip();
$im->toBrowser('png');