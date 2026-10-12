
<?php

require_once(__DIR__ . '/if-message-context.php');
require_once(__DIR__ . '/websocket-frame.php');


class Connections implements MessageContext {
    private string $address = '';
    private int $port = 0;
    private bool $isRunning = true;
    private Socket|null $server = null;
    private array $clients = [];
    private array $buffers = [];
    private array $webSocketReady = [];
    private MessageHandler|null $handler = null;
    private Logger|null $logger = null;

    public function __construct(string $address, int $port) {
        $this->address = $address;
        $this->port = $port;
    }
    private function init() {

        $this->server = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

        if ($this->server === false) {
            throw new RuntimeException(socket_strerror(socket_last_error()));
        }

        socket_set_option($this->server, SOL_SOCKET, SO_REUSEADDR, 1);

        if (!socket_bind($this->server, $this->address, $this->port)) {
            throw new RuntimeException(socket_strerror(socket_last_error($this->server)));
        }

        if (!socket_listen($this->server)) {
            throw new RuntimeException(socket_strerror(socket_last_error($this->server)));
        }

        socket_set_nonblock($this->server);

        $this->logger->log("Listening on {$this->address}:{$this->port}");
    }

    public function addLogger(Logger $l) {
        $this->logger = $l;
    }

    public function addMessageHandler(MessageHandler $mh) {
        $this->handler = $mh;
    }

    public function run(): void {
        $this->init();
        while ($this->isRunning) {
            $reads = array_merge([$this->server], $this->clients);
            $writes = [];
            $excepts = [];

            $ready = @socket_select($reads, $writes, $excepts, 1);

            if ($ready === false) {
                continue;
            }

            foreach ($reads as $socket) {
                if ($socket === $this->server) {
                    $this->acceptClient();
                } else {
                    $this->readClient($socket);
                }
            }
        }
    }

    private function acceptClient(): void {
        $client = @socket_accept($this->server);

        if ($client === false) {
            return;
        }

        socket_set_nonblock($client);

        $id = spl_object_id($client);
        $this->clients[$id] = $client;
        $this->buffers[$id] = '';
        $this->webSocketReady[$id] = false;

        $this->logger->log("Client connected: {$id}");
    }


    private function readClient(Socket $client): void {
        $id = spl_object_id($client);
        $data = @socket_read($client, 4096, PHP_BINARY_READ);

        if ($data === false) {
            $error = socket_last_error($client);

            if ($error !== SOCKET_EWOULDBLOCK && $error !== SOCKET_EAGAIN) {
                $this->removeClient($id);
            }

            socket_clear_error($client);
            return;
        }

        if ($data === '') {
            $this->removeClient($id);
            return;
        }

        // Handshake not completed yet.
        if (!$this->webSocketReady[$id]) {
            $this->tryHandshake($data, $id, $client);
            /*$this->buffers[$id] .= $data;

            // Wait until the complete HTTP headers have arrived.
            $end = strpos($this->buffers[$id], "\r\n\r\n");

            if ($end === false) {
                return;
            }

            $request = substr($this->buffers[$id], 0, $end + 4);
            $remaining = substr($this->buffers[$id], $end + 4);
            $this->buffers[$id] = '';

            $response = WebSocketFrame::handshake($request);

            if ($response === null) {
                $this->logger->log("Invalid WebSocket handshake from {$id}");
                $this->removeClient($id);
                return;
            }

            $written = @socket_write($client, $response, strlen($response));

            if ($written !== strlen($response)) {
                $this->logger->log("Incomplete handshake response to {$id}");
                $this->removeClient($id);
                return;
            }

            $this->webSocketReady[$id] = true;
            $this->logger->log("WebSocket handshake complete: {$id}");

            // Keep any bytes that arrived after the HTTP headers.
            $this->buffers[$id] = $remaining;
            //if ( false === $ok ) return;*/
            return;
        }

        $this->processFrame($data, $id);

        // WebSocket frame processing will go here next.
        /*$this->buffers[$id] .= $data;

        while (isset($this->buffers[$id])) {
            try {
                $frame = WebSocketFrame::readMessage(
                    $this->buffers[$id]
                );
            } catch (RuntimeException $e) {
                $this->logger->log(
                    "Invalid WebSocket frame from {$id}: " . $e->getMessage()
                );
                $this->removeClient($id);
                return;
            }

            // No complete message yet. Keep buffering.
            if ($frame === null) {
                break;
            }

            // Remove this frame, preserving any following frames.
            $this->buffers[$id] = substr(
                $this->buffers[$id],
                $frame['bytes']
            );

            $message = $frame['message'];

            $this->logger->log("Received from {$id}: " . $message);

            $this->handler->handle($id, $message, $this);
        }
        $this->logger->log("Received " . strlen($data) . " WebSocket bytes from {$id}");*/
    }

