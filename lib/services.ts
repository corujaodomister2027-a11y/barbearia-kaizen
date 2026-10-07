import {db} from "./db";
import {SERVICES} from "./booking";
export type Service = {id:string;name:string;price:number;priceCents:number;duration:number};
export async function getServices():Promise<Service[]>{
 const {results}=await db().prepare("SELECT id,name,price_cents,duration FROM service_settings ORDER BY rowid").all<{id:string;name:string;price_cents:number;duration:number|null}>();
 const original=SERVICES.map(s=>{const saved=results.find(r=>r.id===s.id),priceCents=saved?.price_cents??s.price*100;return {...s,name:saved?.name??s.name,price:priceCents/100,priceCents,duration:saved?.duration??s.duration}});
 return [...original,...results.filter(r=>!SERVICES.some(s=>s.id===r.id)).map(r=>({id:r.id,name:r.name,price:r.price_cents/100,priceCents:r.price_cents,duration:r.duration??30}))];
}
export function validateServices(value:unknown){
 if(!Array.isArray(value)||value.length<3||value.length>30)throw Error("Cadastre de 3 a 30 serviços.");
 const seen=new Set<string>();
 const result=value.map(item=>{
  if(!item||typeof item!=="object"||typeof item.id!=="string"||(!SERVICES.some(s=>s.id===item.id)&&!/^svc_[a-f0-9-]{36}$/.test(item.id))||seen.has(item.id))throw Error("Serviço inválido.");
  seen.add(item.id);const name=typeof item.name==="string"?item.name.trim():"";
  if(name.length<2||name.length>60)throw Error("Use nomes com 2 a 60 caracteres.");
  if(!Number.isSafeInteger(item.priceCents)||item.priceCents<100||item.priceCents>100000)throw Error("Informe um preço entre R$ 1,00 e R$ 1.000,00.");
  const duration=item.duration??SERVICES.find(s=>s.id===item.id)?.duration;
  if(![30,60,90,120].includes(duration))throw Error("Escolha uma duração de 30, 60, 90 ou 120 minutos.");
  return {id:item.id,name,priceCents:item.priceCents as number,duration:duration as number};
 });
 if(!SERVICES.every(s=>seen.has(s.id)))throw Error("Mantenha os serviços existentes na lista.");
 return result;
}
