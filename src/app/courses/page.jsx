"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import mockCourses from "@/data/mockCourses";

export default function CourseListing() {
    const [search, setSearch] = useState("");

    const filteredCourses = mockCourses.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="px-6 md:px-16 py-10 text-white min-h-screen">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-4xl font-bold mb-6"
            >
                All Courses
            </motion.h1>

            {/* SEARCH BAR */}
            <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-1/2 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-xl
        placeholder-white/50 text-white focus:ring-2 focus:ring-white/40 mb-8 outline-none"
            />

            {/* COURSE GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course, i) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <CourseCard course={course} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
