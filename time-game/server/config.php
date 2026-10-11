<?php 
class Config {
    private array $data = [];
    public function __construct() {
        $this->data = [
            'address' => '192.168.0.16',
            'port' => 10000
        ];
    }
    public function item(string $key) {
        return $this->data[$key];
    }
}
