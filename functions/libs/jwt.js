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
  const base64sign = btoa(String.fromCharCode(...new Uint8Array(signature)));
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ data }));
  return `${header}.${payload}.${base64sign}`; 
};

export default {
  sign,
};
