"use client";

export default function QuizCard({ q, index, setScore, quiz }) {
    const handleAnswer = (selected) => {
        let score = 0;
        quiz.forEach((item, i) => {
            if (i === index && selected === item.answer) {
                score++;
            }
        });
        setScore(score);
    };

    return (
        <div className="bg-white/10 p-6 rounded-2xl mb-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4">{q.question}</h3>

            {q.options.map((op, i) => (
                <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="w-full text-left px-4 py-3 bg-white/20 rounded-lg mt-2 hover:bg-white/30 transition"
                >
                    {op}
                </button>
            ))}
        </div>
    );
}
