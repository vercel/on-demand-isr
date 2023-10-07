import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const hmac = crypto.createHmac(
      'sha256',
      process.env.GITHUB_WEBHOOK_SECRET || ''
    );
    const digest = 'sha256=' + hmac.update(text).digest('hex');
    const signature = request.headers.get('x-hub-signature-256') as string;
    const signatureBuffer = Buffer.from(
      signature.replace('sha256=', ''),
      'utf8'
    );

    if (!crypto.timingSafeEqual(Buffer.from(digest, 'utf8'), signatureBuffer)) {
      return new Response('Invalid signature.', {
        status: 400,
      });
    }

    const payload = JSON.parse(text);
    const issueNumber = payload.issue?.number;

    console.log('[Next.js] Revalidating /');
    revalidatePath('/');

    if (issueNumber) {
      console.log(`[Next.js] Revalidating /${issueNumber}`);
      revalidatePath(`/${issueNumber}`);
    }
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }

  return new Response('Success!', {
    status: 200,
  });
}
