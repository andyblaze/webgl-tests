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
    public function __construct() { }
    public function check(string $fname): bool {
        $data = file_get_contents($fname);
        unset($data);
        return true;
    }
}


$cfg = new Config(__DIR__ . '/config-data.php');

$remoteFile = $cfg->item('remoteFile');
$localFile = $cfg->item('localFile');

$ftpClient = new FtpClient(new Ftp());
$ftpClient->addObserver(new Reporter($cfg));
$result = $ftpClient->run($cfg, new FtpResult());

if ( $result->ok() ) {
    $valdidator = new Validator();
    $valdidator->check($result->localFile);
}

echo $ftpClient->report();
