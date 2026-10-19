<?php 

require_once(__DIR__ . '/utils.php');

require_these([
    'ftp-result',
    'config-class',
    'ftp-class',
    'reporter',
    'ftp-client',
    'validator'
]);

class CsvReader {
    /** @var resource|false */
    private $handle = false;
    private int $length = 2048;
    private string $separator = ',';
    private string $enclosure = '"';
    private string $escape = '\\';

    public function __construct(Config $cfg) {
        $val = (object)$cfg->item('readerCfg');
        $this->length = $val->length;
        $this->separator = $val->separator;
        $this->enclosure = $val->separator;
        $this->escape = $val->escape;

    }
    public function open(string $file): bool {
        if ( !is_file($file) || !is_readable($file) ) {
            return false;
        }
        $this->handle = fopen($file, 'r');
        return is_resource($this->handle);
    }
    public function readRow(): array|false {
        if ( false === $this->handle) {
            return false;
        }
        return fgetcsv($this->handle, $this->length, $this->separator, $this->enclosure, $this->escape);
    }
    public function close(): bool {
        $result = true;
        if ( is_resource($this->handle) ) {
            $result = fclose($this->handle);
            $this->handle = false;
        }
        return $result;
    }
}

$cfg = new Config(__DIR__ . '/config-data.php');

$f = $cfg->item('localFile');
$r = new CsvReader($cfg);
var_dump($r->open($f));
var_dump($r->readRow());
var_dump($r->close());
die;

$remoteFile = $cfg->item('remoteFile');
$localFile = $cfg->item('localFile');

$reporter = new Reporter($cfg);
$ftpClient = new FtpClient(new Ftp());
$ftpClient->addObserver($reporter);
$result = $ftpClient->run($cfg, new FtpResult());

if ( $result->ok() ) {
    $valdidator = new Validator($reporter);
    $valdidator->openFile($result->localFile);
}

echo $ftpClient->report();
