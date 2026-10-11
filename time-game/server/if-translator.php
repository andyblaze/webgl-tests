<?php 

interface Translator {
    /*
     * Called when a new client connects.
     * Gives the translator a chance to initialise any per-client state it needs.
     */
    public function accept(int $id): void;

    /*
     * Receives raw bytes from a client.
     * The translator buffers and interprets those bytes according to its protocol.
     * Complete messages are passed to the MessageHandler.
     * Protocol-specific responses are sent via MessageContext.
     */
    public function receive(int $id, string $data, MessageHandler $handler, MessageContext $context): void;

    /*
     * Translates an outgoing message into the format required by the client's protocol, then sends it.
     */
    public function send(int $id, string $message, MessageContext $context): void;

    /*
     * Called when a client disconnects.
     * Discards any buffered data and other per-client state.
     */
    public function removeBuffer(int $id): void;
}
