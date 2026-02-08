import React, { useState } from 'react';
import { ChevronDown, X, Plus } from 'lucide-react';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

// Requirement type options for dropdown
export const REQUIREMENT_OPTIONS = [
    { group: "None", options: [{ value: "", label: "None" }] },
    {
        group: "Permissions", options: [
            { value: "has permission", label: "Has Permission" },
            { value: "!has permission", label: "Doesn't Have Permission" },
            { value: "has permissions", label: "Has Multiple Permissions" },
        ]
    },
    {
        group: "Economy & Items", options: [
            { value: "has money", label: "Has Money" },
            { value: "has item", label: "Has Item" },
            { value: "has exp", label: "Has Experience" },
            { value: "has meta", label: "Has Meta" },
        ]
    },
    {
        group: "String Operations", options: [
            { value: "string equals", label: "String Equals" },
            { value: "!string equals", label: "String NOT Equals" },
            { value: "string equals ignorecase", label: "String Equals (ignore case)" },
            { value: "string contains", label: "String Contains" },
            { value: "!string contains", label: "String NOT Contains" },
            { value: "string length", label: "String Length" },
            { value: "regex matches", label: "Regex Matches" },
            { value: "!regex matches", label: "Regex NOT Matches" },
        ]
    },
    {
        group: "Comparators", options: [
            { value: "==", label: "Equals (==)" },
            { value: "!=", label: "Not Equals (!=)" },
            { value: ">", label: "Greater Than (>)" },
            { value: ">=", label: "Greater Or Equal (>=)" },
            { value: "<", label: "Less Than (<)" },
            { value: "<=", label: "Less Or Equal (<=)" },
        ]
    },
    {
        group: "Advanced", options: [
            { value: "javascript", label: "JavaScript Expression" },
            { value: "is near", label: "Is Near Location" },
            { value: "!is near", label: "Is NOT Near Location" },
            { value: "is object", label: "Is Object Type" },
        ]
    },
];

