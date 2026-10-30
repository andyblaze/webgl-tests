<?php 

require_once(__DIR__ . '/utils.php');

require_these([
    'color-gd',
    'output',
    'copier',
    'cropper',
    'image-gd'
]);

$im1 = new ImageGd(256, 256);
$im2 = new ImageGd(256, 256);
$col = new ColorGd();
$col->fromHex('#ff0000');
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
$srcSz = rect(10, 10, 120, 120);
$destSz = rect(0, 0, 180, 180);
$im1->resampleTo($im2, $srcSz, $destSz);
$srcSz = rect(10, 10, 80, 80);
$destSz = rect(180, 180);
$im1->copyTo($im2, $srcSz, $destSz);
$im2->toBrowser();
$im1->clear();
$im2->clear();