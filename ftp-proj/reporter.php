<?php 

class Reporter {
    private array $lines = [];
    private array $messages = [];
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
    public function update(string $event, bool|int $eventResult): void {
        $this->addLine($event, $eventResult);
    }
    public function report(): string {
        return implode("\n", $this->lines);
    }
}
