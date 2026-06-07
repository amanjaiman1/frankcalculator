export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): { emi: number; totalPayment: number; totalInterest: number } {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) {
    const emi = principal / tenureMonths;
    return { emi, totalPayment: principal, totalInterest: 0 };
  }
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;
  return { emi, totalPayment, totalInterest };
}

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  frequency: number = 12
): { finalAmount: number; totalInterest: number; yearlyBreakdown: { year: number; amount: number }[] } {
  const rate = annualRate / 100;
  const finalAmount = principal * Math.pow(1 + rate / frequency, frequency * years);
  const totalInterest = finalAmount - principal;
  const yearlyBreakdown = [];
  for (let y = 1; y <= years; y++) {
    yearlyBreakdown.push({
      year: y,
      amount: principal * Math.pow(1 + rate / frequency, frequency * y),
    });
  }
  return { finalAmount, totalInterest, yearlyBreakdown };
}

interface Debt {
  name: string;
  balance: number;
  rate: number;
  minimumPayment: number;
}

export function calculateDebtPayoff(
  debts: Debt[],
  strategy: 'avalanche' | 'snowball',
  extraPayment: number = 0
): { totalMonths: number; totalInterestPaid: number; payoffOrder: string[] } {
  const sorted = [...debts].sort((a, b) =>
    strategy === 'avalanche' ? b.rate - a.rate : a.balance - b.balance
  );

  let remaining = sorted.map(d => ({ ...d }));
  let totalMonths = 0;
  let totalInterestPaid = 0;
  const payoffOrder: string[] = [];

  while (remaining.length > 0 && totalMonths < 600) {
    totalMonths++;
    const extra = extraPayment;

    for (const debt of remaining) {
      const monthlyInterest = (debt.rate / 100 / 12) * debt.balance;
      totalInterestPaid += monthlyInterest;
      debt.balance += monthlyInterest - debt.minimumPayment;
    }

    // Apply extra to first debt in priority
    if (remaining.length > 0) {
      remaining[0].balance -= extra;
    }

    // Remove paid off debts
    remaining = remaining.filter(d => {
      if (d.balance <= 0) {
        payoffOrder.push(d.name);
        return false;
      }
      return true;
    });
  }

  return { totalMonths, totalInterestPaid, payoffOrder };
}

export function calculateSIP(
  monthlyInvestment: number,
  annualRate: number,
  years: number
): { totalInvested: number; estimatedReturns: number; totalValue: number; yearlyBreakdown: { year: number; invested: number; value: number }[] } {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  const totalInvested = monthlyInvestment * months;

  let totalValue = 0;
  if (monthlyRate === 0) {
    totalValue = totalInvested;
  } else {
    totalValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  }

  const estimatedReturns = totalValue - totalInvested;

  const yearlyBreakdown = [];
  for (let y = 1; y <= years; y++) {
    const m = y * 12;
    const invested = monthlyInvestment * m;
    const value = monthlyRate === 0
      ? invested
      : monthlyInvestment * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
    yearlyBreakdown.push({ year: y, invested, value });
  }

  return { totalInvested, estimatedReturns, totalValue, yearlyBreakdown };
}

export function calculateRetirement(
  currentSavings: number,
  monthlyContribution: number,
  annualRate: number,
  yearsToRetirement: number,
  withdrawalRate: number = 4
): { retirementCorpus: number; monthlyIncome: number; totalContributed: number; totalGrowth: number } {
  const monthlyRate = annualRate / 100 / 12;
  const months = yearsToRetirement * 12;

  let corpus = currentSavings;
  for (let i = 0; i < months; i++) {
    corpus = corpus * (1 + monthlyRate) + monthlyContribution;
  }

  const totalContributed = currentSavings + monthlyContribution * months;
  const totalGrowth = corpus - totalContributed;
  const monthlyIncome = (corpus * (withdrawalRate / 100)) / 12;

  return { retirementCorpus: corpus, monthlyIncome, totalContributed, totalGrowth };
}

export function calculateCreditCardPayoff(
  balance: number,
  apr: number,
  monthlyPayment: number
): { months: number; totalInterest: number; totalPaid: number; schedule: { month: number; balance: number; interest: number }[] } {
  const monthlyRate = apr / 100 / 12;
  let remaining = balance;
  let months = 0;
  let totalInterest = 0;
  const schedule: { month: number; balance: number; interest: number }[] = [];

  while (remaining > 0 && months < 600) {
    months++;
    const interest = remaining * monthlyRate;
    totalInterest += interest;
    remaining = remaining + interest - monthlyPayment;

    if (remaining < 0) remaining = 0;
    schedule.push({ month: months, balance: remaining, interest });
  }

  return { months, totalInterest, totalPaid: balance + totalInterest, schedule };
}

