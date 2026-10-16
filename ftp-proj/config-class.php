<?php 

class Config {
    private array $data = [];
    public function __construct(string $filename) {
        $this->data = $this->load($filename);
    }

    private function load(string $filename): array {
        //$filename = realpath($filename);

        if ($filename === false || !is_readable($filename)) 
            throw new \RuntimeException('Config file does not exist or is not readable.');

        $config = [];
        require $filename;
        return $config;
    }
    public function item(string $key, mixed $default=null): mixed {
        return $this->data[$key] ?? $default;
    }
}
