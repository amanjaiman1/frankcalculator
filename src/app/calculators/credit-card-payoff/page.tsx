'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  calculateCreditCardMinimum,
  calculateCreditCardFixed,
  solveCreditCardPayment,
  type CreditCardScenario,
} from '@/lib/calculations';
import { formatCurrency, formatMonths, addMonthsLabel } from '@/lib/utils';
import SliderInput from '@/components/SliderInput';
import CopyButton from '@/components/CopyButton';
import ExportPdfButton from '@/components/ExportPdfButton';
import type { PdfReport } from '@/lib/pdfReport';
import { ChartContainer, DarkLine, chartColors } from '@/components/ChartWrapper';
import AdPlaceholder from '@/components/AdPlaceholder';
import CalculatorContent from '@/components/CalculatorContent';

const DEFAULTS = { balance: 8000, apr: 21, fixedPayment: 300, targetMonths: 24, minPercent: 2 };

export default function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState(DEFAULTS.balance);
  const [apr, setApr] = useState(DEFAULTS.apr);
  const [fixedPayment, setFixedPayment] = useState(DEFAULTS.fixedPayment);
  const [targetMonths, setTargetMonths] = useState(DEFAULTS.targetMonths);
  const [minPercent, setMinPercent] = useState(DEFAULTS.minPercent);

  const minScenario = useMemo(
    () => calculateCreditCardMinimum(balance, apr, minPercent, 25),
    [balance, apr, minPercent]
  );
  const fixedScenario = useMemo(
    () => calculateCreditCardFixed(balance, apr, fixedPayment),
    [balance, apr, fixedPayment]
  );
  const requiredPayment = useMemo(
    () => solveCreditCardPayment(balance, apr, targetMonths),
    [balance, apr, targetMonths]
  );
  const targetScenario = useMemo(
    () => calculateCreditCardFixed(balance, apr, requiredPayment),
    [balance, apr, requiredPayment]
  );

  const resetDefaults = () => {
    setBalance(DEFAULTS.balance);
    setApr(DEFAULTS.apr);
    setFixedPayment(DEFAULTS.fixedPayment);
    setTargetMonths(DEFAULTS.targetMonths);
    setMinPercent(DEFAULTS.minPercent);
  };

  const lineData = useMemo(() => {
    const scenarios = [
      { s: minScenario, color: chartColors.hotOrange, label: 'Minimum Only' },
      { s: fixedScenario, color: chartColors.electricBlue, label: 'Fixed Payment' },
      { s: targetScenario, color: chartColors.neonGreen, label: `Target ${targetMonths} mo` },
    ];
    const maxLen = Math.max(...scenarios.map((x) => (x.s.paysOff ? x.s.schedule.length : 0)), 1);
    const step = Math.max(1, Math.floor(maxLen / 24));
    const labels: string[] = [];
    for (let i = 0; i < maxLen; i += step) labels.push(`Mo ${i}`);

    return {
      labels,
      datasets: scenarios.map(({ s, color, label }) => ({
        label,
        data: labels.map((_, idx) => {
          const monthIndex = idx * step;
          const point = s.schedule[monthIndex];
          return point ? Math.round(point.balance) : 0;
        }),
        borderColor: color,
        backgroundColor: 'transparent',
        tension: 0.4,
      })),
    };
  }, [minScenario, fixedScenario, targetScenario, targetMonths]);

  const monthlyInterest = balance * (apr / 100 / 12);
  const fixedTooLow = !fixedScenario.paysOff;

  const summary = () =>
    [
      'Credit Card Payoff Summary',
      `Balance: ${formatCurrency(balance)} · APR: ${apr}%`,
      `Minimum only: ${minScenario.paysOff ? formatMonths(minScenario.months) : '30+ years'}, interest ${formatCurrency(minScenario.totalInterest)}`,
      `Fixed ${formatCurrency(fixedPayment)}/mo: ${fixedScenario.paysOff ? formatMonths(fixedScenario.months) : 'never pays off'}${fixedScenario.paysOff ? `, interest ${formatCurrency(fixedScenario.totalInterest)}` : ''}`,
      `Target ${targetMonths} mo: requires ${formatCurrency(requiredPayment)}/mo, interest ${formatCurrency(targetScenario.totalInterest)}`,
    ].join('\n');

  const buildReport = (): PdfReport => {
    const interestVsMin = minScenario.paysOff
      ? minScenario.totalInterest - targetScenario.totalInterest
      : 0;
    return {
      calculatorName: 'Credit Card Payoff Calculator',
      accentColor: chartColors.electricPink,
      heroValue: {
        label: `Pay off in ${targetMonths} months`,
        value: `${formatCurrency(requiredPayment)}/mo`,
        sub: `Clears ${formatCurrency(balance)} at ${apr}% APR · ${formatCurrency(targetScenario.totalInterest)} interest`,
      },
      kpis: [
        {
          label: 'Minimum Only',
          value: minScenario.paysOff ? formatMonths(minScenario.months) : '30+ years',
          sub: minScenario.paysOff ? `${formatCurrency(minScenario.totalInterest)} interest` : 'Barely dents the balance',
        },
        {
          label: `Fixed ${formatCurrency(fixedPayment)}/mo`,
          value: fixedScenario.paysOff ? formatMonths(fixedScenario.months) : 'Never pays off',
          sub: fixedScenario.paysOff ? `${formatCurrency(fixedScenario.totalInterest)} interest` : 'Below monthly interest',
        },
        {
          label: `Target ${targetMonths} mo`,
          value: `${formatCurrency(requiredPayment)}/mo`,
          sub: `${formatCurrency(targetScenario.totalInterest)} interest`,
        },
      ],
      bars: {
        title: 'Total interest by strategy',
        formatValue: formatCurrency,
        items: [
          ...(minScenario.paysOff ? [{ label: 'Minimum only', value: Math.round(minScenario.totalInterest), color: chartColors.hotOrange }] : []),
          ...(fixedScenario.paysOff ? [{ label: `Fixed ${formatCurrency(fixedPayment)}/mo`, value: Math.round(fixedScenario.totalInterest), color: chartColors.electricBlue }] : []),
          { label: `Target ${targetMonths} mo`, value: Math.round(targetScenario.totalInterest), color: chartColors.neonGreen },
        ],
      },
      breakdown: {
        title: 'Strategy comparison',
        rows: [
          { label: 'Minimum-only interest', value: minScenario.paysOff ? formatCurrency(minScenario.totalInterest) : '30+ years to clear' },
          ...(fixedScenario.paysOff ? [{ label: 'Fixed-payment interest', value: formatCurrency(fixedScenario.totalInterest) }] : []),
          { label: `Target ${targetMonths}-month interest`, value: formatCurrency(targetScenario.totalInterest), isTotal: true },
        ],
      },
      inputs: [
        { label: 'Current balance', value: formatCurrency(balance) },
        { label: 'APR', value: `${apr}%` },
        { label: 'Fixed monthly payment', value: formatCurrency(fixedPayment) },
        { label: 'Target payoff time', value: `${targetMonths} months` },
        { label: 'Minimum payment rate', value: `${minPercent}% of balance` },
        { label: 'Debt-free by', value: addMonthsLabel(new Date(), targetMonths) },
      ],
      notes: [
        `Paying ${formatCurrency(requiredPayment)}/mo clears your card in ${targetMonths} months — debt-free by ${addMonthsLabel(new Date(), targetMonths)}.`,
        minScenario.paysOff && interestVsMin > 0
          ? `Versus paying only the minimum, this target plan saves roughly ${formatCurrency(interestVsMin)} in interest.`
          : `Paying only the minimum keeps you in debt for decades while interest piles up.`,
      ],
      disclaimer:
        'This report is for informational purposes only and is not financial advice. It assumes a fixed APR and no new charges; your card issuer\u2019s terms and minimum-payment rules may differ.',
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
            Credit Card Payoff Calculator
          </h1>
          <p className="text-gray-400 mb-8">
            Compare paying the minimum, a fixed amount, or hitting a target payoff date — and see what each really costs.
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
              <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-display)]">Card Details</h2>
              <button
                onClick={resetDefaults}
                className="text-xs text-gray-400 hover:text-electric-pink border border-white/10 hover:border-electric-pink/40 px-3 py-1.5 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="space-y-6">
              <SliderInput
                label="Current Balance"
                value={balance}
                onChange={setBalance}
                min={500}
                max={100000}
                step={500}
                accent="electric-pink"
                prefix="$"
                format={formatCurrency}
                minLabel="$500"
                maxLabel="$100K"
              />
              <SliderInput
                label="APR"
                value={apr}
                onChange={setApr}
                min={1}
                max={40}
                step={0.5}
                accent="electric-pink"
                suffix="%"
                format={(v) => `${v}%`}
                minLabel="1%"
                maxLabel="40%"
              />
              <SliderInput
                label="Fixed Monthly Payment"
                value={fixedPayment}
                onChange={setFixedPayment}
                min={10}
                max={Math.max(balance, 1000)}
                step={25}
                accent="electric-blue"
                prefix="$"
                format={formatCurrency}
                minLabel="$10"
                maxLabel={formatCurrency(Math.max(balance, 1000))}
              />
              <SliderInput
                label="Target Payoff Time"
                value={targetMonths}
                onChange={setTargetMonths}
                min={3}
                max={120}
                step={1}
                accent="neon-green"
                suffix="mo"
                format={(v) => `${v} months`}
                minLabel="3 mo"
                maxLabel="120 mo"
              />
              <SliderInput
                label="Minimum Payment Rate"
                value={minPercent}
                onChange={setMinPercent}
                min={1}
                max={5}
                step={0.5}
                accent="hot-orange"
                suffix="%"
                format={(v) => `${v}% of balance`}
                minLabel="1%"
                maxLabel="5%"
              />

              {fixedTooLow && (
                <div className="p-3 bg-hot-orange/10 border border-hot-orange/30 rounded-lg">
                  <p className="text-sm text-hot-orange">
                    Your fixed payment is below the monthly interest of {formatCurrency(monthlyInterest)} — the balance would never be paid off.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Results - scenario cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <ScenarioCard scenario={minScenario} accent="hot-orange" payment={minScenario.firstPayment} paymentLabel="starting min payment" />
            <ScenarioCard scenario={fixedScenario} accent="electric-blue" payment={fixedPayment} paymentLabel="fixed monthly" />
            <div className="glass-card p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-neon-green opacity-70" />
              <div className="pl-2">
                <p className="text-[11px] text-gray-400 uppercase tracking-[0.18em] mb-1.5">Target: {targetMonths} months</p>
                <p className="text-2xl sm:text-3xl font-bold text-neon-green font-[family-name:var(--font-display)]">
                  {formatCurrency(requiredPayment)}/mo
                </p>
                <p className="text-xs text-gray-500 mt-1.5">
                  Required payment · {formatCurrency(targetScenario.totalInterest)} interest · debt-free by {addMonthsLabel(new Date(), targetMonths)}
                </p>
              </div>
            </div>
            <div className="pt-1 flex flex-wrap gap-3">
              <CopyButton getText={summary} />
              <ExportPdfButton getReport={buildReport} fileSlug="credit-card-payoff" />
            </div>
          </motion.div>
        </div>

        <AdPlaceholder className="my-8" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <ChartContainer title="Balance Over Time — Strategy Comparison">
            <DarkLine data={lineData} />
          </ChartContainer>
        </motion.div>

        <CalculatorContent slug="credit-card-payoff" />

        <AdPlaceholder className="mt-8" />
      </div>
    </div>
  );
}

function ScenarioCard({
  scenario,
  accent,
  payment,
  paymentLabel,
}: {
  scenario: CreditCardScenario;
  accent: string;
  payment: number;
  paymentLabel: string;
}) {
  return (
    <div className="glass-card p-5 relative overflow-hidden">
      <div className={`absolute top-0 left-0 bottom-0 w-1 bg-${accent} opacity-70`} />
      <div className="pl-2">
        <p className="text-[11px] text-gray-400 uppercase tracking-[0.18em] mb-1.5">{scenario.label}</p>
        <p className={`text-2xl sm:text-3xl font-bold text-${accent} font-[family-name:var(--font-display)]`}>
          {scenario.paysOff ? formatMonths(scenario.months) : 'Never pays off'}
        </p>
        <p className="text-xs text-gray-500 mt-1.5">
          {formatCurrency(payment)} {paymentLabel}
          {scenario.paysOff && ` · ${formatCurrency(scenario.totalInterest)} total interest`}
        </p>
      </div>
    </div>
  );
}
