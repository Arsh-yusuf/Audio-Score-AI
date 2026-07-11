import { useState } from "react";
import { Mic } from "lucide-react";

import UploadCard from "./components/UploadCard";
import ScoreCard from "./components/ScoreCard";
import TranscriptCard from "./components/TranscriptCard";
import MistakesCard from "./components/MistakesCard";
import FeedbackCard from "./components/FeedbackCard";
import LoadingSpinner from "./components/LoadingSpinner";

import api from "./services/api";
import "./App.css";

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const analyzeAudio = async () => {
        if (!selectedFile) {
            setError("Please select an audio file first.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await api.post("/analyze", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult(response.data);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.detail || "An error occurred.");
            } else {
                setError("Unable to connect to the backend. Is the server running?");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f2f8]">

            {/* ── Hero Header ── */}
            <header
                className="relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)",
                }}
            >
                {/* Decorative blurred circles */}
                <div
                    className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }}
                />
                <div
                    className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-15"
                    style={{ background: "radial-gradient(circle, #818cf8, transparent)" }}
                />

                <div className="relative max-w-4xl mx-auto px-6 py-10 flex items-center gap-6">
                    {/* Mic icon bubble */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <Mic size={32} className="text-white" />
                    </div>

                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            English Pronunciation Assessment
                        </h1>
                        <p className="mt-1 text-indigo-200 text-sm sm:text-base max-w-xl">
                            Upload your 30–45 second English audio recording and get AI-powered pronunciation feedback.
                        </p>
                    </div>
                </div>
            </header>

            {/* ── Main content ── */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

                <UploadCard
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    analyzeAudio={analyzeAudio}
                />

                {loading && <LoadingSpinner />}

                {error && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                        <span className="text-lg">⚠️</span>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="space-y-6">
                        <ScoreCard result={result} />
                        <TranscriptCard
                            transcript={result.transcript}
                            mistakes={result.mistakes}
                        />
                        <MistakesCard mistakes={result.mistakes} />
                        <FeedbackCard feedback={result.feedback} />
                    </div>
                )}

            </main>

            {/* ── Footer ── */}
            <footer className="text-center py-6 text-xs text-gray-400">
                Powered by AI &bull; Built with ❤️ for better pronunciation
            </footer>
        </div>
    );
}

export default App;