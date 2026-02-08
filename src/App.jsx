import React, { useState, useMemo, useCallback } from "react";
import EditorLayout from "./layouts/EditorLayout";
import InventoryGrid from "./features/editor/InventoryGrid";
import SidebarItems from "./features/editor/SidebarItems";
import SidebarProperties from "./features/editor/SidebarProperties";
import SidebarMenuSettings from "./features/editor/SidebarMenuSettings";
import InlineYamlEditor from "./features/editor/InlineYamlEditor";
import { Package, Settings, Grid3X3, Code, Download, Upload } from "lucide-react";
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import YamlPreview from "./features/editor/YamlPreview";
import { t } from "./utils/i18n";
import SiteSettingsModal from "./components/modals/SiteSettingsModal";
import PlaceholderSimulator from "./features/editor/PlaceholderSimulator";
import { generateYaml, parseYaml } from "./utils/yamlHelper";

// Load local backgrounds
const localBackgrounds = import.meta.glob('./assets/backround/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' });
const bgUrls = Object.values(localBackgrounds);
const randomBg = bgUrls.length > 0 ? bgUrls[Math.floor(Math.random() * bgUrls.length)] : "https://images6.alphacoders.com/133/1338694.png";

// Default YAML template
const DEFAULT_YAML = `menu_title: "&8Deluxe Menu"
open_command: menu
register_command: true
size: 54
items: {}
`;

