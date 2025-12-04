"use client";

export default function EditCourse({ params }) {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">
                Edit Course – ID: {params.id}
            </h2>

            <form className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4">
                <input type="text" className="input-default" value="Sample Course" />

                <input type="text" className="input-default" value="Imtiaz Ahmed" />

                <input type="number" className="input-default" value="499" />

                <input type="text" className="input-default" value="Programming" />

                <textarea rows={5} className="input-default">
                    This is the course description...
                </textarea>

                <button className="btn-primary">Save Changes</button>
            </form>
        </div>
    );
}
