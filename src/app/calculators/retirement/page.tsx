'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { calculateRetirementPlan } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import ResultCard from '@/components/ResultCard';
import SliderInput from '@/components/SliderInput';
import CopyButton from '@/components/CopyButton';
import ExportPdfButton from '@/components/ExportPdfButton';
import type { PdfReport } from '@/lib/pdfReport';
import { ChartContainer, DarkDoughnut, DarkLine, chartColors } from '@/components/ChartWrapper';
import AdPlaceholder from '@/components/AdPlaceholder';
import CalculatorContent from '@/components/CalculatorContent';

const DEFAULTS = {
  currentAge: 30,
  retirementAge: 60,
  lifeExpectancy: 85,
  currentSavings: 50000,
  monthlyContribution: 1500,
  preReturn: 8,
  postReturn: 5,
  inflation: 3,
  desiredMonthlyIncome: 5000,
};

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(DEFAULTS.currentAge);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS.retirementAge);
  const [lifeExpectancy, setLifeExpectancy] = useState(DEFAULTS.lifeExpectancy);
  const [currentSavings, setCurrentSavings] = useState(DEFAULTS.currentSavings);
  const [monthlyContribution, setMonthlyContribution] = useState(DEFAULTS.monthlyContribution);
  const [preReturn, setPreReturn] = useState(DEFAULTS.preReturn);
  const [postReturn, setPostReturn] = useState(DEFAULTS.postReturn);
  const [inflation, setInflation] = useState(DEFAULTS.inflation);
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState(DEFAULTS.desiredMonthlyIncome);

  const results = useMemo(
    () =>
      calculateRetirementPlan({
        currentAge,
        retirementAge,
        lifeExpectancy,
        currentSavings,
        monthlyContribution,
        preReturn,
        postReturn,
        inflation,
        desiredMonthlyIncome,
      }),
    [currentAge, retirementAge, lifeExpectancy, currentSavings, monthlyContribution, preReturn, postReturn, inflation, desiredMonthlyIncome]
  );

  const resetDefaults = () => {
    setCurrentAge(DEFAULTS.currentAge);
    setRetirementAge(DEFAULTS.retirementAge);
    setLifeExpectancy(DEFAULTS.lifeExpectancy);
    setCurrentSavings(DEFAULTS.currentSavings);
    setMonthlyContribution(DEFAULTS.monthlyContribution);
    setPreReturn(DEFAULTS.preReturn);
    setPostReturn(DEFAULTS.postReturn);
    setInflation(DEFAULTS.inflation);
    setDesiredMonthlyIncome(DEFAULTS.desiredMonthlyIncome);
  };

  const doughnutData = {
    labels: ['Total Contributed', 'Growth (Returns)'],
    datasets: [
      {
        data: [Math.round(results.totalContributed), Math.round(Math.max(0, results.totalGrowth))],
        backgroundColor: [chartColors.electricBlue, chartColors.neonGreen],
        borderColor: ['rgba(0, 212, 255, 0.3)', 'rgba(0, 255, 136, 0.3)'],
        borderWidth: 2,
      },
    ],
  };

  const lineData = useMemo(() => {
    const labels = results.accumulation.map((a) => `Age ${a.age}`);
    return {
      labels,
      datasets: [
        {
          label: 'Projected Portfolio',
          data: results.accumulation.map((a) => Math.round(a.balance)),
          borderColor: chartColors.neonGreen,
          backgroundColor: 'rgba(0, 255, 136, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Contributions Only',
          data: results.accumulation.map((a) => Math.round(a.contributions)),
          borderColor: chartColors.electricBlue,
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
        },
      ],
    };
  }, [results.accumulation]);

  const summary = () =>
    [
      'Retirement Plan Summary',
      `Age ${currentAge} → retire at ${retirementAge}, plan through ${lifeExpectancy}`,
      `Current savings: ${formatCurrency(currentSavings)} · Contributing ${formatCurrency(monthlyContribution)}/mo`,
      `Returns: ${preReturn}% pre / ${postReturn}% post · Inflation ${inflation}%`,
      `Projected corpus at retirement: ${formatCurrency(results.retirementCorpus)}`,
      `Desired income: ${formatCurrency(desiredMonthlyIncome)}/mo today (${formatCurrency(results.desiredMonthlyIncomeAtRetirement)}/mo at retirement)`,
      `Corpus needed: ${formatCurrency(results.requiredCorpus)}`,
      results.corpusLasts
        ? `On track — surplus of ${formatCurrency(results.surplusOrShortfall)}.`
        : `Shortfall of ${formatCurrency(Math.abs(results.surplusOrShortfall))}; funds run out around age ${results.depletionAge}.`,
    ].join('\n');

  const buildReport = (): PdfReport => ({
    calculatorName: 'Retirement Savings Calculator',
    accentColor: chartColors.neonGreen,
    heroValue: {
      label: 'Projected Retirement Corpus',
      value: formatCurrency(results.retirementCorpus),
      sub: `At age ${retirementAge} · ${results.corpusLasts ? 'on track' : 'shortfall'} through age ${lifeExpectancy}`,
    },
    kpis: [
      { label: 'Corpus Needed', value: formatCurrency(results.requiredCorpus), sub: `For ${formatCurrency(results.desiredMonthlyIncomeAtRetirement)}/mo` },
      { label: 'Total Contributed', value: formatCurrency(results.totalContributed), sub: 'Your out-of-pocket savings' },
      { label: 'Growth from Returns', value: formatCurrency(results.totalGrowth), sub: `${((results.totalGrowth / Math.max(1, results.totalContributed)) * 100).toFixed(0)}% on contributions` },
      {
        label: results.corpusLasts ? 'Surplus' : 'Shortfall',
        value: formatCurrency(Math.abs(results.surplusOrShortfall)),
        sub: results.corpusLasts ? 'Projected cushion' : `Funds run out ~age ${results.depletionAge ?? lifeExpectancy}`,
      },
    ],
    donut: {
      title: 'Contributions vs Growth',
      formatValue: formatCurrency,
      segments: [
        { label: 'Total Contributed', value: Math.round(results.totalContributed), color: chartColors.electricBlue },
        { label: 'Growth (Returns)', value: Math.round(Math.max(0, results.totalGrowth)), color: chartColors.neonGreen },
      ],
    },
    breakdown: {
      title: 'Retirement readiness',
      rows: [
        { label: 'Projected corpus at retirement', value: formatCurrency(results.retirementCorpus) },
        { label: 'Corpus needed', value: formatCurrency(results.requiredCorpus) },
        {
          label: results.corpusLasts ? 'Surplus' : 'Shortfall',
          value: formatCurrency(Math.abs(results.surplusOrShortfall)),
          isNegative: !results.corpusLasts,
          isTotal: true,
        },
      ],
    },
    inputs: [
      { label: 'Current age', value: `${currentAge}` },
      { label: 'Retirement age', value: `${retirementAge}` },
      { label: 'Life expectancy', value: `${lifeExpectancy}` },
      { label: 'Current savings', value: formatCurrency(currentSavings) },
      { label: 'Monthly contribution', value: formatCurrency(monthlyContribution) },
      { label: 'Pre / post returns', value: `${preReturn}% / ${postReturn}%` },
      { label: 'Expected inflation', value: `${inflation}%` },
      { label: 'Desired monthly income', value: `${formatCurrency(desiredMonthlyIncome)} (today's $)` },
    ],
    notes: [
      results.corpusLasts
        ? `You're on track: your projected ${formatCurrency(results.retirementCorpus)} corpus covers the ${formatCurrency(results.requiredCorpus)} you need, with a ${formatCurrency(results.surplusOrShortfall)} cushion.`
        : `There's a gap of ${formatCurrency(Math.abs(results.surplusOrShortfall))} between your projected corpus and what you need — increasing contributions or delaying retirement helps close it.`,
      `Of your projected corpus, ${formatCurrency(Math.max(0, results.totalGrowth))} comes from investment growth on ${formatCurrency(results.totalContributed)} of contributions.`,
    ],
    disclaimer:
      'This report is for informational purposes only and is not financial advice. Projections assume constant returns and inflation; actual outcomes will vary with markets, taxes and personal circumstances.',
  });

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="text-sm text-electric-blue hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-display)] mb-2">
            Retirement Savings Calculator
          </h1>
          <p className="text-gray-400 mb-8">
            Project your nest egg, set your desired income, and find out whether your savings will last through retirement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-display)]">Retirement Plan</h2>
              <button
                onClick={resetDefaults}
                className="text-xs text-gray-400 hover:text-electric-blue border border-white/10 hover:border-electric-blue/40 px-3 py-1.5 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="space-y-6">
              <SliderInput label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={70} step={1} accent="electric-blue" suffix="yr" format={(v) => `${v}`} minLabel="18" maxLabel="70" />
              <SliderInput label="Retirement Age" value={retirementAge} onChange={setRetirementAge} min={Math.max(currentAge + 1, 40)} max={80} step={1} accent="electric-blue" suffix="yr" format={(v) => `${v}`} minLabel="40" maxLabel="80" />
              <SliderInput label="Life Expectancy" value={lifeExpectancy} onChange={setLifeExpectancy} min={Math.max(retirementAge + 1, 70)} max={105} step={1} accent="electric-blue" suffix="yr" format={(v) => `${v}`} minLabel="70" maxLabel="105" />
              <SliderInput label="Current Savings" value={currentSavings} onChange={setCurrentSavings} min={0} max={2000000} step={5000} accent="neon-green" prefix="$" format={formatCurrency} minLabel="$0" maxLabel="$2M" />
              <SliderInput label="Monthly Contribution" value={monthlyContribution} onChange={setMonthlyContribution} min={0} max={50000} step={100} accent="neon-green" prefix="$" format={formatCurrency} minLabel="$0" maxLabel="$50K" />
              <SliderInput label="Pre-Retirement Return" value={preReturn} onChange={setPreReturn} min={1} max={15} step={0.5} accent="vivid-purple" suffix="%" format={(v) => `${v}%`} minLabel="1%" maxLabel="15%" />
              <SliderInput label="Post-Retirement Return" value={postReturn} onChange={setPostReturn} min={1} max={12} step={0.5} accent="vivid-purple" suffix="%" format={(v) => `${v}%`} minLabel="1%" maxLabel="12%" />
              <SliderInput label="Expected Inflation" value={inflation} onChange={setInflation} min={0} max={10} step={0.5} accent="hot-orange" suffix="%" format={(v) => `${v}%`} minLabel="0%" maxLabel="10%" />
              <SliderInput label="Desired Monthly Income (today's $)" value={desiredMonthlyIncome} onChange={setDesiredMonthlyIncome} min={500} max={50000} step={500} accent="electric-pink" prefix="$" format={formatCurrency} minLabel="$500" maxLabel="$50K" />
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Longevity verdict */}
            <div className={`glass-card p-5 relative overflow-hidden border ${results.corpusLasts ? 'border-neon-green/40' : 'border-hot-orange/40'}`}>
              <div className={`absolute top-0 left-0 bottom-0 w-1 ${results.corpusLasts ? 'bg-neon-green' : 'bg-hot-orange'} opacity-70`} />
              <div className="pl-2">
                <p className="text-[11px] text-gray-400 uppercase tracking-[0.18em] mb-1.5">Longevity Check</p>
                <p className={`text-2xl font-bold font-[family-name:var(--font-display)] ${results.corpusLasts ? 'text-neon-green' : 'text-hot-orange'}`}>
                  {results.corpusLasts ? 'On Track' : 'Shortfall'}
                </p>
                <p className="text-xs text-gray-400 mt-1.5">
                  {results.corpusLasts
                    ? `Surplus of ${formatCurrency(results.surplusOrShortfall)} — your savings should last through age ${lifeExpectancy}.`
                    : `Short by ${formatCurrency(Math.abs(results.surplusOrShortfall))}. At this pace funds run out around age ${results.depletionAge ?? lifeExpectancy}.`}
                </p>
              </div>
            </div>

            <ResultCard label="Retirement Corpus" value={formatCurrency(results.retirementCorpus)} subtitle={`At age ${retirementAge}`} trend="up" accentColor="neon-green" />
            <ResultCard label="Corpus Needed" value={formatCurrency(results.requiredCorpus)} subtitle={`For ${formatCurrency(results.desiredMonthlyIncomeAtRetirement)}/mo through age ${lifeExpectancy}`} accentColor="electric-pink" />
            <ResultCard label="Total Contributed" value={formatCurrency(results.totalContributed)} subtitle="Your out-of-pocket savings" accentColor="electric-blue" />
            <ResultCard label="Growth from Returns" value={formatCurrency(results.totalGrowth)} subtitle={`${((results.totalGrowth / Math.max(1, results.totalContributed)) * 100).toFixed(0)}% return on contributions`} trend="up" accentColor="vivid-purple" />
            <div className="pt-1 flex flex-wrap gap-3">
              <CopyButton getText={summary} />
              <ExportPdfButton getReport={buildReport} fileSlug="retirement" />
            </div>
          </motion.div>
        </div>

        <AdPlaceholder className="my-8" />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <ChartContainer title="Portfolio Growth to Retirement">
              <DarkLine data={lineData} />
            </ChartContainer>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <ChartContainer title="Contributions vs Growth">
              <DarkDoughnut data={doughnutData} />
            </ChartContainer>
          </motion.div>
        </div>

        <CalculatorContent slug="retirement" />

        <AdPlaceholder className="mt-8" />
      </div>
    </div>
  );
}
