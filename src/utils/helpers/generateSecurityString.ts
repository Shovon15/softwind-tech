// Uses the built-in Web Crypto API (browser and Node 18+) instead of Node's
// `crypto` module, which made the bundler ship a ~120KB crypto-browserify
// polyfill to the client. Output is unchanged: a 32-byte hex nonce and its
// HMAC-SHA256 hex signature.
const toHex = (buffer: ArrayBuffer | Uint8Array) =>
  Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );

const generateSecurityString = async () => {
  const apiSecret = process.env.NEXT_PUBLIC_API_SECRET;

  if (!apiSecret) {
    throw new Error("API_SECRET_KEY is not set");
  }

  const nonce = toHex(globalThis.crypto.getRandomValues(new Uint8Array(32)));

  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(apiSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = toHex(
    await globalThis.crypto.subtle.sign("HMAC", key, encoder.encode(nonce)),
  );

  return { nonce, signature };
};

export default generateSecurityString;