    private function processFrame(string $data, int $id) {
        $this->buffers[$id] .= $data;

        while (isset($this->buffers[$id])) {
            try {
                $frame = WebSocketFrame::readMessage(
                    $this->buffers[$id]
                );
            } catch (RuntimeException $e) {
                $this->logger->log(
                    "Invalid WebSocket frame from {$id}: " . $e->getMessage()
                );
                $this->removeClient($id);
                return;
            }

            // No complete message yet. Keep buffering.
            if ($frame === null) {
                break;
            }

            // Remove this frame, preserving any following frames.
            $this->buffers[$id] = substr(
                $this->buffers[$id],
                $frame['bytes']
            );

            $message = $frame['message'];

            $this->logger->log("Received from {$id}: " . $message);

            $this->handler->handle($id, $message, $this);
        }
        $this->logger->log("Received " . strlen($data) . " WebSocket bytes from {$id}");
    }

    private function tryHandshake(string $data, int $id, Socket $client) {
        $this->buffers[$id] .= $data;

        // Wait until the complete HTTP headers have arrived.
        $end = strpos($this->buffers[$id], "\r\n\r\n");

        if ($end === false) {
            return false;
        }

        $request = substr($this->buffers[$id], 0, $end + 4);
        $remaining = substr($this->buffers[$id], $end + 4);
        $this->buffers[$id] = '';

        $response = WebSocketFrame::handshake($request);

        if ($response === null) {
            $this->logger->log("Invalid WebSocket handshake from {$id}");
            $this->removeClient($id);
            return false;
        }

        $written = @socket_write($client, $response, strlen($response));

        if ($written !== strlen($response)) {
            $this->logger->log("Incomplete handshake response to {$id}");
            $this->removeClient($id);
            return false;
        }

        $this->webSocketReady[$id] = true;
        $this->logger->log("WebSocket handshake complete: {$id}");

        // Keep any bytes that arrived after the HTTP headers.
        $this->buffers[$id] = $remaining;
        return true;
    }

    public function sendTo(int $id, string $message): void {
        if (!isset($this->clients[$id]) || !($this->webSocketReady[$id] ?? false)) {
            return;
        }

        $frame = WebSocketFrame::encode($message);
        @socket_write($this->clients[$id], $frame, strlen($frame));
    }

    public function broadcast(string $message): void {
        foreach (array_keys($this->clients) as $id) {
            $this->sendTo($id, $message);
        }
    }

    public function disconnect(int $id): void {
        $this->removeClient($id);
    }

    public function shutdown(): void {
        foreach ( array_keys($this->clients) as $id ) 
            $this->removeClient($id);

        $this->isRunning = false;
    }

    public function removeClient(int $id): void {
        if (!isset($this->clients[$id])) {
            return;
        }

        socket_close($this->clients[$id]);
        unset($this->clients[$id]);
        unset($this->buffers[$id]);
        $this->webSocketReady[$id];

        $this->logger->log("Client disconnected: {$id}");
    }
}