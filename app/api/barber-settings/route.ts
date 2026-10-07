import {admin} from "@/lib/admin";
import {db,json,sameOrigin} from "@/lib/db";
import {isSitePublic} from "@/lib/site-visibility";
export async function GET(){if(!await admin())return json({error:"Acesso não autorizado."},403);try{return json({isPublic:await isSitePublic()})}catch(e){console.error(e);return json({error:"Não foi possível carregar o acesso do site."},503)}}
export async function PUT(req:Request){if(!sameOrigin(req)||!await admin())return json({error:"Acesso não autorizado."},403);let b:any;try{b=await req.json();if(typeof b?.isPublic!=="boolean")throw Error()}catch{return json({error:"Escolha público ou privado."},400)}try{await db().prepare("INSERT INTO site_settings (id,is_public) VALUES ('site',?) ON CONFLICT(id) DO UPDATE SET is_public=excluded.is_public").bind(b.isPublic?1:0).run();return json({isPublic:b.isPublic})}catch(e){console.error(e);return json({error:"Não foi possível alterar o acesso. Tente novamente."},503)}}
