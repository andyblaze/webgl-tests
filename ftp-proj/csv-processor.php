<?php 

class CsvProcessor {
    private CsvReader|null $reader = null;
    private Validator|null $valdidator = null;
    private Reporter|null $reporter = null;
    private int $rowCount = 1;
    public function __construct(CsvReader $r, Validator $v, Reporter $rp) {
        $this->reader = $r;
        $this->valdidator = $v;
        $this->reporter = $rp;
    }
    public function process(string $file): void {
        $ok = $this->reader->open($file);
        $this->reporter->update('file_open', $ok);

        while ( ($line = $this->reader->readRow()) ) {
            $this->valdidator->check($line, $this->rowCount);
            $this->rowCount++;
        }
        
        $ok = $this->reader->close();
        $this->reporter->update('file_close', $ok);
    }
}
