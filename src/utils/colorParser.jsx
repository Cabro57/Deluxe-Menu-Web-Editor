const COLOR_MAP = {
    '0': '#000000',
    '1': '#0000AA',
    '2': '#00AA00',
    '3': '#00AAAA',
    '4': '#AA0000',
    '5': '#AA00AA',
    '6': '#FFAA00',
    '7': '#AAAAAA',
    '8': '#555555',
    '9': '#5555FF',
    'a': '#55FF55',
    'b': '#55FFFF',
    'c': '#FF5555',
    'd': '#FF55FF',
    'e': '#FFFF55',
    'f': '#FFFFFF',
};

const FORMAT_MAP = {
    'l': 'font-bold',
    'm': 'line-through',
    'n': 'underline',
    'o': 'italic',
};

export const parseMinecraftColors = (text) => {
    if (!text) return null;

    const parts = text.split(/(&[0-9a-fk-or])/g);
    const spans = [];

    let currentColor = '#FFFFFF'; // Default white
    let currentFormats = [];

    parts.forEach((part, index) => {
        if (part.startsWith('&') && part.length > 1) {
            const code = part[1].toLowerCase();

            if (COLOR_MAP[code]) {
                currentColor = COLOR_MAP[code];
                // Reset formats on color change usually, or does MC keep them? 
                // MC resets formats on color change.
                currentFormats = [];
            } else if (FORMAT_MAP[code]) {
                currentFormats.push(FORMAT_MAP[code]);
            } else if (code === 'r') {
                currentColor = '#FFFFFF';
                currentFormats = [];
            }
        } else if (part.length > 0) {
            spans.push(
                <span
                    key={index}
                    style={{ color: currentColor }}
                    className={`${currentFormats.join(' ')} drop-shadow-md`}
                >
                    {part}
                </span>
            );
        }
    });

    return spans;
};
