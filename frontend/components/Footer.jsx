"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
    const { t, language } = useLanguage();

    return (
        <footer className="bg-[#1a1614] border-t border-[rgba(242,185,13,0.1)] py-20 px-6 lg:px-20"
            style={{ fontFamily: language === 'en' ? "Lexend, sans-serif" : undefined }}>
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
                {/* Brand */}
                <div className="md:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-[#f2b90d] text-3xl">
                            architecture
                        </span>
                        <h4 className="text-white font-bold tracking-widest">AYESHA</h4>
                    </div>
                    <p className={`text-[rgba(232,228,219,0.4)] text-sm leading-relaxed ${language === 'ur' ? 'font-urdu' : ''}`}>
                        {t.footer.brandQuote}
                    </p>
                </div>

                {/* Platform */}
                <div>
                    <h5 className={`text-white font-bold mb-6 text-sm uppercase tracking-widest ${language === 'ur' ? 'font-urdu' : ''}`}>
                        {t.footer.platform}
                    </h5>
                    <ul className={`flex flex-col gap-4 text-[rgba(232,228,219,0.6)] text-sm ${language === 'ur' ? 'font-urdu' : ''}`}>
                        {[t.navbar.upload, t.navbar.aiTutor, t.navbar.voice].map(
                            (item, idx) => (
                                item ? (
                                    <li key={idx}>
                                        <Link href="#" className="hover:text-[#f2b90d] transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ) : null
                            )
                        )}
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h5 className={`text-white font-bold mb-6 text-sm uppercase tracking-widest ${language === 'ur' ? 'font-urdu' : ''}`}>
                        {t.footer.company}
                    </h5>
                    <ul className={`flex flex-col gap-4 text-[rgba(232,228,219,0.6)] text-sm ${language === 'ur' ? 'font-urdu' : ''}`}>
                        {[t.settings.title, t.navbar.method].map((item) => (
                            <li key={item}>
                                <Link href="#" className="hover:text-[#f2b90d] transition-colors">
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h5 className={`text-white font-bold mb-6 text-sm uppercase tracking-widest ${language === 'ur' ? 'font-urdu' : ''}`}>
                        {t.footer.newsletterTitle}
                    </h5>
                    <div className="flex flex-col gap-4">
                        <p className={`text-[rgba(232,228,219,0.4)] text-sm ${language === 'ur' ? 'font-urdu' : ''}`}>
                            {t.footer.newsletterDesc}
                        </p>
                        <input
                            type="email"
                            placeholder={t.footer.placeholder}
                            className={`bg-[#2a2420] border border-[rgba(242,185,13,0.2)] rounded-lg text-sm text-white px-4 py-3 focus:outline-none focus:border-[#f2b90d] placeholder-[rgba(232,228,219,0.4)] w-full ${language === 'ur' ? 'font-urdu text-right' : ''}`}
                        />
                        <button className={`bg-[#f2b90d] text-[#1a1614] font-bold py-3 rounded-lg text-sm hover:brightness-110 transition-all ${language === 'ur' ? 'font-urdu' : ''}`}>
                            {t.footer.subscribe}
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-[rgba(242,185,13,0.05)] flex flex-col md:flex-row justify-between items-center gap-6">
                <p className={`text-[rgba(232,228,219,0.2)] text-xs ${language === 'ur' ? 'font-urdu' : ''}`}>
                    {t.footer.copyright}
                </p>
                <div className={`flex gap-8 text-[rgba(232,228,219,0.2)] text-xs ${language === 'ur' ? 'font-urdu' : ''}`}>
                    <Link href="#" className="hover:text-[#f2b90d] transition-colors">
                        MIT License
                    </Link>
                </div>
            </div>
        </footer>
    );
}
