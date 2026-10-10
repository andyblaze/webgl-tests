<?php
error_reporting(E_ALL);

/* Allow the script to hang around waiting for connections. */
set_time_limit(0);

/* Turn on implicit output flushing so we see what we're getting
 * as it comes in. */
ob_implicit_flush();

class Config {
    private array $data = [];
    public function __construct() {
        $this->data = [
            'address' => '192.168.0.16',
            'port' => 10000
        ];
    }
    public function item(string $key) {
        return $this->data[$key];
    }
}

interface Logger {
    public function log(string $message): void;
}

class Reporter implements Logger {
    public function __construct() {}
    public function log(string $message): void {
        echo $message . PHP_EOL;
    }
}

final class Connections {
    private string $address;
    private int $port;

    private Socket|false $server = false;

    /** @var array<int, Socket> */
    private array $clients = [];

    /** @var array<int, string> */
    private array $buffers = [];

    private bool $running = false;

    private null|Logger $logger = null;

    public function __construct(string $address, int $port) {
        $this->address = $address;
        $this->port = $port;
    }

    public function addLogger(Logger $logger) : void {
        $this->logger = $logger;
    }

    public function init(): bool {
        $this->server = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

        if ($this->server === false) {
            return $this->reportError('socket_create');
        }

        if (!socket_set_option($this->server, SOL_SOCKET, SO_REUSEADDR, 1)) {
            return $this->fail('socket_set_option');
        }

        if (!socket_bind($this->server, $this->address, $this->port)) {
            return $this->fail('socket_bind');
        }

        if (!socket_listen($this->server, 10)) {
            return $this->fail('socket_listen');
        }

        // The listening socket must not block the event loop.
        if (!socket_set_nonblock($this->server)) {
            return $this->fail('socket_set_nonblock');
        }

        $this->logger->log("Listening on {$this->address}:{$this->port}");

        return true;
    }

    public function run(): void {
        if ($this->server === false && !$this->init()) {
            return;
        }

        $this->running = true;

        while ($this->running) {
            // socket_select() replaces this array with readable sockets.
            $read = [$this->server];

            foreach ($this->clients as $client) {
                $read[] = $client;
            }

            $write = null;
            $except = null;

            // Wake periodically so game timers can be processed later.
            $ready = @socket_select($read, $write, $except, 1);

            if ($ready === false) {
                // A signal can interrupt select; retry the loop.
                continue;
            }

            if ($ready === 0) {
                $this->tick();
                continue;
            }

            foreach ($read as $socket) {
                if ($socket === $this->server) {
                    $this->acceptClient();
                    continue;
                }

                $this->readClient($socket);
            }

            $this->tick();
        }

        $this->closeAll();
    }

    private function acceptClient(): void {
        $client = @socket_accept($this->server);

        if ($client === false) {
            return;
        }

        if (!socket_set_nonblock($client)) {
            socket_close($client);
            return;
        }

        $id = spl_object_id($client);

        $this->clients[$id] = $client;
        $this->buffers[$id] = '';

        $this->logger->log("Client connected: {$id}");

        $this->send($client, "Welcome! Type quit to disconnect.\n");
    }

    private function readClient(Socket $client): void {
        $id = spl_object_id($client);

        // Binary mode reads whatever bytes are available without waiting
        // for a newline. The buffer below reconstructs complete lines.
        $data = @socket_read($client, 4096, PHP_BINARY_READ);

        if ($data === false || $data === '') {
            $this->removeClient($id);
            return;
        }

        $this->buffers[$id] .= $data;

        // Avoid an indefinitely growing buffer if a client never sends
        // a newline. Adjust this limit to suit the eventual protocol.
        if (strlen($this->buffers[$id]) > 16384) {
            $this->send($client, "Input too long.\n");
            $this->removeClient($id);
            return;
        }

        while (($newline = strpos($this->buffers[$id], "\n")) !== false) {
            $line = substr($this->buffers[$id], 0, $newline);
            $this->buffers[$id] = substr($this->buffers[$id], $newline + 1);

            $line = trim($line, "\r");

            if ($line === 'quit') {
                $this->removeClient($id);
                return;
            }

            if ($line === 'shutdown') {
                $this->send($client, "Server shutting down.\n");
                $this->running = false;
                return;
            }

            // Temporary echo behaviour; replace with game message handling.
            //$this->send($client, "You said: {$line}\n");
            $this->broadcast("Client {$id}: {$line}\n");
        }
    }

    private function broadcast(string $message): void {
        foreach ($this->clients as $client) {
            $this->send($client, $message);
        }
    }

    private function send(Socket $client, string $message): void {
        $length = strlen($message);
        $sent = 0;

        // Fine for short prototype messages on a nonblocking socket:
        // if a write would block, stop rather than blocking the whole server.
        while ($sent < $length) {
            $written = @socket_write($client, substr($message, $sent));

            if ($written === false || $written === 0) {
                break;
            }
            $sent += $written;
        }
    }

    private function removeClient(int $id): void {
        if (!isset($this->clients[$id])) {
            return;
        }
        $this->logger->log("Client disconnected: {$id}");

        socket_close($this->clients[$id]);
        unset($this->clients[$id], $this->buffers[$id]);
    }

    private function tick(): void {
        // Game timers and scheduled events will go here.
    }

    private function reportError(string $operation): bool {
        $this->logger->log("{$operation} : " . socket_strerror(socket_last_error()));
        return false;
    }

    private function fail(string $operation): bool {
        $this->reportError($operation);

        if ($this->server !== false) {
            socket_close($this->server);
            $this->server = false;
        }
        return false;
    }

    private function closeAll(): void {
        foreach (array_keys($this->clients) as $id) {
            $this->removeClient($id);
        }

        if ($this->server !== false) {
            socket_close($this->server);
            $this->server = false;
        }
        $this->logger->log("Server stopped.");
    }
}

$config = new Config();
$address = $config->item('address');
$port = $config->item('port');

$connections = new Connections($address, $port);
$connections->addLogger(new Reporter());
$connections->run();
