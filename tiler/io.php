<?php 

class IO {
    private static function ext(string $fname): string {
        return strtolower(pathinfo($fname, PATHINFO_EXTENSION));
    }
    private static function hdr(string $type): void {
        header('Content-Type: image/' . $type);
    }
    public static function save(GdImage $img, string $file): bool {
        $ext = self::ext($file);
        if ( $ext === 'png' )
            return imagepng($img, $file);
        if ( $ext === 'jpg' || $ext === 'jpeg' )
            return imagejpeg($img, $file);
        return false;
    }
    public static function toBrowser(GdImage $img, string $type) {
        if ( $type === 'png' ) {
            self::hdr('png');
            return imagepng($img);
        }
        if ( $type === 'jpg' || $type === 'jpeg' ) {
            self::hdr('jpeg');
            return imagejpeg($img);
        }
        return false;
    }
    public static function createfrom(string $file): GdImage|false {
        $ext = self::ext($file);
        if ( $ext === 'png' )
            return imagecreatefrompng($file);
        if ( $ext === 'jpg' || $ext === 'jpeg' )
            return imagecreatefromjpeg($file);
        return false;
    }
}
