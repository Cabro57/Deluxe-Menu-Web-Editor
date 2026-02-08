import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Plus, Trash2, Box, Package, ArrowLeft, Search, Code } from "lucide-react";
import { cn } from "../../utils/cn";
import { createPortal } from "react-dom";
import ItemIcon from "../../components/ui/ItemIcon";
import { Input } from "../../components/ui/Input";
import MinecraftTooltip from "../../components/ui/MinecraftTooltip";

const SidebarItems = ({ items, selectedItemId, onSelectItem, onCreateItem, onDeleteItem, onBack, onJumpToYaml, placeholders, simulationEnabled, showMaterialTooltip }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredItem, setHoveredItem] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, top: 0, bottom: 0, isBottom: false });

    // Filter items by search query
    const filteredItems = items.filter(item => {
        const name = (item.displayName || item.material || "").toLowerCase().replace(/&[0-9a-fk-or]/gi, '');
        const material = (item.material || "").toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query) || material.includes(query);
    });

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                {onBack && (
                    <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                )}
                <div className="flex items-center gap-2 flex-1">
                    <Package className="w-4 h-4 text-primary" />
                    <h2 className="font-semibold text-text text-sm">
                        Items <span className="text-textMuted font-normal">({items.length})</span>
                    </h2>
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary"
                    onClick={onCreateItem}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-textMuted" />
                <Input
                    placeholder="Search items..."
                    className="pl-9 h-9 bg-white/5"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                {filteredItems.length === 0 && items.length === 0 && (
                    <div className="text-center py-8 px-4">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-background/30 flex items-center justify-center">
                            <Box className="w-8 h-8 text-textMuted/50" />
                        </div>
                        <p className="text-textMuted text-sm font-medium">No items yet</p>
                        <p className="text-textMuted/60 text-xs mt-1">Click + to create one</p>
                    </div>
                )}

                {filteredItems.length === 0 && items.length > 0 && (
                    <div className="text-center py-8 px-4">
                        <p className="text-textMuted text-sm">No items match "{searchQuery}"</p>
                    </div>
                )}

                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onSelectItem(item.id)}
                        className={cn(
                            "flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 text-sm group border",
                            selectedItemId === item.id
                                ? "bg-primary/15 text-text border-primary/30 shadow-lg shadow-primary/10"
                                : "hover:bg-white/5 text-textMuted hover:text-text border-transparent hover:border-white/10"
                        )}
                    >
                        {/* Item Icon */}
                        <div
                            className="w-9 h-9 rounded-lg bg-background/40 flex items-center justify-center overflow-hidden border border-white/5 shrink-0"
                            onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const spaceAbove = rect.top;
                                const spaceBelow = window.innerHeight - rect.bottom;
                                const showBelow = spaceBelow > spaceAbove;
                                const maxHeight = showBelow ? spaceBelow - 40 : spaceAbove - 40;

                                const spaceRight = window.innerWidth - rect.right;
                                const showLeft = spaceRight < 320; // Flip if less than 320px space on right

                                setTooltipPos({
                                    x: showLeft ? rect.left : rect.right,
                                    top: rect.top,
                                    bottom: rect.bottom,
                                    showBelow,
                                    maxHeight,
                                    showLeft
                                });
                                setHoveredItem(item);
                            }}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <ItemIcon material={item.material} className="w-7 h-7" use3D={true} />
                        </div>

                        {/* Item Info - Simplified: Just ID */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-medium text-text font-mono truncate">
                                    {item.id}
                                </span>
                                {item.material && (
                                    <span className="text-[10px] text-textMuted/40 font-mono truncate">
                                        {item.material}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            {/* Jump to YAML Button */}
                            <Button
                                variant="ghost"
                                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 hover:bg-primary/20 text-textMuted hover:text-primary rounded-lg transition-all shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onJumpToYaml && onJumpToYaml(item.id);
                                }}
                                title="Show in YAML"
                            >
                                <Code className="h-3.5 w-3.5" />
                            </Button>

                            {/* Delete Button */}
                            <Button
                                variant="ghost"
                                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-textMuted hover:text-red-400 rounded-lg transition-all shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteItem(item.id);
                                }}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tooltip Portal */}
            {hoveredItem && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        left: tooltipPos.showLeft ? tooltipPos.x : tooltipPos.x + 12,
                        // If showBelow: position at bottom of icon. Else position at top of icon.
                        top: tooltipPos.showBelow ? tooltipPos.bottom : tooltipPos.top,
                        zIndex: 9999,
                        pointerEvents: 'none'
                    }}
                    className="animate-in fade-in zoom-in-95 duration-150"
                >
                    <div className="relative">
                        <MinecraftTooltip
                            item={hoveredItem}
                            simulationEnabled={simulationEnabled}
                            placeholders={placeholders}
                            showId={showMaterialTooltip}
                            style={{ maxHeight: tooltipPos.maxHeight }}
                            className={cn(
                                tooltipPos.showBelow
                                    ? "top-[10px]"
                                    : "-translate-y-full top-[-10px]",
                                tooltipPos.showLeft
                                    ? "-translate-x-full left-[-12px]"
                                    : "left-0 translate-x-0"
                            )}
                        />
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default SidebarItems;
