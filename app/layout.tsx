import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Coupe de Woof | Salon de toilettage",
  description:
    "Coupe de Woof — Salon de toilettage à Le Loroux-Bottereau. Toilettage pour chiens, chats et NAC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${playfair.variable} ${poppins.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}