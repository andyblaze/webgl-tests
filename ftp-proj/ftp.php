<?php 

class Config {
    private array $data = [];
    public function __construct(string $filename) {
        $this->data = $this->load($filename);
    }

    private function load(string $filename): array {
        //$filename = realpath($filename);

        if ($filename === false || !is_readable($filename)) 
            throw new \RuntimeException('Config file does not exist or is not readable.');

        $config = [];
        require $filename;
        return $config;
    }
    public function item(string $key, mixed $default=null): mixed {
        return $this->data[$key] ?? $default;
    }
}

final class Ftp {
    private FTP\Connection|false $conn = false;
    private string|null $localFile = null;
    private string|null $remoteFile = null;
    private int $mode = FTP_BINARY;
    private int $offset = 0;
    private bool $loggedIn = false;
    public function __construct(string $hostname='', int $port=21, int $timeout=90) {
        if ( '' !== $hostname )
            $this->connect($hostname, $port, $timeout);
    }
    public function connect(string $hostname, int $port=21, int $timeout=90): bool {
        if ( true === $this->connOk() )
            $this->close();
        $this->conn = ftp_connect($hostname, $port, $timeout);
        return $this->connOk(); 
    }
    public function login(string $user, string $pass): bool {
        if ( !$this->connOk() ) return false;
        if ( true === $this->loggedIn ) return true;
        $this->loggedIn = @ftp_login($this->conn, $user, $pass);
        return $this->loggedIn;
    }
    public function close(): bool {
        if ( !$this->connOk() ) return false;
        $result = ftp_close($this->conn);
        $this->conn = false;
        return $result;
    }
    public function get(): bool {
        if ($this->localFile === null || $this->remoteFile === null)
            throw new \LogicException('Local and remote file paths must be configured.');

        return $this->connOk() ? ftp_get($this->conn, $this->localFile, $this->remoteFile, $this->mode, $this->offset) : false;
    }
    public function size(): int {
        if ( !$this->connOk() ) return false;

        return @ftp_size($this->conn, $this->remoteFile);
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
        if ( false === in_array($mode, [FTP_ASCII, FTP_BINARY], true) ) {
            throw new \InvalidArgumentException('Invalid FTP mode');
        }
        $this->mode = $mode;
        return $this;
    }
    public function setOffset(int $offset): self {
        if ( $offset < 0 ) {
            throw new \InvalidArgumentException(
                'Offset cannot be negative'
            );
        }        
        $this->offset = $offset;
        return $this;
    }
    private function connOk(): bool {
        return (false !== $this->conn);
    }
}

final class Reporter {
    private array $lines = [];
    public function __construct() {}
    public function addLine(string $l): void {
        $this->lines[] = $l;
    }
    public function report(): string {
        return implode("\n", $this->lines);
    }
}

$report = new Reporter();

$cfg = new Config(__DIR__ . '/config.php');

$host = $cfg->item('host');
$user = $cfg->item('user');
$pass = $cfg->item('pass');

$ftp = new Ftp();
$ok = $ftp->connect($host);
$report->addLine($ok ? 'Connection opened' : 'Connection failed');
$ok = $ftp->login($user, $pass);
$report->addLine($ok ? 'Logged in' : 'Login failed');
$ftp->
    setRemoteFile('ftp_test_orders.csv')->
    setLocalFile('temp-order.csv')->
    setMode(FTP_BINARY);
$size = $ftp->size();
if ( $size === -1 )
    $report->addLine('Op size n/a on server');
if ( $size === 0 )
    $report->addLine('File is 0 bytes');
if ( $size > 0 )
    $report->addLine("File is {$size} bytes");
$ok = $ftp->get();
$report->addLine($ok ? 'File got' : 'File not got');
$ok = $ftp->close();
$report->addLine($ok ? 'Closed' : 'Close failed');
echo $report->report();