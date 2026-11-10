<?php 

class IO {
    private static array $validExts = ['png', 'jpg', 'jpeg', 'tmp'];
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
        if ( false === in_array($type, self::$validExts) ) return false;
        if ( $type === 'png' ) {
            self::hdr('png');
            return imagepng($img);
        }
        if ( $type === 'jpg' ) {
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

            $sz = getimagesize($file);
            if ( false === $sz )
                $result['errors'][] = 'Cannot get image size';
            else {
                $result['w'] = $sz[0];
                $result['h'] = $sz[1]; 
            } 

            if ( count($result['errors']) > 0 )
                array_unshift($result['errors'], "IO::createfrom({$file})");

            if ($sz[2] === IMAGETYPE_PNG) {
                $result['img'] = imagecreatefrompng($file);
                $result['ext'] = 'png';
            }

            if ($sz[2] === IMAGETYPE_JPEG) {
                $result['img'] = imagecreatefromjpeg($file);
                $result['ext'] = 'jpg';
            }

            if ( false !== $result['img'] && count($result['errors']) === 0 ) {
                $result['ok'] = true;
            }
        }
        $result['errors'] = implode(', ', $result['errors']);
        return $result;
    }
}
