
import { parseYaml, generateYaml } from '../src/utils/yamlHelper.js';
import assert from 'assert';

const testYaml = `
menu_title: 'Test Menu'
open_command: test
size: 54
args:
  - target
  - amount:
      requirements:
        amount_check:
          type: string length
          input: '%args_2%'
          min: 1
      deny_commands:
        - '[message] &cInvalid amount!'
args_usage_message: '&cUsage: /menu <target> <amount>'
arguments_support_placeholders: true
parse_placeholders_after_arguments: true
items:
  'test_item':
    material: STONE
    slot: 1
    display_name: 'Test Item'
`;

console.log("Testing YAML Parsing (Complex Args)...");
const { settings } = parseYaml(testYaml);
console.log("Parsed Settings Args:", JSON.stringify(settings.args, null, 2));
console.log("Parsed ArgumentsRequirement:", JSON.stringify(settings.argumentsRequirement, null, 2));

try {
  // Check Args Length
  assert.ok(Array.isArray(settings.args), "Args should be an array");
  assert.strictEqual(settings.args.length, 2, "Should have 2 args");

  // Check Arg Names
  assert.strictEqual(settings.args[0], "target");
  assert.strictEqual(settings.args[1], "amount");

  // Check Argument Requirements (Nested)
  // The UI model preserves the requirements list structure
  assert.ok(settings.argumentsRequirement, "Arguments requirement object should exist in settings");
  assert.ok(Array.isArray(settings.argumentsRequirement.requirements), "Requirements should be an array");

  // Arg 0 (target) has no requirements
  assert.ok(!settings.argumentsRequirement.requirements[0] || !settings.argumentsRequirement.requirements[0].type, "Arg 0 should have no requirements");

  // Arg 1 (amount) has requirements
  const req1 = settings.argumentsRequirement.requirements[1];
  assert.ok(req1, "Arg 1 should have requirements");
  assert.strictEqual(req1.type, "string length");
  assert.strictEqual(req1.min, 1);

  // Check Deny Commands for Arg 1
  // Note: The UI model (ArgumentsRequirementEditor) has a flat list of denyCommands?
  // Actually, the UI component separates per-arg requirements but specific per-arg deny_commands might need handling.
  // The current UI editor separates "Global Deny Commands".
  // The Wiki structure nests deny_commands per argument. 
  // If the user wants per-argument deny commands, we need to ensure our UI model supports it.
  // Looking at ArgumentsRequirementEditor, it has `denyCommands` prop as a LIST of strings.
  // Use case: deny_commands usually apply if the requirement fails.
  // In the Wiki example:
  // player:
  //   requirements: ...
  //   deny_commands: ...
  // This implies deny_commands are per-argument.

  // CURRENT UI LIMITATION: ArgumentsRequirementEditor seems to treat denyCommands globally or maybe I misread.
  // Let's re-read ArgumentsRequirementEditor to be sure.

  console.log("✅ YAML Parsing Passed!");

  console.log("Testing YAML Generation...");
  const generatedYaml = generateYaml(settings);
  console.log("Generated YAML:\n", generatedYaml);

  // Checks
  assert.ok(generatedYaml.includes("args:"), "Should contain args");
  assert.ok(generatedYaml.includes("- target"), "Should contain target (simple)");
  assert.ok(generatedYaml.includes("- amount:"), "Should contain amount (complex)");
  assert.ok(generatedYaml.includes("requirements:"), "Should contain requirements key");
  // Check for requirement name (might be unquoted or quoted depending on strictness, but block style implies key:)
  assert.ok(generatedYaml.includes("amount_check:"), "Should contain requirement name");

  console.log("✅ YAML Generation Passed!");

} catch (e) {
  console.error("❌ Test Failed:", e);
  console.error("Parsed Settings:", JSON.stringify(settings, null, 2));
  process.exit(1);
}
