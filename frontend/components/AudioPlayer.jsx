"use client";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const Waveform = ({ isPlaying }) => {
    return (
        <div className="flex items-center gap-1 h-12">
            {[...Array(40)].map((_, i) => (
                <div
                    key={i}
                    className="w-1 bg-[#eebd2b] rounded-full transition-all duration-300"
                    style={{
                        height: isPlaying ? `${Math.random() * 100}%` : "10%",
                        opacity: isPlaying ? 0.8 : 0.3,
                        animation: isPlaying ? `wave 1s infinite ${i * 0.05}s` : "none",
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes wave {
                    0%, 100% { height: 10%; }
                    50% { height: 100%; }
                }
            `}</style>
        </div>
    );
};

export default function AudioPlayer() {
    const { t, language } = useLanguage();
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState("transcript"); // transcript, notes, quiz
    const [progress, setProgress] = useState(45);

    // Localized chapters (simulated)
    const chapters = [
        { id: 1, title: language === 'ur' ? "جیومیٹری کا تعارف" : "Introduction to Geometry", duration: "04:12", playing: false },
        { id: 2, title: language === 'ur' ? "سنہری تناسب" : "The Golden Ratio", duration: "08:45", playing: false },
        { id: 3, title: language === 'ur' ? "قرطبہ میں پیچیدہ جیومیٹری" : "Complex Geometry in Cordoba", duration: "28:45", playing: true },
        { id: 4, title: language === 'ur' ? "روشنی اور سایہ" : "Light and Shadow", duration: "12:30", playing: false },
        { id: 5, title: language === 'ur' ? "ساختی سالمیت" : "Structural Integrity", duration: "15:20", playing: false },
    ];

    return (
        <main
            className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
            style={{ fontFamily: language === 'en' ? "Lexend, sans-serif" : undefined }}
        >
            {/* Left Column: Player & Visualization (2 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Main Player Card */}
                <div className="bg-[#18140c] border border-[rgba(238,189,43,0.2)] rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(238,189,43,0.1)] blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className={`text-2xl md:text-3xl font-bold text-white mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
                                    {language === 'ur' ? "قرطبہ میں پیچیدہ جیومیٹری" : "Complex Geometry in Cordoba"}
                                </h1>
                                <p className={`text-[#eebd2b] text-sm font-medium tracking-wide ${language === 'ur' ? 'font-urdu' : ''}`}>
                                    {t.audio.chapter}
                                </p>
                            </div>
                            <button className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] p-2 rounded-full transition-colors">
                                <span className="material-symbols-outlined text-white">more_horiz</span>
                            </button>
                        </div>

                        {/* Visualization */}
                        <div className="h-32 flex items-center justify-center mb-8 bg-[rgba(0,0,0,0.2)] rounded-2xl border border-[rgba(255,255,255,0.05)]">
                            <Waveform isPlaying={isPlaying} />
                        </div>

                        {/* Progress */}
                        <div className="mb-8">
                            <div className="flex justify-between text-xs font-medium text-[rgba(255,255,255,0.4)] mb-2">
                                <span>12:45</span>
                                <span>28:45</span>
                            </div>
                            <div className="relative h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                                <div
                                    className={`absolute top-0 h-full bg-[#eebd2b] rounded-full ${language === 'ur' ? 'right-0' : 'left-0'}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">shuffle</span>
                                </button>
                                <button className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors">
                                    <span className={`material-symbols-outlined text-2xl ${language === 'ur' ? 'rotate-180' : ''}`}>skip_previous</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="size-16 rounded-full bg-[#eebd2b] hover:bg-[#ffcd38] flex items-center justify-center shadow-[0_0_30px_rgba(238,189,43,0.3)] transition-all transform hover:scale-105"
                            >
                                <span className={`material-symbols-outlined text-[#18140c] text-4xl fill-current ${language === 'ur' && !isPlaying ? 'rotate-180' : ''}`}>
                                    {isPlaying ? "pause" : "play_arrow"}
                                </span>
                            </button>

                            <div className="flex items-center gap-4">
                                <button className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors">
                                    <span className={`material-symbols-outlined text-2xl ${language === 'ur' ? 'rotate-180' : ''}`}>skip_next</span>
                                </button>
                                <button className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">repeat</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Panels (stats/info) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[rgba(24,20,12,0.6)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 hover:border-[rgba(238,189,43,0.3)] transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-[rgba(238,189,43,0.1)] rounded-lg">
                                <span className="material-symbols-outlined text-[#eebd2b]">group</span>
                            </div>
                            <span className={`text-white font-bold ${language === 'ur' ? 'font-urdu' : ''}`}>{t.audio.community}</span>
                        </div>
                        <p className={`text-xs text-[rgba(255,255,255,0.5)] ${language === 'ur' ? 'font-urdu' : ''}`}>128 {t.audio.students}</p>
                    </div>
                    <div className="bg-[rgba(24,20,12,0.6)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 hover:border-[rgba(238,189,43,0.3)] transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-[rgba(238,189,43,0.1)] rounded-lg">
                                <span className="material-symbols-outlined text-[#eebd2b]">bookmark</span>
                            </div>
                            <span className={`text-white font-bold ${language === 'ur' ? 'font-urdu' : ''}`}>{t.audio.resources}</span>
                        </div>
                        <p className={`text-xs text-[rgba(255,255,255,0.5)] ${language === 'ur' ? 'font-urdu' : ''}`}>3 {t.audio.guides}</p>
                    </div>
                </div>
            </div>

            {/* Right Column: Playlist & Tools (1 col) */}
            <div className="flex flex-col gap-6 h-full">
                {/* Tabs */}
                <div className="flex p-1 bg-[rgba(255,255,255,0.05)] rounded-xl">
                    {["transcript", "notes", "quiz"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${activeTab === tab
                                    ? "bg-[#eebd2b] text-[#18140c] shadow-lg"
                                    : "text-[rgba(255,255,255,0.5)] hover:text-white"
                                } ${language === 'ur' ? 'font-urdu' : ''}`}
                        >
                            {t.audio.tabs[tab]}
                        </button>
                    ))}
                </div>

                {/* Tab Content Area */}
                <div className="flex-1 bg-[rgba(24,20,12,0.8)] border border-[rgba(255,255,255,0.05)] rounded-3xl p-6 overflow-hidden flex flex-col">
                    {activeTab === "transcript" && (
                        <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
                            <h3 className={`text-white font-bold mb-4 ${language === 'ur' ? 'font-urdu' : ''}`}>{t.audio.playlist}</h3>
                            <div className="space-y-2">
                                {chapters.map((chapter) => (
                                    <div
                                        key={chapter.id}
                                        className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${chapter.playing
                                                ? "bg-[rgba(238,189,43,0.1)] border border-[rgba(238,189,43,0.3)]"
                                                : "hover:bg-[rgba(255,255,255,0.05)] border border-transparent"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-bold ${chapter.playing ? "text-[#eebd2b]" : "text-[rgba(255,255,255,0.3)]"}`}>
                                                {String(chapter.id).padStart(2, '0')}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-medium ${chapter.playing ? "text-white" : "text-[rgba(255,255,255,0.7)]"} ${language === 'ur' ? 'font-urdu' : ''}`}>
                                                    {chapter.title}
                                                </span>
                                                <span className="text-[10px] text-[rgba(255,255,255,0.4)]">
                                                    {chapter.duration}
                                                </span>
                                            </div>
                                        </div>
                                        {chapter.playing && (
                                            <span className="material-symbols-outlined text-[#eebd2b] text-sm">
                                                equalizer
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.1)]">
                                <h3 className={`text-white font-bold mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>{t.audio.preview}</h3>
                                <p className={`text-sm text-[rgba(255,255,255,0.6)] leading-relaxed ${language === 'ur' ? 'font-urdu' : ''}`}>
                                    "The Great Mosque of Cordoba is a prime example of the innovative use of double arches, which allowed for higher ceilings and greater structural stability..."
                                </p>
                                <button className={`mt-2 text-[#eebd2b] text-xs font-bold hover:underline ${language === 'ur' ? 'font-urdu' : ''}`}>{t.audio.readFull}</button>
                            </div>
                        </div>
                    )}

                    {activeTab === "notes" && (
                        <div className="flex flex-col h-full text-center items-center justify-center text-[rgba(255,255,255,0.5)]">
                            <span className="material-symbols-outlined text-4xl mb-2">edit_note</span>
                            <p className={`${language === 'ur' ? 'font-urdu' : ''}`}>Your notes will appear here.</p>
                        </div>
                    )}

                    {activeTab === "quiz" && (
                        <div className="flex flex-col h-full text-center items-center justify-center text-[rgba(255,255,255,0.5)]">
                            <span className="material-symbols-outlined text-4xl mb-2">psychology</span>
                            <p className={`${language === 'ur' ? 'font-urdu' : ''}`}>Quiz unlocks after audio completes.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
