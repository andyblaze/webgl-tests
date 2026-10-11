
<?php

class WebSocketTranslator implements Translator {
    private array $buffers = [];
    private array $connected = [];
    private array $fragments = [];
    private array $fragmenting = [];

    public function accept(int $id): void {
        $this->buffers[$id] = '';
        $this->connected[$id] = false;
        $this->fragments[$id] = '';
        $this->fragmenting[$id] = false;
    }

    public function receive(int $id, string $data, MessageHandler $handler, MessageContext $context): void {
        if (!isset($this->buffers[$id])) {
            $this->accept($id);
        }

        $this->buffers[$id] .= $data;

        // Prevent unbounded buffering of incomplete input.
        if (strlen($this->buffers[$id]) > 1_048_576) {
            $this->fail($id, $context, 1009);
            return;
        }

        if (!$this->connected[$id]) {
            if (!$this->handshake($id, $context)) {
                return;
            }
        }

        while (isset($this->buffers[$id])) {
            $frame = $this->extractFrame($id);

            if ($frame === null) {
                return; // Need more TCP data.
            }

            [$opcode, $fin, $payload] = $frame;

            switch ($opcode) {
                case 0x1: // Text
                    if ($this->fragmenting[$id]) {
                        $this->fail($id, $context, 1002);
                        return;
                    }

                    if ($fin) {
                        if (!$this->validUtf8($payload)) {
                            $this->fail($id, $context, 1007);
                            return;
                        }

                        $handler->handle($id, $payload, $context);
                    } else {
                        $this->fragments[$id] = $payload;
                        $this->fragmenting[$id] = true;
                    }
                    break;

                case 0x0: // Continuation
                    if (!$this->fragmenting[$id]) {
                        $this->fail($id, $context, 1002);
                        return;
                    }

                    $this->fragments[$id] .= $payload;

                    if (strlen($this->fragments[$id]) > 1_048_576) {
                        $this->fail($id, $context, 1009);
                        return;
                    }

                    if ($fin) {
                        $message = $this->fragments[$id];
                        $this->fragments[$id] = '';
                        $this->fragmenting[$id] = false;

                        if (!$this->validUtf8($message)) {
                            $this->fail($id, $context, 1007);
                            return;
                        }

                        $handler->handle($id, $message, $context);
                    }
                    break;

                case 0x8: // Close
                    $context->sendRawTo(
                        $id,
                        $this->frame(0x8, $payload)
                    );
                    $context->disconnect($id);
                    return;

                case 0x9: // Ping
                    $context->sendRawTo(
                        $id,
                        $this->frame(0xA, $payload)
                    );
                    break;

                case 0xA: // Pong
                    // Protocol housekeeping; nothing to do.
                    break;

                default:
                    // Binary and unsupported opcodes.
                    $this->fail($id, $context, 1003);
                    return;
            }
        }
    }

    public function send(int $id, string $message, MessageContext $context): void {
        if (!($this->connected[$id] ?? false)) {
            return;
        }

        if (!$this->validUtf8($message)) {
            $this->fail($id, $context, 1011);
            return;
        }

        $context->sendRawTo($id, $this->frame(0x1, $message));
    }

    public function removeBuffer(int $id): void {
        unset(
            $this->buffers[$id],
            $this->connected[$id],
            $this->fragments[$id],
            $this->fragmenting[$id]
        );
    }

