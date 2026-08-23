#!/usr/bin/env python3
from __future__ import annotations
import json, os, shutil, socket, subprocess, tempfile, time, urllib.request
from contextlib import contextmanager
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
SCRATCH=Path('/dev/shm') if Path('/dev/shm').is_dir() and os.access('/dev/shm',os.W_OK) else Path(tempfile.gettempdir())
TARGET=SCRATCH/'scopecareer-validation-cdp.json'

def free_port():
    with socket.socket() as s:
        s.bind(('127.0.0.1',0)); return s.getsockname()[1]

def chrome_binary():
    for name in ['google-chrome','google-chrome-stable','chromium','chromium-browser']:
        if p:=shutil.which(name): return p
    raise RuntimeError('Chrome/Chromium not found')

@contextmanager
def browser_session():
    http_port,cdp_port=free_port(),free_port()
    profile=Path(tempfile.mkdtemp(prefix='scopecareer-chrome-',dir=SCRATCH))
    server=subprocess.Popen(['python3','-m','http.server',str(http_port),'--bind','127.0.0.1'],cwd=ROOT/'validation/prototype-v1',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    origin=f'http://127.0.0.1:{http_port}'; url=origin+'/'
    chrome=subprocess.Popen([chrome_binary(),'--headless=new',f'--remote-debugging-port={cdp_port}',f'--user-data-dir={profile}','--no-first-run','--no-default-browser-check','--disable-gpu',url],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        target=None
        for _ in range(300):
            try:
                with urllib.request.urlopen(f'http://127.0.0.1:{cdp_port}/json',timeout=.5) as r: rows=json.load(r)
                target=next((x for x in rows if x.get('type')=='page' and x.get('url','').startswith(origin+'/')),None)
                if target: break
            except Exception: pass
            time.sleep(.05)
        if not target: raise RuntimeError('CDP target did not become ready')
        TARGET.write_text(json.dumps(target))
        yield target
    finally:
        TARGET.unlink(missing_ok=True)
        for p in [chrome,server]:
            p.terminate()
            try:p.wait(timeout=3)
            except subprocess.TimeoutExpired:p.kill()
        shutil.rmtree(profile,ignore_errors=True)

def main():
    env=os.environ.copy();env['SCOPECAREER_CDP_TARGET']=str(TARGET)
    with browser_session():
        result=subprocess.run(['node','validation/prototype_smoke_cdp.mjs'],cwd=ROOT,text=True,capture_output=True,env=env)
        print(result.stdout,end='')
        if result.stderr: print(result.stderr,end='',file=__import__('sys').stderr)
        raise SystemExit(result.returncode)
if __name__=='__main__':main()
