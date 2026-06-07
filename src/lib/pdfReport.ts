import { jsPDF } from 'jspdf';

/**
 * FrankCalculator — premium vector PDF report generator.
 *
 * Everything here is drawn programmatically with jsPDF (sharp vector text +
 * shapes at any zoom). No rasterized screenshots. Charts (donut / bars) are
 * hand-drawn from the same numeric data the on-screen charts use so the report
 * stays crisp and on-brand.
 *
 * The design language: a clean light "paper" body with a striking dark branded
 * header, a multi-colour accent rule using the FrankCalculator palette, a hero result
 * block, KPI cards, vector charts, an itemized breakdown table, a "Your inputs"
 * panel, key-insight notes and a footer on every page.
 */

/* ----------------------------------------------------------------------- */
/* Public types                                                            */
/* ----------------------------------------------------------------------- */

export interface PdfStat {
  label: string;
  value: string;
  sub?: string;
}

export interface PdfBreakdownRow {
  label: string;
  value: string;
  isNegative?: boolean;
  isTotal?: boolean;
}

export interface PdfInput {
  label: string;
  value: string;
}

export interface PdfDonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface PdfBarItem {
  label: string;
  value: number;
  color: string;
}

export interface PdfReport {
  /** Brand wordmark, defaults to "FrankCalculator". */
  siteName?: string;
  /** Small tagline shown under the wordmark. */
  tagline?: string;
  /** e.g. "Personal Loan EMI Calculator". */
  calculatorName: string;
  /** When the report was generated (defaults to now). */
  generatedAt?: Date;
  /** The single headline number. */
  heroValue: { label: string; value: string; sub?: string };
  /** 3-6 secondary stats rendered as cards. */
  kpis: PdfStat[];
  /** Optional itemized rows / table. */
  breakdown?: { title?: string; rows: PdfBreakdownRow[] };
  /** Optional "Your inputs" assumptions panel. */
  inputs?: PdfInput[];
  /** Optional vector donut + legend. */
  donut?: {
    title?: string;
    segments: PdfDonutSegment[];
    formatValue?: (n: number) => string;
  };
  /** Optional vector bar chart. */
  bars?: {
    title?: string;
    items: PdfBarItem[];
    formatValue?: (n: number) => string;
  };
  /** Optional bullet insights. */
  notes?: string[];
  /** Footer fine print. */
  disclaimer?: string;
  /** Primary accent hex for this calculator (defaults to electric blue). */
  accentColor?: string;
}

/* ----------------------------------------------------------------------- */
/* Design tokens                                                           */
/* ----------------------------------------------------------------------- */

type RGB = [number, number, number];

const PALETTE = {
  blue: '#00d4ff',
  green: '#00ff88',
  orange: '#ff6b35',
  purple: '#a855f7',
  pink: '#ff006e',
  cyan: '#06b6d4',
};

/** The five-colour accent rule under the header, in order. */
const ACCENT_RULE = [PALETTE.blue, PALETTE.green, PALETTE.orange, PALETTE.purple, PALETTE.pink];

const COLOR = {
  headerBg: '#0a0a0f',
  headerBg2: '#15151f',
  paper: '#ffffff',
  ink: '#14141c',
  inkSoft: '#3a3a48',
  muted: '#6b7280',
  faint: '#9aa1ad',
  line: '#e6e8ef',
  panel: '#f7f8fc',
  panelAlt: '#eef1f7',
  negative: '#e0533d',
  white: '#ffffff',
};

/* ----------------------------------------------------------------------- */
/* Colour helpers                                                          */
/* ----------------------------------------------------------------------- */

