"use client";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { t, language } = useLanguage();

    const navItems = [
        { label: t.navbar.upload, href: "/upload" },
        { label: t.navbar.aiTutor, href: "/chat" },
        { label: t.navbar.method, href: "/#method" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[rgba(242,185,13,0.1)] bg-[rgba(26,22,20,0.85)] backdrop-blur-md px-6 lg:px-20 py-4 flex items-center justify-between">
            {/* Logo Area with Settings */}
            <div className="flex items-center gap-6">
                <Link
                    href="/settings"
                    className="md:hidden text-[#e8e4db] hover:text-[#f2b90d] transition-colors"
                >
                    <span className="material-symbols-outlined">settings</span>
                </Link>
                <Link href="/settings" className="hidden md:flex items-center justify-center size-10 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(238,189,43,0.1)] hover:text-[#f2b90d] transition-all group">
                    <span className="material-symbols-outlined text-[#e8e4db] group-hover:text-[#f2b90d] text-xl transition-colors">
                        settings
                    </span>
                </Link>
                <Link href="/" className="flex items-center gap-3">
                    <div className="bg-[#f2b90d] p-1.5 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#1a1614] text-2xl font-bold">
                            architecture
                        </span>
                    </div>
                    <h1 className={`text-xl font-bold tracking-tight text-white uppercase tracking-widest text-sm lg:text-base ${language === 'ur' ? 'font-urdu' : ''}`}
                        style={{ fontFamily: language === 'en' ? "Lexend, sans-serif" : undefined }}>
                        {t.navbar.title}
                    </h1>
                </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
                {navItems.map(({ label, href }) => (
                    <Link
                        key={label}
                        href={href}
                        className={`text-sm font-medium text-[#e8e4db] hover:text-[#f2b90d] transition-colors uppercase tracking-wider ${language === 'ur' ? 'font-urdu' : ''}`}
                        style={{ fontFamily: language === 'en' ? "Lexend, sans-serif" : undefined }}
                    >
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Actions (Login Removed) */}
            <div className="flex items-center gap-4">
                {/* Mobile menu toggle */}
                <button
                    className="md:hidden text-[#e8e4db] ml-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Open menu"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#1a1614] border-b border-[rgba(242,185,13,0.1)] flex flex-col px-6 py-4 gap-4 md:hidden">
                    {navItems.map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className={`text-sm font-medium text-[#e8e4db] hover:text-[#f2b90d] transition-colors uppercase tracking-wider ${language === 'ur' ? 'font-urdu' : ''}`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
