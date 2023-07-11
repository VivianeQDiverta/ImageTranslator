export async function onRequestGet(context) {
  const user = context.data.user;
  const db = context.env.DB;
  const translations = await db
    .prepare(
      'SELECT translations.id, data, targetLang, date FROM images, translations WHERE images.userId = ? AND images.id = translations.imageId'
    )
    .bind(user.id)
    .all();
  return new Response(
    JSON.stringify({ success: true, translations: translations.results }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function onRequestPost(context) {
  const user = context.data.user;
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
