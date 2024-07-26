import type { Metadata } from "next";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "mystry message",
  description: "Gsend anonymous messages to your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className='w-[100vw]'>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
