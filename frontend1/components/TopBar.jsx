"use client";

import { usePathname } from "next/navigation";

export default function TopBar() {
  const path = usePathname();

  const getTitle = () => {
    if (path.includes("upload")) return "Upload Bill";
    if (path.includes("analytics")) return "Analytics";
    if (path.includes("profile")) return "Profile";
    if (path.includes("bill")) return "Bill Details";
    return "Dashboard";
  };

  return (
    <header className="w-full bg-[#0F172A]/50 backdrop-blur-md border-b border-slate-800 px-6 py-4">
      <h2 className="text-xl font-semibold text-white tracking-wide">
        {getTitle()}
      </h2>
    </header>
  );
}
