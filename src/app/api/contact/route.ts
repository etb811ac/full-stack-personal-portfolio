export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json();

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: process.env.WEB3FORMS_KEY,
      name,
      email,
      subject,
      message,
    }),
  });

  if (!res.ok) {
    return Response.json({ error: 'Failed to send message.' }, { status: 500 });
  }

  return Response.json({ success: true });
}
