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

export async function onRequestPost(context) {
  const token = context.request.headers.get('Authorization').split(' ')[1];
  const user = await verifyUser(token, context.env.SECRET, context.env.DB);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 500,
    });
  }

  const db = context.env.DB;
  const body = await context.request.json();
  const { annotations, binaryImage, targetLang } = body;
  try {
    const image = await db
      .prepare('INSERT INTO images (data, userId) VALUES (?, ?)')
      .bind(binaryImage, user.id)
      .run();
    const translation = await db
      .prepare('INSERT INTO translations (imageId, targetLang) VALUES (?, ?)')
      .bind(image.meta.last_row_id, targetLang)
      .run();

    const annotationsPromises = annotations.map((annotation) =>
      db
        .prepare(
          'INSERT INTO annotations (translated, x, y, fontSize, translationId) VALUES (?, ?, ?, ?, ?)'
        )
        .bind(
          annotation.translated,
          annotation.x,
          annotation.y,
          annotation.fontSize,
          translation.meta.last_row_id
        )
        .run()
    );
    await Promise.all(annotationsPromises);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: 'An error occured' }), {
      status: 500,
    });
  }
}
