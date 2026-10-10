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
    public function error() {
        return socket_strerror(socket_last_error($this->sock)) . "\n";
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

class Connections {
    private string $address = '192.168.0.16';
    private int $port = 10000;
    private false|TcpSocket $socket = false;
    private bool $running = true;
    private false|Socket $msgSock = false;

    public function __construct(TcpSocket $tcpSock) {
        $this->socket = $tcpSock;
        $this->running = $this->init();
    }
    private function init() {
        $ok = true;
        if ( false === $this->socket->open() ) {
            $this->echoMsg('TcpSocket->open() failed: reason: ' . $this->socket->error());
            $ok = false;
        }

        if ( false === $this->socket->bind($this->address, $this->port) ) {
            $this->echoMsg('TcpSocket->bind() failed: reason: ' . $this->socket->error());
            $ok = false;
        }

        if ( false === $this->socket->listen() ) {
            $this->echoMsg('TcpSocket->listen() failed: reason: ' . $this->socket->error());
            $ok = false;
        }
        return $ok;
    }
    private function echoMsg(string $msg) {
        echo $msg;
    }
    private function shutdown() {
        $this->running = false;
        socket_close($this->msgSock);
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
                if ( false === ($buf = $this->socket->read($this->msgSock))) {
                    $this->echoMsg('TcpSocket->read() failed: reason: ' . $this->socket->error());
                    $this->running = false;
                    //break 2;
                }
                if ( !$buf = trim($buf) ) 
                    continue;

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

$conns = new Connections(new TcpSocket());
$conns->run();