import { Target, Lightbulb, Volume2 } from "lucide-react";

function SeverityDot({ severity }) {
    return (
        <span
            className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${
                severity === "high" ? "bg-red-500" : "bg-orange-400"
            }`}
        />
    );
}

function MistakesCard({ mistakes }) {
    const hasMistakes = mistakes && mistakes.length > 0;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <Target size={18} className="text-indigo-500" />
                    <h2 className="text-base font-semibold text-gray-800">Words to Practice</h2>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                        High Priority
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                        Medium Priority
                    </span>
                </div>
            </div>

            {!hasMistakes ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                    <span className="text-xl">🎉</span>
                    <p className="text-sm text-green-700 font-medium">
                        Excellent! No significant pronunciation issues detected.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {mistakes.map((mistake, index) => {
                        const confidence = (mistake.confidence * 100).toFixed(0);
                        const isHigh = mistake.severity === "high";

                        return (
                            <div
                                key={index}
                                className="grid grid-cols-1 sm:grid-cols-[200px_1fr_1fr] gap-4 py-5 first:pt-0 last:pb-0"
                            >
                                {/* ── Col 1: Word ── */}
                                <div className="flex items-start gap-3">
                                    <SeverityDot severity={mistake.severity} />
                                    <button
                                        className="text-gray-400 hover:text-indigo-500 transition mt-0.5"
                                        aria-label={`Hear ${mistake.word}`}
                                    >
                                        <Volume2 size={16} />
                                    </button>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{mistake.word}</p>
                                        <span
                                            className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                                                isHigh
                                                    ? "bg-red-50 text-red-600"
                                                    : "bg-orange-50 text-orange-600"
                                            }`}
                                        >
                                            Confidence: {confidence}%
                                        </span>
                                    </div>
                                </div>

                                {/* ── Col 2: Reason ── */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                        Reason
                                    </p>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {mistake.reason || "—"}
                                    </p>
                                </div>

                                {/* ── Col 3: Tip ── */}
                                <div className="flex items-start gap-2">
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                            Tip
                                        </p>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {mistake.tip || "Practice slowly and listen to native speakers."}
                                        </p>
                                    </div>
                                    <Lightbulb
                                        size={16}
                                        className="text-green-400 flex-shrink-0 mt-0.5"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MistakesCard;