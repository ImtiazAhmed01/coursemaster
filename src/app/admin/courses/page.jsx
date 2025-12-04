"use client";

import Link from "next/link";

const courses = [
    {
        id: 1,
        title: "Advanced JavaScript Mastery",
        price: 499,
        instructor: "Imtiaz Ahmed",
        category: "Programming",
    },
    {
        id: 2,
        title: "Full Stack Web Dev Bootcamp",
        price: 699,
        instructor: "John Doe",
        category: "Web Development",
    },
];

export default function AdminCourses() {
    return (
        <div className="p-6">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold">Manage Courses</h2>

                <Link
                    href="/admin/courses/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Add New Course
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="p-3">Title</th>
                            <th className="p-3">Instructor</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Price</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{course.title}</td>
                                <td className="p-3">{course.instructor}</td>
                                <td className="p-3">{course.category}</td>
                                <td className="p-3">${course.price}</td>

                                <td className="p-3 flex gap-3 justify-center">
                                    <Link
                                        href={`/admin/courses/${course.id}`}
                                        className="text-blue-600 underline"
                                    >
                                        Edit
                                    </Link>

                                    <button className="text-red-600 underline">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
