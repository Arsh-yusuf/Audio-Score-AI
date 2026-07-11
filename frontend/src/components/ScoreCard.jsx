function ScoreCard({ result }) {

    const score = result.overall_score;

    let color = "text-red-600";

    if (score >= 90) {
        color = "text-green-600";
    }
    else if (score >= 75) {
        color = "text-yellow-600";
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-4">
                Overall Pronunciation Score
            </h2>

            <div className={`text-6xl font-bold ${color}`}>
                {score}
                <span className="text-2xl text-gray-500"> /100</span>
            </div>

            <p className="mt-4 text-gray-600">
                Average Confidence: {result.average_confidence}
            </p>

        </div>
    );
}

export default ScoreCard;