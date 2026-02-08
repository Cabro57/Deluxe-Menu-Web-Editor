
import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { RequirementCard } from './RequirementsEditor';
import InfoTooltip from '../ui/InfoTooltip';

const ArgumentsRequirementEditor = ({ args = [], requirements = [], onChange, denyCommands = [], onDenyChange }) => {
    // State to track expanded cards (by index)
    const [expandedIndex, setExpandedIndex] = useState(0);

    // Sync requirements length with args length
    useEffect(() => {
        if (requirements.length > args.length) {
            // Trim extra requirements if args removed
            onChange(requirements.slice(0, args.length));
        }
    }, [args.length, requirements.length, onChange]);

    const handleRequirementChange = (index, data) => {
        const newReqs = [...requirements];
        // Ensure array is long enough
        while (newReqs.length <= index) {
            newReqs.push({ type: "" });
        }

        // Auto-fill input if type changed and input is empty/undefined
        const oldType = newReqs[index]?.type;
        const newType = data.type;

        if (newType !== oldType && newType && !data.input) {
            // Check if this type usually needs an input (string, regex, comparators, etc.)
            const needsInput = ['string', 'regex', '==', '!=', '>', '>=', '<', '<='].some(t => newType.includes(t));
            if (needsInput) {
                // DeluxeMenus args are 1-indexed in placeholders: %args_1%
                data.input = `%args_${index + 1}%`;
            }
        }

        newReqs[index] = data;
        onChange(newReqs);
    };

    const handleRequirementClear = (index) => {
        const newReqs = [...requirements];
        if (newReqs[index]) {
            newReqs[index] = { type: "" };
            onChange(newReqs);
        }
        // If it was expanded, maybe collapse or stay? Stay is fine.
    };

    const handleDenyChange = (index, value) => {
        const newCmds = [...denyCommands];
        newCmds[index] = value;
        onDenyChange(newCmds);
    };

    // If no args are defined, show a message
    if (!args || args.length === 0) {
        return (
            <div className="p-3 rounded-xl border border-dashed border-white/10 bg-white/5 flex items-center gap-2 text-textMuted text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>No arguments defined. Add arguments above to configure requirements.</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {args.map((arg, idx) => {
                    const req = requirements[idx] || { type: "" };
                    const isConfigured = req.type && req.type !== "";

                    // Custom wrap for RequirementCard to override label/behavior
                    return (
                        <div key={`arg-req-${idx}`} className="group relative">
                            {/* Visual connector/label for the argument */}
                            <div className="mb-1 flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                                        Arg {idx + 1}:
                                    </span>
                                    <span className="text-xs font-mono bg-black/30 px-1.5 py-0.5 rounded text-white/80">
                                        {arg}
                                    </span>
                                    {isConfigured ? (
                                        <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                                            Configured
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-textMuted italic">
                                            (Optional) No validation
                                        </span>
                                    )}
                                </div>
                            </div>

                            <RequirementCard
                                requirement={req}
                                index={idx}
                                onChange={(data) => handleRequirementChange(idx, data)}
                                onRemove={() => handleRequirementClear(idx)}
                                isExpanded={expandedIndex === idx}
                                onToggle={() => setExpandedIndex(expandedIndex === idx ? -1 : idx)}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Global Deny Commands */}
            <div className="space-y-2 pt-3 border-t border-white/5">
                <Label className="text-[10px] text-textMuted flex items-center justify-between">
                    <span>Deny Commands (if ANY argument fails)</span>
                    <InfoTooltip text="Commands executed if any of the above validations fail." />
                </Label>
                <div className="space-y-1.5">
                    {denyCommands.map((cmd, index) => (
                        <div key={index} className="flex items-center gap-2 group">
                            <Input
                                value={cmd}
                                onChange={(e) => handleDenyChange(index, e.target.value)}
                                placeholder="[message] &cInvalid arguments!"
                                className="h-7 bg-black/20 text-[10px] font-mono"
                            />
                            <button
                                type="button"
                                onClick={() => onDenyChange(denyCommands.filter((_, i) => i !== index))}
                                className="w-5 h-5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                            >
                                <X className="w-2.5 h-2.5" />
                            </button>
                        </div>
                    ))}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDenyChange([...denyCommands, ""])}
                        className="w-full h-6 text-[10px] border border-dashed border-white/10 hover:bg-white/5 text-textMuted hover:text-text"
                    >
                        <Plus className="w-2.5 h-2.5 mr-1" /> Add Deny Command
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ArgumentsRequirementEditor;
