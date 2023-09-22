function extrinsicHandler(actionType, formData) {
    switch(actionType) {
        case 'teleport':
            return handleTeleport(formData);
        case 'swap':
            return handleSwap(formData);
        // ... other cases
    }
}

function handleTeleport(formData: any) {
    throw new Error("Function not implemented.");
}
function handleSwap(formData: any) {
    throw new Error("Function not implemented.");
}

