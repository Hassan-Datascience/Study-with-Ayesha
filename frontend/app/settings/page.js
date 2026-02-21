import SettingsUI from "@/components/SettingsUI";
import Navbar from "@/components/Navbar";

export const metadata = {
    title: "Settings | Study with Ayesha",
    description: "Manage your account and preferences.",
};

export default function SettingsPage() {
    return (
        <div
            className="min-h-screen bg-[#18140c] text-[#fdfcf7] flex flex-col"
            style={{ fontFamily: "Lexend, sans-serif" }}
        >
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[rgba(238,189,43,0.03)] blur-[150px] rounded-full" />
            </div>

            <Navbar />

            <main className="flex-1 relative z-10 px-6 py-12 md:px-20">
                <SettingsUI />
            </main>
        </div>
    );
}
