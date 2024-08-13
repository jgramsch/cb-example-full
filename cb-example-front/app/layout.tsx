import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Box } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "La ruta perfecta para transferir al extranjero | CurrencyBird",
  description: "Ejemplo de conversión de divisas",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <Box paddingTop="128px" paddingX="6vw" flexDirection={"column"}>
          {children}
        </Box>
      </body>
    </html>
  );
}
