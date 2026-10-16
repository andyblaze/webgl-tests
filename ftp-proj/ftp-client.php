<?php 

class FtpClient {
    private Ftp|null $ftp = null;
    private FtpResult|null $result = null;
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
    public function run(Config $cfg, FtpResult $res): FtpResult {

        $this->result = $res;

        $host = $cfg->item('host');
        $user = $cfg->item('user');
        $pass = $cfg->item('pass');
        $remoteFile = $cfg->item('remoteFile');
        $localFile = $cfg->item('localFile');

        $this->init($remoteFile, $localFile);

        //$result = new FtpResult();

        $ok = $this->connectAndLogin($host, $user, $pass);
        $this->result->update('success', $ok);
        $remoteSize = 0;

        if ( $ok ) 
            $this->listFiles($remoteFile);

        if ( $ok ) 
            $remoteSize = $this->getRemoteFileSize();
        
        $this->result->update('remoteSize', $remoteSize);

        if ( $ok && ($remoteSize === -1 || $remoteSize > 0) ) 
            $ok = $this->getRemoteFile();

        $this->result->update('downloaded', $ok);

        if ( $ok && $remoteSize > 0 ) {
            $localSize = filesize($localFile);
            $this->notify('sizematch', $remoteSize === $localSize);
            $this->result->update('localFile', $localFile);
            $this->result->update('localSize', $localSize);
        }

        $closed = $this->ftp->close();
        $this->notify('close', $closed);
        return $this->result;     
    }
    public function report() {
        $result = '';
        foreach ( $this->observers as $o )
            $result .= $o->report();
        return $result;
    }
}
