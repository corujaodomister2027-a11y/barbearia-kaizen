import {env} from "cloudflare:workers";
import {headers} from "next/headers";
import {db} from "./db";
const COOKIE="__Host-kaizen-barber";
const encoder=new TextEncoder();
function config(){return env as unknown as {BARBER_USERNAME?:string;BARBER_PASSWORD_SALT?:string;BARBER_PASSWORD_HASH?:string;BARBER_SESSION_KEY?:string}}
function hex(bytes:ArrayBuffer){return Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,"0")).join("")}
async function signingKey(){const secret=config().BARBER_SESSION_KEY;if(!secret)throw Error("Login indisponível.");return crypto.subtle.importKey("raw",encoder.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign","verify"])}
export async function passwordHash(password:string,salt:string){const key=await crypto.subtle.importKey("raw",encoder.encode(password),"PBKDF2",false,["deriveBits"]);return hex(await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:encoder.encode(salt),iterations:100000},key,256))}
export async function credentials(){const row=await db().prepare("SELECT salt,hash,revision FROM barber_credentials WHERE id = 'barber'").first<{salt:string;hash:string;revision:number}>();if(row)return row;const c=config();if(!c.BARBER_PASSWORD_HASH||!c.BARBER_PASSWORD_SALT)throw Error("Login indisponível.");return {salt:c.BARBER_PASSWORD_SALT,hash:c.BARBER_PASSWORD_HASH,revision:0}}
export async function matchesPassword(password:string,c:{salt:string;hash:string}){const derived=await passwordHash(password,c.salt);let diff=0;for(let i=0;i<64;i++)diff|=derived.charCodeAt(i)^c.hash.charCodeAt(i);return diff===0}
export async function validCredentials(username:string,password:string){if(!config().BARBER_USERNAME)throw Error("Login indisponível.");return await matchesPassword(password,await credentials())&&username===config().BARBER_USERNAME}
export async function issueSession(){const revision=(await credentials()).revision,expires=Date.now()+8*60*60*1000;const payload=`${expires}.${crypto.randomUUID()}.${revision}`;const signature=hex(await crypto.subtle.sign("HMAC",await signingKey(),encoder.encode(payload)));return `${payload}.${signature}`}
export async function verifySession(cookieHeader:string|null){const token=(cookieHeader||"").split(";").map(s=>s.trim()).find(s=>s.startsWith(COOKIE+"="))?.slice(COOKIE.length+1);if(!token)return false;const parts=token.split(".");if(![3,4].includes(parts.length)||!/^\d{13}$/.test(parts[0])||!/^[-a-f0-9]{36}$/.test(parts[1]))return false;const signature=parts.at(-1)!;if(!/^[a-f0-9]{64}$/.test(signature)||parts.length===4&&!/^\d+$/.test(parts[2]))return false;const expires=Number(parts[0]);if(expires<=Date.now()||expires>Date.now()+8*60*60*1000)return false;try{const sig=new Uint8Array(signature.match(/../g)!.map(v=>parseInt(v,16)));if(!await crypto.subtle.verify("HMAC",await signingKey(),sig,encoder.encode(parts.slice(0,-1).join("."))))return false;const revision=parts.length===4?Number(parts[2]):0;return revision===(await credentials()).revision}catch{return false}}
export async function barberSession(){return verifySession((await headers()).get("cookie"))}
export function sessionCookie(token:string){return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`}
export function clearSessionCookie(){return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`}
