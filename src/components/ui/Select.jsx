import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../utils/cn";

const Select = ({ value, onChange, options, placeholder = "Select...", className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div ref={selectRef} className={cn("relative", className)}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full h-10 px-3 rounded-lg text-sm text-left flex items-center justify-between gap-2",
                    "bg-white/5 border border-white/10 text-text",
                    "hover:bg-white/10 hover:border-white/20",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                    "transition-all duration-200"
                )}
            >
                <span className={selectedOption ? "text-text" : "text-textMuted"}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown className={cn(
                    "w-4 h-4 text-textMuted transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 py-1 rounded-lg bg-surface/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto custom-scrollbar">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full px-3 py-2.5 text-sm text-left flex items-center justify-between gap-2",
                                "transition-colors duration-150",
                                value === option.value
                                    ? "bg-primary/20 text-primary"
                                    : "text-text hover:bg-white/10"
                            )}
                        >
                            <span>{option.label}</span>
                            {value === option.value && (
                                <Check className="w-4 h-4 text-primary" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export { Select };
