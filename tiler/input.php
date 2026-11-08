<?php 

class Input {
    private static function getData(array $in, string $key): mixed {
        if ( !isset($in[$key] ))
            return null;

        $value = $in[$key];

        if ( is_array($value) )
            return (object)$value;

        if ( is_numeric($value) ) {
            $number = $value + 0;

            return is_int($number) ? $number : (float)$number;
        }
        return (string)$value;
    }
    public static function file(string $key): ?object {
        return self::getData($_FILES, $key);
    }
    public static function post(string $key): mixed {
        return self::getData($_POST, $key);
    }
    public static function get(string $key): mixed {
        return self::getData($_GET, $key);
    }
}
