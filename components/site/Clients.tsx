const CLIENTS = [
  'Allianz',
  'Cargill',
  'Baxter',
  'Mapfre',
  'Banco Popular',
  'Riopaila Castilla',
  'Harinera del Valle',
  'Emcali',
  'Comfandi',
  'Propal',
  'Fortox',
  'Ventolini',
];

export function Clients() {
  return (
    <section
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--charcoal)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 64px' }}>
        <span className="hgd-eyebrow">Confían en nosotros</span>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '28px 52px',
            marginTop: 28,
            alignItems: 'center',
          }}
        >
          {CLIENTS.map((c) => (
            <span
              key={c}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 22,
                color: 'var(--text-secondary)',
                opacity: 0.7,
                letterSpacing: '0.01em',
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
