import React from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Plus, X, GripVertical } from 'lucide-react';
import { Label } from './Label';
import InfoTooltip from './InfoTooltip';

const ListInput = ({
    label,
    items = [],
    onChange,
    placeholder = "",
    tooltip = "",
    addButtonText = "Add Item"
}) => {

    const matchedItems = Array.isArray(items) ? items : [];

    const handleChange = (index, value) => {
        const newItems = [...matchedItems];
        newItems[index] = value;
        onChange(newItems);
    };

    const handleRemove = (index) => {
        const newItems = matchedItems.filter((_, i) => i !== index);
        onChange(newItems);
    };

    const handleAdd = () => {
        onChange([...matchedItems, ""]);
    };

    return (
        <div className="space-y-2">
            <Label className="text-xs text-textMuted flex items-center">
                {label}
                {tooltip && <InfoTooltip text={tooltip} />}
            </Label>
            <div className="space-y-2">
                {matchedItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                        <GripVertical className="w-4 h-4 text-textMuted/30 flex-shrink-0" />
                        <Input
                            value={item}
                            onChange={(e) => handleChange(index, e.target.value)}
                            placeholder={placeholder}
                            className="h-9 bg-background/30 border-white/10 text-xs font-mono"
                        />
                        <button
                            onClick={() => handleRemove(index)}
                            className="w-6 h-6 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAdd}
                    className="w-full h-8 gap-2 text-xs border-dashed"
                >
                    <Plus className="w-3 h-3" />
                    {addButtonText}
                </Button>
            </div>
        </div>
    );
};

export default ListInput;
