<?php
error_reporting(E_ALL);

/* Allow the script to hang around waiting for connections. */
set_time_limit(0);

/* Turn on implicit output flushing so we see what we're getting
 * as it comes in. */
ob_implicit_flush();

require_once(__DIR__ . '/config.php');
require_once(__DIR__ . '/logger.php');
require_once(__DIR__ . '/message-handler.php');
require_once(__DIR__ . '/websocket-translator.php');
require_once(__DIR__ . '/connections.php');


$config = new Config();
$address = $config->item('address');
$port = $config->item('port');

$connections = new Connections($address, $port);
$connections->addLogger(new Reporter());
$connections->addMessageHandler(new MessageHandler());
//$connections->addTranslator(new WebSocketTranslator());
$connections->run();
