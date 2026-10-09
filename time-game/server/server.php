<?php
error_reporting(E_ALL);

/* Allow the script to hang around waiting for connections. */
set_time_limit(0);

/* Turn on implicit output flushing so we see what we're getting
 * as it comes in. */
ob_implicit_flush();

$address = '192.168.0.16';
$port = 10000;

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

    public function __construct(TcpSocket $tcpSock) {
        $this->socket = $tcpSock;

    if ( false === $this->socket->open() )
        echo "TcpSocket->open() failed: reason: " . $this->socket->error();

    if ( false === $this->socket->bind($this->address, $this->port) ) 
        echo "TcpSocket->bind() failed: reason: " . $this->socket->error();

    if ( false === $this->socket->listen() ) 
        echo "TcpSocket->listen() failed: reason: " . $this->socket->error();
    }
    public function run() {  
        do {
            if ( ($msgsock = $socket->accept()) === false ) {
                echo "TcpSocket->accept() failed: reason: " . $socket->error();
                break;
            }
            /* Send instructions. */
            $msg = "\nWelcome to the PHP Test Server. \n" .
                "To quit, type 'quit'. To shut down the server type 'shutdown'.\n";
            $socket->write($msg, $msgsock);

            do {
                if ( false === ($buf = $socket->read($msgsock))) {
                    echo "TcpSocket->read() failed: reason: " . $socket->error();
                    break 2;
                }
                if ( !$buf = trim($buf) ) {
                    continue;
                }
                if ( $buf == 'quit' ) {
                    break;
                }
                if ( $buf == 'shutdown' ) {
                    socket_close($msgsock);
                    break 2;
                }
                $talkback = "PHP: You said '{$buf}'.\n";
                $socket->write($talkback, $msgsock);
                echo "$buf\n";
            } while (true);
            socket_close($msgsock);
        } while (true);

        $this->socket->close();
    }
}