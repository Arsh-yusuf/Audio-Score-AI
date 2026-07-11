import { useState, useRef } from "react";
import { UploadCloud, AudioLines, CheckCircle2, X, ShieldCheck } from "lucide-react";

function UploadCard({ selectedFile, setSelectedFile, analyzeAudio }) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) setSelectedFile(file);
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row gap-4">

                {/* ── Left: Drop zone ── */}
                <label
                    htmlFor="audio-upload"
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`
                        flex-1 cursor-pointer rounded-xl border-2 border-dashed p-8
                        flex flex-col items-center justify-center gap-2 transition-all duration-200
                        ${dragging
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-indigo-200 bg-indigo-50/40 hover:border-indigo-400 hover:bg-indigo-50"
                        }
                    `}
                >
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                        <UploadCloud size={28} className="text-indigo-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mt-1">
                        Drag &amp; drop your audio file here
                    </p>
                    <p className="text-xs text-gray-400">or click to browse</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Supports: MP3, WAV, M4A &nbsp;(Max size: 25MB)
                    </p>

                    <input
                        id="audio-upload"
                        ref={inputRef}
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                </label>

                {/* ── Right: File info + button ── */}
                <div className="flex flex-col gap-3 sm:w-60">
                    {selectedFile ? (
                        <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
                            <CheckCircle2 size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {formatSize(selectedFile.size)}
                                </p>
                            </div>
                            <button
                                onClick={(e) => { e.preventDefault(); setSelectedFile(null); }}
                                className="text-gray-400 hover:text-gray-600 transition"
                                aria-label="Remove file"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-4 rounded-xl border border-dashed border-gray-200 text-gray-400 text-xs text-center">
                            No file selected yet
                        </div>
                    )}

                    <button
                        id="analyze-btn"
                        onClick={analyzeAudio}
                        className="
                            flex items-center justify-center gap-2
                            w-full py-3 px-4 rounded-xl font-semibold text-sm text-white
                            transition-all duration-200 shadow-md hover:shadow-lg active:scale-95
                        "
                        style={{
                            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        }}
                    >
                        <AudioLines size={18} />
                        Analyze Pronunciation
                    </button>
                </div>
            </div>

            {/* Security note */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <ShieldCheck size={13} />
                Your audio is processed securely and not stored on our servers.
            </div>
        </div>
    );
}

export default UploadCard;