export function calculateBusinessLoan(
  amount: number,
  annualRate: number,
  termMonths: number,
  type: 'term' | 'sba' | 'loc' = 'term'
): { monthlyPayment: number; totalPayment: number; totalInterest: number; effectiveRate: number } {
  // SBA loans typically have slightly lower effective rates, LOC slightly higher
  const rateMultiplier = type === 'sba' ? 0.95 : type === 'loc' ? 1.1 : 1.0;
  const effectiveRate = annualRate * rateMultiplier;
  const monthlyRate = effectiveRate / 12 / 100;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = amount / termMonths;
  } else {
    monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - amount;

  return { monthlyPayment, totalPayment, totalInterest, effectiveRate };
}

interface WorkersCompParams {
  weeklyWage: number;
  injuryType: 'temporary' | 'permanent-partial' | 'permanent-total';
  weeksOfDisability: number;
  medicalExpenses: number;
  state?: string;
}

export function estimateWorkersComp(params: WorkersCompParams): {
  weeklyBenefit: number;
  totalBenefits: number;
  medicalCoverage: number;
  estimatedSettlement: number;
} {
  const { weeklyWage, injuryType, weeksOfDisability, medicalExpenses } = params;

  // Standard workers comp pays ~66.67% of weekly wage
  const benefitRate = injuryType === 'permanent-total' ? 0.6667 : injuryType === 'permanent-partial' ? 0.6667 : 0.6667;
  const weeklyBenefit = weeklyWage * benefitRate;
  const totalBenefits = weeklyBenefit * weeksOfDisability;
  const medicalCoverage = medicalExpenses; // Usually covered in full

  // Settlement multiplier varies by injury type
  const multiplier = injuryType === 'permanent-total' ? 2.5 : injuryType === 'permanent-partial' ? 1.8 : 1.2;
  const estimatedSettlement = (totalBenefits + medicalCoverage) * multiplier;

  return { weeklyBenefit, totalBenefits, medicalCoverage, estimatedSettlement };
}


/* ============================================================================
 * Phase 2 enhancements — additional finance helpers.
 * Existing functions above are intentionally left untouched so other code that
 * imports them keeps working. The functions below add prepayments,
 * amortization schedules, inflation adjustment, multi-scenario comparisons,
 * step-up SIP and retirement-longevity modelling.
 * ========================================================================== */

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanPrepaymentResult {
  emi: number;
  payoffMonths: number;
  totalInterest: number;
  totalPayment: number;
  baselineMonths: number;
  baselineInterest: number;
  interestSaved: number;
  monthsSaved: number;
  schedule: AmortizationRow[];
}

/**
 * Full amortization with an optional fixed monthly extra (prepayment). Returns
 * the per-month schedule plus a comparison against the no-prepayment baseline.
 */
export function calculateLoanWithPrepayment(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  extraMonthly = 0
): LoanPrepaymentResult {
  const safePrincipal = Math.max(0, principal);
  const safeTenure = Math.max(1, Math.round(tenureMonths));
  const monthlyRate = annualRate / 12 / 100;
  const base = calculateEMI(safePrincipal, annualRate, safeTenure);
  const emi = base.emi;

  const schedule: AmortizationRow[] = [];
  let balance = safePrincipal;
  let totalInterest = 0;
  let totalPayment = 0;
  let month = 0;

  while (balance > 0.005 && month < 1200) {
    month++;
    const interest = balance * monthlyRate;
    let principalPart = emi - interest + Math.max(0, extraMonthly);
    if (principalPart > balance) principalPart = balance;
    const payment = interest + principalPart;
    balance -= principalPart;
    totalInterest += interest;
    totalPayment += payment;
    schedule.push({
      month,
      payment,
      principal: principalPart,
      interest,
      balance: Math.max(0, balance),
    });
    if (emi <= interest && extraMonthly <= 0) break; // never amortizes
  }

  const payoffMonths = schedule.length;
  return {
    emi,
    payoffMonths,
    totalInterest,
    totalPayment,
    baselineMonths: safeTenure,
    baselineInterest: base.totalInterest,
    interestSaved: Math.max(0, base.totalInterest - totalInterest),
    monthsSaved: Math.max(0, safeTenure - payoffMonths),
    schedule,
  };
}

export type ContributionFrequency = 'monthly' | 'annual';

export interface CompoundAdvancedResult {
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
  realValue: number; // inflation-adjusted future value
  yearlyBreakdown: {
    year: number;
    balance: number;
    contributions: number; // cumulative principal + contributions
    realBalance: number;
  }[];
}

/**
 * Compound interest with regular contributions, selectable compounding
 * frequency and an inflation-adjusted (real) value.
 */
export function calculateCompoundAdvanced(
  principal: number,
  annualRate: number,
  years: number,
  frequency: number,
  contribution: number,
  contributionFrequency: ContributionFrequency,
  inflationRate: number
): CompoundAdvancedResult {
  const safeYears = Math.max(0, Math.round(years));
  const periodsPerYear = Math.max(1, frequency);
  const ratePerPeriod = annualRate / 100 / periodsPerYear;
  // Contribution applied each compounding period.
  const contributionPerPeriod =
    contributionFrequency === 'monthly'
      ? (contribution * 12) / periodsPerYear
      : contribution / periodsPerYear;

  const yearlyBreakdown: CompoundAdvancedResult['yearlyBreakdown'] = [];
  let balance = principal;
  let cumulativeContrib = principal;

  for (let year = 1; year <= safeYears; year++) {
    for (let p = 0; p < periodsPerYear; p++) {
      balance = balance * (1 + ratePerPeriod) + contributionPerPeriod;
      cumulativeContrib += contributionPerPeriod;
    }
    const realBalance = balance / Math.pow(1 + inflationRate / 100, year);
    yearlyBreakdown.push({
      year,
      balance,
      contributions: cumulativeContrib,
      realBalance,
    });
  }

  const finalAmount = safeYears === 0 ? principal : balance;
  const totalContributions = safeYears === 0 ? principal : cumulativeContrib;
  const realValue = finalAmount / Math.pow(1 + inflationRate / 100, safeYears);

  return {
    finalAmount,
    totalContributions,
    totalInterest: finalAmount - totalContributions,
    realValue,
    yearlyBreakdown,
  };
}

interface DebtInput {
  name: string;
  balance: number;
  rate: number;
  minimumPayment: number;
}

export interface DebtPayoffDetailed {
  totalMonths: number;
  totalInterestPaid: number;
  totalPaid: number;
  payoffOrder: string[];
  /** Total outstanding balance across all debts at the end of each month. */
  balanceTimeline: number[];
}

/**
 * Robust debt-payoff simulation. Min payments are made on every debt, and any
 * leftover (freed-up min payments + extra) is funnelled into the priority debt
 * (highest APR for avalanche, lowest balance for snowball).
 */
export function calculateDebtPayoffDetailed(
  debts: DebtInput[],
  strategy: 'avalanche' | 'snowball',
  extraPayment = 0
): DebtPayoffDetailed {
  const working = debts
    .filter((d) => d.balance > 0)
    .map((d) => ({ ...d, balance: d.balance }));

  let totalMonths = 0;
  let totalInterestPaid = 0;
  let totalPaid = 0;
  const payoffOrder: string[] = [];
  const balanceTimeline: number[] = [];

  while (working.some((d) => d.balance > 0.005) && totalMonths < 1200) {
    totalMonths++;

    // 1. Accrue interest.
    for (const d of working) {
      if (d.balance <= 0) continue;
      const interest = (d.rate / 100 / 12) * d.balance;
      d.balance += interest;
      totalInterestPaid += interest;
    }

    // 2. Determine payment pool = sum of min payments of active debts + extra.
    const active = working.filter((d) => d.balance > 0);
    let pool =
      active.reduce((sum, d) => sum + d.minimumPayment, 0) + Math.max(0, extraPayment);

    // 3. Order debts by strategy priority.
    const ordered = [...active].sort((a, b) =>
      strategy === 'avalanche' ? b.rate - a.rate : a.balance - b.balance
    );

    // 4. Pay minimums first (so every debt gets serviced), then dump remainder
    //    into the priority debt in order.
    for (const d of ordered) {
      if (pool <= 0) break;
      const pay = Math.min(pool, d.balance);
      d.balance -= pay;
      pool -= pay;
      totalPaid += pay;
    }

    // 5. Record any debts cleared this month, in priority order.
    for (const d of ordered) {
      if (d.balance <= 0.005 && !payoffOrder.includes(d.name)) {
        payoffOrder.push(d.name);
      }
    }

    const outstanding = working.reduce((sum, d) => sum + Math.max(0, d.balance), 0);
    balanceTimeline.push(outstanding);
  }

  return { totalMonths, totalInterestPaid, totalPaid, payoffOrder, balanceTimeline };
}

