
<?php

require_once(__DIR__ . '/if-message-context.php');

class Connections implements MessageContext {
    private Socket|null $server = null;
    private array $clients = [];
    private MessageHandler|null $handler = null;
    private Logger|null $logger = null;

    public function __construct(string $address, int $port) {
        $this->handler = $handler;
        $this->logger = $logger;

        $this->server = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

        if ($this->server === false) {
            throw new RuntimeException(socket_strerror(socket_last_error()));
        }

        socket_set_option($this->server, SOL_SOCKET, SO_REUSEADDR, 1);

        if (!socket_bind($this->server, $address, $port)) {
            throw new RuntimeException(socket_strerror(socket_last_error($this->server)));
        }

        if (!socket_listen($this->server)) {
            throw new RuntimeException(socket_strerror(socket_last_error($this->server)));
        }

        socket_set_nonblock($this->server);

        $this->logger->log("Listening on {$address}:{$port}");
    }

    public function addLogger(Logger $l) {
        $this->logger = $l;
    }

    public function addMessageHandler(MessageHandler $mh) {
        $this->handler = $mh;
    }

    public function run(): void {
        while (true) {
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

        $this->logger->log("Client connected: {$id}");
    }

    private function readClient(Socket $client): void {
        $id = spl_object_id($client);
        $data = @socket_read($client, 4096, PHP_BINARY_READ);

        if ($data === false) {
            // A nonblocking socket may simply have no data ready.
            $error = socket_last_error($client);

            if ($error !== SOCKET_EWOULDBLOCK &&
                $error !== SOCKET_EAGAIN) {
                $this->removeClient($id);
            }

            socket_clear_error($client);
            return;
        }

        if ($data === '') {
            $this->removeClient($id);
            return;
        }

        $this->logger->log("Received from {$id}: " . trim($data));

        $this->handler->handle($id, trim($data), $this);
    }

    public function sendTo(int $id, string $message): void {
        if (!isset($this->clients[$id])) {
            return;
        }

        $message .= "\n";
        @socket_write($this->clients[$id], $message, strlen($message));
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

    }

    public function removeClient(int $id): void {
        if (!isset($this->clients[$id])) {
            return;
        }

        socket_close($this->clients[$id]);
        unset($this->clients[$id]);

        $this->logger->log("Client disconnected: {$id}");
    }
}