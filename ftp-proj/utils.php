<?php 

function require_these(array $files): void {
    foreach ( $files as $filename ) {
        $filename .= str_ends_with($filename, '.php') ? '' : '.php';
        require_once(__DIR__ . "/{$filename}");
    }
}