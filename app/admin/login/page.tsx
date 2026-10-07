import {barberSession} from "@/lib/barber-auth";
import {redirect} from "next/navigation";
import Login from "./form";
export const dynamic="force-dynamic";
export default async function Page(){if(await barberSession())redirect("/admin");return <Login/>}
