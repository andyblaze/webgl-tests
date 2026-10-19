<?php 

class Reporter {
    private array $lines = [];
    private array $messages = [];
    private array $errors = [
        'blankLines' => 0,
        'countMismatches' => 0
    ];
    public function __construct(Config $cfg) {
        $this->messages = $cfg->item('reporterMessages');
    }
    private function addLine(string $event, bool|int $eventResult): void {
        $e = $this->messages[$event];
        if ( $event === 'size' ) {
            $line = ($eventResult === -1 ? $e['n/a'] : str_replace('[[size]]', $eventResult, $e['ok']));
            $this->lines[] = $line;
        }
        else {
            $this->lines[] = $e[$eventResult];
        }
    }
    private function addError(string $type): void {
        $this->errors[$type]++;
    }
    public function update(string $event, bool|int $eventResult): void {
        if ( $event === 'blankLine' ) {
            $this->addError('blankLines');
        }
        elseif ( $event === 'countMismatch' ) {
            $this->addError('countMismatches');
        }
        else 
            $this->addLine($event, $eventResult);
    }
    public function report(): string {
        $errors = "\n";
        foreach ( $this->errors as $type=>$num )
            $errors .= "{$type}: $num\n";
        return implode("\n", $this->lines) . $errors;
    }
}
