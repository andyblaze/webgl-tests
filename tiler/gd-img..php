<?php 

class ImageGd {
    private int $width = 0;
    private int $height = 0;
    private bool $alphaBlend = false;
    private bool $antiAlias = false;
    private GdImage|false $img = false; 

    public function __construct(int $w=0, int $h=0) {
        if ( $w > 0 && $h > 0 )
            $this->create($w, $h);
    }
    public function __get(string $name): mixed {
        return match ($name) {
            'width'  => $this->width,
            'height' => $this->height,
            'gd'     => $this->img,
            default  => null,
        };
    }
    public function alphablend(bool $enable): self {
        imagealphablending($this->img, $enable);
        $this->alphaBlend = $enable;
        return $this;
    }
    public function antialias(bool $enable): self {
        imageantialias($this->img, $enable);
        $this->antiAlias = $enable;
        return $this;
    }
    public function colorat(int $x, int $y): int|false {
        return imagecolorat($this->img, $x, $y);
    }
    public function colorclosest(int $r, int $g, int $b): int {
        return imagecolorclosest($this->img, $r, $g, $b);
    }
    public function colorclosestalpha(int $r, int $g, int $b, int $a): int {
        return imagecolorclosestalpha($this->img, $r, $g, $b, $a);
    }
    public function crop(array $rect): self {
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
    public function create(int $w, int $h): self {
        $this->img = imagecreatetruecolor($w, $h);
        if ( false === $this->img ) 
            throw new ErrorException("imageGd->create({$w}, {$h}) failed.");
        $this->width = $w;
        $this->height = $h;
        return $this;
    }
    private function requireImage(): GdImage {
        if ( !$this->img instanceof GdImage ) 
            throw new LogicException('Image has not been created.');
        return $this->img;
    }
}
