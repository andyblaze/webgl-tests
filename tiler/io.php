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
    public static function createfrom(string $file): array {
        $result = ['img'=>false, 'ext'=>'', 'w'=>0, 'h'=>0, 'ok'=>false];

        if ( file_exists($file) ) {
            $result['ext'] = self::ext($file);
            $sz = getimagesize($file);
            $result['w'] = $sz[0];
            $result['h'] = $sz[1];
        
            if ( $result['ext'] === 'png' )
                $result['img'] = imagecreatefrompng($file);
            if ( $result['ext'] === 'jpg' || $result['ext'] === 'jpeg' )
                $result['img'] = imagecreatefromjpeg($file);
            if ( false !== $result['img'] && $result['w'] > 0 && $result['h'] > 0 )
                $result['ok'] = true;
        }
        return $result;
    }
}
