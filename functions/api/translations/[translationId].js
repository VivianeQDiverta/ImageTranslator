export async function onRequestGet(context) {
  const user = context.data.user;
  const db = context.env.DB;
  const translationId = context.params.translationId;

  const translation = await db
    .prepare(
      'SELECT data, targetLang FROM images, translations WHERE images.userId = ? AND images.id = translations.imageId AND translations.id = ?'
    )
    .bind(user.id, translationId)
    .first();
  if (!translation) {
    return new Response(JSON.stringify({ error: 'Translation not found' }), {
      status: 404,
    });
  }

  const annotations = await db
    .prepare(
      'SELECT translated, x, y, fontSize FROM annotations WHERE translationId = ?'
    )
    .bind(translationId)
    .all();

  return new Response(
    JSON.stringify({
      success: true,
      annotations: JSON.stringify(annotations.results),
      binaryImage: translation.data,
      targetLang: translation.targetLang,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function onRequestDelete(context) {
  const user = context.data.user;
  const db = context.env.DB;
  const translationId = context.params.translationId;

  const translation = await db
    .prepare(
      'SELECT data, targetLang, imageId FROM images, translations WHERE images.userId = ? AND images.id = translations.imageId AND translations.id = ?'
    )
    .bind(user.id, translationId)
    .first();
  if (!translation) {
    return new Response(JSON.stringify({ error: 'Translation not found' }), {
      status: 404,
    });
  }

  const associatedTranslations = await db
    .prepare('SELECT translations.id FROM translations WHERE imageId = ?')
    .bind(translation.imageId)
    .all();

  await db
    .prepare('DELETE FROM annotations WHERE translationId = ?')
    .bind(translationId)
    .run();
  await db
    .prepare('DELETE FROM translations WHERE id = ?')
    .bind(translationId)
    .run();

  if (associatedTranslations.results.length === 1) {
    await db
      .prepare('DELETE FROM images WHERE id = ?')
      .bind(translation.imageId)
      .run();
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
