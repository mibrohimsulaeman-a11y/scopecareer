import {Contracts} from './core/contracts.js';
import {Store} from './core/store.js';
import {Actions} from './core/actions.js';
import {Copy} from './core/copy.js';
import {Fixtures} from '../fixtures/index.js';
import {startRouter} from './router.js';

const params=new URLSearchParams(location.search);
Store.init(Fixtures.load('base'));
window.__scopeCareerState={snapshot:Store.snapshot,Actions,Copy,Contracts};

await Contracts.ready();
await startRouter();

try{
  const link=document.createElement('link');link.rel='manifest';link.href='./manifest.webmanifest';
  document.head.appendChild(link);
  if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{})}
}catch(e){/* PWA decoration must never break the app */}

if(params.get('selfcheck')==='1'){
  const banner=document.createElement('div');
  banner.className='selfcheck-banner';banner.textContent='SELFCHECK';
  document.body.appendChild(banner);
  const mod=await import('../tests/selfcheck.js');
  await mod.runSelfCheck();
}

