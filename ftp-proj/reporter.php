<?php 

class Reporter {
    private array $lines = [];
    private array $messages = [];
    private array $errors = [
        'blankLine' => ['found' => 0, 'message' => 'Blank lines: '],
        'countMismatch' => ['found' => 0, 'message' => 'Column mismatches:']
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
    private function addError(string $type, bool|int $eventResult): void {
        $this->errors[$type]['found'] += $eventResult;
    }
    public function update(string $event, bool|int $eventResult): void {
        $e = $this->messages[$event];
        if ( $event === 'blankLine' ) {
            $this->addError('blankLine', $e[$eventResult]);
            return;
        }

        if ( $event === 'countMismatch' ) {
            $this->addError('countMismatch', $e[$eventResult]);        
            return;
        }
        $this->addLine($event, $eventResult);
    }
    public function report(): string {
        $errors = "\n";
        foreach ( $this->errors as $err )
            $errors .= "{$err['message']}: {$err['found']}\n";
        return implode("\n", $this->lines) . $errors;
    }
}
