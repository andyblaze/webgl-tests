<?php 

class Reporter {
    private array $lines = [];
    private array $messages = [];
    private array $errors = [];
        /*'blankLine' => ['found' => 0, 'message' => 'Blank lines: '],
        'countMismatch' => ['found' => 0, 'message' => 'Column mismatches:']
    ];*/
    public function __construct(Config $cfg) {
        $this->messages = $cfg->item('reporterMessages');
        $this->errors = $cfg->item('reporterErrors');
    }
    private function handleSize(array $e, bool|int $eventResult) {
        $line = ($eventResult === -1 ? $e[0] : str_replace('[[size]]', $eventResult, $e[1]));
        $this->lines[] = $line;
    }
    private function addLine(string $event, bool|int $eventResult): void {
        $e = $this->messages[$event]; 
        if ( $event === 'ftp_size' ) { // slightly different to normal handling
            $this->handleSize($e, $eventResult);
        }
        else {
            $this->lines[] = $e[$eventResult];
        }
    }
    private function addError(string $type, bool|int $eventResult, int $rowNumber): void {
        $this->errors[$type]->found += $eventResult;
        $this->errors[$type]->row = $rowNumber;
    }
    public function update(string $event, bool|int $eventResult, int $rowNumber=0): void {
        $e = $this->messages[$event];
        if ( true === in_array($event, array_keys($this->errors), true) ) {
            $this->addError($event, $eventResult, $rowNumber);
            return;
        }
        $this->addLine($event, $eventResult);
    }
    public function report(): string {
        $errors = PHP_EOL;
        foreach ( $this->errors as $err )
            $errors .= "{$err->message} {$err->found}" . ($err->found > 0 ? " on line {$err->row}" : '') . PHP_EOL;
        return implode(PHP_EOL, $this->lines) . $errors;
    }
}
