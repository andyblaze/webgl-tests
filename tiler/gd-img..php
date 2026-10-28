<?php 

class ColorGd {
    public int $r = 0;
    public int $g = 0;
    public int $b = 0;
    public int $a = 0;
    public function __construct(int $r=0, int $g=0, int $b=0, int $a=0) {
        $this->r = $r;
        $this->g = $g;
        $this->b = $b;
        $this->a = $a;
    }
    public function fromHex(string $hex) {
        if ( strpos($hex, '#') !== false )
            $hex = str_replace($hex, '#', '');
        $rgba = chunk_split($hex, 2, "\n");
        $rgba = explode("\n", $rgba);
        $this->r = intval($rgba[0]);
        $this->g = intval($rgba[1]);
        $this->b = intval($rgba[2]);
        if ( count($rgba) === 4 )
            $this->a = intval($rgb[3]);
    }
}

class ImageGd {
    private int $width = 0;
    private int $height = 0;
    private bool $alphaBlend = false;
    private bool $antiAlias = false;
    private bool $saveAlpha = false;
    private GdImage|false $img = false; 

    public function __construct(int $w=0, int $h=0) {
        if ( $w > 0 && $h > 0 )
            $this->create($w, $h);
    }
    public function __get(string $name): mixed {
        $this->requireImage();
        return match ($name) {
            'width'  => $this->width,
            'height' => $this->height,
            'gd'     => $this->img,
            default  => throw new LogicException("Unknown property: {$name}")
        };
    }
    public function setPngAlpha(): self {
        $this->alphaBlend(false);
        $this->saveAlpha(true);
        return $this;
    }
    public function alphablend(bool $enable): self {
        $this->requireImage();
        imagealphablending($this->img, $enable);
        $this->alphaBlend = $enable;
        return $this;
    }
    public function savealpha(bool $enable): self {
        $this->requireImage();
        imagesavealpha($this->img, $enable);
        $this->saveAlpha = $enable;
        return $this;
    }
    public function antialias(bool $enable): self {
        $this->requireImage();
        imageantialias($this->img, $enable);
        $this->antiAlias = $enable;
        return $this;
    }
    public function colorallocate(ColorGd $c) {
        return imagecolorallocate($this->img, $c->r, $c->g, $c->b);
    }
    public function colorallocatealpha(ColorGd $c) {
        return imagecolorallocatealpha($this->img, $c->r, $c->g, $c->b, $c->a);
    }
    public function colorat(int $x, int $y): int|false {
        $this->requireImage();
        return imagecolorat($this->img, $x, $y);
    }
    public function colorclosest(int $r, int $g, int $b): int {
        $this->requireImage();
        return imagecolorclosest($this->img, $r, $g, $b);
    }
    public function colorclosestalpha(int $r, int $g, int $b, int $a): int {
        $this->requireImage();
        return imagecolorclosestalpha($this->img, $r, $g, $b, $a);
    }
    public function copyresampled(GdImage $dstImg, array|object $src, array|object $dst): self {
        $this->requireImage();

        ['x' => $sx, 'y' => $sy, 'w' => $sw, 'h' => $sh] = (array)$src;
        ['x' => $dx, 'y' => $dy, 'w' => $dw, 'h' => $dh] = (array)$dst;

        imagecopyresampled($dstImg, $this->img, $dx, $dy, $sx, $sy, $dw, $dh, $sw, $sh);
        return $this;
    }
    public function crop(array $rect): self {
        $this->requireImage();
        $img = imagecrop($this->img, $rect);
        return $this->setImg($img, 'ImageGd->crop($rect) failed: ' . json_encode($rect));
    }
    public function scale(int $w, int $h, int $mode=IMG_BILINEAR_FIXED): self {
        $this->requireImage();
        $img = imagescale($this->img, $w, $h, $mode);
        return $this->setImg($img, "imageGd->scale({$w}, {$h}, {$mode}) failed.");
    }
    public function create(int $w, int $h): self {
        $img = imagecreatetruecolor($w, $h);
        return $this->setImg($img, "imageGd->create({$w}, {$h}) failed.");
    }
    public function filter(int $filter, array|int|float|bool ...$args): self {
        $this->requireImage();
        if( $this->img && imagefilter($this->img, $filter, $args) )
            return $this;
        else
            throw new LogicException('imageGd->filter($filter, $args) failed.');
    }
    public function flip(int $mode=IMG_FLIP_VERTICAL): self {
        $this->requireImage();
        imageflip($this->img, $mode);
        return $this;
    }
    public function mirror(): self {
        return $this->flip(IMG_FLIP_HORIZONTAL);
    }
    public function flipBoth(): self {
        return $this->flip(IMG_FLIP_BOTH);
    }
    public function grayscale() {
        $this->requireImage();
        return $this->filter(IMG_FILTER_GRAYSCALE);
    }
    private function setImg(GdImage|false $img, string $error): self {
        if (false === $img)
            throw new ErrorException($error);
        $this->img = $img;
        $this->width = imagesx($img);
        $this->height = imagesy($img);
        return $this;
    }
    private function requireImage(): void {
        if ( false === $this->img ) 
            throw new LogicException('Image has not been created: Use ImageGd->create($w, $h)');
    }
}
