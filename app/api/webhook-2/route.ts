import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  revalidatePath('/');

  return new Response('Success!', {
    status: 200
  });
}
