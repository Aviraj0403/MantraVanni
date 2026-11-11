// SECURITY NOTE: this AES key ships inside the public JS bundle, so the "encrypted" settings payload is
// OBFUSCATION ONLY (it hides the JSON from casual network inspection). Anyone can recover the key.
// Never rely on it for secrecy: the public settings endpoint must only ever return non-sensitive data.
// Web Crypto API AES-256-CBC Decryption (runs natively in all modern browsers without third-party dependencies)
const HEX_KEY = '139e217a64457c40b16d4c3999460e88e51b04680c6073a8083b6261efac7465';

const hexToBytes = (hex) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
};

/**
 * Decrypts an encrypted token (iv:ciphertext in hex) returned by the backend
 */
export const decryptSettingsPayload = async (token) => {
  try {
    if (!token || typeof token !== 'string' || !token.includes(':')) {
      return null;
    }

    const [ivHex, cipherHex] = token.split(':');
    const iv = hexToBytes(ivHex);
    const cipherData = hexToBytes(cipherHex);
    const rawKey = hexToBytes(HEX_KEY);

    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      rawKey,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      cryptoKey,
      cipherData
    );

    const dec = new TextDecoder();
    const jsonStr = dec.decode(decryptedBuffer);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.warn('Failed to decrypt settings payload:', error);
    return null;
  }
};

