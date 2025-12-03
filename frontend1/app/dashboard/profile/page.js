"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  User,
  Mail,
  Calendar,
  Shield,
  ShieldCheck,
  Lock,
  Activity,
  Trash2,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Dummy user data (can be wired to backend later)
  const [user, setUser] = useState({
    name: "Tarun R",
    email: "tarun@example.com",
    joined: "2024-01-15",
    twoFA: true,
    lastLogin: "2025-11-24 22:15",
    lastPasswordChange: "2025-09-10",
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [uploadPreview, setUploadPreview] = useState(null);

  // Bill stats for overview (reusing same logic as dashboard)
  const [billStats, setBillStats] = useState({
    total: 0,
    active: 0,
    soon: 0,
    expired: 0,
  });

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await api.get("/bills/all");
        const bills = res.data || [];

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

        const total = bills.length;
        const active = bills.filter((b) => getStatus(b.expiryDate) === "active").length;
        const soon = bills.filter((b) => getStatus(b.expiryDate) === "soon").length;
        const expired = bills.filter((b) => getStatus(b.expiryDate) === "expired").length;

        setBillStats({ total, active, soon, expired });
      } catch (err) {
        console.error("Error fetching bill stats:", err);
      }
    };

    fetchBills();
  }, []);

  const activityLog = [
    "Logged in from Chrome on MacBook",
    "Uploaded bill: iPhone 14",
    "Deleted bill: Old Laptop Warranty",
    "Changed profile email",
  ];

  // Handlers
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadPreview(url);
    // TODO: send to backend later
  };

  const handleSaveProfile = () => {
    alert("Profile save clicked (wire to backend later).");
  };

  const handlePasswordSave = () => {
    if (passwordForm.next !== passwordForm.confirm) {
      alert("New passwords do not match");
      return;
    }
    if (!passwordForm.current || !passwordForm.next) {
      alert("Please fill all password fields");
      return;
    }
    alert("Password change requested (wire to backend later).");
  };

  const toggle2FA = () => {
    setUser((prev) => ({ ...prev, twoFA: !prev.twoFA }));
  };

  const handleDeleteAccount = () => {
    const sure = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!sure) return;
    alert("Delete account clicked (wire to backend).");
  };

  return (
    <div className="text-white">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>

      {/* Top profile summary card */}
      <Card className="bg-[#020617] border border-slate-800 shadow-xl rounded-2xl relative overflow-hidden mb-6">
        {/* Glows */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-cyan-500/20 blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-700/20 blur-[80px]" />

        <CardHeader className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left side: avatar + text */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-cyan-500 shadow-lg">
              <AvatarImage src={uploadPreview || ""} alt="User Avatar" />
              <AvatarFallback className="bg-slate-700 text-white">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                {user.name}
              </CardTitle>

              <p className="text-slate-400 flex items-center gap-2 mt-1 text-sm">
                <Mail className="w-4 h-4" /> {user.email}
              </p>

              <p className="text-slate-500 text-xs flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" /> Joined {user.joined}
              </p>
            </div>
          </div>

          {/* Right side: quick badges */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <Badge className="bg-cyan-700 text-white">
              Total Bills: {billStats.total}
            </Badge>
            <Badge className="bg-emerald-700 text-white">
              Active: {billStats.active}
            </Badge>
            <Badge className="bg-yellow-600 text-black">
              Expiring Soon: {billStats.soon}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <div className="border-b border-slate-800 mb-6 flex gap-2 overflow-x-auto">
        {[
          { id: "overview", label: "Overview" },
          { id: "profile", label: "Edit Profile" },
          { id: "security", label: "Security" },
          { id: "activity", label: "Activity Logs" },
          { id: "danger", label: "Danger Zone" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm rounded-t-md border-b-2 ${
              activeTab === tab.id
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab user={user} billStats={billStats} />
      )}

      {activeTab === "profile" && (
        <EditProfileTab
          user={user}
          setUser={setUser}
          uploadPreview={uploadPreview}
          handleAvatarChange={handleAvatarChange}
          handleSaveProfile={handleSaveProfile}
        />
      )}

      {activeTab === "security" && (
        <SecurityTab
          user={user}
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          toggle2FA={toggle2FA}
          handlePasswordSave={handlePasswordSave}
        />
      )}

      {activeTab === "activity" && (
        <ActivityTab user={user} activityLog={activityLog} />
      )}

      {activeTab === "danger" && (
        <DangerZoneTab handleDeleteAccount={handleDeleteAccount} />
      )}
    </div>
  );
}

// =====================
// TAB COMPONENTS
// =====================

function OverviewTab({ user, billStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-[#0a1028] border border-slate-800 rounded-xl">
        <CardHeader>
          <CardTitle className="text-slate-100 text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            Profile Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-300 space-y-2">
          <p><span className="text-slate-400">Name:</span> {user.name}</p>
          <p><span className="text-slate-400">Email:</span> {user.email}</p>
          <p><span className="text-slate-400">Joined:</span> {user.joined}</p>
        </CardContent>
      </Card>

      <Card className="bg-[#0a1028] border border-slate-800 rounded-xl">
        <CardHeader>
          <CardTitle className="text-slate-100 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Warranty Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-300 space-y-1">
          <p>Total Bills: {billStats.total}</p>
          <p>Active: {billStats.active}</p>
          <p>Expiring Soon: {billStats.soon}</p>
          <p>Expired: {billStats.expired}</p>
        </CardContent>
      </Card>

      <Card className="bg-[#0a1028] border border-slate-800 rounded-xl">
        <CardHeader>
          <CardTitle className="text-slate-100 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-yellow-300" />
            Account Health
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-300 space-y-2">
          <p>
            2FA:{" "}
            <Badge className={user.twoFA ? "bg-emerald-700" : "bg-slate-600"}>
              {user.twoFA ? "Enabled" : "Disabled"}
            </Badge>
          </p>
          <p>Last Login: {user.lastLogin}</p>
          <p>Last Password Change: {user.lastPasswordChange}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function EditProfileTab({
  user,
  setUser,
  uploadPreview,
  handleAvatarChange,
  handleSaveProfile,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Avatar & Upload */}
      <Card className="bg-[#020617] border border-slate-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-slate-100 text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Avatar className="h-20 w-20 border-2 border-cyan-500 shadow-lg">
            <AvatarImage src={uploadPreview || ""} />
            <AvatarFallback className="bg-slate-700 text-white">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <label className="block">
            <span className="text-slate-300 text-sm mb-2 block">Change avatar</span>
            <Input
              type="file"
              accept="image/*"
              className="bg-slate-900 border border-slate-700 text-sm"
              onChange={handleAvatarChange}
            />
          </label>

          <p className="text-xs text-slate-500">
            Recommended: square image, at least 256x256px.
          </p>
        </CardContent>
      </Card>

      {/* Profile fields */}
      <Card className="bg-[#020617] border border-slate-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-slate-100 text-sm flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            Profile Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          <div>
            <label className="text-slate-300 text-xs">Full Name</label>
            <Input
              value={user.name}
              className="bg-slate-900 border border-slate-700 text-white mt-1"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-slate-300 text-xs">Email</label>
            <Input
              value={user.email}
              className="bg-slate-900 border border-slate-700 text-white mt-1"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          <Button
            className="bg-cyan-600 hover:bg-cyan-500 text-black font-semibold w-full mt-2"
            onClick={handleSaveProfile}
          >
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SecurityTab({
  user,
  passwordForm,
  setPasswordForm,
  toggle2FA,
  handlePasswordSave,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Change password */}
      <Card className="bg-[#020617] border border-slate-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-slate-100 text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <label className="text-slate-300 text-xs">Current Password</label>
            <Input
              type="password"
              value={passwordForm.current}
              className="bg-slate-900 border border-slate-700 text-white mt-1"
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, current: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-slate-300 text-xs">New Password</label>
            <Input
              type="password"
              value={passwordForm.next}
              className="bg-slate-900 border border-slate-700 text-white mt-1"
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, next: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-slate-300 text-xs">Confirm New Password</label>
            <Input
              type="password"
              value={passwordForm.confirm}
              className="bg-slate-900 border border-slate-700 text-white mt-1"
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirm: e.target.value })
              }
            />
          </div>

          <Button
            className="bg-emerald-600 hover:bg-emerald-500 text-black font-semibold w-full mt-2"
            onClick={handlePasswordSave}
          >
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* 2FA + security overview */}
      <Card className="bg-[#020617] border border-slate-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-slate-100 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Two-Factor Authentication (2FA)</p>
              <p className="text-xs text-slate-400">
                Extra protection for your account logins.
              </p>
            </div>
            <Button
              variant="outline"
              className={
                user.twoFA
                  ? "border-emerald-500 text-emerald-300"
                  : "border-slate-500 text-slate-300"
              }
              onClick={toggle2FA}
            >
              {user.twoFA ? "Disable" : "Enable"}
            </Button>
          </div>

          <div>
            <p className="font-semibold">Last Login</p>
            <p className="text-xs text-slate-400">{user.lastLogin}</p>
          </div>

          <div>
            <p className="font-semibold">Last Password Change</p>
            <p className="text-xs text-slate-400">{user.lastPasswordChange}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityTab({ user, activityLog }) {
  return (
    <Card className="bg-[#020617] border border-slate-800 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-slate-100 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-300">
        <p className="text-slate-400 text-xs mb-2">
          Activity for: <span className="text-slate-100">{user.email}</span>
        </p>
        {activityLog.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between border-b border-slate-800/70 pb-2 last:border-none"
          >
            <span>{item}</span>
            <span className="text-xs text-slate-500">Recently</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DangerZoneTab({ handleDeleteAccount }) {
  return (
    <Card className="bg-[#140b0b] border border-red-800 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-red-400 text-sm flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-red-200">
        <p>
          Deleting your account will remove your profile and may remove or
          orphan your saved bills and warranties. This action cannot be undone.
        </p>
        <Button
          variant="destructive"
          className="mt-2"
          onClick={handleDeleteAccount}
        >
          Permanently Delete My Account
        </Button>
      </CardContent>
    </Card>
  );
}
