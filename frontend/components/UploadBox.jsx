"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function UploadBox() {
    const { t, language } = useLanguage();
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [originalResult, setOriginalResult] = useState(null);
    const [translatedUrdu, setTranslatedUrdu] = useState(null);
    const [activeDisplayLang, setActiveDisplayLang] = useState('en');
    const [isTranslating, setIsTranslating] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [availableVoices, setAvailableVoices] = useState([]);

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

    const toggleVoice = (text, lang) => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            alert(language === 'ur' ? 'آپ کا براؤزر آواز کی حمایت نہیں کرتا۔' : 'Your browser does not support speech synthesis.');
            return;
        }

        if (isPlaying === lang) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        window.speechSynthesis.cancel(); // Stop anything currently playing

        if (!text) return;

        const trySpeak = (voicesArray) => {
            if (!voicesArray || voicesArray.length === 0) return;

            let targetVoice = null;
            let targetLang = 'en-US';

            if (lang === 'ur') {
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
            const sentences = text.match(/[^۔.!\n]+[۔.!\n]*/g) || [text];

            setIsPlaying(lang);
            let currentSentenceIndex = 0;

            const speakNextSentence = () => {
                if (currentSentenceIndex >= sentences.length) {
                    setIsPlaying(false);
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
                    setIsPlaying(false);
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
                window.speechSynthesis.onvoiceschanged = null; // Clean up listener once loaded
            };
        }
    };

    const translateToUrdu = async () => {
        if (translatedUrdu) {
            setActiveDisplayLang('ur');
            setAnalysisResult(translatedUrdu);
            return translatedUrdu;
        }
        setIsTranslating(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
            const response = await fetch(`${baseUrl}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: "Please accurately translate the following architectural explanation into Urdu:\n\n" + originalResult,
                    language: "ur"
                })
            });
            const data = await response.json();
            setTranslatedUrdu(data.reply);
            setAnalysisResult(data.reply);
            setActiveDisplayLang('ur');
            return data.reply;
        } catch (error) {
            console.error("Translation Error:", error);
            setErrorMsg("Failed to translate.");
        } finally {
            setIsTranslating(false);
        }
    };

    const translateToEnglish = () => {
        setAnalysisResult(originalResult);
        setActiveDisplayLang('en');
    };

    const handleListen = () => {
        toggleVoice(originalResult, 'en');
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
            setSelectedFile(file);
            setAnalysisResult(null);
            setErrorMsg(null);
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleGenerateClick = async () => {
        if (!selectedFile || isLoading) return;

        setIsLoading(true);
        setErrorMsg(null);
        setAnalysisResult(null);

        try {
            const base64Image = await fileToBase64(selectedFile);

            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
            const response = await fetch(`${baseUrl}/api/explain-image`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image_base64: base64Image,
                    language: 'en'
                })
            });

            if (!response.ok) {
                throw new Error("Failed to get response from AI tutor.");
            }

            const data = await response.json();
            setOriginalResult(data.explanation);
            setAnalysisResult(data.explanation);
            setActiveDisplayLang('en');
        } catch (error) {
            console.error("Image API Error:", error);
            setErrorMsg(language === 'ur'
                ? "معذرت، تصویر کے تجزیہ میں کوئی مسئلہ ہے۔"
                : "Sorry, there was an error analyzing the image.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="w-full max-w-[1000px] px-4 pb-20 mt-4"
            style={{ fontFamily: language === 'en' ? "Manrope, sans-serif" : undefined }}>
            <div className="glass-card rounded-2xl shadow-2xl overflow-hidden border border-[rgba(255,255,255,0.2)]">
                {/* Header */}
                <div className={`px-10 py-8 border-b border-[rgba(245,243,239,0.5)] ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                    <h2 className={`text-3xl font-black text-[#3d3428] tracking-tight ${language === 'ur' ? 'font-urdu' : ''}`}>
                        {t.upload.title}
                    </h2>
                    <p className={`text-[rgba(61,52,40,0.6)] text-lg mt-1 ${language === 'ur' ? 'font-urdu' : ''}`}>
                        {t.upload.subtitle}
                    </p>
                </div>

                <div className="p-10 flex flex-col gap-8">
                    {/* Upload zone */}
                    <div className="relative group">
                        <div
                            onClick={(e) => {
                                // Prevent clicking twice if they click the button itself
                                if (e.target.tagName !== 'BUTTON') {
                                    document.getElementById('imageInput').click();
                                }
                            }}
                            className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-[rgba(230,179,25,0.2)] bg-[rgba(245,243,239,0.3)] px-6 py-12 transition-all group-hover:bg-[rgba(230,179,25,0.05)] group-hover:border-[rgba(230,179,25,0.4)] cursor-pointer"
                            style={{ pointerEvents: 'auto' }}
                        >
                            <div className="size-16 rounded-full bg-[rgba(230,179,25,0.1)] flex items-center justify-center text-[#e6b319] mb-2 pointer-events-none">
                                <span className="material-symbols-outlined text-4xl">
                                    cloud_upload
                                </span>
                            </div>
                            <div className="text-center pointer-events-none">
                                <p className={`text-[#3d3428] text-xl font-bold ${language === 'ur' ? 'font-urdu' : ''}`}>
                                    {t.upload.title}
                                </p>
                                <p className={`text-[rgba(61,52,40,0.5)] text-sm mt-1 ${language === 'ur' ? 'font-urdu' : ''}`}>
                                    {t.upload.dropzone}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => document.getElementById('imageInput').click()}
                                style={{ pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
                                className={`mt-4 px-8 py-2.5 bg-[#3d3428] text-white rounded-lg font-bold text-sm tracking-wide hover:bg-[rgba(61,52,40,0.9)] transition-all shadow-lg ${language === 'ur' ? 'font-urdu' : ''}`}
                            >
                                {t.upload.select}
                            </button>
                        </div>
                        <input
                            id="imageInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            style={{ pointerEvents: 'auto', opacity: 0, position: 'absolute', zIndex: -1, width: 0, height: 0 }}
                        />
                    </div>

                    {/* Analysis preview */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-[rgba(61,52,40,0.8)] uppercase tracking-widest text-xs">
                                Analysis Preview
                            </h3>
                            <button
                                onClick={() => setImagePreview(null)}
                                className="text-xs font-bold text-red-600 flex items-center gap-1 hover:underline"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    delete
                                </span>{" "}
                                Remove
                            </button>
                        </div>
                        {imagePreview ? (
                            <div className="w-full aspect-[16/9] rounded-xl overflow-hidden shadow-inner bg-gray-100 border border-[#f5f3ef]">
                                <img
                                    src={imagePreview}
                                    alt="Modern luxury architectural villa"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-full aspect-[16/9] rounded-xl bg-[#f5f3ef] border border-[#f5f3ef] flex items-center justify-center text-[rgba(61,52,40,0.3)]">
                                <span className="material-symbols-outlined text-5xl">image</span>
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={handleGenerateClick}
                            disabled={!selectedFile || isLoading}
                            className={`flex items-center gap-3 px-10 py-5 bg-[#e6b319] text-[#211d11] rounded-xl font-extrabold text-lg shadow-[0_10px_30px_-10px_rgba(230,179,25,0.5)] hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${language === 'ur' ? 'font-urdu' : ''}`}>
                            {isLoading ? (
                                <span className="material-symbols-outlined animate-spin font-bold">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined font-bold">auto_awesome</span>
                            )}
                            {isLoading ? (language === 'ur' ? 'تجزیہ ہو رہا...' : 'Analyzing...') : t.upload.generate}
                        </button>
                    </div>
                </div>

                {/* Analysis result */}
                <div className="bg-[rgba(245,243,239,0.5)] p-10 border-t border-[#f5f3ef]">
                    <div className="flex flex-col gap-6">
                        {/* Section header */}
                        <div className="flex items-center justify-between">
                            <h3 className={`text-xl font-bold text-[#3d3428] flex items-center gap-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
                                <span className="material-symbols-outlined text-[#e6b319]">
                                    description
                                </span>
                                {t.upload.resultTitle}
                            </h3>
                            {/* Listen Control */}
                            {analysisResult && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={handleListen}
                                        className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 ${isPlaying === 'en' ? 'bg-[rgba(244,192,37,0.1)] border-[#f4c025] text-[#d4a00b]' : 'bg-white text-[#8a8060] border-[#f0ede4] hover:border-[#f4c025]'}`}
                                    >
                                        <span className={`material-symbols-outlined text-[16px] ${isPlaying === 'en' ? 'animate-pulse' : ''}`}>{isPlaying === 'en' ? 'graphic_eq' : 'volume_up'}</span>
                                        Listen
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Text analysis */}
                        <div className="bg-[rgba(255,255,255,0.8)] p-8 rounded-xl border border-[#f5f3ef] shadow-sm">
                            <div className="space-y-6 text-[rgba(61,52,40,0.8)] leading-relaxed">
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-6">
                                        <span className="material-symbols-outlined animate-spin text-3xl text-[#e6b319]">progress_activity</span>
                                    </div>
                                ) : errorMsg ? (
                                    <p className="text-red-500 font-bold text-center">{errorMsg}</p>
                                ) : analysisResult ? (
                                    <div>
                                        <p className={`whitespace-pre-wrap ${language === 'ur' ? 'font-urdu text-right text-lg' : ''}`}>{analysisResult}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h4 className={`font-black text-sm uppercase tracking-widest text-[#e6b319] mb-2 ${language === 'ur' ? 'text-right font-urdu' : ''}`}>
                                            {language === 'ur' ? 'تجزیہ کا نتیجہ' : 'Design Philosophy'}
                                        </h4>
                                        <p className={language === 'ur' ? 'font-urdu text-right text-lg' : ''}>
                                            {language === 'ur'
                                                ? 'تفصیلی تجزیہ دیکھنے کے لیے براہ کرم کوئی تصویر اپ لوڈ کریں اور اے آئی وضاحت تیار کریں پر کلک کریں۔'
                                                : 'Please upload an image and click Generate AI Explanation to see the detailed analysis.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
