import React from "react";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { Package, ChevronRight, Plus, X, GripVertical, Shield } from "lucide-react";
import InfoTooltip from "../../components/ui/InfoTooltip";
import { t } from "../../utils/i18n";
import ListInput from "../../components/ui/ListInput";
import RequirementsEditor from "../../components/editor/RequirementsEditor";
import ArgumentListEditor from "../../components/editor/ArgumentListEditor";

// All supported inventory types
const MENU_TYPE_OPTIONS = [
    // Standard containers
    { value: "CHEST", label: "Chest", category: "containers" },
    { value: "ENDER_CHEST", label: "Ender Chest", category: "containers" },
    { value: "BARREL", label: "Barrel", category: "containers" },
    { value: "SHULKER_BOX", label: "Shulker Box", category: "containers" },

    // Small containers
    { value: "HOPPER", label: "Hopper", category: "small" },
    { value: "DISPENSER", label: "Dispenser", category: "small" },
    { value: "DROPPER", label: "Dropper", category: "small" },

    // Processing
    { value: "FURNACE", label: "Furnace", category: "processing" },
    { value: "BLAST_FURNACE", label: "Blast Furnace", category: "processing" },
    { value: "SMOKER", label: "Smoker", category: "processing" },
    { value: "BREWING_STAND", label: "Brewing Stand", category: "processing" },

    // Crafting
    { value: "WORKBENCH", label: "Crafting Table", category: "crafting" },
    { value: "ANVIL", label: "Anvil", category: "crafting" },
    { value: "ENCHANTING", label: "Enchanting Table", category: "crafting" },
    { value: "GRINDSTONE", label: "Grindstone", category: "crafting" },
    { value: "STONECUTTER", label: "Stonecutter", category: "crafting" },
    { value: "CARTOGRAPHY", label: "Cartography Table", category: "crafting" },
    { value: "LOOM", label: "Loom", category: "crafting" },
    { value: "SMITHING", label: "Smithing Table", category: "crafting" },

    // Special
    { value: "MERCHANT", label: "Merchant", category: "special" },
    { value: "BEACON", label: "Beacon", category: "special" },
];

