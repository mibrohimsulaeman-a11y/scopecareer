import {Store} from './core/store.js';
import {errorCard,degradedBanner} from './ui/components.js';

let routes=[];
export function registerRoutes(list){routes=routes.concat(list)}
function parseHash(){
  const raw=(location.hash||'#/').replace(/^#\/?/,'');
  const [pathPart,queryPart]=raw.split('?');
  const segments=pathPart.split('/').filter(Boolean);
  return {segments,query:new URLSearchParams(queryPart||'')};
}
function match(segments){
  for(const r of routes){
    const rs=r.path.replace(/^#?\/?/,'').split('/').filter(Boolean);
    if(rs.length!==segments.length)continue;
    const params={};
    const ok=rs.every((seg,i)=>seg.startsWith(':')?(params[seg.slice(1)]=segments[i],true):seg===segments[i]);
    if(ok)return {route:r,params};
  }
  return null;
}
async function render(){
  const app=document.getElementById('app');
  const {segments,query}=parseHash();
  const m=match(segments);
  Store.log('nav',{path:'#/'+segments.join('/'),matched:!!m});
  if(!m){app.innerHTML=`<div class="main"><div class="empty-state">Unknown route.</div></div>`;return}
  const shell=m.route.shell||defaultShell;
  const merged=new URLSearchParams(query);
  if(m.params)for(const [k,v] of Object.entries(m.params))merged.set(k,v);
  const smallScreen=window.matchMedia('(max-width:760px)').matches;
  const degraded=smallScreen&&Array.isArray(m.route.clients)&&!m.route.clients.includes('pwa');
  try{
    await m.route.mount({root:m.route.root||app.querySelector('.view-slot')||app,params:merged,shell});
    if(degraded&&!app.querySelector('[data-degraded-banner]')){
      const main=app.querySelector('.main');
      if(main)main.insertAdjacentHTML('afterbegin',degradedBanner());
    }
  }catch(err){
    console.warn('route mount failed',err);
    app.innerHTML=`<div class="app-shell"><aside class="sidebar"><div class="brand">ScopeCareer</div></aside><main class="main">${errorCard(String(err&&err.message||err))}</main></div>`;
    Store.log('render_error',{path:'#/'+segments.join('/'),message:String(err&&err.message||err)});
  }
}
function defaultShell(content,{activeNav}={}){
  return `<div class="app-shell">
    <aside class="sidebar" data-sidebar>
      <div class="brand">ScopeCareer</div>
      <nav aria-label="Primary">
        <button class="nav-item ${activeNav==='briefing'?'active':''}" data-nav="briefing">Briefing</button>
        <button class="nav-item ${activeNav==='opportunities'?'active':''}" data-nav="opportunities">Opportunities</button>
        <button class="nav-item ${activeNav==='career'?'active':''}" data-nav="career">Career</button>
        <button class="nav-item ${activeNav==='strategy'?'active':''}" data-nav="strategy">Strategy</button>
        <button class="nav-item ${activeNav==='settings'?'active':''}" data-nav="settings">Settings</button>
      </nav>
    </aside>
    <main class="main"><div class="view active">${content}</div></main>
  </div>`;
}
document.addEventListener('click',e=>{
  const nav=e.target.closest('[data-nav]');
  if(nav)location.hash='#/'+nav.dataset.nav;
});
window.addEventListener('hashchange',render);
export async function startRouter(){
  const v=await import('./views/index.js');
  registerRoutes(v.wp1Routes||[]);registerRoutes(v.wp2Routes||[]);
  registerRoutes(v.wp3Routes||[]);registerRoutes(v.wp4Routes||[]);
  await render();
}
export const Router={registerRoutes,routes:()=>routes,navigate:path=>{location.hash=path},_render:render};
