<?php 

require_once(__DIR__ . '/utils.php');

require_these([
    'color-gd',
    'output',
    'copier',
    'image-gd'
]);

$im1 = new ImageGd(256, 256);
$im2 = new ImageGd(256, 256);
$col = new ColorGd(255, 0, 0);
$r = $im1->colorallocate($col);
$col->set(0, 255, 0);
$g = $im1->colorallocate($col);
$col->set(0, 0, 255);
$b = $im1->colorallocate($col);
$im2->fill(1, 1, $b);
$im1->fill(2, 2, $r)
    ->rotate(23, $g)
    ->crop(2, 2, 200, 200)
    ->mirror()
    ->scale(180, 180)
    ->flip();
for ( $i = 0; $i < 100; $i++ ) {
    $col->set(mt_rand(0, 255), mt_rand(0, 255), mt_rand(0, 255));
    $t = $im1->colorallocate($col);
    $im1->setpixel(mt_rand(10, 110), mt_rand(10, 110), $t);
}
$im2Gd = $im2->gd;
$im1->copyresampled($im2Gd, ['x'=>10, 'y'=>10, 'w'=>120, 'h'=>120], ['x'=>0, 'y'=>0, 'w'=>180, 'h'=>180]);
//$im1->copy();
$im2->toBrowser('png');