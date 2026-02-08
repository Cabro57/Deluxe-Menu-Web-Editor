
import { generateYaml } from '../src/utils/yamlHelper.js';

console.log("Testing Dynamic Amount with Number...");

const uiState = {
    title: 'Numeric Dynamic Amount Test',
    items: [
        {
            id: 'test_item',
            slot: 0,
            material: 'STONE',
            dynamicAmount: 10 // Numeric value
        }
    ]
};

try {
    const yaml = generateYaml(uiState);
    console.log("YAML Output:\n", yaml);
    console.log("SUCCESS: Handled numeric dynamicAmount.");
} catch (e) {
    console.error("CRASH DETECTED:", e.message);
    process.exit(1);
}
