
(async () => {
    try {
        const { generateYaml, parseYaml } = await import('../src/utils/yamlHelper.js');
        console.log("Starting Final Verification...");

        const uiState = {
            title: 'Final Fix Test',
            args: [
                { name: 'simple', requirements: [], deny_commands: [] },
                {
                    name: 'complex',
                    requirements: [
                        {
                            id: 'req1',
                            type: 'has money',
                            amount: 100,
                            deny_commands: ['[message] &cNo money']
                        }
                    ],
                    deny_commands: []
                }
            ]
        };

        // 1. Generate YAML
        const yaml = generateYaml(uiState);
        console.log("Generated YAML:\n", yaml);

        // 2. Verify Format (Map vs List)
        if (yaml.includes('- complex')) {
            throw new Error("FAIL: Dash present for complex arg (Should be Map)");
        }
        if (!yaml.includes('complex:')) {
            throw new Error("FAIL: complex key missing");
        }
        if (!yaml.includes('simple: true')) {
            throw new Error("FAIL: simple arg not mapped to true");
        }
        if (!yaml.includes('deny_commands:')) {
            throw new Error("FAIL: deny_commands key missing");
        }

        // 3. Verify Parsing Back
        const parsed = parseYaml(yaml);
        const args = parsed.settings.args;

        console.log("Parsed Args:", JSON.stringify(args, null, 2));

        if (args.length !== 2) {
            throw new Error(`FAIL: Expected 2 args, got ${args.length}`);
        }

        const simpleArg = args.find(a => a.name === 'simple');
        const complexArg = args.find(a => a.name === 'complex');

        if (!simpleArg) throw new Error("FAIL: simple arg lost in parsing");
        if (!complexArg) throw new Error("FAIL: complex arg lost in parsing");

        if (complexArg.requirements.length !== 1) {
            throw new Error("FAIL: Requirements lost for complex arg");
        }

        if (complexArg.requirements[0].deny_commands[0] !== '[message] &cNo money') {
            throw new Error("FAIL: Nested deny command lost or incorrect");
        }

        console.log("SUCCESS: All checks passed.");

    } catch (e) {
        console.error("CRITICAL ERROR:", e);
        process.exit(1);
    }
})();
