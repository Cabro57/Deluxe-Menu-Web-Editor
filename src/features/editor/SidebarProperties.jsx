import React, { useState, useEffect, useRef } from "react";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import { Search, Trash2, ArrowLeft, ChevronDown, Check, Plus, Package, Sparkles, Type, AlignLeft, Hash, Layers, MousePointer, Eye, X, GripVertical, Terminal, Shield, Keyboard, Activity, Zap, Lock, Grid3X3, User, Puzzle } from "lucide-react";
import InfoTooltip from "../../components/ui/InfoTooltip";
import { searchMaterials } from "../../data/materials";
import { ENCHANTMENTS } from "../../data/enchantments";
import ItemIcon from "../../components/ui/ItemIcon";
import { cn } from "../../utils/cn";
import { formatSlots } from "../../utils/yamlHelper";
import { getMinecraftItems } from "../../services/minecraftDataService";
import RequirementsEditor from "../../components/editor/RequirementsEditor";



const SlotPicker = ({ currentSlots, maxSlots, onToggle, onClose }) => {
    // Determine rows based on maxSlots (always 9 cols). Ensure at least 1 row.
    const rows = Math.max(1, Math.ceil(maxSlots / 9));
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartMode, setDragStartMode] = useState(null); // true = selecting, false = deselecting

    const handleMouseDown = (index) => {
        setIsDragging(true);
        const willSelect = !currentSlots.includes(index);
        setDragStartMode(willSelect);
        onToggle(index, willSelect);
    };

    const handleMouseEnter = (index) => {
        if (isDragging) {
            // Only toggle if the current state differs from the desired state
            const isSelected = currentSlots.includes(index);
            if (isSelected !== dragStartMode) {
                onToggle(index, dragStartMode);
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragStartMode(null);
    };

    // Global mouse up to catch releases outside the grid
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                setDragStartMode(null);
            }
        };
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isDragging]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-surface/95 backdrop-blur">
                    <h3 className="font-semibold text-lg text-text">Select Slots</h3>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full hover:bg-white/10"><X className="w-4 h-4" /></Button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#1e1e1e]">
                    <div
                        className="grid grid-cols-9 gap-2 mx-auto"
                        style={{ width: 'fit-content' }}
                        onMouseLeave={handleMouseUp}
                    >
                        {Array.from({ length: maxSlots }).map((_, i) => {
                            const isSelected = currentSlots.includes(i);
                            return (
                                <button
                                    key={i}
                                    onMouseDown={() => handleMouseDown(i)}
                                    onMouseEnter={() => handleMouseEnter(i)}
                                    className={cn(
                                        "w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-all duration-75 border",
                                        isSelected
                                            ? "bg-primary text-white border-primary shadow-[0_0_8px_rgba(var(--primary),0.4)] scale-105 z-10"
                                            : "bg-[#2a2a2a] border-white/5 text-textMuted/50 hover:bg-white/10 hover:border-white/20 hover:text-textMuted"
                                    )}
                                >
                                    {i}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 border-t border-white/10 bg-surface/95 backdrop-blur flex justify-between items-center">
                    <span className="text-xs text-textMuted">
                        {currentSlots.length} slots selected
                    </span>
                    <Button onClick={onClose} className="bg-primary text-white hover:bg-primary/90">Done</Button>
                </div>
            </div>
        </div>
    );
};

// Material format categories for DeluxeMenus
const MATERIAL_TYPES = {
    vanilla: { label: "Vanilla", prefix: "", placeholder: "STONE", icon: null },
    head: { label: "Player Head", prefix: "head-", placeholder: "Notch", icon: null },
    basehead: { label: "Base64 Head", prefix: "basehead-", placeholder: "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dH...", icon: null },
    texture: { label: "Texture URL", prefix: "texture-", placeholder: "abc123...", icon: null },
    hdb: { label: "HeadDatabase", prefix: "hdb-", placeholder: "12345", icon: "https://www.spigotmc.org/data/resource_icons/14/14280.jpg" },
    itemsadder: { label: "ItemsAdder", prefix: "itemsadder-", placeholder: "namespace:item_id", icon: "https://www.spigotmc.org/data/resource_icons/73/73355.jpg" },
    oraxen: { label: "Oraxen", prefix: "oraxen-", placeholder: "item_id", icon: "https://www.spigotmc.org/data/resource_icons/72/72448.jpg" },
    nexo: { label: "Nexo", prefix: "nexo-", placeholder: "item_id", icon: "https://cdn.modrinth.com/data/MfZblfxl/f1e5e81afd29f88b6acc1bc0b914ca5f3fb78bef_96.webp" },
    mmoitems: { label: "MMOItems", prefix: "mmoitems-", placeholder: "SWORD:FIRE_SWORD", icon: "https://www.spigotmc.org/data/resource_icons/39/39267.jpg" },
    executableitems: { label: "ExecutableItems", prefix: "executableitems-", placeholder: "item_id", icon: "https://www.spigotmc.org/data/resource_icons/77/77578.jpg" },
    executableblocks: { label: "ExecutableBlocks", prefix: "executableblocks-", placeholder: "item_id", icon: "https://www.spigotmc.org/data/resource_icons/93/93455.jpg" },
    simpleitemgenerator: { label: "SimpleItemGenerator", prefix: "simpleitemgenerator-", placeholder: "item_id", icon: null },
    placeholder: { label: "Placeholder", prefix: "placeholder-", placeholder: "%player_item_in_hand%", icon: "https://www.spigotmc.org/data/resource_icons/6/6245.jpg" },
    equipment: { label: "Equipment Slot", prefix: "", placeholder: "main_hand", icon: null },
};

const EQUIPMENT_SLOTS = ["main_hand", "off_hand", "armor_helmet", "armor_chestplate", "armor_leggings", "armor_boots"];
const SPECIAL_MATERIALS = ["air", "water_bottle"];

// Detect material type from current value
const detectMaterialType = (material) => {
    if (!material) return "vanilla";
    const lower = material.toLowerCase();

    if (lower.startsWith("head-")) return "head";
    if (lower.startsWith("basehead-")) return "basehead";
    if (lower.startsWith("texture-")) return "texture";
    if (lower.startsWith("hdb-")) return "hdb";
    if (lower.startsWith("itemsadder-")) return "itemsadder";
    if (lower.startsWith("oraxen-")) return "oraxen";
    if (lower.startsWith("nexo-")) return "nexo";
    if (lower.startsWith("mmoitems-")) return "mmoitems";
    if (lower.startsWith("executableitems-")) return "executableitems";
    if (lower.startsWith("executableblocks-")) return "executableblocks";
    if (lower.startsWith("simpleitemgenerator-")) return "simpleitemgenerator";
    if (lower.startsWith("placeholder-")) return "placeholder";
    if (EQUIPMENT_SLOTS.includes(lower)) return "equipment";

    return "vanilla";
};

// Extract value without prefix
const extractMaterialValue = (material, type) => {
    if (!material) return "";
    const prefix = MATERIAL_TYPES[type]?.prefix || "";
    if (prefix && material.toLowerCase().startsWith(prefix.toLowerCase())) {
        return material.slice(prefix.length);
    }
    return material;
};

const formatMaterialDisplay = (material) => {
    if (!material) return "Select Material...";

    // Head types
    if (material.startsWith("basehead-")) return "Base64 Head";
    if (material.startsWith("texture-")) return "Texture Head";
    if (material.startsWith("head-")) return `Player Head: ${material.substring(5)}`;
    if (material.startsWith("hdb-")) return `HeadDB: ${material.substring(4)}`;

    // Plugin types
    if (material.startsWith("itemsadder-")) return `ItemsAdder: ${material.substring(11)}`;
    if (material.startsWith("oraxen-")) return `Oraxen: ${material.substring(7)}`;
    if (material.startsWith("nexo-")) return `Nexo: ${material.substring(5)}`;
    if (material.startsWith("mmoitems-")) return `MMOItems: ${material.substring(9)}`;
    if (material.startsWith("executableitems-")) return `ExecItems: ${material.substring(16)}`;
    if (material.startsWith("executableblocks-")) return `ExecBlocks: ${material.substring(17)}`;
    if (material.startsWith("simpleitemgenerator-")) return `SIG: ${material.substring(20)}`;
    if (material.startsWith("placeholder-")) return `Placeholder: ${material.substring(12)}`;

    return material;
};

const MaterialPicker = ({ currentMaterial, onSelect, version }) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("vanilla");
    const [headTab, setHeadTab] = useState("player");
    const [customValue, setCustomValue] = useState("");

    // Plugin types that should show in the "custom" (Plugins) tab
    const pluginTypes = ["itemsadder", "oraxen", "nexo", "mmoitems", "executableitems", "executableblocks", "simpleitemgenerator", "hdb"];
    const headTypes = ["head", "basehead", "texture"];

    // Initialize state from currentMaterial when modal opens
    useEffect(() => {
        if (isOpen && currentMaterial) {
            const detectedType = detectMaterialType(currentMaterial);
            const extractedValue = extractMaterialValue(currentMaterial, detectedType);

            // Determine which main tab to show
            if (pluginTypes.includes(detectedType)) {
                // Set activeTab directly to the plugin type (shows plugin input)
                setActiveTab(detectedType);
                setCustomValue(extractedValue);
            } else if (headTypes.includes(detectedType)) {
                setActiveTab("heads");
                // Set head sub-tab
                if (detectedType === "head") setHeadTab("player");
                else if (detectedType === "basehead") setHeadTab("base64");
                else if (detectedType === "texture") setHeadTab("texture");
                setCustomValue(extractedValue);
            } else if (detectedType === "equipment") {
                setActiveTab("equipment");
                setCustomValue(extractedValue);
            } else if (detectedType === "placeholder") {
                setActiveTab("placeholder");
                setCustomValue(extractedValue);
            } else {
                setActiveTab("vanilla");
                setCustomValue("");
            }
        }
    }, [isOpen, currentMaterial]);

    // Minecraft-heads API state
    // Minecraft-heads API state
    const [headCategories, setHeadCategories] = useState([
        { id: "all", name: "All Categories" },
        { id: "alphabet", name: "Alphabet" },
        { id: "animals", name: "Animals" },
        { id: "blocks", name: "Blocks" },
        { id: "decoration", name: "Decoration" },
        { id: "food-drinks", name: "Food & Drinks" },
        { id: "humans", name: "Humans" },
        { id: "humanoid", name: "Humanoid" },
        { id: "miscellaneous", name: "Miscellaneous" },
        { id: "monsters", name: "Monsters" },
        { id: "plants", name: "Plants" }
    ]);
    const [customHeads, setCustomHeads] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [headsLoading, setHeadsLoading] = useState(false);
    const [headsQuery, setHeadsQuery] = useState("");

    const MINECRAFT_HEADS_API_KEY = "nrxwkmyE0juOvXvLPugH28phdWH7rIM7KfaBMIfPvumuvtNOX+bdXuVfwoimLSSDtdmOPRaXODalsQgAdBcoUA==";

    // Fetch heads when category changes
    useEffect(() => {
        if (selectedCategory === null && headCategories.length > 0) return;

        const fetchHeads = async () => {
            if (!selectedCategory) return;
            setHeadsLoading(true);
            setCustomHeads([]); // Clear previous to show loading state specifically

            try {
                let allHeads = [];

                if (selectedCategory === "all") {
                    // Fetch all categories in parallel
                    // Skip "all" itself
                    const categoriesToFetch = headCategories.filter(c => c.id !== "all");
                    const promises = categoriesToFetch.map(cat =>
                        fetch(`/api/minecraft-heads/scripts/api.php?cat=${cat.id}&json=true`)
                            .then(res => res.ok ? res.text() : null)
                            .then(text => {
                                try {
                                    return text ? JSON.parse(text) : [];
                                } catch (e) {
                                    return [];
                                }
                            })
                            .catch(() => [])
                    );

                    const results = await Promise.all(promises);
                    // Flatten results
                    allHeads = results.flat();
                } else {
                    // Fetch single category
                    const res = await fetch(`/api/minecraft-heads/scripts/api.php?cat=${selectedCategory}&json=true`);
                    if (res.ok) {
                        const text = await res.text();
                        try {
                            const data = JSON.parse(text);
                            if (Array.isArray(data)) allHeads = data;
                        } catch (e) {
                            console.warn("Failed to parse", e);
                        }
                    }
                }

                // Map standard format
                setCustomHeads(allHeads.map(item => ({
                    n: item.name,
                    u: item.uuid,
                    v: item.value
                })));

            } catch (e) {
                console.error("Failed to fetch heads:", e);
                setCustomHeads([]);
            } finally {
                setHeadsLoading(false);
            }
        };

        fetchHeads();
    }, [selectedCategory]);

    // Auto-select first category when opening base64 tab
    useEffect(() => {
        if (activeTab === "heads" && headTab === "base64" && !selectedCategory && headCategories.length > 0) {
            setSelectedCategory(headCategories[0].id);
        }
    }, [activeTab, headTab, headCategories, selectedCategory]);

    // Vanilla items state
    const [vanillaItems, setVanillaItems] = useState([]);
    const [vanillaLoading, setVanillaLoading] = useState(false);

    // Fetch vanilla items when version changes
    useEffect(() => {
        if (activeTab === 'vanilla') {
            const fetchItems = async () => {
                setVanillaLoading(true);
                // Default to 1.20 if version is missing
                const items = await getMinecraftItems(version || "1.20");
                setVanillaItems(items);
                setVanillaLoading(false);
            };
            fetchItems();
        }
    }, [version, activeTab]);

    const filteredVanilla = vanillaItems
        .filter(item => item.name.includes(query.toUpperCase()))
        .slice(0, 50);

    // Limit displayed heads for performance
    const [displayLimit, setDisplayLimit] = useState(100);

    // Reset limit when query or category changes
    useEffect(() => {
        setDisplayLimit(100);
    }, [headsQuery, selectedCategory]);

    const filteredHeads = customHeads.filter(head =>
        head.n?.toLowerCase().includes(headsQuery.toLowerCase())
    );

    const displayedHeads = filteredHeads.slice(0, displayLimit);

    const handleCustomSubmit = () => {
        if (!customValue.trim()) return;
        const prefix = MATERIAL_TYPES[activeTab]?.prefix || "";
        const fullMaterial = prefix + customValue;
        onSelect(fullMaterial);
        setIsOpen(false);
    };

    const handleHeadSelect = (head) => {
        // Use base64 value if available, otherwise use texture URL
        const value = head.v || head.u;
        if (value) {
            // If it's a base64 value (starts with eyJ), use basehead prefix
            // Otherwise use texture prefix for texture URL
            const prefix = head.v ? "basehead-" : "texture-";
            onSelect(prefix + value);
            setIsOpen(false);
        }
    };

    const tabsRef = useRef(null);

    useEffect(() => {
        const el = tabsRef.current;
        if (el) {
            const onWheel = (e) => {
                if (e.deltaY === 0) return;
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            };
            el.addEventListener("wheel", onWheel, { passive: false });
            return () => el.removeEventListener("wheel", onWheel);
        }
    }, [isOpen]); // Re-attach when opened

    const tabs = [
        { id: "vanilla", label: "Vanilla", icon: Package },
        { id: "heads", label: "Heads", icon: User },
        { id: "custom", label: "Plugins", icon: Puzzle },
        { id: "equipment", label: "Equipment", icon: Shield },
        { id: "placeholder", label: "Placeholder", icon: Sparkles },
    ];


    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full h-12 px-4 rounded-xl text-sm text-left flex items-center justify-between gap-3",
                    "bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 text-text",
                    "hover:from-white/10 hover:to-white/5 hover:border-white/20",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                    "transition-all duration-200 group"
                )}
            >
                {currentMaterial ? (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-white/10 p-0.5 flex items-center justify-center flex-shrink-0">
                            <ItemIcon material={currentMaterial} />
                        </div>
                        <span className="font-medium truncate">{formatMaterialDisplay(currentMaterial)}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 text-textMuted">
                        <Package className="w-5 h-5" />
                        <span>Select Material...</span>
                    </div>
                )}
                <ChevronDown className={cn(
                    "w-4 h-4 text-textMuted transition-transform duration-200 flex-shrink-0 group-hover:text-text",
                    isOpen && "rotate-180"
                )} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute z-50 top-full mt-2 w-full bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden" style={{ maxHeight: "420px" }}>
                        {/* Tabs - visible scrollbar with mouse wheel support */}
                        <div ref={tabsRef} className="flex border-b border-white/10 bg-white/5 overflow-x-auto custom-scrollbar">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setQuery("");
                                        setCustomValue("");
                                        setHeadsQuery("");
                                        if (tab.id === "heads" && headCategories.length > 0 && selectedCategory === null) {
                                            setSelectedCategory(headCategories[0]?.id || null);
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all whitespace-nowrap flex-shrink-0",
                                        activeTab === tab.id
                                            ? "text-primary border-b-2 border-primary bg-primary/10"
                                            : "text-textMuted hover:text-text hover:bg-white/5"
                                    )}
                                >
                                    <tab.icon className="w-3.5 h-3.5" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar" style={{ maxHeight: "360px" }}>
                            {/* Vanilla Tab */}
                            {activeTab === "vanilla" && (
                                <>
                                    <div className="relative mb-2">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-textMuted" />
                                        <Input
                                            placeholder="Search materials..."
                                            className="pl-9 h-10 bg-white/5"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                                        {vanillaLoading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        ) : (
                                            filteredVanilla.map(item => (
                                                <button
                                                    key={item.name}
                                                    type="button"
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all",
                                                        item.name === currentMaterial
                                                            ? "bg-primary/20 text-primary"
                                                            : "text-text hover:bg-white/10"
                                                    )}
                                                    onClick={() => {
                                                        onSelect(item.name);
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    <div className="w-6 h-6 rounded bg-white/10 p-0.5 flex items-center justify-center">
                                                        <ItemIcon material={item.name} use3D={true} />
                                                    </div>
                                                    <span className="truncate flex-1">{item.name}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Heads Tab with Sub-navigation */}
                            {activeTab === "heads" && (
                                <div className="space-y-3">
                                    {/* Sub-tabs for head types */}
                                    <div className="flex gap-1 flex-wrap border-b border-white/5 pb-2">
                                        {[
                                            { id: "player", label: "Player" },
                                            { id: "base64", label: "Base64" },
                                            { id: "texture", label: "Texture" },
                                            { id: "placeholder", label: "Placeholder" }
                                        ].map(sub => (
                                            <button
                                                key={sub.id}
                                                onClick={() => setHeadTab(sub.id)}
                                                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                                    headTab === sub.id
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                        : "bg-white/5 text-textMuted hover:bg-white/10 hover:text-text"
                                                )}
                                            >
                                                {sub.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Player Head Input */}
                                    {headTab === "player" && (
                                        <div className="space-y-3 pt-2">
                                            <div className="space-y-2">
                                                <Label className="text-xs text-textMuted">Player Name</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="e.g. Notch"
                                                        className="h-10 bg-white/5 border-white/10 text-sm"
                                                        value={customValue}
                                                        onChange={(e) => setCustomValue(e.target.value)}
                                                    />
                                                    <Button onClick={() => { onSelect("head-" + customValue); setIsOpen(false); }}>
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>
                                            {customValue && (
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                                    <img src={`https://minotar.net/avatar/${customValue}/32.png`} alt="Preview" className="w-8 h-8 rounded" onError={(e) => e.target.style.display = 'none'} />
                                                    <span className="text-xs text-textMuted">Preview for {customValue}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Base64 Input & Catalog */}
                                    {headTab === "base64" && (
                                        <div className="space-y-4 pt-2">
                                            {/* Custom Base64 Input */}
                                            <div className="space-y-2">
                                                <Label className="text-xs text-textMuted">Custom Base64 Value</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="eyJ0ZX..."
                                                        className="h-9 bg-white/5 border-white/10 text-xs font-mono flex-1"
                                                        value={customValue}
                                                        onChange={(e) => setCustomValue(e.target.value)}
                                                    />
                                                    <Button onClick={() => { onSelect("basehead-" + customValue); setIsOpen(false); }}>
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="w-full h-px bg-white/10" />

                                            {/* Catalog Browser */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs text-textMuted">Browse Catalog</Label>
                                                    {headsLoading && <span className="text-[10px] text-primary animate-pulse">Loading...</span>}
                                                </div>

                                                <div className="flex gap-2">
                                                    <select
                                                        className="h-9 flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg text-xs px-2 text-text focus:border-primary/50 outline-none dropdown-global cursor-pointer"
                                                        value={selectedCategory || ""}
                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                        style={{ backgroundColor: '#121212' }}
                                                    >
                                                        {headCategories.map(cat => (
                                                            <option key={cat.id} value={cat.id} className="bg-[#121212] text-white py-2">{cat.name}</option>
                                                        ))}
                                                    </select>
                                                    <div className="relative flex-1">
                                                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-textMuted" />
                                                        <Input
                                                            placeholder="Search..."
                                                            className="pl-8 h-9 bg-white/5 text-xs"
                                                            value={headsQuery}
                                                            onChange={(e) => setHeadsQuery(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-4 gap-1.5 h-64 overflow-y-auto custom-scrollbar bg-black/20 p-2 rounded-lg border border-white/5">
                                                    {headsLoading ? (
                                                        <div className="col-span-4 flex items-center justify-center h-full">
                                                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                        </div>
                                                    ) : displayedHeads.length > 0 ? (
                                                        <>
                                                            {displayedHeads.map((head, idx) => {
                                                                // Extract texture hash from base64 value
                                                                let imageUrl = head.u;
                                                                try {
                                                                    if (head.v) {
                                                                        const decoded = JSON.parse(atob(head.v));
                                                                        const url = decoded?.textures?.SKIN?.url;
                                                                        if (url) imageUrl = url.split('/').pop();
                                                                    }
                                                                } catch (e) {
                                                                    // Fallback to UUID
                                                                }

                                                                return (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => handleHeadSelect(head)}
                                                                        className="aspect-square rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-1 group relative p-1"
                                                                        title={head.n}
                                                                    >
                                                                        <img
                                                                            src={`https://mc-heads.net/head/${imageUrl}`}
                                                                            alt={head.n}
                                                                            className="w-full h-full object-contain pixelated"
                                                                            loading="lazy"
                                                                        />
                                                                    </button>
                                                                );
                                                            })}

                                                            {/* Load More Button */}
                                                            {filteredHeads.length > displayedHeads.length && (
                                                                <div className="col-span-4 pt-2 pb-1 flex justify-center">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        className="text-xs w-full h-8 bg-white/5 hover:bg-white/10 text-textMuted hover:text-text"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setDisplayLimit(prev => prev + 100);
                                                                        }}
                                                                    >
                                                                        Load More ({filteredHeads.length - displayedHeads.length} remaining)
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="col-span-4 flex items-center justify-center h-full text-textMuted text-xs">
                                                            No heads found
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Texture Input */}
                                    {headTab === "texture" && (
                                        <div className="space-y-3 pt-2">
                                            <div className="space-y-2">
                                                <Label className="text-xs text-textMuted">Texture URL / ID</Label>
                                                <Input
                                                    placeholder="e.g. 8d3..."
                                                    className="h-10 bg-white/5 border-white/10 text-xs font-mono"
                                                    value={customValue}
                                                    onChange={(e) => setCustomValue(e.target.value)}
                                                />
                                            </div>
                                            <Button className="w-full" onClick={() => { onSelect("texture-" + customValue); setIsOpen(false); }}>
                                                Apply Texture Head
                                            </Button>
                                        </div>
                                    )}

                                    {/* HDB Input */}
                                    {headTab === "hdb" && (
                                        <div className="space-y-3 pt-2">
                                            <div className="space-y-2">
                                                <Label className="text-xs text-textMuted">Head ID</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="number"
                                                        placeholder="e.g. 100"
                                                        className="h-10 bg-white/5 border-white/10 text-sm"
                                                        value={customValue}
                                                        onChange={(e) => setCustomValue(e.target.value)}
                                                    />
                                                    <Button onClick={() => { onSelect("hdb-" + customValue); setIsOpen(false); }}>
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Placeholder Head Input */}
                                    {headTab === "placeholder" && (
                                        <div className="space-y-3 pt-2">
                                            <div className="space-y-2">
                                                <Label className="text-xs text-textMuted">Placeholder Value</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="e.g. %player_name%"
                                                        className="h-10 bg-white/5 border-white/10 text-sm font-mono"
                                                        value={customValue}
                                                        onChange={(e) => setCustomValue(e.target.value)}
                                                    />
                                                    <Button onClick={() => { onSelect("head-" + customValue); setIsOpen(false); }}>
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-textMuted/60">
                                                Format: <span className="font-mono text-primary">head-%player_name%</span> or <span className="font-mono text-primary">basehead-%placeholder%</span>
                                            </p>
                                            <p className="text-[10px] text-textMuted/60">
                                                Supports any PlaceholderAPI placeholder that returns a player name or base64 texture value.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}





                            {/* Custom Plugins Tab */}
                            {activeTab === "custom" && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        {["itemsadder", "oraxen", "nexo", "mmoitems", "executableitems", "executableblocks", "simpleitemgenerator", "hdb"].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setActiveTab(type)}
                                                className={cn(
                                                    "p-2 rounded-lg text-xs font-medium border transition-all text-left flex items-center gap-2",
                                                    activeTab === type
                                                        ? "bg-primary/20 border-primary text-primary"
                                                        : "bg-white/5 border-white/10 text-textMuted hover:bg-white/10"
                                                )}
                                            >
                                                {MATERIAL_TYPES[type].icon && (
                                                    <img
                                                        src={MATERIAL_TYPES[type].icon}
                                                        alt=""
                                                        className="w-5 h-5 rounded object-cover flex-shrink-0"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                )}
                                                <span className="truncate">{MATERIAL_TYPES[type].label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Plugin Input (shown when specific plugin is selected) */}
                            {["itemsadder", "oraxen", "nexo", "mmoitems", "executableitems", "executableblocks", "simpleitemgenerator", "hdb"].includes(activeTab) && (
                                <div className="space-y-2 mt-3">
                                    <Label className="text-[10px] text-textMuted">{MATERIAL_TYPES[activeTab]?.label} ID</Label>
                                    <Input
                                        value={customValue}
                                        onChange={(e) => setCustomValue(e.target.value)}
                                        placeholder={MATERIAL_TYPES[activeTab]?.placeholder}
                                        className="bg-white/5 border-white/10 text-xs font-mono"
                                        onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
                                    />
                                    <p className="text-[10px] text-textMuted/60">
                                        Format: <span className="font-mono text-primary">{MATERIAL_TYPES[activeTab]?.prefix}</span>{MATERIAL_TYPES[activeTab]?.placeholder}
                                    </p>
                                    <Button size="sm" onClick={handleCustomSubmit} className="w-full">
                                        Apply
                                    </Button>
                                </div>
                            )}

                            {/* Equipment Tab */}
                            {activeTab === "equipment" && (
                                <div className="space-y-2">
                                    <p className="text-[10px] text-textMuted mb-2">Select equipment slot to mirror</p>
                                    {EQUIPMENT_SLOTS.map(slot => (
                                        <button
                                            key={slot}
                                            onClick={() => {
                                                onSelect(slot);
                                                setIsOpen(false);
                                            }}
                                            className={cn(
                                                "w-full p-2 rounded-lg text-xs font-mono text-left border transition-all",
                                                currentMaterial === slot
                                                    ? "bg-primary/20 border-primary text-primary"
                                                    : "bg-white/5 border-white/10 text-text hover:bg-white/10"
                                            )}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Placeholder Tab */}
                            {activeTab === "placeholder" && (
                                <div className="space-y-3">
                                    <p className="text-[10px] text-textMuted mb-2">Use PlaceholderAPI placeholders as material</p>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-textMuted">Placeholder Value</Label>
                                        <Input
                                            placeholder="e.g. %player_item_in_hand%"
                                            className="h-10 bg-white/5 border-white/10 text-sm font-mono"
                                            value={customValue}
                                            onChange={(e) => setCustomValue(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && customValue.trim() && (() => { onSelect("placeholder-" + customValue); setIsOpen(false); })()}
                                        />
                                    </div>
                                    <p className="text-[10px] text-textMuted/60">
                                        Format: <span className="font-mono text-primary">placeholder-%placeholder%</span>
                                    </p>
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        onClick={() => { if (customValue.trim()) { onSelect("placeholder-" + customValue); setIsOpen(false); } }}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div >
                </>
            )}
        </div >
    )
}




// Section Component for consistent styling
const Section = ({ icon: Icon, title, children, info, side }) => (
    <div className="space-y-3">
        <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            <Label className="text-xs uppercase tracking-wider text-textMuted font-semibold">{title}</Label>
            {info && <InfoTooltip text={info} side={side} />}
        </div>
        {children}
    </div>
);

const SidebarProperties = ({ selectedItemId, items = [], onUpdateItem, onCreateItem, onDeleteItem, onBack, menuSize, version }) => {
    // Find the selected item directly by ID
    const selectedItem = items.find(item => item.id === selectedItemId);
    const selectedItemIndex = items.findIndex(item => item.id === selectedItemId);

    const [formData, setFormData] = useState({});
    const [isSlotPickerOpen, setIsSlotPickerOpen] = useState(false);

    // Update formData when selected item changes
    useEffect(() => {
        if (selectedItem) {
            setFormData(selectedItem);
        } else {
            setFormData({});
        }
    }, [selectedItemId, items]);

    const handleChange = (field, value) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        if (onUpdateItem && selectedItemIndex !== -1) {
            onUpdateItem(selectedItemIndex, newData);
        }
    };

    // View: No Item Selected
    if (!selectedItemId || !selectedItem) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in slide-in-from-right-4 duration-300 px-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary/50" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-text mb-1">No Item Selected</h3>
                        <p className="text-sm text-textMuted">Select an item from the list to edit</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={onBack} className="gap-2 w-full">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Items
                    </Button>
                </div>
            </div>
        );
    }

    // View: Edit Item (Form)
    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                        <ItemIcon material={formData.material} modelData={formData.modelData} />
                    </div>
                    <div className="min-w-0">
                        <h2 className="font-semibold text-text text-sm truncate">{formData.displayName?.replace(/&[0-9a-fk-or]/gi, '') || formData.id || "Edit Item"}</h2>
                        <div className="flex items-center gap-2 text-[10px] text-textMuted">
                            <span className="font-mono text-primary">{formData.id}</span>
                        </div>
                    </div>
                </div>
                {onDeleteItem && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg"
                        onClick={() => {
                            onDeleteItem(selectedItemId);
                            onBack();
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-5 pr-1">
                {/* Material */}
                <Section icon={Package} title="Material" info="Item material. Supports vanilla items, player heads, texture URLs, HeadDatabase, ItemsAdder, Oraxen, MMOItems, and more." side="bottom">
                    <MaterialPicker
                        currentMaterial={formData.material || ""}
                        onSelect={(mat) => handleChange("material", mat)}
                        version={version} // Pass version directly from props
                    />
                    <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors mt-2">
                        <input
                            type="checkbox"
                            checked={formData.update || false}
                            onChange={(e) => handleChange("update", e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-offset-0"
                        />
                        <span className="text-xs text-textMuted font-medium">Auto-update Item</span>
                    </label>
                </Section>

                {/* Display Name */}
                <Section icon={Type} title="Display Name" info="The name of the item shown in the menu. Supports color codes (&a, &#RRGGBB) and placeholders.">
                    <Input
                        value={formData.displayName || ""}
                        onChange={(e) => handleChange("displayName", e.target.value)}
                        placeholder="&eItem Name"
                        className="h-12 bg-gradient-to-r from-white/5 to-white/[0.02] border-white/10 rounded-xl"
                    />
                    <p className="text-[10px] text-textMuted/60 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Supports color codes (e.g. &a, &#RRGGBB)
                    </p>
                </Section>

                {/* Lore */}
                <Section icon={AlignLeft} title="Lore" info="Description lines shown under the item name. Supports color codes and placeholders.">
                    <textarea
                        className="flex w-full rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-white/[0.02] px-4 py-3 text-sm text-text shadow-sm placeholder:text-textMuted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 min-h-[100px] font-mono resize-none hover:border-white/20"
                        value={Array.isArray(formData.lore) ? formData.lore.join('\n') : (formData.lore || "")}
                        onChange={(e) => handleChange("lore", e.target.value.split('\n'))}
                        placeholder="&7Line 1&#10;&7Line 2"
                    />
                </Section>

                {/* Slots */}
                <Section icon={Layers} title="Slots" info="Assign this item to multiple slots. Click to open the slot picker.">
                    <div className="flex gap-2">
                        <div className="flex-1 min-h-[40px] p-2 rounded-xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 flex flex-wrap gap-1 items-center">
                            {/* Display each slot individually without range conversion */}
                            {(formData.slots && formData.slots.length > 0 ? formData.slots : (formData.slot !== undefined ? [formData.slot] : [])).sort((a, b) => a - b).map((s, i) => (
                                <span key={i} className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-mono border border-primary/20">
                                    {s}
                                </span>
                            ))}
                            {(formData.slots?.length === 0 && formData.slot === undefined) && (
                                <span className="text-textMuted text-xs italic opacity-50">No slots assigned</span>
                            )}
                        </div>
                        <Button
                            onClick={() => setIsSlotPickerOpen(true)}
                            className="aspect-square p-0 h-10 w-10 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl"
                        >
                            <Grid3X3 className="w-5 h-5 text-textMuted hover:text-text transition-colors" />
                        </Button>
                    </div>
                    {isSlotPickerOpen && (
                        <SlotPicker
                            currentSlots={formData.slots && formData.slots.length > 0 ? formData.slots : (formData.slot !== undefined ? [formData.slot] : [])}
                            maxSlots={menuSize || 54}
                            onToggle={(slot) => {
                                const current = formData.slots && formData.slots.length > 0 ? formData.slots : (formData.slot !== undefined ? [formData.slot] : []);
                                let newSlots;
                                if (current.includes(slot)) {
                                    newSlots = current.filter(s => s !== slot);
                                } else {
                                    newSlots = [...current, slot].sort((a, b) => a - b);
                                }

                                const newData = {
                                    ...formData,
                                    slots: newSlots,
                                    slot: newSlots.length > 0 ? newSlots[0] : formData.slot
                                };

                                setFormData(newData);

                                if (onUpdateItem && selectedItemIndex !== -1) {
                                    onUpdateItem(selectedItemIndex, newData);
                                }
                            }}
                            onClose={() => setIsSlotPickerOpen(false)}
                        />
                    )}
                </Section>

                {/* Priority */}
                <Section icon={Layers} title="Priority" info="Determines which item is shown if multiple items are in the same slot. 0 is highest priority, 2147483647 is lowest.">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleChange("priority", Math.max(0, (formData.priority || 0) - 1))}
                                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-text hover:bg-white/10 transition-all flex items-center justify-center text-lg font-medium"
                            >
                                −
                            </button>
                            <Input
                                type="number"
                                min="0"
                                max="2147483647"
                                value={formData.priority || 0}
                                onChange={(e) => handleChange("priority", Math.max(0, parseInt(e.target.value) || 0))}
                                className="h-10 bg-white/5 border-white/10 text-center flex-1 font-mono"
                            />
                            <button
                                type="button"
                                onClick={() => handleChange("priority", (formData.priority || 0) + 1)}
                                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-text hover:bg-white/10 transition-all flex items-center justify-center text-lg font-medium"
                            >
                                +
                            </button>
                        </div>
                        <p className="text-[10px] text-textMuted/60">Used with view requirements for slot layering (0 = checked first)</p>
                    </div>
                </Section>

                {/* Amount */}
                <Section icon={Hash} title="Amount" info="Item stack size. Use dynamic_amount for placeholder-based amounts (e.g., %player_level%).">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleChange("amount", Math.max(1, (formData.amount || 1) - 1))}
                                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-text hover:bg-white/10 transition-all flex items-center justify-center text-lg font-medium"
                            >
                                −
                            </button>
                            <Input
                                type="number"
                                min="1"
                                max="64"
                                value={formData.amount || 1}
                                onChange={(e) => handleChange("amount", Math.min(64, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="h-10 bg-white/5 border-white/10 text-center flex-1 font-mono"
                            />
                            <button
                                type="button"
                                onClick={() => handleChange("amount", Math.min(64, (formData.amount || 1) + 1))}
                                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-text hover:bg-white/10 transition-all flex items-center justify-center text-lg font-medium"
                            >
                                +
                            </button>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] text-textMuted flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                Dynamic Amount (Placeholder)
                            </Label>
                            <Input
                                value={formData.dynamicAmount || ""}
                                onChange={(e) => handleChange("dynamicAmount", e.target.value)}
                                placeholder="%player_level%"
                                className="bg-white/5 border-white/10 text-xs font-mono"
                            />
                            <p className="text-[10px] text-textMuted/50">Overrides amount with a placeholder value</p>
                        </div>
                    </div>
                </Section>

                {/* Custom Model Data */}
                <Section icon={Hash} title="Custom Model Data" info="Integer used by resource packs to display custom textures/models.">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleChange("modelData", Math.max(0, (formData.modelData || 0) - 1))}
                            className="w-12 h-12 rounded-xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 text-text hover:from-white/10 hover:to-white/5 hover:border-white/20 transition-all duration-200 flex items-center justify-center text-xl font-medium"
                        >
                            −
                        </button>
                        <Input
                            type="number"
                            value={formData.modelData || 0}
                            onChange={(e) => handleChange("modelData", parseInt(e.target.value) || 0)}
                            className="h-12 bg-gradient-to-r from-white/5 to-white/[0.02] border-white/10 text-center flex-1 rounded-xl text-lg font-mono"
                        />
                        <button
                            type="button"
                            onClick={() => handleChange("modelData", (formData.modelData || 0) + 1)}
                            className="w-12 h-12 rounded-xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 text-text hover:from-white/10 hover:to-white/5 hover:border-white/20 transition-all duration-200 flex items-center justify-center text-xl font-medium"
                        >
                            +
                        </button>
                    </div>
                </Section>

                {/* Enchantments */}
                <Section icon={Zap} title="Enchantments" info="Apply enchantments to the item. Some enchantments may add a glow effect.">
                    <div className="space-y-2">
                        {(formData.enchantments || []).map((ench, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <select
                                    value={ench.id}
                                    onChange={(e) => {
                                        const newEnch = [...(formData.enchantments || [])];
                                        newEnch[index] = { ...newEnch[index], id: e.target.value };
                                        handleChange("enchantments", newEnch);
                                    }}
                                    className="flex-1 h-9 bg-white/5 border border-white/10 rounded-lg text-xs px-2 focus:border-primary/50 outline-none"
                                >
                                    <option value="">Select Enchantment</option>
                                    {ENCHANTMENTS.map(e => (
                                        <option key={e} value={e}>{e}</option>
                                    ))}
                                </select>
                                <Input
                                    type="number"
                                    min="1"
                                    value={ench.level}
                                    onChange={(e) => {
                                        const newEnch = [...(formData.enchantments || [])];
                                        newEnch[index] = { ...newEnch[index], level: parseInt(e.target.value) || 1 };
                                        handleChange("enchantments", newEnch);
                                    }}
                                    className="w-16 h-9 bg-white/5 border-white/10 text-center"
                                />
                                <button
                                    onClick={() => {
                                        const newEnch = (formData.enchantments || []).filter((_, i) => i !== index);
                                        handleChange("enchantments", newEnch);
                                    }}
                                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleChange("enchantments", [...(formData.enchantments || []), { id: "sharpness", level: 1 }])}
                            className="w-full h-8 gap-2 text-xs border-dashed"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Enchantment
                        </Button>
                    </div>
                </Section>

                {/* Attributes */}
                <Section icon={Shield} title="Attributes & Flags" info="Toggle visibility of specific item properties or add special flags like Unbreakable or Glow.">
                    <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.hideEnchantments || false}
                                onChange={(e) => handleChange("hideEnchantments", e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-offset-0"
                            />
                            <span className="text-[10px] text-textMuted font-medium">Hide Enchants</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.hideAttributes || false}
                                onChange={(e) => handleChange("hideAttributes", e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-offset-0"
                            />
                            <span className="text-[10px] text-textMuted font-medium">Hide Attributes</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.unbreakable || false}
                                onChange={(e) => handleChange("unbreakable", e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-offset-0"
                            />
                            <span className="text-[10px] text-textMuted font-medium">Unbreakable</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.glow || false}
                                onChange={(e) => handleChange("glow", e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-offset-0"
                            />
                            <span className="text-[10px] text-textMuted font-medium">Glow</span>
                        </label>
                    </div>
                </Section>

                {/* Advanced Meta */}
                <Section icon={Sparkles} title="Advanced Meta" info="Special properties for specific items like Leather Armor color, Potion effects, or Banner patterns.">
                    <div className="space-y-4">
                        {/* RGB Color */}
                        <div className="space-y-2">
                            <Label className="text-[10px] text-textMuted">Color (Leather/Potion/Map)</Label>
                            <div className="flex items-center gap-2">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                                    <input
                                        type="color"
                                        value={(() => {
                                            if (!formData.color) return "#ffffff";
                                            const [r, g, b] = formData.color.split(',').map(Number);
                                            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                                        })()}
                                        onChange={(e) => {
                                            const hex = e.target.value;
                                            const r = parseInt(hex.slice(1, 3), 16);
                                            const g = parseInt(hex.slice(3, 5), 16);
                                            const b = parseInt(hex.slice(5, 7), 16);
                                            handleChange("color", `${r},${g},${b}`);
                                        }}
                                        className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
                                    />
                                </div>
                                <Input
                                    value={formData.color || ""}
                                    onChange={(e) => handleChange("color", e.target.value)}
                                    placeholder="R,G,B (e.g. 255,0,0)"
                                    className="flex-1 bg-white/5 border-white/10 text-xs font-mono"
                                />
                                {formData.color && (
                                    <button
                                        onClick={() => handleChange("color", "")}
                                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-textMuted"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Potion Effects */}
                        <div className="space-y-2 border-t border-white/5 pt-2">
                            <Label className="text-[10px] text-textMuted">Potion Effects</Label>
                            {(formData.potionEffects || []).map((eff, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="Effect"
                                        value={eff.effect}
                                        onChange={(e) => {
                                            const newEffs = [...(formData.potionEffects || [])];
                                            newEffs[index] = { ...newEffs[index], effect: e.target.value };
                                            handleChange("potionEffects", newEffs);
                                        }}
                                        className="flex-[2] h-8 bg-black/20 text-[10px]"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Dur"
                                        value={eff.duration}
                                        onChange={(e) => {
                                            const newEffs = [...(formData.potionEffects || [])];
                                            newEffs[index] = { ...newEffs[index], duration: parseInt(e.target.value) || 0 };
                                            handleChange("potionEffects", newEffs);
                                        }}
                                        className="flex-1 h-8 bg-black/20 text-[10px]"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Amp"
                                        value={eff.amplifier}
                                        onChange={(e) => {
                                            const newEffs = [...(formData.potionEffects || [])];
                                            newEffs[index] = { ...newEffs[index], amplifier: parseInt(e.target.value) || 0 };
                                            handleChange("potionEffects", newEffs);
                                        }}
                                        className="flex-1 h-8 bg-black/20 text-[10px]"
                                    />
                                    <button
                                        onClick={() => {
                                            const newEffs = (formData.potionEffects || []).filter((_, i) => i !== index);
                                            handleChange("potionEffects", newEffs);
                                        }}
                                        className="w-8 h-8 rounded bg-red-500/10 text-red-400 flex items-center justify-center"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleChange("potionEffects", [...(formData.potionEffects || []), { effect: "SPEED", duration: 60, amplifier: 1 }])}
                                className="w-full h-7 text-[10px] border border-dashed border-white/10"
                            >
                                <Plus className="w-3 h-3 mr-1" /> Add Potion Effect
                            </Button>
                        </div>

                        {/* Banner Meta */}
                        <div className="space-y-2 border-t border-white/5 pt-2">
                            <Label className="text-[10px] text-textMuted">Banner Patterns</Label>
                            {(formData.bannerMeta || []).map((meta, index) => (
                                <div key={index} className="flex gap-2">
                                    <select
                                        value={meta.color}
                                        onChange={(e) => {
                                            const newMeta = [...(formData.bannerMeta || [])];
                                            newMeta[index] = { ...newMeta[index], color: e.target.value };
                                            handleChange("bannerMeta", newMeta);
                                        }}
                                        className="flex-1 h-8 bg-black/20 border border-white/10 rounded-lg text-[10px] px-1"
                                    >
                                        <option value="WHITE">White</option>
                                        <option value="RED">Red</option>
                                        <option value="BLUE">Blue</option>
                                        <option value="BLACK">Black</option>
                                        <option value="GREEN">Green</option>
                                        <option value="YELLOW">Yellow</option>
                                        <option value="PURPLE">Purple</option>
                                        <option value="CYAN">Cyan</option>
                                    </select>
                                    <Input
                                        placeholder="Pattern (e.g. CROSS)"
                                        value={meta.pattern}
                                        onChange={(e) => {
                                            const newMeta = [...(formData.bannerMeta || [])];
                                            newMeta[index] = { ...newMeta[index], pattern: e.target.value };
                                            handleChange("bannerMeta", newMeta);
                                        }}
                                        className="flex-[2] h-8 bg-black/20 text-[10px]"
                                    />
                                    <button
                                        onClick={() => {
                                            const newMeta = (formData.bannerMeta || []).filter((_, i) => i !== index);
                                            handleChange("bannerMeta", newMeta);
                                        }}
                                        className="w-8 h-8 rounded bg-red-500/10 text-red-400 flex items-center justify-center"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleChange("bannerMeta", [...(formData.bannerMeta || []), { color: "WHITE", pattern: "BASE" }])}
                                className="w-full h-7 text-[10px] border border-dashed border-white/10"
                            >
                                <Plus className="w-3 h-3 mr-1" /> Add Pattern
                            </Button>
                        </div>
                    </div>
                </Section>

                {/* Divider */}
                <div className="border-t border-white/10 pt-2">
                    <p className="text-[10px] uppercase tracking-wider text-textMuted/50 font-semibold">Actions & Requirements</p>
                </div>

                {/* Left Click Commands */}
                <Section icon={Terminal} title="Left Click Commands" info="Commands executed when the player left-clicks this item.">
                    <div className="space-y-2">
                        {(formData.leftClickCommands || []).map((cmd, index) => (
                            <div key={index} className="flex items-center gap-2 group">
                                <GripVertical className="w-4 h-4 text-textMuted/30 flex-shrink-0" />
                                <Input
                                    value={cmd}
                                    onChange={(e) => {
                                        const newCmds = [...(formData.leftClickCommands || [])];
                                        newCmds[index] = e.target.value;
                                        handleChange("leftClickCommands", newCmds);
                                    }}
                                    placeholder="[player] say Hello!"
                                    className="h-10 bg-gradient-to-r from-white/5 to-white/[0.02] border-white/10 rounded-lg flex-1 font-mono text-xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newCmds = (formData.leftClickCommands || []).filter((_, i) => i !== index);
                                        handleChange("leftClickCommands", newCmds);
                                    }}
                                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleChange("leftClickCommands", [...(formData.leftClickCommands || []), ""])}
                            className="w-full h-9 gap-2 text-xs border-dashed"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Command
                        </Button>
                    </div>
                    <p className="text-[10px] text-textMuted/60 mt-1">
                        Use [player] for player commands, [console] for console
                    </p>
                </Section>

                {/* Right Click Commands */}
                <Section icon={MousePointer} title="Right Click Commands" info="Commands executed when the player right-clicks this item.">
                    <div className="space-y-2">
                        {(formData.rightClickCommands || []).map((cmd, index) => (
                            <div key={index} className="flex items-center gap-2 group">
                                <GripVertical className="w-4 h-4 text-textMuted/30 flex-shrink-0" />
                                <Input
                                    value={cmd}
                                    onChange={(e) => {
                                        const newCmds = [...(formData.rightClickCommands || [])];
                                        newCmds[index] = e.target.value;
                                        handleChange("rightClickCommands", newCmds);
                                    }}
                                    placeholder="[close]"
                                    className="h-10 bg-gradient-to-r from-white/5 to-white/[0.02] border-white/10 rounded-lg flex-1 font-mono text-xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newCmds = (formData.rightClickCommands || []).filter((_, i) => i !== index);
                                        handleChange("rightClickCommands", newCmds);
                                    }}
                                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleChange("rightClickCommands", [...(formData.rightClickCommands || []), ""])}
                            className="w-full h-9 gap-2 text-xs border-dashed"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Command
                        </Button>
                    </div>
                </Section>

                {/* Shift Left Click Commands */}
                <Section icon={Keyboard} title="Shift+Left Click Commands" info="Commands executed when the player holds Shift and left-clicks this item.">
                    <div className="space-y-2">
                        {(formData.shiftLeftClickCommands || []).map((cmd, index) => (
                            <div key={index} className="flex items-center gap-2 group">
                                <GripVertical className="w-4 h-4 text-textMuted/30 flex-shrink-0" />
                                <Input
                                    value={cmd}
                                    onChange={(e) => {
                                        const newCmds = [...(formData.shiftLeftClickCommands || [])];
                                        newCmds[index] = e.target.value;
                                        handleChange("shiftLeftClickCommands", newCmds);
                                    }}
                                    placeholder="[player] say Shift Left!"
                                    className="h-10 bg-gradient-to-r from-white/5 to-white/[0.02] border-white/10 rounded-lg flex-1 font-mono text-xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newCmds = (formData.shiftLeftClickCommands || []).filter((_, i) => i !== index);
                                        handleChange("shiftLeftClickCommands", newCmds);
                                    }}
                                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleChange("shiftLeftClickCommands", [...(formData.shiftLeftClickCommands || []), ""])}
                            className="w-full h-9 gap-2 text-xs border-dashed"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Command
                        </Button>
                    </div>
                </Section>

                {/* Shift Right Click Commands */}
                <Section icon={Keyboard} title="Shift+Right Click Commands" info="Commands executed when the player holds Shift and right-clicks this item.">
                    <div className="space-y-2">
                        {(formData.shiftRightClickCommands || []).map((cmd, index) => (
                            <div key={index} className="flex items-center gap-2 group">
                                <GripVertical className="w-4 h-4 text-textMuted/30 flex-shrink-0" />
                                <Input
                                    value={cmd}
                                    onChange={(e) => {
                                        const newCmds = [...(formData.shiftRightClickCommands || [])];
                                        newCmds[index] = e.target.value;
                                        handleChange("shiftRightClickCommands", newCmds);
                                    }}
                                    placeholder="[player] say Shift Right!"
                                    className="h-10 bg-gradient-to-r from-white/5 to-white/[0.02] border-white/10 rounded-lg flex-1 font-mono text-xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newCmds = (formData.shiftRightClickCommands || []).filter((_, i) => i !== index);
                                        handleChange("shiftRightClickCommands", newCmds);
                                    }}
                                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleChange("shiftRightClickCommands", [...(formData.shiftRightClickCommands || []), ""])}
                            className="w-full h-9 gap-2 text-xs border-dashed"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Command
                        </Button>
                    </div>
                </Section>

                {/* Click Requirement */}
                <Section icon={Shield} title="Click Requirements" info="Conditions that must be met for click actions to execute. Add multiple requirements - all must pass for commands to run.">
                    <RequirementsEditor
                        requirements={formData.clickRequirements || []}
                        onChange={(reqs) => handleChange("clickRequirements", reqs)}
                        showCommands={true}
                        denyCommands={formData.clickRequirementDenyCommands || []}
                        successCommands={formData.clickRequirementSuccessCommands || []}
                        onDenyChange={(cmds) => handleChange("clickRequirementDenyCommands", cmds)}
                        onSuccessChange={(cmds) => handleChange("clickRequirementSuccessCommands", cmds)}
                    />
                </Section>

                {/* View Requirement */}
                <Section icon={Eye} title="View Requirements" info="Conditions that must be met for the item to be visible. Add multiple requirements - all must pass for visibility.">
                    <RequirementsEditor
                        requirements={formData.viewRequirements || []}
                        onChange={(reqs) => handleChange("viewRequirements", reqs)}
                        showCommands={false}
                    />
                </Section>
            </div>
        </div>
    );
};


export default SidebarProperties;

