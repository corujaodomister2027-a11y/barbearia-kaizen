import {barberSession} from "./barber-auth";
export async function admin(){return await barberSession()?{userId:"barber",displayName:"Kaizen"}:null;}
