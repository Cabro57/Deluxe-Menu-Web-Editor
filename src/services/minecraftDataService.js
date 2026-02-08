/**
 * Minecraft Data Service
 * Fetches data from PrismarineJS/minecraft-data repository
 * Based on: https://github.com/PrismarineJS/minecraft-data
 * 
 * Data Structure (per version):
 * - items.json: Array of items with id, name, displayName, stackSize
 * - blocks.json: Array of blocks with id, name, displayName, hardness, etc.
 * - foods.json: Array of foods with id, name, foodPoints, saturation
 * - enchantments.json: Array of enchantments with id, name, displayName, maxLevel
 * - entities.json: Array of entities with id, name, displayName, type
 * - effects.json: Array of effects with id, name, displayName, type
 * - biomes.json: Array of biomes with id, name, displayName
 * - recipes.json: Recipes indexed by result item id
 */

const BASE_URL = "https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc";

// Multi-purpose cache
const dataCache = {
    items: {},
    blocks: {},
    foods: {},
    enchantments: {},
    entities: {},
    effects: {},
    biomes: {},
    recipes: {}
};

// Version mappings (minecraft version -> data folder name)
// Full list from PrismarineJS/minecraft-data versions.json
export const VERSIONS = [
    {
        "id": "1.0",
        "name": "1.0",
        "value": "1.0",
        "dataVersion": 0
    },
    {
        "id": "1.1",
        "name": "1.1",
        "value": "1.1",
        "dataVersion": -78
    },
    {
        "id": "1.2.1",
        "name": "1.2.1",
        "value": "1.2.1",
        "dataVersion": -71
    },
    {
        "id": "1.2.2",
        "name": "1.2.2",
        "value": "1.2.2",
        "dataVersion": -70
    },
    {
        "id": "1.2.3",
        "name": "1.2.3",
        "value": "1.2.3",
        "dataVersion": -69
    },
    {
        "id": "1.2.4",
        "name": "1.2.4",
        "value": "1.2.4",
        "dataVersion": -68
    },
    {
        "id": "1.2.5",
        "name": "1.2.5",
        "value": "1.2.5",
        "dataVersion": -67
    },
    {
        "id": "1.3.1",
        "name": "1.3.1",
        "value": "1.3.1",
        "dataVersion": -55
    },
    {
        "id": "1.3.2",
        "name": "1.3.2",
        "value": "1.3.2",
        "dataVersion": -54
    },
    {
        "id": "1.4.2",
        "name": "1.4.2",
        "value": "1.4.2",
        "dataVersion": -48
    },
    {
        "id": "1.4.4",
        "name": "1.4.4",
        "value": "1.4.4",
        "dataVersion": -46
    },
    {
        "id": "1.4.6",
        "name": "1.4.6",
        "value": "1.4.6",
        "dataVersion": -43
    },
    {
        "id": "1.4.5",
        "name": "1.4.5",
        "value": "1.4.5",
        "dataVersion": -45
    },
    {
        "id": "1.4.7",
        "name": "1.4.7",
        "value": "1.4.7",
        "dataVersion": -42
    },
    {
        "id": "1.5.1",
        "name": "1.5.1",
        "value": "1.5.1",
        "dataVersion": -32
    },
    {
        "id": "1.5.2",
        "name": "1.5.2",
        "value": "1.5.2",
        "dataVersion": -31
    },
    {
        "id": "1.6.1",
        "name": "1.6.1",
        "value": "1.6.1",
        "dataVersion": -14
    },
    {
        "id": "1.6.2",
        "name": "1.6.2",
        "value": "1.6.2",
        "dataVersion": -13
    },
    {
        "id": "1.6.4",
        "name": "1.6.4",
        "value": "1.6.4",
        "dataVersion": -12
    },
    {
        "id": "1.7.2",
        "name": "1.7.2",
        "value": "1.7",
        "dataVersion": -4
    },
    {
        "id": "1.7.3",
        "name": "1.7.3",
        "value": "1.7",
        "dataVersion": 0
    },
    {
        "id": "1.7.4",
        "name": "1.7.4",
        "value": "1.7",
        "dataVersion": 6
    },
    {
        "id": "1.7.5",
        "name": "1.7.5",
        "value": "1.7",
        "dataVersion": 7
    },
    {
        "id": "1.7.6",
        "name": "1.7.6",
        "value": "1.7",
        "dataVersion": 10
    },
    {
        "id": "1.7.7",
        "name": "1.7.7",
        "value": "1.7",
        "dataVersion": 11
    },
    {
        "id": "1.7.8",
        "name": "1.7.8",
        "value": "1.7",
        "dataVersion": 12
    },
    {
        "id": "1.7.9",
        "name": "1.7.9",
        "value": "1.7",
        "dataVersion": 13
    },
    {
        "id": "1.7.10",
        "name": "1.7.10",
        "value": "1.7",
        "dataVersion": 18
    },
    {
        "id": "1.8",
        "name": "1.8",
        "value": "1.8",
        "dataVersion": 74
    },
    {
        "id": "1.8.1",
        "name": "1.8.1",
        "value": "1.8",
        "dataVersion": 80
    },
    {
        "id": "1.8.2",
        "name": "1.8.2",
        "value": "1.8",
        "dataVersion": 88
    },
    {
        "id": "1.8.3",
        "name": "1.8.3",
        "value": "1.8",
        "dataVersion": 89
    },
    {
        "id": "1.8.4",
        "name": "1.8.4",
        "value": "1.8",
        "dataVersion": 90
    },
    {
        "id": "1.8.5",
        "name": "1.8.5",
        "value": "1.8",
        "dataVersion": 91
    },
    {
        "id": "1.8.6",
        "name": "1.8.6",
        "value": "1.8",
        "dataVersion": 92
    },
    {
        "id": "1.8.7",
        "name": "1.8.7",
        "value": "1.8",
        "dataVersion": 93
    },
    {
        "id": "1.8.8",
        "name": "1.8.8",
        "value": "1.8",
        "dataVersion": 94
    },
    {
        "id": "1.8.9",
        "name": "1.8.9",
        "value": "1.8",
        "dataVersion": 95
    },
    {
        "id": "1.9",
        "name": "1.9",
        "value": "1.9",
        "dataVersion": 169
    },
    {
        "id": "1.9.1",
        "name": "1.9.1",
        "value": "1.9",
        "dataVersion": 175
    },
    {
        "id": "1.9.2",
        "name": "1.9.2",
        "value": "1.9.2",
        "dataVersion": 176
    },
    {
        "id": "1.9.3",
        "name": "1.9.3",
        "value": "1.9",
        "dataVersion": 183
    },
    {
        "id": "1.9.4",
        "name": "1.9.4",
        "value": "1.9.4",
        "dataVersion": 184
    },
    {
        "id": "1.10",
        "name": "1.10",
        "value": "1.10",
        "dataVersion": 510
    },
    {
        "id": "1.10.1",
        "name": "1.10.1",
        "value": "1.10.1",
        "dataVersion": 511
    },
    {
        "id": "1.10.2",
        "name": "1.10.2",
        "value": "1.10.2",
        "dataVersion": 512
    },
    {
        "id": "1.11",
        "name": "1.11",
        "value": "1.11",
        "dataVersion": 819
    },
    {
        "id": "1.11.1",
        "name": "1.11.1",
        "value": "1.11",
        "dataVersion": 921
    },
    {
        "id": "1.11.2",
        "name": "1.11.2",
        "value": "1.11.2",
        "dataVersion": 922
    },
    {
        "id": "1.12",
        "name": "1.12",
        "value": "1.12",
        "dataVersion": 1139
    },
    {
        "id": "1.12.1",
        "name": "1.12.1",
        "value": "1.12.1",
        "dataVersion": 1241
    },
    {
        "id": "1.12.2",
        "name": "1.12.2",
        "value": "1.12.2",
        "dataVersion": 1343
    },
    {
        "id": "1.13",
        "name": "1.13",
        "value": "1.13",
        "dataVersion": 1519
    },
    {
        "id": "1.13.1",
        "name": "1.13.1",
        "value": "1.13.1",
        "dataVersion": 1628
    },
    {
        "id": "1.13.2",
        "name": "1.13.2",
        "value": "1.13.2",
        "dataVersion": 1631
    },
    {
        "id": "1.14",
        "name": "1.14",
        "value": "1.14",
        "dataVersion": 1952
    },
    {
        "id": "1.14.1",
        "name": "1.14.1",
        "value": "1.14.1",
        "dataVersion": 1957
    },
    {
        "id": "1.14.2",
        "name": "1.14.2",
        "value": "1.14",
        "dataVersion": 1963
    },
    {
        "id": "1.14.3",
        "name": "1.14.3",
        "value": "1.14.3",
        "dataVersion": 1968
    },
    {
        "id": "1.14.4",
        "name": "1.14.4",
        "value": "1.14.4",
        "dataVersion": 1976
    },
    {
        "id": "1.15",
        "name": "1.15",
        "value": "1.15",
        "dataVersion": 2225
    },
    {
        "id": "1.15.1",
        "name": "1.15.1",
        "value": "1.15.1",
        "dataVersion": 2227
    },
    {
        "id": "1.15.2",
        "name": "1.15.2",
        "value": "1.15.2",
        "dataVersion": 2230
    },
    {
        "id": "1.16",
        "name": "1.16",
        "value": "1.16",
        "dataVersion": 2566
    },
    {
        "id": "1.16.1",
        "name": "1.16.1",
        "value": "1.16.1",
        "dataVersion": 2567
    },
    {
        "id": "1.16.2",
        "name": "1.16.2",
        "value": "1.16.2",
        "dataVersion": 2578
    },
    {
        "id": "1.16.3",
        "name": "1.16.3",
        "value": "1.16.3",
        "dataVersion": 2580
    },
    {
        "id": "1.16.4",
        "name": "1.16.4",
        "value": "1.16.4",
        "dataVersion": 2584
    },
    {
        "id": "1.16.5",
        "name": "1.16.5",
        "value": "1.16.5",
        "dataVersion": 2586
    },
    {
        "id": "1.17",
        "name": "1.17",
        "value": "1.17",
        "dataVersion": 2724
    },
    {
        "id": "1.17.1",
        "name": "1.17.1",
        "value": "1.17.1",
        "dataVersion": 2730
    },
    {
        "id": "1.18",
        "name": "1.18",
        "value": "1.18",
        "dataVersion": 2860
    },
    {
        "id": "1.18.1",
        "name": "1.18.1",
        "value": "1.18.1",
        "dataVersion": 2865
    },
    {
        "id": "1.18.2",
        "name": "1.18.2",
        "value": "1.18.2",
        "dataVersion": 2975
    },
    {
        "id": "1.19",
        "name": "1.19",
        "value": "1.19",
        "dataVersion": 3105
    },
    {
        "id": "1.19.1",
        "name": "1.19.1",
        "value": "1.19",
        "dataVersion": 3117
    },
    {
        "id": "1.19.2",
        "name": "1.19.2",
        "value": "1.19.2",
        "dataVersion": 3120
    },
    {
        "id": "1.19.3",
        "name": "1.19.3",
        "value": "1.19.3",
        "dataVersion": 3218
    },
    {
        "id": "1.19.4",
        "name": "1.19.4",
        "value": "1.19.4",
        "dataVersion": 3337
    },
    {
        "id": "1.20",
        "name": "1.20",
        "value": "1.20",
        "dataVersion": 3463
    },
    {
        "id": "1.20.1",
        "name": "1.20.1",
        "value": "1.20.1",
        "dataVersion": 3465
    },
    {
        "id": "1.20.2",
        "name": "1.20.2",
        "value": "1.20.2",
        "dataVersion": 3578
    },
    {
        "id": "1.20.3",
        "name": "1.20.3",
        "value": "1.20.3",
        "dataVersion": 3698
    },
    {
        "id": "1.20.4",
        "name": "1.20.4",
        "value": "1.20.4",
        "dataVersion": 3700
    },
    {
        "id": "1.20.5",
        "name": "1.20.5",
        "value": "1.20.5",
        "dataVersion": 3837
    },
    {
        "id": "1.20.6",
        "name": "1.20.6",
        "value": "1.20.6",
        "dataVersion": 3839
    },
    {
        "id": "1.21",
        "name": "1.21",
        "value": "1.21",
        "dataVersion": 3953
    },
    {
        "id": "1.21.1",
        "name": "1.21.1",
        "value": "1.21.1",
        "dataVersion": 3955
    },
    {
        "id": "1.21.2",
        "name": "1.21.2",
        "value": "1.21",
        "dataVersion": 4080
    },
    {
        "id": "1.21.3",
        "name": "1.21.3",
        "value": "1.21.3",
        "dataVersion": 4082
    },
    {
        "id": "1.21.4",
        "name": "1.21.4",
        "value": "1.21.4",
        "dataVersion": 4189
    },
    {
        "id": "1.21.5",
        "name": "1.21.5",
        "value": "1.21.5",
        "dataVersion": 4325
    },
    {
        "id": "1.21.6",
        "name": "1.21.6",
        "value": "1.21.6",
        "dataVersion": 4435
    },
    {
        "id": "1.21.7",
        "name": "1.21.7",
        "value": "1.21",
        "dataVersion": 4438
    },
    {
        "id": "1.21.8",
        "name": "1.21.8",
        "value": "1.21.8",
        "dataVersion": 4440
    },
    {
        "id": "1.21.9",
        "name": "1.21.9",
        "value": "1.21.9",
        "dataVersion": 4554
    },
    {
        "id": "1.21.10",
        "name": "1.21.10",
        "value": "1.21.10",
        "dataVersion": 4556
    },
    {
        "id": "1.21.11",
        "name": "1.21.11",
        "value": "1.21",
        "dataVersion": 4671
    }
];

