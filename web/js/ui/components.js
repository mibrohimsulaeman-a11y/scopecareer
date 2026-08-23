import {Copy} from '../core/copy.js';

const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function badgeClass(status){return String(status).toLowerCase().replace(/\s+/g,'_')}

export function badge(status,{impact,confidence}={}){
  const cls=badgeClass(status);
  return `<span class="badge ${cls}" role="status" aria-label="${esc(Copy.dim('epistemic_display',cls)||status)}${impact?', '+esc(impact)+' impact':''}" data-epistemic="${esc(status)}">${esc(Copy.dim('epistemic_display',cls)||status)}${impact?`<span class="impact">${esc(impact)} impact</span>`:''}${confidence?`<span class="impact">${esc(confidence)} confidence</span>`:''}</span>`;
}
export function assertionRow(a){
  return `<div class="assertion-row" data-assertion="${esc(a.id)}">
    <div class="assertion-label">${esc(a.label)}</div>
    <div class="assertion-value"><strong>${esc(a.value)}</strong>
      <span class="assertion-source">${esc(a.source)}${a.observed&&a.observed!=='—'?` · ${esc(a.observed)}`:''}</span></div>
    <div class="assertion-status">${badge(a.status,{impact:a.impact,confidence:a.confidence})}</div>
  </div>`;
}
export function sourceTrail(rows){
  return rows.map(([name,date,used])=>`<div class="source-row" data-source="${esc(name)}"><span>${esc(name)}<small>${esc(used||'')}</small></span><time>${esc(date)}</time></div>`).join('');
}
export function decisionThesis(text){
  return `<p class="decision-line" data-decision-thesis>${esc(text)}</p>`;
}
export function unknownCard(u){
  return assertionRow({...u,status:u.status||'Open',source:u.source||'No direct evidence'});
}
export function tradeoffTable({columns,rows}){
  return `<table class="tradeoff-table" data-compare-table>
    <thead><tr><th>Dimension</th>${columns.map(c=>`<th>${esc(c.title)}<br><small>${esc(c.sub||'')}</small></th>`).join('')}</tr></thead>
    <tbody>${rows.map(r=>`<tr><th>${esc(r.dimension)}</th>${r.cells.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;
}
export function emptyState(msg){
  return `<div class="empty-state" data-empty-state>${esc(msg)}</div>`;
}
export function actionBtn({label,actionId,payload,variant='',note,disabled=false,title}){
  return `<button class="btn ${variant}" data-action="${esc(actionId)}" data-payload='${esc(JSON.stringify(payload||{}))}' ${disabled?'disabled':''} ${title?`title="${esc(title)}"`:''}>${esc(label)}</button>${note?`<span class="action-note">${esc(note)}</span>`:''}`;
}
export function eventLedgerItem(e){
  return `<div class="ledger-event" data-event="${esc(e.id)}">
    <div class="event-time"><strong>${esc(e.kind)}</strong><span>${esc(e.time)}</span></div>
    <div class="event-subject"><strong>${esc(e.subject)}</strong><span>${esc(e.sub||'')}</span></div>
    <div class="event-change">${esc(e.change)}</div>
    <div class="event-context"><strong>${esc(e.context||'')}</strong><span>${esc(e.detail||'')}</span></div>
    ${e.cta&&e.target?`<button class="text-btn" data-event-open="${esc(e.id)}">${esc(e.cta)} →</button>`:''}
  </div>`;
}
export function section(title,body,{attr=''}={}){
  return `<section class="detail-section" ${attr}><h3>${esc(title)}</h3>${body}</section>`;
}
export function guardrailNote(text='No outreach, application, or sharing occurs automatically.'){
  return `<p class="action-note" data-guardrail>${esc(text)}</p>`;
}
export const h={esc};

export function staleBanner(msg='Some evidence here is older than the rest of the picture. Re-check before deciding.'){
  return `<div class="banner stale" role="note" data-stale-banner><span>⏳</span><span>${esc(msg)}</span></div>`;
}
export function aiPending(label='Research pending'){
  return `<div class="ai-pending" role="status" data-ai-pending>${esc(label)} — findings appear here once processed.</div>`;
}
export function degradedBanner(){
  return `<div class="banner degraded" data-degraded-banner>This surface is designed for desktop. The mobile companion covers triage and follow-ups.</div>`;
}
export function errorCard(msg){
  return `<div class="banner error" role="alert" data-error-state><span>Something failed while rendering this view.</span><span class="action-note">${esc(msg||'')}</span><a class="btn quiet" href="#/">Go home</a></div>`;
}
