<?php

require_once(__DIR__ . '/if-logger.php');

class Reporter implements Logger {
    public function __construct() {}
    public function log(string $message): void {
        echo $message . PHP_EOL;
    }
}