/**
 * Generic fetch function for any minecraft-data JSON file
 */
const fetchData = async (dataType, version, transformer = null) => {
    const versionConfig = VERSIONS.find(v => v.id === version);
    const apiVersion = versionConfig ? versionConfig.value : version;

    // Check cache
    if (dataCache[dataType]?.[apiVersion]) {
        return dataCache[dataType][apiVersion];
    }

    try {
        const response = await fetch(`${BASE_URL}/${apiVersion}/${dataType}.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${dataType} for version ${version}`);
        }

        const data = await response.json();
        const result = transformer ? transformer(data) : data;

        // Cache result
        if (!dataCache[dataType]) dataCache[dataType] = {};
        dataCache[dataType][apiVersion] = result;

        return result;
    } catch (error) {
        console.error(`Minecraft Data Fetch Error (${dataType}):`, error);
        return transformer ? transformer([]) : [];
    }
};

/**
 * Get items for a specific version
 * Returns: Array of { id, name, displayName, stackSize }
 */
export const getMinecraftItems = async (version = "1.20.4") => {
    return fetchData("items", version, (data) => {
        const items = Array.isArray(data) ? data : [];
        return items.map(item => ({
            id: item.id,
            name: item.name.toUpperCase().replace(/ /g, "_"),
            displayName: item.displayName,
            stackSize: item.stackSize || 64
        }));
    });
};

