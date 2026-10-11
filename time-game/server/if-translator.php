<?php 

interface Translator {
    public function receive(int $id, string $data, MessageHandler $handler, MessageContext $context): void;
    public function accept(int $id) : void;
    public function removeBuffer(int $id): void;
}
