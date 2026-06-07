'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { calculateSIPAdvanced, solveSIPForGoal } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import ResultCard from '@/components/ResultCard';
import SliderInput from '@/components/SliderInput';
import CopyButton from '@/components/CopyButton';
import ExportPdfButton from '@/components/ExportPdfButton';
import type { PdfReport } from '@/lib/pdfReport';
import { ChartContainer, DarkBar, DarkDoughnut, chartColors } from '@/components/ChartWrapper';
import AdPlaceholder from '@/components/AdPlaceholder';
import CalculatorContent from '@/components/CalculatorContent';

type Mode = 'invest' | 'goal';

const DEFAULTS = {
  monthlyInvestment: 10000,
  expectedReturn: 12,
  years: 15,
  stepUp: 0,
  lumpSum: 0,
  inflation: 6,
  targetCorpus: 10000000,
};

export default function SIPCalculator() {
  const [mode, setMode] = useState<Mode>('invest');
  const [monthlyInvestment, setMonthlyInvestment] = useState(DEFAULTS.monthlyInvestment);
  const [expectedReturn, setExpectedReturn] = useState(DEFAULTS.expectedReturn);
  const [years, setYears] = useState(DEFAULTS.years);
  const [stepUp, setStepUp] = useState(DEFAULTS.stepUp);
  const [lumpSum, setLumpSum] = useState(DEFAULTS.lumpSum);
  const [inflation, setInflation] = useState(DEFAULTS.inflation);
  const [targetCorpus, setTargetCorpus] = useState(DEFAULTS.targetCorpus);
  const [showTable, setShowTable] = useState(false);

  // In goal mode, derive the required monthly SIP and feed it back into the model.
  const requiredMonthly = useMemo(
    () => (mode === 'goal' ? solveSIPForGoal(targetCorpus, expectedReturn, years, stepUp, lumpSum) : monthlyInvestment),
    [mode, targetCorpus, expectedReturn, years, stepUp, lumpSum, monthlyInvestment]
  );

  const results = useMemo(
    () => calculateSIPAdvanced(requiredMonthly, expectedReturn, years, stepUp, lumpSum, inflation),
    [requiredMonthly, expectedReturn, years, stepUp, lumpSum, inflation]
  );

  const resetDefaults = () => {
    setMonthlyInvestment(DEFAULTS.monthlyInvestment);
    setExpectedReturn(DEFAULTS.expectedReturn);
    setYears(DEFAULTS.years);
    setStepUp(DEFAULTS.stepUp);
    setLumpSum(DEFAULTS.lumpSum);
    setInflation(DEFAULTS.inflation);
    setTargetCorpus(DEFAULTS.targetCorpus);
  };

  const barData = useMemo(() => {
    const breakdown = results.yearlyBreakdown;
    const step = Math.max(1, Math.floor(breakdown.length / 15));
    const filtered = breakdown.filter((_, i) => i % step === 0 || i === breakdown.length - 1);
    return {
      labels: filtered.map((y) => `Yr ${y.year}`),
      datasets: [
        {
          label: 'Amount Invested',
          data: filtered.map((y) => Math.round(y.invested)),
          backgroundColor: chartColors.electricBlue,
          borderColor: 'rgba(0, 212, 255, 0.5)',
          borderWidth: 1,
        },
        {
          label: 'Total Value',
          data: filtered.map((y) => Math.round(y.value)),
          backgroundColor: chartColors.neonGreen,
          borderColor: 'rgba(0, 255, 136, 0.5)',
          borderWidth: 1,
        },
      ],
    };
  }, [results.yearlyBreakdown]);

  const doughnutData = {
    labels: ['Total Invested', 'Wealth Gained'],
    datasets: [
      {
        data: [Math.round(results.totalInvested), Math.round(results.estimatedReturns)],
        backgroundColor: [chartColors.electricBlue, chartColors.neonGreen],
        borderColor: ['rgba(0, 212, 255, 0.3)', 'rgba(0, 255, 136, 0.3)'],
        borderWidth: 2,
      },
    ],
  };

  const summary = () =>
    [
      'SIP Summary',
      mode === 'goal'
        ? `Goal: ${formatCurrency(targetCorpus)} in ${years} years → invest ${formatCurrency(requiredMonthly)}/mo`
        : `Monthly SIP: ${formatCurrency(requiredMonthly)} for ${years} years`,
      stepUp > 0 ? `Annual step-up: ${stepUp}%` : '',
      lumpSum > 0 ? `Initial lump sum: ${formatCurrency(lumpSum)}` : '',
      `Expected return: ${expectedReturn}%`,
      `Total invested: ${formatCurrency(results.totalInvested)}`,
      `Projected value: ${formatCurrency(results.totalValue)}`,
      `Wealth gained: ${formatCurrency(results.estimatedReturns)}`,
      `Inflation-adjusted value: ${formatCurrency(results.realValue)} (at ${inflation}%)`,
    ]
      .filter(Boolean)
      .join('\n');

  const buildReport = (): PdfReport => ({
    calculatorName: 'SIP Calculator',
    accentColor: chartColors.neonGreen,
    heroValue:
      mode === 'goal'
        ? {
            label: 'Required Monthly SIP',
            value: formatCurrency(requiredMonthly),
            sub: `To reach ${formatCurrency(targetCorpus)} in ${years} years`,
          }
        : {
            label: 'Projected Value',
            value: formatCurrency(results.totalValue),
            sub: `After ${years} years investing ${formatCurrency(requiredMonthly)}/mo`,
          },
    kpis: [
      { label: 'Total Invested', value: formatCurrency(results.totalInvested), sub: stepUp > 0 ? `With ${stepUp}% annual step-up` : `Over ${years * 12} months` },
      { label: 'Projected Value', value: formatCurrency(results.totalValue), sub: `After ${years} years` },
      { label: 'Wealth Gained', value: formatCurrency(results.estimatedReturns), sub: `${((results.estimatedReturns / Math.max(1, results.totalInvested)) * 100).toFixed(0)}% return on investment` },
      { label: 'Inflation-Adjusted', value: formatCurrency(results.realValue), sub: `Real value at ${inflation}% inflation` },
    ],
    donut: {
      title: 'Investment vs Returns',
      formatValue: formatCurrency,
      segments: [
        { label: 'Total Invested', value: Math.round(results.totalInvested), color: chartColors.electricBlue },
        { label: 'Wealth Gained', value: Math.round(results.estimatedReturns), color: chartColors.neonGreen },
      ],
    },
    breakdown: {
      title: 'Projection summary',
      rows: [
        { label: 'Total invested', value: formatCurrency(results.totalInvested) },
        { label: 'Wealth gained (returns)', value: formatCurrency(results.estimatedReturns) },
        { label: 'Projected corpus', value: formatCurrency(results.totalValue), isTotal: true },
      ],
    },
    inputs: [
      ...(mode === 'goal'
        ? [{ label: 'Target corpus', value: formatCurrency(targetCorpus) }]
        : [{ label: 'Monthly investment', value: formatCurrency(monthlyInvestment) }]),
      { label: 'Expected annual return', value: `${expectedReturn}%` },
      { label: 'Investment period', value: `${years} years` },
      { label: 'Annual step-up', value: `${stepUp}%` },
      { label: 'Initial lump sum', value: formatCurrency(lumpSum) },
      { label: 'Expected inflation', value: `${inflation}%` },
    ],
    notes: [
      `Of your ${formatCurrency(results.totalValue)} projected corpus, ${formatCurrency(results.estimatedReturns)} comes from compounding — not your own contributions.`,
      `In today's money, that corpus is worth about ${formatCurrency(results.realValue)} after ${inflation}% annual inflation.`,
      ...(stepUp > 0 ? [`A ${stepUp}% annual step-up steadily lifts your contributions to keep pace with rising income.`] : []),
    ],
    disclaimer:
      'This report is for informational purposes only and is not investment advice. Returns are assumed constant and are not guaranteed; actual market returns vary and may be negative.',
  });

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="text-sm text-electric-blue hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-display)] mb-2">
            SIP Calculator
          </h1>
          <p className="text-gray-400 mb-8">
            Model step-up SIPs, lump-sum combos and inflation — or work backwards from a goal to find the SIP you need.
          </p>
        </motion.div>

        {/* Mode toggle */}
        <div className="inline-flex p-1 mb-8 rounded-xl bg-white/5 border border-white/10">
          {(['invest', 'goal'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === m ? 'bg-neon-green/15 text-neon-green' : 'text-gray-400 hover:text-white'
              }`}
            >
              {m === 'invest' ? 'Plan by Investment' : 'Plan by Goal'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-display)]">Investment Details</h2>
              <button
                onClick={resetDefaults}
                className="text-xs text-gray-400 hover:text-neon-green border border-white/10 hover:border-neon-green/40 px-3 py-1.5 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="space-y-6">
              {mode === 'invest' ? (
                <SliderInput
                  label="Monthly Investment"
                  value={monthlyInvestment}
                  onChange={setMonthlyInvestment}
                  min={500}
                  max={1000000}
                  step={500}
                  accent="neon-green"
                  prefix="$"
                  format={formatCurrency}
                  minLabel="$500"
                  maxLabel="$1M"
                />
              ) : (
                <SliderInput
                  label="Target Corpus"
                  value={targetCorpus}
                  onChange={setTargetCorpus}
                  min={100000}
                  max={100000000}
                  step={100000}
                  accent="neon-green"
                  prefix="$"
                  format={formatCurrency}
                  minLabel="$100K"
                  maxLabel="$100M"
                />
              )}
              <SliderInput
                label="Expected Annual Return"
                value={expectedReturn}
                onChange={setExpectedReturn}
                min={1}
                max={30}
                step={0.5}
                accent="neon-green"
                suffix="%"
                format={(v) => `${v}%`}
                minLabel="1%"
                maxLabel="30%"
              />
              <SliderInput
                label="Investment Period"
                value={years}
                onChange={setYears}
                min={1}
                max={40}
                step={1}
                accent="neon-green"
                suffix="yr"
                format={(v) => `${v} years`}
                minLabel="1 year"
                maxLabel="40 years"
              />
              <SliderInput
                label="Annual Step-Up"
                value={stepUp}
                onChange={setStepUp}
                min={0}
                max={25}
                step={1}
                accent="electric-blue"
                suffix="%"
                format={(v) => `${v}% / year`}
                minLabel="0%"
                maxLabel="25%"
              />
              <SliderInput
                label="Initial Lump Sum"
                value={lumpSum}
                onChange={setLumpSum}
                min={0}
                max={5000000}
                step={10000}
                accent="vivid-purple"
                prefix="$"
                format={formatCurrency}
                minLabel="$0"
                maxLabel="$5M"
              />
              <SliderInput
                label="Expected Inflation"
                value={inflation}
                onChange={setInflation}
                min={0}
                max={15}
                step={0.5}
                accent="hot-orange"
                suffix="%"
                format={(v) => `${v}%`}
                minLabel="0%"
                maxLabel="15%"
              />
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {mode === 'goal' && (
              <ResultCard
                label="Required Monthly SIP"
                value={formatCurrency(requiredMonthly)}
                subtitle={`To reach ${formatCurrency(targetCorpus)} in ${years} years`}
                trend="up"
                accentColor="neon-green"
              />
            )}
            <ResultCard
              label={mode === 'goal' ? 'Projected Value' : 'Total Value'}
              value={formatCurrency(results.totalValue)}
              subtitle={`After ${years} years of investing`}
              trend="up"
              accentColor={mode === 'goal' ? 'electric-blue' : 'neon-green'}
            />
            <ResultCard
              label="Total Invested"
              value={formatCurrency(results.totalInvested)}
              subtitle={stepUp > 0 ? `With ${stepUp}% annual step-up` : `Over ${years * 12} months`}
              accentColor="electric-blue"
            />
            <ResultCard
              label="Wealth Gained"
              value={formatCurrency(results.estimatedReturns)}
              subtitle={`${((results.estimatedReturns / Math.max(1, results.totalInvested)) * 100).toFixed(0)}% returns on investment`}
              trend="up"
              accentColor="vivid-purple"
            />
            <ResultCard
              label="Inflation-Adjusted Value"
              value={formatCurrency(results.realValue)}
              subtitle={`Real worth in today's dollars at ${inflation}% inflation`}
              accentColor="hot-orange"
            />
            <div className="pt-1 flex flex-wrap gap-3">
              <CopyButton getText={summary} />
              <ExportPdfButton getReport={buildReport} fileSlug="sip" />
            </div>
          </motion.div>
        </div>

        <AdPlaceholder className="my-8" />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <ChartContainer title="Invested vs Value Over Time">
              <DarkBar data={barData} />
            </ChartContainer>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <ChartContainer title="Investment vs Returns">
              <DarkDoughnut data={doughnutData} />
            </ChartContainer>
          </motion.div>
        </div>

        {/* Year-wise table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="glass-card p-6 mt-8"
        >
          <button onClick={() => setShowTable((s) => !s)} className="w-full flex items-center justify-between text-left">
            <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-display)]">Year-by-Year Breakdown</h3>
            <span className={`text-electric-blue transition-transform ${showTable ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {showTable && (
            <div className="mt-4 max-h-[420px] overflow-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-dark-surface/95 backdrop-blur">
                  <tr className="text-gray-400 text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-3">Year</th>
                    <th className="text-right px-4 py-3">Invested</th>
                    <th className="text-right px-4 py-3">Value</th>
                    <th className="text-right px-4 py-3">Real Value</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-2.5 text-gray-300">{row.year}</td>
                      <td className="px-4 py-2.5 text-right text-electric-blue">{formatCurrency(row.invested)}</td>
                      <td className="px-4 py-2.5 text-right text-neon-green">{formatCurrency(row.value)}</td>
                      <td className="px-4 py-2.5 text-right text-hot-orange">{formatCurrency(row.realValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <CalculatorContent slug="sip" />

        <AdPlaceholder className="mt-8" />
      </div>
    </div>
  );
}