/**
 * Get blocks for a specific version
 * Returns: Array of { id, name, displayName, hardness, diggable, transparent }
 */
export const getMinecraftBlocks = async (version = "1.20.4") => {
    return fetchData("blocks", version, (data) => {
        const blocks = Array.isArray(data) ? data : [];
        return blocks.map(block => ({
            id: block.id,
            name: block.name.toUpperCase().replace(/ /g, "_"),
            displayName: block.displayName,
            hardness: block.hardness,
            diggable: block.diggable,
            transparent: block.transparent,
            stackSize: block.stackSize || 64
        }));
    });
};

/**
 * Get block names as a Set for fast lookup
 */
export const getMinecraftBlocksSet = async (version = "1.20.4") => {
    const blocks = await getMinecraftBlocks(version);
    return new Set(blocks.map(b => b.name));
};

/**
 * Get foods for a specific version
 * Returns: Array of { id, name, displayName, foodPoints, saturation }
 */
export const getMinecraftFoods = async (version = "1.20.4") => {
    return fetchData("foods", version, (data) => {
        const foods = Array.isArray(data) ? data : [];
        return foods.map(food => ({
            id: food.id,
            name: food.name.toUpperCase().replace(/ /g, "_"),
            displayName: food.displayName,
            foodPoints: food.foodPoints,
            saturation: food.saturation,
            effectiveQuality: food.effectiveQuality
        }));
    });
};