    private function handshake(int $id, MessageContext $context): bool {
        $end = strpos($this->buffers[$id], "\r\n\r\n");

        if ($end === false) {
            return false;
        }

        $headers = substr($this->buffers[$id], 0, $end);
        $this->buffers[$id] = substr($this->buffers[$id], $end + 4);

        $lines = explode("\r\n", $headers);
        $request = array_shift($lines);

        if (!preg_match(
            '#^GET\s+\S+\s+HTTP/1\.[01]$#',
            $request ?? ''
        )) {
            $this->fail($id, $context, 1002);
            return false;
        }

        $headersMap = [];

        foreach ($lines as $line) {
            $parts = explode(':', $line, 2);

            if (count($parts) === 2) {
                $headersMap[strtolower(trim($parts[0]))]
                    = trim($parts[1]);
            }
        }

        $key = $headersMap['sec-websocket-key'] ?? '';
        $upgrade = strtolower($headersMap['upgrade'] ?? '');
        $connection = strtolower($headersMap['connection'] ?? '');
        $version = $headersMap['sec-websocket-version'] ?? '';

        if (
            $key === ''
            || base64_decode($key, true) === false
            || strlen(base64_decode($key, true)) !== 16
            || $upgrade !== 'websocket'
            || !str_contains($connection, 'upgrade')
            || $version !== '13'
        ) {
            $context->sendRawTo($id, "HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
            $context->disconnect($id);
            return false;
        }

        $accept = base64_encode(
            sha1(
                $key . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
                true
            )
        );

        $response =
            "HTTP/1.1 101 Switching Protocols\r\n"
            . "Upgrade: websocket\r\n"
            . "Connection: Upgrade\r\n"
            . "Sec-WebSocket-Accept: $accept\r\n\r\n";

        $context->sendRawTo($id, $response);
        $this->connected[$id] = true;

        return true;
    }

    private function extractFrame(int $id): ?array {
        $buffer = &$this->buffers[$id];
        $length = strlen($buffer);

        if ($length < 2) {
            return null;
        }

        $b1 = ord($buffer[0]);
        $b2 = ord($buffer[1]);

        $fin = ($b1 & 0x80) !== 0;
        $opcode = $b1 & 0x0F;
        $masked = ($b2 & 0x80) !== 0;
        $payloadLength = $b2 & 0x7F;

        // Client-to-server frames must be masked.
        if (($b1 & 0x70) !== 0 || !$masked) {
            throw new RuntimeException('Invalid WebSocket frame');
        }

        $offset = 2;

        if ($payloadLength === 126) {
            if ($length < 4) {
                return null;
            }

            $payloadLength = unpack('n', substr($buffer, 2, 2))[1];
            $offset = 4;
        } 
        elseif ($payloadLength === 127) {
            if ($length < 10) {
                return null;
            }

            $parts = unpack('Nhigh/Nlow', substr($buffer, 2, 8));

            // This implementation deliberately limits frame sizes.
            if ($parts['high'] !== 0 || $parts['low'] > 1_048_576) {
                throw new RuntimeException('Frame too large');
            }

            $payloadLength = $parts['low'];
            $offset = 10;
        }

        if ($payloadLength > 1_048_576) {
            throw new RuntimeException('Frame too large');
        }

        // Control frames must be final and at most 125 bytes.
        if ($opcode >= 0x8 && (!$fin || $payloadLength > 125)) {
            throw new RuntimeException('Invalid control frame');
        }

        if ($length < $offset + 4 + $payloadLength) {
            return null;
        }

        $mask = substr($buffer, $offset, 4);
        $offset += 4;

        $payload = substr($buffer, $offset, $payloadLength);
        $buffer = substr($buffer, $offset + $payloadLength);

        for ($i = 0; $i < $payloadLength; $i++) {
            $payload[$i] = $payload[$i]
                ^ $mask[$i % 4];
        }

        return [$opcode, $fin, $payload];
    }

    private function frame(int $opcode, string $payload): string {
        $length = strlen($payload);
        $header = chr(0x80 | $opcode);

        if ($length < 126) {
            $header .= chr($length);
        } elseif ($length <= 65535) {
            $header .= chr(126) . pack('n', $length);
        } else {
            $header .= chr(127) . pack('NN', 0, $length);
        }

        // Server-to-client frames are not masked.
        return $header . $payload;
    }

    private function validUtf8(string $value): bool {
        return preg_match('//u', $value) === 1;
    }

    private function fail(int $id, MessageContext $context, int $code): void {
        $context->sendRawTo($id, $this->frame(0x8, pack('n', $code)));
        $context->disconnect($id);
    }
}