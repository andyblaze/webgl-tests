<?php 

require_once(__DIR__ . '/utils.php');

require_these([
    'ftp-result',
    'config-class',
    'ftp-class',
    'reporter',
    'ftp-client'    
]);


$cfg = new Config(__DIR__ . '/config-data.php');

$remoteFile = $cfg->item('remoteFile');
$localFile = $cfg->item('localFile');

$ftpClient = new FtpClient(new Ftp());
$ftpClient->addObserver(new Reporter($cfg));
$result = $ftpClient->run($cfg, new FtpResult());
var_dump($result);
echo $ftpClient->report();
