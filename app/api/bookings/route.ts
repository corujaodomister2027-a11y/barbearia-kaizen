import {db,json,sameOrigin} from "@/lib/db";
import {validDay,futureSlot,timeLabel,dayHours} from "@/lib/booking";
import {publicAccess} from "@/lib/site-visibility";
import {getHours} from "@/lib/hours";
import {getServices} from "@/lib/services";
import {expirePending,tokenHash} from "@/lib/payment";
export async function POST(req:Request){
 if(!sameOrigin(req))return json({error:"Origem não permitida."},403);
 if(Number(req.headers.get("content-length")||0)>4096)return json({error:"Pedido inválido."},400);
 let b:any;try{b=await req.json();if(!b||typeof b!=="object")throw Error()}catch{return json({error:"Pedido inválido."},400)}
 try{
 if(!await publicAccess(req))return json({error:"O site está privado.",sitePrivate:true},403);
 const hours=await getHours(),day=dayHours(b.date,hours);
 const services=await getServices(),s=services.find(s=>s.id===b.service),name=typeof b.name==="string"?b.name.trim():"",phone=typeof b.phone==="string"?b.phone.replace(/\D/g,""):"";
 if(b.website||!s||name.length<2||name.length>80||!/^\d{10,11}$/.test(phone)||!validDay(b.date,hours)||!day||!Number.isInteger(b.start)||b.start<day.opens||b.start%30||b.start+s.duration>day.closes||!futureSlot(b.date,b.start))return json({error:"Confira nome, WhatsApp e o horário escolhido."},400);
 if(b.serviceName!==s.name||b.servicePriceCents!==s.priceCents||b.serviceDuration!==s.duration)return json({error:"O serviço foi atualizado. Confira o nome e o novo valor antes de continuar.",servicesChanged:true,services},409);
 await expirePending();const d=db(),id=crypto.randomUUID(),token=crypto.randomUUID()+crypto.randomUUID();
 const count=await d.prepare("SELECT COUNT(*) AS total FROM bookings WHERE phone = ? AND created > ? AND status IN ('confirmed','pending_payment','payment_review')").bind(phone,Date.now()-86400000).first<{total:number}>();
 if((count?.total||0)>=3)return json({error:"Para mais agendamentos, fale conosco pelo WhatsApp."},429);
 const expires=Math.min(Date.now()+20*60000,+new Date(b.date+"T"+timeLabel(b.start)+":00-03:00"));
 await d.batch([d.prepare("INSERT INTO bookings (id,name,phone,service,date,start,duration,price,status,created,payment_expires,manage_hash,service_name,price_cents) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(id,name,phone,s.id,b.date,b.start,s.duration,Math.round(s.price),"pending_payment",Date.now(),expires,await tokenHash(token),s.name,s.priceCents),...Array.from({length:s.duration/30},(_,i)=>d.prepare("INSERT INTO slots (date,minute,booking_id) VALUES (?,?,?)").bind(b.date,b.start+i*30,id))]);
 return json({id,token,name,service:s.name,date:b.date,start:b.start,duration:s.duration,price:s.price,status:"pending_payment",payment_expires:expires},201);
 }catch(e){if(String(e).includes("UNIQUE"))return json({error:"Esse horário acabou de ser reservado. Escolha outro."},409);console.error(e);return json({error:"Não foi possível criar o pedido. Confira a agenda antes de tentar novamente."},503)}
}
