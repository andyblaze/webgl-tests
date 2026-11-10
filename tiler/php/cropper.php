<?php

class Cropper {
    public static function crop(GdImage $img, int $x, int $y, int $width, int $height): GdImage|false {
        $rect = ['x'=> $x, 'y'=> $y, 'width'=> $width, 'height' => $height];
        return imagecrop($img, $rect);        
    }
    public static function cropauto(GdImage $img, int $mode = IMG_CROP_DEFAULT, float $threshold = 0.5, int $color = -1): GdImage|false {
        return imagecropauto($img, $mode, $threshold, $color);
    }
}