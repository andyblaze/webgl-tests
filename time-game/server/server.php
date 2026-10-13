<?php
error_reporting(E_ALL);

/* Allow the script to hang around waiting for connections. */
set_time_limit(0);

/* Turn on implicit output flushing so we see what we're getting
 * as it comes in. */
ob_implicit_flush();

require_once(__DIR__ . '/config.php');
require_once(__DIR__ . '/logger.php');
require_once(__DIR__ . '/message-handler.php');
require_once(__DIR__ . '/connections.php');

final class ShutdownStrategy {
    private const int SHUTDOWN_TIMER = 15;
    private const array WARNINGS = [15, 10, 5];

    private bool $shuttingDown = false;
    private bool $finished = false;

    private int $stoppingAt = 0;
    private int $nextWarning = 0;

    public function __construct(
        private readonly Closure $broadcast,
        private readonly Closure $shutdown,
    ) {}

    public function begin(): void {
        // Don't accidentally restart an active shutdown.
        if ($this->shuttingDown || $this->finished) return;

        $this->stoppingAt = hrtime(true) + (self::SHUTDOWN_TIMER * 1_000_000_000);

        $this->nextWarning = 0;
        $this->shuttingDown = true;
    }

    public function check(): void {
        if (!$this->shuttingDown) return;

        $now = hrtime(true);

        // Shutdown deadline reached.
        if ($now >= $this->stoppingAt) {
            $this->shuttingDown = false;
            $this->finished = true;

            ($this->shutdown)();

            return;
        }

        $remaining = ($this->stoppingAt - $now) / 1_000_000_000;

        // Send each warning once, even if a check was delayed.
        while (isset(self::WARNINGS[$this->nextWarning]) && $remaining <= self::WARNINGS[$this->nextWarning]) {
            ($this->broadcast)(
                self::WARNINGS[$this->nextWarning]
            );

            ++$this->nextWarning;
        }
    }

    public function isShuttingDown(): bool {
        return $this->shuttingDown;
    }
}

class Server {
    private Connections|null $connections = null;
    private Handler|null $handler = null;
    public ShutdownStrategy|null $shutdownStrategy = null;
    private int $pingTimer = 0;
    private int $pingInterval = 30;
    private bool $isRunning = true;
    public function __construct(Connections $conns) {
        $this->connections = $conns;        
        $this->pingTimer = time() + $this->pingInterval;
    }

    public function addHandler(Handler $h) {
        $this->handler = $h;
        $this->handler->setContext($this);
    }

    public function addShutdown(ShutdownStrategy $sds) {
        $this->shutdownStrategy = $sds;
    }

    public function start(): void {
        $this->connections->start();
        while ( $this->isRunning ) {
            $this->connections->loop($this->isRunning);
            $this->timedPing();
            $this->shutdownStrategy->check();
        }
        // Check heartbeat timeouts.
    }

    private function timedPing() {
        $t = time();
        if ( $t >= $this->pingTimer ) {
            $this->connections->ping();
            $this->pingTimer = $t + $this->pingInterval;
        }
    }
    public function stop() {
        $this->isRunning = false;
        $this->connections->shutdown();
    }

    public function broadcast(string $msg) {
        $this->connections->broadcast($msg);
    }
}

class Handler {
    private Server|null $server = null;
    public function setContext(Server $s) {
        $this->server = $s;
    }
    public function update(string $line) {
        /*if ($line === 'quit') {
            $context->disconnect($clientId);
            return;
        }*/

        if ($line === 'shutdown') {
            //$context->broadcast("Server shutting down.\n");
            $this->server->shutdownStrategy->begin();
            return;
        }

        $this->server->broadcast($line);
    }
}


$config = new Config();
$address = $config->item('address');
$port = $config->item('port');

$serverHandler = new Handler();

$connections = new Connections($address, $port);
$connections->addLogger(new Reporter());
$connections->addMessageHandler(new MessageHandler($serverHandler));
$server = new Server($connections);
$server->addHandler($serverHandler);
$strategy = new ShutdownStrategy(
    broadcast: function (int $seconds) use ($server): void {
        $server->broadcast("Shutting down in {$seconds}s\n");
    },
    shutdown: function () use ($server): void {
        $server->stop();
    },
);
$server->addShutdown($strategy);
$server->start();
