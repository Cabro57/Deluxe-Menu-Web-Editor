import React from 'react';
import { X, Plus, Play, Square } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';

const PlaceholderSimulator = ({
    isOpen,
    onClose,
    placeholders,
    setPlaceholders,
    enabled,
    setEnabled
}) => {
    if (!isOpen) return null;

    const handleAdd = () => {
        setPlaceholders([...placeholders, { key: '%player_name%', value: 'Notch' }]);
    };

    const handleRemove = (index) => {
        setPlaceholders(placeholders.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, val) => {
        const newPlaceholders = [...placeholders];
        newPlaceholders[index] = { ...newPlaceholders[index], [field]: val };
        setPlaceholders(newPlaceholders);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                            <Play className="w-4 h-4 fill-current" />
                        </div>
                        <h2 className="font-semibold text-text">Placeholder Simulator</h2>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-lg hover:bg-white/10">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">

                    {/* Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div>
                            <Label className="text-sm font-medium">Enable Simulation</Label>
                            <p className="text-xs text-textMuted/70">Replace placeholders in tooltips</p>
                        </div>
                        <button
                            onClick={() => setEnabled(!enabled)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-primary' : 'bg-white/10'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${enabled ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Placeholders List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs uppercase tracking-wider text-textMuted font-semibold">Mock Values</Label>
                            <Button variant="ghost" size="sm" onClick={handleAdd} className="h-6 gap-1 text-xs text-primary hover:bg-primary/10">
                                <Plus className="w-3 h-3" /> Add
                            </Button>
                        </div>

                        {placeholders.length === 0 ? (
                            <div className="text-center py-8 text-textMuted/50 text-sm border border-dashed border-white/10 rounded-lg">
                                No mock values defined.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {placeholders.map((ph, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            value={ph.key}
                                            onChange={(e) => handleChange(index, 'key', e.target.value)}
                                            placeholder="%placeholder%"
                                            className="flex-1 h-9 bg-white/5 text-xs font-mono"
                                        />
                                        <span className="text-textMuted">=</span>
                                        <Input
                                            value={ph.value}
                                            onChange={(e) => handleChange(index, 'value', e.target.value)}
                                            placeholder="Value"
                                            className="flex-1 h-9 bg-white/5 text-xs"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemove(index)}
                                            className="h-9 w-9 p-0 text-textMuted hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
                    <Button onClick={onClose}>Done</Button>
                </div>
            </div>
        </div>
    );
};

export default PlaceholderSimulator;
