export async function onRequestGet(context) {
  const user = context.data.user;
  const db = context.env.DB;
  const translationId = context.params.translationId;

  const translation = await db
    .prepare(
      'SELECT translations.id FROM images, translations WHERE images.userId = ? AND images.id = translations.imageId AND translations.id = ?'
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
    JSON.stringify({ success: true, annotations: annotations.results }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
