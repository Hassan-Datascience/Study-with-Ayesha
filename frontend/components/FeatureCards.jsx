"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function FeatureCards() {
    const { t, language } = useLanguage();

    const features = [
        {
            icon: "chat_bubble",
            title: t.features.chatTitle,
            description: t.features.chatDesc,
            href: "/chat",
        },
        {
            icon: "image",
            title: t.features.imageTitle,
            description: t.features.imageDesc,
            href: "/upload",
        },
        {
            icon: "translate",
            title: t.features.bilingualTitle,
            description: t.features.bilingualDesc,
            href: "/settings",
        },
    ];

    return (
        <section className="px-6 lg:px-20 py-32 max-w-7xl mx-auto" id="method">
            {/* Header */}
            <div className="text-center mb-20">
                <h2 className={`serif-title text-4xl md:text-5xl text-white mb-6 ${language === 'ur' ? 'font-urdu' : ''}`}>
                    {t.hero.title} {t.navbar.method}
                </h2>
                <p className={`text-[rgba(232,228,219,0.5)] max-w-xl mx-auto ${language === 'ur' ? 'font-urdu' : ''}`}>
                    {t.hero.description}
                </p>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className="bg-[#e8e4db] p-10 rounded-lg flex flex-col gap-6 group hover:-translate-y-2 transition-all duration-300"
                    >
                        {/* Icon */}
                        <div className="size-14 bg-[#1a1614] rounded-lg flex items-center justify-center text-[#f2b90d]">
                            <span className="material-symbols-outlined text-3xl">
                                {feature.icon}
                            </span>
                        </div>

                        {/* Text */}
                        <div>
                            <h3 className={`text-[#1a1614] text-xl font-bold mb-3 ${language === 'ur' ? 'font-urdu' : ''}`}>
                                {feature.title}
                            </h3>
                            <p className={`text-[rgba(26,22,20,0.7)] text-sm leading-relaxed ${language === 'ur' ? 'font-urdu' : ''}`}>
                                {feature.description}
                            </p>
                        </div>

                        {/* Link */}
                        <div className="mt-auto pt-6 border-t border-[rgba(26,22,20,0.1)]">
                            <Link
                                href={feature.href}
                                className={`text-[#1a1614] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:text-[#f2b90d] transition-colors ${language === 'ur' ? 'font-urdu' : ''}`}
                            >
                                {t.features.learnMore}{" "}
                                <span className={`material-symbols-outlined text-sm ${language === 'ur' ? 'rotate-180' : ''}`}>
                                    north_east
                                </span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
