import Booking from "./booking-client";
import {headers} from "next/headers";
import {canVisit} from "@/lib/site-visibility";
import {LockKeyhole} from "lucide-react";
export const dynamic="force-dynamic";
export default async function Page(){try{if(await canVisit((await headers()).get("cookie")))return <Booking/>}catch{ return <main className="private-site"><h1>Site temporariamente indisponível</h1><p>Tente novamente em alguns instantes.</p><a href="/admin/login">Área do barbeiro</a></main> }return <main className="private-site"><img src="/kaizen.jpeg" alt="Kaizen Barbearia" width={72} height={72}/><LockKeyhole size={30}/><h1>Acesso privado</h1><p>O site da Kaizen está temporariamente fechado ao público.</p><a className="barber-entry" href="/admin/login">Área do barbeiro</a></main>}