export interface BusinessLoanAdvanced {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  effectiveRate: number;
  fees: number;
  netProceeds: number;
  aprWithFees: number;
  balloonPayment: number;
}

/**
 * Business loan with origination fees, optional balloon payment and a true
 * APR-with-fees figure (the rate that equates the net cash received to the
 * repayment stream).
 */
export function calculateBusinessLoanAdvanced(
  amount: number,
  annualRate: number,
  termMonths: number,
  type: 'term' | 'sba' | 'loc',
  feePercent = 0,
  feeFlat = 0,
  balloonPayment = 0
): BusinessLoanAdvanced {
  const safeAmount = Math.max(0, amount);
  const safeTerm = Math.max(1, Math.round(termMonths));
  const rateMultiplier = type === 'sba' ? 0.95 : type === 'loc' ? 1.1 : 1.0;
  const effectiveRate = annualRate * rateMultiplier;
  const monthlyRate = effectiveRate / 12 / 100;
  const balloon = Math.min(Math.max(0, balloonPayment), safeAmount);

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = (safeAmount - balloon) / safeTerm;
  } else {
    const pvFactor = Math.pow(1 + monthlyRate, safeTerm);
    // Payment that amortizes (principal - PV of balloon) over the term.
    const financed = safeAmount - balloon / pvFactor;
    monthlyPayment = (financed * monthlyRate * pvFactor) / (pvFactor - 1);
  }

  const totalPayment = monthlyPayment * safeTerm + balloon;
  const totalInterest = totalPayment - safeAmount;
  const fees = safeAmount * (feePercent / 100) + feeFlat;
  const netProceeds = safeAmount - fees;

  // Solve APR-with-fees via bisection: rate where PV(payments) == netProceeds.
  const aprWithFees = solveAprWithFees(monthlyPayment, safeTerm, balloon, netProceeds);

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    effectiveRate,
    fees,
    netProceeds,
    aprWithFees,
    balloonPayment: balloon,
  };
}

function solveAprWithFees(
  payment: number,
  termMonths: number,
  balloon: number,
  netProceeds: number
): number {
  if (netProceeds <= 0 || payment <= 0) return 0;
  const pv = (monthlyRate: number): number => {
    if (monthlyRate === 0) return payment * termMonths + balloon;
    const factor = Math.pow(1 + monthlyRate, -termMonths);
    return payment * ((1 - factor) / monthlyRate) + balloon * factor;
  };
  let lo = 0;
  let hi = 1; // 100% monthly is an extreme upper bound
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const value = pv(mid);
    if (value > netProceeds) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return ((lo + hi) / 2) * 12 * 100;
}

export interface CreditCardScenario {
  label: string;
  months: number;
  totalInterest: number;
  totalPaid: number;
  firstPayment: number;
  paysOff: boolean;
  schedule: { month: number; balance: number }[];
}

/**
 * Minimum-payment-only payoff. Minimum is the greater of (percent of balance +
 * accrued interest) and a floor, recalculated as the balance declines.
 */
export function calculateCreditCardMinimum(
  balance: number,
  apr: number,
  minPercent = 2,
  minFloor = 25
): CreditCardScenario {
  const monthlyRate = apr / 100 / 12;
  let remaining = Math.max(0, balance);
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  let firstPayment = 0;
  const schedule: { month: number; balance: number }[] = [{ month: 0, balance: remaining }];

  while (remaining > 0.005 && months < 1200) {
    months++;
    const interest = remaining * monthlyRate;
    totalInterest += interest;
    let payment = Math.max((remaining + interest) * (minPercent / 100), minFloor);
    if (payment > remaining + interest) payment = remaining + interest;
    if (months === 1) firstPayment = payment;
    remaining = remaining + interest - payment;
    totalPaid += payment;
    if (remaining < 0) remaining = 0;
    schedule.push({ month: months, balance: remaining });
  }

  return {
    label: 'Minimum Only',
    months,
    totalInterest,
    totalPaid,
    firstPayment,
    paysOff: remaining <= 0.005,
    schedule,
  };
}

/**
 * Fixed-payment payoff scenario.
 */
