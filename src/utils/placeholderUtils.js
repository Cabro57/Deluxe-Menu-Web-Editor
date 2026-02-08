
/**
 * Utility for processing Minecraft placeholders in text and numbers.
 */

/**
 * Replaces placeholders in a string with their simulated values.
 * @param {string} text The text containing placeholders
 * @param {Array} placeholders Array of { key, value } objects
 * @param {boolean} simulationEnabled Whether simulation is active
 * @returns {string} The processed text
 */
export const processPlaceholders = (text, placeholders, simulationEnabled) => {
    if (!simulationEnabled || !text || !placeholders) return text;

    let result = String(text);
    placeholders.forEach(ph => {
        if (ph.key && ph.value !== undefined) {
            result = result.split(ph.key).join(ph.value);
        }
    });
    return result;
};

/**
 * Calculates the simulated amount for an item.
 * @param {Object} item The item object
 * @param {Array} placeholders Array of { key, value } objects
 * @param {boolean} simulationEnabled Whether simulation is active
 * @returns {number} The simulated amount
 */
export const getSimulatedAmount = (item, placeholders, simulationEnabled) => {
    if (!item) return 1;

    // If no dynamic amount or simulation disabled, return static amount
    if (!simulationEnabled || !item.dynamicAmount || !String(item.dynamicAmount).trim()) {
        return item.amount || 1;
    }

    // Process placeholders in the dynamic amount string
    const processed = processPlaceholders(item.dynamicAmount, placeholders, true);

    // Attempt to parse as integer
    const parsed = parseInt(processed);

    // If invalid, fallback to static amount
    if (isNaN(parsed)) return item.amount || 1;

    // Clamp between 1 and 64 for visual consistency (MC limit)
    return Math.max(1, Math.min(64, parsed));
};
