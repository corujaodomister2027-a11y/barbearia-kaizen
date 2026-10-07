import {admin} from "@/lib/admin";
import {db,json,sameOrigin} from "@/lib/db";
import {credentials,matchesPassword,passwordHash,issueSession,sessionCookie} from "@/lib/barber-auth";
const attempts=new Map<string,{count:number;until:number}>();
export async function PUT(req:Request){
 if(!sameOrigin(req)||!await admin())return json({error:"Acesso não autorizado."},403);
 const ip=req.headers.get("cf-connecting-ip")||"barber",now=Date.now();for(const [k,v] of attempts)if(v.until<now)attempts.delete(k);const previous=attempts.get(ip);if(previous&&previous.count>=5)return json({error:"Muitas tentativas. Aguarde um minuto."},429);attempts.set(ip,{count:(previous?.count||0)+1,until:previous?.until||now+60000});
 if(Number(req.headers.get("content-length")||0)>2048)return json({error:"Pedido inválido."},400);
 let b:any;try{b=await req.json()}catch{return json({error:"Pedido inválido."},400)}
 if(typeof b?.currentPassword!=="string"||b.currentPassword.length>128||typeof b?.newPassword!=="string"||b.newPassword.length<8||b.newPassword.length>128||b.newPassword!==b.confirmPassword)return json({error:"A nova senha deve ter de 8 a 128 caracteres e a confirmação deve ser igual."},400);
 if(b.currentPassword===b.newPassword)return json({error:"Escolha uma senha diferente da atual."},400);
 try{const c=await credentials();if(!await matchesPassword(b.currentPassword,c))return json({error:"Senha atual incorreta."},400);const salt=crypto.randomUUID(),hash=await passwordHash(b.newPassword,salt);const result=await db().prepare("INSERT INTO barber_credentials (id,salt,hash,revision) VALUES ('barber',?,?,?) ON CONFLICT(id) DO UPDATE SET salt=excluded.salt,hash=excluded.hash,revision=excluded.revision WHERE barber_credentials.revision = ?").bind(salt,hash,c.revision+1,c.revision).run();if(!result.meta.changes)return json({error:"A senha já foi alterada em outra sessão. Entre novamente."},409);attempts.delete(ip);const response=json({ok:true});response.headers.set("Set-Cookie",sessionCookie(await issueSession()));return response}catch(e){console.error(e);return json({error:"Não foi possível alterar a senha. Tente novamente."},503)}
}
