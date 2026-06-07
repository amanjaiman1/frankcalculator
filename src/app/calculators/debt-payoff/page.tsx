'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { calculateDebtPayoffDetailed } from '@/lib/calculations';
import { formatCurrency, formatMonths, parseNumberInput } from '@/lib/utils';
import SliderInput from '@/components/SliderInput';
import CopyButton from '@/components/CopyButton';
import ExportPdfButton from '@/components/ExportPdfButton';
import type { PdfReport } from '@/lib/pdfReport';
import { ChartContainer, DarkLine, chartColors } from '@/components/ChartWrapper';
import AdPlaceholder from '@/components/AdPlaceholder';
import CalculatorContent from '@/components/CalculatorContent';

interface DebtEntry {
  id: number;
  name: string;
  balance: number;
  rate: number;
  minimumPayment: number;
}

const INITIAL_DEBTS: DebtEntry[] = [
  { id: 1, name: 'Credit Card', balance: 5000, rate: 22, minimumPayment: 150 },
  { id: 2, name: 'Car Loan', balance: 15000, rate: 6.5, minimumPayment: 350 },
];

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState<DebtEntry[]>(INITIAL_DEBTS);
  const [extraPayment, setExtraPayment] = useState(200);
  const [nextId, setNextId] = useState(3);

  const addDebt = () => {
    setDebts([...debts, { id: nextId, name: '', balance: 0, rate: 0, minimumPayment: 0 }]);
    setNextId(nextId + 1);
  };

  const removeDebt = (id: number) => {
    if (debts.length > 1) setDebts(debts.filter((d) => d.id !== id));
  };

  const updateDebt = (id: number, field: keyof DebtEntry, value: string | number) => {
    setDebts(debts.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const resetDefaults = () => {
    setDebts(INITIAL_DEBTS);
    setExtraPayment(200);
    setNextId(3);
  };

  const validDebts = useMemo(
    () =>
      debts
        .filter((d) => d.balance > 0 && d.rate >= 0 && d.minimumPayment > 0)
        .map((d, i) => ({ ...d, name: d.name.trim() || `Debt ${i + 1}` })),
    [debts]
  );

  const avalanche = useMemo(
    () => (validDebts.length ? calculateDebtPayoffDetailed(validDebts, 'avalanche', extraPayment) : null),
    [validDebts, extraPayment]
  );
  const snowball = useMemo(
    () => (validDebts.length ? calculateDebtPayoffDetailed(validDebts, 'snowball', extraPayment) : null),
    [validDebts, extraPayment]
  );

  const better = useMemo(() => {
    if (!avalanche || !snowball) return null;
    // Lower total interest wins; tie-break on fewer months.
    if (avalanche.totalInterestPaid < snowball.totalInterestPaid) return 'avalanche';
    if (snowball.totalInterestPaid < avalanche.totalInterestPaid) return 'snowball';
    return avalanche.totalMonths <= snowball.totalMonths ? 'avalanche' : 'snowball';
  }, [avalanche, snowball]);

  const interestSaved = useMemo(() => {
    if (!avalanche || !snowball) return 0;
    return Math.abs(avalanche.totalInterestPaid - snowball.totalInterestPaid);
  }, [avalanche, snowball]);

  const lineData = useMemo(() => {
    if (!avalanche || !snowball) return null;
    const maxLen = Math.max(avalanche.balanceTimeline.length, snowball.balanceTimeline.length);
    const step = Math.max(1, Math.floor(maxLen / 24));
    const labels: string[] = [];
    const avaData: number[] = [];
    const snowData: number[] = [];
    for (let i = 0; i < maxLen; i += step) {
      labels.push(`Mo ${i + 1}`);
      avaData.push(Math.round(avalanche.balanceTimeline[i] ?? 0));
      snowData.push(Math.round(snowball.balanceTimeline[i] ?? 0));
    }
    return {
      labels,
      datasets: [
        {
          label: 'Avalanche',
          data: avaData,
          borderColor: chartColors.electricBlue,
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Snowball',
          data: snowData,
          borderColor: chartColors.neonGreen,
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
        },
      ],
    };
  }, [avalanche, snowball]);

  const summary = () => {
    if (!avalanche || !snowball) return 'Add at least one valid debt to see results.';
    return [
      'Debt Payoff Summary',
      `Debts: ${validDebts.length} · Extra monthly: ${formatCurrency(extraPayment)}`,
      `Avalanche: ${formatMonths(avalanche.totalMonths)}, interest ${formatCurrency(avalanche.totalInterestPaid)}`,
      `Snowball: ${formatMonths(snowball.totalMonths)}, interest ${formatCurrency(snowball.totalInterestPaid)}`,
      `Recommended: ${better === 'avalanche' ? 'Avalanche' : 'Snowball'} (saves ${formatCurrency(interestSaved)})`,
    ].join('\n');
  };

  const buildReport = (): PdfReport => {
    if (!avalanche || !snowball) {
      throw new Error('No valid debts to export');
    }
    const recommended = better === 'avalanche' ? avalanche : snowball;
    const recommendedName = better === 'avalanche' ? 'Avalanche' : 'Snowball';
    const totalBalance = validDebts.reduce((s, d) => s + d.balance, 0);
    const debtPalette = [chartColors.electricBlue, chartColors.neonGreen, chartColors.vividPurple, chartColors.hotOrange, chartColors.electricPink, chartColors.accentCyan];
    return {
      calculatorName: 'Debt Payoff Calculator',
      accentColor: chartColors.electricBlue,
      heroValue: {
        label: `Recommended strategy · ${recommendedName}`,
        value: formatMonths(recommended.totalMonths),
        sub: `Debt-free with ${formatCurrency(recommended.totalInterestPaid)} total interest`,
      },
      kpis: [
        { label: 'Avalanche Payoff', value: formatMonths(avalanche.totalMonths), sub: `${formatCurrency(avalanche.totalInterestPaid)} interest` },
        { label: 'Snowball Payoff', value: formatMonths(snowball.totalMonths), sub: `${formatCurrency(snowball.totalInterestPaid)} interest` },
        { label: 'Interest Saved', value: formatCurrency(interestSaved), sub: `By choosing ${recommendedName}` },
        { label: 'Total Debt', value: formatCurrency(totalBalance), sub: `Across ${validDebts.length} debt${validDebts.length === 1 ? '' : 's'}` },
      ],
      donut: {
        title: 'Your debts',
        formatValue: formatCurrency,
        segments: validDebts.map((d, i) => ({
          label: d.name,
          value: d.balance,
          color: debtPalette[i % debtPalette.length],
        })),
      },
      bars: {
        title: 'Total interest: Avalanche vs Snowball',
        formatValue: formatCurrency,
        items: [
          { label: 'Avalanche', value: Math.round(avalanche.totalInterestPaid), color: chartColors.electricBlue },
          { label: 'Snowball', value: Math.round(snowball.totalInterestPaid), color: chartColors.neonGreen },
        ],
      },
      breakdown: {
        title: `Payoff order · ${recommendedName}`,
        rows: [
          ...recommended.payoffOrder.map((name, i) => ({ label: `${i + 1}. ${name}`, value: '' })),
          { label: 'Total interest paid', value: formatCurrency(recommended.totalInterestPaid), isTotal: true },
        ],
      },
      inputs: [
        { label: 'Number of debts', value: `${validDebts.length}` },
        { label: 'Total balance', value: formatCurrency(totalBalance) },
        { label: 'Extra monthly payment', value: formatCurrency(extraPayment) },
        { label: 'Strategy compared', value: 'Avalanche vs Snowball' },
      ],
      notes: [
        `The ${recommendedName} method clears your debt in ${formatMonths(recommended.totalMonths)} while paying ${formatCurrency(recommended.totalInterestPaid)} in interest.`,
        interestSaved > 0
          ? `Choosing ${recommendedName} over the alternative saves you ${formatCurrency(interestSaved)} in interest.`
          : `Both strategies cost about the same here — pick whichever keeps you most motivated.`,
        `Adding ${formatCurrency(extraPayment)} extra each month accelerates every payoff in the plan.`,
      ],
      disclaimer:
        'This report is for informational purposes only and is not financial advice. It assumes fixed balances, rates and on-time payments with no new borrowing; your actual payoff will vary.',
    };
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="text-sm text-electric-blue hover:underline mb-6 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-display)] mb-2">
            Debt Payoff Calculator
          </h1>
          <p className="text-gray-400 mb-8">
            Compare Avalanche vs Snowball strategies side-by-side to find your fastest, cheapest path to debt freedom.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-display)]">Your Debts</h2>
            <button
              onClick={resetDefaults}
              className="text-xs text-gray-400 hover:text-electric-blue border border-white/10 hover:border-electric-blue/40 px-3 py-1.5 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4">
            {debts.map((debt, idx) => (
              <div key={debt.id} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Name</label>
                  <input
                    type="text"
                    value={debt.name}
                    onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                    placeholder={`Debt ${idx + 1}`}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-electric-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Balance ($)</label>
                  <input
                    type="number"
                    value={debt.balance || ''}
                    onChange={(e) => updateDebt(debt.id, 'balance', parseNumberInput(e.target.value))}
                    placeholder="5000"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-electric-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">APR (%)</label>
                  <input
                    type="number"
                    value={debt.rate || ''}
                    onChange={(e) => updateDebt(debt.id, 'rate', parseNumberInput(e.target.value))}
                    placeholder="18"
                    step="0.1"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-electric-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Min Payment ($)</label>
                  <input
                    type="number"
                    value={debt.minimumPayment || ''}
                    onChange={(e) => updateDebt(debt.id, 'minimumPayment', parseNumberInput(e.target.value))}
                    placeholder="150"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:border-electric-blue focus:outline-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => removeDebt(debt.id)}
                    disabled={debts.length <= 1}
                    className="text-hot-orange hover:text-red-400 disabled:text-gray-600 text-sm px-3 py-2 rounded-lg border border-white/10 hover:border-hot-orange/30 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-6 mt-6">
            <button
              onClick={addDebt}
              className="text-sm text-electric-blue border border-electric-blue/30 hover:border-electric-blue px-4 py-2 rounded-lg transition-colors self-start"
            >
              + Add Another Debt
            </button>
            <div className="flex-1 max-w-md">
              <SliderInput
                label="Extra Monthly Payment"
                value={extraPayment}
                onChange={setExtraPayment}
                min={0}
                max={5000}
                step={50}
                accent="neon-green"
                prefix="$"
                format={formatCurrency}
                minLabel="$0"
                maxLabel="$5K"
              />
            </div>
          </div>
        </motion.div>

        <AdPlaceholder className="my-8" />

        {/* Results */}
        {avalanche && snowball ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {(['avalanche', 'snowball'] as const).map((strat) => {
                const r = strat === 'avalanche' ? avalanche : snowball;
                const isBetter = better === strat;
                const accent = strat === 'avalanche' ? 'electric-blue' : 'neon-green';
                return (
                  <motion.div
                    key={strat}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`glass-card p-6 ${isBetter ? 'border-neon-green/40' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-display)]">
                        {strat === 'avalanche' ? 'Avalanche' : 'Snowball'}
                      </h3>
                      {isBetter && (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-neon-green/10 text-neon-green ring-1 ring-neon-green/20">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      {strat === 'avalanche' ? 'Highest interest rate first' : 'Lowest balance first'}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">Payoff Time</p>
                        <p className={`text-xl font-bold text-${accent}`}>{formatMonths(r.totalMonths)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">Total Interest</p>
                        <p className={`text-xl font-bold text-${accent}`}>{formatCurrency(r.totalInterestPaid)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">Payoff Order</p>
                      <div className="flex flex-wrap gap-2">
                        {r.payoffOrder.map((name, i) => (
                          <span key={name} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                            {i + 1}. {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {interestSaved > 0 && better && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                className="glass-card p-4 mb-8 border-electric-blue/30 text-center"
              >
                <p className="text-sm text-gray-300">
                  The <span className="text-electric-blue font-semibold">{better === 'avalanche' ? 'Avalanche' : 'Snowball'} method</span> saves you{' '}
                  <span className="text-neon-green font-bold">{formatCurrency(interestSaved)}</span> in interest!
                </p>
              </motion.div>
            )}

            <div className="mb-8 flex flex-wrap gap-3">
              <CopyButton getText={summary} />
              <ExportPdfButton getReport={buildReport} fileSlug="debt-payoff" />
            </div>

            {lineData && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <ChartContainer title="Outstanding Balance Over Time">
                  <DarkLine data={lineData} />
                </ChartContainer>
              </motion.div>
            )}
          </>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-gray-400">Enter at least one debt with a balance, APR and minimum payment to see results.</p>
          </div>
        )}

        <CalculatorContent slug="debt-payoff" />

        <AdPlaceholder className="mt-8" />
      </div>
    </div>
  );
}
