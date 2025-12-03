"use client";

import { useEffect } from "react";

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) window.location.href = "/dashboard";
}, []);

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Mail, Lock, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        // LOGIN
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      } else {
        // SIGNUP
        await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        alert("Signup successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-60 h-60 bg-cyan-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-700/20 rounded-full blur-[120px]" />

      <Card className="w-full max-w-md bg-[#0a1028] border border-slate-800 shadow-xl rounded-2xl relative z-10 p-2">
        <CardHeader>
          <CardTitle className="text-center text-cyan-300 text-2xl font-semibold">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </CardTitle>
          <p className="text-center text-slate-400 text-sm">
            {isLogin
              ? "Login to continue to Warranty Vault"
              : "Let's get you started"}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-slate-300 text-xs">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  className="bg-slate-900 border border-slate-700 text-white pl-10"
                  placeholder="Tarun R"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-slate-300 text-xs">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                className="bg-slate-900 border border-slate-700 text-white pl-10"
                placeholder="tarun@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-xs">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                type="password"
                className="bg-slate-900 border border-slate-700 text-white pl-10"
                placeholder="********"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <Button
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-semibold mt-4"
            onClick={handleSubmit}
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>

          <p className="text-center text-slate-400 text-sm mt-3">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="text-cyan-300 cursor-pointer hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Login"}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
