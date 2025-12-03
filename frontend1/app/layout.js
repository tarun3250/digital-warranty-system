// app/layout.js
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Warranty Vault",
  description: "Your secure bill & warranty manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#020617] text-white antialiased">
        <div className="flex h-screen w-screen overflow-hidden">
          
          {/* LEFT SIDEBAR */}
          <Sidebar />

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 overflow-y-auto px-10 py-8">
            {children}
          </div>

        </div>
      </body>
    </html>
  );
}