import { Card } from '@/components/ui/Card';
import { IconArrowRight } from '@/components/ui/Icons';

const PRACTICE_AREAS = [
  {
    key: 'litigios',
    label: 'Litigios',
    desc: 'Resolución de conflictos y arbitraje en controversias contractuales, comerciales y complejas.',
  },
  {
    key: 'laboral',
    label: 'Laboral',
    desc: 'Derecho laboral individual y colectivo y de la seguridad social.',
  },
  {
    key: 'compliance',
    label: 'Compliance',
    desc: 'Compliance y gestión del riesgo, SAGRILAFT y prevención de riesgos corporativos.',
  },
  {
    key: 'seguros',
    label: 'Seguros',
    desc: 'Defensa y consultoría para aseguradoras y tomadores en el ramo asegurador.',
  },
  {
    key: 'tributario',
    label: 'Tributario',
    desc: 'Planeación fiscal, controversias con la DIAN y estructuración tributaria.',
  },
  {
    key: 'deportivo',
    label: 'Deportivo',
    desc: 'Derecho deportivo y del entretenimiento, contratación y disputas.',
  },
  {
    key: 'corporativo',
    label: 'Corporativo',
    desc: 'Derecho de la empresa, las organizaciones y los negocios.',
  },
  {
    key: 'patrimonio',
    label: 'Patrimonio',
    desc: 'Gestión del patrimonio de familia, sucesiones y protección de activos.',
  },
  {
    key: 'maritimo',
    label: 'Marítimo',
    desc: 'Derecho marítimo y portuario, transporte y responsabilidad operativa.',
  },
];

export function PracticeAreas() {
  return (
    <section style={{ padding: '24px 64px 96px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <span className="hgd-eyebrow">Áreas de práctica</span>
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
          Experticia integral
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {PRACTICE_AREAS.map((a) => (
          <Card key={a.key} interactive>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 22,
                color: 'var(--white)',
                margin: '0 0 10px',
              }}
            >
              {a.label}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                margin: '0 0 18px',
              }}
            >
              {a.desc}
            </p>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--accent)',
              }}
            >
              Conocer más <IconArrowRight size={15} />
            </span>
          </Card>
        ))}
      </div>
    </section>
  );
}
