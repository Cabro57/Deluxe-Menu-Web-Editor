import yaml from 'js-yaml';

export const formatSlots = (slots) => {
    if (!slots || slots.length === 0) return [];

    // Convert to numbers and sort, filter out duplicates/NaN
    const sorted = [...new Set(slots.map(Number))].filter(n => !isNaN(n)).sort((a, b) => a - b);
    const ranges = [];

    if (sorted.length === 0) return [];

    let start = sorted[0];
    let prev = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        if (current !== prev + 1) {
            // End of range
            if (start === prev) {
                ranges.push(start); // Keep as number for single items
            } else {
                ranges.push(`${start}-${prev}`);
            }
            start = current;
        }
        prev = current;
    }

    // Add last range
    if (start === prev) {
        ranges.push(start);
    } else {
        ranges.push(`${start}-${prev}`);
    }

    return ranges;
};

export const generateYaml = (settings) => {
    // Basic DeluxeMenus structure
    const menuConfig = {
        menu_title: settings.title,
        open_command: settings.open_command,
        register_command: settings.register_command,
        size: settings.size,
        inventory_type: settings.type,
        items: {}
    };

    // Helper to build requirement YAML object from UI object
    const buildRequirementObject = (req) => {
        const result = { type: req.type };

        if (req.type === 'has permission' || req.type === '!has permission') {
            result.permission = req.permission;
        } else if (req.type === 'has permissions') {
            result.permissions = req.permissions ? req.permissions.split(',').map(p => p.trim()) : [];
            if (req.minimum) result.minimum = parseInt(req.minimum);
        } else if (req.type === 'has money') {
            result.amount = parseInt(req.amount) || req.amount; // Allow placeholders
        } else if (req.type === 'has item') {
            result.material = req.material;
            result.amount = parseInt(req.amount) || 1;
        } else if (req.type === 'has exp') {
            result.amount = parseInt(req.amount) || 0;
            if (req.level) result.level = true;
        } else if (req.type === 'has meta') {
            result.key = req.key;
            result.meta_type = req.metaType;
            result.value = req.value;
        } else if (['string', 'regex', '==', '!=', '>', '>=', '<', '<='].some(t => req.type.includes(t))) {
            result.input = req.input;
            if (req.type === 'string length') {
                if (req.min) result.min = parseInt(req.min);
                if (req.max) result.max = parseInt(req.max);
            } else {
                result.output = req.output;
                if (req.type.includes('regex')) result.regex = req.output; // Some users prefer 'regex' key
            }
        } else if (req.type === 'javascript') {
            result.expression = req.expression;
        } else if (req.type.includes('is near')) {
            result.location = req.location;
            result.distance = parseInt(req.distance);
        } else if (req.type === 'is object') {
            result.input = req.input;
            result.object = req.objectType;
        }

        // Add deny/success commands if present (Nested structure support)
        if (req.deny_commands && req.deny_commands.length > 0) {
            result.deny_commands = req.deny_commands;
        }
        if (req.success_commands && req.success_commands.length > 0) {
            result.success_commands = req.success_commands;
        }

        // Remove undefined/empty keys
        Object.keys(result).forEach(key => {
            if (result[key] === undefined || result[key] === "" || result[key] === null) {
                delete result[key];
            }
        });

        return result;
    };

    if (settings.update_interval) {
        menuConfig.update_interval = settings.update_interval;
    }

    if (settings.open_commands && settings.open_commands.length > 0) {
        menuConfig.open_commands = settings.open_commands;
    }

    if (settings.close_commands && settings.close_commands.length > 0) {
        menuConfig.close_commands = settings.close_commands;
    }

    if (settings.openRequirement) {
        const reqConfig = {
            requirements: {}
        };

        // Process requirements list
        if (settings.openRequirement.requirements && settings.openRequirement.requirements.length > 0) {
            settings.openRequirement.requirements.forEach((req, index) => {
                const reqKey = `requirement_${index + 1}`;
                reqConfig.requirements[reqKey] = buildRequirementObject(req);
            });
        }

        if (settings.openRequirement.deny_commands && settings.openRequirement.deny_commands.length > 0) {
            reqConfig.deny_commands = settings.openRequirement.deny_commands.filter(cmd => cmd && cmd.trim());
        }

        if (settings.openRequirement.success_commands && settings.openRequirement.success_commands.length > 0) {
            reqConfig.success_commands = settings.openRequirement.success_commands.filter(cmd => cmd && cmd.trim());
        }

        // Only add if we have requirements or commands
        if (Object.keys(reqConfig.requirements).length > 0 || reqConfig.deny_commands || reqConfig.success_commands) {
            menuConfig.open_requirement = reqConfig;
        }
    } else if (settings.permission) {
        // Fallback for legacy simple permission
        menuConfig.open_requirement = {
            requirements: {
                permission: {
                    type: "has permission",
                    permission: settings.permission,
                    deny_commands: [
                        "[message] &cYou don't have permission to open this menu!"
                    ]
                }
            }
        };
    }


    if (settings.args && settings.args.length > 0) {
        // Prepare args container
        // If ANY argument has requirements, we must use the Map structure \{ argName: \{...\} \}
        // to avoid the "- argname" list format which users dislike for complex args.
        // However, if ALL are simple strings, we can keep the list format?
        // User request "dash doesn't go away" implies they want the Map format.

        const argsMap = {};
        const argsList = [];
        let useMap = false;

        settings.args.forEach((arg, index) => {
            const argName = typeof arg === 'string' ? arg : arg.name;
            const requirements = typeof arg === 'string' ? [] : (arg.requirements || []);

            if (requirements.length > 0) {
                useMap = true;
                const requirementsConfig = {};

                requirements.forEach((req, idx) => {
                    let reqKey = req.id || req.type.replace(/\s+/g, '_') || `req_${idx + 1}`;

                    // Safety check for duplicates
                    let uniqueKey = reqKey;
                    let counter = 2;
                    while (requirementsConfig[uniqueKey]) {
                        uniqueKey = `${reqKey}_${counter}`;
                        counter++;
                    }

                    requirementsConfig[uniqueKey] = buildRequirementObject(req);
                });

                // Arg with requirements
                argsMap[argName] = {
                    requirements: requirementsConfig
                };
            } else {
                // Simple arg without requirements
                // In map mode, simple args are just empty keys or true?
                // DeluxeMenus usually expects:
                // args:
                //   target: true
                //   amount:
                //     requirements: ...
                argsMap[argName] = true;
                argsList.push(argName);
            }
        });

        if (useMap) {
            menuConfig.args = argsMap;
        } else {
            menuConfig.args = argsList;
        }
    }

    if (settings.args_usage_message) {
        menuConfig.args_usage_message = settings.args_usage_message;
    }

    if (settings.arguments_support_placeholders) {
        menuConfig.arguments_support_placeholders = true;
    }

    if (settings.parse_placeholders_after_arguments) {
        menuConfig.parse_placeholders_after_arguments = true;
    }

    // Process items
    if (settings.items && Array.isArray(settings.items)) {
        settings.items.forEach(item => {
            // Use item.id as the key, falling back to slot-based name if missing
            const itemKey = item.id || `item_${item.slot}`;

            const itemConfig = {
                material: item.material,
            };

            if (item.slots && item.slots.length > 1) {
                // Output slots as simple array (preserves original YAML format)
                // sorted and deduplicated for consistency
                itemConfig.slots = [...new Set(item.slots.map(Number))].filter(n => !isNaN(n)).sort((a, b) => a - b);
            } else {
                itemConfig.slot = item.slot;
            }

            itemConfig.display_name = item.displayName;
            itemConfig.lore = item.lore || [];

            // Lore append mode (for custom items)
            if (item.loreAppendMode && item.loreAppendMode !== "OVERRIDE") {
                itemConfig.lore_append_mode = item.loreAppendMode;
            }

            // Handle amount - dynamic_amount overrides static amount in DeluxeMenus, 
            // but we keep both in YAML for better compatibility and to preserve the static value.
            itemConfig.amount = item.amount || 1;
            if (item.dynamicAmount && String(item.dynamicAmount).trim()) {
                itemConfig.dynamic_amount = item.dynamicAmount;
            }

            // Damage/Data value
            if (item.damage && item.damage > 0) {
                itemConfig.damage = item.damage;
            }

            // Material is now stored with full prefix (e.g., head-Notch, basehead-xxx)
            // No special handling needed

            if (item.priority) {
                itemConfig.priority = item.priority;
            }

            if (item.update) {
                itemConfig.update = true;
            }

            if (item.modelData && item.modelData > 0) {
                itemConfig.model_data = item.modelData;
            }

            // Left click commands
            if (item.leftClickCommands && item.leftClickCommands.length > 0) {
                itemConfig.left_click_commands = item.leftClickCommands.filter(cmd => cmd && String(cmd).trim());
            }

            // Right click commands
            if (item.rightClickCommands && item.rightClickCommands.length > 0) {
                itemConfig.right_click_commands = item.rightClickCommands.filter(cmd => cmd && String(cmd).trim());
            }

            // Middle click commands
            if (item.middleClickCommands && item.middleClickCommands.length > 0) {
                itemConfig.middle_click_commands = item.middleClickCommands.filter(cmd => cmd && String(cmd).trim());
            }

            // Shift Left click commands
            if (item.shiftLeftClickCommands && item.shiftLeftClickCommands.length > 0) {
                itemConfig.shift_left_click_commands = item.shiftLeftClickCommands.filter(cmd => cmd && String(cmd).trim());
            }

            // Shift Right click commands
            if (item.shiftRightClickCommands && item.shiftRightClickCommands.length > 0) {
                itemConfig.shift_right_click_commands = item.shiftRightClickCommands.filter(cmd => cmd && String(cmd).trim());
            }

            // Enchantments
            if (item.enchantments && item.enchantments.length > 0) {
                itemConfig.enchantments = item.enchantments
                    .filter(e => e.id && e.level)
                    .map(e => `${e.id};${e.level}`);
            }

            // Item Flags
            if (item.itemFlags && item.itemFlags.length > 0) {
                itemConfig.item_flags = item.itemFlags;
            }
            if (item.hideEnchantments) itemConfig.hide_enchantments = true;
            if (item.hideAttributes) itemConfig.hide_attributes = true;
            if (item.hideTooltip) itemConfig.hide_tooltip = true;
            if (item.enchantmentGlintOverride) itemConfig.enchantment_glint_override = true;
            if (item.unbreakable) itemConfig.unbreakable = true;
            if (item.glow) {
                // Glow logic: needs an enchantment + hide_enchantments
                if (!itemConfig.enchantments) itemConfig.enchantments = ["efficiency;1"];
                itemConfig.hide_enchantments = true;
            }

            // RGB for leather armor
            if (item.rgb && String(item.rgb).trim()) {
                itemConfig.rgb = item.rgb;
            }

            // Entity type for spawn eggs
            if (item.entityType && String(item.entityType).trim()) {
                itemConfig.entity_type = item.entityType;
            }

            // Base color for shields/banners
            if (item.baseColor && String(item.baseColor).trim()) {
                itemConfig.base_color = item.baseColor;
            }





            // View requirement
            if (item.viewRequirements && item.viewRequirements.length > 0) {
                itemConfig.view_requirement = {
                    requirements: {}
                };
                item.viewRequirements.forEach((req, i) => {
                    itemConfig.view_requirement.requirements[`requirement_${i + 1}`] = buildRequirementObject(req);
                });
            }


            // Click requirement
            if (item.clickRequirements && item.clickRequirements.length > 0) {
                itemConfig.click_requirement = {
                    requirements: {}
                };
                item.clickRequirements.forEach((req, i) => {
                    itemConfig.click_requirement.requirements[`requirement_${i + 1}`] = buildRequirementObject(req);
                });

                if (item.clickRequirementDenyCommands && item.clickRequirementDenyCommands.length > 0) {
                    itemConfig.click_requirement.deny_commands = item.clickRequirementDenyCommands;
                }
                if (item.clickRequirementSuccessCommands && item.clickRequirementSuccessCommands.length > 0) {
                    itemConfig.click_requirement.success_commands = item.clickRequirementSuccessCommands;
                }
            }


            // Add to items object
            menuConfig.items[itemKey] = itemConfig;
        });
    }

    try {
        // Dump the object to YAML string
        return yaml.dump(menuConfig, {
            lineWidth: -1, // Don't wrap long lines
            noRefs: true,  // Don't use aliases
            indent: 2,
            flowLevel: -1  // Force block style for mixed lists
        });
    } catch (e) {
        console.error("YAML Generation Error:", e);
        return "# Error generating YAML configuration";
    }
};

