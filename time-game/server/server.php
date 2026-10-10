<?php
error_reporting(E_ALL);

/* Allow the script to hang around waiting for connections. */
set_time_limit(0);

/* Turn on implicit output flushing so we see what we're getting
 * as it comes in. */
ob_implicit_flush();

class TcpSocket {
    private false|Socket $sock = false;
    public function __construct() {}
    public function open() {
        $this->sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        return ($this->sock !== false);
    }
    public function bind(string $address, int $port) {
        return socket_bind($this->sock, $address, $port);
    }
    public function listen() {
        return socket_listen($this->sock, 5);
    }
    public function accept() {
        return socket_accept($this->sock);
    }
    public function error(?Socket $sock=null) {
        $sock ??= $this->sock;
        return socket_strerror(socket_last_error($sock));
    }
    public function close() {
        socket_close($this->sock);
    }
    public function write(string $msg, Socket|null $msgSock=null) {
        $writeTo = ($msgSock === null ? $this->sock : $msgSock);
        socket_write($writeTo, $msg, strlen($msg));
    }
    public function read(Socket|null $msgSock) {
        $readFrom = ($msgSock === null ? $this->sock : $msgSock);
        return socket_read($readFrom, 2048, PHP_NORMAL_READ);
    }
}

class Config {
    private array $data = [];
    public function __construct() {
        $this->data = [
            'address' => '192.168.0.16',
            'port' => 10000
        ];
    }
    public function item($key) {
        return $this->data[$key];
    }
}

class Connections {
    private string $address = '';
    private int $port = 0;
    private false|TcpSocket $socket = false;
    private bool $running = true;
    private false|Socket $msgSock = false;

    public function __construct(TcpSocket $tcpSock, string $address, int $port) {
        $this->socket = $tcpSock;
        $this->address = $address;
        $this->port = $port;
        $this->running = $this->init();
    }
    private function init() : bool {
        if ( false === $this->socket->open() ) {
            $this->echoMsg('TcpSocket->open() failed: reason: ' . $this->socket->error());
            return false;
        }

        if ( false === $this->socket->bind($this->address, $this->port) ) {
            $this->echoMsg('TcpSocket->bind() failed: reason: ' . $this->socket->error());
            $this->socket->close();
            return false;
        }

        if ( false === $this->socket->listen() ) {
            $this->echoMsg('TcpSocket->listen() failed: reason: ' . $this->socket->error());
            $this->socket->close();
            return false;
        }
        return true;
    }
    private function echoMsg(string $msg) {
        echo $msg;
    }
    private function shutdown() {
        $this->echoMsg('Server shutting down');
        $this->running = false;
        socket_close($this->msgSock);
    }
    private function bufferOk($buf) {
        if ( $buf === false ) {
            // Read error
            $this->echoMsg('TcpSocket->read() failed: reason: ' . $this->socket->error($this->msgSock));
            return false;
        }

        if ( $buf === '' ) {
            // Client disconnected
            $this->echoMsg('Client disconnected');
            return false;
        }   
        return true;     
    }
    public function run() {  
        do {
            if ( ($this->msgSock = $this->socket->accept()) === false ) {
                $this->echoMsg('TcpSocket->accept() failed: reason: ' . $this->socket->error());
                $this->running = false;
            }
            /* Send instructions. */
            $msg = "\n Welcome to the PHP Test Server. \n To quit, type 'quit'. To shut down the server type 'shutdown'.\n";
            $this->socket->write($msg, $this->msgSock);

            do {
                $buf = $this->socket->read($this->msgSock);

                if ( false === $this->bufferOk($buf) ) {
                    break;
                }

                $buf = trim($buf);

                if ( $buf === '' ) {
                    continue;
                }

                if ( $buf == 'quit' ) 
                    break;

                if ( $buf == 'shutdown' ) {
                    $this->shutdown();
                    break 2;
                }
                $talkback = "PHP: You said '{$buf}'.\n";
                $this->socket->write($talkback, $this->msgSock);
                $this->echoMsg("{$buf}\n");
            } 
            while ( true === $this->running );
            socket_close($this->msgSock);
        } 
        while ( true === $this->running );

        $this->socket->close();
    }
}

$config = new Config();
$address = $config->item('address');
$port = $config->item('port');

$conns = new Connections(new TcpSocket(), $address, $port);
$conns->run();