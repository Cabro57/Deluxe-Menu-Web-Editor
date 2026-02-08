import React, { useState, useEffect } from "react";
import { getTextureUrl, getHeadUrl } from "../../data/materials";
import { cn } from "../../utils/cn";
import { Package } from "lucide-react";
import { isBlockMaterial, initBlocksData } from "../../services/minecraftDataService";

/**
 * Smart Item Icon that supports both 2D textures and 3D isometric blocks
 */
const ItemIcon = ({ material, amount, modelData, className, use3D = false }) => {
    const [currentSrc, setCurrentSrc] = useState(null);
    const [hasError, setHasError] = useState(false);
    const [triedBlockFallback, setTriedBlockFallback] = useState(false);
    const [blocksReady, setBlocksReady] = useState(false);

    // Initialize blocks data on mount
    useEffect(() => {
        initBlocksData().then(() => setBlocksReady(true));
    }, []);

    useEffect(() => {
        // Priority check for heads
        const headUrl = getHeadUrl(material);
        if (headUrl) {
            setCurrentSrc(headUrl);
            setHasError(false);
            setTriedBlockFallback(true);
            return;
        }

        const url = getTextureUrl(material);
        setCurrentSrc(url);
        setHasError(false);
        setTriedBlockFallback(false);
    }, [material]);

    const handleError = () => {
        if (hasError) return;

        // Fallback from items to blocks folder (PrismarineJS format)
        if (!triedBlockFallback && currentSrc && currentSrc.includes('/items/')) {
            const newSrc = currentSrc.replace('/items/', '/blocks/');
            setCurrentSrc(newSrc);
            setTriedBlockFallback(true);
        } else {
            setHasError(true);
        }
    };

    if (!material) return null;

    // Check if this material is a block (use cached data)
    const isBlock = blocksReady && isBlockMaterial(material);
    const shouldRender3D = use3D && isBlock && !hasError && currentSrc;

    // 3D Isometric Block Rendering
    if (shouldRender3D) {
        return (
            <div className={cn("relative w-full h-full", className)} style={{ perspective: "100px" }}>
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                        transformStyle: "preserve-3d",
                    }}
                >
                    <div
                        style={{
                            width: "85%",
                            height: "85%",
                            position: "relative",
                            transformStyle: "preserve-3d",
                            transform: "rotateX(20deg) rotateY(-30deg)",
                        }}
                    >
                        {/* Top face */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `url(${currentSrc})`,
                                backgroundSize: "cover",
                                imageRendering: "pixelated",
                                transform: "translateZ(3px)",
                                filter: "brightness(1.15)",
                                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
                            }}
                        />
                        {/* Right shadow edge */}
                        <div
                            className="absolute top-0 right-0 h-full"
                            style={{
                                width: "5px",
                                backgroundImage: `url(${currentSrc})`,
                                backgroundSize: "cover",
                                backgroundPosition: "right",
                                imageRendering: "pixelated",
                                transform: "rotateY(90deg) translateZ(3px)",
                                transformOrigin: "right",
                                filter: "brightness(0.55)",
                            }}
                        />
                        {/* Bottom shadow edge */}
                        <div
                            className="absolute bottom-0 left-0 w-full"
                            style={{
                                height: "5px",
                                backgroundImage: `url(${currentSrc})`,
                                backgroundSize: "cover",
                                backgroundPosition: "bottom",
                                imageRendering: "pixelated",
                                transform: "rotateX(-90deg) translateZ(3px)",
                                transformOrigin: "bottom",
                                filter: "brightness(0.45)",
                            }}
                        />
                    </div>
                </div>

                <img
                    src={currentSrc}
                    alt=""
                    className="hidden"
                    onError={handleError}
                />

                {amount > 1 && (
                    <span className="absolute bottom-0 right-0 text-[10px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] leading-none px-0.5">
                        {amount}
                    </span>
                )}
            </div>
        );
    }

    // Standard 2D rendering
    const pluginInfo = getPluginInfo(material);

    return (
        <div className={cn("relative w-full h-full flex items-center justify-center", className)}>
            {!hasError && currentSrc ? (
                <img
                    src={currentSrc}
                    alt={material}
                    className="w-full h-full object-contain pixelated rendering-pixelated"
                    onError={handleError}
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-full bg-surfaceHighlight flex items-center justify-center text-textMuted/20 border border-border/20">
                    <span className="text-xs font-bold text-textMuted/50 uppercase">{material.slice(0, 2)}</span>
                </div>
            )}

            {/* Plugin Badge */}
            {pluginInfo && (
                <PluginBadge info={pluginInfo} />
            )}

            {amount > 1 && (
                <span className="absolute bottom-0 right-0 text-[10px] mobile:text-[10px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] leading-none px-0.5">
                    {amount}
                </span>
            )}
        </div>
    );
};

