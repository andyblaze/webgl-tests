<?php 

class Validator {
    private Reporter|null $reporter = null;
    /** @var resource|false */
    private $handle = false;
    //private object|null $rules = null;
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
    private function isBlank(string $line) {
        if (  $line === '' )
            return;
    }
    public function check(array $line): bool {
        echo implode(', ', $line) . PHP_EOL;
        return true;
    }
}
