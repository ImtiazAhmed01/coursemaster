import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "CourseMaster",
  description: "Modern E-learning Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600`}
      >
        {/* Glass Wrapper */}
        <div className="backdrop-blur-xl bg-white/10 min-h-screen text-white">
          {children}
        </div>
      </body>
    </html>
  );
}
