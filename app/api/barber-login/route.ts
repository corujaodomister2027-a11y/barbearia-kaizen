import {json,sameOrigin} from "@/lib/db";
import {validCredentials,issueSession,sessionCookie,clearSessionCookie} from "@/lib/barber-auth";
// Bound repeated password checks within each running Worker instance.
const attempts=new Map<string,{count:number;until:number}>();
export async function POST(req:Request){
 if(!sameOrigin(req))return json({error:"Origem não permitida."},403);
 if(Number(req.headers.get("content-length")||0)>1024)return json({error:"Pedido inválido."},400);
 const ip=req.headers.get("cf-connecting-ip")||req.headers.get("oai-authenticated-user-id")||"anonymous";const now=Date.now();for(const [k,v] of attempts)if(v.until<now)attempts.delete(k);
 const previous=attempts.get(ip);if(previous&&previous.count>=10)return json({error:"Muitas tentativas. Aguarde um minuto e tente novamente."},429);
 attempts.set(ip,{count:(previous?.count||0)+1,until:previous?.until||now+60000});
 let body:any;try{body=await req.json()}catch{return json({error:"Pedido inválido."},400)}
 if(typeof body?.username!=="string"||typeof body?.password!=="string"||body.username.length>80||body.password.length>128)return json({error:"Usuário ou senha incorretos."},401);
 try{if(!await validCredentials(body.username.trim(),body.password))return json({error:"Usuário ou senha incorretos."},401);attempts.delete(ip);const response=json({ok:true});response.headers.set("Set-Cookie",sessionCookie(await issueSession()));return response}catch{return json({error:"Não foi possível entrar agora. Tente novamente."},503)}
}
export async function DELETE(req:Request){if(!sameOrigin(req))return json({error:"Origem não permitida."},403);const response=json({ok:true});response.headers.set("Set-Cookie",clearSessionCookie());return response}
