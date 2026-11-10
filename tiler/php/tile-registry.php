<?php 

class TileRegistry {
    public static array $registry = [
        'mirror'=> ['class'=>'MirrorTile', 'label'=>'Mirror'],
        'matchEdges'=> ['class'=>'MatchEdgesTile', 'label'=>'Match Edges'],
        'offsetAndBlend'=> ['class'=>'OffsetAndBlendTile', 'label'=>'Offset and Blend']
    ];
}