export function calculateCreditCardFixed(
  balance: number,
  apr: number,
  monthlyPayment: number
): CreditCardScenario {
  const monthlyRate = apr / 100 / 12;
  const safeBalance = Math.max(0, balance);
  let remaining = safeBalance;
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  const schedule: { month: number; balance: number }[] = [{ month: 0, balance: remaining }];
  const minViable = remaining * monthlyRate;

  if (monthlyPayment <= minViable) {
    return {
      label: 'Fixed Payment',
      months: Infinity,
      totalInterest: Infinity,
      totalPaid: Infinity,
      firstPayment: monthlyPayment,
      paysOff: false,
      schedule,
    };
  }

  while (remaining > 0.005 && months < 1200) {
    months++;
    const interest = remaining * monthlyRate;
    totalInterest += interest;
    let pay = monthlyPayment;
    if (pay > remaining + interest) pay = remaining + interest;
    remaining = remaining + interest - pay;
    totalPaid += pay;
    if (remaining < 0) remaining = 0;
    schedule.push({ month: months, balance: remaining });
  }

  return {
    label: 'Fixed Payment',
    months,
    totalInterest,
    totalPaid,
    firstPayment: monthlyPayment,
    paysOff: remaining <= 0.005,
    schedule,
  };
}

/**
 * Solve the fixed monthly payment required to clear the balance in exactly
 * `targetMonths` months (standard annuity payment formula).
 */
export function solveCreditCardPayment(
  balance: number,
  apr: number,
  targetMonths: number
): number {
  const safeBalance = Math.max(0, balance);
  const n = Math.max(1, Math.round(targetMonths));
  const monthlyRate = apr / 100 / 12;
  if (monthlyRate === 0) return safeBalance / n;
  return (safeBalance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
}

export interface SIPAdvancedResult {
  totalInvested: number;
  totalValue: number;
  estimatedReturns: number;
  realValue: number;
  yearlyBreakdown: { year: number; invested: number; value: number; realValue: number }[];
}

/**
 * SIP with optional annual step-up, an initial lump sum and an
 * inflation-adjusted (real) value.
 */
export function calculateSIPAdvanced(
  monthlyInvestment: number,
  annualRate: number,
  years: number,
  stepUpPercent = 0,
  lumpSum = 0,
  inflationRate = 0
): SIPAdvancedResult {
  const safeYears = Math.max(0, Math.round(years));
  const monthlyRate = annualRate / 100 / 12;
  const yearlyBreakdown: SIPAdvancedResult['yearlyBreakdown'] = [];

  let balance = Math.max(0, lumpSum);
  let invested = Math.max(0, lumpSum);
  let currentMonthly = Math.max(0, monthlyInvestment);

  for (let year = 1; year <= safeYears; year++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + currentMonthly;
      invested += currentMonthly;
    }
    const realValue = balance / Math.pow(1 + inflationRate / 100, year);
    yearlyBreakdown.push({ year, invested, value: balance, realValue });
    currentMonthly = currentMonthly * (1 + stepUpPercent / 100);
  }

  const totalValue = safeYears === 0 ? balance : balance;
  const realValue = totalValue / Math.pow(1 + inflationRate / 100, Math.max(1, safeYears));

  return {
    totalInvested: invested,
    totalValue,
    estimatedReturns: totalValue - invested,
    realValue,
    yearlyBreakdown,
  };
}

/**
 * Goal mode: find the starting monthly SIP needed to reach a target corpus,
 * accounting for step-up and an initial lump sum. Uses bisection because the
 * step-up breaks the closed-form annuity formula.
 */
