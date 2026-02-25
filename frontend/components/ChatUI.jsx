"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ChatUI() {
    const { t, language } = useLanguage();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [playingMessageId, setPlayingMessageId] = useState(null);
    const [activeChatLanguage, setActiveChatLanguage] = useState("en");
    const [availableVoices, setAvailableVoices] = useState([]);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const updateVoices = () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                setAvailableVoices(window.speechSynthesis.getVoices());
            }
        };

        updateVoices();

        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = updateVoices;
        }

        // Cleanup speech on unmount
        return () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const toggleVoice = (messageId, textToSpeak, msgLang = "en") => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            alert(language === 'ur' ? 'آپ کا براؤزر آواز کی حمایت نہیں کرتا۔' : 'Your browser does not support speech synthesis.');
            return;
        }

        if (playingMessageId === messageId) {
            window.speechSynthesis.cancel();
            setPlayingMessageId(null);
            return;
        }

        window.speechSynthesis.cancel(); // Stop anything currently playing

        if (!textToSpeak) return;

        const trySpeak = (voicesArray) => {
            if (!voicesArray || voicesArray.length === 0) return;

            let targetVoice = null;
            let targetLang = 'en-US';

            if (msgLang === 'ur') {
                targetVoice = voicesArray.find(v => v.lang.startsWith('hi') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira')))
                    || voicesArray.find(v => v.lang.startsWith('hi') && !v.name.toLowerCase().includes('male'))
                    || voicesArray.find(v => v.lang.startsWith('hi'))
                    || voicesArray.find(v => v.lang.startsWith('ur') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira')))
                    || voicesArray.find(v => v.lang.startsWith('ur'))
                    || voicesArray.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira')));
                targetLang = 'hi-IN';
            } else {
                targetVoice = voicesArray.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha')))
                    || voicesArray.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('male'))
                    || voicesArray.find(v => v.lang.startsWith('en'));
                targetLang = 'en-US';
            }

            if (targetVoice) {
                console.log("Selected Voice:", targetVoice.name, targetVoice.lang);
            }

            // Chunking logic for long text to bypass Chrome 15s bug
            const sentences = textToSpeak.match(/[^۔.!\n]+[۔.!\n]*/g) || [textToSpeak];

            setPlayingMessageId(messageId);
            let currentSentenceIndex = 0;

            const speakNextSentence = () => {
                if (currentSentenceIndex >= sentences.length) {
                    setPlayingMessageId(null);
                    return;
                }

                const chunk = sentences[currentSentenceIndex].trim();
                if (!chunk) {
                    currentSentenceIndex++;
                    speakNextSentence();
                    return;
                }

                const utterance = new SpeechSynthesisUtterance(chunk);
                utterance.rate = 0.85;
                utterance.pitch = 1.15;
                utterance.volume = 1.0;
                utterance.lang = targetLang;
                if (targetVoice) utterance.voice = targetVoice;

                utterance.onend = () => {
                    currentSentenceIndex++;
                    speakNextSentence();
                };

                utterance.onerror = (e) => {
                    if (e.error === 'interrupted') return; // ignore interrupted, it's fine
                    console.error('Speech error:', e.error);
                    setPlayingMessageId(null);
                };

                window.speechSynthesis.speak(utterance);
            };

            window.speechSynthesis.cancel();
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    speakNextSentence();
                });
            });
        };

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            setAvailableVoices(voices);
            trySpeak(voices);
        } else {
            window.speechSynthesis.onvoiceschanged = () => {
                const newVoices = window.speechSynthesis.getVoices();
                setAvailableVoices(newVoices);
                trySpeak(newVoices);
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
    };

    const handleMicClick = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert(language === 'ur' ? 'آپ کا براؤزر تقریر کی شناخت کی حمایت نہیں کرتا۔' : 'Your browser does not support speech recognition.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = language === 'ur' ? 'ur-PK' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        if (isListening) {
            recognition.stop();
            setIsListening(false);
            return;
        }

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput((prev) => prev ? prev + " " + transcript : transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");

        setMessages((prev) => [
            ...prev,
            { id: Date.now(), role: "student", content: userMsg },
        ]);

        setIsLoading(true);

        let nextLang = activeChatLanguage;
        const lowerMsg = userMsg.toLowerCase();
        if (lowerMsg.includes("english please") || lowerMsg.includes("reply in english")) {
            nextLang = "en";
        } else if (
            lowerMsg.includes("urdu mein jawab do") ||
            lowerMsg.includes("explain in urdu") ||
            lowerMsg.includes("urdu please") ||
            /[\u0600-\u06FF]/.test(userMsg)
        ) {
            nextLang = "ur";
        }

        if (nextLang !== activeChatLanguage) {
            setActiveChatLanguage(nextLang);
        }

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
            const response = await fetch(`${baseUrl}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: userMsg,
                    language: nextLang
                })
            });

            if (!response.ok) {
                throw new Error("Failed to get response from AI tutor.");
            }

            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                { id: Date.now(), role: "ai", content: data.reply, lang: nextLang }
            ]);
        } catch (error) {
            console.error("Chat API Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    role: "ai",
                    content: language === 'ur'
                        ? "معذرت، کنکشن میں کوئی مسئلہ ہے۔ براہ کرم یقینی بنائیں کہ بیک اینڈ چل رہا ہے اور دوبارہ کوشش کریں۔"
                        : "Sorry, there is a connection issue. Please ensure the backend server is running and try again."
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 w-full max-w-5xl mx-auto"
            style={{ fontFamily: language === 'en' ? "Lexend, sans-serif" : undefined }}>
            {/* Progress bar */}
            <div className="w-full max-w-3xl mb-6 bg-[rgba(42,29,21,0.4)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 flex items-center gap-6">
                <div className="flex-1">
                    <div className="flex justify-between items-end mb-2">
                        <span className={`text-[rgba(255,255,255,0.6)] text-xs font-medium uppercase tracking-widest ${language === 'ur' ? 'font-urdu' : ''}`}>
                            Architectural Principles: Module IV
                        </span>
                        <span className="text-[#f4c025] text-xs font-bold">
                            65% Completed
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#f4c025] rounded-full"
                            style={{ width: "65%" }}
                        />
                    </div>
                </div>
                <div className={`flex flex-col border-[rgba(255,255,255,0.1)] ${language === 'ur' ? 'items-start border-r pr-6' : 'items-end border-l pl-6'}`}>
                    <span className={`text-[rgba(255,255,255,0.4)] text-[10px] uppercase font-bold ${language === 'ur' ? 'font-urdu' : ''}`}>
                        Session Time
                    </span>
                    <span className="text-white font-mono text-sm">24:12</span>
                </div>
            </div>

            {/* Chat Card */}
            <div className="w-full max-w-3xl bg-[#fdfaf3] rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[75vh] border border-[rgba(255,255,255,0.2)]">
                {/* Chat header */}
                <div className="px-6 py-4 border-b border-[#e6e3db] flex items-center justify-between bg-[rgba(255,255,255,0.5)]">
                    <div className="flex items-center gap-2">
                        <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                        <span className={`text-[#8a8060] text-xs font-bold uppercase tracking-tighter ${language === 'ur' ? 'font-urdu' : ''}`}>
                            {t.chat.active}
                        </span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {messages.map((msg) =>
                        msg.role === "ai" ? (
                            <div key={msg.id} className="flex gap-4 max-w-[85%]">
                                <div className="w-10 h-10 rounded-full bg-[#f4c025] flex items-center justify-center shrink-0 shadow-lg shadow-[rgba(244,192,37,0.2)]">
                                    <span className="material-symbols-outlined text-[#2a1d15] text-xl">
                                        auto_awesome
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <p className={`text-[11px] font-bold text-[#8a8060] uppercase tracking-widest ${language === 'ur' ? 'font-urdu mr-1' : 'ml-1'}`}>
                                        {t.navbar.aiTutor}
                                    </p>
                                    <div className={`flex items-end gap-2 ${language === 'ur' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`bg-white border border-[#f0ede4] p-4 rounded-xl shadow-sm text-[#3d2b1f] leading-relaxed text-sm transition-all duration-300 ${language === 'ur' ? 'rounded-tr-none font-urdu text-right' : 'rounded-tl-none text-left'} ${playingMessageId === msg.id ? 'ring-2 ring-[#f4c025] bg-[#fffaf0]' : ''}`}>
                                            {msg.content}
                                        </div>
                                        <button
                                            onClick={() => toggleVoice(msg.id, msg.content, msg.lang || 'en')}
                                            className={`relative z-10 pointer-events-auto cursor-pointer shrink-0 p-2 rounded-full transition-colors flex items-center justify-center ${playingMessageId === msg.id ? 'bg-[#f4c025] text-[#2a1d15] animate-pulse shadow-md' : 'bg-transparent text-[#b0a88e] hover:bg-white hover:text-[#8a8060] hover:shadow-sm border border-transparent hover:border-[#e6e3db]'}`}
                                            title={language === 'ur' ? 'سنیں' : 'Listen'}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                {playingMessageId === msg.id ? 'graphic_eq' : 'volume_up'}
                                            </span>
                                        </button>
                                    </div>
                                    {msg.image && (
                                        <div className="rounded-xl overflow-hidden border border-[#f0ede4] shadow-sm mt-3">
                                            <img
                                                src={msg.image}
                                                alt="Interior Architecture"
                                                className="w-full aspect-video object-cover"
                                            />
                                            <div className="bg-[rgba(255,255,255,0.9)] px-3 py-2 text-[10px] text-[#8a8060] italic border-t border-[#f0ede4]">
                                                {msg.imageCaption}
                                            </div>
                                        </div>
                                    )}
                                    {msg.chips && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {msg.chips.map((chip) => (
                                                <button
                                                    key={chip}
                                                    className="text-[10px] font-bold py-1.5 px-3 bg-[rgba(244,192,37,0.1)] text-[#f4c025] border border-[rgba(244,192,37,0.2)] rounded-full hover:bg-[rgba(244,192,37,0.2)] transition-all uppercase tracking-wide"
                                                >
                                                    {chip}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div key={msg.id} className={`flex gap-4 max-w-[85%] ${language === 'ur' ? 'mr-auto flex-row' : 'ml-auto flex-row-reverse'}`}>
                                <div className="w-10 h-10 rounded-full bg-[#efe9d9] border border-[#dcd7c9] flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[#8a8060]">
                                        person
                                    </span>
                                </div>
                                <div className={`space-y-2 ${language === 'ur' ? 'text-left' : 'text-right'}`}>
                                    <div className={`bg-[#efe9d9] border border-[#dcd7c9] p-4 rounded-xl shadow-sm text-[#3d2b1f] leading-relaxed text-sm ${language === 'ur' ? 'rounded-tl-none font-urdu text-right' : 'rounded-tr-none text-left'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Input area */}
                <div className="p-6 border-t border-[#e6e3db] bg-white">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-[rgba(244,192,37,0.2)] rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300" />
                        <div className="relative bg-white border-2 border-[#f0ede4] group-focus-within:border-[#f4c025] rounded-xl flex items-end p-2 transition-all">
                            <textarea
                                className={`flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-3 placeholder-[#b0a88e] text-[#3d2b1f] resize-none min-h-[40px] max-h-[120px] outline-none disabled:opacity-50 ${language === 'ur' ? 'font-urdu text-right' : ''}`}
                                placeholder={t.chat.placeholder}
                                rows={1}
                                value={input}
                                disabled={isLoading}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                            />
                            <div className={`flex items-center gap-2 mb-1 ${language === 'ur' ? 'ml-1' : 'mr-1'}`}>
                                <button
                                    onClick={handleMicClick}
                                    className={`p-2 transition-colors disabled:opacity-50 rounded-full ${isListening ? 'text-red-500 bg-red-100 animate-pulse' : 'text-[#8a8060] hover:text-[#f4c025]'}`}
                                    disabled={isLoading}
                                    title={language === 'ur' ? (isListening ? 'سننا بند کریں' : 'بولنا شروع کریں') : (isListening ? 'Stop Listening' : 'Start Speaking')}
                                >
                                    <span className="material-symbols-outlined">mic</span>
                                </button>
                                <button
                                    onClick={sendMessage}
                                    disabled={isLoading}
                                    className={`bg-[#f4c025] text-[#2a1d15] size-10 rounded-lg flex items-center justify-center shadow-md transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                                >
                                    {isLoading ? (
                                        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                    ) : (
                                        <span className={`material-symbols-outlined ${language === 'ur' ? 'rotate-180' : ''}`}>send</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 px-1">
                        <span className={`text-[10px] text-[#8a8060] font-medium flex items-center gap-1 ${language === 'ur' ? 'font-urdu' : ''}`}>
                            <span className="material-symbols-outlined text-xs">info</span>
                            {t.chat.info}
                        </span>
                        <span className={`text-[10px] text-[#8a8060] font-medium uppercase tracking-widest ${language === 'ur' ? 'font-urdu' : ''}`}>
                            {t.chat.assistant}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer note */}
            <footer className="mt-8 text-center">
                <p className={`text-[rgba(255,255,255,0.3)] text-[10px] uppercase tracking-[0.2em] font-medium ${language === 'ur' ? 'font-urdu' : ''}`}>
                    Part of the Premium Architectural Collective © 2024 Study with Ayesha
                </p>
            </footer>
        </main>
    );
}

