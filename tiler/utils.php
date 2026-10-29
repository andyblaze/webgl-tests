<?php 

function require_these(array $files ) {
    foreach ( $files as $f )
        require_once($f . '.php');
}