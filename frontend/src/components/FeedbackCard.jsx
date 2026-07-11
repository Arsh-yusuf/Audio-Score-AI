function FeedbackCard({ feedback }) {

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-4">

                Overall Feedback

            </h2>

            <ul className="space-y-4">

                {feedback.map((item, index) => (

                    <li
                        key={index}
                        className="flex gap-3"
                    >

                        <span className="text-green-600">

                            ✓

                        </span>

                        <span>

                            {item}

                        </span>

                    </li>

                ))}

            </ul>

        </div>

    );

}

export default FeedbackCard;