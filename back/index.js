hexToInt = (hex) => {
    // Ensure the hex string has an even length
    if (hex.length % 2 !== 0) {
        throw new Error('Invalid hex string');
    }
    // Convert the hex string to a buffer
    const buffer = new ArrayBuffer(7); // 4 bytes for a 32-bit float
    const view = new DataView(buffer);
    for (let i = 0; i < hex.length; i += 2) {
        const byte = parseInt(hex.substr(i, 2), 16);
        view.setUint8(i / 2, byte);
    }
    // Read the float from the buffer in big-endian format
    const float = view.getUint32(0, true); // true for little-endian
    return float;
}

console.log(hexToInt('049ce832986580'));


intToHex = (int) => {
    // Convert the float to a buffer in big-endian format
    const buffer = new ArrayBuffer(7); // 4 bytes for a 32-bit float
    const view = new DataView(buffer);
    view.setUint32(0, int, true); // true for little-endian
    // Convert the buffer to a hex string
    let hex = '';
    for (let i = 0; i < buffer.byteLength; i++) {
        const byte = view.getUint8(i).toString(16).padStart(2, '0');
        hex += byte;
    }
    return hex;
}

console.log(intToHex(854105092));

