<?php 

class Copier {
    public static function resampled(GdImage $dstImg, GdImage $srcImg, array|object $src, array|object $dst): void {

        ['x' => $sx, 'y' => $sy, 'w' => $sw, 'h' => $sh] = (array)$src;
        ['x' => $dx, 'y' => $dy, 'w' => $dw, 'h' => $dh] = (array)$dst;

        imagecopyresampled($dstImg, $srcImg, $dx, $dy, $sx, $sy, $dw, $dh, $sw, $sh);
    }
    public static function copy(GdImage $dstImg, GdImage $srcImg, array|object $src, array|object $dst): void {

        ['x' => $sx, 'y' => $sy, 'w' => $sw, 'h' => $sh] = (array)$src;
        ['x' => $dx, 'y' => $dy, 'w' => $dw, 'h' => $dh] = (array)$dst;

        imagecopy($dstImg, $srcImg, $dx, $dy, $sx, $sy, $sw, $sh);        
    }
}
