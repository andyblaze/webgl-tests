<?php 

require_once(__DIR__ . '/utils.php');

require_these([
    'color-gd',
    'io',
    'input',
    'copier',
    'cropper',
    'image-gd'
]);

class Tiling {
    public function __construct() {

    }
    public function quadrantize(ImageGd $im1, ImageGd $im2): void {
        $w = $im1->width;
        $h = $im1->height; 

        $halfW = $w / 2;
        $halfH =  $h / 2;

        $srcSz = rect(0, 0, $halfW, $halfH);
        $destSz = rect($halfW, $halfH);
        $im1->copyTo($im2, $srcSz, $destSz);

        $srcSz = rect($halfW, 0, $halfW, $halfH);
        $destSz = rect(0, $halfH);
        $im1->copyTo($im2, $srcSz, $destSz);

        $srcSz = rect(0, $halfH, $halfW, $halfH);
        $destSz = rect($halfW, 0);
        $im1->copyTo($im2, $srcSz, $destSz);

        $srcSz = rect($halfW, $halfH, $halfW, $halfH);
        $destSz = rect(0, 0);
        $im1->copyTo($im2, $srcSz, $destSz);
    }
}

$tiling = new Tiling();

$upload = Input::file('image');

$im1 = new ImageGd();
$im1->loadFile($upload->tmp_name);

/*$w = $im1->width;
$h = $im1->height; 

$halfW = $w / 2;
$halfH =  $h / 2;*/

$im2 = new ImageGd($im1->width, $im1->height, 'png');

$tiling->quadrantize($im1, $im2);

/*$srcSz = rect(0, 0, $halfW, $halfH);
$destSz = rect($halfW, $halfH);
$im1->copyTo($im2, $srcSz, $destSz);

$srcSz = rect($halfW, 0, $halfW, $halfH);
$destSz = rect(0, $halfH);
$im1->copyTo($im2, $srcSz, $destSz);

$srcSz = rect(0, $halfH, $halfW, $halfH);
$destSz = rect($halfW, 0);
$im1->copyTo($im2, $srcSz, $destSz);

$srcSz = rect($halfW, $halfH, $halfW, $halfH);
$destSz = rect(0, 0);
$im1->copyTo($im2, $srcSz, $destSz);*/

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
