"use client";

import { useState } from "react";
import axios from "axios";

interface AudioUploadProps {
  onUploadSuccess: () => void;
}

export default function AudioUpload({ onUploadSuccess }: AudioUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        setMessage({ type: "error", text: "File must be less than 1MB" });
        return;
      }
      const validTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/webm",
        "audio/ogg",
        "audio/mp4",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setMessage({
          type: "error",
          text: "Please upload a valid audio file (MP3, WAV, WebM, OGG, M4A)",
        });
        return;
      }
      setFile(selectedFile);
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await axios.post("/api/transcripts/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setMessage({
          type: "success",
          text: "Audio transcribed successfully!",
        });
        setFile(null);
        (e.target as HTMLFormElement).reset();
        onUploadSuccess();
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Upload failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Upload Audio File</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {message.text && (
          <div
            className={`p-4 rounded ${
              message.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
            id="audio-input"
          />
          <label
            htmlFor="audio-input"
            className="cursor-pointer block text-gray-300 hover:text-blue-400 transition"
          >
            <p className="text-lg font-semibold">Click to select audio file</p>
            <p className="text-sm text-gray-400 mt-1">
              (MP3, WAV, WebM, OGG, M4A - max 1MB)
            </p>
            {file && (
              <p className="text-blue-400 mt-2 font-semibold">{file.name}</p>
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 rounded transition"
        >
          {loading ? "Transcribing..." : "Upload & Transcribe"}
        </button>
      </form>
    </div>
  );
}
