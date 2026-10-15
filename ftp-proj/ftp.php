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
    private array $messages = [];
    public function __construct(array $messages) {
        $this->messages = $messages;
    }
    private function addLine(string $event, bool|int $eventResult): void {
        $e = $this->messages[$event];
        if ( $event === 'size' ) {
            $line = ($eventResult === -1 ? $e['n/a'] : str_replace('[[size]]', $eventResult, $e['ok']));
            $this->lines[] = $line;
        }
        else {
            $this->lines[] = $e[$eventResult];
        }
    }
    public function update(string $event, bool|int $eventResult): void {
        $this->addLine($event, $eventResult);
    }
    public function report(): string {
        return implode("\n", $this->lines);
    }
}

$msgs = [
    'connect' =>[true => 'Connection opened', false => 'Connection failed'],
    'login' =>  [true=> 'Logged in', false=> 'Login failed'],
    'size' =>   ['n/a' => 'Op size n/a on server', 'ok' => "File is [[size]] bytes"],
    'get' =>    [true => 'File got', false => 'File not got'],
    'close' =>  [true => 'Closed', false => 'Close failed']
];

class FtpClient {
    private Ftp|null $ftp = null;
    private Reporter|null $reporter = null;
    private array $observers = [];
    public function __construct(Ftp $ftp) {
        $this->ftp = $ftp;
    }
    public function addObserver(Reporter $o) {
        $this->observers[] = $o;
    }
    public function notify(string $event, int|bool $result) {
        foreach ( $this->observers as $o )
            $o->update($event, $result);
    }
    public function init(string $remoteFile, string $localFile, int $mode=FTP_BINARY) {
        $this->ftp->setRemoteFile($remoteFile)->
            setLocalFile($localFile)->
            setMode($mode);
    }
    public function run(Config $cfg): void {
        $host = $cfg->item('host');
        $user = $cfg->item('user');
        $pass = $cfg->item('pass');

        $ok = $this->ftp->connect($host);
        $this->notify('connect', $ok);
        $ok = $this->ftp->login($user, $pass);
        $this->notify('login', $ok);
        $size = $this->ftp->size();
        $this->notify('size', $size);
        $ok = $this->ftp->get();
        $this->notify('get', $ok);
        $ok = $this->ftp->close();
        $this->notify('close', $ok);        
    }
    public function report() {
        $result = '';
        foreach ( $this->observers as $o )
            $result .= $o->report();
        return $result;
    }
}

$cfg = new Config(__DIR__ . '/config.php');

$ftpClient = new FtpClient(new Ftp());
$ftpClient->addObserver(new Reporter($msgs));
$ftpClient->init('ftp_test_orders.csv', 'temp-order.csv');
$ftpClient->run($cfg);
echo $ftpClient->report();
