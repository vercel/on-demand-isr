import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const text = await request.text();

    const signature = crypto
      .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET || '')
      .update(text)
      .digest('hex');

    const trusted = Buffer.from(`sha256=${signature}`, 'ascii');
    const untrusted = Buffer.from(
      request.headers.get('x-hub-signature-256') || '',
      'ascii'
    );

    if (!crypto.timingSafeEqual(trusted, untrusted)) {
      console.log('[Next.js] Invalid signature.', {
        trusted: trusted.toString('hex'),
        untrusted: untrusted.toString('hex'),
      });
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
