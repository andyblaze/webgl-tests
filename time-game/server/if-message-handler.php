<?php

interface IMessageHandler {
    public function handle(int $clientId, string $line, MessageContext $context): void;
}
