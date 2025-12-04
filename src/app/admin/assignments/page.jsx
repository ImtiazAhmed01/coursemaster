"use client";

const submissions = [
    {
        id: 1,
        student: "Rahim",
        course: "React Bootcamp",
        link: "https://drive.google.com/abc",
    },
    {
        id: 2,
        student: "Karim",
        course: "Node.js Masterclass",
        link: "https://drive.google.com/xyz",
    },
];

export default function AssignmentReview() {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Assignment Review</h2>

            <div className="bg-white p-4 rounded-xl shadow">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="p-3">Student</th>
                            <th className="p-3">Course</th>
                            <th className="p-3">Submission</th>
                        </tr>
                    </thead>

                    <tbody>
                        {submissions.map(s => (
                            <tr key={s.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{s.student}</td>
                                <td className="p-3">{s.course}</td>
                                <td className="p-3">
                                    <a
                                        href={s.link}
                                        target="_blank"
                                        className="text-blue-600 underline"
                                    >
                                        View
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
