import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadataBase resuelve a la URL real del deployment en Vercel (preview o
// produccion) para que la imagen Open Graph siempre apunte al origen correcto.
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Sacrament Meeting Planner",
    template: "%s | Sacrament Meeting Planner",
  },
  description:
    "Plan and review sacrament meeting agendas for the Maplewood Ward, including programs for the current and past Sundays.",
  openGraph: {
    title: "Sacrament Meeting Planner",
    description:
      "Plan and review sacrament meeting agendas for the Maplewood Ward.",
    type: "website",
    siteName: "Sacrament Meeting Planner",
  },
};

// LayoutProps<'/'> es un helper global de Next.js 16: infiere los props del
// layout a partir de la ruta, sin declararlos a mano.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {/* Un unico <main> por documento: ayuda a los lectores de pantalla. */}
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
