
import { parseYaml, generateYaml } from '../src/utils/yamlHelper.js';
import assert from 'assert';

const testYaml = `
menu_title: 'Args Test'
args:
  - arg1
  - 
`;
// Note: Empty line in list might be parsed as null? Or empty string?
// Standard YAML for empty string in list is tricky without quotes.
// output:
// args:
//   - arg1
//   - ""
// Let's test with empty string explicitly?

const testYaml2 = `
menu_title: 'Args Test'
args: ['arg1', '']
`;

console.log("Testing Empty Args Preservation...");
const { settings } = parseYaml(testYaml2);
console.log("Parsed Args:", JSON.stringify(settings.args));

try {
    assert.strictEqual(settings.args.length, 2, "Should have 2 args");
    assert.strictEqual(settings.args[1], "", "Second arg should be empty string");
    console.log("✅ Empty Args Test Passed!");
} catch (e) {
    console.error("❌ Test Failed:", e.message);
    process.exit(1);
}
