<?php 

final class FtpResult {
    public bool $success = false;
    public bool $downloaded = false;
    public int $fileSize = -1;
    public string $error = '';
    public string $localFile = '';

    public function set(string $key, mixed $val): void {
        $this->$key = $val;
    }
}

class FtpClient {
    private Ftp|null $ftp = null;
    private array $observers = [];
    public function __construct(Ftp $ftp) {
        $this->ftp = $ftp;
    }
    public function addObserver(Reporter $o) {
        $this->observers[] = $o;
    }
    public function notify(string $event, int|bool $result) {
        foreach ( $this->observers as $o )
            $o->update($event, $result);
    }
    public function init(string $remoteFile, string $localFile, int $mode=FTP_BINARY) {
        $this->ftp->setRemoteFile($remoteFile)->
            setLocalFile($localFile)->
            setMode($mode);
    }
    private function connectAndLogin(string $host, string $user, string $pass): bool {
        $ok = $this->ftp->connect($host);
        $this->notify('connect', $ok);
        if ( false === $ok ) return false;

        $ok = $this->ftp->login($user, $pass);
        $this->notify('login', $ok);
        return $ok;
    }
    private function getRemoteFileSize() {
        $size = $this->ftp->size();
        $this->notify('size', $size);
        return $size;
    }
    private function getRemoteFile() {
        $ok = $this->ftp->get();
        $this->notify('get', $ok);
        return $ok;
    }
    private function listFiles(string $toFind) {
        $fileList = $this->ftp->listFiles();
        if ( is_array($fileList) ) {
            $exists = in_array($toFind, $fileList, true);
            $this->notify('filelist', $exists);  
        }
        else 
            $this->notify('filelist', -1);      
    }
    public function run(Config $cfg): FtpResult {
        $host = $cfg->item('host');
        $user = $cfg->item('user');
        $pass = $cfg->item('pass');

        $remoteFile = $cfg->item('remoteFile');
        $localFile = $cfg->item('localFile');

        $this->init($remoteFile, $localFile);

        $result = new FtpResult();

        $ok = $this->connectAndLogin($host, $user, $pass);
        $result->set('success', $ok);
        $size = 0;

        if ( $ok ) 
            $this->listFiles($remoteFile);

        if ( $ok ) 
            $size = $this->getRemoteFileSize();
        
        $result->set('fileSize', $size);

        if ( $ok && ($size === -1 || $size > 0) ) 
            $ok = $this->getRemoteFile();

        $result->set('downloaded', $ok);

        if ( $ok && $size > 0 ) {
            $this->notify('sizematch', $size === filesize($localFile));
            $result->set('localFile', $localFile);
        }

        $closed = $this->ftp->close();
        $this->notify('close', $closed);
        return $result;     
    }
    public function report() {
        $result = '';
        foreach ( $this->observers as $o )
            $result .= $o->report();
        return $result;
    }
}