function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** Blend a hex colour toward a target colour by ratio t (0..1). */
function mix(hex: string, target: string, t: number): RGB {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/** A very light tint of an accent — used for hero / chip backgrounds. */
const tint = (hex: string, t = 0.9): RGB => mix(hex, '#ffffff', t);
/** A darkened, readable variant of an accent for text on light paper. */
const deepen = (hex: string, t = 0.35): RGB => mix(hex, '#0a0a0f', t);

/* ----------------------------------------------------------------------- */
/* Layout engine                                                           */
/* ----------------------------------------------------------------------- */

class Report {
  doc: jsPDF;
  W: number;
  H: number;
  M = 44; // page margin
  y = 0;
  accent: string;
  accentRgb: RGB;
  footerReserve = 92;

  constructor(private report: PdfReport) {
    this.doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
    this.W = this.doc.internal.pageSize.getWidth();
    this.H = this.doc.internal.pageSize.getHeight();
    this.accent = report.accentColor ?? PALETTE.blue;
    this.accentRgb = hexToRgb(this.accent);
  }

  private get CW() {
    return this.W - this.M * 2;
  }

  private fill(rgb: RGB) {
    this.doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  }
  private stroke(rgb: RGB) {
    this.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  }
  private ink(rgb: RGB) {
    this.doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  }
  private font(weight: 'normal' | 'bold', size: number) {
    this.doc.setFont('helvetica', weight);
    this.doc.setFontSize(size);
  }

  /** Make sure `needed` points of vertical room exist; else paginate. */
  private ensureSpace(needed: number) {
    if (this.y + needed > this.H - this.footerReserve) {
      this.doc.addPage();
      this.y = this.drawContinuedHeader();
    }
  }

  /* ----------------------------- Header ------------------------------- */

  private drawHeader() {
    const { doc, report } = this;
    const h = 138;

    // Layered dark bands to simulate a subtle vertical gradient.
    const steps = 24;
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      this.fill(mix(COLOR.headerBg, COLOR.headerBg2, t * 0.85));
      doc.rect(0, (h / steps) * i, this.W, h / steps + 1, 'F');
    }

    // Faint oversized brand glyph in the corner for depth.
    this.font('bold', 150);
    this.ink(mix(COLOR.headerBg, '#ffffff', 0.06));
    doc.text('F', this.W - 96, h - 8, { align: 'center' });

    // Wordmark.
    const siteName = report.siteName ?? 'FrankCalculator';
    this.font('bold', 27);
    this.ink(hexToRgb(COLOR.white));
    doc.text(siteName, this.M, 58, { charSpace: 0.4 });
    const wordW = doc.getTextWidth(siteName) + siteName.length * 0.4;
    // accent dot after the wordmark
    this.fill(hexToRgb(PALETTE.green));
    doc.circle(this.M + wordW + 7, 54, 3.1, 'F');

    // Tagline.
    this.font('normal', 8.5);
    this.ink(hexToRgb('#9aa3b2'));
    doc.text(
      (report.tagline ?? 'FrankCalculator · Honest money tools').toUpperCase(),
      this.M,
      76,
      { charSpace: 1.4 }
    );

    // Right column: eyebrow, calculator name, date.
    const rightX = this.W - this.M;
    this.font('bold', 8);
    this.ink(hexToRgb(PALETTE.blue));
    doc.text('CALCULATOR REPORT', rightX, 44, { align: 'right', charSpace: 1.6 });

    this.font('bold', 13);
    this.ink(hexToRgb(COLOR.white));
    const nameLines = doc.splitTextToSize(report.calculatorName, 250);
    doc.text(nameLines, rightX, 62, { align: 'right' });

    const dateStr = (report.generatedAt ?? new Date()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    this.font('normal', 8.5);
    this.ink(hexToRgb('#9aa3b2'));
    doc.text(`Generated ${dateStr}`, rightX, 62 + nameLines.length * 14, {
      align: 'right',
    });

    // Multi-colour accent rule at the very bottom of the header.
    const ruleH = 4;
    const seg = this.W / ACCENT_RULE.length;
    ACCENT_RULE.forEach((c, i) => {
      this.fill(hexToRgb(c));
      doc.rect(seg * i, h - ruleH, seg + 1, ruleH, 'F');
    });

    this.y = h + 30;
  }

  /** Slim header repeated on continuation pages. */
  private drawContinuedHeader(): number {
    const { doc, report } = this;
    const h = 46;
    this.fill(hexToRgb(COLOR.headerBg));
    doc.rect(0, 0, this.W, h, 'F');

    this.font('bold', 13);
    this.ink(hexToRgb(COLOR.white));
    doc.text(report.siteName ?? 'FrankCalculator', this.M, 29, { charSpace: 0.3 });

    this.font('normal', 9);
    this.ink(hexToRgb('#9aa3b2'));
    doc.text(`${report.calculatorName} — continued`, this.W - this.M, 29, {
      align: 'right',
    });

    const seg = this.W / ACCENT_RULE.length;
    ACCENT_RULE.forEach((c, i) => {
      this.fill(hexToRgb(c));
      doc.rect(seg * i, h - 3, seg + 1, 3, 'F');
    });

    return h + 28;
  }

  /* --------------------------- Section title -------------------------- */

  private sectionTitle(label: string) {
    this.ensureSpace(30);
    const { doc } = this;
    this.fill(this.accentRgb);
    doc.circle(this.M + 3, this.y - 3, 3, 'F');
    this.font('bold', 10.5);
    this.ink(hexToRgb(COLOR.ink));
    doc.text(label.toUpperCase(), this.M + 13, this.y, { charSpace: 1 });
    this.y += 14;
  }

  /* ------------------------------- Hero ------------------------------- */

  private drawHero() {
    const { doc, report } = this;
    const h = 98;
    this.ensureSpace(h + 12);
    const x = this.M;
    const w = this.CW;

    // Tinted panel.
    this.fill(tint(this.accent, 0.9));
    doc.roundedRect(x, this.y, w, h, 12, 12, 'F');
    // Accent left bar.
    this.fill(this.accentRgb);
    doc.roundedRect(x, this.y, 6, h, 3, 3, 'F');
    doc.rect(x + 3, this.y, 4, h, 'F');

    const px = x + 26;
    // Label.
    this.font('bold', 9);
    this.ink(deepen(this.accent, 0.25));
    doc.text(report.heroValue.label.toUpperCase(), px, this.y + 26, { charSpace: 1.3 });

    // Big value.
    this.font('bold', 31);
    this.ink(hexToRgb(COLOR.ink));
    doc.text(report.heroValue.value, px, this.y + 60);

    // Sub.
    if (report.heroValue.sub) {
      this.font('normal', 9.5);
      this.ink(hexToRgb(COLOR.muted));
      doc.text(report.heroValue.sub, px, this.y + 80);
    }

    this.y += h + 22;
  }

  /* ----------------------------- KPI cards ---------------------------- */

  private drawKpis() {
    const kpis = this.report.kpis;
    if (!kpis.length) return;
    const cols = kpis.length <= 2 ? kpis.length : 3;
    const gap = 14;
    const cardW = (this.CW - gap * (cols - 1)) / cols;
    const cardH = 72;
    const accents = [PALETTE.blue, PALETTE.green, PALETTE.purple, PALETTE.orange, PALETTE.pink, PALETTE.cyan];

    let i = 0;
    while (i < kpis.length) {
      const rowItems = kpis.slice(i, i + cols);
      this.ensureSpace(cardH + gap);
      rowItems.forEach((kpi, j) => {
        const x = this.M + (cardW + gap) * j;
        const cy = this.y;
        const accent = accents[(i + j) % accents.length];
        // Card.
        this.fill(hexToRgb(COLOR.paper));
        this.stroke(hexToRgb(COLOR.line));
        this.doc.setLineWidth(1);
        this.doc.roundedRect(x, cy, cardW, cardH, 9, 9, 'FD');
        // Accent dot.
        this.fill(hexToRgb(accent));
        this.doc.circle(x + 15, cy + 17, 3, 'F');
        // Label.
        this.font('bold', 7.5);
        this.ink(hexToRgb(COLOR.muted));
        const labelLines = this.doc.splitTextToSize(kpi.label.toUpperCase(), cardW - 30);
        this.doc.text(labelLines[0], x + 25, cy + 20, { charSpace: 0.8 });
        // Value.
        this.font('bold', 15);
        this.ink(hexToRgb(COLOR.ink));
        const valLines = this.doc.splitTextToSize(kpi.value, cardW - 24);
        this.doc.text(valLines[0], x + 15, cy + 43);
        // Sub.
        if (kpi.sub) {
          this.font('normal', 7.5);
          this.ink(hexToRgb(COLOR.faint));
          const subLines = this.doc.splitTextToSize(kpi.sub, cardW - 24);
          this.doc.text(subLines.slice(0, 2), x + 15, cy + 57);
        }
      });
      this.y += cardH + gap;
      i += cols;
    }
    this.y += 8;
  }

  /* ------------------------------ Donut ------------------------------- */

  private drawDonut() {
    const donut = this.report.donut;
    if (!donut || !donut.segments.length) return;
    const segments = donut.segments.filter((s) => s.value > 0);
    if (!segments.length) return;

    const fmt = donut.formatValue ?? ((n: number) => n.toLocaleString('en-US'));
    const total = segments.reduce((s, x) => s + x.value, 0);
    if (total <= 0) return;

    this.sectionTitle(donut.title ?? 'Composition');

    const panelH = Math.max(168, 56 + segments.length * 22);
    this.ensureSpace(panelH + 14);
    const { doc } = this;
    const x = this.M;
    const w = this.CW;
    const top = this.y;

    // Panel.
    this.fill(hexToRgb(COLOR.panel));
    this.stroke(hexToRgb(COLOR.line));
    doc.setLineWidth(1);
    doc.roundedRect(x, top, w, panelH, 10, 10, 'FD');

    // Donut geometry (left side).
    const cx = x + 92;
    const cy = top + panelH / 2;
    const outerR = 58;
    const innerR = 33;

    let angle = -Math.PI / 2; // start at top
    segments.forEach((s) => {
      const sweep = (s.value / total) * Math.PI * 2;
      const end = angle + sweep;
      this.fill(hexToRgb(s.color));
      // Fan of thin triangles for a smooth filled slice.
      const stepCount = Math.max(2, Math.ceil((sweep / (Math.PI * 2)) * 120));
      for (let k = 0; k < stepCount; k++) {
        const a1 = angle + (sweep * k) / stepCount;
        const a2 = angle + (sweep * (k + 1)) / stepCount;
        doc.triangle(
          cx,
          cy,
          cx + Math.cos(a1) * outerR,
          cy + Math.sin(a1) * outerR,
          cx + Math.cos(a2) * outerR,
          cy + Math.sin(a2) * outerR,
          'F'
        );
      }
      angle = end;
    });

    // Punch the centre hole with the panel colour to make it a donut.
    this.fill(hexToRgb(COLOR.panel));
    doc.circle(cx, cy, innerR, 'F');

    // Centre label: total.
    this.font('bold', 7);
    this.ink(hexToRgb(COLOR.muted));
    doc.text('TOTAL', cx, cy - 5, { align: 'center', charSpace: 0.8 });
    this.font('bold', 11);
    this.ink(hexToRgb(COLOR.ink));
    const totalStr = fmt(total);
    // shrink if too wide for hole
    let ts = 11;
    while (doc.getTextWidth(totalStr) > innerR * 1.8 && ts > 6) {
      ts -= 0.5;
      this.font('bold', ts);
    }
    doc.text(totalStr, cx, cy + 8, { align: 'center' });

    // Legend (right side).
    const legendX = x + 188;
    const legendW = w - (legendX - x) - 24;
    const rowH = Math.min(26, (panelH - 28) / segments.length);
    let ly = top + 24 + (panelH - 28 - rowH * segments.length) / 2;
    segments.forEach((s) => {
      const pct = (s.value / total) * 100;
      // swatch
      this.fill(hexToRgb(s.color));
      doc.roundedRect(legendX, ly - 8, 11, 11, 2.5, 2.5, 'F');
      // label
      this.font('normal', 9.5);
      this.ink(hexToRgb(COLOR.inkSoft));
      const maxLabel = legendW - 150;
      const lbl = doc.splitTextToSize(s.label, maxLabel)[0];
      doc.text(lbl, legendX + 18, ly);
      // value + pct (right aligned)
      this.font('bold', 9.5);
      this.ink(hexToRgb(COLOR.ink));
      doc.text(fmt(s.value), legendX + legendW, ly, { align: 'right' });
      this.font('normal', 8);
      this.ink(hexToRgb(COLOR.faint));
      doc.text(`${pct.toFixed(1)}%`, legendX + legendW, ly + 10, { align: 'right' });
      ly += rowH;
    });

    this.y = top + panelH + 22;
  }

  /* ------------------------------- Bars ------------------------------- */

  private drawBars() {
    const bars = this.report.bars;
    if (!bars || !bars.items.length) return;
    const items = bars.items;
    const fmt = bars.formatValue ?? ((n: number) => n.toLocaleString('en-US'));
    const max = Math.max(...items.map((i) => Math.abs(i.value)), 1);

    this.sectionTitle(bars.title ?? 'Comparison');

    const rowH = 30;
    const padV = 20;
    const panelH = padV * 2 + items.length * rowH;
    this.ensureSpace(panelH + 14);
    const { doc } = this;
    const x = this.M;
    const w = this.CW;
    const top = this.y;

    this.fill(hexToRgb(COLOR.panel));
    this.stroke(hexToRgb(COLOR.line));
    doc.setLineWidth(1);
    doc.roundedRect(x, top, w, panelH, 10, 10, 'FD');

    const labelW = 150;
    const trackX = x + 20 + labelW;
    const trackW = w - (trackX - x) - 90;
    let by = top + padV + 14;

    items.forEach((it) => {
      // label
      this.font('normal', 9);
      this.ink(hexToRgb(COLOR.inkSoft));
      const lbl = doc.splitTextToSize(it.label, labelW)[0];
      doc.text(lbl, x + 20, by);
      // track
      this.fill(hexToRgb(COLOR.panelAlt));
      doc.roundedRect(trackX, by - 9, trackW, 12, 6, 6, 'F');
      // bar
      const bw = Math.max(3, (Math.abs(it.value) / max) * trackW);
      this.fill(hexToRgb(it.color));
      doc.roundedRect(trackX, by - 9, bw, 12, 6, 6, 'F');
      // value
      this.font('bold', 9);
      this.ink(hexToRgb(COLOR.ink));
      doc.text(fmt(it.value), x + w - 20, by, { align: 'right' });
      by += rowH;
    });

    this.y = top + panelH + 22;
  }

  /* --------------------------- Breakdown ------------------------------ */

  private drawBreakdown() {
    const breakdown = this.report.breakdown;
    if (!breakdown || !breakdown.rows.length) return;
    this.sectionTitle(breakdown.title ?? 'Breakdown');

    const { doc } = this;
    const x = this.M;
    const w = this.CW;
    const rowH = 26;

    breakdown.rows.forEach((row) => {
      this.ensureSpace(rowH + 2);
      const top = this.y;
      const isTotal = row.isTotal;

      if (isTotal) {
        // Total row gets a tinted band + top rule.
        this.fill(tint(this.accent, 0.9));
        doc.roundedRect(x, top - 4, w, rowH, 6, 6, 'F');
      }

      this.font(isTotal ? 'bold' : 'normal', isTotal ? 10.5 : 9.5);
      this.ink(hexToRgb(isTotal ? COLOR.ink : COLOR.inkSoft));
      doc.text(row.label, x + 14, top + rowH / 2);

      this.font('bold', isTotal ? 11 : 9.5);
      if (row.isNegative) this.ink(hexToRgb(COLOR.negative));
      else if (isTotal) this.ink(deepen(this.accent, 0.3));
      else this.ink(hexToRgb(COLOR.ink));
      doc.text(row.value, x + w - 14, top + rowH / 2, { align: 'right' });

      if (!isTotal) {
        this.stroke(hexToRgb(COLOR.line));
        doc.setLineWidth(0.75);
        doc.line(x + 4, top + rowH - 2, x + w - 4, top + rowH - 2);
      }
      this.y += rowH;
    });
    this.y += 18;
  }

  /* ----------------------------- Inputs ------------------------------- */

  private drawInputs() {
    const inputs = this.report.inputs;
    if (!inputs || !inputs.length) return;
    this.sectionTitle('Your inputs');

    const { doc } = this;
    const x = this.M;
    const w = this.CW;
    const cols = 2;
    const colGap = 18;
    const colW = (w - 28 - colGap) / cols;
    const rowH = 30;
    const rows = Math.ceil(inputs.length / cols);
    const panelH = 18 * 2 + rows * rowH;

    this.ensureSpace(panelH + 12);
    const top = this.y;
    this.fill(hexToRgb(COLOR.panel));
    this.stroke(hexToRgb(COLOR.line));
    doc.setLineWidth(1);
    doc.roundedRect(x, top, w, panelH, 10, 10, 'FD');

    inputs.forEach((inp, idx) => {
      const col = idx % cols;
      const rowIdx = Math.floor(idx / cols);
      const cellX = x + 16 + col * (colW + colGap);
      const cellY = top + 18 + rowIdx * rowH + 8;

      this.font('normal', 8);
      this.ink(hexToRgb(COLOR.muted));
      doc.text(inp.label.toUpperCase(), cellX, cellY, { charSpace: 0.6 });

      this.font('bold', 10.5);
      this.ink(hexToRgb(COLOR.ink));
      const v = doc.splitTextToSize(inp.value, colW)[0];
      doc.text(v, cellX, cellY + 14);

      // divider under each row segment
      if (rowIdx < rows - 1) {
        this.stroke(hexToRgb(COLOR.line));
        doc.setLineWidth(0.5);
        doc.line(cellX, cellY + 21, cellX + colW, cellY + 21);
      }
    });

    this.y = top + panelH + 22;
  }

  /* ------------------------------ Notes ------------------------------- */

  private drawNotes() {
    const notes = this.report.notes?.filter(Boolean);
    if (!notes || !notes.length) return;
    this.sectionTitle('Key insights');

    const { doc } = this;
    const x = this.M;
    const w = this.CW;

    notes.forEach((note) => {
      this.font('normal', 9.5);
      const textW = w - 28;
      const lines = doc.splitTextToSize(note, textW);
      const blockH = lines.length * 13 + 8;
      this.ensureSpace(blockH);
      // accent bullet
      this.fill(this.accentRgb);
      doc.circle(x + 5, this.y - 3, 2.4, 'F');
      this.ink(hexToRgb(COLOR.inkSoft));
      doc.text(lines, x + 16, this.y);
      this.y += blockH;
    });
    this.y += 10;
  }

  /* ---------------------------- Disclaimer ---------------------------- */

  private drawDisclaimer() {
    const disclaimer = this.report.disclaimer;
    if (!disclaimer) return;
    const { doc } = this;
    const x = this.M;
    const w = this.CW;

    this.font('normal', 7.5);
    const lines = doc.splitTextToSize(disclaimer, w - 24);
    const panelH = lines.length * 10 + 30;
    this.ensureSpace(panelH + 8);
    const top = this.y;

    this.fill(hexToRgb(COLOR.panel));
    doc.roundedRect(x, top, w, panelH, 8, 8, 'F');
    this.fill(hexToRgb(PALETTE.orange));
    doc.roundedRect(x, top, 4, panelH, 2, 2, 'F');

    this.font('bold', 7.5);
    this.ink(hexToRgb(PALETTE.orange));
    doc.text('DISCLAIMER', x + 16, top + 16, { charSpace: 1 });

    this.font('normal', 7.5);
    this.ink(hexToRgb(COLOR.muted));
    doc.text(lines, x + 16, top + 28);

    this.y = top + panelH + 10;
  }

  /* ----------------------------- Footer ------------------------------- */

  private drawFooters() {
    const { doc } = this;
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      const fy = this.H - 36;
      // divider
      this.stroke(hexToRgb(COLOR.line));
      doc.setLineWidth(1);
      doc.line(this.M, fy, this.W - this.M, fy);

      // mini accent dots
      ACCENT_RULE.forEach((c, i) => {
        this.fill(hexToRgb(c));
        doc.circle(this.M + 4 + i * 9, fy + 12, 2, 'F');
      });

      this.font('normal', 8);
      this.ink(hexToRgb(COLOR.faint));
      doc.text('Generated by FrankCalculator · frankcalculator.com', this.M + 56, fy + 15);

      this.font('normal', 8);
      this.ink(hexToRgb(COLOR.muted));
      doc.text(`Page ${p} of ${pageCount}`, this.W - this.M, fy + 15, { align: 'right' });
    }
  }

  /* ------------------------------ Build ------------------------------- */

  build(): jsPDF {
    this.drawHeader();
    this.drawHero();
    this.drawKpis();
    this.drawDonut();
    this.drawBars();
    this.drawBreakdown();
    this.drawInputs();
    this.drawNotes();
    this.drawDisclaimer();
    this.drawFooters();
    return this.doc;
  }
}

/* ----------------------------------------------------------------------- */
/* Public API                                                              */
/* ----------------------------------------------------------------------- */

/** Build the report and return the jsPDF document (no download). */
export function buildCalculatorPdf(report: PdfReport): jsPDF {
  return new Report(report).build();
}

/** Build and trigger a browser download. */
export function generateCalculatorPdf(report: PdfReport, filename: string): void {
  const doc = buildCalculatorPdf(report);
  doc.save(filename);
}
