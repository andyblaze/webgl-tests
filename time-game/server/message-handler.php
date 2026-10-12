<?php

require_once(__DIR__ . '/if-message-handler.php');

final class MessageHandler implements IMessageHandler {
    private Handler|null $serverHandler = null;
    public function __construct(Handler $sh) {
        $this->serverHandler = $sh;
    }
    public function handle(int $clientId, string $line, MessageContext $context): void {
        /*if ($line === 'quit') {
            $context->disconnect($clientId);
            return;
        }

        if ($line === 'shutdown') {
            $context->broadcast("Server shutting down.\n");
            $context->shutdown();
            return;
        }*/

        if ( strlen($line) > 0 ) 
            $this->serverHandler->update($line);

        //$context->broadcast("Client {$clientId}: {$line}\n");
    }
}
