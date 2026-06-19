// Genera 4 imágenes decorativas con Gemini Image (gemini-2.5-flash-image)
// para la sección "La lógica defensiva, instrumentada" del homepage.
//
// Uso:
//   1. Agrega GEMINI_API_KEY a .env.local (obtenla en https://aistudio.google.com/apikey)
//   2. node --env-file=.env.local scripts/generate-feature-images.mjs
//
// Salida: public/features/{regimen,exoneracion,perjuicio,terceros}.png

import fs from 'node:fs/promises';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-2.5-flash-image';

const STYLE_BRIEF = `
Editorial dark-mode legal-tech still life. The viewer must immediately recognize MODERN LEGAL DOCUMENTS being read and instrumented by an AI tool. Aesthetic constraints (apply to every image):

SUBJECT — modern legal paperwork, NOT antique manuscripts:
- Crisp contemporary printed legal documents on bone-white paper (#f5f5f0): a "DEMANDA" or "CONTESTACIÓN" cover page, a court filing brief, a multi-page complaint, a contract spread, a damages schedule (tabla de perjuicios), an evidence index. Pages must show clear modern structural cues: a top header band, a horizontal divider line, ordered paragraphs with hanging indents and visible enumeration glyphs (the printed numerals 1. 2. 3. or article markers like "ART. 12"), short text blocks with consistent line spacing, a signature block with a thin signature line at the bottom, folio stamps in the corner (e.g. "f. 24"), small round official seals in oxblood ink, paperclips or staples at the top edge.
- Text on the pages must be illegible (blurred, simulated typography, no real words) but the LAYOUT must clearly read as a printed legal brief, not parchment or a casebook.

AI / TECH INSTRUMENTATION — must be obvious enough to read as "analysis tool" at a glance:
- Thin precise oxblood bounding boxes (rectangles with 90° corner ticks) wrapping specific paragraphs on the document, like an AI selection highlight.
- Small floating analysis cards / chips hovering beside the document in the negative space: minimal bone-colored rectangles with three short redacted lines and a tiny icon (triangle, circle, square, crosshair). Each card connects to a bounding box by a hairline oxblood vector with a small arrowhead.
- Faint horizontal highlight tints (very subtle warm cream wash) behind one or two paragraphs.
- A thin analytical sidebar rule running along one edge of the document with tiny tick marks and a tiny graph glyph or "01 / 04" indicator.
- The tech overlay is FLAT 2D linework rendered as if projected onto the photograph — no glow, no neon, no hologram, no 3D screens.

PALETTE & FINISH:
- Background: deep charcoal (#1d1d1d) with subtle photographic grain, never pure black.
- Accent color: oxblood red (#801817) used for bounding boxes, vectors, official seals, underlines, and the brightest highlight.
- Document paper: bone / ivory (#f5f5f0). Secondary materials: brushed brass paperclip, dark leather corner of a dossier, matte black pen.
- Composition: top-down or slight three-quarter overhead view of the document on a charcoal desk, restrained and asymmetric, generous negative space for the floating analysis cards, cinematic raking side light, museum editorial mood. High contrast, matte finish, thin precise linework.
- Landscape 16:9 composition.

STRICTLY AVOID: gavels, scales of justice, Lady Justice statues, courthouses, classical columns, judges, wigs, robes, antique vellum, leather-bound codices, illuminated manuscripts, quill pens, wax-only compositions without printed pages, glowing holograms, neon, circuit boards, matrix code rain, 3D UI screens, tablets, laptops, monitors, cartoon style, isometric illustration, stock-photo handshakes. No people, no readable words, no logos, no brand marks.
`.trim();

