"use client";

import { useParams } from "next/navigation";
import mockCourses from "@/data/mockCourses";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from 'next/image';
export default function CourseDetails() {
    const { id } = useParams();
    const course = mockCourses.find((c) => c.id == id);

    if (!course)
        return <h2 className="text-center text-white mt-20">Course not found</h2>;

    return (
        <div className="px-6 md:px-20 py-12 min-h-screen text-white">
            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl overflow-hidden shadow-2xl bg-white/10
        backdrop-blur-2xl border border-white/20"
            >
                <Image
                    src={course.thumbnail}
                    className="w-full h-72 object-cover"
                    alt={course.title}
                />

                <div className="p-8">
                    <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
                    <p className="text-white/70">{course.description}</p>

                    <div className="flex items-center justify-between mt-6">
                        <span className="text-2xl font-semibold">${course.price}</span>

                        <Link
                            href="/student/dashboard"
                            className="px-6 py-3 bg-linear-to-r from-purple-500 to-blue-500
            rounded-xl text-white font-medium hover:opacity-80 transition"
                        >
                            Enroll Now
                        </Link>
                    </div>

                    {/* Syllabus */}
                    <h2 className="text-2xl font-semibold mt-10 mb-3">Syllabus</h2>
                    <ul className="space-y-3 text-white/80">
                        {course.syllabus.map((item, index) => (
                            <li
                                key={index}
                                className="bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/10"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        </div>
    );
}
