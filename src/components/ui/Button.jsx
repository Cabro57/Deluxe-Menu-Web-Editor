import React from "react";
import { cn } from "../../utils/cn";

const Button = React.forwardRef(({ className, variant = "primary", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50";

    const variants = {
        primary: "bg-primary text-white shadow hover:bg-primaryHover shadow-primary/25",
        secondary: "bg-secondary text-white shadow-sm hover:bg-secondary/90",
        outline: "border border-border bg-transparent shadow-sm hover:bg-surfaceHighlight hover:text-text",
        ghost: "hover:bg-surfaceHighlight hover:text-text",
        danger: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            ref={ref}
            {...props}
        />
    );
});

Button.displayName = "Button";

export { Button };
