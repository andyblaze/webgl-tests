<?php 

class Copier {
    private static function getSrc(array|object $src): array {
        ['x' => $sx, 'y' => $sy, 'w' => $sw, 'h' => $sh] = (array)$src;
        return [$sx, $sy, $sw, $sh];
    }
    private static function getDest(array|object $dst, bool $extended=false): array {
        if ( true === $extended ) {
            ['x' => $dx, 'y' => $dy, 'w' => $dw, 'h' => $dh] = (array)$dst;
            return [$dx, $dy, $dw, $dh];
        }
        ['x' => $dx, 'y' => $dy] = (array)$dst;
        return [$dx, $dy];
    }
    public static function resampled(GdImage $dstImg, GdImage $srcImg, array|object $src, array|object $dst): void {

        [$sx, $sy, $sw, $sh] = self::getSrc($src);
        [$dx, $dy, $dw, $dh] = self::getDest($dst, true);

        imagecopyresampled($dstImg, $srcImg, $dx, $dy, $sx, $sy, $dw, $dh, $sw, $sh);
    }
    public static function copy(GdImage $dstImg, GdImage $srcImg, array|object $src, array|object $dst): void {

        [$sx, $sy, $sw, $sh] = self::getSrc($src);
        [$dx, $dy] = self::getDest($dst);

        imagecopy($dstImg, $srcImg, $dx, $dy, $sx, $sy, $sw, $sh);        
    }
    public static function copymerge(GdImage $dstImg, GdImage $srcImg, array|object $src, array|object $dst, int $pct): void {

        [$sx, $sy, $sw, $sh] = self::getSrc($src);
        [$dx, $dy] = self::getDest($dst);

        imagecopymerge($dstImg, $srcImg, $dx, $dy, $sx, $sy, $sw, $sh, $pct);        
    }
    public static function copymergegray(GdImage $dstImg, GdImage $srcImg, array|object $src, array|object $dst, int $pct): void {

        [$sx, $sy, $sw, $sh] = self::getSrc($src);
        [$dx, $dy] = self::getDest($dst);

        imagecopymergegray($dstImg, $srcImg, $dx, $dy, $sx, $sy, $sw, $sh, $pct);        
    }
}
