import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const hmac = crypto.createHmac(
      'sha256',
      process.env.GITHUB_WEBHOOK_SECRET || ''
    );
    const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8');
    const signature = Buffer.from(
      request.headers.get('x-hub-signature-256') as string,
      'utf8'
    );

    if (!crypto.timingSafeEqual(digest, signature)) {
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
