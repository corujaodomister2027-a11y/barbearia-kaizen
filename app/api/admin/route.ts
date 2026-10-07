import {admin} from "@/lib/admin";import {db,json,sameOrigin} from "@/lib/db";import {validDay,futureSlot,dayHours} from "@/lib/booking";import {expirePending} from "@/lib/payment";
import {TEST_BOOKING_IDS} from "@/lib/test-bookings";
import {getHours} from "@/lib/hours";
export async function GET(req:Request){
 if(!await admin())return json({error:"Acesso não autorizado."},403);
 const date=new URL(req.url).searchParams.get("date")||"";if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return json({error:"Data inválida."},400);
 try{await expirePending();const [day,pending]=await db().batch([db().prepare("SELECT id,name,phone,service,service_name,date,start,duration,COALESCE(price_cents / 100.0,price) AS price,status,created,payment_expires,paid_at FROM bookings WHERE date = ? AND status NOT IN ('cancelled','expired') ORDER BY start").bind(date),db().prepare("SELECT id,name,phone,service,service_name,date,start,duration,COALESCE(price_cents / 100.0,price) AS price,status,payment_expires,payment_reported FROM bookings WHERE status IN ('pending_payment','payment_review') ORDER BY created DESC LIMIT 100")]);return json({bookings:day.results,pending:pending.results,updatedAt:Date.now()})}catch(e){console.error(e);return json({error:"Não foi possível carregar a agenda."},503)}
}
export async function POST(req:Request){
 if(!sameOrigin(req)||!await admin())return json({error:"Acesso não autorizado."},403);let b:any;try{b=await req.json();if(!b||typeof b!=="object")throw Error()}catch{return json({error:"Pedido inválido."},400)}
 try{await expirePending();const d=db();
 if(b.action==="delete_test_bookings"){const marks=TEST_BOOKING_IDS.map(()=>"?").join(",");const results=await d.batch([d.prepare(`DELETE FROM slots WHERE booking_id IN (${marks})`).bind(...TEST_BOOKING_IDS),d.prepare(`DELETE FROM bookings WHERE id IN (${marks})`).bind(...TEST_BOOKING_IDS)]);return json({ok:true,removed:results[1].meta.changes})}

 if(b.action==="confirm_payment"&&typeof b.id==="string"){const r=await d.prepare("UPDATE bookings SET status = 'confirmed', paid_at = ? WHERE id = ? AND status IN ('pending_payment','payment_review')").bind(Date.now(),b.id).run();if(!r.meta.changes)return json({error:"O pedido já foi atualizado ou expirou. Atualize a agenda."},409);return json({ok:true})}
 if(b.action==="cancel"&&typeof b.id==="string"){await d.batch([d.prepare("DELETE FROM slots WHERE booking_id = ?").bind(b.id),d.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").bind(b.id)]);return json({ok:true})}
 const hours=await getHours(),day=dayHours(b.date,hours);
 if(b.action==="block"&&validDay(b.date,hours)&&day&&Number.isInteger(b.start)&&b.start>=day.opens&&b.start+30<=day.closes&&b.start%30===0&&futureSlot(b.date,b.start)){const id=crypto.randomUUID();await d.batch([d.prepare("INSERT INTO bookings (id,name,phone,service,date,start,duration,price,status,created) VALUES (?,?,?,?,?,?,?,?,?,?)").bind(id,"Horário bloqueado","","block",b.date,b.start,30,0,"blocked",Date.now()),d.prepare("INSERT INTO slots (date,minute,booking_id) VALUES (?,?,?)").bind(b.date,b.start,id)]);return json({ok:true})}
 return json({error:"Operação inválida."},400)
 }catch(e){if(String(e).includes("UNIQUE"))return json({error:"Esse horário já está ocupado."},409);console.error(e);return json({error:"Não foi possível atualizar a agenda."},503)}
}
