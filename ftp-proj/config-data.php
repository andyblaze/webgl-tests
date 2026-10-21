<?php 

$config['host'] = '127.0.0.1';
$config['user'] = 'andy';
$config['pass'] = 'roe09';

$config['remoteFile'] = 'ftp_test_orders.csv';
$config['localFile'] = 'temp-order.csv';

$config['reporterMessages'] = [
    'ftp_connect' =>    ['FTP: connection failed', 'FTP: connection opened'],
    'ftp_login' =>      ['FTP: login failed', 'FTP: logged in'],
    'ftp_filelist'=>    [-1=> 'FTP: remote listing failed', 'FTP: remote file not listed', 'FTP: remote file exists'],
    'ftp_size' =>       ['FTP: operation size n/a on server', "FTP: remote file is [[size]] bytes"],
    'sizematch'=>       ['Remote and local file sizes mismatch', 'Remote and local file sizes match'],
    'ftp_get' =>        ['FTP: file not downloaded', 'FTP: file downloaded'],
    'ftp_close' =>      ['FTP: connection close failed', 'FTP: connection closed'],
    'file_open' =>      ['FILE: open failed', 'FILE: opened ok'],
    'file_close' =>     ['FILE: close failed', 'FILE: closed ok']
];

$config['reporterErrors'] = [
    'headerOk' => (object)['found' => 0, 'row' => 0, 'message' => 'Header OK:'],
    'blankLine' => (object)['found' => 0, 'row' => 0, 'message' => 'Blank lines:'],
    'countMismatch' => (object)['found' => 0, 'row' => 0, 'message' => 'Column mismatches:'],
    'emptyFields' => (object)['found' => 0, 'row' => 0, 'message' => 'Empty fields:']
];


$config['csvLength'] = 2048;
$config['csvSeparator'] = ',';
$config['csvEnclosure'] = '"';
$config['csvEscape'] = '';


$config['rules'] = [
    'has_header' => true,
    'columns' => [
        'order_id' => [
            'type' => 'string'
        ],
        'order_date' => [
            'type' => 'string'
        ],
        'customer_id' => [
            'type' => 'string'
        ],
        'customer_name' => [
            'type' => 'string'
        ],
        'city' => [
            'type' => 'string'
        ],
        'category' => [
            'type' => 'string'
        ],
        'product_code' => [
            'type' => 'string'
        ],
        'product_name' => [
            'type' => 'string'
        ],
        'quantity' => [
            'type' => 'int'
        ],
        'unit_price_gbp' => [
            'type' => 'float'
        ],
    ]
];

$config['policy'] = [
    'max_issues' => 5,
    'allow_blank_rows' => true,
    'allow_extra_columns' => false,
    'stop_on_first_error' => false,
];
