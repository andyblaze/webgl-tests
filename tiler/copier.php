<?php 

class Copier {
    public static function resampled(GdImage $dstImg, GdImage $srcImg, array|object $src, array|object $dst): void {

        ['x' => $sx, 'y' => $sy, 'w' => $sw, 'h' => $sh] = (array)$src;
        ['x' => $dx, 'y' => $dy, 'w' => $dw, 'h' => $dh] = (array)$dst;

        imagecopyresampled($dstImg, $srcImg, $dx, $dy, $sx, $sy, $dw, $dh, $sw, $sh);
    }
    public static function copy(GdImage $dstImg, GdImage $srcImg, array|object $src, array|object $dst): void {

        ['x' => $sx, 'y' => $sy, 'w' => $sw, 'h' => $sh] = (array)$src;
        ['x' => $dx, 'y' => $dy] = (array)$dst;

        imagecopy($dstImg, $srcImg, $dx, $dy, $sx, $sy, $sw, $sh);        
    }
    public static function copymerge(GdImage $dstImg, GdImage $srcImg, array|object $src, array|object $dst, int $pct): void {

        ['x' => $sx, 'y' => $sy, 'w' => $sw, 'h' => $sh] = (array)$src;
        ['x' => $dx, 'y' => $dy] = (array)$dst;

        imagecopymerge($dstImg, $srcImg, $dx, $dy, $sx, $sy, $sw, $sh, $pct);        
    }
    public static function copymergegray(GdImage $dstImg, GdImage $srcImg, array|object $src, array|object $dst, int $pct): void {

        ['x' => $sx, 'y' => $sy, 'w' => $sw, 'h' => $sh] = (array)$src;
        ['x' => $dx, 'y' => $dy] = (array)$dst;

        imagecopymergegray($dstImg, $srcImg, $dx, $dy, $sx, $sy, $sw, $sh, $pct);        
    }
}
