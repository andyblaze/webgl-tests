<?php 

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
        return ( count($line) !== $this->columnCount );
    }
    public function check(array $line): bool {
        if ( $this->isBlank($line) )
            $this->reporter->update('blankLine', true);

        if ( false === $this->isBlank($line) && true === $this->countMismatch($line) )
            $this->reporter->update('countMismatch', true);

        return true;
    }
}
