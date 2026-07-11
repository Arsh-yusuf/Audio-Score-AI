import { Clock, Globe, AudioLines, Calendar } from "lucide-react";

const RADIUS = 50;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 314

function ScoreRing({ score }) {
    const clampedScore = Math.min(100, Math.max(0, score));
    const offset = CIRCUMFERENCE - (clampedScore / 100) * CIRCUMFERENCE;

    let ringColor = "#ef4444"; // red
    if (clampedScore >= 90) ringColor = "#22c55e"; // green
    else if (clampedScore >= 75) ringColor = "#f59e0b"; // amber

    return (
        <svg width="140" height="140" viewBox="0 0 120 120" className="drop-shadow-sm">
            {/* Track */}
            <circle
                cx="60" cy="60" r={RADIUS}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
            />
            {/* Progress */}
            <circle
                cx="60" cy="60" r={RADIUS}
                fill="none"
                stroke={ringColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                className="score-ring-circle"
                style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
            {/* Score text */}
            <text x="60" y="55" textAnchor="middle" dominantBaseline="middle"
                fontSize="22" fontWeight="800" fill="#1e1b4b">
                {clampedScore}
            </text>
            <text x="60" y="72" textAnchor="middle" dominantBaseline="middle"
                fontSize="10" fill="#9ca3af">
                /100
            </text>
        </svg>
    );
}

function getLabel(score) {
    if (score >= 90) return { text: "Excellent! 🌟", badge: "Excellent", color: "bg-green-100 text-green-700" };
    if (score >= 75) return { text: "Good Job! 👏", badge: "Good", color: "bg-amber-100 text-amber-700" };
    if (score >= 60) return { text: "Keep Going! 💪", badge: "Fair", color: "bg-orange-100 text-orange-700" };
    return { text: "Needs Work 📚", badge: "Needs Work", color: "bg-red-100 text-red-700" };
}

function MetaChip({ icon: Icon, label, value, iconColor }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${iconColor}`}>
                <Icon size={16} />
            </div>
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );
}

function ScoreCard({ result }) {
    const score = result.overall_score;
    const confidence = (result.average_confidence * 100).toFixed(1);
    const totalWords = result.total_words;
    const label = getLabel(score);
    const today = new Date().toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit"
    });

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-5">
                Overall Pronunciation Score
            </h2>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                {/* ── Ring + label ── */}
                <div className="flex flex-col items-center gap-3">
                    <ScoreRing score={score} />
                    <div className="text-center">
                        <p className="text-base font-bold text-gray-800">{label.text}</p>
                        <p className="text-xs text-gray-500 mt-0.5 max-w-[180px]">
                            {score >= 75
                                ? "You have a clear pronunciation with a few areas to improve."
                                : "Focus on the highlighted words and practice daily."}
                        </p>
                        <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold ${label.color}`}>
                            {label.badge}
                        </span>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="hidden sm:block w-px self-stretch bg-gray-100" />

                {/* ── Meta grid ── */}
                <div className="flex-1 grid grid-cols-2 gap-5 sm:pl-4 w-full">
                    <MetaChip
                        icon={Clock}
                        label="Total Words"
                        value={`${totalWords} words`}
                        iconColor="bg-blue-50 text-blue-500"
                    />
                    <MetaChip
                        icon={Globe}
                        label="Language"
                        value="English"
                        iconColor="bg-green-50 text-green-500"
                    />
                    <MetaChip
                        icon={AudioLines}
                        label="Avg. Confidence"
                        value={`${confidence}%`}
                        iconColor="bg-violet-50 text-violet-500"
                    />
                    <MetaChip
                        icon={Calendar}
                        label="Analyzed At"
                        value={today}
                        iconColor="bg-orange-50 text-orange-500"
                    />
                </div>
            </div>
        </div>
    );
}

export default ScoreCard;