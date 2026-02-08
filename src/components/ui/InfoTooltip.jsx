import React, { useState, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';
import { cn } from '../../utils/cn';

const InfoTooltip = ({ text, className, side = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const [coords, setCoords] = useState({ top: -9999, left: -9999 });
    const [adjustedSide, setAdjustedSide] = useState(side);

    useLayoutEffect(() => {
        if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

        // ... (rest of the effect logic remains same, just ensuring we keep the variable declarations if not replacing whole block)
        const updatePosition = () => {
            if (!triggerRef.current || !tooltipRef.current) return;

            const triggerRect = triggerRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const padding = 10; // Space from screen edge

            let t = 0;
            let l = 0;
            let newSide = side;

            // Helper to get coords for a specific side
            const getCoords = (s) => {
                switch (s) {
                    case 'top':
                        return {
                            top: triggerRect.top - tooltipRect.height - 8,
                            left: triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
                        };
                    case 'bottom':
                        return {
                            top: triggerRect.bottom + 8,
                            left: triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
                        };
                    case 'left':
                        return {
                            top: triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2),
                            left: triggerRect.left - tooltipRect.width - 8
                        };
                    case 'right':
                        return {
                            top: triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2),
                            left: triggerRect.right + 8
                        };
                    default:
                        return { top: 0, left: 0 };
                }
            };

            // Initial calculation
            let { top, left } = getCoords(side);

            // Boundary checks
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Vertical Flip
            if (side === 'top' && top < padding) {
                newSide = 'bottom';
                ({ top, left } = getCoords('bottom'));
            } else if (side === 'bottom' && top + tooltipRect.height > viewportHeight - padding) {
                newSide = 'top';
                ({ top, left } = getCoords('top'));
            }

            // Horizontal Flip (less common for top/bottom but needed for left/right)
            if (side === 'left' && left < padding) {
                newSide = 'right';
                ({ top, left } = getCoords('right'));
            } else if (side === 'right' && left + tooltipRect.width > viewportWidth - padding) {
                newSide = 'left';
                ({ top, left } = getCoords('left'));
            }

            // Clamp to viewport edges (prevent going off screen horizontally if top/bottom)
            if (newSide === 'top' || newSide === 'bottom') {
                if (left < padding) left = padding;
                if (left + tooltipRect.width > viewportWidth - padding) {
                    left = viewportWidth - tooltipRect.width - padding;
                }
            }

            // Allow some vertical clamping if absolutely needed (rare)
            if (top < padding) top = padding;
            if (top + tooltipRect.height > viewportHeight - padding) {
                top = viewportHeight - tooltipRect.height - padding;
            }

            t = top;
            l = left;

            setCoords({ top: t, left: l });
            setAdjustedSide(newSide);
        };

        updatePosition();
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isVisible, side, text]);

    // ... 

    return (
        <>
            <div
                ref={triggerRef}
                className={cn("relative inline-flex items-center ml-1", className)}
                onMouseEnter={() => {
                    setAdjustedSide(side);
                    setCoords({ top: -9999, left: -9999 }); // Reset to avoid jump
                    setIsVisible(true);
                }}
                onMouseLeave={() => setIsVisible(false)}
            >
                <Info className="w-3.5 h-3.5 text-textMuted hover:text-primary cursor-help transition-colors" />
            </div>

            {isVisible && createPortal(
                <div
                    ref={tooltipRef}
                    style={{
                        top: coords.top,
                        left: coords.left,
                        position: 'fixed'
                    }}
                    className="z-[9999] w-max max-w-[220px] bg-surface border border-white/10 rounded-lg p-2.5 shadow-2xl animate-in fade-in duration-200 pointer-events-none"
                >
                    <p className="text-xs text-text leading-tight whitespace-normal break-words">{text}</p>

                    {/* Hide arrow if clamped forcefully, as it might point to nothing */}
                    {/* Simplified arrow for now, as fixed positioning makes perfect arrow alignment changing based on clamping hard without more math */}
                </div>,
                document.body
            )}
        </>
    );
};

export default InfoTooltip;
