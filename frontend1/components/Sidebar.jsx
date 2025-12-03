
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "shield" },
  { href: "/dashboard/upload", label: "Upload Bill", icon: "upload" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "chart" },
  { href: "/dashboard/profile", label: "Profile", icon: "user" },
];

function Icon({ name, className = "w-4 h-4" }) {
  // small inline SVG icons to avoid extra deps
  switch (name) {
    case "shield":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2l8 4v6c0 5-3.5 9.7-8 10-4.5-.3-8-5-8-10V6l8-4z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      );
    case "upload":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M17 8l-5-5-5 5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M12 3v12" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      );
    case "chart":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 3v18h18" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M7 13v-6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M12 17v-10" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M17 9v-4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      );
    case "user":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
          <circle cx="12" cy="7" r="4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></circle>
        </svg>
      );
    case "logout":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M16 17l5-5-5-5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M21 12H9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = (e) => {
    e.preventDefault();
    // clear auth tokens / localStorage keys your app uses
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (err) {
      /* ignore */
    }
    router.push("/login");
  };

  return (
    <>
      <aside
        className="w-64 min-h-screen bg-[#0b1722] border-r border-slate-800/40 text-slate-200 flex-shrink-0"
        aria-label="Sidebar"
      >
        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-cyan-600 text-black font-bold">
              W
            </div>
            <div>
              <div className="text-cyan-300 font-semibold text-lg">Warranty Vault</div>
            </div>
          </div>
        </div>

        <nav className="px-4 mt-6">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-900/40 transition ${
                      active ? "bg-slate-900/50 ring-1 ring-cyan-600/20" : "text-slate-300"
                    }`}
                  >
                    <span className="text-slate-300/80">
                      <Icon name={item.icon} className="w-4 h-4 text-slate-300" />
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-4 mt-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            <Icon name="logout" className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* small circular launcher bottom-left (matches your screenshots) */}
      <div className="fixed left-4 bottom-4 w-10 h-10 rounded-full bg-black/40 border border-slate-800 flex items-center justify-center text-white text-xs font-semibold shadow-lg">
        N
      </div>
    </>
  );
}