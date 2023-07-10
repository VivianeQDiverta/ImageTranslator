import bcrypt from './libs/bcrypt.min.js';
import jwt from './libs/jwt.js'

export async function onRequestPost(context) {
  const db = context.env.DB;
  const secret = context.env.SECRET;
  const body = await context.request.json();
  const { username, password } = body;
  try {
    const hash = await db
      .prepare('SELECT password FROM users WHERE username = ?')
      .bind(username)
      .first('password');
    if (!hash) {
      return new Response(JSON.stringify({ error: 'Username not found' }), {
        status: 500,
      });
    }

    const match = bcrypt.compareSync(password, hash);
    if (!match) {
      return new Response(JSON.stringify({ error: 'Wrong password' }), {
        status: 500,
      });
    }

    const token = await jwt.sign(username, secret);
    return new Response(JSON.stringify({ success: true, token }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: 'An error occured' }), {
      status: 500,
    });
  }
}
