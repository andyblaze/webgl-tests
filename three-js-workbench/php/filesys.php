<?php 
include('utils.php');

$data = json_decode(file_get_contents('php://input'), true);

$action = $data['action'];

if (IN_PRODUCTION && $action === 'export') {
    http_response_code(403);
    exit;
}

if ( $action === 'export' ) {
    $path = '../';
    $filename = strtolower(trim($data['fname']));
    $filename = str_replace([' ', '-'], '_', $filename);
    $filename = $path . 'presets/' . $filename  . '.json';
    $json = $data['json'];
    $ok = true;
    if ( false === file_exists($filename) ) $ok = $ok && touch($filename);
    $ok = $ok && file_put_contents($filename, json_encode($json));
    echo json_encode(['status'=>$ok]);
}

if ($action === 'import') {

    $baseDir = realpath(__DIR__ . '/../presets');
    $filename = strtolower(trim($data['fname']));

    // Allow only letters, numbers, dash and underscore
    if (!preg_match('/^[a-z0-9_-]+$/', $filename)) {
        http_response_code(400);
        exit;
    }

    $fullPath = realpath($baseDir . '/' . $filename . '.json');

    // Ensure resolved path is inside presets directory
    if ($fullPath === false || strpos($fullPath, $baseDir) !== 0) {
        http_response_code(403);
        exit;
    }

    if (!file_exists($fullPath)) {
        http_response_code(404);
        exit;
    }

    echo file_get_contents($fullPath);
}