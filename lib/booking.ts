export const SERVICES=[{id:"corte",name:"Corte",price:25,duration:30},{id:"barba",name:"Barba",price:20,duration:30},{id:"combo",name:"Corte + barba",price:45,duration:60}];
export const timeLabel=(n:number)=>`${Math.floor(n/60).toString().padStart(2,"0")}:${(n%60).toString().padStart(2,"0")}`;
export const today=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"America/Maceio",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
export type DayHours={weekday:number;enabled:boolean;opens:number;closes:number};
export const DEFAULT_HOURS:DayHours[]=Array.from({length:7},(_,weekday)=>({weekday,enabled:weekday>=2&&weekday<=6,opens:1020,closes:1260}));
export const DAY_NAMES=["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
export function dayHours(d:string,hours:DayHours[]=DEFAULT_HOURS){return hours.find(h=>h.weekday===new Date(d+"T12:00:00-03:00").getUTCDay())}
export function validDay(d:string,hours:DayHours[]=DEFAULT_HOURS){if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;const x=new Date(d+"T12:00:00-03:00");return !isNaN(+x)&&x.toISOString().slice(0,10)===d&&!!hours.find(h=>h.weekday===x.getUTCDay()&&h.enabled)&&d>=today()&&+x<Date.now()+60*86400000;}
export function futureSlot(d:string,n:number){return +new Date(d+"T"+timeLabel(n)+":00-03:00")>Date.now();}
export function available(d:string,duration:number,occupied:number[],opens=1020,closes=1260){return Array.from({length:Math.max(0,Math.floor((closes-opens)/30))},(_,i)=>opens+i*30).filter(n=>n+duration<=closes&&futureSlot(d,n)&&Array.from({length:duration/30},(_,i)=>n+i*30).every(m=>!occupied.includes(m)));}

export const money=(value:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(value);
