import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export function DraggableItem({ id, children, disabled }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        disabled: disabled
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1, // Visual feedback while dragging
        zIndex: isDragging ? 50 : undefined,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none', // Critical for pointer events
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="w-full h-full">
            {children}
        </div>
    );
}
