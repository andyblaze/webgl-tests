<?php

class Cropper {
    public static function crop(GdImage $img, int $x, int $y, int $width, int $height): GdImage|false {
        $rect = ['x'=> $x, 'y'=> $y, 'width'=> $width, 'height' => $height];
        return imagecrop($img, $rect);        
    }
}