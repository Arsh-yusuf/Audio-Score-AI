function MistakesCard({ mistakes }) {

    if (!mistakes || mistakes.length === 0) {

        return (

            <div className="bg-white rounded-xl shadow-md p-6">

                <h2 className="text-2xl font-semibold mb-4">
                    Words to Practice
                </h2>

                <p className="text-green-600">
                    Excellent! No significant pronunciation issues detected.
                </p>

            </div>

        );

    }

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-6">
                Words to Practice
            </h2>

            <div className="space-y-5">

                {mistakes.map((mistake, index) => (

                    <div
                        key={index}
                        className="border rounded-lg p-5"
                    >

                        <div className="flex justify-between items-center">

                            <h3 className="text-xl font-semibold">

                                {mistake.severity === "high"
                                    ? "🔴"
                                    : "🟠"}

                                {" "}

                                {mistake.word}

                            </h3>

                            <span className="text-sm text-gray-500">

                                Confidence:

                                {" "}

                                {(mistake.confidence * 100).toFixed(0)}%

                            </span>

                        </div>

                        <div className="mt-4">

                            <p className="font-semibold">
                                Reason
                            </p>

                            <p className="text-gray-700">
                                {mistake.reason}
                            </p>

                        </div>

                        <div className="mt-4">

                            <p className="font-semibold">
                                Practice Tip
                            </p>

                            <p className="text-gray-700">
                                {mistake.tip}
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default MistakesCard;