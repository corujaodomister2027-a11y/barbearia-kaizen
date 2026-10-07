import {db} from "./db";
import {verifySession} from "./barber-auth";
export async function isSitePublic(){const row=await db().prepare("SELECT is_public FROM site_settings WHERE id = 'site'").first<{is_public:number}>();return !row||row.is_public===1}
export async function canVisit(cookie:string|null){return await isSitePublic()||await verifySession(cookie)}
export async function publicAccess(req:Request){return canVisit(req.headers.get("cookie"))}
