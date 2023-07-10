export async function onRequestPost(context) {
  const db = context.env.DB;
  const body = await context.request.json();
  const { username, password } = body;
  try {
    await db
      .prepare('INSERT INTO users (username, password) VALUES (?, ?)')
      .bind(username, password)
      .run();
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: 'Username already used' }), {
      status: 500,
    });
  }
}
