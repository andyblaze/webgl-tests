<?php 

final class Ftp {
    private FTP\Connection|false $conn = false;
    private string $localFile = '';
    private string $remoteFile = '';
    private int $mode = FTP_BINARY;
    private int $offset = 0;
    public function __construct(string $hostname='', int $port=21, int $timeout=90) {
        if ( $hostname !== '')
            $this->connect($hostname, $port, $timeout);
    }
    public function connect(string $hostname, int $port=21, int $timeout=90): bool {
        $this->conn = ftp_connect($hostname, $port, $timeout);
        return $this->connOk(); 
    }
    public function login(string $user, string $pass): bool {
        if ( ! $this->connOk() ) return false;
        return @ftp_login($this->conn, $user, $pass);
    }
    public function close(): bool {
        if ( ! $this->connOk() ) return false;
        return ftp_close($this->conn);
    }
    public function get(): bool {
        return ftp_get($this->conn, $this->localFile, $this->remoteFile, $this->mode, $this->offset);
    }
    public function setLocalFile(string $fname): self {
        $this->localFile = $fname;
        return $this;
    }
    public function setRemoteFile(string $fname): self {
        $this->remoteFile = $fname;
        return $this;
    }
    public function setMode(int $mode): self {
        if ( !in_array($mode, [FTP_ASCII, FTP_BINARY], true) ) {
            throw new \InvalidArgumentException('Invalid FTP mode');
        }
        $this->mode = $mode;
        return $this;
    }
    public function setOffset(int $offset): self {
        if ($offset < 0) {
            throw new \InvalidArgumentException(
                'Offset cannot be negative'
            );
        }        
        $this->offset = $offset;
        return $this;
    }
    private function connOk() {
        return (false !== $this->conn);
    }
}

$ftp = new Ftp();
$ftp->connect('127.0.0.1');
$ftp->login('andy', 'roe09');
$ftp->setRemoteFile('ftp_test_orders.csv')->setLocalFile('temp-order.csv');
$ftp->setMode(FTP_BINARY);
$ftp->get();
$ftp->close();