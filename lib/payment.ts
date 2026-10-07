import {db} from "@/lib/db";
export async function tokenHash(token:string){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));return Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,"0")).join("")}
export async function expirePending(){const d=db(),now=Date.now();await d.batch([d.prepare("DELETE FROM slots WHERE booking_id IN (SELECT id FROM bookings WHERE status = 'pending_payment' AND payment_expires <= ?)").bind(now),d.prepare("UPDATE bookings SET status = 'expired' WHERE status = 'pending_payment' AND payment_expires <= ?").bind(now)]);}
