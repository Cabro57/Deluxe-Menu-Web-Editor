import React from 'react';
import { X, Globe, Save } from 'lucide-react';
import { VERSIONS } from "../../services/minecraftDataService";

const SiteSettingsModal = ({ isOpen, onClose, settings, onUpdate }) => {
    if (!isOpen) return null;

    const handleVersionChange = (e) => {
        onUpdate({ ...settings, version: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-surface border border-white/10 rounded-xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-textMuted hover:text-text transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Globe className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-text">Site Settings</h2>
                        <p className="text-xs text-textMuted">Configure global editor preferences</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-textMuted">Target Minecraft Version</label>
                        <select
                            value={settings.version}
                            onChange={handleVersionChange}
                            className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-text focus:outline-none focus:border-primary/50 transition-colors"
                        >
                            {VERSIONS.filter(v => {
                                // Filter out versions older than 1.8
                                // Logic: Check if version starts with 1.7, 1.6, etc. OR if it's "1.0", "1.1", etc.
                                // Safe heuristic: id starts with "1." and the second number is >= 8.
                                const parts = v.id.split('.');
                                if (parts.length < 2) return false; // "???"
                                const minor = parseInt(parts[1], 10);
                                return minor >= 8;
                            }).map(v => (
                                <option key={v.id} value={v.id} className="bg-surface text-text">
                                    Minecraft {v.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-textMuted">
                            Items and textures will be filtered based on this version.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={settings.showMaterialTooltip !== false} // Default true
                                onChange={(e) => onUpdate({ ...settings, showMaterialTooltip: e.target.checked })}
                                className="w-4 h-4 rounded border-white/20 bg-background/30 text-primary focus:ring-primary/50"
                            />
                            <div className="flex-1">
                                <span className="text-sm font-medium text-text block">Show Material IDs</span>
                                <span className="text-xs text-textMuted block">Display item IDs (e.g. minecraft:stone) in tooltips</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save & Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SiteSettingsModal;
