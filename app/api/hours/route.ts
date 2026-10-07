import {admin} from "@/lib/admin";
import {db,json,sameOrigin} from "@/lib/db";
import {publicAccess} from "@/lib/site-visibility";
import {getHours,validateHours} from "@/lib/hours";
export async function GET(req:Request){try{if(!await publicAccess(req))return json({error:"O site está privado.",sitePrivate:true},403);return json({hours:await getHours()})}catch(e){console.error(e);return json({error:"Não foi possível carregar os horários."},503)}}
export async function PUT(req:Request){if(!sameOrigin(req)||!await admin())return json({error:"Acesso não autorizado."},403);let hours;try{hours=validateHours(((await req.json()) as {hours?:unknown}).hours)}catch(e){return json({error:e instanceof Error?e.message:"Confira os dias e horários."},400)}try{await db().batch(hours.map(h=>db().prepare("INSERT INTO weekly_hours (weekday,enabled,opens,closes) VALUES (?,?,?,?) ON CONFLICT(weekday) DO UPDATE SET enabled=excluded.enabled,opens=excluded.opens,closes=excluded.closes").bind(h.weekday,h.enabled?1:0,h.opens,h.closes)));return json({hours:await getHours()})}catch(e){console.error(e);return json({error:"Não foi possível salvar. Os horários continuam na tela para tentar novamente."},503)}}
