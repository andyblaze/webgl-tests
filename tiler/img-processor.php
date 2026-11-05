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

function blendSeam(GdImage $image, int $bandWidth, string $mode): void {
    $width = imagesx($image);
    $height = imagesy($image);

    if (!in_array($mode, ['H', 'V'], true))
        throw new InvalidArgumentException('Invalid blend mode');

    $horizontal = $mode === 'H';

    $middle = intdiv($horizontal ? $height : $width, 2);
    $length = $horizontal ? $width : $height;

    for ($d = $bandWidth - 1; $d >= 0; $d--) {

        $u = ($bandWidth - 1 - $d) / max(1, $bandWidth - 1);

        // Smoothstep interpolation
        $t = 0.5 * ($u * $u * (3 - 2 * $u));

        $a = $middle - 1 - $d;
        $b = $middle + $d;

        for ($i = 0; $i < $length; $i++) {

            $x1 = $horizontal ? $i : $a;
            $y1 = $horizontal ? $a : $i;

            $x2 = $horizontal ? $i : $b;
            $y2 = $horizontal ? $b : $i;

            $p1 = (imagecolorat($image, $x1, $y1) >> 16) & 0xFF;
            $p2 = (imagecolorat($image, $x2, $y2) >> 16) & 0xFF;

            $new1 = (int) round($p1 * (1 - $t) + $p2 * $t);
            $new2 = (int) round($p2 * (1 - $t) + $p1 * $t);

            $c1 = imagecolorallocate($image, $new1, $new1, $new1);
            $c2 = imagecolorallocate($image, $new2, $new2, $new2);

            imagesetpixel($image, $x1, $y1, $c1);
            imagesetpixel($image, $x2, $y2, $c2);
        }
    }
}

$tiling = new Tiling();

$upload = Input::file('image');

$im1 = new ImageGd();
$im1->loadFile($upload->tmp_name);
$im2 = new ImageGd($im1->width, $im1->height, 'png');
$im1->grayscale();

$tiling->quadrantize($im1, $im2);
blendSeam($im2->gd, 64, 'H');
blendSeam($im2->gd, 64, 'V');

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
