import 'dotenv/config';import {config} from 'dotenv';config({path:'.env.local'});
import {createClient} from '@supabase/supabase-js';
const s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
const emb=async t=>{const r=await fetch('https://api.voyageai.com/v1/embeddings',{method:'POST',headers:{'Authorization':`Bearer ${process.env.VOYAGE_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({input:[t],model:'voyage-3-lite',output_dimension:512})});return (await r.json()).data[0].embedding;};
const cos=(a,b)=>{let d=0,x=0,y=0;for(let i=0;i<a.length;i++){d+=a[i]*b[i];x+=a[i]**2;y+=b[i]**2;}return d/(Math.sqrt(x)*Math.sqrt(y));};
const {data}=await s.from('nexus_documents').select('category,title,content,embedding_512').eq('tenant_id','whatsapp').not('embedding_512','is',null);
for(const q of process.argv.slice(2)){
  const e=await emb(q);
  const r=data.map(d=>({c:d.category,s:cos(e,JSON.parse(d.embedding_512)),lock:d.content.includes('<verbatim_lock>')})).sort((a,b)=>b.s-a.s).slice(0,6);
  console.log(`\n█ ${q}`);
  r.forEach((x,i)=>console.log(`  ${i+1}. ${x.s.toFixed(3)} ${x.lock?'🔒':'  '} ${x.c}`));
}
