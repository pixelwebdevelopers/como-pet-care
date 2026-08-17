import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CoMo Pet Care',
  description:
    'Manage bookings, clients, pets, payments, and daily schedule from one simple place.',
  icons: {
    icon: '/assets/favicon.png',
    shortcut: '/assets/favicon.png',
    apple: '/assets/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
