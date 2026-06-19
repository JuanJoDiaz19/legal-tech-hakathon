import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mobius — Análisis de demandas de responsabilidad civil extracontractual',
  description:
    'Herramienta de IA jurídica de Hurtado Gandini Davalos para análisis estratégico de demandas de responsabilidad civil extracontractual. Régimen aplicable, causales de exoneración, valoración del perjuicio y vinculación de terceros.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=boska@300,301,400,401,500,501,700,701,900,901&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