// Sub-component for Badge to handle image error state independently
const PluginBadge = ({ info }) => {
    const [imgError, setImgError] = useState(false);

    if (info.icon && !imgError) {
        return (
            <img
                src={info.icon}
                alt={info.label}
                className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-sm shadow-sm z-10 bg-[#1a1a1a]"
                title={info.title}
                onError={() => setImgError(true)}
            />
        );
    }

    return (
        <span
            className={cn(
                "absolute -top-1 -left-1 text-[8px] font-bold text-white px-1 py-0.5 rounded shadow-sm z-10 scale-[0.8] origin-top-left",
                info.color
            )}
            title={info.title}
        >
            {info.label}
        </span>
    );
};

// Helper: Get plugin info from material string
const getPluginInfo = (material) => {
    if (!material) return null;
    const m = material.toLowerCase();

    // Using widely available icons from SpigotMC/Modrinth as standard
    if (m.startsWith('itemsadder-')) return { label: 'IA', color: 'bg-blue-600', title: 'ItemsAdder', icon: 'https://www.spigotmc.org/data/resource_icons/73/73355.jpg' };
    if (m.startsWith('oraxen-')) return { label: 'OX', color: 'bg-purple-600', title: 'Oraxen', icon: 'https://www.spigotmc.org/data/resource_icons/72/72448.jpg' };
    if (m.startsWith('hdb-')) return { label: 'HDB', color: 'bg-amber-700', title: 'HeadDatabase', icon: 'https://www.spigotmc.org/data/resource_icons/14/14280.jpg' };
    if (m.startsWith('nexo-')) return { label: 'NX', color: 'bg-indigo-500', title: 'Nexo', icon: 'https://cdn.modrinth.com/data/MfZblfxl/f1e5e81afd29f88b6acc1bc0b914ca5f3fb78bef_96.webp' };
    if (m.startsWith('mmoitems-')) return { label: 'MMO', color: 'bg-slate-600', title: 'MMOItems', icon: 'https://www.spigotmc.org/data/resource_icons/39/39267.jpg' };
    if (m.startsWith('executableitems-')) return { label: 'EI', color: 'bg-red-600', title: 'ExecutableItems', icon: 'https://www.spigotmc.org/data/resource_icons/77/77578.jpg' };
    if (m.startsWith('executableblocks-')) return { label: 'EB', color: 'bg-orange-600', title: 'ExecutableBlocks', icon: 'https://www.spigotmc.org/data/resource_icons/93/93455.jpg' };
    if (m.startsWith('placeholder-')) return { label: 'PH', color: 'bg-cyan-600', title: 'Placeholder', icon: 'https://www.spigotmc.org/data/resource_icons/6/6245.jpg' };

    if (m.startsWith('head-')) return { label: 'P', color: 'bg-emerald-600', title: 'Player Head' };
    if (m.startsWith('basehead-')) return { label: 'BH', color: 'bg-slate-600', title: 'BaseHead' };
    if (m.startsWith('texture-')) return { label: 'TX', color: 'bg-slate-600', title: 'Texture' };
    if (m.startsWith('model-')) return { label: 'ME', color: 'bg-yellow-600', title: 'ModelEngine' };

    return null;
};

export default ItemIcon;
