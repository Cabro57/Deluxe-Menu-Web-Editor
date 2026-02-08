
import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, AlertCircle, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { cn } from '../../utils/cn';
import RequirementsEditor from './RequirementsEditor';
import InfoTooltip from '../ui/InfoTooltip';

const ArgumentCard = ({ arg, index, onChange, onRemove, isExpanded, onToggle }) => {
    const [subExpanded, setSubExpanded] = useState(true);

    const updateField = (field, value) => {
        onChange({ ...arg, [field]: value });
    };

    return (
        <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
            {/* Header / Main Input */}
            <div className="p-3 flex items-center gap-3 bg-white/5">
                <button
                    onClick={onToggle}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-textMuted" /> : <ChevronRight className="w-4 h-4 text-textMuted" />}
                </button>

                <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs font-mono text-textMuted opacity-50 select-none">
                        %args_{index + 1}%
                    </span>
                    <Input
                        value={arg.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="argument_name (required)"
                        className={cn(
                            "h-8 bg-black/20 font-mono text-xs flex-1 border-transparent focus:border-primary/50",
                            !arg.name && "border-red-500/30 ring-1 ring-red-500/20"
                        )}
                        autoFocus={!arg.name}
                    />
                </div>

                <button
                    onClick={onRemove}
                    className="w-8 h-8 rounded hover:bg-red-500/10 text-textMuted hover:text-red-400 flex items-center justify-center transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Expanded Content: Requirements */}
            {isExpanded && (
                <div className="p-3 border-t border-white/5 space-y-4 bg-black/10">

                    {/* Requirements Section */}
                    <div className="space-y-2">
                        <Label className="text-[10px] text-textMuted uppercase tracking-wider font-bold flex items-center gap-2">
                            Validation Requirements
                            <InfoTooltip text="Requirements that this argument must meet. Deny commands specific to each requirement can be added inside." />
                        </Label>

                        <RequirementsEditor
                            requirements={arg.requirements}
                            onChange={(reqs) => updateField('requirements', reqs)}
                            showCommands={false} // Global commands disabled for arguments
                            nestedDeny={true}    // Nested commands enabled for arguments
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const ArgumentListEditor = ({ args = [], onChange }) => {
    const [expandedIds, setExpandedIds] = useState([]);

    // Normalize args if they are strings (legacy support / safety)
    const normalizedArgs = args.map(arg => {
        if (typeof arg === 'string') {
            return { name: arg, requirements: [], deny_commands: [] };
        }
        return arg;
    });

    const toggleExpand = (index) => {
        setExpandedIds(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const handleAdd = () => {
        // Add new unified argument object
        const newArg = { name: "", requirements: [], deny_commands: [] };
        const newArgs = [...normalizedArgs, newArg];
        onChange(newArgs);
        // Auto expand new one
        setExpandedIds(prev => [...prev, newArgs.length - 1]);
    };

    const handleChange = (index, data) => {
        const newArgs = [...normalizedArgs];
        newArgs[index] = data;
        onChange(newArgs);
    };

    const handleRemove = (index) => {
        const newArgs = normalizedArgs.filter((_, i) => i !== index);
        onChange(newArgs);
    };

    return (
        <div className="space-y-3">
            {normalizedArgs.length === 0 && (
                <button
                    onClick={handleAdd}
                    className="w-full text-center p-6 border border-dashed border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all group cursor-pointer flex flex-col items-center justify-center outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                >
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-lg shadow-black/20">
                        <Settings className="w-5 h-5 text-textMuted group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-textMuted mb-1 group-hover:text-text transition-colors">Start Adding Arguments</p>
                    <p className="text-xs text-textMuted/60 mb-3 max-w-[200px] mx-auto">
                        Arguments allow players to input data when opening the menu.
                    </p>
                    <div className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-3 rounded-md text-xs inline-flex items-center justify-center transition-colors font-semibold shadow-lg shadow-primary/20">
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add First Argument
                    </div>
                </button>
            )}

            <div className="space-y-2">
                {normalizedArgs.map((arg, index) => (
                    <ArgumentCard
                        key={index} // Order matters in arguments
                        arg={arg}
                        index={index}
                        onChange={(data) => handleChange(index, data)}
                        onRemove={() => handleRemove(index)}
                        isExpanded={expandedIds.includes(index)}
                        onToggle={() => toggleExpand(index)}
                    />
                ))}
            </div>

            {normalizedArgs.length > 0 && (
                <Button
                    onClick={handleAdd}
                    variant="outline"
                    className="w-full border-dashed border-white/20 hover:border-white/40 h-9"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Argument
                </Button>
            )}
        </div>
    );
};

export default ArgumentListEditor;
