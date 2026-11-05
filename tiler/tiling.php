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
}
