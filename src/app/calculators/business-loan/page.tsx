'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { calculateBusinessLoanAdvanced } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import ResultCard from '@/components/ResultCard';
import SliderInput from '@/components/SliderInput';
import CopyButton from '@/components/CopyButton';
import ExportPdfButton from '@/components/ExportPdfButton';
import type { PdfReport } from '@/lib/pdfReport';
import { ChartContainer, DarkDoughnut, DarkBar, chartColors } from '@/components/ChartWrapper';
import AdPlaceholder from '@/components/AdPlaceholder';
import CalculatorContent from '@/components/CalculatorContent';

type LoanType = 'term' | 'sba' | 'loc';

const DEFAULTS = {
  amount: 250000,
  rate: 8,
  termMonths: 60,
  loanType: 'term' as LoanType,
  feePercent: 1,
  feeFlat: 0,
  balloon: 0,
};

const loanTypeLabels: Record<LoanType, string> = {
  term: 'Term Loan',
  sba: 'SBA Loan',
  loc: 'Line of Credit',
};

export default function BusinessLoanCalculator() {
  const [amount, setAmount] = useState(DEFAULTS.amount);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [termMonths, setTermMonths] = useState(DEFAULTS.termMonths);
  const [loanType, setLoanType] = useState<LoanType>(DEFAULTS.loanType);
  const [feePercent, setFeePercent] = useState(DEFAULTS.feePercent);
  const [feeFlat, setFeeFlat] = useState(DEFAULTS.feeFlat);
  const [balloon, setBalloon] = useState(DEFAULTS.balloon);

  const results = useMemo(
    () => calculateBusinessLoanAdvanced(amount, rate, termMonths, loanType, feePercent, feeFlat, balloon),
    [amount, rate, termMonths, loanType, feePercent, feeFlat, balloon]
  );

  // Compare all three loan types under the same inputs.
  const comparison = useMemo(
    () =>
      (['term', 'sba', 'loc'] as LoanType[]).map((t) => ({
        type: t,
        ...calculateBusinessLoanAdvanced(amount, rate, termMonths, t, feePercent, feeFlat, balloon),
      })),
    [amount, rate, termMonths, feePercent, feeFlat, balloon]
  );

  const resetDefaults = () => {
    setAmount(DEFAULTS.amount);
    setRate(DEFAULTS.rate);
    setTermMonths(DEFAULTS.termMonths);
    setLoanType(DEFAULTS.loanType);
    setFeePercent(DEFAULTS.feePercent);
    setFeeFlat(DEFAULTS.feeFlat);
    setBalloon(DEFAULTS.balloon);
  };

  const doughnutData = {
    labels: ['Principal', 'Total Interest', 'Fees'],
    datasets: [
      {
        data: [amount, Math.round(results.totalInterest), Math.round(results.fees)],
        backgroundColor: [chartColors.vividPurple, chartColors.hotOrange, chartColors.electricPink],
        borderColor: ['rgba(168, 85, 247, 0.3)', 'rgba(255, 107, 53, 0.3)', 'rgba(255, 0, 110, 0.3)'],
        borderWidth: 2,
      },
    ],
  };

  const comparisonChart = {
    labels: comparison.map((c) => loanTypeLabels[c.type]),
    datasets: [
      {
        label: 'Monthly Payment',
        data: comparison.map((c) => Math.round(c.monthlyPayment)),
        backgroundColor: chartColors.vividPurple,
        borderColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 1,
      },
      {
        label: 'Total Interest',
        data: comparison.map((c) => Math.round(c.totalInterest)),
        backgroundColor: chartColors.hotOrange,
        borderColor: 'rgba(255, 107, 53, 0.5)',
        borderWidth: 1,
      },
    ],
  };

  const summary = () =>
    [
      'Business Loan Summary',
      `Type: ${loanTypeLabels[loanType]}`,
      `Amount: ${formatCurrency(amount)} · Rate: ${rate}% · Term: ${(termMonths / 12).toFixed(1)} yr`,
      `Fees: ${formatCurrency(results.fees)} (net proceeds ${formatCurrency(results.netProceeds)})`,
      balloon > 0 ? `Balloon payment: ${formatCurrency(results.balloonPayment)}` : '',
      `Monthly payment: ${formatCurrency(results.monthlyPayment)}`,
      `Total interest: ${formatCurrency(results.totalInterest)}`,
      `Nominal effective rate: ${results.effectiveRate.toFixed(2)}% · APR with fees: ${results.aprWithFees.toFixed(2)}%`,
    ]
      .filter(Boolean)
      .join('\n');

  const buildReport = (): PdfReport => ({
    calculatorName: 'Business Loan Calculator',
    accentColor: chartColors.vividPurple,
    heroValue: {
      label: 'Monthly Payment',
      value: formatCurrency(results.monthlyPayment),
      sub: `${loanTypeLabels[loanType]} · ${formatCurrency(amount)} at ${rate}% over ${(termMonths / 12).toFixed(1)} yr`,
    },
    kpis: [
      { label: 'Total Interest', value: formatCurrency(results.totalInterest), sub: `${((results.totalInterest / Math.max(1, amount)) * 100).toFixed(1)}% of loan` },
      { label: 'APR with Fees', value: `${results.aprWithFees.toFixed(2)}%`, sub: `Nominal rate ${results.effectiveRate.toFixed(2)}%` },
      { label: 'Total Fees', value: formatCurrency(results.fees), sub: 'Origination + flat' },
      { label: 'Net Proceeds', value: formatCurrency(results.netProceeds), sub: 'Cash in hand after fees' },
    ],
    donut: {
      title: 'Cost breakdown',
      formatValue: formatCurrency,
      segments: [
        { label: 'Principal', value: amount, color: chartColors.vividPurple },
        { label: 'Total Interest', value: Math.round(results.totalInterest), color: chartColors.hotOrange },
        { label: 'Fees', value: Math.round(results.fees), color: chartColors.electricPink },
      ],
    },
    bars: {
      title: 'Monthly payment by loan type',
      formatValue: formatCurrency,
      items: comparison.map((c) => ({
        label: loanTypeLabels[c.type],
        value: Math.round(c.monthlyPayment),
        color: c.type === loanType ? chartColors.vividPurple : chartColors.accentCyan,
      })),
    },
    breakdown: {
      title: 'Cost summary',
      rows: [
        { label: 'Principal', value: formatCurrency(amount) },
        { label: 'Total interest', value: formatCurrency(results.totalInterest) },
        { label: 'Fees', value: formatCurrency(results.fees) },
        ...(balloon > 0 ? [{ label: 'Balloon payment', value: formatCurrency(results.balloonPayment) }] : []),
        { label: 'Total cost of borrowing', value: formatCurrency(amount + results.totalInterest + results.fees), isTotal: true },
      ],
    },
    inputs: [
      { label: 'Loan type', value: loanTypeLabels[loanType] },
      { label: 'Loan amount', value: formatCurrency(amount) },
      { label: 'Interest rate', value: `${rate}%` },
      { label: 'Term', value: `${termMonths} mo (${(termMonths / 12).toFixed(1)} yr)` },
      { label: 'Origination fee', value: `${feePercent}%` },
      { label: 'Flat processing fee', value: formatCurrency(feeFlat) },
      { label: 'Balloon payment', value: formatCurrency(balloon) },
    ],
    notes: [
      `Once fees are included, the true cost of this loan is an APR of ${results.aprWithFees.toFixed(2)}% — higher than the headline ${rate}% rate.`,
      `You receive ${formatCurrency(results.netProceeds)} in net proceeds after ${formatCurrency(results.fees)} in fees.`,
    ],
    disclaimer:
      'This report is for informational purposes only and does not constitute financial advice. APR-with-fees and effective rate are simplified estimates; consult your lender for binding terms.',
  });

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="text-sm text-electric-blue hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-display)] mb-2">
            Business Loan Calculator
          </h1>
          <p className="text-gray-400 mb-8">
            Factor in origination fees and balloon payments, see the true APR-with-fees, and compare loan types.
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
              <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-display)]">Loan Details</h2>
              <button
                onClick={resetDefaults}
                className="text-xs text-gray-400 hover:text-vivid-purple border border-white/10 hover:border-vivid-purple/40 px-3 py-1.5 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="space-y-6">
              <SliderInput
                label="Loan Amount"
                value={amount}
                onChange={setAmount}
                min={10000}
                max={5000000}
                step={10000}
                accent="vivid-purple"
                prefix="$"
                format={formatCurrency}
                minLabel="$10K"
                maxLabel="$5M"
              />
              <SliderInput
                label="Interest Rate"
                value={rate}
                onChange={setRate}
                min={1}
                max={30}
                step={0.25}
                accent="vivid-purple"
                suffix="%"
                format={(v) => `${v}%`}
                minLabel="1%"
                maxLabel="30%"
              />
              <SliderInput
                label="Term"
                value={termMonths}
                onChange={setTermMonths}
                min={6}
                max={300}
                step={6}
                accent="vivid-purple"
                suffix="mo"
                format={(v) => `${v} mo (${(v / 12).toFixed(1)} yr)`}
                minLabel="6 months"
                maxLabel="25 years"
              />
              <SliderInput
                label="Origination Fee"
                value={feePercent}
                onChange={setFeePercent}
                min={0}
                max={10}
                step={0.1}
                accent="electric-pink"
                suffix="%"
                format={(v) => `${v}%`}
                minLabel="0%"
                maxLabel="10%"
              />
              <SliderInput
                label="Flat Processing Fee"
                value={feeFlat}
                onChange={setFeeFlat}
                min={0}
                max={25000}
                step={250}
                accent="electric-pink"
                prefix="$"
                format={formatCurrency}
                minLabel="$0"
                maxLabel="$25K"
              />
              <SliderInput
                label="Balloon Payment"
                value={balloon}
                onChange={setBalloon}
                min={0}
                max={Math.round(amount * 0.8)}
                step={5000}
                accent="hot-orange"
                prefix="$"
                format={formatCurrency}
                minLabel="$0"
                maxLabel={`${Math.round((amount * 0.8) / 1000)}K`}
              />

              <div>
                <label className="text-gray-300 text-sm block mb-2">Loan Type</label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value as LoanType)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:border-vivid-purple focus:outline-none transition-colors"
                >
                  <option value="term" className="bg-dark-card">Term Loan</option>
                  <option value="sba" className="bg-dark-card">SBA Loan</option>
                  <option value="loc" className="bg-dark-card">Line of Credit</option>
                </select>
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
            <ResultCard label="Monthly Payment" value={formatCurrency(results.monthlyPayment)} subtitle={loanTypeLabels[loanType]} accentColor="vivid-purple" />
            <ResultCard label="Total Interest" value={formatCurrency(results.totalInterest)} subtitle={`${((results.totalInterest / Math.max(1, amount)) * 100).toFixed(1)}% of loan amount`} trend="down" accentColor="hot-orange" />
            <ResultCard label="APR with Fees" value={`${results.aprWithFees.toFixed(2)}%`} subtitle={`Nominal effective rate ${results.effectiveRate.toFixed(2)}%`} accentColor="electric-pink" />
            <ResultCard label="Net Proceeds" value={formatCurrency(results.netProceeds)} subtitle={`After ${formatCurrency(results.fees)} in fees`} accentColor="neon-green" />
            <div className="pt-1 flex flex-wrap gap-3">
              <CopyButton getText={summary} />
              <ExportPdfButton getReport={buildReport} fileSlug="business-loan" />
            </div>
          </motion.div>
        </div>

        <AdPlaceholder className="my-8" />

        {/* Loan type comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6 mb-8 overflow-x-auto"
        >
          <h3 className="text-lg font-semibold text-white mb-4 font-[family-name:var(--font-display)]">Loan Type Comparison</h3>
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-right px-4 py-3">Eff. Rate</th>
                <th className="text-right px-4 py-3">Monthly</th>
                <th className="text-right px-4 py-3">Total Interest</th>
                <th className="text-right px-4 py-3">APR w/ Fees</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((c) => (
                <tr
                  key={c.type}
                  className={`border-t border-white/5 transition-colors ${c.type === loanType ? 'bg-vivid-purple/10' : 'hover:bg-white/5'}`}
                >
                  <td className="px-4 py-3 text-white font-medium">{loanTypeLabels[c.type]}</td>
                  <td className="px-4 py-3 text-right text-gray-300">{c.effectiveRate.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-right text-vivid-purple">{formatCurrency(c.monthlyPayment)}</td>
                  <td className="px-4 py-3 text-right text-hot-orange">{formatCurrency(c.totalInterest)}</td>
                  <td className="px-4 py-3 text-right text-electric-pink">{c.aprWithFees.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
            <ChartContainer title="Cost Breakdown">
              <DarkDoughnut data={doughnutData} />
            </ChartContainer>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <ChartContainer title="Loan Type Comparison">
              <DarkBar data={comparisonChart} />
            </ChartContainer>
          </motion.div>
        </div>

        <CalculatorContent slug="business-loan" />

        <AdPlaceholder className="mt-8" />
      </div>
    </div>
  );
}