export function solveSIPForGoal(
  targetCorpus: number,
  annualRate: number,
  years: number,
  stepUpPercent = 0,
  lumpSum = 0
): number {
  const target = Math.max(0, targetCorpus);
  const corpusFor = (monthly: number): number =>
    calculateSIPAdvanced(monthly, annualRate, years, stepUpPercent, lumpSum, 0).totalValue;

  // If the lump sum alone already exceeds the target, no SIP needed.
  if (corpusFor(0) >= target) return 0;

  let lo = 0;
  let hi = Math.max(1000, target); // generous upper bound
  // Grow hi until it overshoots the target.
  while (corpusFor(hi) < target && hi < 1e12) hi *= 2;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (corpusFor(mid) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export interface RetirementPlanResult {
  retirementCorpus: number;
  totalContributed: number;
  totalGrowth: number;
  desiredMonthlyIncomeAtRetirement: number; // inflation-adjusted to retirement year
  requiredCorpus: number; // corpus needed to fund desired income through life expectancy
  corpusLasts: boolean;
  surplusOrShortfall: number; // corpus - requiredCorpus (positive = surplus)
  depletionAge: number | null; // age at which the corpus runs out, or null if it lasts
  accumulation: { age: number; balance: number; contributions: number }[];
}

/**
 * Full retirement-longevity model. Accumulates savings to retirement at the
 * pre-retirement return, then simulates drawdown of an inflation-growing
 * desired income at the post-retirement return through life expectancy.
 */
export function calculateRetirementPlan(params: {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  preReturn: number;
  postReturn: number;
  inflation: number;
  desiredMonthlyIncome: number; // in today's dollars
}): RetirementPlanResult {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    preReturn,
    postReturn,
    inflation,
    desiredMonthlyIncome,
  } = params;

  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);
  const preMonthly = preReturn / 100 / 12;

  const accumulation: RetirementPlanResult['accumulation'] = [];
  let balance = Math.max(0, currentSavings);
  let contributions = Math.max(0, currentSavings);
  accumulation.push({ age: currentAge, balance, contributions });

  for (let year = 1; year <= yearsToRetirement; year++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + preMonthly) + monthlyContribution;
      contributions += monthlyContribution;
    }
    accumulation.push({ age: currentAge + year, balance, contributions });
  }

  const retirementCorpus = balance;
  const totalContributed = contributions;
  const totalGrowth = retirementCorpus - totalContributed;

  // Desired income inflated to the first year of retirement.
  const desiredMonthlyIncomeAtRetirement =
    desiredMonthlyIncome * Math.pow(1 + inflation / 100, yearsToRetirement);

  // Required corpus: present value (at retirement) of an inflation-growing
  // income stream over the retirement years, discounted at the post return.
  const postMonthly = postReturn / 100 / 12;
  const inflMonthly = Math.pow(1 + inflation / 100, 1 / 12) - 1;
  const totalRetirementMonths = yearsInRetirement * 12;

  let requiredCorpus = 0;
  let payment = desiredMonthlyIncomeAtRetirement;
  for (let m = 0; m < totalRetirementMonths; m++) {
    requiredCorpus += payment / Math.pow(1 + postMonthly, m + 1);
    payment *= 1 + inflMonthly;
  }

  // Simulate drawdown to find depletion age (if any).
  let drawBalance = retirementCorpus;
  let withdrawal = desiredMonthlyIncomeAtRetirement;
  let depletionAge: number | null = null;
  for (let m = 0; m < totalRetirementMonths; m++) {
    drawBalance = drawBalance * (1 + postMonthly) - withdrawal;
    withdrawal *= 1 + inflMonthly;
    if (drawBalance <= 0 && depletionAge === null) {
      depletionAge = retirementAge + Math.floor(m / 12);
      break;
    }
  }

  const corpusLasts = depletionAge === null;
  const surplusOrShortfall = retirementCorpus - requiredCorpus;

  return {
    retirementCorpus,
    totalContributed,
    totalGrowth,
    desiredMonthlyIncomeAtRetirement,
    requiredCorpus,
    corpusLasts,
    surplusOrShortfall,
    depletionAge,
    accumulation,
  };
}



/* ============================================================================
 * Phase 3 — Workers' Compensation settlement engine.
 *
 * The original `estimateWorkersComp` above is intentionally preserved so any
 * existing imports keep working. The function below is a far more thorough,
 * research-backed ESTIMATOR that models how US workers' comp settlements are
 * actually built: average weekly wage → comp rate (capped at the state max),
 * temporary + permanent disability benefits (scheduled vs whole-person),
 * permanent total disability, future medical, past owed benefits, attorney
 * fees, liens, and a lump-sum vs structured-settlement comparison.
 *
 * Every output is an ESTIMATE only — not legal advice.
 * ========================================================================== */

export type DisabilityCategory =
  | 'TTD'
  | 'PPD_SCHEDULED'
  | 'PPD_UNSCHEDULED'
  | 'PTD';

export interface WorkersCompSettlementParams {
  /** Average Weekly Wage (the 52-week pre-injury average). */
  averageWeeklyWage: number;
  /** Fraction of AWW paid as the comp rate, as a percent (typically ~66.67). */
  compRatePct: number;
  /** State maximum weekly rate (0 => treat as no hard cap). */
  stateMaxWeekly: number;
  /** State minimum weekly rate (0 => no floor). */
  stateMinWeekly: number;

