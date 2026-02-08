import React, { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { LANGUAGES, t } from "../utils/i18n";

const EditorLayout = ({ sidebarLeft, content, bgImage, lang = 'en', onLanguageChange }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [langMenuOpen, setLangMenuOpen] = useState(false);

    const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

    return (
        <div
            className="flex h-screen w-screen overflow-hidden bg-background text-text"
            style={bgImage ? {
                backgroundImage: `url('${bgImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            } : {}}
        >
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface/80 backdrop-blur-md border border-white/10 text-text hover:bg-surface transition-colors shadow-lg"
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Backdrop for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Left Sidebar - Glassmorphism & Responsive */}
            <aside
                className={`
                    fixed lg:relative z-40 h-full
                    w-72 lg:w-80
                    flex-shrink-0 flex flex-col
                    bg-surface/70 backdrop-blur-xl
                    border-r border-white/10
                    shadow-2xl shadow-black/20
                    transition-all duration-300 ease-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Sidebar Header with Gradient */}
                <div className="p-5 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                    <line x1="12" y1="22.08" x2="12" y2="12" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-text tracking-tight">{t('appName', lang)}</h1>
                                <p className="text-xs text-textMuted">{t('appDescription', lang)}</p>
                            </div>
                        </div>

                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setLangMenuOpen(!langMenuOpen)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
                            >
                                <span className="text-sm">{currentLang.flag}</span>
                            </button>

                            {langMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setLangMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-1 py-1 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-50 min-w-[120px]">
                                        {LANGUAGES.map((language) => (
                                            <button
                                                key={language.code}
                                                onClick={() => {
                                                    onLanguageChange?.(language.code);
                                                    setLangMenuOpen(false);
                                                }}
                                                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${lang === language.code
                                                    ? 'bg-primary/20 text-primary'
                                                    : 'text-text hover:bg-white/10'
                                                    }`}
                                            >
                                                <span>{language.flag}</span>
                                                <span>{language.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Content with Custom Scrollbar */}
                <div className="flex-1 overflow-y-auto overflow-x-visible custom-scrollbar py-4">
                    {sidebarLeft}
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-white/10 bg-surface/50">
                    <div className="flex items-center gap-2 text-xs text-textMuted">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span>{t('ready', lang)}</span>
                        <span className="ml-auto font-mono text-[10px] opacity-50">v1.0</span>
                    </div>
                </div>
            </aside>

            {/* Center - Inventory Grid */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {content}
            </main>
        </div>
    );
};

export default EditorLayout;
