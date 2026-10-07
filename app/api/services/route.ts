import {getHours} from "@/lib/hours";
import {admin} from "@/lib/admin";
import {db,json,sameOrigin} from "@/lib/db";
import {getServices,validateServices} from "@/lib/services";
import {publicAccess} from "@/lib/site-visibility";
export async function GET(req:Request){try{if(!await publicAccess(req))return json({error:"O site está privado.",sitePrivate:true},403);return json({services:await getServices(),hours:await getHours()})}catch(e){console.error(e);return json({error:"Não foi possível carregar os serviços. Tente novamente."},503)}}
export async function PUT(req:Request){
 if(!sameOrigin(req)||!await admin())return json({error:"Acesso não autorizado."},403);
 if(Number(req.headers.get("content-length")||0)>16384)return json({error:"Pedido inválido."},400);
 let services;try{services=validateServices(((await req.json()) as {services?:unknown}).services)}catch(e){return json({error:e instanceof Error?e.message:"Confira os nomes e preços."},400)}
 try{const d=db();await d.batch(services.map(s=>d.prepare("INSERT INTO service_settings (id,name,price_cents,duration) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,price_cents=excluded.price_cents,duration=excluded.duration").bind(s.id,s.name,s.priceCents,s.duration)));return json({services:await getServices(),hours:await getHours()})}catch(e){console.error(e);return json({error:"Não foi possível salvar. Suas alterações continuam na tela para tentar novamente."},503)}
}