  /** Primary permanent-disability category. */
  category: DisabilityCategory;

  /** Weeks out of work paid as temporary total disability (TTD). */
  weeksOffWork: number;

  /** Optional temporary partial disability (light-duty wage loss). */
  includeTPD: boolean;
  /** Weekly wage loss while on light duty (gross). */
  tpdWeeklyWageLoss: number;
  /** Number of weeks of temporary partial disability. */
  tpdWeeks: number;

  /** Scheduled weeks for the selected body part (for PPD_SCHEDULED). */
  bodyPartWeeks: number;
  /** Whole-person statutory weeks (for PPD_UNSCHEDULED). */
  wholePersonWeeks: number;
  /** Permanent impairment rating, as a percent (for PPD). */
  impairmentPct: number;
  /** Weeks of permanent total disability (for PTD). */
  ptdWeeks: number;

  /** Future medical / Medicare Set-Aside buyout, added to the settlement. */
  futureMedical: number;
  /** Past unpaid / owed benefits, added to the settlement. */
  pastOwedBenefits: number;

  /** Attorney contingency fee, as a percent of the recovery. */
  attorneyFeePct: number;
  /** Medical liens, child support, advances, etc., deducted from net. */
  liens: number;

  /** +/- percentage used to produce a realistic low–high range. */
  rangePct: number;

  /** Structured-settlement payout period, in years. */
  structuredYears: number;
  /** Structured-settlement discount / growth rate, as a percent. */
  structuredRatePct: number;
}

export interface SettlementBreakdownItem {
  key: string;
  label: string;
  amount: number;
}

export interface WorkersCompSettlementResult {
  /** AWW × comp fraction, before any cap/floor. */
  rawCompRate: number;
  /** Comp rate after applying the state cap/floor. */
  effectiveCompRate: number;
  capApplied: boolean;
  floorApplied: boolean;

  /** Temporary total disability award. */
  ttd: number;
  /** Temporary partial disability award (0 if not included). */
  tpd: number;
  /** Permanent disability award for the chosen category. */
  permanent: number;
  /** Human-readable label describing the permanent component. */
  permanentLabel: string;

  futureMedical: number;
  pastOwed: number;

  /** Gross settlement before attorney fees and liens. */
  grossSettlement: number;
  attorneyFees: number;
  liens: number;
  /** What the worker actually keeps. */
  netToWorker: number;

  /** Low / high gross range to set expectations. */
  lowEstimate: number;
  highEstimate: number;

  /** Structured-settlement figures (based on the net amount). */
  structuredMonthly: number;
  structuredAnnual: number;
  structuredTotalNominal: number;

  /** Itemized positive components (for charts + breakdown table). */
  breakdown: SettlementBreakdownItem[];
}

/**
 * Compute an estimated workers' compensation settlement. Inputs are sanitized
 * (negatives and NaN are floored to safe values) so blank form fields never
 * crash the calculation.
 */
