export default function ProgressBar({ progress }) {
    return (
        <div className="w-full mt-4">
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-white/60 text-sm mt-1">{progress}% completed</p>
        </div>
    );
}
