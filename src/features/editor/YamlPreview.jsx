import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../../components/ui/Button";
import { Copy, X, Check, Download, RefreshCw, AlertCircle } from "lucide-react";
import { generateYaml, parseYaml } from "../../utils/yamlHelper";

const YamlPreview = ({ settings, onClose, onApply }) => {
    const [yamlContent, setYamlContent] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Generate YAML from current settings
    useEffect(() => {
        const yaml = generateYaml(settings);
        setYamlContent(yaml);
        setHasChanges(false);
        setError(null);
    }, [settings]);

    // Handle YAML text changes
    const handleYamlChange = useCallback((e) => {
        setYamlContent(e.target.value);
        setHasChanges(true);

        // Validate YAML on change
        const result = parseYaml(e.target.value);
        if (result.error) {
            setError(result.error);
        } else {
            setError(null);
        }
    }, []);

    // Apply YAML changes to visual editor
    const handleApply = () => {
        const result = parseYaml(yamlContent);
        if (result.error) {
            setError(result.error);
            return;
        }

        if (onApply && result.settings) {
            onApply(result.settings);
            setHasChanges(false);
        }
    };

    // Reset to current settings
    const handleReset = () => {
        const yaml = generateYaml(settings);
        setYamlContent(yaml);
        setHasChanges(false);
        setError(null);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(yamlContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([yamlContent], { type: "text/yaml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `menu-${settings.title.replace(/&[0-9a-fk-or]/g, '').trim().toLowerCase().replace(/\s+/g, '-') || 'config'}.yml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-3xl bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-text">YAML Editor</h2>
                        {hasChanges && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                Unsaved changes
                            </span>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 flex items-center gap-2 text-sm text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span>YAML Error: {error}</span>
                    </div>
                )}

                {/* Editor */}
                <div className="flex-1 overflow-hidden">
                    <textarea
                        value={yamlContent}
                        onChange={handleYamlChange}
                        className="w-full h-full min-h-[400px] p-4 font-mono text-sm text-green-400 bg-[#0d0d0d] resize-none focus:outline-none leading-relaxed"
                        spellCheck={false}
                        placeholder="# YAML configuration..."
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-surface/50 flex items-center justify-between gap-2 rounded-b-xl">
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleDownload} className="gap-2">
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                        <Button
                            onClick={handleCopy}
                            variant="outline"
                            className="gap-2"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        {hasChanges && (
                            <Button variant="ghost" onClick={handleReset} className="gap-2 text-textMuted">
                                <RefreshCw className="h-4 w-4" />
                                Reset
                            </Button>
                        )}
                        <Button
                            onClick={handleApply}
                            disabled={!!error || !hasChanges}
                            className="gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50"
                        >
                            <Check className="h-4 w-4" />
                            Apply Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YamlPreview;
