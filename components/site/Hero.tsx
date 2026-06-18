import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section style={{ padding: '120px 64px 100px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ maxWidth: 860 }}>
        <span className="hgd-eyebrow">Hurtado Gandini Dávalos · Abogados</span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 60,
            lineHeight: 1.08,
            letterSpacing: '-0.025em',
            color: 'var(--white)',
            margin: '24px 0 0',
          }}
        >
          HG es su aliado ideal para{' '}
          <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>hacer negocios</span>.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 20,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            margin: '28px 0 0',
            maxWidth: 660,
          }}
        >
          Resolvemos controversias complejas y de alto valor con excelencia profesional. Más de 20
          años de experiencia al servicio de su negocio.
        </p>
        <div style={{ display: 'flex', gap: 14, marginTop: 40 }}>
          <Button variant="secondary" size="lg">
            Nuestra Firma
          </Button>
          <Button variant="ghost" size="lg">
            Insights
          </Button>
        </div>
      </div>
    </section>
  );
}
