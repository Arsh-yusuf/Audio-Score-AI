import { useState } from "react";

import UploadCard from "./components/UploadCard";
import ScoreCard from "./components/ScoreCard";
import TranscriptCard from "./components/TranscriptCard";
import MistakesCard from "./components/MistakesCard";
import FeedbackCard from "./components/FeedbackCard";
import LoadingSpinner from "./components/LoadingSpinner";

import api from "./services/api";

function App() {

    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const [error, setError] = useState("");

    const analyzeAudio = async () => {

        if (!selectedFile) {

            setError("Please select an audio file.");

            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        const formData = new FormData();

        formData.append("file", selectedFile);

        try {

            const response = await api.post(
                "/analyze",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setResult(response.data);

        }

        catch (err) {

            if (err.response) {

                setError(err.response.data.detail);

            }

            else {

                setError("Unable to connect to backend.");
            }

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-gray-100">

            <div className="max-w-5xl mx-auto p-8">

                <h1 className="text-4xl font-bold text-center">

                    🎤 English Pronunciation Assessment

                </h1>

                <p className="text-center text-gray-600 mt-3">

                    Upload a 30–45 second English audio recording.

                </p>

                <div className="mt-10">

                    <UploadCard
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        analyzeAudio={analyzeAudio}
                    />

                </div>

                {loading &&

                    <LoadingSpinner />

                }

                {error &&

                    <div className="mt-6 p-4 rounded-lg bg-red-100 text-red-700">

                        {error}

                    </div>

                }

                {result &&

                    <div className="space-y-6 mt-8">

                        <ScoreCard result={result} />

                        <TranscriptCard transcript={result.transcript} />

                        <MistakesCard mistakes={result.mistakes} />

                        <FeedbackCard feedback={result.feedback} />

                    </div>

                }

            </div>

        </div>

    );

}

export default App;