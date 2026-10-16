<?php 

final class FtpResult {
    public bool $success = false;
    public bool $downloaded = false;
    public int $remoteSize = -1;
    public int $localSize = 0;
    public string $error = '';
    public string $localFile = '';

    private function set(string $key, mixed $val): void {
        $this->$key = $val;
    }
    public function update(string $key, mixed $val) {
        $this->set($key, $val);
    }
}
