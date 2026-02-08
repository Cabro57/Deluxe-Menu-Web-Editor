import React, { useState } from "react";
import { useDroppable } from '@dnd-kit/core';
import { cn } from "../../utils/cn";
import ItemIcon from "./ItemIcon";
import { DraggableItem } from "../../features/editor/DraggableItem";
import MinecraftTooltip from "./MinecraftTooltip";
import { getSimulatedAmount } from "../../utils/placeholderUtils";

const Slot = ({
    item,
    index,
    isSelected,
    onClick,
    className,
    simulationEnabled,
    placeholders,
    showMaterialTooltip
}) => {
    // Unique ID for the slot drop target
    const { isOver, setNodeRef } = useDroppable({
        id: `slot-${index}`,
        data: { index }
    });

    const [isHovered, setIsHovered] = useState(false); // New state for tooltip

    return (
        <div
            ref={setNodeRef}
            onClick={() => onClick(index)}
            onMouseEnter={() => setIsHovered(true)} // New event handler
            onMouseLeave={() => setIsHovered(false)} // New event handler
            className={cn(
                "relative flex items-center justify-center bg-surface border-2 transition-all cursor-pointer",
                // Size - mimicking Minecraft ratio roughly but responsive
                "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
                // Default border or Hover border (Drag Over Green)
                isOver ? "border-green-500 bg-green-500/20" : "border-border hover:border-primary/50 hover:bg-surfaceHighlight",
                // Selected state - Neon glow (override hover if selected)
                isSelected && "border-primary shadow-[0_0_10px_rgba(99,102,241,0.5)] bg-primary/10",
                className
            )}

        >
            {/* Slot Index - subtle */}
            <span className="absolute top-0.5 right-1 text-[8px] text-textMuted opacity-50 font-mono z-10 pointer-events-none">
                {index}
            </span>

            {/* Item Icon (Draggable) */}
            {item ? (
                <>
                    <div className="w-10 h-10 p-1 flex items-center justify-center relative z-20">
                        <DraggableItem id={`item-${item.slot}`} disabled={false}>
                            <ItemIcon
                                material={item.material}
                                amount={getSimulatedAmount(item, placeholders, simulationEnabled)}
                                modelData={item.modelData}
                                use3D={true}
                            />
                        </DraggableItem>
                    </div>
                    {isHovered && (
                        <MinecraftTooltip
                            item={item}
                            simulationEnabled={simulationEnabled}
                            placeholders={placeholders}
                            showId={showMaterialTooltip}
                        />
                    )}
                </>
            ) : null}
        </div>
    );
};

export default Slot;
