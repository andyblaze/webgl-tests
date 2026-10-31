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
        $result = ['img'=>false, 'ext'=>'', 'w'=>0, 'h'=>0, 'ok'=>false, 'errors'=>[]];

        if ( file_exists($file) ) {
            $ext = self::ext($file);
            if ( false === in_array($ext, ['png', 'jpg', 'jpeg']) )
                $result['errors'][] = 'Wrong file type: '. $ext;

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

            if ( $ext === 'png' )
                $result['img'] = imagecreatefrompng($file);
            if ( $ext === 'jpg' || $ext === 'jpeg' )
                $result['img'] = imagecreatefromjpeg($file);

            if ( false !== $result['img'] || count($result['errors']) > 0 ) {
                $result['ok'] = true;
            }
        }
        $result['errors'] = implode(', ', $result['errors']);
        return $result;
    }
}
