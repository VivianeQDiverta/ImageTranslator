const sign = async (data, secret) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const secretBuffer = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    secretBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, dataBuffer);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
};

export default {
  sign,
};
