"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import mockCourses from "@/data/mockCourses";
import Image from "next/image";

export default function StudentDashboard() {
    return (
        <div className="px-6 md:px-16 py-10 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

            {/* TOP CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { title: "Enrolled Courses", value: mockCourses.length },
                    { title: "Completed Lessons", value: 32 },
                    { title: "Total Progress", value: "64%" },
                ].map((c, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="bg-white/10 p-6 rounded-2xl border border-white/10
            backdrop-blur-xl shadow-xl"
                    >
                        <p className="text-lg">{c.title}</p>
                        <h2 className="text-3xl font-bold mt-2">{c.value}</h2>
                    </motion.div>
                ))}
            </div>

            {/* ENROLLED COURSES */}
            <h2 className="text-2xl font-semibold mb-4">Your Courses</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockCourses.map((course, i) => (
                    <Link
                        key={i}
                        href={`/student/course/${course.id}`}
                        className="bg-white/10 border border-white/20 rounded-2xl p-5 shadow-xl 
            hover:scale-105 transition cursor-pointer backdrop-blur-xl"
                    >
                        <Image
                            src={course.thumbnail}
                            className="w-full h-44 object-cover rounded-xl"
                        />
                        <h3 className="text-xl font-semibold mt-4">{course.title}</h3>
                        <p className="text-white/70">{course.instructor}</p>

                        <div className="mt-4 w-full h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                style={{ width: `${(i + 1) * 20}%` }}
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                            ></div>
                        </div>
                        <p className="text-sm text-white/60 mt-1">
                            {(i + 1) * 20}% Completed
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
