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


class Server {
    private Connections|null $connections = null;
    private int $pingTime = 0;
    private bool $isRunning = true;
    public function __construct(Connections $conns) {
        $this->connections = $conns;
        $this->pingTime = time() + 10;
    }

    public function start(): void {
        $this->connections->start();
        while ( $this->isRunning ) {
            $this->connections->loop($this->isRunning);
            if ( time() > $this->pingTime ) {
                $this->connections->ping();
                $this->pingTime = time() + 10;
            }
        }
        // Check heartbeat timeouts.
    }
    public function stop() {
        $this->isRunning = false;
        $this->connections->shutdown();
    }
}


$config = new Config();
$address = $config->item('address');
$port = $config->item('port');

$connections = new Connections($address, $port);
$connections->addLogger(new Reporter());
$connections->addMessageHandler(new MessageHandler());
$server = new Server($connections);
$server->start();
