'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { calculateLoanWithPrepayment } from '@/lib/calculations';
import { formatCurrency, formatMonths, addMonthsLabel } from '@/lib/utils';
import ResultCard from '@/components/ResultCard';
import SliderInput from '@/components/SliderInput';
import CopyButton from '@/components/CopyButton';
import ExportPdfButton from '@/components/ExportPdfButton';
import type { PdfReport } from '@/lib/pdfReport';
import { ChartContainer, DarkDoughnut, DarkLine, chartColors } from '@/components/ChartWrapper';
import AdPlaceholder from '@/components/AdPlaceholder';
import CalculatorContent from '@/components/CalculatorContent';

const DEFAULTS = { loanAmount: 500000, interestRate: 10, tenure: 60, extra: 0 };

export default function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(DEFAULTS.loanAmount);
  const [interestRate, setInterestRate] = useState(DEFAULTS.interestRate);
  const [tenure, setTenure] = useState(DEFAULTS.tenure);
  const [extra, setExtra] = useState(DEFAULTS.extra);
  const [startDate, setStartDate] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);

  const results = useMemo(
    () => calculateLoanWithPrepayment(loanAmount, interestRate, tenure, extra),
    [loanAmount, interestRate, tenure, extra]
  );

  const payoffLabel = useMemo(() => {
    const base = startDate ? new Date(startDate) : new Date();
    return addMonthsLabel(base, results.payoffMonths);
  }, [startDate, results.payoffMonths]);

  const resetDefaults = () => {
    setLoanAmount(DEFAULTS.loanAmount);
    setInterestRate(DEFAULTS.interestRate);
    setTenure(DEFAULTS.tenure);
    setExtra(DEFAULTS.extra);
  };

  const doughnutData = {
    labels: ['Principal', 'Total Interest'],
    datasets: [
      {
        data: [loanAmount, Math.round(results.totalInterest)],
        backgroundColor: [chartColors.electricBlue, chartColors.hotOrange],
        borderColor: ['rgba(0, 212, 255, 0.3)', 'rgba(255, 107, 53, 0.3)'],
        borderWidth: 2,
      },
    ],
  };

  const lineData = useMemo(() => {
    const labels: string[] = [];
    const principalPaid: number[] = [];
    const interestPaid: number[] = [];
    let cumPrincipal = 0;
    let cumInterest = 0;
    const total = results.schedule.length;
    const step = Math.max(1, Math.floor(total / 24));

    results.schedule.forEach((row, idx) => {
      cumPrincipal += row.principal;
      cumInterest += row.interest;
      if (idx % step === 0 || idx === total - 1) {
        labels.push(`Mo ${row.month}`);
        principalPaid.push(Math.round(cumPrincipal));
        interestPaid.push(Math.round(cumInterest));
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Principal Paid',
          data: principalPaid,
          borderColor: chartColors.electricBlue,
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Interest Paid',
          data: interestPaid,
          borderColor: chartColors.hotOrange,
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [results.schedule]);

  const summary = () =>
    [
      'Personal Loan Summary',
      `Loan amount: ${formatCurrency(loanAmount)}`,
      `Interest rate: ${interestRate}% p.a.`,
      `Tenure: ${formatMonths(tenure)}`,
      `Monthly EMI: ${formatCurrency(results.emi)}`,
      extra > 0 ? `Extra monthly payment: ${formatCurrency(extra)}` : '',
      `Total interest: ${formatCurrency(results.totalInterest)}`,
      `Total payment: ${formatCurrency(results.totalPayment)}`,
      `Payoff: ${formatMonths(results.payoffMonths)} (${payoffLabel})`,
      extra > 0
        ? `Prepayment saves ${formatCurrency(results.interestSaved)} and ${formatMonths(results.monthsSaved)}.`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

  const buildReport = (): PdfReport => ({
    calculatorName: 'Personal Loan EMI Calculator',
    accentColor: chartColors.electricBlue,
    heroValue: {
      label: 'Monthly EMI',
      value: formatCurrency(results.emi),
      sub: `On ${formatCurrency(loanAmount)} at ${interestRate}% p.a. over ${formatMonths(tenure)}`,
    },
    kpis: [
      { label: 'Total Interest', value: formatCurrency(results.totalInterest), sub: `${((results.totalInterest / Math.max(1, loanAmount)) * 100).toFixed(1)}% of principal` },
      { label: 'Total Payment', value: formatCurrency(results.totalPayment), sub: 'Principal + interest' },
      { label: 'Payoff Time', value: formatMonths(results.payoffMonths), sub: `Debt-free by ${payoffLabel}` },
      ...(extra > 0
        ? [{ label: 'Interest Saved', value: formatCurrency(results.interestSaved), sub: `${formatMonths(results.monthsSaved)} earlier` }]
        : []),
    ],
    donut: {
      title: 'Principal vs Interest',
      formatValue: formatCurrency,
      segments: [
        { label: 'Principal', value: loanAmount, color: chartColors.electricBlue },
        { label: 'Total Interest', value: Math.round(results.totalInterest), color: chartColors.hotOrange },
      ],
    },
    breakdown: {
      title: 'Payment summary',
      rows: [
        { label: 'Loan amount (principal)', value: formatCurrency(loanAmount) },
        { label: 'Total interest', value: formatCurrency(results.totalInterest) },
        ...(extra > 0 ? [{ label: 'Interest saved via prepayment', value: formatCurrency(results.interestSaved), isNegative: true }] : []),
        { label: 'Total amount payable', value: formatCurrency(results.totalPayment), isTotal: true },
      ],
    },
    inputs: [
      { label: 'Loan amount', value: formatCurrency(loanAmount) },
      { label: 'Interest rate', value: `${interestRate}% p.a.` },
      { label: 'Tenure', value: formatMonths(tenure) },
      { label: 'Extra monthly payment', value: formatCurrency(extra) },
      { label: 'Start date', value: startDate ? new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Today' },
      { label: 'Number of payments', value: `${results.schedule.length}` },
    ],
    notes: [
      `Your ${formatCurrency(results.emi)} monthly payment retires a ${formatCurrency(loanAmount)} loan over ${formatMonths(results.payoffMonths)}.`,
      extra > 0
        ? `Paying an extra ${formatCurrency(extra)} each month saves ${formatCurrency(results.interestSaved)} in interest and clears the loan ${formatMonths(results.monthsSaved)} sooner.`
        : `Adding even a small extra monthly payment would cut both your total interest and payoff time.`,
    ],
    disclaimer:
      'This report is for informational purposes only and does not constitute financial advice. Figures are estimates based on the inputs provided and a fixed interest rate; your actual loan terms may differ.',
  });

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="text-sm text-electric-blue hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-display)] mb-2">
            Personal Loan EMI Calculator
          </h1>
          <p className="text-gray-400 mb-8">
            Calculate your EMI, add extra payments to slash interest, and explore the full amortization schedule.
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
                className="text-xs text-gray-400 hover:text-electric-blue border border-white/10 hover:border-electric-blue/40 px-3 py-1.5 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="space-y-6">
              <SliderInput
                label="Loan Amount"
                value={loanAmount}
                onChange={setLoanAmount}
                min={10000}
                max={5000000}
                step={10000}
                accent="electric-blue"
                prefix="$"
                format={formatCurrency}
                minLabel="$10K"
                maxLabel="$5M"
              />
              <SliderInput
                label="Interest Rate (p.a.)"
                value={interestRate}
                onChange={setInterestRate}
                min={1}
                max={30}
                step={0.1}
                accent="electric-blue"
                suffix="%"
                format={(v) => `${v}%`}
                minLabel="1%"
                maxLabel="30%"
              />
              <SliderInput
                label="Loan Tenure"
                value={tenure}
                onChange={setTenure}
                min={12}
                max={360}
                step={6}
                accent="electric-blue"
                suffix="mo"
                format={(v) => `${v} mo (${(v / 12).toFixed(1)} yr)`}
                minLabel="1 year"
                maxLabel="30 years"
              />
              <SliderInput
                label="Extra Monthly Payment"
                value={extra}
                onChange={setExtra}
                min={0}
                max={50000}
                step={500}
                accent="neon-green"
                prefix="$"
                format={formatCurrency}
                minLabel="$0"
                maxLabel="$50K"
              />

              <div>
                <label className="text-gray-300 text-sm block mb-2">Loan Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:border-electric-blue focus:outline-none transition-colors [color-scheme:dark]"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to start from today.</p>
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
            <ResultCard label="Monthly EMI" value={formatCurrency(results.emi)} subtitle="Fixed monthly payment" accentColor="electric-blue" />
            <ResultCard
              label="Total Interest"
              value={formatCurrency(results.totalInterest)}
              subtitle={`${((results.totalInterest / Math.max(1, loanAmount)) * 100).toFixed(1)}% of principal`}
              trend="down"
              accentColor="hot-orange"
            />
            <ResultCard
              label="Payoff Time"
              value={formatMonths(results.payoffMonths)}
              subtitle={`Debt-free by ${payoffLabel}`}
              accentColor="neon-green"
            />
            {extra > 0 && (
              <ResultCard
                label="Prepayment Savings"
                value={formatCurrency(results.interestSaved)}
                subtitle={`Interest saved · ${formatMonths(results.monthsSaved)} earlier`}
                trend="up"
                accentColor="vivid-purple"
              />
            )}
            <div className="pt-1 flex flex-wrap gap-3">
              <CopyButton getText={summary} />
              <ExportPdfButton getReport={buildReport} fileSlug="personal-loan" />
            </div>
          </motion.div>
        </div>

        <AdPlaceholder className="my-8" />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <ChartContainer title="Principal vs Interest Breakdown">
              <DarkDoughnut data={doughnutData} />
            </ChartContainer>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <ChartContainer title="Cumulative Payment Over Time">
              <DarkLine data={lineData} />
            </ChartContainer>
          </motion.div>
        </div>

        {/* Amortization schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="glass-card p-6 mt-8"
        >
          <button
            onClick={() => setShowSchedule((s) => !s)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-display)]">
              Amortization Schedule
              <span className="ml-2 text-sm font-normal text-gray-500">({results.schedule.length} payments)</span>
            </h3>
            <span className={`text-electric-blue transition-transform ${showSchedule ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {showSchedule && (
            <div className="mt-4 max-h-[420px] overflow-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-dark-surface/95 backdrop-blur">
                  <tr className="text-gray-400 text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-3">Month</th>
                    <th className="text-right px-4 py-3">Payment</th>
                    <th className="text-right px-4 py-3">Principal</th>
                    <th className="text-right px-4 py-3">Interest</th>
                    <th className="text-right px-4 py-3">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {results.schedule.map((row) => (
                    <tr key={row.month} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-2.5 text-gray-300">{row.month}</td>
                      <td className="px-4 py-2.5 text-right text-white">{formatCurrency(row.payment)}</td>
                      <td className="px-4 py-2.5 text-right text-electric-blue">{formatCurrency(row.principal)}</td>
                      <td className="px-4 py-2.5 text-right text-hot-orange">{formatCurrency(row.interest)}</td>
                      <td className="px-4 py-2.5 text-right text-gray-300">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <CalculatorContent slug="personal-loan" />

        <AdPlaceholder className="mt-8" />
      </div>
    </div>
  );
}
