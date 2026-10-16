<?php 

$config['host'] = '127.0.0.1';
$config['user'] = 'andy';
$config['pass'] = 'roe09';

$config['remoteFile'] = 'ftp_test_orders.csv';
$config['localFile'] = 'temp-order.csv';

$config['reporterMessages'] = [
    'connect' =>[true => 'Connection opened', false => 'Connection failed'],
    'login' =>  [true=> 'Logged in', false=> 'Login failed'],
    'filelist'=>[true=> 'File exists', false=> 'File not listed', -1=> 'Listing failed'],
    'size' =>   ['n/a' => 'Op size n/a on server', 'ok' => "File is [[size]] bytes"],
    'sizematch'=>[true => 'File sizes match', false => 'File size mismatch'],
    'get' =>    [true => 'File got', false => 'File not got'],
    'close' =>  [true => 'Connection closed', false => 'Connection close failed']
];
