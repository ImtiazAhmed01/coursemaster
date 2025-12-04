"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex justify-center items-center min-h-screen px-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20"
            >
                <h2 className="text-3xl font-semibold text-center mb-6">Create Account</h2>

                <form className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-3 rounded-lg bg-white/20 placeholder-white/60 text-white focus:ring-2 focus:ring-white/40 outline-none"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-lg bg-white/20 placeholder-white/60 text-white focus:ring-2 focus:ring-white/40 outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 rounded-lg bg-white/20 placeholder-white/60 text-white focus:ring-2 focus:ring-white/40 outline-none"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-linear-to-r from-purple-500 to-blue-500 rounded-lg font-medium hover:opacity-90 transition text-white"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center mt-4 text-white/70">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-white underline">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
