import { Avatar } from '@/components/ui/Avatar';
import { IconArrowRight } from '@/components/ui/Icons';

const TEAM = [
  { name: 'Francisco José Hurtado Langer', role: 'Socio Director' },
  { name: 'Fernando Gandini Ayerbe', role: 'Socio' },
  { name: 'Ana María Olave Díaz', role: 'Socia' },
];

export function Team() {
  return (
    <section style={{ padding: '0 64px 96px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <span className="hgd-eyebrow">Equipo</span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: '-0.02em',
            color: 'var(--white)',
            margin: '14px 0 0',
          }}
        >
          Socios y asociados
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {TEAM.map((t) => (
          <div
            key={t.name}
            style={{
              background: 'var(--charcoal)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: 28,
            }}
          >
            <Avatar name={t.name} square size={72} ring />
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 20,
                color: 'var(--white)',
                margin: '18px 0 4px',
              }}
            >
              {t.name}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              {t.role}
            </p>
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--accent)',
                textDecoration: 'none',
                marginTop: 16,
              }}
            >
              Ver perfil <IconArrowRight size={14} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