/**
 * Get enchantments for a specific version
 * Returns: Array of { id, name, displayName, maxLevel, category }
 */
export const getMinecraftEnchantments = async (version = "1.20.4") => {
    return fetchData("enchantments", version, (data) => {
        const enchants = Array.isArray(data) ? data : [];
        return enchants.map(ench => ({
            id: ench.id,
            name: ench.name.toUpperCase().replace(/ /g, "_"),
            displayName: ench.displayName,
            maxLevel: ench.maxLevel,
            category: ench.category,
            exclude: ench.exclude || []
        }));
    });
};

/**
 * Get entities for a specific version
 * Returns: Array of { id, name, displayName, type, width, height }
 */
export const getMinecraftEntities = async (version = "1.20.4") => {
    return fetchData("entities", version, (data) => {
        const entities = Array.isArray(data) ? data : [];
        return entities.map(entity => ({
            id: entity.id,
            name: entity.name,
            displayName: entity.displayName,
            type: entity.type,
            width: entity.width,
            height: entity.height,
            category: entity.category
        }));
    });
};

/**
 * Get effects (potion effects) for a specific version
 * Returns: Array of { id, name, displayName, type }
 */
export const getMinecraftEffects = async (version = "1.20.4") => {
    return fetchData("effects", version, (data) => {
        const effects = Array.isArray(data) ? data : [];
        return effects.map(effect => ({
            id: effect.id,
            name: effect.name.toUpperCase().replace(/ /g, "_"),
            displayName: effect.displayName,
            type: effect.type
        }));
    });
};

