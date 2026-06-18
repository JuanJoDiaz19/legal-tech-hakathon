import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { HGDLogo } from '@/components/ui/HGDLogo';

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

export function SiteFooter() {
  const addr: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    lineHeight: 1.7,
    color: 'var(--text-secondary)',
    margin: 0,
  };
  return (
    <footer style={{ background: 'var(--color-bg)' }}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '72px 64px 40px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr 1.4fr',
          gap: 48,
        }}
      >
        <div>
          <HGDLogo height={32} />
          <p style={{ ...addr, margin: '20px 0 16px', maxWidth: 250 }}>
            Firma de abogados corporativa. Más de 20 años resolviendo controversias complejas y de
            alto valor.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            (57) 316 041 7827
          </p>
          <a
            href="mailto:contacto@hgdsas.com"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            contacto@hgdsas.com
          </a>
        </div>
        <FooterCol title="Bogotá">
          <p style={addr}>
            Carrera 7 # 71-21
            <br />
            Of. 509, Torre B
            <br />
            Edificio Avenida Chile
            <br />
            <span style={{ color: 'var(--text-disabled)' }}>Lun–Vie · 8:00–17:00</span>
          </p>
        </FooterCol>
        <FooterCol title="Cali">
          <p style={addr}>
            Calle 22 Norte # 6AN-24
            <br />
            Of. 901
            <br />
            Edificio Santa Mónica Central
            <br />
            <span style={{ color: 'var(--text-disabled)' }}>Lun–Vie · 8:00–17:00</span>
          </p>
        </FooterCol>
        <FooterCol title="Boletín">
          <p style={{ ...addr, margin: '0 0 14px' }}>Recibe nuestros análisis jurídicos.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input placeholder="tu@empresa.com" />
            <Button>Inscribirse</Button>
          </div>
        </FooterCol>
      </div>
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '24px 64px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              color: 'var(--text-disabled)',
            }}
          >
            © 2026 Hurtado Gandini Davalos Abogados S.A.S.
          </span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Seguridad y privacidad', 'Términos y condiciones', 'SAGRILAFT'].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
