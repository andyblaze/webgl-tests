<?php 
class ColorGd {
    public int $r = 0;
    public int $g = 0;
    public int $b = 0;
    public int $a = 0;
    public function __construct(int $r=0, int $g=0, int $b=0, int $a=0) {
        $this->setRgb($r, $g, $b);
        $this->a = $a;
    }
    public function fromHex(string $hex): self {
        $hex = ltrim($hex, '#');

        if ( !in_array(strlen($hex), [6, 8], true) || !ctype_xdigit($hex) ) 
            throw new InvalidArgumentException("colorGd->fromHex({$hex} failed: Invalid hex color.");

        $this->r = hexdec(substr($hex, 0, 2));
        $this->g = hexdec(substr($hex, 2, 2));
        $this->b = hexdec(substr($hex, 4, 2));

        if (strlen($hex) === 8) {
            // CSS alpha: 00 = transparent, FF = opaque.
            // GD alpha: 127 = transparent, 0 = opaque.
            $alpha = hexdec(substr($hex, 6, 2));
            $this->a = 127 - (int) round($alpha * 127 / 255);
        }
        return $this;
    }
    public function set(int $r, int $g, int $b, int|null $a=null): self {
        $this->setRgb($r, $g, $b);
        if ( is_int($a) )
            $this->a = $a;
        return $this;
    }
    private function setRgb(int $r, int $g, int $b): void {
        $this->r = $r;
        $this->g = $g;
        $this->b = $b;        
    }
}
