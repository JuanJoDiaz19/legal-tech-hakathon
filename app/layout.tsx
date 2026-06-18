import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HGD Abogados — Hurtado Gandini Dávalos',
  description:
    'Firma de abogados corporativa en Colombia. Más de 20 años resolviendo controversias complejas y de alto valor.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
