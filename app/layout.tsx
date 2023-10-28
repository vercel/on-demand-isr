import '../styles/globals.css';

export const metadata = {
  title: 'On-Demand Incremental Static Regeneration with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
