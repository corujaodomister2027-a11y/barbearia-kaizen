import {barberSession} from "@/lib/barber-auth";
import {redirect} from "next/navigation";
import Admin from "./panel";
export const dynamic="force-dynamic";
export default async function Page(){if(!await barberSession())redirect("/admin/login");return <div className="admin-wrap"><Admin/></div>}
