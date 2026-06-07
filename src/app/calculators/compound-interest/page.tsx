'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { calculateCompoundAdvanced, type ContributionFrequency } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import ResultCard from '@/components/ResultCard';
import SliderInput from '@/components/SliderInput';
import CopyButton from '@/components/CopyButton';
import ExportPdfButton from '@/components/ExportPdfButton';
import type { PdfReport } from '@/lib/pdfReport';
import { ChartContainer, DarkLine, DarkDoughnut, chartColors } from '@/components/ChartWrapper';
import AdPlaceholder from '@/components/AdPlaceholder';
import CalculatorContent from '@/components/CalculatorContent';

const DEFAULTS = {
  principal: 100000,
  rate: 8,
  years: 10,
  frequency: 12,
  contribution: 500,
  contributionFrequency: 'monthly' as ContributionFrequency,
  inflation: 3,
};

const frequencyLabels: Record<number, string> = {
  1: 'Annually',
  2: 'Semi-annually',
  4: 'Quarterly',
  12: 'Monthly',
  365: 'Daily',
};

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(DEFAULTS.principal);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [years, setYears] = useState(DEFAULTS.years);
  const [frequency, setFrequency] = useState(DEFAULTS.frequency);
  const [contribution, setContribution] = useState(DEFAULTS.contribution);
  const [contributionFrequency, setContributionFrequency] = useState<ContributionFrequency>(
    DEFAULTS.contributionFrequency
  );
  const [inflation, setInflation] = useState(DEFAULTS.inflation);
  const [showTable, setShowTable] = useState(false);

  const results = useMemo(
    () =>
      calculateCompoundAdvanced(
        principal,
        rate,
        years,
        frequency,
        contribution,
        contributionFrequency,
        inflation
      ),
    [principal, rate, years, frequency, contribution, contributionFrequency, inflation]
  );

  const resetDefaults = () => {
    setPrincipal(DEFAULTS.principal);
    setRate(DEFAULTS.rate);
    setYears(DEFAULTS.years);
    setFrequency(DEFAULTS.frequency);
    setContribution(DEFAULTS.contribution);
    setContributionFrequency(DEFAULTS.contributionFrequency);
    setInflation(DEFAULTS.inflation);
  };

  const lineData = useMemo(() => {
    const labels = results.yearlyBreakdown.map((y) => `Yr ${y.year}`);
    return {
      labels,
      datasets: [
        {
          label: 'Total Value',
          data: results.yearlyBreakdown.map((y) => Math.round(y.balance)),
          borderColor: chartColors.neonGreen,
          backgroundColor: 'rgba(0, 255, 136, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Contributions',
          data: results.yearlyBreakdown.map((y) => Math.round(y.contributions)),
          borderColor: chartColors.electricBlue,
          backgroundColor: 'transparent',
          tension: 0.4,
        },
        {
          label: 'Real (Inflation-Adj.)',
          data: results.yearlyBreakdown.map((y) => Math.round(y.realBalance)),
          borderColor: chartColors.vividPurple,
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
        },
      ],
    };
  }, [results.yearlyBreakdown]);

  const doughnutData = {
    labels: ['Contributions', 'Interest Earned'],
    datasets: [
      {
        data: [Math.round(results.totalContributions), Math.round(results.totalInterest)],
        backgroundColor: [chartColors.electricBlue, chartColors.neonGreen],
        borderColor: ['rgba(0, 212, 255, 0.3)', 'rgba(0, 255, 136, 0.3)'],
        borderWidth: 2,
      },
    ],
  };

  const summary = () =>
    [
      'Compound Interest Summary',
      `Starting principal: ${formatCurrency(principal)}`,
      `Contribution: ${formatCurrency(contribution)} ${contributionFrequency}`,
      `Rate: ${rate}% · ${frequencyLabels[frequency]} compounding · ${years} years`,
      `Future value: ${formatCurrency(results.finalAmount)}`,
      `Total contributions: ${formatCurrency(results.totalContributions)}`,
      `Interest earned: ${formatCurrency(results.totalInterest)}`,
      `Inflation-adjusted value: ${formatCurrency(results.realValue)} (at ${inflation}% inflation)`,
    ].join('\n');

  const buildReport = (): PdfReport => ({
    calculatorName: 'Compound Interest Calculator',
    accentColor: chartColors.neonGreen,
    heroValue: {
      label: 'Future Value',
      value: formatCurrency(results.finalAmount),
      sub: `After ${years} years · ${frequencyLabels[frequency]} compounding`,
    },
    kpis: [
      { label: 'Total Contributions', value: formatCurrency(results.totalContributions), sub: 'Principal + all deposits' },
      { label: 'Interest Earned', value: formatCurrency(results.totalInterest), sub: `${((results.totalInterest / Math.max(1, results.totalContributions)) * 100).toFixed(1)}% over contributions` },
      { label: 'Inflation-Adjusted', value: formatCurrency(results.realValue), sub: `Real value at ${inflation}% inflation` },
    ],
    donut: {
      title: 'Contributions vs Interest',
      formatValue: formatCurrency,
      segments: [
        { label: 'Contributions', value: Math.round(results.totalContributions), color: chartColors.electricBlue },
        { label: 'Interest Earned', value: Math.round(results.totalInterest), color: chartColors.neonGreen },
      ],
    },
    breakdown: {
      title: 'Growth summary',
      rows: [
        { label: 'Total contributions', value: formatCurrency(results.totalContributions) },
        { label: 'Interest earned', value: formatCurrency(results.totalInterest) },
        { label: 'Future value', value: formatCurrency(results.finalAmount), isTotal: true },
      ],
    },
    inputs: [
      { label: 'Starting principal', value: formatCurrency(principal) },
      { label: 'Annual interest rate', value: `${rate}%` },
      { label: 'Time period', value: `${years} years` },
      { label: 'Compounding', value: frequencyLabels[frequency] },
      { label: 'Regular contribution', value: `${formatCurrency(contribution)} ${contributionFrequency}` },
      { label: 'Expected inflation', value: `${inflation}%` },
    ],
    notes: [
      `Compounding turns ${formatCurrency(results.totalContributions)} of contributions into ${formatCurrency(results.finalAmount)} — ${formatCurrency(results.totalInterest)} of that is pure growth.`,
      `After ${inflation}% inflation, your nest egg is worth about ${formatCurrency(results.realValue)} in today's dollars.`,
    ],
    disclaimer:
      'This report is for informational purposes only and is not investment advice. A constant rate of return is assumed; real-world returns fluctuate and are not guaranteed.',
  });

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="text-sm text-electric-blue hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-display)] mb-2">
            Compound Interest Calculator
          </h1>
          <p className="text-gray-400 mb-8">
            Add regular contributions, choose your compounding frequency, and see real (inflation-adjusted) growth.
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
              <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-display)]">Investment Details</h2>
              <button
                onClick={resetDefaults}
                className="text-xs text-gray-400 hover:text-electric-blue border border-white/10 hover:border-electric-blue/40 px-3 py-1.5 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="space-y-6">
              <SliderInput
                label="Principal Amount"
                value={principal}
                onChange={setPrincipal}
                min={0}
                max={10000000}
                step={1000}
                accent="electric-blue"
                prefix="$"
                format={formatCurrency}
                minLabel="$0"
                maxLabel="$10M"
              />
              <SliderInput
                label="Annual Interest Rate"
                value={rate}
                onChange={setRate}
                min={0}
                max={50}
                step={0.1}
                accent="electric-blue"
                suffix="%"
                format={(v) => `${v}%`}
                minLabel="0%"
                maxLabel="50%"
              />
              <SliderInput
                label="Time Period"
                value={years}
                onChange={setYears}
                min={1}
                max={50}
                step={1}
                accent="electric-blue"
                suffix="yr"
                format={(v) => `${v} years`}
                minLabel="1 year"
                maxLabel="50 years"
              />
              <SliderInput
                label="Regular Contribution"
                value={contribution}
                onChange={setContribution}
                min={0}
                max={100000}
                step={100}
                accent="neon-green"
                prefix="$"
                format={formatCurrency}
                minLabel="$0"
                maxLabel="$100K"
              />
              <SliderInput
                label="Expected Inflation"
                value={inflation}
                onChange={setInflation}
                min={0}
                max={15}
                step={0.1}
                accent="vivid-purple"
                suffix="%"
                format={(v) => `${v}%`}
                minLabel="0%"
                maxLabel="15%"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Compounding</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-3 text-sm focus:border-electric-blue focus:outline-none transition-colors"
                  >
                    <option value={1} className="bg-dark-card">Annually</option>
                    <option value={2} className="bg-dark-card">Semi-annually</option>
                    <option value={4} className="bg-dark-card">Quarterly</option>
                    <option value={12} className="bg-dark-card">Monthly</option>
                    <option value={365} className="bg-dark-card">Daily</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Contribution Freq.</label>
                  <select
                    value={contributionFrequency}
                    onChange={(e) => setContributionFrequency(e.target.value as ContributionFrequency)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-3 text-sm focus:border-electric-blue focus:outline-none transition-colors"
                  >
                    <option value="monthly" className="bg-dark-card">Monthly</option>
                    <option value="annual" className="bg-dark-card">Annual</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <ResultCard
              label="Future Value"
              value={formatCurrency(results.finalAmount)}
              subtitle={`After ${years} years · ${frequencyLabels[frequency]} compounding`}
              trend="up"
              accentColor="neon-green"
            />
            <ResultCard
              label="Total Interest Earned"
              value={formatCurrency(results.totalInterest)}
              subtitle={`${((results.totalInterest / Math.max(1, results.totalContributions)) * 100).toFixed(1)}% over contributions`}
              trend="up"
              accentColor="electric-blue"
            />
            <ResultCard
              label="Inflation-Adjusted Value"
              value={formatCurrency(results.realValue)}
              subtitle={`Real value in today's dollars at ${inflation}% inflation`}
              accentColor="vivid-purple"
            />
            <ResultCard
              label="Total Contributions"
              value={formatCurrency(results.totalContributions)}
              subtitle="Principal + all contributions"
              accentColor="hot-orange"
            />
            <div className="pt-1 flex flex-wrap gap-3">
              <CopyButton getText={summary} />
              <ExportPdfButton getReport={buildReport} fileSlug="compound-interest" />
            </div>
          </motion.div>
        </div>

        <AdPlaceholder className="my-8" />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <ChartContainer title="Growth: Value vs Contributions vs Real">
              <DarkLine data={lineData} />
            </ChartContainer>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <ChartContainer title="Contributions vs Interest">
              <DarkDoughnut data={doughnutData} />
            </ChartContainer>
          </motion.div>
        </div>

        {/* Year-by-year table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="glass-card p-6 mt-8"
        >
          <button onClick={() => setShowTable((s) => !s)} className="w-full flex items-center justify-between text-left">
            <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-display)]">
              Year-by-Year Growth
            </h3>
            <span className={`text-electric-blue transition-transform ${showTable ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {showTable && (
            <div className="mt-4 max-h-[420px] overflow-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-dark-surface/95 backdrop-blur">
                  <tr className="text-gray-400 text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-3">Year</th>
                    <th className="text-right px-4 py-3">Contributions</th>
                    <th className="text-right px-4 py-3">Balance</th>
                    <th className="text-right px-4 py-3">Real Value</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-2.5 text-gray-300">{row.year}</td>
                      <td className="px-4 py-2.5 text-right text-electric-blue">{formatCurrency(row.contributions)}</td>
                      <td className="px-4 py-2.5 text-right text-neon-green">{formatCurrency(row.balance)}</td>
                      <td className="px-4 py-2.5 text-right text-vivid-purple">{formatCurrency(row.realBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <CalculatorContent slug="compound-interest" />

        <AdPlaceholder className="mt-8" />
      </div>
    </div>
  );
}
