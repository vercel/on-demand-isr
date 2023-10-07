[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fleerob%2Fon-demand-isr&env=GITHUB_WEBHOOK_SECRET,GITHUB_APP_ID,GITHUB_APP_PK_PEM&envDescription=API%20keys%20needed%20to%20connect%20to%20the%20GitHub%20Application.&envLink=https%3A%2F%2Fgithub.com%2Fleerob%2Fon-demand-isr&demo-title=On-Demand%20ISR&demo-description=Demo%20of%20on-demand%20ISR%20in%20Next.js%2012.1%20using%20GitHub%20Issues.&demo-url=https%3A%2F%2Fon-demand-isr.vercel.app)

# On-Demand Incremental Static Regeneration

Demo of On-demand ISR in [Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data) using GitHub Issues. When a new issue is created, a webhook from a GitHub App _pushes_ new changes to the deployed application to regenerate the static page.

## Setup

1. Create a new [GitHub App](https://github.com/settings/apps/new)
   1. Provide the URL of your deployed application for Homepage URL
   1. Ensure Webhook "Active" is checked
   1. Add `<your-site>/api/webhook` as the Webhook URL
   1. Create a Webhook secret and add it to `.env.local` as `GITHUB_WEBHOOK_SECRET`
   1. Give "Read Only" access to Issues
   1. Subscribe to "Issues" events
1. Add the App ID to `.env.local` as `GITHUB_APP_ID`
1. Generate a private key and add it to `.env.local` as `GITHUB_APP_PK_PEM`
1. Install the newly created GitHub App for your repo
1. `https://github.com/settings/apps/<your-app-name>/installations`

## Running Locally

```bash
$ bun dev
```

## Learn More

- [Read the documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data)
