import { Button } from '@/components/ui/Button';
import { HGDLogo } from '@/components/ui/HGDLogo';

const NAV_LINKS = [
  { label: 'Home', active: true },
  { label: 'Firma' },
  { label: 'Equipo' },
  { label: 'Insights' },
  { label: 'Áreas' },
];

export function SiteNav() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 76,
        padding: '0 64px',
        background: 'rgba(29,29,29,0.86)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <HGDLogo height={36} />
      <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
        {NAV_LINKS.map((l) => (
          <a
            key={l.label}
            href="#"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              fontWeight: 500,
              color: l.active ? 'var(--accent)' : 'var(--text-secondary)',
              textDecoration: 'none',
            }}
          >
            {l.label}
          </a>
        ))}
        <Button variant="primary" size="sm">
          Contactar
        </Button>
      </nav>
    </header>
  );
}
