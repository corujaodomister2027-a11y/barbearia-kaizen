import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Kaizen Barbearia | Agende seu horário",description:"Corte e barba com hora marcada. Terça a sábado, das 17h às 21h. Virgem dos Pobres 3.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}