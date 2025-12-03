"use client";

import { useState } from "react";
import api from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export default function UploadBillPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Electronics");

  const handleDrop = (e) => {
    e.preventDefault();
    const uploaded = e.dataTransfer.files[0];
    handleFile(uploaded);
  };

  const handleFile = (uploaded) => {
    if (!uploaded) return;
    setFile(uploaded);
    setPreview(URL.createObjectURL(uploaded));
  };

  const handleUpload = async () => {
    if (!file) return toast("Please upload a bill");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    try {
      await api.post("/bills/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast("Bill uploaded successfully!");

      setFile(null);
      setPreview("");
    } catch (err) {
      console.error(err);
      toast("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 py-8 text-white">
      <h1 className="text-3xl font-bold text-cyan-300">Upload Bill</h1>
      <p className="text-slate-400 mb-8">
        Upload your bill & the system will auto-extract warranty details.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 max-w-3xl rounded-2xl bg-[#0a1623]/70 border border-slate-800 glass-card shadow-xl shadow-cyan-500/5"
      >
        {/* Category */}
        <label className="text-sm text-slate-300">Category</label>
        <select
          className="mt-1 w-48 bg-slate-900 border border-slate-700 text-slate-200 rounded-md px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Electronics</option>
          <option>Appliances</option>
          <option>Accessories</option>
          <option>Other</option>
        </select>

        {/* Drag + Upload Box */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="mt-8 flex flex-col items-center justify-center border-2 border-dashed border-cyan-500/40 rounded-xl h-48 cursor-pointer bg-slate-900/40 hover:bg-slate-800/40 transition shadow-lg shadow-cyan-600/10"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <input
            id="fileInput"
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          <div className="text-center">
            <div className="text-cyan-400 text-2xl mb-2">⬆ Upload</div>
            <p className="text-slate-300">Drag & drop your bill</p>
            <p className="text-slate-500 text-sm">(or click to browse)</p>
          </div>

          {file && (
            <p className="mt-3 text-slate-300 text-sm">{file.name}</p>
          )}
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-6">
            <h3 className="text-slate-300 mb-2">Preview</h3>
            <div className="p-3 bg-black rounded-xl border border-slate-800">
              <img
                src={preview}
                alt="Preview"
                className="rounded-lg max-h-96 object-contain"
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-semibold shadow-lg shadow-cyan-500/30"
        >
          {loading ? "Uploading..." : "Upload Bill"}
        </button>
      </motion.div>
    </div>
  );
}