<?php 

class CsvReader {
    /** @var resource|false */
    private $handle = false;
    private int $length = 2048;
    private string $separator = ',';
    private string $enclosure = '"';
    private string $escape = '';

    public function __construct(Config $cfg) {
        $this->length = $cfg->item('csvLength');
        $this->separator = $cfg->item('csvSeparator');
        $this->enclosure = $cfg->item('csvEnclosure');
        $this->escape = $cfg->item('csvEscape');

    }
    public function open(string $file): bool {
        if ( !is_file($file) || !is_readable($file) ) {
            return false;
        }
        $this->handle = fopen($file, 'r');
        return is_resource($this->handle);
    }
    public function readRow(): array|false {
        if ( false === $this->handle) {
            return false;
        }
        return fgetcsv($this->handle, $this->length, $this->separator, $this->enclosure, $this->escape);
    }
    public function close(): bool {
        $result = true;
        if ( is_resource($this->handle) ) {
            $result = fclose($this->handle);
            $this->handle = false;
        }
        return $result;
    }
}
