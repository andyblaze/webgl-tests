<?php 

require_once('tile-registry.php');

class TileFactory {
    private static array $registry = [];
    public static function init(array $reg) {
        self::$registry = $reg;
    }
    public static function create(string $key, Tiling $t): object|null {
        if ( true === array_key_exists($key, self::$registry ) ) {
            $cls = self::$registry[$key]['class'];
            return new $cls($t);
        }
        return null;
    }
}

TileFactory::init(TileRegistry::$registry);