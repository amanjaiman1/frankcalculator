'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  estimateWorkersCompSettlement,
  computeAverageWeeklyWage,
  type DisabilityCategory,
} from '@/lib/calculations';
import {
  STATE_COMP_DATA,
  BODY_PART_SCHEDULE,
  WHOLE_PERSON_REGIONS,
  WHOLE_PERSON_WEEKS,
  DEFAULT_COMP_RATE_PCT,
  DEFAULT_ATTORNEY_FEE_PCT,
  RATES_AS_OF,
} from '@/lib/workersCompData';
import { formatCurrency } from '@/lib/utils';
import ResultCard from '@/components/ResultCard';
import SliderInput from '@/components/SliderInput';
import CopyButton from '@/components/CopyButton';
import ExportPdfButton from '@/components/ExportPdfButton';
import type { PdfReport } from '@/lib/pdfReport';
import { ChartContainer, DarkDoughnut, DarkBar, chartColors } from '@/components/ChartWrapper';
import AdPlaceholder from '@/components/AdPlaceholder';

const DEFAULTS = {
  stateCode: 'CA',
  useAwwHelper: false,
  grossEarnings: 62400,
  weeksWorked: 52,
  averageWeeklyWage: 1200,
  compRatePct: DEFAULT_COMP_RATE_PCT,
  category: 'PPD_SCHEDULED' as DisabilityCategory,
  weeksOffWork: 16,
  includeTPD: false,
  tpdWeeklyWageLoss: 300,
  tpdWeeks: 10,
  bodyPartKey: 'shoulder',
  wholePersonRegion: 'back',
  wholePersonWeeks: WHOLE_PERSON_WEEKS,
  impairmentPct: 15,
  ptdWeeks: 500,
  futureMedical: 25000,
  pastOwedBenefits: 0,
  attorneyFeePct: DEFAULT_ATTORNEY_FEE_PCT,
  liens: 0,
  rangePct: 17,
  structuredYears: 10,
  structuredRatePct: 3,
};

const CATEGORY_OPTIONS: { value: DisabilityCategory; label: string }[] = [
  { value: 'TTD', label: 'Temporary disability only (TTD)' },
  { value: 'PPD_SCHEDULED', label: 'Permanent partial — scheduled body part' },
  { value: 'PPD_UNSCHEDULED', label: 'Permanent partial — whole person (back/neck/head)' },
  { value: 'PTD', label: 'Permanent total disability (PTD)' },
];

const selectClass =
  'w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-vivid-purple focus:outline-none transition-colors';

const faqs: { q: string; a: string }[] = [
  {
    q: 'How accurate is this workers’ comp settlement calculator?',
    a: 'It produces an educated estimate using the same building blocks adjusters and attorneys use — average weekly wage, the two-thirds comp rate, state caps, body-part schedules, impairment ratings, future medical, fees and liens. The state maximum weekly rates were refreshed to the most recent 2025–2026 figures, but they change at least yearly and a few states (such as California, Texas, Ohio, Washington and Michigan) calculate permanent disability differently from the simplified model used here. Real settlements still hinge on medical evidence, disputed facts, your state’s exact statutes and negotiation, so treat the number as a starting point, not a promise, and confirm specifics with a licensed attorney.',
  },
  {
    q: 'Is a workers’ comp settlement taxable?',
    a: 'Workers’ compensation benefits are generally not subject to federal income tax. There can be exceptions — for example, when comp benefits offset Social Security Disability — so confirm your situation with a tax professional or attorney.',
  },
  {
    q: 'How long does it take to get a settlement?',
    a: 'It varies widely. Some claims resolve in a few months once you reach maximum medical improvement; disputed claims with litigation can take a year or more. Settlements usually are not finalized until doctors agree your condition has stabilized.',
  },
  {
    q: 'Should I take a lump sum or a structured settlement?',
    a: 'A lump sum gives you full control and immediate access but must last; a structured settlement spreads payments over time for budgeting and protection. The right choice depends on your medical needs, financial discipline, and whether future treatment is still likely. Compare both in the calculator above.',
  },
  {
    q: 'Do I have to pay back medical bills or liens from my settlement?',
    a: 'Often yes. Medical liens, unpaid child support, and any advances can be deducted from your recovery. A Medicare Set-Aside may also be required to protect future Medicare interests. Enter known liens above to see your realistic net.',
  },
  {
    q: 'Can I settle and still keep my job?',
    a: 'Sometimes. A settlement may resolve only the indemnity and medical portions of your claim, but many "compromise and release" settlements include resignation. Whether you keep your job depends on the agreement terms and your state’s rules.',
  },
];