export function estimateWorkersCompSettlement(
  params: WorkersCompSettlementParams
): WorkersCompSettlementResult {
  const num = (v: number, fallback = 0): number =>
    Number.isFinite(v) ? v : fallback;
  const nonNeg = (v: number): number => Math.max(0, num(v));

  const aww = nonNeg(params.averageWeeklyWage);
  const compFraction = nonNeg(params.compRatePct) / 100;
  const stateMax = nonNeg(params.stateMaxWeekly);
  const stateMin = nonNeg(params.stateMinWeekly);

  // 1. Comp rate = AWW × fraction, capped at state max, floored at state min.
  const rawCompRate = aww * compFraction;
  let effectiveCompRate = rawCompRate;
  let capApplied = false;
  let floorApplied = false;

  if (stateMax > 0 && effectiveCompRate > stateMax) {
    effectiveCompRate = stateMax;
    capApplied = true;
  }
  // Floor only matters when the worker actually earned wages.
  if (stateMin > 0 && aww > 0 && effectiveCompRate < stateMin) {
    effectiveCompRate = stateMin;
    floorApplied = true;
  }

  // 2. Temporary total disability — comp rate × weeks off work.
  const ttd = effectiveCompRate * nonNeg(params.weeksOffWork);

  // 3. Temporary partial disability — two-thirds of weekly wage loss, capped at
  //    the comp rate, over the TPD weeks.
  let tpd = 0;
  if (params.includeTPD) {
    const tpdWeekly = Math.min(
      nonNeg(params.tpdWeeklyWageLoss) * compFraction,
      effectiveCompRate > 0 ? effectiveCompRate : Number.POSITIVE_INFINITY
    );
    tpd = tpdWeekly * nonNeg(params.tpdWeeks);
  }

  // 4. Permanent disability component depends on the category.
  const impairment = nonNeg(params.impairmentPct) / 100;
  let permanent = 0;
  let permanentLabel = '';

  switch (params.category) {
    case 'PPD_SCHEDULED':
      permanent = effectiveCompRate * nonNeg(params.bodyPartWeeks) * impairment;
      permanentLabel = 'PPD — scheduled body-part loss';
      break;
    case 'PPD_UNSCHEDULED':
      permanent =
        effectiveCompRate * nonNeg(params.wholePersonWeeks) * impairment;
      permanentLabel = 'PPD — whole-person (unscheduled)';
      break;
    case 'PTD':
      permanent = effectiveCompRate * nonNeg(params.ptdWeeks);
      permanentLabel = 'Permanent total disability';
      break;
    case 'TTD':
    default:
      permanent = 0;
      permanentLabel = 'Temporary disability only';
      break;
  }

  const futureMedical = nonNeg(params.futureMedical);
  const pastOwed = nonNeg(params.pastOwedBenefits);

  // 5. Gross settlement = all positive components.
  const grossSettlement = ttd + tpd + permanent + futureMedical + pastOwed;

  // 6. Deductions. Attorney fee applies to the indemnity recovery (gross less
  //    future medical, which is commonly carved out of the fee base); liens
  //    come off the remainder.
  const feeBase = Math.max(0, grossSettlement - futureMedical);
  const attorneyFeePct = Math.min(100, nonNeg(params.attorneyFeePct));
  const attorneyFees = feeBase * (attorneyFeePct / 100);
  const liens = nonNeg(params.liens);
  const netToWorker = Math.max(0, grossSettlement - attorneyFees - liens);

  // 7. Low / high range on the gross figure.
  const rangePct = Math.min(100, nonNeg(params.rangePct)) / 100;
  const lowEstimate = grossSettlement * (1 - rangePct);
  const highEstimate = grossSettlement * (1 + rangePct);

  // 8. Structured settlement: pay out the NET amount as an annuity over
  //    `structuredYears` at the discount/growth rate. Present value of the
  //    structured stream equals the lump sum; the nominal total is larger.
  const years = Math.max(0, Math.round(num(params.structuredYears)));
  const annualRate = nonNeg(params.structuredRatePct) / 100;
  let structuredMonthly = 0;
  let structuredAnnual = 0;
  let structuredTotalNominal = 0;

  if (years > 0 && netToWorker > 0) {
    const months = years * 12;
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) {
      structuredMonthly = netToWorker / months;
      structuredAnnual = netToWorker / years;
    } else {
      structuredMonthly =
        (netToWorker * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
      structuredAnnual =
        (netToWorker * annualRate) / (1 - Math.pow(1 + annualRate, -years));
    }
    structuredTotalNominal = structuredMonthly * months;
  }

  const breakdown: SettlementBreakdownItem[] = [
    { key: 'ttd', label: 'Temporary total disability', amount: ttd },
    { key: 'tpd', label: 'Temporary partial disability', amount: tpd },
    { key: 'permanent', label: permanentLabel, amount: permanent },
    { key: 'futureMedical', label: 'Future medical', amount: futureMedical },
    { key: 'pastOwed', label: 'Past owed benefits', amount: pastOwed },
  ].filter((item) => item.amount > 0);

  return {
    rawCompRate,
    effectiveCompRate,
    capApplied,
    floorApplied,
    ttd,
    tpd,
    permanent,
    permanentLabel,
    futureMedical,
    pastOwed,
    grossSettlement,
    attorneyFees,
    liens,
    netToWorker,
    lowEstimate,
    highEstimate,
    structuredMonthly,
    structuredAnnual,
    structuredTotalNominal,
    breakdown,
  };
}

/**
 * Helper: compute Average Weekly Wage from gross earnings over a number of
 * weeks (the standard "total wages ÷ weeks worked" approach). Guards against
 * division by zero.
 */
export function computeAverageWeeklyWage(
  grossEarnings: number,
  weeksWorked: number
): number {
  const earnings = Math.max(0, Number.isFinite(grossEarnings) ? grossEarnings : 0);
  const weeks = Math.max(1, Number.isFinite(weeksWorked) ? weeksWorked : 1);
  return earnings / weeks;
}
