"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const CYAN = "#22d3ee";
const BLUE = "#3b82f6";
const GREEN = "#22c55e";
const RED = "#ef4444";
const AMBER = "#fbbf24";
const SLATE = "#64748b";

function getDaysLeft(expiry) {
  if (!expiry) return null;
  const today = new Date();
  const exp = new Date(expiry);
  if (isNaN(exp.getTime())) return null;
  return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
}

function getStatus(expiry) {
  const d = getDaysLeft(expiry);
  if (d === null) return "unknown";
  if (d < 0) return "expired";
  if (d <= 30) return "soon";
  return "active";
}

export default function AnalyticsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await api.get("/bills/all");
        setBills(res.data || []);
      } catch (err) {
        console.error("Error fetching bills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  // --- Derived metrics ---

  const total = bills.length;
  const active = bills.filter((b) => getStatus(b.expiryDate) === "active")
    .length;
  const soon = bills.filter((b) => getStatus(b.expiryDate) === "soon").length;
  const expired = bills.filter((b) => getStatus(b.expiryDate) === "expired")
    .length;

  // Category distribution
  const categoryMap = new Map();
  bills.forEach((b) => {
    const cat = b.category || "Uncategorized";
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });
  const categoryData = Array.from(categoryMap.entries()).map(
    ([name, value]) => ({ name, value })
  );

  // Bills per year
  const yearMap = new Map();
  bills.forEach((b) => {
    if (!b.purchaseDate) return;
    const y = new Date(b.purchaseDate).getFullYear();
    if (!Number.isFinite(y)) return;
    yearMap.set(y, (yearMap.get(y) || 0) + 1);
  });
  const yearData = Array.from(yearMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, value]) => ({ year, value }));

  const COLORS = [CYAN, BLUE, AMBER, GREEN, RED, SLATE];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">
          High-level overview of your bills & warranties.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#020617] border border-slate-800 shadow-md">
          <CardHeader>
            <CardTitle className="text-sm text-slate-300">
              Total Bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-cyan-400">{total}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#020617] border border-slate-800 shadow-md">
          <CardHeader>
            <CardTitle className="text-sm text-slate-300">
              Active Warranties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-emerald-400">
              {active}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#020617] border border-slate-800 shadow-md">
          <CardHeader>
            <CardTitle className="text-sm text-slate-300">
              Expiring Soon (≤30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-amber-300">
              {soon}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#020617] border border-slate-800 shadow-md">
          <CardHeader>
            <CardTitle className="text-sm text-slate-300">
              Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-red-400">
              {expired}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie */}
        <Card className="bg-[#020617] border border-slate-800 shadow-md">
          <CardHeader>
            <CardTitle className="text-sm text-slate-300">
              Bills by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {categoryData.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Not enough data to show categories.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1f2937",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "#e5e7eb" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Yearly uploads Bar */}
        <Card className="bg-[#020617] border border-slate-800 shadow-md">
          <CardHeader>
            <CardTitle className="text-sm text-slate-300">
              Bills by Purchase Year
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {yearData.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Not enough data to show yearly breakdown.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="year"
                    stroke="#9ca3af"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1f2937",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "#e5e7eb" }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={BLUE} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {loading && (
        <p className="text-slate-500 text-sm">Loading analytics…</p>
      )}
    </div>
  );
}
