"use client";

import { useState } from "react";
import QuizCard from "@/components/QuizCard";

const quiz = [
    {
        question: "What does MERN stand for?",
        options: ["MongoDB Express React Node", "Mongo Ember React Next", "None"],
        answer: 0,
    },
    {
        question: "React is a ___?",
        options: ["Framework", "Library", "Compiler"],
        answer: 1,
    },
];

export default function QuizPage() {
    const [score, setScore] = useState(null);

    return (
        <div className="px-6 md:px-20 py-10 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Course Quiz</h1>

            {score === null ? (
                quiz.map((q, i) => (
                    <QuizCard key={i} q={q} index={i} setScore={setScore} quiz={quiz} />
                ))
            ) : (
                <div className="bg-white/10 p-8 rounded-2xl border border-white/20 text-center">
                    <h2 className="text-3xl font-bold mb-3">Your Score</h2>
                    <p className="text-5xl font-bold">{score} / {quiz.length}</p>
                </div>
            )}
        </div>
    );
}