// RequirementCard - Reusable component for a single requirement
// RequirementCard - Reusable component for a single requirement
export const RequirementCard = ({ requirement, index, onChange, onRemove, isExpanded, onToggle, nestedDeny = false }) => {
    const updateField = (field, value) => {
        onChange({ ...requirement, [field]: value });
    };

    const reqType = requirement.type || "";

    return (
        <div className="rounded-xl border border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent overflow-hidden">
            {/* Header - collapsible */}
            <div
                role="button"
                tabIndex={0}
                onClick={onToggle}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggle();
                    }
                }}
                className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors cursor-pointer select-none"
            >
                <div className="flex items-center gap-2">
                    <ChevronDown className={cn("w-4 h-4 text-textMuted transition-transform", isExpanded && "rotate-180")} />
                    <span className="text-xs font-medium text-text">
                        {requirement.id || `Requirement ${index + 1}`}
                        {reqType && <span className="text-textMuted ml-2">({reqType})</span>}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    className="w-6 h-6 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>

            {/* Content - expanded fields */}
            {isExpanded && (
                <div className="p-3 pt-0 space-y-3 border-t border-white/5">

                    {/* ID Field (Only if nestedDeny is true, which implies we are in Args mode where keys matter) */}
                    {nestedDeny && (
                        <div className="space-y-1">
                            <Label className="text-[10px] text-textMuted">Requirement ID (Key)</Label>
                            <Input
                                value={requirement.id || ""}
                                onChange={(e) => updateField("id", e.target.value)}
                                placeholder={`req_${index + 1}`}
                                className="h-8 bg-black/20 text-xs font-mono"
                            />
                        </div>
                    )}

                    {/* Requirement Type Dropdown */}
                    <div className="space-y-1">
                        <Label className="text-[10px] text-textMuted">Type</Label>
                        <select
                            value={reqType}
                            onChange={(e) => updateField("type", e.target.value)}
                            className="dropdown-global w-full h-9"
                        >
                            {REQUIREMENT_OPTIONS.map(group => (
                                <optgroup key={group.group} label={group.group}>
                                    {group.options.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Dynamic Fields based on type */}
                    {reqType && (
                        <div className="space-y-3">
                            {/* Permission field */}
                            {(reqType.includes("permission") && !reqType.includes("permissions")) && (
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-textMuted">Permission Node</Label>
                                    <Input
                                        value={requirement.permission || ""}
                                        onChange={(e) => updateField("permission", e.target.value)}
                                        placeholder="my.permission.node"
                                        className="h-8 bg-black/20 text-xs font-mono"
                                    />
                                </div>
                            )}

                            {/* Multiple Permissions */}
                            {reqType === "has permissions" && (
                                <>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-textMuted">Permissions (comma separated)</Label>
                                        <Input
                                            value={requirement.permissions || ""}
                                            onChange={(e) => updateField("permissions", e.target.value)}
                                            placeholder="perm.one, perm.two, perm.three"
                                            className="h-8 bg-black/20 text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-textMuted">Minimum Required</Label>
                                        <Input
                                            type="number"
                                            value={requirement.minimum || ""}
                                            onChange={(e) => updateField("minimum", e.target.value)}
                                            placeholder="1"
                                            className="h-8 bg-black/20 text-xs font-mono"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Money */}
                            {reqType === "has money" && (
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-textMuted">Amount</Label>
                                    <Input
                                        value={requirement.amount || ""}
                                        onChange={(e) => updateField("amount", e.target.value)}
                                        placeholder="100 or %placeholder%"
                                        className="h-8 bg-black/20 text-xs font-mono"
                                    />
                                </div>
                            )}

                            {/* Has Item */}
                            {reqType === "has item" && (
                                <>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-textMuted">Material</Label>
                                        <Input
                                            value={requirement.material || ""}
                                            onChange={(e) => updateField("material", e.target.value)}
                                            placeholder="DIAMOND"
                                            className="h-8 bg-black/20 text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-textMuted">Amount</Label>
                                        <Input
                                            type="number"
                                            value={requirement.amount || ""}
                                            onChange={(e) => updateField("amount", e.target.value)}
                                            placeholder="1"
                                            className="h-8 bg-black/20 text-xs font-mono"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Has Experience */}
                            {reqType === "has exp" && (
                                <>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-textMuted">Amount</Label>
                                        <Input
                                            type="number"
                                            value={requirement.amount || ""}
                                            onChange={(e) => updateField("amount", e.target.value)}
                                            placeholder="30"
                                            className="h-8 bg-black/20 text-xs font-mono"
                                        />
                                    </div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={requirement.level || false}
                                            onChange={(e) => updateField("level", e.target.checked)}
                                        />
                                        <span className="text-[10px] text-textMuted">Check Levels (not points)</span>
                                    </label>
                                </>
                            )}

                            {/* String/Regex/Comparator operations */}
                            {(reqType.includes("string") || reqType.includes("regex") || ["==", "!=", ">", ">=", "<", "<="].includes(reqType)) && (
                                <>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-textMuted">Input (placeholder)</Label>
                                        <Input
                                            value={requirement.input || ""}
                                            onChange={(e) => updateField("input", e.target.value)}
                                            placeholder="%player_level%"
                                            className="h-8 bg-black/20 text-xs font-mono"
                                        />
                                    </div>
                                    {reqType === "string length" ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] text-textMuted">Min Length</Label>
                                                <Input
                                                    type="number"
                                                    value={requirement.min || ""}
                                                    onChange={(e) => updateField("min", e.target.value)}
                                                    placeholder="1"
                                                    className="h-8 bg-black/20 text-xs font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] text-textMuted">Max Length</Label>
                                                <Input
                                                    type="number"
                                                    value={requirement.max || ""}
                                                    onChange={(e) => updateField("max", e.target.value)}
                                                    placeholder="16"
                                                    className="h-8 bg-black/20 text-xs font-mono"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <Label className="text-[10px] text-textMuted">
                                                {reqType.includes("regex") ? "Regex Pattern" : "Output (compare to)"}
                                            </Label>
                                            <Input
                                                value={requirement.output || ""}
                                                onChange={(e) => updateField("output", e.target.value)}
                                                placeholder={reqType.includes("regex") ? "[0-9]+" : "10"}
                                                className="h-8 bg-black/20 text-xs font-mono"
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {/* JavaScript */}
                            {reqType === "javascript" && (
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-textMuted">JavaScript Expression</Label>
                                    <Input
                                        value={requirement.expression || ""}
                                        onChange={(e) => updateField("expression", e.target.value)}
                                        placeholder="%player_level% > 10"
                                        className="h-8 bg-black/20 text-xs font-mono"
                                    />
                                </div>
                            )}

                            {/* Is Near */}
                            {reqType.includes("is near") && (
                                <>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-textMuted">Location (world;x;y;z)</Label>
                                        <Input
                                            value={requirement.location || ""}
                                            onChange={(e) => updateField("location", e.target.value)}
                                            placeholder="world;100;64;-200"
                                            className="h-8 bg-black/20 text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-textMuted">Distance (blocks)</Label>
                                        <Input
                                            type="number"
                                            value={requirement.distance || ""}
                                            onChange={(e) => updateField("distance", e.target.value)}
                                            placeholder="10"
                                            className="h-8 bg-black/20 text-xs font-mono"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Is Object */}
                            {reqType === "is object" && (
                                <>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-textMuted">Input (placeholder)</Label>
                                        <Input
                                            value={requirement.input || ""}
                                            onChange={(e) => updateField("input", e.target.value)}
                                            placeholder="%some_placeholder%"
                                            className="h-8 bg-black/20 text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-textMuted">Object Type</Label>
                                        <select
                                            value={requirement.objectType || ""}
                                            onChange={(e) => updateField("objectType", e.target.value)}
                                            className="dropdown-global w-full h-8"
                                        >
                                            <option value="">Select type...</option>
                                            <option value="INT">Integer</option>
                                            <option value="DOUBLE">Double</option>
                                            <option value="UUID">UUID</option>
                                            <option value="PLAYER">Player</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Has Meta */}
                            {reqType === "has meta" && (
                                <>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-textMuted">Meta Key</Label>
                                        <Input
                                            value={requirement.key || ""}
                                            onChange={(e) => updateField("key", e.target.value)}
                                            placeholder="myMetaKey"
                                            className="h-8 bg-black/20 text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-textMuted">Meta Type</Label>
                                        <select
                                            value={requirement.metaType || ""}
                                            onChange={(e) => updateField("metaType", e.target.value)}
                                            className="dropdown-global w-full h-8"
                                        >
                                            <option value="">Any</option>
                                            <option value="STRING">String</option>
                                            <option value="BOOLEAN">Boolean</option>
                                            <option value="DOUBLE">Double</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-textMuted">Meta Value</Label>
                                        <Input
                                            value={requirement.value || ""}
                                            onChange={(e) => updateField("value", e.target.value)}
                                            placeholder="value"
                                            className="h-8 bg-black/20 text-xs font-mono"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Nested Deny Commands */}
                    {nestedDeny && (
                        <div className="space-y-2 pt-3 border-t border-white/5">
                            <Label className="text-[10px] text-textMuted">Deny Commands (Nested)</Label>
                            <div className="space-y-1.5">
                                {(requirement.deny_commands || []).map((cmd, i) => (
                                    <div key={i} className="flex items-center gap-2 group">
                                        <Input
                                            value={cmd}
                                            onChange={(e) => {
                                                const newCmds = [...(requirement.deny_commands || [])];
                                                newCmds[i] = e.target.value;
                                                updateField("deny_commands", newCmds);
                                            }}
                                            placeholder="[message] &cInvalid!"
                                            className="h-7 bg-black/20 text-[10px] font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newCmds = (requirement.deny_commands || []).filter((_, idx) => idx !== i);
                                                updateField("deny_commands", newCmds);
                                            }}
                                            className="w-5 h-5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center"
                                        >
                                            <X className="w-2.5 h-2.5" />
                                        </button>
                                    </div>
                                ))}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateField("deny_commands", [...(requirement.deny_commands || []), ""])}
                                    className="w-full h-6 text-[10px] border border-dashed border-white/10"
                                >
                                    <Plus className="w-2.5 h-2.5 mr-1" /> Add Deny Command
                                </Button>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

// RequirementsEditor - Manages multiple requirements
const RequirementsEditor = ({ requirements, onChange, showCommands = true, denyCommands, successCommands, onDenyChange, onSuccessChange, nestedDeny = false }) => {
    const [expandedIndex, setExpandedIndex] = useState(0);

    const addRequirement = () => {
        const currentReqs = requirements || [];
        let nextId = 1;
        while (currentReqs.some(r => r.id === `req_${nextId}`)) {
            nextId++;
        }
        const newReqs = [...currentReqs, { type: "", id: `req_${nextId}`, deny_commands: [] }];
        onChange(newReqs);
        setExpandedIndex(newReqs.length - 1);
    };

    const updateRequirement = (index, data) => {
        const newReqs = [...(requirements || [])];
        newReqs[index] = data;
        onChange(newReqs);
    };

    const removeRequirement = (index) => {
        const newReqs = (requirements || []).filter((_, i) => i !== index);
        onChange(newReqs);
        if (expandedIndex >= newReqs.length) setExpandedIndex(Math.max(0, newReqs.length - 1));
    };

    const handleDenyChange = (index, value) => {
        const newCmds = [...(denyCommands || [])];
        newCmds[index] = value;
        onDenyChange(newCmds);
    };

    const handleSuccessChange = (index, value) => {
        const newCmds = [...(successCommands || [])];
        newCmds[index] = value;
        onSuccessChange(newCmds);
    };

    return (
        <div className="space-y-3">
            {/* Requirement Cards */}
            <div className="space-y-2">
                {(requirements || []).map((req, idx) => (
                    <RequirementCard
                        key={idx}
                        requirement={req}
                        index={idx}
                        onChange={(data) => updateRequirement(idx, data)}
                        onRemove={() => removeRequirement(idx)}
                        isExpanded={expandedIndex === idx}
                        onToggle={() => setExpandedIndex(expandedIndex === idx ? -1 : idx)}
                        nestedDeny={nestedDeny}
                    />
                ))}
            </div>

            {/* Add Requirement Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={addRequirement}
                className="w-full h-8 gap-2 text-xs border-dashed"
            >
                <Plus className="w-3 h-3" />
                Add Requirement
            </Button>

            {/* Deny/Success Commands - only for click requirements OR if not using nested deny */}
            {showCommands && !nestedDeny && (requirements || []).length > 0 && (
                <>
                    <div className="space-y-2 pt-3 border-t border-white/5">
                        <Label className="text-[10px] text-textMuted">Deny Commands (if any requirement fails)</Label>
                        <div className="space-y-1.5">
                            {(denyCommands || []).map((cmd, index) => (
                                <div key={index} className="flex items-center gap-2 group">
                                    <Input
                                        value={cmd}
                                        onChange={(e) => handleDenyChange(index, e.target.value)}
                                        placeholder="[message] &cNo permission!"
                                        className="h-7 bg-black/20 text-[10px] font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => onDenyChange((denyCommands || []).filter((_, i) => i !== index))}
                                        className="w-5 h-5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center"
                                    >
                                        <X className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            ))}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDenyChange([...(denyCommands || []), ""])}
                                className="w-full h-6 text-[10px] border border-dashed border-white/10"
                            >
                                <Plus className="w-2.5 h-2.5 mr-1" /> Add Deny Command
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <Label className="text-[10px] text-textMuted">Success Commands (if all requirements pass)</Label>
                        <div className="space-y-1.5">
                            {(successCommands || []).map((cmd, index) => (
                                <div key={index} className="flex items-center gap-2 group">
                                    <Input
                                        value={cmd}
                                        onChange={(e) => handleSuccessChange(index, e.target.value)}
                                        placeholder="[sound] ENTITY_PLAYER_LEVELUP"
                                        className="h-7 bg-black/20 text-[10px] font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => onSuccessChange((successCommands || []).filter((_, i) => i !== index))}
                                        className="w-5 h-5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center"
                                    >
                                        <X className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            ))}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onSuccessChange([...(successCommands || []), ""])}
                                className="w-full h-6 text-[10px] border border-dashed border-white/10"
                            >
                                <Plus className="w-2.5 h-2.5 mr-1" /> Add Success Command
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RequirementsEditor;
