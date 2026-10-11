<?php 

require_once(__DIR__ . '/if-translator.php');

class LineTranslator implements Translator {
    private array $buffers = [];
    private int $maxLength = 16384;

    public function receive(int $id, string $data, MessageHandler $handler, MessageContext $context): void {
        $this->buffers[$id] = ($this->buffers[$id] ?? '') . $data;

        if (strlen($this->buffers[$id]) > $this->maxLength) {
            $this->removeBuffer($id);
            $context->removeClient($id);
            return;
        }

        while (($newline = strpos($this->buffers[$id], "\n")) !== false) {
            $line = substr($this->buffers[$id], 0, $newline);
            $this->buffers[$id] = substr($this->buffers[$id], $newline + 1);

            $line = trim($line, "\r");
            $handler->handle($id, $line, $context);
        }
    }

    public function send(int $id, string $message, MessageContext $context): void {}

    public function accept(int $id) : void {
        $this->buffers[$id] = '';
    }

    public function removeBuffer(int $id): void {
        unset($this->buffers[$id]);
    }
}
