import jwt from '../libs/jwt.js';

const verifyUser = async (token, secret, db) => {
  try {
    const username = await jwt.verify(token, secret);
    const user = await db
      .prepare('SELECT id, username FROM users WHERE username = ?')
      .bind(username)
      .first();
    return user;
  } catch (e) {
    return null;
  }
};

export async function onRequest(context) {
  try {
    const token = decodeURIComponent(
      context.request.headers.get('Authorization')
    ).split(' ')[1];
    const user = await verifyUser(token, context.env.SECRET, context.env.DB);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 500,
      });
    }
    context.data.user = user;
    return await context.next();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 500,
    });
  }
}