/**
 * Get biomes for a specific version
 * Returns: Array of { id, name, displayName, rainfall, temperature }
 */
export const getMinecraftBiomes = async (version = "1.20.4") => {
    return fetchData("biomes", version, (data) => {
        const biomes = Array.isArray(data) ? data : [];
        return biomes.map(biome => ({
            id: biome.id,
            name: biome.name,
            displayName: biome.displayName,
            rainfall: biome.rainfall,
            temperature: biome.temperature,
            category: biome.category
        }));
    });
};

// ============================================
// Block Detection Utilities
// ============================================

// Global blocks set for synchronous checks
let globalBlocksSet = null;
let blocksFetchPromise = null;
let currentBlocksVersion = null;

/**
 * Initialize blocks data (call this early in app lifecycle)
 */
export const initBlocksData = async (version = "1.20.4") => {
    // If already fetching same version, return existing promise
    if (blocksFetchPromise && currentBlocksVersion === version) {
        return blocksFetchPromise;
    }

    currentBlocksVersion = version;
    blocksFetchPromise = getMinecraftBlocksSet(version).then(blocks => {
        globalBlocksSet = blocks;
        return blocks;
    });

    return blocksFetchPromise;
};

/**
 * Synchronous check if material is a block (uses cached data)
 * Note: Call initBlocksData() first to populate the cache
 */
export const isBlockMaterial = (materialName) => {
    if (!materialName) return false;
    if (!globalBlocksSet) return false;
    return globalBlocksSet.has(materialName.toUpperCase().replace(/ /g, "_"));
};

/**
 * Async check with auto-initialization
 */
export const checkIsBlock = async (materialName, version = "1.20.4") => {
    if (!materialName) return false;

    if (!globalBlocksSet || currentBlocksVersion !== version) {
        await initBlocksData(version);
    }

    return globalBlocksSet.has(materialName.toUpperCase().replace(/ /g, "_"));
};

// ============================================
// Version Utilities
// ============================================

/**
 * Check if version A is newer than version B
 */
export const isNewerVersion = (versionA, versionB) => {
    const configA = VERSIONS.find(v => v.id === versionA);
    const configB = VERSIONS.find(v => v.id === versionB);

    if (!configA || !configB) return false;
    return configA.dataVersion > configB.dataVersion;
};

/**
 * Get the default/latest version
 */
export const getDefaultVersion = () => {
    return VERSIONS[VERSIONS.length - 1].id;
};

/**
 * Get version config by id
 */
export const getVersionConfig = (versionId) => {
    return VERSIONS.find(v => v.id === versionId);
};
