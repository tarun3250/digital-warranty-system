"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BillDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch bill details
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await api.get(`/bills/${id}`);
        setBill(res.data);
      } catch (err) {
        console.error("Error loading bill:", err);
        setBill(null);
      }
      setLoading(false);
    };

    fetchBill();
  }, [id]);

  // Days calculation
  const getDaysLeft = (expiry) => {
    if (!expiry) return null;
    const today = new Date();
    const exp = new Date(expiry);
    const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getStatusBadge = (expiry) => {
    const diff = getDaysLeft(expiry);
    if (diff === null) return <Badge variant="outline">Unknown</Badge>;
    if (diff < 0) return <Badge variant="destructive">Expired</Badge>;
    if (diff <= 30) return <Badge className="bg-yellow-500">Expiring Soon</Badge>;
    return <Badge className="bg-green-600 text-white">Active</Badge>;
  };

  const getDaysLeftText = (expiry) => {
    const diff = getDaysLeft(expiry);
    if (diff === null) return "Invalid date";
    if (diff < 0) return "Expired";
    if (diff === 0) return "Expires today";
    if (diff === 1) return "Expires tomorrow";
    return `${diff} days left`;
  };

  if (loading) return <p className="text-slate-400">Loading bill details…</p>;

  if (!bill)
    return (
      <div>
        <p className="text-red-500">Bill not found</p>
        <Button className="mt-4" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => router.push("/dashboard")}>
        ← Back to Dashboard
      </Button>

      {/* Main Container */}
      <Card className="backdrop-blur-lg bg-white/80 shadow-xl border border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800">
            {bill.productName || "Unknown Product"}
          </CardTitle>

          <div className="mt-2">{getStatusBadge(bill.expiryDate)}</div>
        </CardHeader>

        <CardContent>
          {/* Two-column info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-sm">
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-slate-700">Store:</span>{" "}
                {bill.storeName || "Not Available"}
              </p>

              <p>
                <span className="font-semibold text-slate-700">Purchase Date:</span>{" "}
                {bill.purchaseDate || "Not Available"}
              </p>

              <p>
                <span className="font-semibold text-slate-700">Warranty Period:</span>{" "}
                {bill.warrantyPeriod || "Not Available"}
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <span className="font-semibold text-slate-700">Expiry Date:</span>{" "}
                {bill.expiryDate || "Not Available"}
              </p>

              <p className="text-slate-600 text-sm">
                <span className="font-semibold">Status:</span>{" "}
                {getDaysLeftText(bill.expiryDate)}
              </p>

              <p>
                <span className="font-semibold">Bill ID:</span> {bill.id}
              </p>
            </div>
          </div>

          {/* Bill Image */}
          {bill.filePath && (
            <div className="mt-8">
              <p className="font-semibold mb-2 text-slate-700">Uploaded Bill:</p>
              <img
                src={`http://localhost:3001/${bill.filePath}`}
                className="rounded-lg border shadow-md w-full max-h-[500px] object-contain bg-white"
                alt="Bill"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
