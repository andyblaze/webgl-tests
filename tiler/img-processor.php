<?php 

require_once(__DIR__ . '/utils.php');

require_these([
    'color-gd',
    'io',
    'input',
    'copier',
    'cropper',
    'tiling',
    'image-gd'
]);

$tiling = new Tiling();

$upload = Input::file('image');
$method = Input::post('method');

$im1 = new ImageGd();
$im1->loadFile($upload->tmp_name);
$im2 = new ImageGd($im1->width, $im1->height, 'png');
$im1->grayscale();
$srcSz = rect(0, 0, 512, 512);
$destSz = rect(0, 0, 512, 512);
$im1->resampleTo($im2, $srcSz, $destSz);

switch ($method) {
    case 'mirror' : $tiling->mirror($im1, $im2);
    break;

    case 'matchEdges' : $tiling->matchEdges($im2, 64);
    break;

    case 'offsetAndBlend' : $tiling->offsetAndBlend($im1, $im2, 64);
    break;
}

$im2->toBrowser();
$im2->clear();

/* 
$col = new ColorGd();

[$r, $g, $b] = $im1->allocateThese('#ff0000', '#00ff00', '#0000ff');
$gaussian = [[1.0, 2.0, 1.0], [2.0, 4.0, 2.0], [1.0, 2.0, 1.0]];

$im2->fill(1, 1, $b);
$im1->fill(2, 2, $r)
    ->rotate(23, $g)
    ->crop(0, 0, 220, 220)
    ->convolution($gaussian, 128, 0)
    ->mirror()
    ->scale(380, 380)
    ->flip();
for ( $i = 0; $i < 100; $i++ ) {
    $col->set(mt_rand(0, 255), mt_rand(0, 255), mt_rand(0, 255));
    $t = $im1->colorallocate($col);
    $im1->setpixel(mt_rand(10, 110), mt_rand(10, 110), $t);
}
$srcSz = rect(10, 10, 120, 120);
$destSz = rect(0, 0, 280, 280);
$im1->resampleTo($im2, $srcSz, $destSz);
$srcSz = rect(10, 10, 80, 80);
$destSz = rect(380, 380);
$im1->copymergegrayTo($im2, $srcSz, $destSz, 85);
$im2->toBrowser();
$im1->clear();
$im2->clear();*/
