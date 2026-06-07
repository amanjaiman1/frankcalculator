import type { Metadata } from 'next';

/* =========================================================================
 * FrankCalculator — shared SEO configuration
 *
 * Single source of truth for:
 *   - site-level constants (URL, name)
 *   - a typed registry of every calculator (metadata + on-page content + FAQ)
 *   - helpers that build per-page `Metadata`
 *   - helpers that build JSON-LD structured-data objects
 *
 * Everything here is plain serializable data (no functions inside the LD
 * objects) so it can be safely rendered via <script type="application/ld+json">.
 * ===================================================================== */

export const SITE_URL = 'https://frankcalculator.com';
export const SITE_NAME = 'FrankCalculator';
export const SITE_TAGLINE = 'Free Financial Calculators';
export const SITE_DESCRIPTION =
  'Get instant clarity on loans, investments, debt and retirement with free, beautifully designed financial calculators. No sign-ups, no hidden fees — just frank financial answers.';

/** Support / contact email surfaced on the contact and legal pages. */
export const SITE_EMAIL = 'support@frankcalculator.com';

/* ----------------------------- AdSense ----------------------------- */

/**
 * Google AdSense publisher ID (the "ca-pub-..." client value).
 *
 * Set NEXT_PUBLIC_ADSENSE_CLIENT in your environment (e.g. Vercel) to your
 * real publisher ID. Until a valid ID is provided, no AdSense script, meta
 * verification tag, or ad slots are rendered — so nothing breaks pre-approval.
 *
 * The matching ads.txt file lives at /public/ads.txt and must be updated with
 * the same publisher number (the part after "ca-").
 */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || '';

/** True only when a real-looking publisher ID has been configured. */
export const ADSENSE_ENABLED =
  /^ca-pub-\d{10,}$/.test(ADSENSE_CLIENT);

/* ----------------------------- types ----------------------------- */

export interface FaqItem {
  q: string;
  a: string;
}

export interface ContentSection {
  heading: string;
  body: string[];
}

export interface CalculatorSeo {
  slug: string;
  path: string;
  /** Human-readable product name used in structured data + breadcrumbs. */
  name: string;
  /** Keyword-first page <title> (<= 60 chars; site name appended via template). */
  title: string;
  /** Meta description, ~140–160 chars, primary + secondary keywords. */
  description: string;
  keywords: string[];
  /** Tailwind color token reused as the page accent (see globals.css safelist). */
  accent: string;
  /** Gradient H2 that introduces the educational section. */
  guideHeading: string;
  /** Short intro paragraph under the guide heading. */
  intro: string;
  /** Educational article blocks rendered on the page. */
  sections: ContentSection[];
  /** On-page FAQ — also emitted as FAQPage JSON-LD. */
  faqs: FaqItem[];
}

/* A JSON-LD object is just serializable data. */
export type JsonLdObject = Record<string, unknown>;

/* ----------------------------- registry ----------------------------- */

