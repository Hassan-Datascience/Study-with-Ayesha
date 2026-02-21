"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function SettingsUI() {
    const { language, toggleLanguage, t } = useLanguage();

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2 text-center mb-12">
                <h1 className="text-3xl font-bold text-white">{t.settings.title}</h1>
                <p className="text-[rgba(255,255,255,0.6)] text-sm">
                    {t.settings.subtitle}
                </p>
            </div>

            {/* Language Selection Card */}
            <section className="bg-[#18140c] border border-[rgba(238,189,43,0.2)] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(238,189,43,0.05)] blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-[rgba(238,189,43,0.1)] rounded-xl text-[#eebd2b]">
                            <span className="material-symbols-outlined text-2xl">language</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{t.settings.language}</h3>
                            <p className="text-[rgba(255,255,255,0.5)] text-sm">{t.settings.languageDesc}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => toggleLanguage("en")}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${language === "en"
                                    ? "border-[#eebd2b] bg-[rgba(238,189,43,0.1)]"
                                    : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)]"
                                }`}
                        >
                            <span className="text-2xl mb-2">🇺🇸</span>
                            <span className={`font-bold ${language === "en" ? "text-[#eebd2b]" : "text-white"}`}>English</span>
                        </button>

                        <button
                            onClick={() => toggleLanguage("ur")}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${language === "ur"
                                    ? "border-[#eebd2b] bg-[rgba(238,189,43,0.1)]"
                                    : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)]"
                                }`}
                        >
                            <span className="text-2xl mb-2">🇵🇰</span>
                            <span className={`font-bold font-urdu ${language === "ur" ? "text-[#eebd2b]" : "text-white"}`}>اردو</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
