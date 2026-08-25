import {readFileSync} from 'fs';
const KEY = readFileSync('.env.local','utf8').match(/VOYAGE_API_KEY=(.+)/)[1].trim();
const cos=(a,b)=>{let d=0,x=0,y=0;for(let i=0;i<a.length;i++){d+=a[i]*b[i];x+=a[i]**2;y+=b[i]**2;}return d/(Math.sqrt(x)*Math.sqrt(y));};
async function embed(ts,it){const o=[];for(let i=0;i<ts.length;i+=64){const r=await fetch('https://api.voyageai.com/v1/embeddings',{method:'POST',headers:{'Authorization':`Bearer ${KEY}`,'Content-Type':'application/json'},body:JSON.stringify({input:ts.slice(i,i+64).map(t=>t.substring(0,8000)),model:'voyage-3-lite',output_dimension:512,input_type:it})});const j=await r.json();if(!j.data){console.error(j);throw 0;}o.push(...j.data.sort((a,b)=>a.index-b.index).map(d=>d.embedding));await new Promise(r=>setTimeout(r,250));}return o;}

// ── ÍNDICES ESCRITOS A PROPÓSITO para los 12 fragmentos con falla conocida ──
// Regla: se escriben con las palabras que la PERSONA usa, no con las nuestras.


