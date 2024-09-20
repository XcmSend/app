import { v4 as uuidv4 } from 'uuid';

// Function to generate a custom ID
function generateCustomId(fieldType) {
    // Generate a UUID and take the first 5 characters
    const shortUuid = uuidv4().replace(/-/g, '').substring(0, 5);
    // Return the ID with the field type prepended
    return `${fieldType}-${shortUuid}`;
}

export default generateCustomId;