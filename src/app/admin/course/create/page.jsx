"use client";

export default function AddCourse() {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Add New Course</h2>

            <form className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Course Title"
                    className="input-default"
                />

                <input
                    type="text"
                    placeholder="Instructor Name"
                    className="input-default"
                />

                <input
                    type="number"
                    placeholder="Price"
                    className="input-default"
                />

                <input
                    type="text"
                    placeholder="Category"
                    className="input-default"
                />

                <textarea
                    placeholder="Course Description"
                    rows={5}
                    className="input-default"
                />

                <button className="btn-primary">Create Course</button>
            </form>
        </div>
    );
}
