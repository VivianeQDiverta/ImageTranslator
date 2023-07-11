import jwt from '../../libs/jwt.js';

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
    let imageId = await db
      .prepare('SELECT id FROM images WHERE data = ?')
      .bind(binaryImage)
      .first('id');
    if (!imageId) {
      // insert new image
      const res = await db
        .prepare('INSERT INTO images (data, userId) VALUES (?, ?)')
        .bind(binaryImage, user.id)
        .run();
      imageId = res.meta.last_row_id;
    }

    let translationId = await db
      .prepare(
        'SELECT id FROM translations WHERE imageId = ? AND targetLang = ?'
      )
      .bind(imageId, targetLang)
      .first('id');
    const date = new Date().toISOString();
    if (translationId) {
      // delete old annotations
      await db
        .prepare('DELETE FROM annotations WHERE translationId = ?')
        .bind(translationId)
        .run();
      // update translation
      await db
        .prepare('UPDATE translations SET date = ? WHERE id = ?')
        .bind(date, translationId)
        .run();
    } else {
      // insert new translation
      const res = await db
        .prepare(
          'INSERT INTO translations (imageId, targetLang, date) VALUES (?, ?, ?)'
        )
        .bind(imageId, targetLang, date)
        .run();
      translationId = res.meta.last_row_id;
    }

    // insert new annotations
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
          translationId
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
