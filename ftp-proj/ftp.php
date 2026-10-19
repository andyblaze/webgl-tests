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
    private string $escape = '';

    public function __construct(Config $cfg) {
        $this->length = $cfg->item('csvLength');
        $this->separator = $cfg->item('csvSeparator');
        $this->enclosure = $cfg->item('csvEnclosure');
        $this->escape = $cfg->item('csvEscape');

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

class CsvProcessor {
    private CsvReader|null $reader = null;
    private Validator|null $valdidator = null;
    public function __construct(CsvReader $r, Validator $v) {
        $this->reader = $r;
        $this->valdidator = $v;
    }
    public function process(string $file): void {
        $this->reader->open($file);
        while ( ($line = $this->reader->readRow()) ) {
            $this->valdidator->check($line);
        }
        $this->reader->close();
    }
}

$cfg = new Config(__DIR__ . '/config-data.php');

$remoteFile = $cfg->item('remoteFile');
$localFile = $cfg->item('localFile');

$reporter = new Reporter($cfg);
$ftpClient = new FtpClient(new Ftp());
$ftpClient->addObserver($reporter);
$result = $ftpClient->run($cfg, new FtpResult());

if ( $result->ok() ) {
    $processor = new CsvProcessor(
        new CsvReader($cfg), 
        new Validator($cfg, $reporter)
    );
    $processor->process($localFile);
}

echo $ftpClient->report();
