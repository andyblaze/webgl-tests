<?php 

interface Tile {
    public function apply(ImageGd $img1, ?ImageGd $img2, ?int $bandWidth): void;
}

class MirrorTile implements Tile {
    private Tiling|null $tiling = null; 
    public function __construct(Tiling $t) {
        $this->tiling = $t;
    }
    public function apply(ImageGd $img1, ?ImageGd $img2, ?int $bandWidth): void {
        $this->tiling->mirror($img1, $img2);
    }
}
class MatchEdgesTile {
    private Tiling|null $tiling = null; 
    public function __construct(Tiling $t) {
        $this->tiling = $t;
    }
    public function apply(ImageGd $img1, ?ImageGd $img2, ?int $bandWidth): void {
        $this->tiling->matchEdges($img2, $bandWidth);
    }
}
class OffsetAndBlendTile {
    private Tiling|null $tiling = null; 
    public function __construct(Tiling $t) {
        $this->tiling = $t;
    }
    public function apply(ImageGd $img1, ?ImageGd $img2, ?int $bandWidth): void {
        $this->tiling->offsetAndBlend($img1, $img2, $bandWidth);
    }
}