const SidebarMenuSettings = ({ settings, onUpdate, lang = 'en', onNavigateToItems, itemCount = 0 }) => {
    const handleChange = (key, value) => {
        onUpdate({ ...settings, [key]: value });
    };

    // Translate type labels
    const translatedOptions = MENU_TYPE_OPTIONS.map(opt => ({
        ...opt,
        label: t(`types.${opt.value}`, lang)
    }));

    // Check if type supports row selection
    const supportsRowSelection = ['CHEST', 'BARREL'].includes(settings.type) || !settings.type;

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Menu Title */}
            <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-textMuted font-semibold">
                    {t('menuTitle', lang)}
                    <InfoTooltip text="The title shown at the top of the menu GUI. Supports color codes and placeholders." side="bottom" />
                </Label>
                <Input
                    value={settings.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder={t('menuTitlePlaceholder', lang)}
                    className="bg-background/30 border-white/10 focus:border-primary/50"
                />
                <p className="text-[10px] text-textMuted/70">{t('menuTitleHelp', lang)}</p>
            </div>

            {/* Type & Size */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-textMuted font-semibold">
                        {t('type', lang)}
                        <InfoTooltip text="The type of inventory to open (e.g. Chest, Hopper, Anvil). Determines the layout and number of slots." side="bottom" />
                    </Label>
                    <Select
                        value={settings.type || "CHEST"}
                        onChange={(value) => handleChange("type", value)}
                        options={translatedOptions}
                        placeholder={t('selectType', lang)}
                    />
                </div>

                {supportsRowSelection && (
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-textMuted font-semibold">
                            {t('rows', lang)} <span className="text-primary font-bold">{(settings.size || 54) / 9}</span>
                        </Label>
                        <div className="relative pt-1">
                            <input
                                type="range"
                                min="9"
                                max="54"
                                step="9"
                                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-background/50 accent-primary"
                                value={settings.size || 54}
                                onChange={(e) => handleChange("size", parseInt(e.target.value))}
                            />
                            <div className="flex justify-between text-[9px] text-textMuted/50 mt-1">
                                <span>1</span>
                                <span>6</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Commands Section */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs uppercase tracking-wider text-textMuted font-semibold flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    {t('commands', lang)}
                </h3>

                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label className="text-xs text-textMuted flex items-center">
                            {t('openCommand', lang)}
                            <InfoTooltip text="The main command to open this menu (e.g. 'menu' for /menu)." />
                        </Label>
                        <Input
                            value={settings.open_command || ""}
                            onChange={(e) => handleChange("open_command", e.target.value)}
                            placeholder="menu"
                            className="bg-background/30 border-white/10 focus:border-primary/50"
                        />
                    </div>

                    <label className="flex items-center gap-3 p-3 rounded-lg bg-background/20 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
                        <input
                            type="checkbox"
                            checked={settings.register_command || false}
                            onChange={(e) => handleChange("register_command", e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 bg-background/30 text-primary focus:ring-primary/50 focus:ring-offset-0"
                        />
                        <span className="text-sm text-textMuted flex items-center gap-1">
                            {t('registerCommand', lang)}
                            <InfoTooltip text="If valid, registers the open command with the server so it appears in tab completion." />
                        </span>
                    </label>

                    <div className="space-y-2">
                        <Label className="text-xs text-textMuted flex items-center">
                            {t('updateInterval', lang)}
                            <InfoTooltip text="Time in seconds between automatic menu refreshes. Set to 0 to disable." />
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                min="0"
                                value={settings.update_interval || 0}
                                onChange={(e) => handleChange("update_interval", parseInt(e.target.value) || 0)}
                                className="bg-background/30 border-white/10 focus:border-primary/50"
                            />
                            {settings.update_interval > 0 && settings.update_interval < 1 && (
                                <span className="text-xs text-yellow-500 flex items-center">⚠️ High CPU</span>
                            )}
                        </div>
                        <p className="text-[10px] text-textMuted/70">{t('updateIntervalHelp', lang)}</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-textMuted flex items-center">
                            {t('permission', lang)}
                            <InfoTooltip text="Permission required to open this menu." />
                        </Label>
                        <Input
                            value={settings.permission || ""}
                            onChange={(e) => handleChange("permission", e.target.value)}
                            placeholder="deluxemenus.menu"
                            className="bg-background/30 border-white/10 focus:border-primary/50"
                        />
                    </div>


                    {/* Arguments Configuration */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <h3 className="text-xs uppercase tracking-wider text-textMuted font-semibold flex items-center gap-2">
                            <i className="lucide-text-cursor-input w-4 h-4 text-primary" />
                            Arguments
                        </h3>

                        {/* Unified Args Editor */}
                        <ArgumentListEditor
                            args={settings.args || []}
                            onChange={(newArgs) => handleChange("args", newArgs)}
                        />

                        {/* Conditional Settings - Only show if args exist */}
                        {settings.args && settings.args.length > 0 && (
                            <div className="space-y-4 pl-3 border-l-2 border-white/5 animate-in fade-in slide-in-from-top-2">
                                {/* Usage Message */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-textMuted flex items-center">
                                        Usage Message
                                        <InfoTooltip text="Message sent when arguments are missing." />
                                    </Label>
                                    <Input
                                        value={settings.args_usage_message || ""}
                                        onChange={(e) => handleChange("args_usage_message", e.target.value)}
                                        placeholder="&cUsage: /menu <target> <amount>"
                                        className="bg-background/30 border-white/10 focus:border-primary/50"
                                    />
                                </div>

                                {/* Placeholder Support */}
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-textMuted flex items-center gap-2">
                                        Support Placeholders
                                        <InfoTooltip text="Parse placeholders in arguments before use. Security risk if used with input!" />
                                    </Label>
                                    <input
                                        type="checkbox"
                                        checked={settings.arguments_support_placeholders || false}
                                        onChange={(e) => handleChange("arguments_support_placeholders", e.target.checked)}
                                        className="toggle"
                                    />
                                </div>

                                {/* Parse After */}
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-textMuted flex items-center gap-2">
                                        Parse After Args
                                        <InfoTooltip text="Revert to pre-1.14.1 parsing order. Use with caution." />
                                    </Label>
                                    <input
                                        type="checkbox"
                                        checked={settings.parse_placeholders_after_arguments || false}
                                        onChange={(e) => handleChange("parse_placeholders_after_arguments", e.target.checked)}
                                        className="toggle"
                                    />
                                </div>
                            </div>
                        )}
                    </div>


                </div>
            </div>

            {/* Open Requirements */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs uppercase tracking-wider text-textMuted font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Open Requirements
                </h3>
                <div className="space-y-3">
                    <p className="text-[10px] text-textMuted">
                        Conditions that must be met to open this menu.
                    </p>
                    <RequirementsEditor
                        requirements={settings.openRequirement?.requirements || []}
                        onChange={(reqs) => handleChange("openRequirement", { ...settings.openRequirement, requirements: reqs })}
                        showCommands={true}
                        denyCommands={settings.openRequirement?.deny_commands || []}
                        successCommands={settings.openRequirement?.success_commands || []} // Though open requirement usually only cares for deny
                        onDenyChange={(cmds) => handleChange("openRequirement", { ...settings.openRequirement, deny_commands: cmds })}
                        onSuccessChange={(cmds) => handleChange("openRequirement", { ...settings.openRequirement, success_commands: cmds })}
                    />
                </div>
            </div>

            {/* Menu Open/Close Commands */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs uppercase tracking-wider text-textMuted font-semibold flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    Events
                </h3>
                <div className="space-y-4">
                    <ListInput
                        label={t('openCommands', lang)}
                        tooltip="Commands executed by the console or player when the menu opens."
                        items={settings.open_commands || []}
                        onChange={(val) => handleChange("open_commands", val)}
                        placeholder="[message] Hello!"
                        addButtonText="Add Open Command"
                    />
                    <ListInput
                        label={t('closeCommands', lang)}
                        tooltip="Commands executed by the console or player when the menu closes."
                        items={settings.close_commands || []}
                        onChange={(val) => handleChange("close_commands", val)}
                        placeholder="[message] Bye!"
                        addButtonText="Add Close Command"
                    />
                </div>
            </div>

            {/* Items Navigation */}
            {onNavigateToItems && (
                <div className="pt-4 border-t border-white/10">
                    <button
                        onClick={onNavigateToItems}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:from-primary/20 hover:to-primary/10 hover:border-primary/30 transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-text">{t('items', lang)}</p>
                                <p className="text-xs text-textMuted">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-textMuted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SidebarMenuSettings;
