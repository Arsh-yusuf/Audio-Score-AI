function TranscriptCard({ transcript }) {

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-4">
                Transcript
            </h2>

            <p className="leading-8 text-gray-700">
                {transcript}
            </p>

        </div>

    );

}

export default TranscriptCard;