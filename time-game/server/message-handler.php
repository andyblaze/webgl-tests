<?php

interface GameMessageHandler {
    public function handle(int $clientId, string $line, MessageContext $context): void;
}

final class MessageHandler implements GameMessageHandler {
    public function handle(int $clientId, string $line, MessageContext $context): void {
        if ($line === 'quit') {
            $context->disconnect($clientId);
            return;
        }

        if ($line === 'shutdown') {
            $context->broadcast("Server shutting down.\n");
            $context->shutdown();
            return;
        }

        $context->broadcast("Client {$clientId}: {$line}\n");
    }
}