const FEATURES = [
  {
    slug: 'regimen',
    prompt: `
${STYLE_BRIEF}

Scene: Two pages of a modern printed legal brief lie side by side on a charcoal desk, slight three-quarter overhead view, cinematic raking light from the left. Each page is unmistakably a Colombian-style legal filing: a thin top header band, a horizontal divider, ordered paragraphs with visible enumeration glyphs (printed "ART. 2341" on the left page, "ART. 2356" on the right page — those exact short tokens are the only legible text, mimicking the Civil Code articles for subjective vs. objective liability), short blurred paragraph blocks beneath them, a folio stamp "f. 12" in one corner, a small round oxblood official seal stamped in the margin. A vertical oxblood divider line runs precisely down the gutter between the two pages — a decision boundary. On the left page one paragraph is wrapped in a thin oxblood bounding box with 90° corner ticks; on the right page another paragraph is wrapped the same way. A single hairline oxblood vector arcs across the gutter connecting the two boxes. In the right negative space, two minimal bone-colored analysis cards float, each labeled only with three short redacted line glyphs and a tiny icon (a small circle on one, a small filled square on the other), connected to their respective bounding boxes by hairline vectors. A subtle "01 / 02" indicator sits in the upper margin. Evoke "régimen de responsabilidad": the AI is comparing subjective vs. objective liability regimes within the complaint.
`.trim(),
  },
  {
    slug: 'exoneracion',
    prompt: `
${STYLE_BRIEF}

Scene: A single page of a modern printed legal complaint ("DEMANDA" header band visible at top, the word "DEMANDA" is the only legible text) lies flat on a charcoal desk, slight overhead three-quarter view, cinematic side light. The page shows ordered numbered paragraphs (1., 2., 3., visible enumeration glyphs) with blurred body text. Three separate paragraphs are wrapped in thin oxblood bounding boxes with 90° corner ticks. From each bounding box, a hairline oxblood vector arrow points outward into the surrounding charcoal negative space, terminating at a small floating bone-colored analysis card. Each card contains three short redacted text glyphs and one tiny distinct icon: a triangle (force majeure), a small circle (victim's own fault), a small filled square (third party). A subtle warm cream highlight wash sits faintly behind the three flagged paragraphs. A signature line and a small oxblood circular seal occupy the lower right corner. A brass paperclip pinches the upper edge. A faint analytical sidebar rule with tick marks runs down the right side of the page. Evoke "causales de exoneración": the AI surfacing exonerating defenses extracted from the complaint.
`.trim(),
  },
  {
    slug: 'perjuicio',
    prompt: `
${STYLE_BRIEF}

Scene: A modern printed damages schedule (a "tabla de perjuicios") lies flat on a charcoal desk, top-down view, cinematic warm side light. The document is clearly a contemporary spreadsheet-style legal annex: a thin header band with the label "PERJUICIOS" (the only legible text), three vertical columns of right-aligned monetary figures rendered as crisp but illegible digit glyphs in a monospace font, a horizontal divider line under the header, alternating subtle row tints, a folio stamp in the upper corner. Three specific figures in the middle and right columns are circled in oxblood ink; two of those have a thin oxblood strikethrough. In the right negative space, three small floating bone-colored analysis chips hover, each containing a single short blurred digit line and a tiny downward oxblood arrow icon — proposed recalculated values. Hairline oxblood vectors connect each chip to its corresponding circled figure. A faint analytical sidebar with tick marks runs along the right edge of the page. A small oxblood round seal sits in the lower right corner. Evoke "cuestionamiento del perjuicio": the AI auditing and recalculating inflated damages line by line.
`.trim(),
  },
  {
    slug: 'terceros',
    prompt: `
${STYLE_BRIEF}

Scene: Top-down view of a charcoal desk. At the center sits a closed modern legal dossier — a slim cardstock folder with a printed cover label band reading "DEMANDA" (the only legible text), a small oxblood official round seal in the corner, a brass paperclip at the top edge. Arranged asymmetrically around the central dossier, four smaller printed legal document pages or thin folders fan outward, each with its own miniature cover label band (blurred text, no readable words) and a small folio stamp; each represents a third party (a contractor, a manufacturer, an employer, an insurer). Thin oxblood vector lines with small arrowheads radiate from the central dossier outward to each peripheral document, forming an asymmetric case-linkage graph. One connection — running to the upper right peripheral document — is rendered in a brighter, slightly thicker oxblood line and terminates in a small bounding box around that document's label (the focal "llamamiento en garantía"). Beside two of the connections, minimal bone-colored analysis chips float with three redacted line glyphs and a tiny icon. A faint analytical grid underlays the composition in very thin charcoal-on-charcoal lines. Evoke "vinculación de terceros": the AI mapping additional parties that should be brought into the case.
`.trim(),
  },
];

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      'Missing GEMINI_API_KEY. Add it to .env.local and run with:\n' +
        '  node --env-file=.env.local scripts/generate-feature-images.mjs',
    );
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });
  const outDir = path.resolve('public/features');
  await fs.mkdir(outDir, { recursive: true });

  for (const feature of FEATURES) {
    const outPath = path.join(outDir, `${feature.slug}.png`);
    process.stdout.write(`→ ${feature.slug} ... `);

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: feature.prompt,
      config: {
        imageConfig: {
          aspectRatio: '16:9',
        },
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData?.data);

    if (!imagePart?.inlineData?.data) {
      console.log('FAILED (no image returned)');
      console.log('Response parts:', JSON.stringify(parts, null, 2).slice(0, 500));
      continue;
    }

    const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
    await fs.writeFile(outPath, buffer);
    console.log(`saved (${(buffer.length / 1024).toFixed(0)} KB)`);
  }

  console.log('\nDone. Files in public/features/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
