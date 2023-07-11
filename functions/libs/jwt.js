const sign = async (data, secret) => {
  const encoder = new TextEncoder();
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ data }));
  const dataBuffer = encoder.encode(`${header}.${payload}`);
  const secretBuffer = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    secretBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, dataBuffer);
  const signature = btoa(
    String.fromCharCode(...new Uint8Array(signatureBuffer))
  );
  return `${header}.${payload}.${signature}`;
};

const verify = async (token, secret) => {
  const [header, payload, signature] = token.split('.');
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(`${header}.${payload}`);
  const secretBuffer = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    secretBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const signatureBuffer = Uint8Array.from(atob(signature), (c) =>
    c.charCodeAt(0)
  );
  const verified = await crypto.subtle.verify(
    'HMAC',
    key,
    signatureBuffer,
    dataBuffer
  );

  if (!verified) {
    throw new Error('Invalid signature');
  } else {
    return JSON.parse(atob(payload)).data;
  }
};

export default {
  sign,
  verify,
};
