<?php 

require_once(__DIR__ . '/utils.php');

require_these([
    'ftp-result',
    'config-class',
    'ftp-class',
    'reporter',
    'ftp-client'    
]);

class Validator {
    private Reporter|null $reporter = null;
    /** @var resource|false */
    private $handle = false;
    public function __construct(Reporter $r) {
        $this->reporter = $r;
    }
    public function openFile(string $fname): bool {
        if ( file_exists($fname) && is_readable($fname) ) 
            $this->handle = fopen($fname, 'r');
        return is_resource($this->handle); 
    }
    private function isBlank(string $line) {
        if (  $line === '' )
            return;
    }
    public function check() {
        $rowCount = 0;
        $line = fgetcsv($this->handle, 2048);
        $line = trim($line);
    }
    public function closeFile(): bool {
        return fclose($this->handle);
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
    $valdidator = new Validator($reporter);
    $valdidator->check($result->localFile);
}

echo $ftpClient->report();