export default function WorkersCompCalculator() {
  const [stateCode, setStateCode] = useState(DEFAULTS.stateCode);
  const [useAwwHelper, setUseAwwHelper] = useState(DEFAULTS.useAwwHelper);
  const [grossEarnings, setGrossEarnings] = useState(DEFAULTS.grossEarnings);
  const [weeksWorked, setWeeksWorked] = useState(DEFAULTS.weeksWorked);
  const [averageWeeklyWage, setAverageWeeklyWage] = useState(DEFAULTS.averageWeeklyWage);
  const [compRatePct, setCompRatePct] = useState(DEFAULTS.compRatePct);
  const [category, setCategory] = useState<DisabilityCategory>(DEFAULTS.category);
  const [weeksOffWork, setWeeksOffWork] = useState(DEFAULTS.weeksOffWork);
  const [includeTPD, setIncludeTPD] = useState(DEFAULTS.includeTPD);
  const [tpdWeeklyWageLoss, setTpdWeeklyWageLoss] = useState(DEFAULTS.tpdWeeklyWageLoss);
  const [tpdWeeks, setTpdWeeks] = useState(DEFAULTS.tpdWeeks);
  const [bodyPartKey, setBodyPartKey] = useState(DEFAULTS.bodyPartKey);
  const [wholePersonRegion, setWholePersonRegion] = useState(DEFAULTS.wholePersonRegion);
  const [wholePersonWeeks, setWholePersonWeeks] = useState(DEFAULTS.wholePersonWeeks);
  const [impairmentPct, setImpairmentPct] = useState(DEFAULTS.impairmentPct);
  const [ptdWeeks, setPtdWeeks] = useState(DEFAULTS.ptdWeeks);
  const [futureMedical, setFutureMedical] = useState(DEFAULTS.futureMedical);
  const [pastOwedBenefits, setPastOwedBenefits] = useState(DEFAULTS.pastOwedBenefits);
  const [attorneyFeePct, setAttorneyFeePct] = useState(DEFAULTS.attorneyFeePct);
  const [liens, setLiens] = useState(DEFAULTS.liens);
  const [rangePct, setRangePct] = useState(DEFAULTS.rangePct);
  const [structuredYears, setStructuredYears] = useState(DEFAULTS.structuredYears);
  const [structuredRatePct, setStructuredRatePct] = useState(DEFAULTS.structuredRatePct);

  const stateData = useMemo(
    () => STATE_COMP_DATA.find((s) => s.code === stateCode) ?? STATE_COMP_DATA[0],
    [stateCode]
  );

  const effectiveAWW = useMemo(
    () => (useAwwHelper ? computeAverageWeeklyWage(grossEarnings, weeksWorked) : averageWeeklyWage),
    [useAwwHelper, grossEarnings, weeksWorked, averageWeeklyWage]
  );

  const bodyPartWeeks = useMemo(
    () => BODY_PART_SCHEDULE.find((b) => b.key === bodyPartKey)?.weeks ?? 0,
    [bodyPartKey]
  );

  const results = useMemo(
    () =>
      estimateWorkersCompSettlement({
        averageWeeklyWage: effectiveAWW,
        compRatePct,
        stateMaxWeekly: stateData.maxWeekly,
        stateMinWeekly: stateData.minWeekly,
        category,
        weeksOffWork,
        includeTPD,
        tpdWeeklyWageLoss,
        tpdWeeks,
        bodyPartWeeks,
        wholePersonWeeks,
        impairmentPct,
        ptdWeeks,
        futureMedical,
        pastOwedBenefits,
        attorneyFeePct,
        liens,
        rangePct,
        structuredYears,
        structuredRatePct,
      }),
    [
      effectiveAWW,
      compRatePct,
      stateData,
      category,
      weeksOffWork,
      includeTPD,
      tpdWeeklyWageLoss,
      tpdWeeks,
      bodyPartWeeks,
      wholePersonWeeks,
      impairmentPct,
      ptdWeeks,
      futureMedical,
      pastOwedBenefits,
      attorneyFeePct,
      liens,
      rangePct,
      structuredYears,
      structuredRatePct,
    ]
  );

  const resetDefaults = () => {
    setStateCode(DEFAULTS.stateCode);
    setUseAwwHelper(DEFAULTS.useAwwHelper);
    setGrossEarnings(DEFAULTS.grossEarnings);
    setWeeksWorked(DEFAULTS.weeksWorked);
    setAverageWeeklyWage(DEFAULTS.averageWeeklyWage);
    setCompRatePct(DEFAULTS.compRatePct);
    setCategory(DEFAULTS.category);
    setWeeksOffWork(DEFAULTS.weeksOffWork);
    setIncludeTPD(DEFAULTS.includeTPD);
    setTpdWeeklyWageLoss(DEFAULTS.tpdWeeklyWageLoss);
    setTpdWeeks(DEFAULTS.tpdWeeks);
    setBodyPartKey(DEFAULTS.bodyPartKey);
    setWholePersonRegion(DEFAULTS.wholePersonRegion);
    setWholePersonWeeks(DEFAULTS.wholePersonWeeks);
    setImpairmentPct(DEFAULTS.impairmentPct);
    setPtdWeeks(DEFAULTS.ptdWeeks);
    setFutureMedical(DEFAULTS.futureMedical);
    setPastOwedBenefits(DEFAULTS.pastOwedBenefits);
    setAttorneyFeePct(DEFAULTS.attorneyFeePct);
    setLiens(DEFAULTS.liens);
    setRangePct(DEFAULTS.rangePct);
    setStructuredYears(DEFAULTS.structuredYears);
    setStructuredRatePct(DEFAULTS.structuredRatePct);
  };

  const compositionPalette = [
    chartColors.electricBlue,
    chartColors.accentCyan,
    chartColors.vividPurple,
    chartColors.neonGreen,
    chartColors.hotOrange,
  ];

  const doughnutData = {
    labels: results.breakdown.map((b) => b.label),
    datasets: [
      {
        data: results.breakdown.map((b) => Math.round(b.amount)),
        backgroundColor: results.breakdown.map((_, i) => compositionPalette[i % compositionPalette.length]),
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 2,
      },
    ],
  };

  const payoutBarData = {
    labels: ['Lump Sum (net today)', `Structured (${structuredYears}-yr nominal)`],
    datasets: [
      {
        label: 'Total received',
        data: [Math.round(results.netToWorker), Math.round(results.structuredTotalNominal)],
        backgroundColor: [chartColors.neonGreen, chartColors.vividPurple],
        borderColor: ['rgba(0,255,136,0.3)', 'rgba(168,85,247,0.3)'],
        borderWidth: 2,
      },
    ],
  };

  const summary = () =>
    [
      "Workers' Comp Settlement Estimate (estimate only — not legal advice)",
      `State: ${stateData.name}`,
      `Average Weekly Wage: ${formatCurrency(effectiveAWW)}`,
      `Comp rate used: ${formatCurrency(results.effectiveCompRate)}/wk${
        results.capApplied ? ' (state max applied)' : results.floorApplied ? ' (state min applied)' : ''
      }`,
      `Category: ${CATEGORY_OPTIONS.find((c) => c.value === category)?.label ?? category}`,
      '',
      `TTD: ${formatCurrency(results.ttd)}`,
      results.tpd > 0 ? `TPD: ${formatCurrency(results.tpd)}` : '',
      results.permanent > 0 ? `${results.permanentLabel}: ${formatCurrency(results.permanent)}` : '',
      `Future medical: ${formatCurrency(results.futureMedical)}`,
      `Past owed benefits: ${formatCurrency(results.pastOwed)}`,
      `Gross settlement: ${formatCurrency(results.grossSettlement)}`,
      `Less attorney fees (${attorneyFeePct}%): -${formatCurrency(results.attorneyFees)}`,
      `Less liens: -${formatCurrency(results.liens)}`,
      `NET TO WORKER: ${formatCurrency(results.netToWorker)}`,
      `Likely range: ${formatCurrency(results.lowEstimate)} – ${formatCurrency(results.highEstimate)}`,
      '',
      `Structured option: ${formatCurrency(results.structuredMonthly)}/mo for ${structuredYears} yrs (nominal ${formatCurrency(
        results.structuredTotalNominal
      )})`,
    ]
      .filter(Boolean)
      .join('\n');

  const buildReport = (): PdfReport => ({
    calculatorName: "Workers' Compensation Settlement Calculator",
    accentColor: chartColors.vividPurple,
    heroValue: {
      label: 'Estimated Gross Settlement',
      value: formatCurrency(results.grossSettlement),
      sub: `Likely range ${formatCurrency(results.lowEstimate)} – ${formatCurrency(results.highEstimate)}`,
    },
    kpis: [
      {
        label: 'Net to Worker',
        value: formatCurrency(results.netToWorker),
        sub: `After ${attorneyFeePct}% fee${results.liens > 0 ? ' & liens' : ''}`,
      },
      {
        label: 'Comp Rate Used',
        value: `${formatCurrency(results.effectiveCompRate)}/wk`,
        sub: results.capApplied ? `${stateData.name} max` : results.floorApplied ? `${stateData.name} min` : `${compRatePct.toFixed(2)}% of AWW`,
      },
      {
        label: 'Structured Option',
        value: `${formatCurrency(results.structuredMonthly)}/mo`,
        sub: `${structuredYears} yrs · ${formatCurrency(results.structuredTotalNominal)} nominal`,
      },
    ],
    donut:
      results.breakdown.length > 0
        ? {
            title: 'Settlement composition',
            formatValue: formatCurrency,
            segments: results.breakdown.map((b, i) => ({
              label: b.label,
              value: Math.round(b.amount),
              color: compositionPalette[i % compositionPalette.length],
            })),
          }
        : undefined,
    bars: {
      title: 'Lump sum vs structured payout',
      formatValue: formatCurrency,
      items: [
        { label: 'Lump sum (net today)', value: Math.round(results.netToWorker), color: chartColors.neonGreen },
        { label: `Structured (${structuredYears}-yr nominal)`, value: Math.round(results.structuredTotalNominal), color: chartColors.vividPurple },
      ],
    },
    breakdown: {
      title: 'Itemized breakdown',
      rows: [
        { label: 'Temporary total disability (TTD)', value: formatCurrency(results.ttd) },
        ...(results.tpd > 0 ? [{ label: 'Temporary partial disability (TPD)', value: formatCurrency(results.tpd) }] : []),
        ...(results.permanent > 0 ? [{ label: results.permanentLabel, value: formatCurrency(results.permanent) }] : []),
        { label: 'Future medical', value: formatCurrency(results.futureMedical) },
        { label: 'Past owed benefits', value: formatCurrency(results.pastOwed) },
        { label: 'Gross settlement', value: formatCurrency(results.grossSettlement) },
        { label: `Attorney fee (${attorneyFeePct}%)`, value: `-${formatCurrency(results.attorneyFees)}`, isNegative: true },
        { label: 'Liens / offsets', value: `-${formatCurrency(results.liens)}`, isNegative: true },
        { label: 'Net to worker', value: formatCurrency(results.netToWorker), isTotal: true },
      ],
    },
    inputs: [
      { label: 'State', value: stateData.name },
      { label: 'Average weekly wage', value: formatCurrency(effectiveAWW) },
      { label: 'Comp rate', value: `${compRatePct.toFixed(2)}% of AWW` },
      { label: 'Disability category', value: CATEGORY_OPTIONS.find((c) => c.value === category)?.label ?? category },
      { label: 'Attorney fee', value: `${attorneyFeePct}%` },
      { label: 'Liens / offsets', value: formatCurrency(liens) },
      { label: 'Future medical', value: formatCurrency(futureMedical) },
      { label: 'Structured payout', value: `${structuredYears} yr @ ${structuredRatePct}%` },
    ],
    notes: [
      `After a ${attorneyFeePct}% attorney fee${results.liens > 0 ? ' and liens' : ''}, an estimated ${formatCurrency(results.netToWorker)} lands with the worker from a ${formatCurrency(results.grossSettlement)} gross settlement.`,
      `A structured payout would pay ${formatCurrency(results.structuredMonthly)}/mo for ${structuredYears} years (${formatCurrency(results.structuredTotalNominal)} nominal) instead of a single lump sum.`,
      `Real-world settlements swing widely — the likely range here is ${formatCurrency(results.lowEstimate)} to ${formatCurrency(results.highEstimate)}.`,
    ],
    disclaimer:
      'This calculator provides a rough ESTIMATE only and is NOT legal, financial, or tax advice. It uses simplified, representative formulas and approximate state figures that change frequently and may not match your state\u2019s current rates, caps, schedules, or eligibility rules. Actual workers\u2019 compensation settlements vary significantly based on jurisdiction, medical evidence, disputed facts, impairment rating, insurer policies, and negotiation. Consult a qualified workers\u2019 compensation attorney licensed in your jurisdiction. Using this tool does not create an attorney-client relationship.',
  });

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="text-sm text-electric-blue hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-display)] mb-2">
            Workers&apos; Compensation Settlement Calculator
          </h1>
          <p className="text-gray-400 mb-8 max-w-3xl">
            Estimate your potential workers&apos; comp settlement the way the pros build it — average weekly wage,
            your state&apos;s comp rate and cap, permanent impairment ratings, the body-part schedule, future medical,
            attorney fees and liens — then compare a lump sum against a structured payout.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ---------------------------- INPUTS ---------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* 1. State & Wages */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-display)]">
                  1 · State &amp; Wages
                </h2>
                <button
                  onClick={resetDefaults}
                  className="text-xs text-gray-400 hover:text-vivid-purple border border-white/10 hover:border-vivid-purple/40 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">State</label>
                  <select
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className={selectClass}
                  >
                    {STATE_COMP_DATA.map((s) => (
                      <option key={s.code} value={s.code} className="bg-dark-card">
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {stateData.maxWeekly > 0
                      ? `Approx. max comp rate ${formatCurrency(stateData.maxWeekly)}/wk${
                          stateData.minWeekly > 0 ? `, min ${formatCurrency(stateData.minWeekly)}/wk` : ''
                        } · ${stateData.effective}. `
                      : 'No hard state cap applied. '}
                    {stateData.note}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1.5">{RATES_AS_OF}</p>

                  {stateData.specialSystem && (
                    <div className="mt-3 flex gap-2.5 rounded-lg bg-hot-orange/10 border border-hot-orange/30 px-3.5 py-3">
                      <span className="text-hot-orange text-sm leading-none mt-0.5">⚠️</span>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        <span className="font-semibold text-hot-orange">{stateData.name} uses special rules.</span>{' '}
                        This state&apos;s benefit or permanent-disability system works differently from the simplified
                        &ldquo;weeks × rate × impairment&rdquo; model used here, so treat the result as a rough ballpark and
                        confirm with a {stateData.name}-licensed attorney or the state workers&apos; comp board.
                      </p>
                    </div>
                  )}
                </div>

                {/* AWW helper toggle */}
                <div className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] border border-white/10 px-4 py-3">
                  <span className="text-sm text-gray-300">Compute AWW from earnings?</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={useAwwHelper}
                    onClick={() => setUseAwwHelper((v) => !v)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      useAwwHelper ? 'bg-vivid-purple' : 'bg-white/15'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        useAwwHelper ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {useAwwHelper ? (
                  <>
                    <SliderInput
                      label="Gross earnings (pre-injury period)"
                      value={grossEarnings}
                      onChange={setGrossEarnings}
                      min={0}
                      max={500000}
                      step={1000}
                      accent="neon-green"
                      prefix="$"
                      format={formatCurrency}
                      minLabel="$0"
                      maxLabel="$500K"
                    />
                    <SliderInput
                      label="Weeks worked in that period"
                      value={weeksWorked}
                      onChange={setWeeksWorked}
                      min={1}
                      max={52}
                      step={1}
                      accent="neon-green"
                      suffix="wk"
                      format={(v) => `${v} wk`}
                      minLabel="1"
                      maxLabel="52"
                    />
                    <div className="rounded-lg bg-vivid-purple/10 border border-vivid-purple/30 px-4 py-3">
                      <p className="text-xs text-gray-400">Calculated Average Weekly Wage</p>
                      <p className="text-xl font-bold text-vivid-purple font-[family-name:var(--font-display)]">
                        {formatCurrency(effectiveAWW)}
                      </p>
                    </div>
                  </>
                ) : (
                  <SliderInput
                    label="Average Weekly Wage (AWW)"
                    value={averageWeeklyWage}
                    onChange={setAverageWeeklyWage}
                    min={100}
                    max={6000}
                    step={25}
                    accent="neon-green"
                    prefix="$"
                    format={formatCurrency}
                    minLabel="$100"
                    maxLabel="$6,000"
                  />
                )}

                <SliderInput
                  label="Comp rate (% of AWW)"
                  value={compRatePct}
                  onChange={setCompRatePct}
                  min={50}
                  max={80}
                  step={0.01}
                  accent="electric-blue"
                  suffix="%"
                  format={(v) => `${v.toFixed(2)}%`}
                  minLabel="50%"
                  maxLabel="80%"
                />
              </div>
            </div>

            {/* 2. Disability / Injury */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-5 font-[family-name:var(--font-display)]">
                2 · Disability &amp; Injury
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Disability category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DisabilityCategory)}
                    className={selectClass}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value} className="bg-dark-card">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <SliderInput
                  label="Weeks off work (TTD)"
                  value={weeksOffWork}
                  onChange={setWeeksOffWork}
                  min={0}
                  max={260}
                  step={1}
                  accent="hot-orange"
                  suffix="wk"
                  format={(v) => `${v} wk`}
                  minLabel="0"
                  maxLabel="260"
                />

                {category === 'PPD_SCHEDULED' && (
                  <>
                    <div>
                      <label className="text-gray-300 text-sm block mb-2">Injured body part (scheduled)</label>
                      <select
                        value={bodyPartKey}
                        onChange={(e) => setBodyPartKey(e.target.value)}
                        className={selectClass}
                      >
                        {BODY_PART_SCHEDULE.map((b) => (
                          <option key={b.key} value={b.key} className="bg-dark-card">
                            {b.label} — {b.weeks} weeks
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-2">
                        Scheduled weeks shown are representative; the exact figure varies by state.
                      </p>
                    </div>
                    <SliderInput
                      label="Permanent impairment rating"
                      value={impairmentPct}
                      onChange={setImpairmentPct}
                      min={0}
                      max={100}
                      step={1}
                      accent="electric-pink"
                      suffix="%"
                      format={(v) => `${v}%`}
                      minLabel="0%"
                      maxLabel="100%"
                    />
                  </>
                )}

                {category === 'PPD_UNSCHEDULED' && (
                  <>
                    <div>
                      <label className="text-gray-300 text-sm block mb-2">Body region (whole-person)</label>
                      <select
                        value={wholePersonRegion}
                        onChange={(e) => setWholePersonRegion(e.target.value)}
                        className={selectClass}
                      >
                        {WHOLE_PERSON_REGIONS.map((r) => (
                          <option key={r.key} value={r.key} className="bg-dark-card">
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <SliderInput
                      label="Whole-person weeks (statutory)"
                      value={wholePersonWeeks}
                      onChange={setWholePersonWeeks}
                      min={100}
                      max={1000}
                      step={10}
                      accent="vivid-purple"
                      suffix="wk"
                      format={(v) => `${v} wk`}
                      minLabel="100"
                      maxLabel="1,000"
                    />
                    <SliderInput
                      label="Whole-person impairment rating"
                      value={impairmentPct}
                      onChange={setImpairmentPct}
                      min={0}
                      max={100}
                      step={1}
                      accent="electric-pink"
                      suffix="%"
                      format={(v) => `${v}%`}
                      minLabel="0%"
                      maxLabel="100%"
                    />
                  </>
                )}

                {category === 'PTD' && (
                  <SliderInput
                    label="PTD weeks (lifetime / statutory)"
                    value={ptdWeeks}
                    onChange={setPtdWeeks}
                    min={100}
                    max={1500}
                    step={10}
                    accent="vivid-purple"
                    suffix="wk"
                    format={(v) => `${v} wk`}
                    minLabel="100"
                    maxLabel="1,500"
                  />
                )}

                {/* TPD toggle */}
                <div className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] border border-white/10 px-4 py-3">
                  <span className="text-sm text-gray-300">Add temporary partial disability (light duty)?</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={includeTPD}
                    onClick={() => setIncludeTPD((v) => !v)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      includeTPD ? 'bg-vivid-purple' : 'bg-white/15'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        includeTPD ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {includeTPD && (
                  <>
                    <SliderInput
                      label="Weekly wage loss on light duty"
                      value={tpdWeeklyWageLoss}
                      onChange={setTpdWeeklyWageLoss}
                      min={0}
                      max={3000}
                      step={25}
                      accent="hot-orange"
                      prefix="$"
                      format={formatCurrency}
                      minLabel="$0"
                      maxLabel="$3,000"
                    />
                    <SliderInput
                      label="Weeks of partial disability"
                      value={tpdWeeks}
                      onChange={setTpdWeeks}
                      min={0}
                      max={260}
                      step={1}
                      accent="hot-orange"
                      suffix="wk"
                      format={(v) => `${v} wk`}
                      minLabel="0"
                      maxLabel="260"
                    />
                  </>
                )}
              </div>
            </div>

            {/* 3. Medical & Other */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-5 font-[family-name:var(--font-display)]">
                3 · Medical &amp; Other
              </h2>
              <div className="space-y-5">
                <SliderInput
                  label="Future medical / MSA buyout"
                  value={futureMedical}
                  onChange={setFutureMedical}
                  min={0}
                  max={500000}
                  step={1000}
                  accent="electric-blue"
                  prefix="$"
                  format={formatCurrency}
                  minLabel="$0"
                  maxLabel="$500K"
                />
                <SliderInput
                  label="Past owed / unpaid benefits"
                  value={pastOwedBenefits}
                  onChange={setPastOwedBenefits}
                  min={0}
                  max={200000}
                  step={500}
                  accent="electric-blue"
                  prefix="$"
                  format={formatCurrency}
                  minLabel="$0"
                  maxLabel="$200K"
                />
              </div>
            </div>

            {/* 4. Deductions */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-5 font-[family-name:var(--font-display)]">
                4 · Deductions
              </h2>
              <div className="space-y-5">
                <SliderInput
                  label="Attorney fee"
                  value={attorneyFeePct}
                  onChange={setAttorneyFeePct}
                  min={0}
                  max={40}
                  step={1}
                  accent="hot-orange"
                  suffix="%"
                  format={(v) => `${v}%`}
                  minLabel="0%"
                  maxLabel="40%"
                />
                <p className="text-xs text-gray-500 -mt-2">
                  Typical contingency fees run 15–25% and many states cap them. Future medical is excluded from the fee
                  base in this estimate.
                </p>
                <SliderInput
                  label="Liens / offsets (medical, child support, advances)"
                  value={liens}
                  onChange={setLiens}
                  min={0}
                  max={200000}
                  step={500}
                  accent="electric-pink"
                  prefix="$"
                  format={formatCurrency}
                  minLabel="$0"
                  maxLabel="$200K"
                />
              </div>
            </div>

            {/* 5. Payout structure */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-5 font-[family-name:var(--font-display)]">
                5 · Payout Structure
              </h2>
              <div className="space-y-5">
                <SliderInput
                  label="Structured payout period"
                  value={structuredYears}
                  onChange={setStructuredYears}
                  min={1}
                  max={30}
                  step={1}
                  accent="vivid-purple"
                  suffix="yr"
                  format={(v) => `${v} yr`}
                  minLabel="1"
                  maxLabel="30"
                />
                <SliderInput
                  label="Discount / growth rate"
                  value={structuredRatePct}
                  onChange={setStructuredRatePct}
                  min={0}
                  max={8}
                  step={0.25}
                  accent="vivid-purple"
                  suffix="%"
                  format={(v) => `${v}%`}
                  minLabel="0%"
                  maxLabel="8%"
                />
                <SliderInput
                  label="Estimate range (±)"
                  value={rangePct}
                  onChange={setRangePct}
                  min={0}
                  max={40}
                  step={1}
                  accent="electric-blue"
                  suffix="%"
                  format={(v) => `±${v}%`}
                  minLabel="0%"
                  maxLabel="40%"
                />
              </div>
            </div>
          </motion.div>

          {/* ---------------------------- RESULTS ---------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 lg:sticky lg:top-24 self-start"
          >
            {/* Headline gross + range */}
            <div className="glass-card p-6 relative overflow-hidden border border-vivid-purple/40">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-vivid-purple opacity-70" />
              <div className="pl-2">
                <p className="text-[11px] text-gray-400 uppercase tracking-[0.18em] mb-1.5">
                  Estimated Gross Settlement
                </p>
                <p className="text-4xl font-bold text-vivid-purple font-[family-name:var(--font-display)] tracking-tight">
                  {formatCurrency(results.grossSettlement)}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Likely range {formatCurrency(results.lowEstimate)} – {formatCurrency(results.highEstimate)}
                </p>
              </div>
            </div>

            <ResultCard
              label="Net to Worker"
              value={formatCurrency(results.netToWorker)}
              subtitle={`After ${attorneyFeePct}% attorney fee${results.liens > 0 ? ' & liens' : ''}`}
              trend="up"
              accentColor="neon-green"
            />
            <ResultCard
              label="Comp Rate Used"
              value={`${formatCurrency(results.effectiveCompRate)}/wk`}
              subtitle={
                results.capApplied
                  ? `Capped at ${stateData.name} state maximum`
                  : results.floorApplied
                  ? `Raised to ${stateData.name} state minimum`
                  : `${compRatePct.toFixed(2)}% of ${formatCurrency(effectiveAWW)} AWW`
              }
              accentColor="electric-blue"
            />
            <ResultCard
              label="Structured Option"
              value={`${formatCurrency(results.structuredMonthly)}/mo`}
              subtitle={`For ${structuredYears} yrs · nominal total ${formatCurrency(results.structuredTotalNominal)}`}
              accentColor="vivid-purple"
            />

            {/* Itemized breakdown */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white mb-4 font-[family-name:var(--font-display)]">
                Itemized Breakdown
              </h3>
              <div className="space-y-2.5 text-sm">
                <Row label="Temporary total disability (TTD)" value={results.ttd} />
                {results.tpd > 0 && <Row label="Temporary partial disability (TPD)" value={results.tpd} />}
                {results.permanent > 0 && <Row label={results.permanentLabel} value={results.permanent} />}
                <Row label="Future medical" value={results.futureMedical} />
                <Row label="Past owed benefits" value={results.pastOwed} />
                <div className="border-t border-white/10 my-2" />
                <Row label="Gross settlement" value={results.grossSettlement} strong />
                <Row label={`Attorney fee (${attorneyFeePct}%)`} value={-results.attorneyFees} negative />
                <Row label="Liens / offsets" value={-results.liens} negative />
                <div className="border-t border-white/10 my-2" />
                <Row label="Net to worker" value={results.netToWorker} strong accent="neon-green" />
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <CopyButton getText={summary} />
                <ExportPdfButton getReport={buildReport} fileSlug="workers-comp" />
                <button
                  onClick={resetDefaults}
                  className="inline-flex items-center gap-2 text-sm text-gray-400 border border-white/10 hover:border-vivid-purple/40 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reset to defaults
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <AdPlaceholder className="my-8" />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <ChartContainer title="Settlement Composition">
              {results.breakdown.length > 0 ? (
                <DarkDoughnut data={doughnutData} />
              ) : (
                <p className="text-sm text-gray-500 py-12 text-center">
                  Add disability, medical, or owed-benefit values to see the composition.
                </p>
              )}
            </ChartContainer>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <ChartContainer title="Lump Sum vs Structured Payout">
              <DarkBar data={payoutBarData} />
            </ChartContainer>
          </motion.div>
        </div>

        <AdPlaceholder className="my-8" />

        {/* ---------------------- EDUCATIONAL CONTENT ---------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 space-y-6"
        >
          <div className="text-center mb-2">
            <span className="eyebrow-chip text-xs uppercase tracking-[0.18em] text-vivid-purple">
              <span className="w-1.5 h-1.5 rounded-full bg-vivid-purple" />
              The Frank Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-display)] mt-4">
              Understanding Your Workers&apos; Comp Settlement
            </h2>
          </div>

          <Article title="How workers' comp settlements are calculated">
            <p>
              Most settlements are built from a handful of moving parts. Start with your{' '}
              <strong className="text-white">average weekly wage</strong>, multiply by a{' '}
              <strong className="text-white">comp rate</strong> (usually two-thirds) to get your weekly benefit, then
              add up the weeks you are owed for temporary and permanent disability. On top of that, the parties value
              your <strong className="text-white">future medical care</strong> and any{' '}
              <strong className="text-white">past benefits</strong> that went unpaid. Attorney fees and liens are
              subtracted to arrive at what actually lands in your pocket.
            </p>
          </Article>

          <Article title="What is Average Weekly Wage (AWW)?">
            <p>
              Your AWW is the average of your gross earnings — typically including overtime and bonuses — over roughly
              the 52 weeks before your injury. It is the foundation of nearly every benefit, so getting it right
              matters. If your hours varied, missing overtime or a second job can quietly shrink every number that
              follows. Use the &ldquo;compute AWW from earnings&rdquo; helper above if you want to divide total wages by
              the weeks you actually worked.
            </p>
          </Article>

          <Article title="Scheduled vs unscheduled (whole-person) injuries">
            <p>
              Many states keep a <strong className="text-white">schedule</strong> that assigns a fixed number of weeks
              to specific body parts — an arm, hand, leg, eye, and so on. A permanent injury to a scheduled member pays
              the comp rate times those weeks times your impairment percentage. Injuries that are not on the schedule —
              the back, neck, head, or internal and psychological conditions — are valued as{' '}
              <strong className="text-white">whole-person</strong> (unscheduled) losses, using a statutory week count
              and a whole-person impairment rating instead.
            </p>
          </Article>

          <Article title="What is a permanent impairment rating?">
            <p>
              Once you reach <strong className="text-white">maximum medical improvement</strong> — the point where your
              condition is not expected to improve much further — a doctor assigns an impairment rating, expressed as a
              percentage. Many evaluators use the AMA Guides to the Evaluation of Permanent Impairment. That percentage
              scales your permanent disability award: a 10% rating on a 200-week body part pays far less than a 50%
              rating on the same part.
            </p>
          </Article>

          <Article title="Temporary vs permanent — partial vs total">
            <p>
              <strong className="text-white">Temporary total disability (TTD)</strong> replaces wages while you are
              fully off work and recovering. <strong className="text-white">Temporary partial disability (TPD)</strong>{' '}
              covers part of your wage loss when you return on light duty at reduced pay. When your condition stabilizes
              with lasting effects, benefits shift to <strong className="text-white">permanent partial disability
              (PPD)</strong> or, for the most serious cases that prevent any gainful work,{' '}
              <strong className="text-white">permanent total disability (PTD)</strong>, which can extend for many years
              or even for life.
            </p>
          </Article>

          <Article title="Lump sum vs structured settlement">
            <p>
              A <strong className="text-white">lump sum</strong> (often a &ldquo;compromise and release&rdquo;) pays
              everything at once — full control, but it has to last. A{' '}
              <strong className="text-white">structured settlement</strong> spreads payments over months or years, which
              can help with budgeting and protect against spending it all too soon. Because money has a time value, the
              nominal total of a structured payout is usually larger than the lump sum, even though they can be worth
              the same today. Use the comparison above to see both side by side.
            </p>
          </Article>

          <Article title="How attorney fees work">
            <p>
              Workers&apos; comp attorneys almost always work on contingency — they are paid a percentage of what they
              recover for you, commonly in the 15–25% range, and many states cap the fee or require a judge to approve
              it. Some states exclude future medical funds from the fee base. Always confirm the fee agreement in
              writing before signing.
            </p>
          </Article>

          <Article title="Factors that affect your settlement">
            <p>
              Beyond the math, real-world value swings on the strength of your medical evidence, whether the injury is
              disputed, your impairment rating, your age and earning capacity, the cost of expected future treatment,
              your state&apos;s specific caps and statutes, and how well the case is negotiated. Two workers with
              identical injuries can settle for very different amounts.
            </p>
          </Article>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-display)] mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq) => (
              <details key={faq.q} className="glass-card p-5 group">
                <summary className="flex items-center justify-between cursor-pointer list-none text-white font-medium">
                  <span>{faq.q}</span>
                  <span className="text-vivid-purple text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="text-sm text-gray-400 leading-relaxed mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </motion.div>

        {/* Legal Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 glass-card p-6 border-hot-orange/30"
        >
          <h3 className="text-sm font-semibold text-hot-orange uppercase tracking-wider mb-3">
            Important Legal Disclaimer
          </h3>
          <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
            <p>
              This calculator provides a rough ESTIMATE only and is NOT legal, financial, or tax advice. It uses
              simplified, representative formulas and approximate state figures that change frequently and may not match
              your state&apos;s current rates, caps, schedules, or eligibility rules.
            </p>
            <p>
              Actual workers&apos; compensation settlements vary significantly based on jurisdiction, the strength of
              your medical evidence, disputed facts, your impairment rating, insurer policies, and negotiation. Body-part
              schedules, maximum weekly rates, attorney-fee caps, and whole-person values differ in every state and are
              updated regularly.
            </p>
            <p>
              We strongly recommend consulting a qualified workers&apos; compensation attorney licensed in your
              jurisdiction for an accurate assessment of your claim. Using this tool does not create an attorney-client
              relationship. It is for informational and educational purposes only.
            </p>
          </div>
        </motion.div>

        <AdPlaceholder className="mt-8" />
      </div>
    </div>
  );
}

/* ----------------------------- small helpers ----------------------------- */

function Row({
  label,
  value,
  strong = false,
  negative = false,
  accent,
}: {
  label: string;
  value: number;
  strong?: boolean;
  negative?: boolean;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`${strong ? 'text-white font-medium' : 'text-gray-400'}`}>{label}</span>
      <span
        className={`font-semibold tabular-nums ${
          accent ? `text-${accent}` : negative ? 'text-hot-orange' : strong ? 'text-white' : 'text-gray-200'
        }`}
      >
        {negative && value !== 0 ? '-' : ''}
        {formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}

function Article({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-3 font-[family-name:var(--font-display)]">{title}</h3>
      <div className="text-sm text-gray-400 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}
