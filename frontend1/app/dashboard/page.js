"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Search, Eye, ShieldCheck, Timer, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const router = useRouter();

  // Fetch bills
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await api.get("/bills/all");
        setBills(res.data || []);
      } catch (err) {
        console.error("Error fetching bills:", err);
      }
    };

    fetchBills();
  }, []);

  // Helpers
  const getDaysLeft = (expiry) => {
    if (!expiry) return null;
    const today = new Date();
    const exp = new Date(expiry);
    return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  };

  const getStatus = (expiry) => {
    const diff = getDaysLeft(expiry);
    if (diff === null) return "unknown";
    if (diff < 0) return "expired";
    if (diff <= 30) return "soon";
    return "active";
  };

  const getStatusBadge = (expiry) => {
    const status = getStatus(expiry);

    if (status === "expired")
      return <Badge variant="destructive">Expired</Badge>;

    if (status === "soon")
      return <Badge className="bg-yellow-500 text-black">Expiring Soon</Badge>;

    return <Badge className="bg-green-600 text-white">Active</Badge>;
  };

  const getDaysLeftText = (expiry) => {
    const d = getDaysLeft(expiry);
    if (d < 0) return "Expired";
    if (d === 0) return "Expires today";
    if (d === 1) return "Expires tomorrow";
    return `${d} days left`;
  };

  // Derive year filters
  const years = Array.from(
    new Set(
      bills
        .map((b) => b.purchaseDate)
        .filter(Boolean)
        .map((d) => new Date(d).getFullYear())
    )
  ).sort((a, b) => b - a);

  // Apply filters
  const filteredBills = bills.filter((bill) => {
    const text = `${bill.productName || ""} ${bill.storeName || ""}`.toLowerCase();
    const searchMatch = text.includes(search.toLowerCase());

    const status = getStatus(bill.expiryDate);
    const statusMatch = statusFilter === "all" || status === statusFilter;

    let yearMatch = true;
    if (yearFilter !== "all" && bill.purchaseDate) {
      const yr = new Date(bill.purchaseDate).getFullYear();
      yearMatch = String(yr) === yearFilter;
    }

    return searchMatch && statusMatch && yearMatch;
  });

  // Delete bill
  const deleteBill = async (id) => {
    try {
      await api.delete(`/bills/delete/${id}`);
      setBills((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting bill:", err);
    }
  };

  // ============================
  // 📌 TOP STATS SECTION COUNTS
  // ============================

  const totalBills = bills.length;
  const activeBills = bills.filter((b) => getStatus(b.expiryDate) === "active").length;
  const expiringSoon = bills.filter((b) => getStatus(b.expiryDate) === "soon").length;
  const expiredBills = bills.filter((b) => getStatus(b.expiryDate) === "expired").length;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-white">Your Bills & Warranties</h1>

      {/* ===============================
          🔷 TOP STATS SECTION (RESTORED)
          =============================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        
        <Card className="bg-[#0a1028] border border-cyan-900/50 shadow-lg rounded-xl">
          <CardContent className="p-5 flex flex-col items-start">
            <ShieldCheck className="w-6 h-6 text-cyan-400 mb-2" />
            <p className="text-sm text-slate-400">Total Bills</p>
            <p className="text-2xl font-bold text-white">{totalBills}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1028] border border-green-900/40 shadow-lg rounded-xl">
          <CardContent className="p-5 flex flex-col items-start">
            <ShieldCheck className="w-6 h-6 text-green-400 mb-2" />
            <p className="text-sm text-slate-400">Active</p>
            <p className="text-2xl font-bold text-green-300">{activeBills}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1028] border border-yellow-900/40 shadow-lg rounded-xl">
          <CardContent className="p-5 flex flex-col items-start">
            <Timer className="w-6 h-6 text-yellow-300 mb-2" />
            <p className="text-sm text-slate-400">Expiring Soon</p>
            <p className="text-2xl font-bold text-yellow-300">{expiringSoon}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1028] border border-red-900/50 shadow-lg rounded-xl">
          <CardContent className="p-5 flex flex-col items-start">
            <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
            <p className="text-sm text-slate-400">Expired</p>
            <p className="text-2xl font-bold text-red-400">{expiredBills}</p>
          </CardContent>
        </Card>

      </div>

      {/* =============================
          🔍 SEARCH + FILTERS SECTION
          ============================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center gap-2 border px-3 py-2 rounded-md bg-slate-900 shadow-sm w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            className="flex-1 bg-transparent outline-none text-sm text-slate-200"
            placeholder="Search by product or store..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <select
            className="border rounded-md px-3 py-2 bg-slate-900 text-slate-200 text-sm shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="soon">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>

          <select
            className="border rounded-md px-3 py-2 bg-slate-900 text-slate-200 text-sm shadow-sm"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* =============================
          🧾 BILL CARDS SECTION
          ============================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredBills.map((bill) => (
          <Card
            key={bill.id}
            className="bg-[#020617] border border-slate-800 shadow-xl rounded-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:border-cyan-400/40 transition-all duration-300"
          >
            <CardHeader className="relative">

              {/* Glow bg */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex justify-between relative z-20">
                <CardTitle className="text-base text-slate-100">
                  {bill.productName}
                </CardTitle>

                {/* WORKING DROPDOWN */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-slate-700/40"
                    >
                      <MoreHorizontal className="h-5 w-5 text-slate-300" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="z-[99999] bg-[#0f172a] text-white border border-slate-700 shadow-xl rounded-lg"
                  >
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-blue-600/20"
                      onClick={() => router.push(`/dashboard/bill/${bill.id}`)}
                    >
                      View Details
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-red-600/20 text-red-400"
                      onClick={() => deleteBill(bill.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 text-sm text-slate-400">
              <p><strong className="text-slate-300">Store:</strong> {bill.storeName}</p>
              <p><strong className="text-slate-300">Purchase:</strong> {bill.purchaseDate}</p>
              <p><strong className="text-slate-300">Warranty:</strong> {bill.warrantyPeriod}</p>
              <p><strong className="text-slate-300">Expiry:</strong> {bill.expiryDate}</p>

              {getStatusBadge(bill.expiryDate)}

              <p className="text-xs text-slate-500">
                {getDaysLeftText(bill.expiryDate)}
              </p>

              <Button
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-black mt-3 font-semibold"
                onClick={() => router.push(`/dashboard/bill/${bill.id}`)}
              >
                <Eye className="w-4 h-4 mr-2" /> View Details
              </Button>

            </CardContent>
          </Card>
        ))}

      </div>

    </div>
  );
}
