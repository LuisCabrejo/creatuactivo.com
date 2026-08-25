#!/usr/bin/env node
/**
 * Mide las 40 consultas coloquiales contra PRODUCCIÓN (tenant whatsapp),
 * donde compiten TODOS los arsenales — no solo arsenal_inicial.
 * El arnés de laboratorio (experimento-indice-recuperacion.mjs) solo enfrenta
 * los 58 de arsenal_inicial, así que sobreestima. Esta es la cifra real.
 */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
const env=readFileSync('.env.local','utf8'); const g=k=>env.match(new RegExp(`${k}=(.+)`))[1].trim();
const s=createClient(g('NEXT_PUBLIC_SUPABASE_URL'),g('SUPABASE_SERVICE_ROLE_KEY'));
const KEY=g('VOYAGE_API_KEY');
const cos=(a,b)=>{let d=0,x=0,y=0;for(let i=0;i<a.length;i++){d+=a[i]*b[i];x+=a[i]**2;y+=b[i]**2;}return d/(Math.sqrt(x)*Math.sqrt(y));};
async function emb(ts){const o=[];for(let i=0;i<ts.length;i+=64){const r=await fetch('https://api.voyageai.com/v1/embeddings',{method:'POST',headers:{Authorization:`Bearer ${KEY}`,'Content-Type':'application/json'},body:JSON.stringify({input:ts.slice(i,i+64),model:'voyage-3-lite',output_dimension:512,input_type:'query'})});const j=await r.json();o.push(...j.data.sort((a,b)=>a.index-b.index).map(d=>d.embedding));await new Promise(r=>setTimeout(r,250));}return o;}
const CASOS=[['pero bueno y esto en qué consiste, cómo es que funciona','WHY_02'],['no entiendo bien de qué se trata el negocio','WHY_02'],['yo tengo un sueldo bueno, para qué me meto en esto','WHY_03'],['ya gano bien en mi trabajo la verdad','WHY_03'],['y yo qué vengo siendo ahí, qué papel juego','WHY_ROL_01'],['puedo hacerlo sin renunciar a mi trabajo?','FREQ_15'],['sirve si no pienso dejar mi empleo','FREQ_15'],['cual me aconseja para arrancar','FREQ_30'],['no se cual escoger de los tres','FREQ_30'],['estoy cansado la plata no me alcanza nunca','STORY_03'],['eso tiene registro sanitario o es cuento','FREQ_07'],['los productos si son de verdad?','FREQ_07'],['y si pierdo la plata que meti','CRED_04'],['que garantia hay de no perder el dinero','CRED_04'],['que es lo que se vende exactamente','WHY_PROD_01'],['esto es vender cafe o que','WHY_PROD_01'],['que me toca hacer a mi todos los dias','EAM_01'],['cual es mi trabajo dia a dia','EAM_01'],['puedo salirme cuando quiera o hay contrato','FREQ_18'],['hay permanencia obligatoria?','FREQ_18'],['la verdad no tengo tiempo para nada','OBJ_01'],['yo vivo en españa pero soy colombiano, sirve?','DIASPORA_01'],['como me pagan, en plata o en producto','FREQ_17'],['cada cuanto me consignan','FREQ_17'],['esto es piramide?','FREQ_13'],['es legal esto en colombia','FREQ_13'],['tengo que comprar todos los meses?','FREQ_09'],['hay una cuota mensual obligatoria','FREQ_09'],['hay capacitacion o me dejan solo','FREQ_08'],['de donde sale la plata realmente','WHY_04'],['quien me paga a mi','WHY_04'],['yo ya hice multinivel antes y no funciono','NET_01'],['ya tuve codigo de gano excel','NET_02'],['como se paga, aceptan tarjeta','FREQ_31'],['el mercado no esta saturado ya?','FREQ_16'],['tengo que molestar a mis amigos?','FREQ_02'],['esto le queda a mis hijos?','FREQ_05'],['es mucha plata no puedo pagarlo','OBJ_02'],['quien esta detras de esto','CRED_01'],['cuanto lleva la empresa funcionando','CRED_02']];
const {data}=await s.from('nexus_documents').select('category,content,embedding_512').eq('tenant_id','whatsapp').not('embedding_512','is',null);
const docs=data.map(d=>({c:d.category,e:JSON.parse(d.embedding_512),lock:d.content.includes('<verbatim_lock>')}));
console.log(`corpus en producción: ${docs.length} fragmentos · ${CASOS.length} consultas\n`);
const E=await emb(CASOS.map(c=>c[0]));
let t1=0,t3=0,mg=0; const fallos=[];
CASOS.forEach(([q,esp],i)=>{
  const r=docs.map(d=>({c:d.c,s:cos(E[i],d.e),lock:d.lock})).sort((a,b)=>b.s-a.s);
  const rk=r.findIndex(x=>x.c.endsWith('_'+esp))+1;
  const sc=r.find(x=>x.c.endsWith('_'+esp))?.s??0;
  mg += r[0].c.endsWith('_'+esp) ? r[0].s-r[1].s : sc-r[0].s;
  if(rk===1)t1++; if(rk<=3&&rk>0)t3++;
  if(rk!==1) fallos.push({q,esp,rk,sc,g:r[0].c,gs:r[0].s,gl:r[0].lock});
});
console.log(`acierto puesto 1 : ${t1}/${CASOS.length}`);
console.log(`acierto top 3    : ${t3}/${CASOS.length}`);
console.log(`margen medio     : ${(mg/CASOS.length).toFixed(3)}`);
if(fallos.length){console.log('\nno ganan el puesto 1:');
 fallos.forEach(f=>console.log(`  ${f.rk?('#'+f.rk).padStart(4):' —  '} ${f.esp.padEnd(16)} "${f.q}"\n       gana ${f.g}${f.gl?' 🔒':''} (${f.gs.toFixed(3)}) · el correcto ${f.sc.toFixed(3)}`));}
