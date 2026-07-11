import { Star, User, AudioLines, BarChart2 } from "lucide-react";

// Cycle through 3 icon styles for visual variety
const ICON_STYLES = [
    { Icon: User,       bg: "bg-purple-100", color: "text-purple-600" },
    { Icon: AudioLines, bg: "bg-blue-100",   color: "text-blue-600"   },
    { Icon: BarChart2,  bg: "bg-green-100",  color: "text-green-600"  },
];

function FeedbackCard({ feedback }) {
    if (!feedback || feedback.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
                <Star size={18} className="text-indigo-500" />
                <h2 className="text-base font-semibold text-gray-800">Overall Feedback</h2>
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {feedback.map((item, index) => {
                    const { Icon, bg, color } = ICON_STYLES[index % ICON_STYLES.length];
                    return (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
                        >
                            <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
                                <Icon size={16} className={color} />
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default FeedbackCard;