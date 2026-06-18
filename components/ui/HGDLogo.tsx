import Image from 'next/image';

export interface HGDLogoProps {
  height?: number;
}

export function HGDLogo({ height = 34 }: HGDLogoProps) {
  return (
    <Image
      src="/logo-hgd.webp"
      alt="Hurtado Gandini Dávalos — Abogados"
      height={height}
      width={Math.round(height * 4.5)}
      priority
      style={{ height, width: 'auto', display: 'block' }}
    />
  );
}
