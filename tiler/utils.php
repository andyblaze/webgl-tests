<?php 

function require_these(array $files ) {
    foreach ( $files as $f )
        require_once(__DIR__ . "/{$f}.php");
}

function rect(int $x, int $y, int|null $w=null, int|null $h=null): array {
    $result = ['x'=>$x, 'y'=>$y];
    if ( null !== $w && $w > 0 )
        $result['w'] = $w;
    if ( null !== $h && $h > 0 )
        $result['h'] = $h;
    return $result;
}