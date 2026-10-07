import {expirePending} from "@/lib/payment";
import {db,json} from "@/lib/db";
import {validDay,available,dayHours} from "@/lib/booking";
import {getHours} from "@/lib/hours";
import {getServices} from "@/lib/services";
import {publicAccess} from "@/lib/site-visibility";
export async function GET(req:Request){try{if(!await publicAccess(req))return json({error:"O site está privado.",sitePrivate:true},403);const hours=await getHours();const u=new URL(req.url),date=u.searchParams.get("date")||"",service=(await getServices()).find(s=>s.id===u.searchParams.get("service"));if(!service||!validDay(date,hours))return json({error:"Escolha um serviço e um dia de atendimento nos próximos 60 dias."},400);await expirePending();const result=await db().prepare("SELECT minute FROM slots WHERE date = ?").bind(date).all<{minute:number}>();const day=dayHours(date,hours)!;return json({slots:available(date,service.duration,result.results.map(r=>r.minute),day.opens,day.closes)});}catch(e){console.error(e);return json({error:"Não foi possível consultar a agenda. Tente novamente."},503)}}
