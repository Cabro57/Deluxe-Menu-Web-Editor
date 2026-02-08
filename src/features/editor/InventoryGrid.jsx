import React from "react";
import Slot from "../../components/ui/Slot";
import { parseMinecraftColors } from "../../utils/colorParser";

// Complete GUI configurations for all Minecraft inventory types
const GUI_CONFIGS = {
    // Standard containers
    CHEST: { cols: 9, getRows: (size) => Math.max(1, Math.min(6, size / 9)), title: "Chest" },
    ENDER_CHEST: { cols: 9, getRows: () => 3, title: "Ender Chest", fixedSize: 27 },
    BARREL: { cols: 9, getRows: (size) => Math.max(1, Math.min(6, size / 9)), title: "Barrel" },
    SHULKER_BOX: { cols: 9, getRows: () => 3, title: "Shulker Box", fixedSize: 27 },

    // Small containers
    HOPPER: { cols: 5, getRows: () => 1, title: "Hopper", fixedSize: 5, special: "hopper" },
    DISPENSER: { cols: 3, getRows: () => 3, title: "Dispenser", fixedSize: 9 },
    DROPPER: { cols: 3, getRows: () => 3, title: "Dropper", fixedSize: 9 },

    // Crafting & Processing
    WORKBENCH: { cols: 3, getRows: () => 3, title: "Crafting", fixedSize: 9, special: "crafting", hasOutput: true },
    FURNACE: { cols: 1, getRows: () => 3, title: "Furnace", fixedSize: 3, special: "furnace" },
    BLAST_FURNACE: { cols: 1, getRows: () => 3, title: "Blast Furnace", fixedSize: 3, special: "furnace" },
    SMOKER: { cols: 1, getRows: () => 3, title: "Smoker", fixedSize: 3, special: "furnace" },

    // Special workstations
    ANVIL: { cols: 3, getRows: () => 1, title: "Anvil", fixedSize: 3, special: "anvil" },
    ENCHANTING: { cols: 2, getRows: () => 1, title: "Enchant", fixedSize: 2, special: "enchanting" },
    BREWING_STAND: { cols: 4, getRows: () => 1, title: "Brewing Stand", fixedSize: 5, special: "brewing" },
    GRINDSTONE: { cols: 2, getRows: () => 1, title: "Grindstone", fixedSize: 3, special: "grindstone", hasOutput: true },
    STONECUTTER: { cols: 2, getRows: () => 1, title: "Stonecutter", fixedSize: 2, special: "stonecutter" },
    CARTOGRAPHY: { cols: 2, getRows: () => 1, title: "Cartography", fixedSize: 3, special: "cartography", hasOutput: true },
    LOOM: { cols: 3, getRows: () => 1, title: "Loom", fixedSize: 4, special: "loom", hasOutput: true },
    SMITHING: { cols: 3, getRows: () => 1, title: "Smithing Table", fixedSize: 4, special: "smithing", hasOutput: true },
    MERCHANT: { cols: 3, getRows: () => 1, title: "Merchant", fixedSize: 3, special: "merchant" },
    BEACON: { cols: 1, getRows: () => 1, title: "Beacon", fixedSize: 1, special: "beacon" },
};

