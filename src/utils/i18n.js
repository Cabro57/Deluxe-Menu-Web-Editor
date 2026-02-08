// Internationalization (i18n) system for the application

const translations = {
    en: {
        // Header
        appName: "DM Generator",
        appDescription: "DeluxeMenus Editor",

        // Sidebar tabs
        settings: "Settings",
        items: "Items",

        // Menu Settings
        menuTitle: "Menu Title",
        menuTitlePlaceholder: "e.g. &8Server Selector",
        menuTitleHelp: "Supports color codes (e.g. &a, &#RRGGBB)",
        type: "Type",
        selectType: "Select type...",
        rows: "Rows",

        // Commands section
        commands: "Commands",
        openCommand: "Open Command",
        registerCommand: "Register as server command",
        permission: "Permission",
        arguments: "Arguments",
        updateInterval: "Update Interval (s)",
        updateIntervalHelp: "Time in seconds between updates. Set to 0 to disable.",
        openCommands: "Open Commands",
        closeCommands: "Close Commands",

        // Items section
        menuItems: "Menu Items",
        noItems: "No items yet",
        noItemsHint: "Click a slot to create one",

        // Properties
        properties: "Properties",
        slot: "Slot",
        material: "Material",
        displayName: "Display Name",
        lore: "Lore",
        amount: "Amount",
        customModelData: "Custom Model Data",

        // Actions
        back: "Back",
        createItem: "Create Item",
        deleteItem: "Delete Item",
        exportYaml: "Export to YAML",
        copyToClipboard: "Copy to Clipboard",
        close: "Close",

        // New Item Properties
        updateItem: "Update Item (Auto-refresh)",
        priority: "Priority",
        shiftLeftClickCommands: "Shift+Left Click Commands",
        shiftRightClickCommands: "Shift+Right Click Commands",
        clickRequirement: "Click Requirement",
        leftClickRequirement: "Left Click Requirement",
        rightClickRequirement: "Right Click Requirement",
        denyCommands: "Deny Commands",
        successCommands: "Success Commands",
        minimumRequirements: "Minimum Requirements",
        stopAtSuccess: "Stop At Success",
        enchantments: "Enchantments",
        attributes: "Attributes",
        hideEnchantments: "Hide Enchantments",
        hideAttributes: "Hide Attributes",
        unbreakable: "Unbreakable",
        glow: "Glow (Enchantment Glint)",

        // Grid info
        clickToEdit: "Click slot to edit",

        // Footer
        ready: "Ready",

        // Inventory types
        types: {
            CHEST: "Chest",
            HOPPER: "Hopper",
            DISPENSER: "Dispenser",
            DROPPER: "Dropper",
            ENDER_CHEST: "Ender Chest",
            BARREL: "Barrel",
            SHULKER_BOX: "Shulker Box",
            ANVIL: "Anvil",
            BEACON: "Beacon",
            BREWING_STAND: "Brewing Stand",
            FURNACE: "Furnace",
            BLAST_FURNACE: "Blast Furnace",
            SMOKER: "Smoker",
            WORKBENCH: "Crafting Table",
            ENCHANTING: "Enchanting Table",
            GRINDSTONE: "Grindstone",
            STONECUTTER: "Stonecutter",
            CARTOGRAPHY: "Cartography Table",
            LOOM: "Loom",
            SMITHING: "Smithing Table",
            MERCHANT: "Merchant",
        }
    },
    tr: {
        // Header
        appName: "DM Oluşturucu",
        appDescription: "DeluxeMenus Editörü",

        // Sidebar tabs
        settings: "Ayarlar",
        items: "Eşyalar",

        // Menu Settings
        menuTitle: "Menü Başlığı",
        menuTitlePlaceholder: "örn. &8Sunucu Seçici",
        menuTitleHelp: "Renk kodlarını destekler (örn. &a, &#RRGGBB)",
        type: "Tür",
        selectType: "Tür seçin...",
        rows: "Satır",

        // Commands section
        commands: "Komutlar",
        openCommand: "Açma Komutu",
        registerCommand: "Sunucu komutu olarak kaydet",
        permission: "İzin",
        arguments: "Argümanlar",
        updateInterval: "Güncelleme Aralığı (sn)",
        updateIntervalHelp: "Saniye cinsinden yenilenme süresi. Devre dışı bırakmak için 0 yapın.",
        openCommands: "Açılış Komutları",
        closeCommands: "Kapanış Komutları",

        // Items section
        menuItems: "Menü Eşyaları",
        noItems: "Henüz eşya yok",
        noItemsHint: "Oluşturmak için bir slota tıklayın",

        // Properties
        properties: "Özellikler",
        slot: "Slot",
        material: "Materyal",
        displayName: "Görünen Ad",
        lore: "Açıklama",
        amount: "Miktar",
        customModelData: "Özel Model Verisi",

        // Actions
        back: "Geri",
        createItem: "Eşya Oluştur",
        deleteItem: "Eşyayı Sil",
        exportYaml: "YAML Olarak Dışa Aktar",
        copyToClipboard: "Panoya Kopyala",
        close: "Kapat",

        // New Item Properties
        updateItem: "Eşyayı Güncelle (Oto-yenileme)",
        priority: "Öncelik (Priority)",
        shiftLeftClickCommands: "Shift+Sol Tık Komutları",
        shiftRightClickCommands: "Shift+Sağ Tık Komutları",
        clickRequirement: "Tıklama Gereksinimi",
        leftClickRequirement: "Sol Tık Gereksinimi",
        rightClickRequirement: "Sağ Tık Gereksinimi",
        denyCommands: "Red Komutları",
        successCommands: "Başarı Komutları",
        minimumRequirements: "Minimum Gereksinim",
        stopAtSuccess: "Başarıda Dur",
        enchantments: "Büyüler",
        attributes: "Nitelikler (Attributes)",
        hideEnchantments: "Büyüleri Gizle",
        hideAttributes: "Nitelikleri Gizle",
        unbreakable: "Kırılmaz (Unbreakable)",
        glow: "Parlat (Glow)",

        // Grid info
        clickToEdit: "Düzenlemek için slota tıklayın",

        // Footer
        ready: "Hazır",

        // Inventory types
        types: {
            CHEST: "Sandık",
            HOPPER: "Huni",
            DISPENSER: "Dağıtıcı",
            DROPPER: "Düşürücü",
            ENDER_CHEST: "Ender Sandığı",
            BARREL: "Fıçı",
            SHULKER_BOX: "Shulker Kutusu",
            ANVIL: "Örs",
            BEACON: "Fener",
            BREWING_STAND: "İksir Tezgahı",
            FURNACE: "Fırın",
            BLAST_FURNACE: "Yüksek Fırın",
            SMOKER: "Dumanlayıcı",
            WORKBENCH: "Çalışma Masası",
            ENCHANTING: "Büyü Masası",
            GRINDSTONE: "Biley Taşı",
            STONECUTTER: "Taş Kesici",
            CARTOGRAPHY: "Harita Masası",
            LOOM: "Dokuma Tezgahı",
            SMITHING: "Demirci Masası",
            MERCHANT: "Tüccar",
        }
    }
};

// Get nested translation
const getTranslation = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// Translation function
export const t = (key, lang = 'en') => {
    const translation = getTranslation(translations[lang], key);
    return translation || getTranslation(translations['en'], key) || key;
};

// Get all translations for a language
export const getLanguage = (lang = 'en') => translations[lang] || translations.en;

// Available languages
export const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

export default translations;
