"use client";

export default function AssignmentSubmit() {
    return (
        <div className="px-6 md:px-20 py-10 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Assignment Submission</h1>

            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-xl">
                <p className="mb-4 text-white/70">
                    Submit your assignment Google Drive link:
                </p>

                <input
                    type="text"
                    placeholder="https://drive.google.com/..."
                    className="w-full px-4 py-3 rounded-xl bg-white/20 text-white
          placeholder-white/60 outline-none focus:ring-2 focus:ring-white/40"
                />

                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl w-full">
                    Submit Assignment
                </button>
            </div>
        </div>
    );
}
