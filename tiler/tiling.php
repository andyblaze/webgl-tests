<?php 

class Tiling {
    public function __construct() {

    }
    public function mirror(ImageGd $im1, ImageGd $im2) {
        $w = $im1->width;
        $h = $im1->height;
        $doubleW = $w * 2;
        $doubleH = $h * 2;
        $im2->scale($doubleW, $doubleH);
        $src = rect(0, 0, $w, $h);
        $dests = [
            rect(0, 0, $w, $h),
            rect($w, 0, $w, $h),
            rect(0, $h, $w, $h),
            rect($w, $h, $w, $h)
        ];
        $im1->resampleTo($im2, $src, $dests[0]);
        $im1->mirror();

        $im1->resampleTo($im2, $src, $dests[1]);
        $im1->mirror()->flip();

        $im1->resampleTo($im2, $src, $dests[2]);
        $im1->mirror();

        $im1->resampleTo($im2, $src, $dests[3]);
        $im2->scale($w, $h);
    }
    public function quadrantize(ImageGd $im1, ImageGd $im2): void {
        $halfW = $im1->width / 2;
        $halfH =  $im1->height / 2;

        $srcs = [
            rect(0, 0, $halfW, $halfH),
            rect($halfW, 0, $halfW, $halfH),
            rect(0, $halfH, $halfW, $halfH),
            rect($halfW, $halfH, $halfW, $halfH)
        ];
        $dests = [
            rect($halfW, $halfH),
            rect(0, $halfH),
            rect($halfW, 0),
            rect(0, 0)
        ];

        for ( $i = 0; $i < 4; $i++ )
            $im1->copyTo($im2, $srcs[$i], $dests[$i]);
    }
    public function blendSeam(ImageGd $image, int $bandWidth, string $mode): void {
        $width = $image->width;
        $height = $image->height;

        if (!in_array($mode, ['H', 'V'], true))
            throw new InvalidArgumentException('Invalid blend mode');

        $color = new ColorGd();

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

                $p1 = ($image->colorat($x1, $y1) >> 16) & 0xFF;
                $p2 = ($image->colorat($x2, $y2) >> 16) & 0xFF;

                $new1 = (int) round($p1 * (1 - $t) + $p2 * $t);
                $new2 = (int) round($p2 * (1 - $t) + $p1 * $t);

                $color->set($new1, $new1, $new1);
                $c1 = $image->colorallocate($color);
                $color->set($new2, $new2, $new2);
                $c2 = $image->colorallocate($color);

                $image->setpixel($x1, $y1, $c1);
                $image->setpixel($x2, $y2, $c2);
            }
        }
    }
    public function offsetAndBlend(ImageGd $im1, ImageGd $im2, int $bandWidth) {
        $this->quadrantize($im1, $im2);
        $this->blendSeam($im2, $bandWidth, 'H');
        $this->blendSeam($im2, $bandWidth, 'V');
    }

    public function matchEdges(ImageGd $img, int $bandWidth): void {
        $width = $img->width;
        $height = $img->height;

        // Match left and right edges, then top and bottom.
        foreach (['H', 'V'] as $mode) {

            $horizontal = $mode === 'H';
            $length = $horizontal ? $height : $width;
            $depth  = $horizontal ? $width : $height;

            $color = new ColorGd();

            for ($d = 0; $d < $bandWidth; $d++) {

                $t = ($bandWidth === 1)
                    ? 1
                    : 0.5 * (1 - cos(M_PI * $d / ($bandWidth - 1)));

                for ($i = 0; $i < $length; $i++) {

                    $x1 = $horizontal ? $d : $i;
                    $y1 = $horizontal ? $i : $d;

                    $x2 = $horizontal ? $depth - 1 - $d : $i;
                    $y2 = $horizontal ? $i : $depth - 1 - $d;

                    $p1 = ($img->colorat($x1, $y1) >> 16) & 0xFF;
                    $p2 = ($img->colorat($x2, $y2) >> 16) & 0xFF;

                    $average = ($p1 + $p2) / 2;

                    $new1 = (int) round($p1 * (1 - $t) + $average * $t);
                    $new2 = (int) round($p2 * (1 - $t) + $average * $t);

                    $color->set($new1, $new1, $new1);
                    $c1 = $img->colorallocate($color);

                    $color->set($new2, $new2, $new2);
                    $c2 = $img->colorallocate($color);

                    $img->setpixel($x1, $y1, $c1);
                    $img->setpixel($x2, $y2, $c2);
                }
            }
        }
    }
}
