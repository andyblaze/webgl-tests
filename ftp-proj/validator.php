<?php 

class Event {
    public bool|int $status = 0;
    public int $rowNumber = 0;
    public bool $isHeader = false;
    public function set(bool|int $s, int $rn=0, bool $h=false) {
        $this->status = $s;
        $this->rowNumber = $rn;
        $this->isHeader = $h;
        return $this;
    }
}

class Validator {
    private Reporter|null $reporter = null;
    /** @var resource|false */
    private $handle = false;
    private bool $hasHeader = true;
    private object|null $policy = null;
    private int $columnCount = 0;
    private array $columnNames = [];
    private array $rules = [];
    public function __construct(Config $cfg, Reporter $r) {
        $this->initRules((object)$cfg->item('rules'));
        $this->policy = (object)$cfg->item('policy');
        $this->reporter = $r;
    }
    private function initRules(object $rules): void {
        $this->hasHeader = $rules->has_header;
        $this->columnCount = count($rules->columns);
        $this->columnNames = array_keys($rules->columns);
        foreach ( $rules->columns as $key=>$val) {
            $this->rules[$key] = (object)$val;    
        }  
    }
    public function openFile(string $fname): bool {
        if ( file_exists($fname) && is_readable($fname) ) 
            $this->handle = fopen($fname, 'r');
        return is_resource($this->handle); 
    }
    private function isBlank(array $line): bool {
        return (  count($line) === 1 && $line[0] === null );
    }
    private function countMismatch(array $line) {
        if ( $this->isBlank($line) ) 
            return false;
        return ( count($line) !== $this->columnCount );
    }
    private function hasEmptyFields(array $line): bool {
        if ( $this->isBlank($line) ) 
            return false;
        $result = 0;
        foreach ( $line as $val ) {
            if ( empty($val) )
                $result++;        
        }
        return ($result > 0);
    }
    private function headerOk(array $line): bool {
        if ( $this->isBlank($line) ) {
            return false;
        }
        if ( count($line) !== count($this->columnNames) ) {
            return false;
        }
        foreach ($line as $key => $field) {
            if ( $field !== $this->columnNames[$key] ) {
                return false;
            }
        }
        return true;
    }
    public function check(array $line, int $rowNumber): bool {
        if ( $rowNumber === 1 && $this->hasHeader ) {
            $ok = $this->headerOk($line);
            $this->reporter->update('headerOk', $ok, 1);
        }
        if ( $this->isBlank($line) )
            $this->reporter->update('blankLine', 1, $rowNumber);

        if ( $this->countMismatch($line) )
            $this->reporter->update('countMismatch', 1, $rowNumber);

        if ( $this->hasEmptyFields($line) )
            $this->reporter->update('emptyFields', 1, $rowNumber);

        return true;
    }
}
