import React, { useState, useCallback, useRef, useEffect } from "react";
import { AlertCircle, Check, Copy, Download } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { parseYaml } from "../../utils/yamlHelper";

/**
 * InlineYamlEditor - Direct YAML editing with live sync
 * 
 * YAML is the single source of truth.
 * Changes in this editor immediately update the main yamlSource state.
 */
const InlineYamlEditor = ({ yamlSource, onYamlChange, scrollToLine }) => {
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

    // Validate YAML and update parent
    const handleYamlChange = useCallback((e) => {
        const newYaml = e.target.value;

        // Validate YAML
        const result = parseYaml(newYaml);
        if (result.error) {
            setError(result.error);
        } else {
            setError(null);
        }

        // Always update - even if invalid, user needs to edit
        onYamlChange(newYaml);
    }, [onYamlChange]);

    // Sync scroll between textarea and line numbers
    const handleScroll = useCallback(() => {
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    }, []);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(yamlSource);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [yamlSource]);

    const handleDownload = useCallback(() => {
        // Extract title from YAML for filename
        const titleMatch = yamlSource.match(/menu_title:\s*["']?([^"'\n]+)["']?/);
        const title = titleMatch ? titleMatch[1].replace(/&[0-9a-fk-or]/g, '').trim().toLowerCase().replace(/\s+/g, '-') : 'config';

        const blob = new Blob([yamlSource], { type: "text/yaml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `menu-${title || 'config'}.yml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [yamlSource]);

    // Calculate line numbers
    const lineCount = yamlSource.split('\n').length;
    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

    // Re-validate on yamlSource change from external sources
    useEffect(() => {
        const result = parseYaml(yamlSource);
        if (result.error) {
            setError(result.error);
        } else {
            setError(null);
        }
    }, [yamlSource]);

    // Scroll to line when requested
    useEffect(() => {
        if (scrollToLine && textareaRef.current && lineNumbersRef.current) {
            // Line height is 1.625rem = 26px
            const lineHeight = 26;
            const scrollPos = (scrollToLine - 1) * lineHeight;

            // Scroll textarea
            textareaRef.current.scrollTop = scrollPos - 100; // Offset to show context

            // Sync line numbers
            lineNumbersRef.current.scrollTop = scrollPos - 100;

            // Highlight effect (focus)
            textareaRef.current.focus();

            // Optional: Set selection range to highlight the line
            const lines = yamlSource.split('\n');
            let charCount = 0;
            for (let i = 0; i < scrollToLine - 1; i++) {
                charCount += lines[i].length + 1; // +1 for newline
            }
            const lineLength = lines[scrollToLine - 1]?.length || 0;

            textareaRef.current.setSelectionRange(charCount, charCount + lineLength);
        }
    }, [scrollToLine, yamlSource]);

    return (
        <div className="w-full min-h-[500px] h-[75vh] flex flex-col bg-surface/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-text">YAML Configuration</h3>
                    <span className="text-xs text-textMuted">{lineCount} lines</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                        Live Sync
                    </span>
                    {error && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Error
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-3 text-xs gap-1.5">
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8 px-3 text-xs gap-1.5">
                        <Download className="h-3.5 w-3.5" />
                        Download
                    </Button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{error}</span>
                </div>
            )}

            {/* Editor with Line Numbers */}
            <div className="flex-1 overflow-hidden relative flex">
                {/* Line Numbers */}
                <div
                    ref={lineNumbersRef}
                    className="w-12 flex-shrink-0 bg-[#0a0a0a] border-r border-white/5 overflow-hidden select-none"
                >
                    <div className="py-4 pr-3 text-right">
                        {lineNumbers.map(num => (
                            <div
                                key={num}
                                className="text-xs text-textMuted/40 leading-relaxed font-mono h-[1.625rem]"
                            >
                                {num}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    value={yamlSource}
                    onChange={handleYamlChange}
                    onScroll={handleScroll}
                    className="flex-1 p-4 pl-3 font-mono text-sm text-green-400 bg-[#0a0a0a] resize-none focus:outline-none leading-relaxed overflow-auto"
                    spellCheck={false}
                    placeholder="# YAML configuration..."
                />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-white/10 bg-surface/50">
                <div className="text-xs text-textMuted">
                    <span className="text-green-400">●</span> Changes sync automatically to GUI
                </div>
                <div className="text-xs text-textMuted">
                    Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">Ctrl+A</kbd> to select all
                </div>
            </div>
        </div>
    );
};

export default InlineYamlEditor;
