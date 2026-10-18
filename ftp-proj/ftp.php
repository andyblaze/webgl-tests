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
    public function check(string $fname): bool {
        $data = file_get_contents($fname);
        unset($data);
        return true;
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
