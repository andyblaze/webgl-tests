<?php

interface Logger {
    public function log(string $message): void;
}

class Reporter implements Logger {
    public function __construct() {}
    public function log(string $message): void {
        echo $message . PHP_EOL;
    }
}
