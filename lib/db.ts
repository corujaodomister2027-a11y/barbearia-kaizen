import {env} from "cloudflare:workers";
export function db():D1Database{const binding=(env as unknown as {DB?:D1Database}).DB;if(!binding)throw new Error("Database unavailable");return binding;}
export function adminIds(){return ((env as unknown as {ADMIN_USER_IDS?:string}).ADMIN_USER_IDS||"").split(",").filter(Boolean);}
export function sameOrigin(req:Request){const origin=req.headers.get("origin");return !!origin&&origin===new URL(req.url).origin;}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{"Cache-Control":"no-store"}});}
