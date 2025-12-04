"use client";

const batches = [
    { id: 1, course: "Full Stack Web Dev", batchName: "Batch 1", startDate: "2025-01-01" },
    { id: 2, course: "JavaScript Mastery", batchName: "Batch A", startDate: "2025-02-10" },
];

export default function BatchManagement() {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Manage Batches</h2>

            <div className="bg-white rounded-xl shadow p-4">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="p-3">Course</th>
                            <th className="p-3">Batch</th>
                            <th className="p-3">Start Date</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {batches.map(b => (
                            <tr key={b.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{b.course}</td>
                                <td className="p-3">{b.batchName}</td>
                                <td className="p-3">{b.startDate}</td>
                                <td className="p-3 text-blue-600 underline">Manage</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
