import {runSelfCheck as wp0} from './checks/wp0.js';
import {runSelfCheck as wp1} from './checks/wp1.js';
import {runSelfCheck as wp2} from './checks/wp2.js';
import {runSelfCheck as wp3} from './checks/wp3.js';
import {runSelfCheck as wp4} from './checks/wp4.js';
import {runSelfCheck as wp5} from './checks/wp5.js';
// Integration note: further WP check modules are appended here as they land.

export async function runSelfCheck(){
  const steps=[['wp0',wp0],['wp1',wp1],['wp2',wp2],['wp3',wp3],['wp4',wp4],['wp5',wp5]];
  for(const [name,fn] of steps){
    try{await fn()}
    catch(e){
      const r=window.__scopeCareerSmokeReport||(window.__scopeCareerSmokeReport={checks:{},failed:[],errors:[]});
      r.errors.push(`${name}: ${e&&e.stack?String(e.stack).slice(0,500):String(e)}`);
    }
  }
  const r=window.__scopeCareerSmokeReport;
  r.complete=true;
  return r;
}
