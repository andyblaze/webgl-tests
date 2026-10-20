<?php 

class CsvProcessor {
    private CsvReader|null $reader = null;
    private Validator|null $valdidator = null;
    private int $rowCount = 0;
    public function __construct(CsvReader $r, Validator $v) {
        $this->reader = $r;
        $this->valdidator = $v;
    }
    public function process(string $file): void {
        $this->reader->open($file);
        while ( ($line = $this->reader->readRow()) ) {
            $this->rowCount++;
            $this->valdidator->check($line, $this->rowCount);
        }
        $this->reader->close();
    }
}
