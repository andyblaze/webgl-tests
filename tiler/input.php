<?php 

class Input {
    private static function getData(array $in, string $key): object|null {
        return isset($in[$key]) ? (object)$in[$key] : null;
    }
    public static function file(string $key): object|null {
        return self::getData($_FILES, $key);
    }
    public static function post(string $key): object|null {
        return self::getData($_POST, $key);
    }
    public static function get(string $key): object|null {
        return self::getData($_GET, $key);
    }
}
