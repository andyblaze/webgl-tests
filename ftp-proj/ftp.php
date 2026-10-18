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

$rules = [
    'has_header' => true,
    'delimiter' => ',',
    'expected_columns' => 4,
//order_id,order_date,customer_id,customer_name,city,category,product_code,product_name,quantity,unit_price_gbp
//ORD-1001,2026-01-05,CUST-201,Northwind Books,Leeds,BOOK,BK-014,Field Guide to Birds,2,19.99
    'columns' => [
        'order_id' => [
            'type' => 'int',
            'required' => true,
        ],
        'customer' => [
            'type' => 'string',
            'required' => true,
        ],
        'quantity' => [
            'type' => 'int',
            'required' => true,
        ],
        'price' => [
            'type' => 'float',
            'required' => true,
        ],
    ],
];

$policy = [
    'max_issues' => 5,
    'allow_blank_rows' => true,
    'allow_extra_columns' => false,
    'stop_on_first_error' => false,
];

class CsvReader {
    /** @var resource|false */
    private $handle = false;

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
        return fgetcsv($this->handle);
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
