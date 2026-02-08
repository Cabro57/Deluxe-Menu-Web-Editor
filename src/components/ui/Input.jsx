import React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-text shadow-sm transition-all duration-200",
                "placeholder:text-textMuted/50",
                "hover:bg-white/10 hover:border-white/20",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-white/10",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
