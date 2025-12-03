import "../globals.css";

export const metadata = {
  title: "Warranty Vault",
  description: "Smart Bill & Warranty Manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#020617] text-white">
        {children}
      </body>
    </html>
  );
}