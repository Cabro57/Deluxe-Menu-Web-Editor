import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOJANG_URL = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json";
const PRISMARINE_VERSIONS_URL = "https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/common/versions.json";
const PROTOCOL_VERSIONS_URL = "https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/common/protocolVersions.json";
const TARGET_FILE = path.join(__dirname, '../src/services/minecraftDataService.js');

async function main() {
    console.log("Fetching versions...");
    const [mojangRes, prismarineRes, protocolRes] = await Promise.all([
        fetch(MOJANG_URL),
        fetch(PRISMARINE_VERSIONS_URL),
        fetch(PROTOCOL_VERSIONS_URL)
    ]);

    const mojangData = await mojangRes.json();
    const supportedVersions = new Set(await prismarineRes.json());
    const protocolData = await protocolRes.json();

    const versionMap = {};
    protocolData.forEach(p => {
        versionMap[p.minecraftVersion] = p;
    });

    const releases = mojangData.versions.filter(v => v.type === 'release');

    // Sort Oldest to Newest
    releases.reverse();

    const versions = [];

    const findMapping = (id) => {
        if (supportedVersions.has(id)) return id;

        const parts = id.split('.');
        if (parts.length === 3) {
            const majorMinor = `${parts[0]}.${parts[1]}`;
            if (supportedVersions.has(majorMinor)) return majorMinor;
        }

        if (id.startsWith('1.7.')) return supportedVersions.has('1.7') ? '1.7' : id;
        if (id.startsWith('1.8.')) return supportedVersions.has('1.8') ? '1.8' : id;
        if (id.startsWith('1.9.')) return supportedVersions.has('1.9') ? '1.9' : id;
        if (id.startsWith('1.10.')) return supportedVersions.has('1.10') ? '1.10' : id;
        if (id.startsWith('1.11.')) return supportedVersions.has('1.11') ? '1.11' : id;
        if (id.startsWith('1.12.')) return supportedVersions.has('1.12') ? '1.12' : id;
        if (id.startsWith('1.13.')) return supportedVersions.has('1.13') ? '1.13' : id;

        return id;
    };

    releases.forEach(rel => {
        const id = rel.id;
        const mapping = findMapping(id);

        let dataVersion = 0;
        if (versionMap[id] && versionMap[id].dataVersion) {
            dataVersion = versionMap[id].dataVersion;
        } else if (versionMap[id] && versionMap[id].version) {
            // Fallback for sorting if needed, but keeping simplistic for now
            dataVersion = 0;
        }

        versions.push({
            id: id,
            name: id,
            value: mapping,
            dataVersion: dataVersion
        });
    });

    // Indent with 4 spaces to match file style
    const jsonStr = JSON.stringify(versions, null, 4);

    let fileContent = fs.readFileSync(TARGET_FILE, 'utf-8');

    const regex = /export const VERSIONS = \[[\s\S]*?\];/;

    if (!regex.test(fileContent)) {
        console.error("Could not find VERSIONS array in target file.");
        process.exit(1);
    }

    const newContent = fileContent.replace(regex, `export const VERSIONS = ${jsonStr};`);

    fs.writeFileSync(TARGET_FILE, newContent);
    console.log(`Successfully updated ${versions.length} versions in ${TARGET_FILE}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