const content = readFileSync('knowledge_base/arsenal_inicial.txt','utf8');
const secs = content.split(/(?=###\s+\*?\*?[A-Z]+(?:_[A-Z0-9]+)*_(?:\d+|OVERVIEW|PUENTE))/);
const frags=[];
for (const raw of secs){
  if(!raw.trim()||!raw.includes('###')) continue;
  let sec=raw; const ci=sec.search(/\n##\s+CHANGELOG/i); if(ci>0) sec=sec.slice(0,ci);
  const hm=sec.match(/###\s*\*?\*?([A-Z]+(?:_[A-Z0-9]+)*_(?:\d+|OVERVIEW|PUENTE)):?\s*"?([^"\n*]+)/); if(!hm) continue;
  const id=hm[1].trim(), q=hm[2].trim();
  // Separa las TRES piezas. Sin esto, tras insertar los índices en el .txt la
  // línea base «A: hoy» los incluía y dejaba de ser la línea base real.
  const lines=sec.split('\n'); let head=[],idx=[],body=[],en=null;
  for(const l of lines.slice(1)){
    if(l.startsWith('**[Concepto Nuclear]')){en='h';head.push(l);continue;}
    if(l.startsWith('**[Índice]')){en='i';idx.push(l);continue;}
    if(en){ if(l.trim()===''||l.startsWith('**[')){en=null;} else {(en==='h'?head:idx).push(l); continue;} }
    if(l.startsWith('**[Concepto Nuclear]')){en='h';head.push(l);continue;}
    if(l.startsWith('**[Índice]')){en='i';idx.push(l);continue;}
    body.push(l);
  }
  const idxTxt=idx.join('\n').replace(/^\*\*\[Índice\]:\*\*\s*/,'').trim();
  const conCab=[head.join('\n'),body.join('\n')].filter(Boolean).join('\n\n').split('\n---')[0].trim();
  const cuerpo=body.join('\n').split('\n---')[0].trim();
  if(conCab.length<50) continue;
  const limpio=cuerpo.replace(/\*\*Pregunta de seguimiento[\s\S]*$/,'').replace(/<\/?verbatim_lock>/g,'').trim();
  frags.push({id,q,conCab,cuerpo,indice:idxTxt,dosFrases:limpio.split(/(?<=\.)\s+/).slice(0,2).join(' ')});
}
const CASOS=[['pero bueno y esto en qué consiste, cómo es que funciona','WHY_02'],['no entiendo bien de qué se trata el negocio','WHY_02'],['yo tengo un sueldo bueno, para qué me meto en esto','WHY_03'],['ya gano bien en mi trabajo la verdad','WHY_03'],['y yo qué vengo siendo ahí, qué papel juego','WHY_ROL_01'],['puedo hacerlo sin renunciar a mi trabajo?','FREQ_15'],['sirve si no pienso dejar mi empleo','FREQ_15'],['cual me aconseja para arrancar','FREQ_30'],['no se cual escoger de los tres','FREQ_30'],['estoy cansado la plata no me alcanza nunca','STORY_03'],['eso tiene registro sanitario o es cuento','FREQ_07'],['los productos si son de verdad?','FREQ_07'],['y si pierdo la plata que meti','CRED_04'],['que garantia hay de no perder el dinero','CRED_04'],['que es lo que se vende exactamente','WHY_PROD_01'],['esto es vender cafe o que','WHY_PROD_01'],['que me toca hacer a mi todos los dias','EAM_01'],['cual es mi trabajo dia a dia','EAM_01'],['puedo salirme cuando quiera o hay contrato','FREQ_18'],['hay permanencia obligatoria?','FREQ_18'],['la verdad no tengo tiempo para nada','OBJ_01'],['yo vivo en españa pero soy colombiano, sirve?','DIASPORA_01'],['como me pagan, en plata o en producto','FREQ_17'],['cada cuanto me consignan','FREQ_17'],['esto es piramide?','FREQ_13'],['es legal esto en colombia','FREQ_13'],['tengo que comprar todos los meses?','FREQ_09'],['hay una cuota mensual obligatoria','FREQ_09'],['hay capacitacion o me dejan solo','FREQ_08'],['de donde sale la plata realmente','WHY_04'],['quien me paga a mi','WHY_04'],['yo ya hice multinivel antes y no funciono','NET_01'],['ya tuve codigo de gano excel','NET_02'],['como se paga, aceptan tarjeta','FREQ_31'],['el mercado no esta saturado ya?','FREQ_16'],['tengo que molestar a mis amigos?','FREQ_02'],['esto le queda a mis hijos?','FREQ_05'],['es mucha plata no puedo pagarlo','OBJ_02'],['quien esta detras de esto','CRED_01'],['cuanto lleva la empresa funcionando','CRED_02']];

const qE=await embed(CASOS.map(c=>c[0]),'query');
// A: hoy · D: disparadores+2 frases · E: disparadores+índice (fallback 2 frases) · F: E + cuerpo
const A=await embed(frags.map(f=>`${f.q}\n\n${f.conCab}`),'document');
const D=await embed(frags.map(f=>`${f.q}\n\n${f.dosFrases}`),'document');
const E=await embed(frags.map(f=>`${f.q}\n\n${f.indice||f.dosFrases}`),'document');
const F=await embed(frags.map(f=>`${f.q}\n\n${f.indice||f.dosFrases}\n\n${f.cuerpo}`),'document');

function ev(de){let t1=0,t3=0,sc=0,mg=0;const det=[];
  CASOS.forEach(([q,esp],i)=>{const r=frags.map((f,j)=>({id:f.id,s:cos(qE[i],de[j])})).sort((a,b)=>b.s-a.s);
    const rk=r.findIndex(x=>x.id===esp)+1, s=r.find(x=>x.id===esp)?.s??0;
    mg += r[0].id===esp ? r[0].s-r[1].s : s-r[0].s;
    if(rk===1)t1++; if(rk<=3)t3++; sc+=s; det.push({q,esp,rk,s,g:r[0].id});});
  return {t1,t3,sc:sc/CASOS.length,mg:mg/CASOS.length,det};}
const R={A:ev(A),D:ev(D),E:ev(E),F:ev(F)};
console.log('\n'+'═'.repeat(92));
console.log('RESULTADO'.padEnd(30)+['A: hoy','D: +2 frases','E: +índice','F: índice+cuerpo'].map(x=>x.padStart(15)).join(''));
console.log('─'.repeat(92));
const f2=(n,v,fmt=x=>x.toFixed(3))=>console.log(n.padEnd(30)+v.map(x=>fmt(x).padStart(15)).join(''));
f2('Acierto puesto 1',['A','D','E','F'].map(k=>R[k].t1),x=>`${x}/40`);
f2('Acierto top 3',['A','D','E','F'].map(k=>R[k].t3),x=>`${x}/40`);
f2('Score medio',['A','D','E','F'].map(k=>R[k].sc));
f2('Margen sobre el 2º',['A','D','E','F'].map(k=>R[k].mg));
console.log('═'.repeat(92));
console.log('\nCambios de puesto (A → E):');
R.A.det.forEach((a,i)=>{const f=R.E.det[i]; if(f.rk===a.rk)return;
  const fl=f.rk<a.rk?'✅':f.rk>a.rk?'❌':'  ';
  console.log(`${fl} "${a.q}" → ${a.esp}:  puesto ${a.rk} → ${f.rk}   (score ${a.s.toFixed(3)} → ${f.s.toFixed(3)})`+(f.rk>1?`   ganó ${f.g}`:''));});
let me=0,pe=0,ig=0; R.A.det.forEach((a,i)=>{const e=R.E.det[i]; if(e.rk<a.rk)me++;else if(e.rk>a.rk)pe++;else ig++;});
console.log(`\nTODOS los 40 casos, A → E:  mejoran ${me} · empatan ${ig} · empeoran ${pe}`);