// Special layout renderers
const renderSpecialLayout = (type, config, getItemAtSlot, selectedSlot, onSlotClick, getSlotSize, simulationEnabled, placeholders, showMaterialTooltip) => {
    const slotClass = `${getSlotSize()} border-[#373737] bg-[#8B8B8B] hover:bg-[#8B8B8B]/80`;

    const commonProps = {
        simulationEnabled,
        placeholders,
        showMaterialTooltip, // Passed to all slots
    };

    switch (config.special) {
        case 'furnace':
            return (
                <div className="flex flex-col items-center gap-2 p-2">
                    {/* Input */}
                    <Slot index={0} item={getItemAtSlot(0)} isSelected={selectedSlot === 0} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    {/* Fuel indicator */}
                    <div className="w-10 h-3 bg-[#373737] rounded flex items-center justify-center">
                        <div className="text-[8px] text-orange-400">🔥</div>
                    </div>
                    {/* Fuel */}
                    <Slot index={1} item={getItemAtSlot(1)} isSelected={selectedSlot === 1} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    {/* Arrow */}
                    <div className="text-[#555555] text-xl">→</div>
                    {/* Output */}
                    <Slot index={2} item={getItemAtSlot(2)} isSelected={selectedSlot === 2} onClick={onSlotClick} className={`${slotClass} ring-2 ring-yellow-600/50`} {...commonProps} />
                </div>
            );

        case 'crafting':
            return (
                <div className="flex items-center gap-4">
                    {/* 3x3 Grid */}
                    <div className="grid grid-cols-3 gap-1">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <Slot key={i} index={i} item={getItemAtSlot(i)} isSelected={selectedSlot === i} onClick={onSlotClick} className={slotClass} {...commonProps} />
                        ))}
                    </div>
                    {/* Arrow */}
                    <div className="text-[#555555] text-2xl">→</div>
                    {/* Output */}
                    <Slot index={9} item={getItemAtSlot(9)} isSelected={selectedSlot === 9} onClick={onSlotClick} className={`w-14 h-14 border-[#373737] bg-[#8B8B8B] ring-2 ring-yellow-600/50`} {...commonProps} />
                </div>
            );

        case 'anvil':
            return (
                <div className="flex items-center gap-3 p-2">
                    <Slot index={0} item={getItemAtSlot(0)} isSelected={selectedSlot === 0} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    <div className="text-[#555555] text-xl">+</div>
                    <Slot index={1} item={getItemAtSlot(1)} isSelected={selectedSlot === 1} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    <div className="text-[#555555] text-xl">→</div>
                    <Slot index={2} item={getItemAtSlot(2)} isSelected={selectedSlot === 2} onClick={onSlotClick} className={`${slotClass} ring-2 ring-yellow-600/50`} {...commonProps} />
                </div>
            );

        case 'brewing':
            return (
                <div className="flex flex-col items-center gap-2 p-2">
                    {/* Ingredient */}
                    <Slot index={0} item={getItemAtSlot(0)} isSelected={selectedSlot === 0} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    {/* Indicator */}
                    <div className="w-1 h-4 bg-[#555555]"></div>
                    {/* Bottles row */}
                    <div className="flex gap-1">
                        <Slot index={1} item={getItemAtSlot(1)} isSelected={selectedSlot === 1} onClick={onSlotClick} className={slotClass} {...commonProps} />
                        <Slot index={2} item={getItemAtSlot(2)} isSelected={selectedSlot === 2} onClick={onSlotClick} className={slotClass} {...commonProps} />
                        <Slot index={3} item={getItemAtSlot(3)} isSelected={selectedSlot === 3} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    </div>
                    {/* Blaze powder slot */}
                    <Slot index={4} item={getItemAtSlot(4)} isSelected={selectedSlot === 4} onClick={onSlotClick} className={`${slotClass} opacity-80`} {...commonProps} />
                </div>
            );

        case 'enchanting':
            return (
                <div className="flex items-center gap-3 p-3">
                    <Slot index={0} item={getItemAtSlot(0)} isSelected={selectedSlot === 0} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    <Slot index={1} item={getItemAtSlot(1)} isSelected={selectedSlot === 1} onClick={onSlotClick} className={`${slotClass} opacity-70`} {...commonProps} />
                    <div className="text-2xl">✨</div>
                </div>
            );

        case 'grindstone':
        case 'cartography':
        case 'smithing':
            return (
                <div className="flex items-center gap-2 p-2">
                    <Slot index={0} item={getItemAtSlot(0)} isSelected={selectedSlot === 0} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    <div className="text-[#555555]">+</div>
                    <Slot index={1} item={getItemAtSlot(1)} isSelected={selectedSlot === 1} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    {config.special === 'smithing' && (
                        <>
                            <div className="text-[#555555]">+</div>
                            <Slot index={2} item={getItemAtSlot(2)} isSelected={selectedSlot === 2} onClick={onSlotClick} className={slotClass} {...commonProps} />
                        </>
                    )}
                    <div className="text-[#555555] text-xl">→</div>
                    <Slot index={config.special === 'smithing' ? 3 : 2} item={getItemAtSlot(config.special === 'smithing' ? 3 : 2)} isSelected={selectedSlot === (config.special === 'smithing' ? 3 : 2)} onClick={onSlotClick} className={`${slotClass} ring-2 ring-yellow-600/50`} {...commonProps} />
                </div>
            );

        case 'loom':
            return (
                <div className="flex items-center gap-2 p-2">
                    <Slot index={0} item={getItemAtSlot(0)} isSelected={selectedSlot === 0} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    <Slot index={1} item={getItemAtSlot(1)} isSelected={selectedSlot === 1} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    <Slot index={2} item={getItemAtSlot(2)} isSelected={selectedSlot === 2} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    <div className="text-[#555555] text-xl">→</div>
                    <Slot index={3} item={getItemAtSlot(3)} isSelected={selectedSlot === 3} onClick={onSlotClick} className={`${slotClass} ring-2 ring-yellow-600/50`} {...commonProps} />
                </div>
            );

        case 'stonecutter':
            return (
                <div className="flex items-center gap-4 p-3">
                    <Slot index={0} item={getItemAtSlot(0)} isSelected={selectedSlot === 0} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    <div className="text-2xl">🪨</div>
                    <Slot index={1} item={getItemAtSlot(1)} isSelected={selectedSlot === 1} onClick={onSlotClick} className={`${slotClass} ring-2 ring-yellow-600/50`} {...commonProps} />
                </div>
            );

        case 'merchant':
            return (
                <div className="flex items-center gap-2 p-2">
                    <Slot index={0} item={getItemAtSlot(0)} isSelected={selectedSlot === 0} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    <Slot index={1} item={getItemAtSlot(1)} isSelected={selectedSlot === 1} onClick={onSlotClick} className={slotClass} {...commonProps} />
                    <div className="text-[#555555] text-xl">⇄</div>
                    <Slot index={2} item={getItemAtSlot(2)} isSelected={selectedSlot === 2} onClick={onSlotClick} className={`${slotClass} ring-2 ring-yellow-600/50`} {...commonProps} />
                </div>
            );

        case 'beacon':
            return (
                <div className="flex flex-col items-center gap-2 p-4">
                    <div className="text-3xl mb-2">💎</div>
                    <Slot index={0} item={getItemAtSlot(0)} isSelected={selectedSlot === 0} onClick={onSlotClick} className={`${slotClass} ring-2 ring-cyan-500/50`} {...commonProps} />
                </div>
            );

        case 'hopper':
            return (
                <div className="flex flex-col items-center">
                    <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Slot key={i} index={i} item={getItemAtSlot(i)} isSelected={selectedSlot === i} onClick={onSlotClick} className={slotClass} {...commonProps} />
                        ))}
                    </div>
                    {/* Hopper funnel decoration */}
                    <div className="w-8 h-4 bg-[#555555] rounded-b-lg mt-1" />
                </div>
            );

        default:
            return null;
    }
};

