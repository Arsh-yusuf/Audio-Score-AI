function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center py-14 gap-5">
            {/* Animated waveform bars */}
            <div className="flex items-end gap-1.5">
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
            </div>
            <div className="text-center">
                <p className="text-sm font-semibold text-indigo-600">Analyzing pronunciation…</p>
                <p className="text-xs text-gray-400 mt-1">This may take a few seconds</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;