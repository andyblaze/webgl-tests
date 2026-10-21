<?php 

require_once(__DIR__ . '/utils.php');

require_these([
    'ftp-result',
    'config-class',
    'ftp-class',
    'reporter',
    'ftp-client',
    'validator',
    'csv-reader',
    'csv-processor'
]);




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
        new Validator($cfg, $reporter),
        $reporter
    );
    $processor->process($localFile);
}

echo $ftpClient->report();
