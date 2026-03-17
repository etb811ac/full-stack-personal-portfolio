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

  const body = await res.json();

  if (!res.ok || !body.success) {
    console.error('Web3Forms error:', body);
    return Response.json({ error: body.message ?? 'Failed to send message.' }, { status: 500 });
  }

  return Response.json({ success: true });
}
