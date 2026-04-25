"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Transcript {
  id: string;
  audioFilename: string;
  transcript: string;
  duration: number;
  createdAt: string;
}

interface TranscriptListProps {
  refreshTrigger: number;
}

export default function TranscriptList({ refreshTrigger }: TranscriptListProps) {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/transcripts/list");
        setTranscripts(response.data.transcripts || []);
      } catch (error) {
        console.error("Failed to fetch transcripts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscripts();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-400 text-center">Loading transcripts...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Your Transcripts</h2>

      {transcripts.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          No transcripts yet. Upload an audio file to get started!
        </p>
      ) : (
        <div className="space-y-4">
          {transcripts.map((transcript) => (
            <div
              key={transcript.id}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-blue-500 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">
                  {transcript.audioFilename}
                </h3>
                <span className="text-xs text-gray-400">
                  {new Date(transcript.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {transcript.transcript}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Duration: {Math.round(transcript.duration)}s
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
