import html from '../translate/index.html';

export async function onRequestPost(context) {
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
