import Image from "next/image";
import Link from "next/link";

export default function CourseCard({ course }) {
    return (
        <Link
            href={`/courses/${course.id}`}
            className="block rounded-2xl bg-white/10 backdrop-blur-xl shadow-xl 
      border border-white/20 overflow-hidden hover:scale-105 transition cursor-pointer"
        >
            <Image
                src={course.thumbnail}
                className="w-full h-48 object-cover"
                alt={course.title}
            />

            <div className="p-5">
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <p className="text-white/70 text-sm">{course.instructor}</p>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold">${course.price}</span>
                    <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                        View
                    </button>
                </div>
            </div>
        </Link>
    );
}