export const CALCULATORS: Record<string, CalculatorSeo> = {
  'personal-loan': {
    slug: 'personal-loan',
    path: '/calculators/personal-loan',
    name: 'Personal Loan Calculator',
    title: 'Personal Loan Calculator – Monthly EMI & Payments',
    description:
      'Free personal loan and EMI calculator. Estimate your monthly payment, total interest and amortization schedule, and add extra payments to pay off your loan faster.',
    keywords: [
      'personal loan calculator',
      'personal loan EMI calculator',
      'monthly payment calculator',
      'loan amortization schedule',
      'loan interest calculator',
      'loan payoff calculator',
      'loan repayment calculator',
      'EMI formula',
      'loan calculator with extra payments',
      'prepayment calculator',
      'installment loan calculator',
    ],
    accent: 'electric-blue',
    guideHeading: 'Understanding Your Personal Loan',
    intro:
      'A personal loan calculator turns three numbers — amount, rate and term — into the monthly payment (EMI) you will actually live with. Here is how the math works and how to pay less interest.',
    sections: [
      {
        heading: 'How the personal loan calculator works',
        body: [
          'This personal loan EMI calculator takes your loan amount, annual interest rate and tenure, then solves for a fixed monthly payment that fully repays the loan over the term. Each payment covers the interest accrued that month first, and whatever is left chips away at the principal.',
          'Early in the schedule most of your EMI is interest; as the balance falls, more of every payment goes to principal. The amortization schedule above shows that crossover month by month so you can see exactly where your money goes.',
        ],
      },
      {
        heading: 'The EMI formula',
        body: [
          'The equated monthly installment is calculated as EMI = P · r · (1 + r)^n / ((1 + r)^n − 1), where P is the principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly payments.',
          'Because interest compounds on the outstanding balance, even small changes to the rate or term move the total interest a surprising amount. Use the sliders to feel how sensitive your monthly payment is to each input.',
        ],
      },
      {
        heading: 'Key terms: principal, interest, tenure and EMI',
        body: [
          'Principal is the amount you borrow. Interest is the lender’s charge for that money, expressed as an annual percentage rate. Tenure is how long you take to repay, and the EMI is the level monthly payment that combines principal and interest.',
          'Total interest payable is every interest charge added together over the life of the loan — the real cost of borrowing. A longer tenure lowers the monthly payment but raises total interest; a shorter tenure does the opposite.',
        ],
      },
      {
        heading: 'Tips to pay off your loan faster',
        body: [
          'Adding an extra monthly payment is the simplest way to cut interest and shorten your payoff date. Even a modest top-up goes straight to principal, shrinking the balance every interest charge is calculated on.',
          'Before borrowing, compare the total payment — not just the EMI — across lenders, watch for prepayment penalties, and consider a shorter term if the higher payment still fits your budget comfortably.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is a personal loan EMI?',
        a: 'EMI stands for equated monthly installment — the fixed amount you pay each month that combines both interest and principal so the loan is fully repaid by the end of its term. The EMI stays the same every month, but the split between interest and principal shifts over time.',
      },
      {
        q: 'How is the monthly payment on a personal loan calculated?',
        a: 'The calculator uses the standard amortization formula: EMI = P · r · (1 + r)^n / ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate and n is the number of payments. It then builds a full amortization schedule splitting each payment into interest and principal.',
      },
      {
        q: 'Does paying extra each month really save money?',
        a: 'Yes. Any amount above your EMI is applied directly to the principal, which lowers the balance that future interest is charged on. Over the life of the loan that can save a meaningful amount of interest and clear the debt months or even years early — the calculator shows both savings.',
      },
      {
        q: 'Should I choose a longer or shorter loan tenure?',
        a: 'A longer tenure reduces the monthly payment but increases the total interest you pay; a shorter tenure raises the payment but lowers total interest. Pick the shortest term whose EMI still fits comfortably within your budget.',
      },
      {
        q: 'What is an amortization schedule?',
        a: 'An amortization schedule is a month-by-month table showing each payment broken into interest and principal, plus the remaining balance. It reveals how slowly the balance falls at first and how quickly it drops once more of each payment goes to principal.',
      },
      {
        q: 'Does this personal loan calculator account for fees?',
        a: 'This tool focuses on the EMI, interest and amortization for a fixed-rate loan. Origination fees, insurance or processing charges are not included, so always compare the lender’s APR and total cost before signing.',
      },
    ],
  },

  'compound-interest': {
    slug: 'compound-interest',
    path: '/calculators/compound-interest',
    name: 'Compound Interest Calculator',
    title: 'Compound Interest Calculator – Daily & Monthly',
    description:
      'Free compound interest calculator with daily, monthly, quarterly and annual compounding. Add monthly contributions and see your investment growth and future value.',
    keywords: [
      'compound interest calculator',
      'daily compounding',
      'monthly compounding',
      'quarterly compounding',
      'annual compounding',
      'compound interest with monthly contributions',
      'compound interest formula',
      'future value calculator',
      'investment growth calculator',
      'savings calculator with interest',
      'continuous compounding',
      'inflation-adjusted real return',
    ],
    accent: 'neon-green',
    guideHeading: 'Understanding Compound Interest',
    intro:
      'Compound interest is interest earning interest — the engine behind long-term investing. This calculator shows how your money grows across different compounding frequencies and contribution amounts.',
    sections: [
      {
        heading: 'How the compound interest calculator works',
        body: [
          'Enter your starting principal, an annual interest rate, how often interest compounds (daily, monthly, quarterly or annually) and the number of years. The calculator projects the future value and separates how much came from your contributions versus growth.',
          'You can also add a recurring monthly contribution. Each contribution starts compounding from the moment it is added, which is why steady investing over time so dramatically outpaces a single lump sum.',
        ],
      },
      {
        heading: 'The compound interest formula',
        body: [
          'The core formula is A = P(1 + r/n)^(nt), where A is the future value, P is the principal, r is the annual rate as a decimal, n is the number of compounding periods per year and t is the number of years.',
          'As n grows — from annual toward daily — the result inches toward continuous compounding, A = Pe^(rt). The more frequently interest compounds, the faster the balance grows, though the difference between monthly and daily is usually small.',
        ],
      },
      {
        heading: 'Compounding frequency and real returns',
        body: [
          'Compounding frequency is how often earned interest is added back to the balance so it can itself earn interest. Daily compounding edges out monthly, which edges out quarterly and annual, for the same nominal rate.',
          'Inflation quietly erodes purchasing power, so this tool also shows an inflation-adjusted real return — what your future balance is actually worth in today’s dollars. A 7% return with 3% inflation is closer to a 4% real gain.',
        ],
      },
      {
        heading: 'Tips to maximize compound growth',
        body: [
          'Time is the most powerful lever: starting earlier beats investing more later because each year of compounding multiplies on top of the last. Automating regular contributions keeps the snowball rolling.',
          'Reinvest dividends and interest rather than spending them, minimize fees that drag on returns, and keep money invested through market noise so compounding has room to work.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is compound interest?',
        a: 'Compound interest is interest calculated on both your original principal and the interest already earned. Because each period’s interest joins the balance and earns its own interest, the growth accelerates over time — unlike simple interest, which is paid only on the principal.',
      },
      {
        q: 'What is the compound interest formula?',
        a: 'The standard formula is A = P(1 + r/n)^(nt), where A is the final amount, P is the principal, r is the annual rate as a decimal, n is how many times interest compounds per year and t is the number of years. With regular contributions, each deposit is compounded for the time it stays invested.',
      },
      {
        q: 'How does compounding frequency affect my returns?',
        a: 'More frequent compounding produces a slightly higher balance for the same nominal rate, because interest is added back sooner and starts earning more quickly. Daily compounding beats monthly, which beats quarterly and annual, though the gaps are usually modest.',
      },
      {
        q: 'What is continuous compounding?',
        a: 'Continuous compounding is the theoretical limit where interest is added an infinite number of times per year, using the formula A = Pe^(rt). It produces the maximum possible growth for a given rate and is a useful benchmark, even though real accounts compound at fixed intervals.',
      },
      {
        q: 'Why does the calculator show an inflation-adjusted value?',
        a: 'Nominal growth overstates how much richer you really become because prices rise over time. The inflation-adjusted (real) value translates your future balance into today’s purchasing power, giving a more honest picture of what your investment will be worth.',
      },
      {
        q: 'Do monthly contributions make a big difference?',
        a: 'Yes — adding money regularly can dwarf the effect of your initial principal over long horizons. Each contribution compounds from the day it is invested, so consistent monthly investing combined with time is one of the most reliable ways to build wealth.',
      },
    ],
  },

  'debt-payoff': {
    slug: 'debt-payoff',
    path: '/calculators/debt-payoff',
    name: 'Debt Payoff Calculator',
    title: 'Debt Payoff Calculator – Snowball vs Avalanche',
    description:
      'Free debt payoff calculator comparing the debt snowball and debt avalanche methods. Find your debt-free date and see how extra payments save interest and time.',
    keywords: [
      'debt payoff calculator',
      'debt snowball calculator',
      'debt avalanche calculator',
      'snowball vs avalanche',
      'debt-free date',
      'multiple debt payoff planner',
      'extra payment strategy',
      'pay off debt faster',
    ],
    accent: 'electric-blue',
    guideHeading: 'Understanding Debt Payoff Strategies',
    intro:
      'A debt payoff calculator maps every balance, rate and minimum payment into a single plan — then shows whether the snowball or avalanche method gets you debt-free sooner and cheaper.',
    sections: [
      {
        heading: 'How the debt payoff calculator works',
        body: [
          'List each debt with its balance, interest rate and minimum payment, then add any extra amount you can put toward debt every month. The calculator pays all minimums, funnels the extra toward one target debt, and rolls freed-up payments forward as each balance is cleared.',
          'It then projects your debt-free date and total interest for both popular strategies so you can compare them side by side instead of guessing.',
        ],
      },
      {
        heading: 'Debt snowball vs debt avalanche',
        body: [
          'The debt snowball attacks the smallest balance first, regardless of rate, to deliver quick wins and motivation. Each time a debt disappears, its payment is added to the next-smallest balance.',
          'The debt avalanche instead targets the highest interest rate first, which mathematically minimizes total interest and usually clears all debt fastest. The trade-off is that the first payoff may take longer, testing your persistence.',
        ],
      },
      {
        heading: 'Which strategy should you choose?',
        body: [
          'If staying motivated is your biggest challenge, the snowball’s early wins can keep you on track. If you want to pay the least interest and reach your debt-free date soonest, the avalanche usually wins.',
          'The difference in cost is often small, so the best method is the one you will actually stick with. This planner shows both outcomes so you can decide with real numbers.',
        ],
      },
      {
        heading: 'Tips for paying off multiple debts faster',
        body: [
          'Find extra money by trimming recurring expenses and direct every spare dollar to your target debt while paying minimums on the rest. Avoid adding new balances while you pay down the old ones.',
          'Whenever you clear a debt, keep your total monthly payment the same and roll it onto the next balance — that compounding momentum is what makes both the snowball and avalanche so effective.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the difference between the debt snowball and debt avalanche?',
        a: 'The debt snowball pays off the smallest balance first for fast psychological wins, while the debt avalanche pays off the highest interest rate first to minimize total interest. Both keep all minimum payments current and roll each cleared payment onto the next debt.',
      },
      {
        q: 'Which debt payoff method saves the most money?',
        a: 'The debt avalanche almost always saves the most interest and reaches a debt-free date soonest, because it eliminates your most expensive debt first. The snowball can cost slightly more but often wins on motivation, which matters if it keeps you committed.',
      },
      {
        q: 'How is my debt-free date calculated?',
        a: 'The calculator simulates month by month: it charges interest, applies your minimum payments plus any extra to the target debt, and advances until every balance reaches zero. The month that happens is your projected debt-free date for each strategy.',
      },
      {
        q: 'Should I pay more than the minimum payment?',
        a: 'Yes. Minimum payments are designed to keep you in debt for years while interest accrues. Every extra dollar goes straight to principal, lowering future interest and pulling your debt-free date closer — the tool shows exactly how much sooner.',
      },
      {
        q: 'Can I plan payoff for several debts at once?',
        a: 'Absolutely. Add as many debts as you have, each with its own balance, APR and minimum. The planner coordinates payments across all of them, applying your chosen strategy and rolling freed-up cash forward as balances are cleared.',
      },
      {
        q: 'Does consolidating debt change the strategy?',
        a: 'Consolidation can lower your average rate and simplify payments, but the same principles apply: keep paying aggressively and avoid new debt. Use the calculator to compare your current plan against a single consolidated balance before deciding.',
      },
    ],
  },

  'business-loan': {
    slug: 'business-loan',
    path: '/calculators/business-loan',
    name: 'Business Loan Calculator',
    title: 'Business Loan Calculator – SBA, Term & LOC',
    description:
      'Free business loan calculator for SBA 7(a), term loans and lines of credit. Estimate monthly payments, APR with origination fees and your full amortization schedule.',
    keywords: [
      'business loan calculator',
      'SBA loan calculator',
      'SBA 7(a) calculator',
      'business line of credit calculator',
      'term loan calculator',
      'commercial loan calculator',
      'origination fee APR',
      'APR with fees',
      'balloon payment calculator',
      'amortization schedule',
    ],
    accent: 'vivid-purple',
    guideHeading: 'Understanding Business Loans',
    intro:
      'A business loan calculator reveals the true cost of financing — not just the monthly payment, but the APR once origination fees, term length and structure are factored in across SBA loans, term loans and lines of credit.',
    sections: [
      {
        heading: 'How the business loan calculator works',
        body: [
          'Choose a loan type, then enter the amount, interest rate, term and any origination fee. The calculator computes your monthly payment, total interest, net proceeds after fees and the effective APR — the rate that actually reflects what you pay.',
          'Comparing scenarios side by side helps you see why the headline interest rate alone never tells the whole story for commercial financing.',
        ],
      },
      {
        heading: 'SBA loans, term loans and lines of credit',
        body: [
          'An SBA 7(a) loan is partially guaranteed by the Small Business Administration, typically offering longer terms and competitive rates for qualifying businesses. A conventional term loan provides a lump sum repaid over a fixed schedule.',
          'A business line of credit works more like a credit card: you draw what you need, pay interest only on the balance, and reuse the limit as you repay. Each structure suits different cash-flow needs.',
        ],
      },
      {
        heading: 'Origination fees, APR and balloon payments',
        body: [
          'Origination fees are charged upfront and reduce the cash you actually receive, which raises your effective APR above the stated interest rate. The APR-with-fees figure lets you compare offers on an apples-to-apples basis.',
          'Some commercial loans end with a balloon payment — a large lump sum due at the end of the term after smaller regular payments. Plan ahead for it, because refinancing or paying it off requires a strategy.',
        ],
      },
      {
        heading: 'Tips for financing your business',
        body: [
          'Always compare the total cost and APR with fees, not just the monthly payment, and match the loan term to the useful life of what you are financing. Short-term needs rarely justify long-term debt.',
          'Keep your debt-service coverage healthy so payments never strangle cash flow, and read the fine print for prepayment penalties, variable-rate clauses and balloon terms before signing.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is an SBA 7(a) loan?',
        a: 'An SBA 7(a) loan is a small-business loan partially guaranteed by the U.S. Small Business Administration. That guarantee lowers lender risk, which can mean longer repayment terms and competitive rates for eligible businesses, though approval requires meeting SBA criteria and documentation.',
      },
      {
        q: 'How does APR differ from the interest rate on a business loan?',
        a: 'The interest rate is the cost of borrowing the principal, while the APR also folds in origination fees and other charges, expressed as an annualized rate. Because fees reduce the cash you receive, the APR is higher than the stated rate and is the better number for comparing offers.',
      },
      {
        q: 'How do origination fees affect my loan?',
        a: 'Origination fees are deducted upfront, so you receive less than the loan amount but still repay the full principal plus interest. This raises your effective APR. The calculator shows your net proceeds after fees alongside the true cost of the financing.',
      },
      {
        q: 'What is a balloon payment?',
        a: 'A balloon payment is a large lump sum due at the end of a loan term after a series of smaller payments. It lowers the regular payment but requires you to have cash, a refinance, or a payoff plan ready when the balloon comes due.',
      },
      {
        q: 'Should I choose a term loan or a line of credit?',
        a: 'A term loan suits a one-time investment repaid over a fixed schedule, while a line of credit fits recurring or unpredictable working-capital needs because you borrow and repay flexibly and pay interest only on what you draw. Match the structure to how you will actually use the funds.',
      },
      {
        q: 'How much can my business afford to borrow?',
        a: 'A common guideline is to keep total debt payments comfortably below your operating cash flow so a slow month never threatens repayment. Model the monthly payment here against your revenue and existing obligations before committing to a loan amount.',
      },
    ],
  },

  'credit-card-payoff': {
    slug: 'credit-card-payoff',
    path: '/calculators/credit-card-payoff',
    name: 'Credit Card Payoff Calculator',
    title: 'Credit Card Payoff Calculator – Interest & Time',
    description:
      'Free credit card payoff calculator. See how long to pay off your card, total interest, the minimum payment trap, and how paying more clears your balance faster.',
    keywords: [
      'credit card payoff calculator',
      'credit card minimum payment calculator',
      'how long to pay off credit card',
      'credit card interest calculator',
      'pay off credit card faster',
      'minimum payment trap',
      'credit card payoff in months',
    ],
    accent: 'electric-pink',
    guideHeading: 'Understanding Credit Card Payoff',
    intro:
      'A credit card payoff calculator shows the real cost of carrying a balance — how long minimum payments keep you in debt, how much interest you pay, and how quickly a higher payment sets you free.',
    sections: [
      {
        heading: 'How the credit card payoff calculator works',
        body: [
          'Enter your balance, APR and a payment plan — minimum only, a fixed monthly amount, or a target payoff date. The calculator charges interest each month, subtracts your payment, and counts the months until the balance hits zero, along with the total interest paid.',
          'Comparing those scenarios side by side makes the cost of slow repayment impossible to ignore.',
        ],
      },
      {
        heading: 'How credit card interest is calculated',
        body: [
          'Credit cards typically charge interest daily based on your annual percentage rate divided by 365, applied to your balance. Carry a balance and that interest compounds, so unpaid interest itself starts accruing interest the next cycle.',
          'Because the rate is high relative to most loans, even a moderate balance can generate substantial interest if it lingers.',
        ],
      },
      {
        heading: 'The minimum payment trap',
        body: [
          'Minimum payments are usually a small percentage of the balance, often just enough to cover interest plus a sliver of principal. Paying only the minimum can stretch repayment over many years and cost more in interest than the original purchases.',
          'As your balance falls, the minimum falls too, which slows progress further — the trap that keeps revolving balances alive for so long.',
        ],
      },
      {
        heading: 'Tips to pay off your credit card faster',
        body: [
          'Pay a fixed amount well above the minimum every month so more goes to principal each cycle, and avoid new charges while you pay the balance down. A balance-transfer offer or lower-rate option can reduce interest if used carefully.',
          'Set a target payoff date and let the calculator tell you the monthly payment required to hit it — a concrete goal is far easier to stick to than “as much as I can.”',
        ],
      },
    ],
    faqs: [
      {
        q: 'How long will it take to pay off my credit card?',
        a: 'It depends on your balance, APR and monthly payment. Paying only the minimum can take many years, while a fixed payment above the minimum dramatically shortens the timeline. Enter your numbers above to see the exact number of months for each approach.',
      },
      {
        q: 'Why is paying only the minimum so expensive?',
        a: 'Minimum payments are calculated as a small percentage of the balance, so most of each payment covers interest and barely touches the principal. As the balance shrinks, the minimum shrinks too, dragging out repayment for years and multiplying the total interest you pay.',
      },
      {
        q: 'How is credit card interest calculated?',
        a: 'Most issuers use a daily periodic rate — your APR divided by 365 — applied to your balance each day, then charged monthly. Unpaid interest is added to the balance and itself accrues interest, which is why carrying a balance compounds the cost.',
      },
      {
        q: 'What is the fastest way to pay off a credit card?',
        a: 'Pay as much as you can above the minimum each month, stop adding new charges, and consider a lower-rate balance transfer if you qualify. Setting a fixed payment or a target payoff date keeps you on a steady, predictable schedule.',
      },
      {
        q: 'Does my APR change how fast I can pay off the balance?',
        a: 'Yes. A higher APR means more of each payment goes to interest instead of principal, slowing your progress and raising the total cost. Lowering your rate — or paying more each month to outrun the interest — both speed up payoff.',
      },
      {
        q: 'Should I pay off my credit card or save first?',
        a: 'High credit card interest usually outpaces what savings can earn, so paying down the card often gives the best guaranteed return. Keeping a small emergency buffer is wise, but beyond that, aggressively clearing high-rate card debt is typically the smarter move.',
      },
    ],
  },

  sip: {
    slug: 'sip',
    path: '/calculators/sip',
    name: 'SIP Calculator',
    title: 'SIP Calculator – Step-Up, Lumpsum & Returns',
    description:
      'Free SIP calculator for systematic investment plans. Estimate SIP returns, maturity value, step-up SIP and lumpsum growth for your mutual fund investment goals.',
    keywords: [
      'SIP calculator',
      'step up SIP calculator',
      'lumpsum calculator',
      'mutual fund calculator',
      'SIP returns calculator',
      'goal-based SIP',
      'SIP with inflation',
      'systematic investment plan',
      'SIP maturity value',
    ],
    accent: 'neon-green',
    guideHeading: 'Understanding SIP Investing',
    intro:
      'A SIP calculator projects how regular, disciplined investing compounds into wealth. Model a systematic investment plan, a step-up SIP or a one-time lumpsum and see the maturity value for your goals.',
    sections: [
      {
        heading: 'How the SIP calculator works',
        body: [
          'A systematic investment plan (SIP) invests a fixed amount at regular intervals. Enter your monthly contribution, an expected annual return and a time horizon, and the calculator projects the maturity value, total invested and estimated returns.',
          'You can also model a step-up SIP that raises your contribution each year, a lumpsum one-time investment, or work backward from a goal to find the monthly amount you need.',
        ],
      },
      {
        heading: 'The SIP maturity formula',
        body: [
          'For level monthly investing, the future value is M = P · (((1 + i)^n − 1) / i) · (1 + i), where P is the monthly investment, i is the periodic return (annual return ÷ 12) and n is the number of installments.',
          'Because each installment compounds for the remaining months, early contributions do the heaviest lifting — another reason starting sooner beats investing more later.',
        ],
      },
      {
        heading: 'Step-up SIP, lumpsum and goal planning',
        body: [
          'A step-up SIP increases your contribution by a set percentage each year, usually in step with rising income, which can dramatically boost the final corpus. A lumpsum invests a single amount upfront and compounds for the full horizon.',
          'Goal-based planning flips the question: tell the calculator the corpus you want and when you need it, and it solves for the monthly SIP required to get there.',
        ],
      },
      {
        heading: 'Tips for systematic investing',
        body: [
          'Stay invested through market ups and downs so rupee-cost averaging works in your favor, and step up your SIP as your income grows to keep the corpus compounding faster than inflation.',
          'Returns are estimates, not guarantees — actual mutual fund performance varies. Consider an inflation-adjusted view to understand what your maturity value will really buy in the future.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is a SIP?',
        a: 'A systematic investment plan (SIP) is a way of investing a fixed amount at regular intervals — usually monthly — into a mutual fund. It enforces discipline, spreads your purchases across market cycles (rupee-cost averaging), and harnesses compounding over time.',
      },
      {
        q: 'How is SIP maturity value calculated?',
        a: 'The calculator uses the future-value-of-a-series formula: M = P · (((1 + i)^n − 1) / i) · (1 + i), where P is the monthly investment, i is the monthly return and n is the number of installments. Each contribution compounds for the months it stays invested.',
      },
      {
        q: 'What is a step-up SIP?',
        a: 'A step-up SIP increases your monthly contribution by a fixed percentage each year, typically to match salary growth. Because the larger later contributions still have years to compound, even a modest annual step-up can significantly increase your final corpus.',
      },
      {
        q: 'SIP or lumpsum — which is better?',
        a: 'A lumpsum can outperform if invested at the right time because the full amount compounds from day one, but it carries timing risk. A SIP spreads risk across market cycles and suits investors building wealth from regular income. The calculator lets you compare both.',
      },
      {
        q: 'Are SIP returns guaranteed?',
        a: 'No. SIPs invest in market-linked mutual funds, so returns fluctuate and are not guaranteed. The calculator uses an assumed annual return to project a likely outcome, but actual results depend on fund performance. Treat the maturity value as an estimate, not a promise.',
      },
      {
        q: 'How does inflation affect my SIP returns?',
        a: 'Inflation reduces the future purchasing power of your corpus, so a nominal maturity value overstates real wealth. Viewing an inflation-adjusted figure shows what your investment will actually be worth in today’s terms and helps you set realistic goals.',
      },
    ],
  },

  retirement: {
    slug: 'retirement',
    path: '/calculators/retirement',
    name: 'Retirement Calculator',
    title: 'Retirement Calculator – 401k, Nest Egg & 4% Rule',
    description:
      'Free retirement calculator to find how much you need to retire. Project your 401k and nest egg, apply the 4% rule, and see when you can retire comfortably.',
    keywords: [
      'retirement calculator',
      'how much do I need to retire',
      '401k calculator',
      'retirement savings calculator',
      '4% rule',
      'nest egg calculator',
      'when can I retire',
      'retirement planning',
    ],
    accent: 'neon-green',
    guideHeading: 'Understanding Retirement Planning',
    intro:
      'A retirement calculator answers the big question — how much do I need to retire? Project your nest egg from current savings and contributions, then test it against the income you want and the 4% rule.',
    sections: [
      {
        heading: 'How the retirement calculator works',
        body: [
          'Enter your current age, planned retirement age, existing savings, monthly contributions and an expected return. The calculator compounds your savings to retirement, projects the nest egg you will have, and compares it with the corpus needed to fund your desired income.',
          'It also estimates how long your money lasts, so you can see whether your current plan keeps you on track or needs a bigger contribution.',
        ],
      },
      {
        heading: 'How much do you need to retire?',
        body: [
          'A common starting point is the 4% rule: you can withdraw about 4% of your nest egg in the first year of retirement, then adjust for inflation, with a reasonable chance the money lasts roughly 30 years. That implies a target of about 25 times your annual spending.',
          'Your real number depends on lifestyle, life expectancy, other income such as Social Security or a pension, and how conservative you want to be — so treat the 4% rule as a guideline, not gospel.',
        ],
      },
      {
        heading: '401(k)s, compounding and the nest egg',
        body: [
          'Tax-advantaged accounts like a 401(k) supercharge retirement saving, especially when an employer match effectively adds free money to every contribution. Decades of compounding turn steady contributions into the bulk of your eventual nest egg.',
          'Because growth compounds, the early years matter most — money invested in your twenties and thirties has the longest runway to multiply before you retire.',
        ],
      },
      {
        heading: 'Tips to retire comfortably',
        body: [
          'Contribute enough to capture any full employer match, increase contributions as your income rises, and revisit your plan regularly as goals and markets change. Small increases early compound into large differences later.',
          'Stress-test your plan against lower returns and higher inflation, and remember that delaying retirement even a few years both grows the nest egg and shortens the period it must support.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much money do I need to retire?',
        a: 'A widely used rule of thumb is roughly 25 times your expected annual spending, which pairs with the 4% withdrawal rule. The exact figure depends on your lifestyle, life expectancy, inflation and other income sources, so use the calculator to model your own situation.',
      },
      {
        q: 'What is the 4% rule?',
        a: 'The 4% rule suggests that withdrawing about 4% of your portfolio in your first year of retirement, then adjusting that amount for inflation each year, gives a reasonable chance your savings last around 30 years. It is a planning guideline, not a guarantee, and may need adjusting for your circumstances.',
      },
      {
        q: 'How does a 401(k) help me retire?',
        a: 'A 401(k) is a tax-advantaged retirement account, often with an employer match that adds free money to your contributions. Combined with decades of compounding growth, consistent 401(k) contributions typically form the core of a retirement nest egg.',
      },
      {
        q: 'When can I retire?',
        a: 'You can retire once your projected nest egg can sustainably fund your desired income — commonly when savings reach about 25 times annual expenses. The calculator compares your projected corpus with the corpus needed so you can see whether your target retirement age is realistic.',
      },
      {
        q: 'Why does starting early matter so much?',
        a: 'Because returns compound, money invested earlier has more years to grow and earn returns on its returns. Saving in your twenties and thirties can contribute far more to your final nest egg than larger contributions made closer to retirement.',
      },
      {
        q: 'Should I account for inflation in my retirement plan?',
        a: 'Yes. Inflation steadily reduces purchasing power, so a nest egg that looks large in nominal terms buys less decades from now. Planning with realistic inflation and return assumptions — and revisiting them over time — keeps your retirement goal grounded.',
      },
    ],
  },

  'workers-compensation': {
    slug: 'workers-compensation',
    path: '/calculators/workers-compensation',
    name: "Workers' Compensation Settlement Calculator",
    title: "Workers' Comp Settlement Calculator – Payout",
    description:
      "Free workers' compensation settlement calculator. Estimate your payout from average weekly wage, state comp rates and caps, impairment rating, future medical, attorney fees and liens.",
    keywords: [
      'workers comp settlement calculator',
      'workers compensation settlement calculator',
      'workers comp payout calculator',
      'permanent impairment rating calculator',
      'PPD settlement calculator',
      'average weekly wage calculator',
      'workers comp body part schedule',
      'lump sum vs structured settlement',
      'workers comp attorney fees',
      'temporary total disability calculator',
    ],
    accent: 'vivid-purple',
    guideHeading: "Understanding Your Workers' Comp Settlement",
    intro:
      "Estimate your workers' compensation settlement the way adjusters and attorneys build it — from average weekly wage and state comp rates to impairment ratings, future medical, fees and liens.",
    // On-page educational content already lives on the workers-comp page itself,
    // so we keep `sections` empty here and only reuse the FAQ for FAQPage JSON-LD.
    sections: [],
    faqs: [
      {
        q: 'How accurate is this workers’ comp settlement calculator?',
        a: 'It produces an educated estimate using the same building blocks adjusters and attorneys use — average weekly wage, the two-thirds comp rate, state caps, body-part schedules, impairment ratings, future medical, fees and liens. Real settlements still hinge on medical evidence, disputed facts, your state’s exact statutes and negotiation, so treat the number as a starting point, not a promise.',
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
    ],
  },
};

/** Stable, ordered list of slugs (home-page order). */
export const CALCULATOR_SLUGS: string[] = [
  'personal-loan',
  'compound-interest',
  'debt-payoff',
  'business-loan',
  'credit-card-payoff',
  'sip',
  'retirement',
  'workers-compensation',
];

/** Look up a calculator by slug. Throws on unknown slug to surface mistakes early. */
export function getCalculator(slug: string): CalculatorSeo {
  const calc = CALCULATORS[slug];
  if (!calc) {
    throw new Error(`Unknown calculator slug: ${slug}`);
  }
  return calc;
}

/* ----------------------------- metadata builders ----------------------------- */

/** Build per-page Metadata (title, description, keywords, canonical, OG, Twitter). */
export function buildMetadata(slug: string): Metadata {
  const calc = getCalculator(slug);
  const url = `${SITE_URL}${calc.path}`;
  return {
    title: calc.title,
    description: calc.description,
    keywords: calc.keywords,
    alternates: {
      canonical: calc.path,
    },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      title: calc.title,
      description: calc.description,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: calc.title,
      description: calc.description,
    },
  };
}

/* ----------------------------- JSON-LD builders ----------------------------- */

/** SoftwareApplication structured data for a calculator (free finance web app). */
export function softwareApplicationLd(slug: string): JsonLdObject {
  const calc = getCalculator(slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: calc.name,
    description: calc.description,
    url: `${SITE_URL}${calc.path}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/** BreadcrumbList structured data: Home → Calculator. */
export function breadcrumbLd(slug: string): JsonLdObject {
  const calc = getCalculator(slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: calc.name,
        item: `${SITE_URL}${calc.path}`,
      },
    ],
  };
}

/** FAQPage structured data built from the calculator's FAQ list. */
export function faqPageLd(slug: string): JsonLdObject {
  const calc = getCalculator(slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: calc.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

/** Site-level WebSite structured data. */
export function websiteLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'en-US',
  };
}

/** Site-level Organization structured data. */
export function organizationLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  };
}
