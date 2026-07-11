function LoadingSpinner() {

    return (

        <div className="text-center mt-10">

            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>

            <p className="mt-4">

                Analyzing pronunciation...

            </p>

        </div>

    );

}

export default LoadingSpinner;