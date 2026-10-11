<?php 

interface MessageContext {
    public function sendTo(int $clientId, string $message): void;
    public function broadcast(string $message): void;
    public function disconnect(int $clientId): void;
    public function shutdown(): void;
    public function removeClient(int $id): void;
    public function sendRawTo(int $id, string $data): void;
}
