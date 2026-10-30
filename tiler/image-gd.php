<?php 

class ImageGd {
    private int $width = 0;
    private int $height = 0;
    private bool $alphaBlend = false;
    private bool $antiAlias = false;
    private bool $saveAlpha = false;
    private string $format = '';
    private GdImage|false|null $img = false; 

    public function __construct(int $w=0, int $h=0, string $f='png') {
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
    public function setFormat(string $f): self {
        $this->format = $f;
        return $this;
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
    public function clear(): self {
        $this->img = null;
        $this->width = $this->height = 0;
        $this->alphaBlend = $this->saveAlpha = $this->antiAlias = false;
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
    public function resampleTo(ImageGd $dstImg, array|object $src, array|object $dst): self {
        $this->requireImage();
        Copier::resampled($dstImg->gd, $this->img, $src, $dst);
        return $this;
    }
    public function copyTo(ImageGd $dstImg, array|object $src, array|object $dst): self {
        $this->requireImage();
        Copier::copy($dstImg->gd, $this->img, $src, $dst);
        return $this;
    }
    public function crop(int $x, int $y, int $width, int $height): self {
        $this->requireImage();
        /*$rect = ['x'=> $x, 'y'=> $y, 'width'=> $width, 'height' => $height];
        $img = imagecrop($this->img, $rect);*/
        $img = Cropper::crop($this->img, $x, $y, $width, $height);
        return $this->setImg($img, 'ImageGd->crop($rect) failed: ' . json_encode($rect));
    }
    public function scale(int $w, int $h, int $mode=IMG_BILINEAR_FIXED): self {
        $this->requireImage();
        $img = imagescale($this->img, $w, $h, $mode);
        return $this->setImg($img, "imageGd->scale({$w}, {$h}, {$mode}) failed.");
    }
    public function create(int $w, int $h, string $f='png'): self {
        $this->setFormat($f);
        $img = imagecreatetruecolor($w, $h);
        return $this->setImg($img, "imageGd->create({$w}, {$h}) failed.");
    }
    public function createfrom(string $file): self {
        $this->img = Output::createfrom($file);
        return $this;
    }
    public function fill(int $x, int $y, int $color): self {
        imagefill($this->img, $x, $y, $color);
        return $this;
    }
    public function filter(int $filter, array|int|float|bool ...$args): self {
        $this->requireImage();

        if ( !imagefilter($this->img, $filter, ...$args) ) {
            throw new LogicException('Image filter failed.');
        }
        return $this;
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
    public function getSize(): array {
        return ['w'=>$this->width, 'h'=>$this->height];
    }
    public function grayscale() {
        $this->requireImage();
        return $this->filter(IMG_FILTER_GRAYSCALE);
    }
    public function rotate(float $angle, int $bgColor): self {
        $this->requireImage();
        $img = imagerotate($this->img, $angle, $bgColor);
        return $this->setImg($img, "ImageGd::rotate({$angle}) failed.");
    }
    public function saveAs(string $file): self {
        $this->requireImage();
        if ( false === Output::save($this->img, $file) )
            throw new LogicException("ImageGd->saveAs({$file}) failed.");
        return $this;
    }
    public function setpixel(int $x, int $y, int $color): self {
        imagesetpixel($this->img, $x, $y, $color);
        return $this;
    }
    public function toBrowser(): self {
        Output::toBrowser($this->img, $this->format);
        return $this;
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
        if ( false === $this->img || null === $this->img ) 
            throw new LogicException('Image has not been created: Use ImageGd->create($w, $h)');
    }
}
