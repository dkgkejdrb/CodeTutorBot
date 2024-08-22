import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReduxProvider } from "@/store/provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Judge & CodeTutorBot v1.0",
  description: "Judge & CodeTutorBot v1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}