<?php

class WebSocketFrame {
    private const MAGIC = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

    public static function handshake(string $request): ?string {
        if (!preg_match('/^GET\s+\S+\s+HTTP\/1\.[01]\r?$/m', $request)) {
            return null;
        }

        if (!preg_match('/^Sec-WebSocket-Key:\s*(.+)\r?$/mi', $request, $matches)) {
            return null;
        }

        if (!preg_match('/^Upgrade:\s*websocket\s*\r?$/mi', $request)) {
            return null;
        }

        $key = trim($matches[1]);

        if (base64_decode($key, true) === false || strlen(base64_decode($key, true)) !== 16) {
            return null;
        }

        $accept = base64_encode(sha1($key . self::MAGIC, true));

        return
            "HTTP/1.1 101 Switching Protocols\r\n" .
            "Upgrade: websocket\r\n" .
            "Connection: Upgrade\r\n" .
            "Sec-WebSocket-Accept: {$accept}\r\n\r\n";
    }

    public static function encode(string $message): string {
        $length = strlen($message);

        // FIN=1, opcode=1 (text frame).
        $frame = "\x81";

        if ($length <= 125) {
            $frame .= chr($length);
        } elseif ($length <= 65535) {
            $frame .= "\x7e" . pack('n', $length);
        } else {
            // Two 32-bit words: high word, then low word.
            $high = intdiv($length, 4294967296);
            $low = $length % 4294967296;
            $frame .= "\x7f" . pack('NN', $high, $low);
        }

        return $frame . $message;
    }

    public static function decode(string $frame): ?string {
        $length = strlen($frame);

        if ($length < 2) {
            return null;
        }

        $first = ord($frame[0]);
        $second = ord($frame[1]);

        $fin = ($first & 0x80) !== 0;
        $opcode = $first & 0x0F;
        $masked = ($second & 0x80) !== 0;
        $payloadLength = $second & 0x7F;
        $offset = 2;


        if (!$fin || !$masked) {
            return null;
        }

        // opcodes: text, ping, pong
        if (!in_array($opcode, [0x1, 0x9, 0xA], true)) {
            return null;
        }

        if ($payloadLength === 126) {
            if ($length < 4) {
                return null;
            }

            $payloadLength = unpack('n', substr($frame, 2, 2))[1];
            $offset = 4;
        } elseif ($payloadLength === 127) {
            // Keep the first version simple: reject 64-bit lengths.
            return null;
        }

        if ($length < $offset + 4 + $payloadLength) {
            return null;
        }

        $mask = substr($frame, $offset, 4);
        $offset += 4;

        $payload = substr($frame, $offset, $payloadLength);
        $decoded = '';

        for ($i = 0; $i < $payloadLength; $i++) {
            $decoded .= $payload[$i] ^ $mask[$i % 4];
        }

        return $decoded;
    }

    public static function readMessage(string $buffer): ?array {
        $length = strlen($buffer);

        if ($length < 2) {
            return null;
        }

        $first = ord($buffer[0]);
        $second = ord($buffer[1]);

        $fin = ($first & 0x80) !== 0;
        $opcode = $first & 0x0F;
        $masked = ($second & 0x80) !== 0;
        $payloadLength = $second & 0x7F;
        $offset = 2;

        // For now, accept complete, masked text frames only.
        if (!$fin || !in_array($opcode, [0x1, 0x9, 0xA], true) || !$masked) {
            throw new RuntimeException('Unsupported WebSocket frame');
        }

        if ($payloadLength === 126) {
            if ($length < 4) {
                return null;
            }

            $payloadLength = unpack('n', substr($buffer, 2, 2))[1];
            $offset = 4;
        } elseif ($payloadLength === 127) {
            throw new RuntimeException('Large WebSocket frames not supported yet');
        }

        // Wait until the mask and complete payload have arrived.
        if ($length < $offset + 4 + $payloadLength) {
            return null;
        }

        $mask = substr($buffer, $offset, 4);
        $offset += 4;

        $payload = substr($buffer, $offset, $payloadLength);
        $message = '';

        for ($i = 0; $i < $payloadLength; $i++) {
            $message .= $payload[$i] ^ $mask[$i % 4];
        }

        return [
            'message' => $message,
            'bytes' => $offset + $payloadLength,
        ];
    }
    public static function makePing(string $payload = ''): string {
        if (strlen($payload) > 125) {
            throw new InvalidArgumentException(
                'WebSocket ping payload cannot exceed 125 bytes'
            );
        }
        return "\x89" . chr(strlen($payload)) . $payload;
    }
}