function App() {
  // ============================================
  // YAML as Single Source of Truth
  // ============================================
  const [yamlSource, setYamlSource] = useState(DEFAULT_YAML);

  // Parse YAML to get data for UI (memoized for performance)
  const menuSettings = useMemo(() => {
    const result = parseYaml(yamlSource);
    if (result.settings) {
      return result.settings;
    }
    // Return default if parse fails
    return {
      title: "&8Deluxe Menu",
      type: "CHEST",
      size: 54,
      open_command: "menu",
      register_command: true,
      items: [],
      permission: "",
      args: ""
    };
  }, [yamlSource]);

  // Helper to update YAML via callback
  const updateMenuSettings = useCallback((updater) => {
    const current = parseYaml(yamlSource).settings || menuSettings;
    let newSettings;

    if (typeof updater === 'function') {
      newSettings = updater(current);
    } else {
      newSettings = { ...current, ...updater };
    }

    if (newSettings) {
      const newYaml = generateYaml(newSettings);
      setYamlSource(newYaml);
    }
  }, [yamlSource, menuSettings]);

  // Site Settings (Version, etc.)
  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('dm_site_settings');
    return saved ? JSON.parse(saved) : { version: "1.20.4" };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showYamlPreview, setShowYamlPreview] = useState(false);
  const [lang, setLang] = useState('en');

  // Left Sidebar Mode: 'items' or 'settings' or 'properties'
  const [sidebarMode, setSidebarMode] = useState('settings');

  // Center View Mode: 'gui' or 'yaml'
  const [centerView, setCenterView] = useState('gui');

  // Simulator State
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulationEnabled, setSimulationEnabled] = useState(false);
  const [placeholders, setPlaceholders] = useState([
    { key: '%player_name%', value: 'Notch' },
    { key: '%player_health%', value: '20' },
    { key: '%vault_eco_balance%', value: '1000' }
  ]);

  // Jump to YAML line logic
  const [scrollToLine, setScrollToLine] = useState(null);

  const handleJumpToYaml = useCallback((itemId) => {
    // Switch to YAML view
    setCenterView('yaml');

    // Find line number
    const lines = yamlSource.split('\n');
    let lineNum = -1;

    // Regex to find "  item_id:" or "  'item_id':" with optional whitespace
    // We assume items are defined as keys under 'items' section
    const regex = new RegExp(`^\\s*["']?${itemId}["']?:\\s*$`);

    for (let i = 0; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        lineNum = i + 1; // 1-based
        break;
      }
    }

    if (lineNum > 0) {
      setScrollToLine(lineNum);
      // Reset scroll trigger after a delay so it can be triggered again for same line
      setTimeout(() => setScrollToLine(null), 1000);
    }
  }, [yamlSource]);

  // Wrapper for menu settings update to catch actions
  const handleMenuSettingsUpdate = useCallback((newSettings) => {
    if (newSettings._action === 'EXPORT') {
      setShowYamlPreview(true);
      return;
    }
    // Update YAML with new settings
    const newYaml = generateYaml(newSettings);
    setYamlSource(newYaml);
  }, []);

  // Compute selected item based on ID
  const selectedItem = menuSettings.items.find(i => i.id === selectedItemId);

  const handleSlotSelect = useCallback((slotId) => {
    // Find item occupying this slot and select by its ID
    const itemAtSlot = menuSettings.items.find(i => i.slot === slotId || (i.slots && i.slots.includes(slotId)));
    if (itemAtSlot) {
      setSelectedItemId(itemAtSlot.id);
    } else {
      // No item at slot, but we can create one - for now, just deselect
      setSelectedItemId(null);
    }
    setSidebarMode('properties'); // auto switch to properties
  }, [menuSettings.items]);

  const handleBackToItems = useCallback(() => {
    setSelectedItemId(null);
    setSidebarMode('items');
  }, []);

  const handleUpdateItem = useCallback((index, updatedItem) => {
    updateMenuSettings(prev => {
      const newItems = [...prev.items];
      if (index >= 0 && index < newItems.length) {
        newItems[index] = updatedItem;
      }
      return { ...prev, items: newItems };
    });
  }, [updateMenuSettings]);

  const handleCreateItem = useCallback((slot = null) => {
    updateMenuSettings(prev => {
      let targetSlot = slot;

      // If no slot specified, find first empty
      if (targetSlot === null) {
        for (let i = 0; i < prev.size; i++) {
          if (!prev.items.find(item => item.slot === i || (item.slots && item.slots.includes(i)))) {
            targetSlot = i;
            break;
          }
        }
      }

      // If still null (full) or invalid, do nothing
      if (targetSlot === null || targetSlot >= prev.size) return prev;

      // Use item_slot format
      const finalId = `item_${targetSlot}`;

      const newItem = {
        id: finalId,
        slot: targetSlot,
        material: 'STONE',
        displayName: '&fNew Item',
        amount: 1,
        dynamicAmount: '',
        priority: 0,
        lore: [],
        modelData: 0
      };

      // Select the new item after creation
      setTimeout(() => setSelectedItemId(finalId), 0);

      return { ...prev, items: [...prev.items, newItem] };
    });
  }, [updateMenuSettings]);

  const handleDeleteItem = useCallback((itemId) => {
    updateMenuSettings(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
    // If we deleted the selected item, deselect
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    }
  }, [updateMenuSettings, selectedItemId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (!over) return;

    const activeSlot = parseInt(active.id.replace('item-', ''));
    const overSlot = parseInt(over.data.current.index);

    if (activeSlot === overSlot) return;

    updateMenuSettings(prev => {
      const newItems = [...prev.items];

      // Find items containing these slots
      const activeItemIndex = newItems.findIndex(i => i.slot === activeSlot || (i.slots && i.slots.includes(activeSlot)));
      const overItemIndex = newItems.findIndex(i => i.slot === overSlot || (i.slots && i.slots.includes(overSlot)));

      if (activeItemIndex === -1) return prev;

      // Prevent moving item onto itself (e.g. multi-slot item dragging one part to another part of same item)
      if (activeItemIndex === overItemIndex) return prev;

      const activeItem = newItems[activeItemIndex];
      const activeShift = overSlot - activeSlot;

      // Update Active Item
      const newActiveItem = {
        ...activeItem,
        slot: activeItem.slot + activeShift,
        slots: activeItem.slots ? activeItem.slots.map(s => s + activeShift) : undefined
      };

      // If target has item, swap it back
      if (overItemIndex > -1) {
        const overItem = newItems[overItemIndex];
        const overShift = activeSlot - overSlot; // Inverse of activeShift

        const newOverItem = {
          ...overItem,
          slot: overItem.slot + overShift,
          slots: overItem.slots ? overItem.slots.map(s => s + overShift) : undefined
        };
        newItems[overItemIndex] = newOverItem;
      }

      newItems[activeItemIndex] = newActiveItem;

      return { ...prev, items: newItems };
    });
  }, [updateMenuSettings]);

  // Handle YAML import
  const handleYamlImport = useCallback((yamlContent) => {
    const result = parseYaml(yamlContent);
    if (result.settings) {
      // Set YAML directly - this is the source of truth
      setYamlSource(yamlContent);
    } else {
      alert('Invalid YAML file: ' + result.error);
    }
  }, []);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <EditorLayout
        bgImage={randomBg}
        lang={lang}
        onLanguageChange={setLang}
        sidebarLeft={
          <div className="flex flex-col h-full">

            <div className="flex-1 overflow-y-auto px-5">
              {sidebarMode === 'settings' ? (
                <SidebarMenuSettings
                  settings={menuSettings}
                  onUpdate={handleMenuSettingsUpdate}
                  lang={lang}
                  onNavigateToItems={() => setSidebarMode('items')}
                  itemCount={menuSettings.items.length}
                />
              ) : sidebarMode === 'items' ? (
                <SidebarItems
                  items={menuSettings.items}
                  onSelectItem={(itemId) => {
                    setSelectedItemId(itemId);
                    setSidebarMode('properties');
                  }}
                  selectedItemId={selectedItemId}
                  onCreateItem={() => handleCreateItem(null)}
                  onDeleteItem={(itemId) => handleDeleteItem(itemId)}
                  onBack={() => setSidebarMode('settings')}
                  onJumpToYaml={handleJumpToYaml}
                  placeholders={placeholders}
                  simulationEnabled={simulationEnabled}
                  showMaterialTooltip={siteSettings.showMaterialTooltip !== false}
                />
              ) : (
                <SidebarProperties
                  selectedItemId={selectedItemId}
                  items={menuSettings.items}
                  onUpdateItem={handleUpdateItem}
                  onCreateItem={handleCreateItem}
                  onDeleteItem={handleDeleteItem}
                  onBack={handleBackToItems}
                  menuSize={menuSettings.size}
                />
              )}
            </div>
          </div>
        }
        content={
          <div className="flex flex-col items-center justify-center h-full space-y-4 relative overflow-auto custom-scrollbar p-8">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
              <div className="flex gap-1 p-1 bg-surface/80 backdrop-blur-xl rounded-lg border border-white/10 shadow-lg">
                <button
                  onClick={() => setCenterView('gui')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${centerView === 'gui'
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-textMuted hover:text-text hover:bg-white/10'
                    }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  GUI
                </button>
                <button
                  onClick={() => setCenterView('yaml')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${centerView === 'yaml'
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-textMuted hover:text-text hover:bg-white/10'
                    }`}
                >
                  <Code className="w-4 h-4" />
                  YAML
                </button>
              </div>

              <div className="w-px h-8 bg-white/10" />

              <div className="flex gap-1 p-1 bg-surface/80 backdrop-blur-xl rounded-lg border border-white/10 shadow-lg">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-textMuted hover:text-text hover:bg-white/10 transition-all duration-200"
                  title="Site Settings & Version"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-white/10 my-auto mx-1" />
                <button
                  onClick={() => setShowSimulator(true)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${simulationEnabled ? 'text-primary bg-primary/10' : 'text-textMuted hover:text-text hover:bg-white/10'}`}
                >
                  <Code className="w-4 h-4" />
                  Simulator
                </button>
                <div className="w-px h-6 bg-white/10 my-auto mx-1" />
                <button
                  onClick={() => setShowYamlPreview(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-textMuted hover:text-text hover:bg-white/10 transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-textMuted hover:text-text hover:bg-white/10 transition-all duration-200 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Import
                  <input
                    type="file"
                    accept=".yml,.yaml"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const yamlContent = event.target?.result;
                          if (yamlContent) {
                            handleYamlImport(yamlContent);
                          }
                        };
                        reader.readAsText(file);
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </div>

            <div className={`relative z-10 transform-gpu transition-all duration-300 mt-12 ${centerView === 'yaml' ? 'w-full px-8' : ''}`}>
              {centerView === 'gui' ? (
                <div key="gui" className="animate-in fade-in zoom-in-95 duration-300">
                  <InventoryGrid
                    rows={menuSettings.size / 9}
                    selectedSlot={selectedItem?.slot ?? null}
                    onSlotClick={handleSlotSelect}
                    items={menuSettings.items}
                    title={menuSettings.title}
                    type={menuSettings.type}
                    lang={lang}
                    simulationEnabled={simulationEnabled}
                    placeholders={placeholders}
                    showMaterialTooltip={siteSettings.showMaterialTooltip !== false}
                  />
                </div>
              ) : (
                <div key="yaml" className="animate-in fade-in zoom-in-95 duration-300">
                  <InlineYamlEditor
                    yamlSource={yamlSource}
                    onYamlChange={setYamlSource}
                    scrollToLine={scrollToLine}
                  />
                </div>
              )}
            </div>
          </div>
        }
      />

      {showYamlPreview && (
        <YamlPreview
          settings={menuSettings}
          onClose={() => setShowYamlPreview(false)}
          onApply={(newSettings) => {
            const newYaml = generateYaml(newSettings);
            setYamlSource(newYaml);
            setShowYamlPreview(false);
          }}
        />
      )}

      <PlaceholderSimulator
        isOpen={showSimulator}
        onClose={() => setShowSimulator(false)}
        placeholders={placeholders}
        setPlaceholders={setPlaceholders}
        enabled={simulationEnabled}
        setEnabled={setSimulationEnabled}
      />

      <SiteSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={siteSettings}
        onUpdate={(newSettings) => {
          setSiteSettings(newSettings);
          localStorage.setItem('dm_site_settings', JSON.stringify(newSettings));
        }}
      />
    </DndContext>
  );
}

export default App;