// Parse YAML back to menu settings
export const parseYaml = (yamlString) => {
    try {
        const config = yaml.load(yamlString);

        if (!config) {
            return { error: "Empty configuration" };
        }

        const settings = {
            title: config.menu_title || "",
            open_command: config.open_command || "",
            register_command: config.register_command || false,
            size: config.size || 54,
            type: config.inventory_type || "CHEST",
            permission: "",
            update_interval: config.update_interval || 0,
            open_commands: config.open_commands || [],
            close_commands: config.close_commands || [],

            args: [],
            args_usage_message: config.args_usage_message || "",
            arguments_support_placeholders: config.arguments_support_placeholders || false,
            parse_placeholders_after_arguments: config.parse_placeholders_after_arguments || false,
            argumentsRequirement: {
                requirements: [],
                deny_commands: [],
                success_commands: []
            },
            items: [],
            openRequirement: {
                requirements: [],
                deny_commands: [],
                success_commands: []
            }
        };

        // Helper to parse a single requirement object from YAML into UI object
        const parseRequirementObject = (req, id = "") => {
            const uiReq = { type: req.type || "", id: id };

            if (req.type === 'has permission' || req.type === '!has permission') {
                uiReq.permission = req.permission;
            } else if (req.type === 'has permissions') {
                uiReq.permissions = (Array.isArray(req.permissions) ? req.permissions.join(', ') : req.permissions) || "";
                uiReq.minimum = req.minimum;
            } else if (req.type === 'has money') {
                uiReq.amount = req.amount;
            } else if (req.type === 'has item') {
                uiReq.material = req.material;
                uiReq.amount = req.amount;
            } else if (req.type === 'has exp') {
                uiReq.amount = req.amount;
                uiReq.level = req.level || false;
            } else if (req.type === 'has meta') {
                uiReq.key = req.key;
                uiReq.metaType = req.meta_type;
                uiReq.value = req.value;
            } else if (['string', 'regex', '==', '!=', '>', '>=', '<', '<='].some(t => req.type?.includes(t))) {
                uiReq.input = req.input;
                if (req.type === 'string length') {
                    uiReq.min = req.min;
                    uiReq.max = req.max;
                } else {
                    uiReq.output = req.output || req.regex; // Handle 'regex' key alias
                }
            } else if (req.type === 'javascript') {
                uiReq.expression = req.expression;
            } else if (req.type?.includes('is near')) {
                uiReq.location = req.location;
                uiReq.distance = req.distance;
            } else if (req.type === 'is object') {
                uiReq.input = req.input;
                uiReq.objectType = req.object;
            }

            // Capture nested commands
            uiReq.deny_commands = req.deny_commands || [];
            uiReq.success_commands = req.success_commands || [];

            return uiReq;
        };

        // Parse open_requirement
        if (config.open_requirement) {
            if (config.open_requirement.requirements) {
                Object.entries(config.open_requirement.requirements).forEach(([key, req]) => {
                    settings.openRequirement.requirements.push(parseRequirementObject(req, key));
                });
            }
            settings.openRequirement.deny_commands = config.open_requirement.deny_commands || [];
            settings.openRequirement.success_commands = config.open_requirement.success_commands || [];

            // Backward compatibility for generic permission field
            const permReq = settings.openRequirement.requirements.find(r => r.type === 'has permission');
            if (permReq) {
                settings.permission = permReq.permission;
            }
        }
        // Legacy permission check if no open_requirement
        else if (config.permission) { // Some configs might just have 'permission' at top level though check
            // Note: DeluxeMenus usually puts permission inside open_requirement, but we check here just in case
        }

        // Convert old settings.permission fallback (from previous parseYaml)
        // If we didn't populate openRequirement but have logic in lines 332-334
        if (settings.openRequirement.requirements.length === 0 && config.open_requirement?.requirements?.permission?.permission) {
            settings.permission = config.open_requirement.requirements.permission.permission;
            settings.openRequirement.requirements.push({
                type: "has permission",
                permission: settings.permission
            });
        }

        // Parse args (Unified Structure)
        if (config.args) {
            const rawArgs = config.args;

            if (Array.isArray(rawArgs)) {
                // List Format (e.g. - arg1, - arg2: {...})
                rawArgs.forEach((arg) => {
                    if (arg === null || arg === undefined) return;

                    if (typeof arg === 'string') {
                        settings.args.push({ name: arg, requirements: [], deny_commands: [] });
                    } else if (typeof arg === 'object') {
                        // It is a map key inside list: { "argName": { requirements: ... } }
                        const argName = Object.keys(arg)[0];
                        const argPayload = arg[argName];
                        const uiArg = { name: argName, requirements: [], deny_commands: [] };

                        if (argPayload) {
                            // Parse requirements map
                            if (argPayload.requirements) {
                                Object.entries(argPayload.requirements).forEach(([key, req]) => {
                                    uiArg.requirements.push(parseRequirementObject(req, key));
                                });
                            }

                            // Legacy/Hybrid: If argument level deny_commands exist
                            if (argPayload.deny_commands) {
                                uiArg.deny_commands = argPayload.deny_commands;
                            }
                        }

                        settings.args.push(uiArg);
                    }
                });
            } else if (typeof rawArgs === 'object') {
                // Map Format (e.g. arg1: true, arg2: {...})
                Object.entries(rawArgs).forEach(([argName, argPayload]) => {
                    const uiArg = { name: argName, requirements: [], deny_commands: [] };

                    // If payload is object (complex arg)
                    if (argPayload && typeof argPayload === 'object') {
                        if (argPayload.requirements) {
                            Object.entries(argPayload.requirements).forEach(([key, req]) => {
                                uiArg.requirements.push(parseRequirementObject(req, key));
                            });
                        }
                        if (argPayload.deny_commands) {
                            uiArg.deny_commands = argPayload.deny_commands;
                        }
                    }
                    // If payload is primitive (e.g. true/null), it's a simple arg, just name is enough

                    settings.args.push(uiArg);
                });
            } else if (typeof rawArgs === 'string') {
                // Single string case (rare but possible old config)
                rawArgs.split(' ').forEach(arg => {
                    settings.args.push({ name: arg, requirements: [], deny_commands: [] });
                });
            }
        }

        // Skip arguments_requirement parsing as it is deprecated in favor of unified args

        // Parse items
        if (config.items && typeof config.items === 'object') {
            Object.entries(config.items).forEach(([key, item]) => {
                let slots = [];
                if (item.slots) {
                    if (Array.isArray(item.slots)) {
                        // Handle array inputs which might contain numbers or range strings
                        item.slots.forEach(s => {
                            if (typeof s === 'number') {
                                slots.push(s);
                            } else if (typeof s === 'string') {
                                if (s.includes('-')) {
                                    const [start, end] = s.split('-').map(Number);
                                    if (!isNaN(start) && !isNaN(end)) {
                                        for (let i = start; i <= end; i++) slots.push(i);
                                    }
                                } else {
                                    const val = parseInt(s);
                                    if (!isNaN(val)) slots.push(val);
                                }
                            }
                        });
                    } else if (typeof item.slots === 'string') {
                        // Handle ranges "1-5", "1,2,3"
                        const parts = item.slots.split(',');
                        parts.forEach(part => {
                            if (part.includes('-')) {
                                const [start, end] = part.split('-').map(Number);
                                for (let i = start; i <= end; i++) slots.push(i);
                            } else {
                                const val = parseInt(part);
                                if (!isNaN(val)) slots.push(val);
                            }
                        });
                    } else if (typeof item.slots === 'number') {
                        slots = [item.slots];
                    }
                } else if (typeof item.slot === 'number') {
                    slots = [item.slot];
                }

                if (slots.length > 0) {

                    // Material parsing - supports all formats per wiki:
                    // - Vanilla: STONE, DIAMOND_SWORD
                    // - Player heads: head-Notch, head-%player_name%
                    // - Base64 heads: basehead-eyJ...
                    // - Texture heads: texture-abc123...
                    // - HeadDatabase: hdb-12345
                    // - ItemsAdder: itemsadder-namespace:item_id
                    // - Oraxen: oraxen-item_id
                    // - Nexo: nexo-item_id
                    // - MMOItems: mmoitems-type:id
                    // - ExecutableItems: executableitems-item_id
                    // - ExecutableBlocks: executableblocks-item_id
                    // - SimpleItemGenerator: simpleitemgenerator-item_id
                    // - Placeholder: placeholder-%player_item_in_hand%
                    // - Equipment slots: main_hand, off_hand, armor_helmet, etc.
                    // - Special: air, water_bottle
                    let rawMaterial = item.material;
                    let material = "STONE";

                    if (rawMaterial) {
                        // Convert to string and trim
                        material = String(rawMaterial).trim();

                        // Keep as-is - material value is already in the correct format
                        // No transformation needed since all prefix formats are stored directly
                    }

                    const parsedItem = {
                        id: key, // Use the YAML key as the stable ID
                        slot: slots[0],
                        slots: slots,
                        material: material,
                        displayName: item.display_name || "",
                        lore: Array.isArray(item.lore) ? item.lore : [],
                        loreAppendMode: item.lore_append_mode || "OVERRIDE",
                        amount: item.amount || 1,
                        dynamicAmount: item.dynamic_amount || "",
                        damage: item.damage || item.data || 0,
                        modelData: item.model_data || 0,
                        priority: item.priority || 0,
                        update: item.update || false,
                        leftClickCommands: item.left_click_commands || [],
                        rightClickCommands: item.right_click_commands || [],
                        middleClickCommands: item.middle_click_commands || [],
                        shiftLeftClickCommands: item.shift_left_click_commands || [],
                        shiftRightClickCommands: item.shift_right_click_commands || [],
                        enchantments: (item.enchantments || []).map(e => {
                            const parts = e.split(';');
                            return { id: parts[0], level: parseInt(parts[1]) || 1 };
                        }),
                        hideEnchantments: item.hide_enchantments || false,
                        hideAttributes: item.hide_attributes || false,
                        hideTooltip: item.hide_tooltip || false,
                        enchantmentGlintOverride: item.enchantment_glint_override || false,
                        unbreakable: item.unbreakable || false,
                        glow: !!(item.hide_enchantments && item.enchantments && item.enchantments.length > 0),
                        color: item.color || "",
                        rgb: item.rgb || "",
                        itemFlags: item.item_flags || [],
                        entityType: item.entity_type || "",
                        baseColor: item.base_color || "",
                        potionEffects: (item.potion_effects || []).map(e => {
                            const parts = e.split(';');
                            return { effect: parts[0], duration: parseInt(parts[1]) || 0, amplifier: parseInt(parts[2]) || 0 };
                        }),
                        bannerMeta: (item.banner_meta || []).map(m => {
                            const parts = m.split(';');
                            return { color: parts[0], pattern: parts[1] };
                        }),
                    };





                    // Parse view requirement
                    if (item.view_requirement?.requirements) {
                        parsedItem.viewRequirements = [];
                        Object.values(item.view_requirement.requirements).forEach(req => {
                            parsedItem.viewRequirements.push(parseRequirementObject(req));
                        });
                    }

                    // Parse click requirement
                    if (item.click_requirement?.requirements) {
                        parsedItem.clickRequirements = [];
                        Object.values(item.click_requirement.requirements).forEach(req => {
                            parsedItem.clickRequirements.push(parseRequirementObject(req));
                        });
                        parsedItem.clickRequirementDenyCommands = item.click_requirement.deny_commands || [];
                        parsedItem.clickRequirementSuccessCommands = item.click_requirement.success_commands || [];
                    }

                    settings.items.push(parsedItem);
                }
            });
        }

        return { settings };
    } catch (e) {
        console.error("YAML Parse Error:", e);
        return { error: e.message };
    }
};
