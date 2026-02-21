import Navbar from "@/components/Navbar";
import ChatUI from "@/components/ChatUI";
import Link from "next/link";

export const metadata = {
    title: "AI Tutor Chat | Study with Ayesha",
    description: "Real-time conversational AI tutoring for architectural mastery.",
};

export default function ChatPage() {
    return (
        <div
            className="min-h-screen flex flex-col bg-[#3d2b1f]"
            style={{ fontFamily: "Lexend, sans-serif" }}
        >
            <Navbar />

            <ChatUI />
        </div>
    );
}
