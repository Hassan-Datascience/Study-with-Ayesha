"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
    const { t, language } = useLanguage();

    return (
        <section className="relative px-6 lg:px-20 pt-20 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(242,185,13,0.2)] bg-[rgba(242,185,13,0.05)] text-[#f2b90d] text-xs font-bold uppercase tracking-widest mb-8">
                <span className="material-symbols-outlined text-sm">verified</span>
                {t.hero.badge}
            </div>

            {/* Headline */}
            <h1 className={`serif-title text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-8 max-w-5xl ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t.hero.title}{" "}
                <span className="italic text-[#f2b90d] gold-glow">{t.hero.titleName}</span>
                {t.hero.subtitle}
            </h1>

            {/* Subtext */}
            <p className={`text-lg md:text-xl text-[rgba(232,228,219,0.6)] max-w-2xl leading-relaxed mb-12 font-light ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t.hero.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/chat"
                    className={`bg-[#2a2420] text-[#e8e4db] border border-[rgba(242,185,13,0.3)] px-10 py-5 rounded-lg text-lg font-semibold hover:bg-[rgba(42,36,32,0.8)] transition-all flex items-center justify-center gap-3 ${language === 'ur' ? 'font-urdu' : ''}`}
                >
                    {t.hero.ctaPrimary}
                    <span className={`material-symbols-outlined ${language === 'ur' ? 'rotate-180' : ''}`}>arrow_forward</span>
                </Link>
                <button className={`bg-transparent text-white px-10 py-5 rounded-lg text-lg font-semibold hover:bg-[rgba(255,255,255,0.05)] transition-all border border-transparent ${language === 'ur' ? 'font-urdu' : ''}`}>
                    {t.hero.ctaSecondary}
                </button>
            </div>

            {/* Hero image */}
            <div className="mt-24 relative w-full aspect-video rounded-xl overflow-hidden border border-[rgba(242,185,13,0.2)] shadow-2xl shadow-black/50 group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1614] via-transparent to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2828&auto=format&fit=crop"
                    alt="Luxury library with books and warm lighting"
                    className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-1000"
                />
                {/* AI badge overlay */}
                <div className={`absolute bottom-10 z-20 text-left ${language === 'ur' ? 'right-10 text-right' : 'left-10 text-left'}`}>
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full border-2 border-[#f2b90d] overflow-hidden">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXPh-hPBF-gGeTKsxmouA3VQ4H6DXldTg_fMlXA7YztgZ-cJWrekMyYL-PhrYQIzpOaqRgv6rUnz17X2gEbPO2WexKAgsB8wg8MoKkPeMeTXyqQxhnx4luo1nH9v1nXqaVpT0PDThkEG_dLRbpJ55UahQ0Wkp1EamNKH7X2Tv5Xj_mZ7kEcZAf1flw62Y-fJ9jxFJD3aUDIHPj66MWHOlv_He1cOp8xfo9GYaJP5YteotnglJVhjeBFhzjiwIui1sQdQ_KQgJ9Ju0"
                                alt="AI Assistant Portrait"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-[#f2b90d] font-bold">Ayesha AI</p>
                            <p className={`text-[rgba(232,228,219,0.7)] text-sm ${language === 'ur' ? 'font-urdu' : ''}`}>
                                {t.chat.active}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