const InventoryGrid = ({
    items = [],
    selectedSlot,
    onSlotClick,
    rows = 6,
    cols = 9,
    title = "Chest",
    type = "CHEST",
    lang = "en",
    simulationEnabled = false,
    placeholders = [],
    showMaterialTooltip
}) => {
    const config = GUI_CONFIGS[type] || GUI_CONFIGS.CHEST;

    const actualCols = config.cols;
    const actualRows = config.fixedSize ? config.getRows() : config.getRows(rows * 9);
    const totalSlots = config.fixedSize || (actualRows * actualCols);

    const getItemAtSlot = (slotIndex) => {
        return items.find(item => item.slot === slotIndex || (item.slots && item.slots.includes(slotIndex)));
    };

    const getSlotSize = () => {
        if (config.special) return 'w-12 h-12 md:w-14 md:h-14';
        if (type === 'HOPPER') return 'w-12 h-12 md:w-14 md:h-14';
        if (type === 'DISPENSER' || type === 'DROPPER') return 'w-14 h-14 md:w-16 md:h-16';
        return 'w-10 h-10 md:w-12 md:h-12';
    };

    const getContainerClass = () => {
        if (type === 'HOPPER') return 'min-w-[320px]';
        if (type === 'DISPENSER' || type === 'DROPPER') return 'min-w-[220px]';
        if (config.special === 'crafting') return 'min-w-[300px]';
        return '';
    };

    const infoText = lang === 'tr' ? 'Düzenlemek için slota tıklayın' : 'Click slot to edit';

    // Helper to render slot with passed props
    const renderSlot = (index) => (
        <Slot
            key={index}
            index={index}
            item={getItemAtSlot(index)}
            isSelected={selectedSlot === index}
            onClick={onSlotClick}
            className={`${getSlotSize()} border-[#373737] bg-[#8B8B8B] hover:bg-[#8B8B8B]/80`}
            simulationEnabled={simulationEnabled}
            placeholders={placeholders}
            showMaterialTooltip={showMaterialTooltip}
        />
    );

    return (
        <div className="flex flex-col items-center justify-center p-4 relative">
            {/* Minecraft GUI Container */}
            <div className={`bg-[#C6C6C6] p-2 rounded-sm border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#555555] shadow-2xl relative ${getContainerClass()}`}>
                {/* Title */}
                <div className="font-minecraft text-[#404040] mb-1 ml-1 text-lg drop-shadow-sm h-6 flex items-center">
                    {parseMinecraftColors(title?.trim() ? title : config.title)}
                </div>

                {/* Content */}
                {config.special ? (
                    renderSpecialLayout(type, config, getItemAtSlot, selectedSlot, onSlotClick, getSlotSize, simulationEnabled, placeholders, showMaterialTooltip)
                ) : (
                    <div
                        className="grid gap-1 px-1"
                        style={{ gridTemplateColumns: `repeat(${actualCols}, minmax(0, 1fr))` }}
                    >
                        {Array.from({ length: totalSlots }).map((_, index) => renderSlot(index))}
                    </div>
                )}
            </div>

            <div className="text-sm text-textMuted mt-4 font-minecraft opacity-50 text-white drop-shadow-md">
                {config.title} • {totalSlots} slots • {infoText}
            </div>
        </div>
    );
};

export default InventoryGrid;
