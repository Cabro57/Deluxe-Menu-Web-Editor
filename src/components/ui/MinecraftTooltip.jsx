import { cn } from '../../utils/cn';
import { parseMinecraftColors } from '../../utils/colorParser';
import { processPlaceholders } from '../../utils/placeholderUtils';

const MinecraftTooltip = ({ item, simulationEnabled, placeholders, showId = true, className, style }) => {
    if (!item) return null;

    const process = (text) => processPlaceholders(text, placeholders, simulationEnabled);

    const getDisplayName = (m) => {
        if (!m) return "";
        if (m.startsWith("head-")) return "Player Head";
        if (m.startsWith("basehead-")) return "Custom Head";
        if (m.startsWith("texture-")) return "Custom Head";
        if (m.startsWith("hdb-")) return "Head Database";
        return m;
    };

    const displayName = process(item.displayName || getDisplayName(item.material));
    const lore = item.lore ? item.lore.map(line => process(line)) : [];

    return (
        <div
            style={style}
            className={cn(
                "absolute z-[100] pointer-events-none w-max max-w-[300px] overflow-y-auto bg-[#0F0F0F] border-[2px] border-[#300060] rounded text-white p-3 shadow-2xl -translate-y-full -translate-x-1/2 left-1/2 top-[-10px]",
                className
            )}>
            {/* Header / Name */}
            <div className="font-minecraft text-lg mb-1 shadow-black drop-shadow-sm">
                {parseMinecraftColors(displayName)}
            </div>

            {/* Lore */}
            {lore && lore.length > 0 && (
                <div className="font-minecraft text-base space-y-0.5">
                    {lore.map((line, idx) => (
                        <div key={idx} className="opacity-90 shadow-black drop-shadow-sm">
                            {parseMinecraftColors(line)}
                        </div>
                    ))}
                </div>
            )}

            {/* Minecraft ID (Debug/Extra) */}
            {showId && (
                <div className="mt-2 text-xs text-gray-500 font-mono">
                    {item.material}
                </div>
            )}
        </div>
    );
};


export default MinecraftTooltip;
