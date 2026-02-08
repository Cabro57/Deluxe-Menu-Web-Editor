
import { generateYaml, parseYaml } from '../src/utils/yamlHelper.js';

console.log("Testing Dynamic Amount Persistence...");

const uiState = {
    title: 'Dynamic Amount Test',
    items: [
        {
            id: 'test_item',
            slot: 0,
            material: 'STONE',
            displayName: 'Test Item',
            dynamicAmount: '%player_level%'
        }
    ]
};

try {
    const yaml = generateYaml(uiState);
    console.log("YAML Output:\n", yaml);

    if (!yaml.includes("dynamic_amount: '%player_level%'")) {
        throw new Error("FAIL: dynamic_amount missing or incorrect in YAML");
    }

    // Check if static 'amount' is present. It should NOT be there if dynamicAmount is present.
    // Use regex to look for 'amount: ' at the start of a line (with indentation)
    if (/^\s*amount:\s+/m.test(yaml)) {
        throw new Error("FAIL: static 'amount' should be omitted when dynamic_amount is present");
    }

    console.log("SUCCESS: YAML Generation correct.");

    const parsed = parseYaml(yaml);
    const item = parsed.settings.items[0];

    console.log("Parsed dynamicAmount:", item.dynamicAmount);

    if (item.dynamicAmount !== '%player_level%') {
        throw new Error("FAIL: dynamicAmount lost after parsing");
    }

    console.log("SUCCESS: Dynamic Amount preserved.");

} catch (e) {
    console.error(e);
    process.exit(1);
}
