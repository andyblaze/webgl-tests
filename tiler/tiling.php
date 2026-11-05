<?php 

class Tiling {
    public function __construct() {

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
}
