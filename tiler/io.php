<?php 

class IO {
    private static array $validExts = ['png', 'jpg', 'jpeg'];
    private static function ext(string $fname): string {
        $ext = strtolower(pathinfo($fname, PATHINFO_EXTENSION));
        if ( false === in_array($ext, self::$validExts) ) return false;
        if ( $ext === 'jpeg' )
            $ext = 'jpg';
        return $ext;
    }
    private static function hdr(string $type): void {
        header('Content-Type: image/' . $type);
    }
    public static function save(GdImage $img, string $file): bool {
        $ext = self::ext($file);
        if ( $ext === 'png' )
            return imagepng($img, $file);
        if ( $ext === 'jpg' )
            return imagejpeg($img, $file);
        return false;
    }
    public static function toBrowser(GdImage $img, string $type) {
        $ext = self::ext($type);
        if ( $ext === 'png' ) {
            self::hdr('png');
            return imagepng($img);
        }
        if ( $ext === 'jpg' ) {
            self::hdr('jpeg');
            return imagejpeg($img);
        }
        return false;
    }
    public static function createfrom(string $file): array {
        $result = ['img'=>false, 'ext'=>'', 'w'=>0, 'h'=>0, 'ok'=>false, 'errors'=>[]];

        if ( file_exists($file) ) {
            $ext = self::ext($file);
            if ( false === $ext )
                $result['errors'][] = "Wrong file type: {$ext}";

            $result['ext'] = $ext;

            $sz = getimagesize($file);
            if ( false === $sz )
                $result['errors'][] = 'Cannot get image size';
            else {
                $w = $sz[0];
                $h = $sz[1];

                if ( $w === 0 || $h === 0 ) 
                    $result['errors'][] = 'An image dimension is zero';

                    $result['w'] = $w;
                    $result['h'] = $h;  
            } 

            if ( count($result['errors']) > 0 )
                array_unshift($result['errors'], "IO::createfrom({$file})");

            if ( $ext === 'png' )
                $result['img'] = imagecreatefrompng($file);
            if ( $ext === 'jpg' )
                $result['img'] = imagecreatefromjpeg($file);

            if ( false !== $result['img'] && count($result['errors']) === 0 ) {
                $result['ok'] = true;
            }
        }
        $result['errors'] = implode(', ', $result['errors']);
        return $result;
    }
}
