<?php
$route = isset($_GET['route']) ? $_GET['route'] : '';
$queryString = isset($_SERVER['QUERY_STRING']) ? $_SERVER['QUERY_STRING'] : '';
$queryParams = [];
parse_str($queryString, $queryParams);
unset($queryParams['route']);
$newQueryString = http_build_query($queryParams);

// Try Unix socket first, then TCP port
$socketPath = '/home/u636711184/mrtraders-backend/server/mrtraders.sock';
$useTcp = false;

if (file_exists($socketPath)) {
    $targetUrl = 'http://localhost/api/' . $route . ($newQueryString ? '?' . $newQueryString : '');
} else {
    $targetUrl = 'http://127.0.0.1:3001/api/' . $route . ($newQueryString ? '?' . $newQueryString : '');
    $useTcp = true;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

// Connect via Unix socket if available
if (!$useTcp) {
    curl_setopt($ch, CURLOPT_UNIX_SOCKET_PATH, $socketPath);
}

curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);

$headers = [];
foreach (getallheaders() as $name => $value) {
    if (strcasecmp($name, 'Host') === 0) continue;
    $headers[] = "$name: $value";
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH'])) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

if (isset($_SERVER['HTTP_COOKIE'])) {
    curl_setopt($ch, CURLOPT_COOKIE, $_SERVER['HTTP_COOKIE']);
}

$response = curl_exec($ch);

if ($response === false) {
    $error = curl_error($ch);
    curl_close($ch);
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Backend unavailable: ' . $error]);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$responseHeaders = substr($response, 0, $headerSize);
$responseBody = substr($response, $headerSize);

http_response_code($httpCode);

foreach (explode("\r\n", $responseHeaders) as $header) {
    if (empty($header)) continue;
    if (stripos($header, 'Transfer-Encoding:') === 0) continue;
    if (stripos($header, 'HTTP/') === 0) continue;
    header($header);
}

echo $responseBody;
?>
