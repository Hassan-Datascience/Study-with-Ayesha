import Navbar from "@/components/Navbar";
import UploadBox from "@/components/UploadBox";
import Link from "next/link";

export const metadata = {
    title: "Image Analysis | Study with Ayesha",
    description: "AI-powered architectural image analysis workspace.",
};

export default function UploadPage() {
    return (
        <div
            className="relative min-h-screen w-full luxury-gradient flex flex-col items-center"
            style={{ fontFamily: "Manrope, sans-serif" }}
        >
            <Navbar />

            <UploadBox />

            {/* Footer */}
        </div>
    );
}
