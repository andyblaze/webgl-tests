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


function normalMap(ImageGd $im1, float $strength = 2.0): ImageGd {
    $width  = $im1->width;
    $height = $im1->height;

    $im2 = new ImageGd($width, $height, 'png');

    // Read pixel brightness (works with greyscale or colour images).
    $sample = function (int $x, int $y) use ($im1, $width, $height): float {
        $x = max(0, min($width - 1, $x));
        $y = max(0, min($height - 1, $y));

        $colour = $im1->colorat($x, $y);

        $r = ($colour >> 16) & 0xFF;
        $g = ($colour >> 8) & 0xFF;
        $b = $colour & 0xFF;

        return (0.299 * $r + 0.587 * $g + 0.114 * $b) / 255;
    };

    for ($y = 0; $y < $height; $y++) {
        for ($x = 0; $x < $width; $x++) {

            // Sample surrounding pixels.
            $tl = $sample($x - 1, $y - 1);
            $t  = $sample($x,     $y - 1);
            $tr = $sample($x + 1, $y - 1);

            $l  = $sample($x - 1, $y);
            $r  = $sample($x + 1, $y);

            $bl = $sample($x - 1, $y + 1);
            $b  = $sample($x,     $y + 1);
            $br = $sample($x + 1, $y + 1);

            // Sobel gradients.
            $gx = ($tr + 2 * $r + $br) -
                  ($tl + 2 * $l + $bl);

            $gy = ($bl + 2 * $b + $br) -
                  ($tl + 2 * $t + $tr);

            // Construct and normalise the normal vector.
            $nx = -$gx * $strength;
            $ny = -$gy * $strength;
            $nz = 1.0;

            $length = sqrt($nx * $nx + $ny * $ny + $nz * $nz);

            $nx /= $length;
            $ny /= $length;
            $nz /= $length;

            // Convert normal vector (-1..1) to RGB (0..255).
            $red   = (int) round(($nx * 0.5 + 0.5) * 255);
            $green = (int) round(($ny * 0.5 + 0.5) * 255);
            $blue  = (int) round(($nz * 0.5 + 0.5) * 255);

            // Pack RGB colour for GD.
            $colour = ($red << 16) | ($green << 8) | $blue;

            $im2->setpixel($x, $y, $colour);
        }
    }

    return $im2;
}
