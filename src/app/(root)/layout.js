import Sidebar from "@/components/layout/Sidebar";
import { Geist, Geist_Mono } from "next/font/google";
import "../../app/globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "Xenotix Tech",
  description: "Xenotix's Dashboard - A comprehensive platform for clients",
};

export default function RootLayout({ children }) {
  return (
    <div className={`min-h-screen flex flex-col ${geist.variable} ${geistMono.variable}`}>
      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 transition-all duration-300 md:ml-60 sidebar-expanded:md:ml-16 pt-8 lg:pt-0 pb-24 md:pb-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
