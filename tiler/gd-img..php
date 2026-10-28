<?php 

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
    public function crop(array $rect): self {
        $this->requireImage();
        $img = imagecrop($this->img, $rect);
        if (false === $img) {
            $r = json_encode($rect);
            throw new ErrorException("ImageGd::crop($r) failed.");
        }
        $this->img = $img;
        $this->width = imagesx($img);
        $this->height = imagesy($img);
        return $this;
    }
    public function scale(int $w, int $h, int $mode=IMG_BILINEAR_FIXED): self {
        $this->requireImage();
        $img = imagescale($this->img, $w, $h, $mode);
        if (false === $img)
            throw new ErrorException("ImageGd::scale({$w}, {$h}, {$mode}) failed.");
        $this->img = $img;
        $this->width = imagesx($img);
        $this->height = imagesy($img);
        return $this;
    }
    public function create(int $w, int $h): self {
        $this->img = imagecreatetruecolor($w, $h);
        if ( false === $this->img ) 
            throw new ErrorException("imageGd->create({$w}, {$h}) failed.");
        $this->width = $w;
        $this->height = $h;
        return $this;
    }
    private function requireImage(): void {
        if ( false === $this->img ) 
            throw new LogicException('Image has not been created: Use ImageGd->create($w, $h)');
    }
}
