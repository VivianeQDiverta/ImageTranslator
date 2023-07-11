export async function onRequestGet(context) {
    const db = context.env.DB;
    const user = context.user;
    const translations = await db
        .prepare('SELECT * FROM images, translations WHERE userId = ? AND images.id = translations.imageId')
        .bind(user.id)
        .all();
    
    return new Response(JSON.stringify({ translations }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}