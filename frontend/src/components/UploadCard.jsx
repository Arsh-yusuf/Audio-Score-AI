function UploadCard({

    selectedFile,

    setSelectedFile,

    analyzeAudio

}) {

    return (

        <div className="bg-white rounded-xl shadow-md p-8">

            <input

                type="file"

                accept="audio/*"

                onChange={(e) =>

                    setSelectedFile(e.target.files[0])

                }

                className="w-full"

            />

            {selectedFile &&

                <p className="mt-4 text-green-600">

                    Selected:

                    {" "}

                    {selectedFile.name}

                </p>

            }

            <button

                onClick={analyzeAudio}

                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"

            >

                Analyze Pronunciation

            </button>

        </div>

    );

}

export default UploadCard;