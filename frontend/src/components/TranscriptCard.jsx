import { useState } from "react";
import { FileText, Copy, Check } from "lucide-react";

function TranscriptCard({ transcript, mistakes = [] }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(transcript).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Build a set of mistake words (lower-cased) for fast lookup
    const mistakeMap = {};
    mistakes.forEach((m) => {
        const key = m.word.toLowerCase();
        mistakeMap[key] = m.severity; // "high" | "medium"
    });

    // Tokenise transcript into words+punctuation, highlight mistakes
    const renderHighlightedText = () => {
        const tokens = transcript.split(/(\s+)/); // keep whitespace tokens
        return tokens.map((token, i) => {
            const clean = token.replace(/[^a-zA-Z'-]/g, "").toLowerCase();
            const severity = mistakeMap[clean];

            if (severity === "high") {
                return (
                    <mark
                        key={i}
                        className="bg-transparent text-orange-500 font-semibold underline underline-offset-2 decoration-dotted"
                    >
                        {token}
                    </mark>
                );
            }
            if (severity === "medium") {
                return (
                    <mark
                        key={i}
                        className="bg-transparent text-amber-500 font-semibold underline underline-offset-2 decoration-dotted"
                    >
                        {token}
                    </mark>
                );
            }
            return <span key={i}>{token}</span>;
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FileText size={18} className="text-indigo-500" />
                    <h2 className="text-base font-semibold text-gray-800">Transcript</h2>
                </div>
                <button
                    id="copy-transcript-btn"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 transition px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                >
                    {copied
                        ? <><Check size={13} className="text-green-500" /> Copied!</>
                        : <><Copy size={13} /> Copy</>
                    }
                </button>
            </div>

            {/* Body */}
            <p className="text-sm text-gray-700 leading-8">
                {renderHighlightedText()}
            </p>
        </div>
    );
}

export default TranscriptCard;