import type { BlogPost } from './types';

const MODIFIED = '2026-06-07';

export const personalFinancePosts: BlogPost[] = [
  {
    slug: '50-30-20-budget-rule-explained',
    title: 'The 50/30/20 Budget Rule, Explained (With Examples)',
    metaTitle: 'The 50/30/20 Budget Rule Explained',
    metaDescription:
      'The 50/30/20 rule splits your after-tax income into needs, wants and savings. Learn how to apply it, real examples, and how to adapt it when money is tight.',
    excerpt:
      'Spend 50% on needs, 30% on wants, and 20% on savings and debt. It’s the simplest budgeting framework that actually sticks — here’s how to make it work.',
    keywords: [
      '50/30/20 rule',
      '50 30 20 budget',
      'budgeting rule',
      'how to budget',
      'needs wants savings',
      'budget percentages',
      'budget calculator',
    ],
    category: 'Personal Finance',
    tags: ['budgeting', 'saving', 'money management'],
    author: 'The FrankCalculator Team',
    datePublished: '2026-04-29',
    dateModified: MODIFIED,
    readingTime: 7,
    accent: 'accent-cyan',
    emoji: '🧩',
    relatedCalculators: ['debt-payoff', 'compound-interest'],
    relatedPosts: [
      'how-to-build-an-emergency-fund',
      'how-to-get-out-of-debt-fast',
      'good-debt-vs-bad-debt',
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Most budgets fail because they are too complicated. The **50/30/20 rule** survives because it is dead simple: split your after-tax income into three buckets — 50% for needs, 30% for wants, and 20% for savings and debt — without tracking every coffee. It is a framework, not a straitjacket, and that is exactly why it works.',
      },
      {
        type: 'takeaways',
        items: [
          'Allocate 50% of take-home pay to needs, 30% to wants, 20% to savings and debt.',
          'It uses after-tax (net) income, not gross.',
          'The simplicity makes it sustainable for most people.',
          'Adjust the ratios when your situation demands it.',
        ],
      },
      {
        type: 'heading',
        text: 'The three buckets',
      },
      {
        type: 'list',
        items: [
          '**50% Needs:** essentials you cannot skip — housing, utilities, groceries, transportation, insurance, minimum debt payments.',
          '**30% Wants:** lifestyle choices — dining out, streaming, travel, hobbies, upgrades.',
          '**20% Savings & debt:** emergency fund, retirement contributions, investments, and extra debt payments beyond the minimums.',
        ],
      },
      {
        type: 'heading',
        text: 'A quick example',
      },
      {
        type: 'paragraph',
        text: 'Say your take-home pay is $4,000 a month. The 50/30/20 split gives you **$2,000 for needs, $1,200 for wants, and $800 for savings and debt.** If your needs exceed $2,000, that is a signal your fixed costs are high relative to income — useful information in itself.',
      },
      {
        type: 'stats',
        items: [
          { value: '$2,000', label: 'Needs (50%)' },
          { value: '$1,200', label: 'Wants (30%)' },
          { value: '$800', label: 'Savings & debt (20%)' },
          { value: '$4,000', label: 'Take-home pay' },
        ],
      },
      {
        type: 'callout',
        title: 'Use net, not gross',
        text: 'The rule applies to after-tax income — the money that actually hits your account. Budgeting off gross income overstates what you have to work with.',
      },
      {
        type: 'heading',
        text: 'When to adapt the ratios',
      },
      {
        type: 'paragraph',
        text: 'The 50/30/20 split is a starting point, not a law. In high-cost areas, needs may eat well over 50%, leaving less for wants. If you are aggressively paying off debt or chasing an early-retirement goal, you might flip toward something like 50/20/30 in favor of savings. The point is to be intentional about where every dollar goes.',
      },
      {
        type: 'calculatorCta',
        slug: 'debt-payoff',
        heading: 'Put your 20% to work',
        text: 'If part of your 20% is attacking debt, our Debt Payoff Calculator shows how much faster a consistent extra payment makes you debt-free.',
      },
      {
        type: 'heading',
        text: 'Make the 20% automatic',
      },
      {
        type: 'paragraph',
        text: 'The savings bucket is where wealth is built, so protect it. Automate transfers to savings and investments the day you get paid, before lifestyle creep claims the money. Direct the rest toward an [emergency fund](/blog/how-to-build-an-emergency-fund) and high-interest debt. To watch your savings compound over time, try the [Compound Interest Calculator](/calculators/compound-interest).',
      },
    ],
    faqs: [
      {
        q: 'What is the 50/30/20 rule?',
        a: 'The 50/30/20 rule is a budgeting framework that allocates 50% of your after-tax income to needs, 30% to wants, and 20% to savings and debt repayment. Its simplicity makes it easy to follow and sustain.',
      },
      {
        q: 'Does the 50/30/20 rule use gross or net income?',
        a: 'It uses net, after-tax income — the money that actually lands in your account. Budgeting from gross income overstates what you have available and can throw off all three buckets.',
      },
      {
        q: 'What counts as a need versus a want?',
        a: 'Needs are essentials you cannot skip: housing, utilities, groceries, transportation, insurance and minimum debt payments. Wants are lifestyle choices like dining out, streaming, travel and hobbies. Savings and extra debt payments form the third bucket.',
      },
      {
        q: 'Can I adjust the 50/30/20 percentages?',
        a: 'Yes. The ratios are a starting point. In high-cost areas, needs may exceed 50%, and if you are aggressively saving or paying off debt, you might increase the savings bucket. The goal is to allocate every dollar intentionally.',
      },
      {
        q: 'What should I do with the 20% savings bucket?',
        a: 'Use it to build an emergency fund, contribute to retirement, invest, and make extra payments on high-interest debt. Automating these transfers on payday helps protect the bucket from everyday spending.',
      },
    ],
  },

  {
    slug: 'how-to-build-an-emergency-fund',
    title: 'How to Build an Emergency Fund (and How Much You Need)',
    metaTitle: 'How to Build an Emergency Fund',
    metaDescription:
      'How much emergency fund you need, where to keep it, and how to build one fast — even on a tight budget or while paying off debt. Start with a clear savings target.',
    excerpt:
      'An emergency fund is the buffer that keeps a bad month from becoming a debt spiral. Here’s how much to save, where to keep it, and how to build it step by step.',
    keywords: [
      'how to build an emergency fund',
      'emergency fund',
      'how much emergency fund',
      'emergency savings',
      'where to keep emergency fund',
      'starter emergency fund',
      'high yield savings',
    ],
    category: 'Personal Finance',
    tags: ['emergency fund', 'saving', 'financial security'],
    author: 'The FrankCalculator Team',
    datePublished: '2026-05-02',
    dateModified: MODIFIED,
    readingTime: 8,
    accent: 'accent-cyan',
    emoji: '🛟',
    relatedCalculators: ['compound-interest', 'debt-payoff'],
    relatedPosts: [
      '50-30-20-budget-rule-explained',
      'how-to-pay-off-debt-on-low-income',
      'good-debt-vs-bad-debt',
    ],
    content: [
      {
        type: 'paragraph',
        text: 'An **emergency fund** is the single most important foundation in personal finance. It is the cash buffer that absorbs life’s shocks — a job loss, a car repair, a medical bill — without forcing you onto high-interest credit cards. With surveys showing many people cannot cover even a $1,000 surprise, building this buffer is the first real step toward financial security.',
      },
      {
        type: 'takeaways',
        items: [
          'Aim for 3–6 months of essential expenses, built in stages.',
          'Start with a small starter fund (around $1,000) before anything else.',
          'Keep it accessible but separate — a high-yield savings account is ideal.',
          'Automate contributions so the fund grows without willpower.',
        ],
      },
      {
        type: 'heading',
        text: 'How much do you need?',
      },
      {
        type: 'paragraph',
        text: 'The classic guidance is **three to six months of essential expenses** — rent or mortgage, utilities, food, insurance, minimums. Add up what you truly must spend each month and multiply. If your essentials are $3,000/month, a three-month fund is $9,000 and a six-month fund is $18,000. With the rising cost of living, many experts now lean toward the higher end of that range.',
      },
      {
        type: 'heading',
        text: 'Build it in stages',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Starter fund:** save about $1,000 (or one month of bare essentials) as fast as possible.',
          '**One month:** extend the buffer to a full month of essential expenses.',
          '**Full fund:** work steadily toward 3–6 months while balancing other goals.',
        ],
      },
      {
        type: 'callout',
        title: 'Save while paying off debt',
        text: 'It feels backward, but keep a small emergency fund even while attacking debt. Without it, the next surprise expense goes on a credit card and undoes your progress.',
      },
      {
        type: 'heading',
        text: 'Where to keep your emergency fund',
      },
      {
        type: 'paragraph',
        text: 'Your emergency fund needs to be **safe and accessible**, not invested in the stock market where its value could drop right when you need it. A **high-yield savings account** is the sweet spot: separate from your checking account (so you are not tempted to spend it), federally insured, and earning interest while it waits. Avoid locking it in long-term products you cannot tap quickly.',
      },
      {
        type: 'calculatorCta',
        slug: 'compound-interest',
        heading: 'Watch your savings grow',
        text: 'Use our Compound Interest Calculator to see how monthly contributions to a high-yield account add up — and how interest helps your buffer grow.',
      },
      {
        type: 'heading',
        text: 'How to build it faster',
      },
      {
        type: 'list',
        items: [
          'Automate a fixed transfer to the fund every payday.',
          'Funnel windfalls — tax refunds, bonuses, gifts — straight into it.',
          'Temporarily trim "wants" from your budget and redirect the savings.',
          'Sell unused items for a quick boost.',
        ],
      },
      {
        type: 'heading',
        text: 'After it is funded',
      },
      {
        type: 'paragraph',
        text: 'Once your emergency fund is complete, redirect that monthly contribution toward debt payoff or investing. The discipline you built saving it transfers directly to building wealth. Pair this with the [50/30/20 budget](/blog/50-30-20-budget-rule-explained) to keep your savings rate steady, and if you are also carrying balances, the [Debt Payoff Calculator](/calculators/debt-payoff) helps you sequence both goals.',
      },
    ],
    faqs: [
      {
        q: 'How much should I have in an emergency fund?',
        a: 'A common target is three to six months of essential expenses. Add up your must-pay monthly costs and multiply. With rising living costs, many people aim toward the higher end, while those with less stable income may want an even larger buffer.',
      },
      {
        q: 'Where should I keep my emergency fund?',
        a: 'Keep it somewhere safe and accessible, such as a high-yield savings account that is separate from your checking account. Avoid investing it in the stock market or locking it in products you cannot tap quickly, since you may need it on short notice.',
      },
      {
        q: 'Should I build an emergency fund or pay off debt first?',
        a: 'Build a small starter fund of around $1,000 first, then attack high-interest debt while maintaining that buffer. Without any emergency savings, the next surprise expense often lands on a credit card and reverses your debt progress.',
      },
      {
        q: 'How do I build an emergency fund fast?',
        a: 'Automate a fixed transfer every payday, funnel windfalls like tax refunds and bonuses straight into the fund, temporarily cut discretionary spending, and sell unused items. Consistency plus the occasional lump sum builds the buffer quickly.',
      },
      {
        q: 'What counts as a real emergency?',
        a: 'A genuine emergency is an unexpected, necessary expense — job loss, urgent medical care, essential car or home repairs. Planned or discretionary spending does not qualify; keeping the fund strictly for true emergencies preserves its purpose.',
      },
    ],
  },

  {
    slug: 'good-debt-vs-bad-debt',
    title: 'Good Debt vs Bad Debt: How to Tell the Difference',
    metaTitle: 'Good Debt vs Bad Debt Explained',
    metaDescription:
      'Not all debt is equal. Learn the difference between good debt and bad debt, when borrowing builds wealth, when it destroys it, and how to manage both wisely.',
    excerpt:
      'Some debt builds wealth; some quietly drains it. Here’s how to tell good debt from bad — and what to do when you’re carrying the expensive kind.',
    keywords: [
      'good debt vs bad debt',
      'what is good debt',
      'bad debt',
      'types of debt',
      'is all debt bad',
      'managing debt',
      'high interest debt',
    ],
    category: 'Personal Finance',
    tags: ['debt', 'borrowing', 'money management'],
    author: 'The FrankCalculator Team',
    datePublished: '2026-05-27',
    dateModified: MODIFIED,
    readingTime: 7,
    accent: 'accent-cyan',
    emoji: '⚖️',
    relatedCalculators: ['debt-payoff', 'personal-loan'],
    relatedPosts: [
      'how-to-get-out-of-debt-fast',
      'apr-vs-interest-rate-explained',
      '50-30-20-budget-rule-explained',
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Debt has a bad reputation, but the truth is more nuanced. Some debt is a tool that helps you build wealth or earning power; other debt quietly drains your finances. Learning to tell **good debt from bad debt** changes how you borrow — and how quickly you prioritize paying things off.',
      },
      {
        type: 'takeaways',
        items: [
          'Good debt tends to build value or income over time and carries lower rates.',
          'Bad debt funds depreciating things or consumption at high interest.',
          'The interest rate and what the money buys are the key tests.',
          'When in doubt, attack high-interest debt first.',
        ],
      },
      {
        type: 'heading',
        text: 'What makes debt "good"?',
      },
      {
        type: 'paragraph',
        text: 'Good debt generally helps you acquire something that **grows in value or increases your income**, usually at a relatively low interest rate. Classic examples include a mortgage (real estate that may appreciate), student loans (higher earning potential), or a business loan that generates returns. The borrowing is an investment in a future payoff.',
      },
      {
        type: 'heading',
        text: 'What makes debt "bad"?',
      },
      {
        type: 'paragraph',
        text: 'Bad debt typically funds things that **lose value or are consumed**, often at high interest. High-interest credit card balances, payday loans, and financing for rapidly depreciating purchases fall here. The hallmark of bad debt is that you keep paying for something long after its value — or the enjoyment of it — is gone.',
      },
      {
        type: 'stats',
        items: [
          { value: 'Builds value', label: 'Good debt' },
          { value: 'Drains value', label: 'Bad debt' },
          { value: 'Lower rate', label: 'Good debt' },
          { value: 'High rate', label: 'Bad debt' },
        ],
      },
      {
        type: 'callout',
        title: 'The nuance',
        text: 'Even "good" debt becomes bad if the payments strain your budget or the rate is high. And a low-rate loan for something sensible can be perfectly reasonable. Context matters as much as category.',
      },
      {
        type: 'heading',
        text: 'Two quick tests',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**What does the money buy?** An appreciating asset or higher income leans good; consumption or a depreciating item leans bad.',
          '**What is the interest rate?** Low rates are easier to justify; high rates (like credit cards) are a red flag almost regardless of purpose.',
        ],
      },
      {
        type: 'calculatorCta',
        slug: 'debt-payoff',
        heading: 'Prioritize the expensive debt',
        text: 'List your debts in our Debt Payoff Calculator to see which balances cost you the most — and how fast a focused plan clears the bad debt.',
      },
      {
        type: 'heading',
        text: 'What to do with bad debt',
      },
      {
        type: 'paragraph',
        text: 'If you are carrying high-interest bad debt, make eliminating it a top priority — its rate usually beats any guaranteed return you could earn elsewhere. Use the [debt avalanche](/blog/debt-snowball-vs-avalanche) to target the highest rates first, and understand the true cost of any new loan with our guide on [APR vs interest rate](/blog/apr-vs-interest-rate-explained). Before taking on any debt, run the numbers in the [Personal Loan Calculator](/calculators/personal-loan) so you know the real cost.',
      },
    ],
    faqs: [
      {
        q: 'What is the difference between good debt and bad debt?',
        a: 'Good debt generally helps you acquire something that grows in value or boosts your income — like a mortgage, student loan or business loan — usually at a lower rate. Bad debt funds depreciating items or consumption at high interest, such as credit card balances or payday loans.',
      },
      {
        q: 'Is all debt bad?',
        a: 'No. Debt can be a useful tool when it finances an appreciating asset or higher earning potential at a manageable rate. The problem is high-interest debt for consumption, which drains your finances long after the value is gone.',
      },
      {
        q: 'How do I know if debt is good or bad?',
        a: 'Ask two questions: what does the money buy, and what is the interest rate? Borrowing for an appreciating asset or higher income at a low rate leans good; high-rate borrowing for consumption or depreciating items leans bad.',
      },
      {
        q: 'Can good debt become bad debt?',
        a: 'Yes. Even normally good debt becomes a problem if the payments strain your budget or the interest rate is high. Context — affordability and rate — matters as much as the category of debt.',
      },
      {
        q: 'Which debt should I pay off first?',
        a: 'Generally the highest-interest debt, since it costs you the most and rarely funds anything that builds value. The debt avalanche method targets these balances first to minimize total interest paid.',
      },
    ],
  },

  {
    slug: 'how-to-improve-your-credit-score',
    title: 'How to Improve Your Credit Score (Fast and Long-Term)',
    metaTitle: 'How to Improve Your Credit Score',
    metaDescription:
      'Learn what affects your credit score and how to improve it — payment history, credit utilization, account age and more — with quick wins and long-term habits.',
    excerpt:
      'Your credit score shapes the rates you’re offered on everything. Here’s what actually moves it, the fastest wins, and the habits that build great credit over time.',
    keywords: [
      'how to improve credit score',
      'raise credit score fast',
      'credit utilization',
      'payment history',
      'what affects credit score',
      'build credit',
      'credit score tips',
    ],
    category: 'Personal Finance',
    tags: ['credit score', 'credit', 'money management'],
    author: 'The FrankCalculator Team',
    datePublished: '2026-05-30',
    dateModified: MODIFIED,
    readingTime: 8,
    accent: 'accent-cyan',
    emoji: '📊',
    relatedCalculators: ['credit-card-payoff', 'personal-loan'],
    relatedPosts: [
      'how-is-credit-card-interest-calculated',
      'good-debt-vs-bad-debt',
      'how-much-personal-loan-can-i-get-on-my-salary',
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Your **credit score** quietly influences almost every borrowing decision in your life — the interest rate on a mortgage, a car loan, a credit card, even some insurance premiums and rental applications. A higher score can save you thousands over time. The good news: the score is built from factors you can directly influence.',
      },
      {
        type: 'takeaways',
        items: [
          'Payment history and credit utilization are the two biggest factors.',
          'Paying on time, every time, is the most powerful long-term habit.',
          'Keeping utilization low (ideally under 30%) is the fastest quick win.',
          'Length of history, credit mix and new inquiries play smaller roles.',
        ],
      },
      {
        type: 'heading',
        text: 'What affects your credit score',
      },
      {
        type: 'list',
        items: [
          '**Payment history (the biggest factor):** whether you pay on time. Late payments hurt the most.',
          '**Credit utilization:** how much of your available credit you are using. Lower is better.',
          '**Length of credit history:** older accounts help; closing old cards can hurt.',
          '**Credit mix:** a healthy variety of credit types can help modestly.',
          '**New credit / inquiries:** many applications in a short window can ding your score.',
        ],
      },
      {
        type: 'heading',
        text: 'The fastest quick win: lower your utilization',
      },
      {
        type: 'paragraph',
        text: 'Credit utilization — your balances divided by your credit limits — is one of the few factors you can move quickly. Aim to keep it **below about 30%**, and lower is better. Paying down balances before the statement closes (not just before the due date) can lower the figure reported to the bureaus. Our [Credit Card Payoff Calculator](/calculators/credit-card-payoff) can help you plan exactly how to bring balances down.',
      },
      {
        type: 'callout',
        title: 'On-time payments are everything',
        text: 'Because payment history is the largest factor, a single missed payment can cost more points than almost anything else. Automating at least the minimum payment protects your score even in a busy month.',
      },
      {
        type: 'heading',
        text: 'Long-term habits that build great credit',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Pay every bill on time — set up autopay for at least the minimum.',
          'Keep balances low relative to your limits, all month long.',
          'Keep old accounts open to lengthen your average history.',
          'Apply for new credit only when you need it.',
          'Check your credit reports regularly and dispute any errors.',
        ],
      },
      {
        type: 'heading',
        text: 'Why it pays off',
      },
      {
        type: 'paragraph',
        text: 'A strong credit score is not vanity — it directly lowers the rates you are offered, which means smaller monthly payments and less total interest. A better score can shrink the cost of a [personal loan](/calculators/personal-loan) or mortgage substantially. Combine good credit habits with paying down high-interest balances (see [good debt vs bad debt](/blog/good-debt-vs-bad-debt)) and you compound the benefit. This is educational information, not personalized financial or credit advice.',
      },
    ],
    faqs: [
      {
        q: 'What is the fastest way to improve my credit score?',
        a: 'Lowering your credit utilization is usually the quickest win — pay down balances so you are using a small share of your available credit, ideally under 30%. Combined with making every payment on time, this can move your score relatively quickly.',
      },
      {
        q: 'What affects my credit score the most?',
        a: 'Payment history and credit utilization are typically the two largest factors. Paying on time protects your score, and keeping balances low relative to your limits helps it. Length of history, credit mix and new inquiries play smaller roles.',
      },
      {
        q: 'What is a good credit utilization ratio?',
        a: 'Keeping utilization below about 30% of your available credit is a common guideline, and lower is generally better. Paying balances down before the statement closes can reduce the utilization reported to the credit bureaus.',
      },
      {
        q: 'Does closing a credit card hurt my score?',
        a: 'It can. Closing a card reduces your available credit, which can raise your utilization, and closing an old account can shorten your average credit history. Often it is better to keep old, no-fee cards open and lightly used.',
      },
      {
        q: 'How long does it take to improve a credit score?',
        a: 'Some changes, like lowering utilization, can show up within a billing cycle or two, while rebuilding after late payments or derogatory marks takes longer. Consistent on-time payments and low balances build a strong score over months and years.',
      },
    ],
  },

  {
    slug: 'apr-vs-interest-rate-explained',
    title: 'APR vs Interest Rate: What’s the Difference?',
    metaTitle: 'APR vs Interest Rate: What’s the Difference?',
    metaDescription:
      'APR vs interest rate explained — why APR includes fees, how it differs from the nominal rate, and why APR is the better number for comparing loans and credit cards.',
    excerpt:
      'The interest rate is the cost of borrowing the money; the APR adds the fees. Knowing the difference is how you compare loans honestly — and avoid overpaying.',
    keywords: [
      'APR vs interest rate',
      'what is APR',
      'difference between APR and interest rate',
      'annual percentage rate',
      'APR with fees',
      'compare loan offers',
      'loan APR',
    ],
    category: 'Personal Finance',
    tags: ['APR', 'loans', 'borrowing'],
    author: 'The FrankCalculator Team',
    datePublished: '2026-06-03',
    dateModified: MODIFIED,
    readingTime: 7,
    accent: 'accent-cyan',
    emoji: '🔍',
    relatedCalculators: ['personal-loan', 'business-loan'],
    relatedPosts: [
      'how-to-calculate-loan-emi-monthly-payment',
      'how-is-credit-card-interest-calculated',
      'good-debt-vs-bad-debt',
    ],
    content: [
      {
        type: 'paragraph',
        text: 'When you compare loans or credit cards, you will see two numbers that look similar but mean different things: the **interest rate** and the **APR**. Confusing them can cost you real money, because a loan with a lower interest rate can actually be more expensive once fees are included. Here is the difference in plain English.',
      },
      {
        type: 'takeaways',
        items: [
          'The interest rate is the cost of borrowing the principal alone.',
          'The APR (annual percentage rate) includes interest plus most fees.',
          'APR is the better number for comparing offers apples-to-apples.',
          'For credit cards, the APR and interest rate are usually the same.',
        ],
      },
      {
        type: 'heading',
        text: 'What is the interest rate?',
      },
      {
        type: 'paragraph',
        text: 'The interest rate is the percentage a lender charges for the use of the principal — the raw cost of the money itself. It determines your base interest charges and, on a loan, drives your monthly payment. But it does not, by itself, include the fees a lender may charge to set up the loan.',
      },
      {
        type: 'heading',
        text: 'What is APR?',
      },
      {
        type: 'paragraph',
        text: 'The **annual percentage rate** folds the interest rate together with most upfront fees — like origination charges — and expresses the total as a single annualized rate. Because those fees raise your real cost, the APR is usually **higher** than the stated interest rate. That makes APR the more honest figure for comparing two loans.',
      },
      {
        type: 'callout',
        title: 'Why APR can flip a comparison',
        text: 'Loan A at 7% with a big origination fee can cost more than Loan B at 7.3% with no fee. The interest rate alone hides that; the APR reveals it.',
      },
      {
        type: 'heading',
        text: 'A simple way to think about it',
      },
      {
        type: 'list',
        items: [
          '**Interest rate:** the cost of the borrowed money.',
          '**APR:** the cost of the borrowed money **plus** the cost of getting the loan.',
          '**Net proceeds:** fees reduce the cash you actually receive, which is what pushes APR above the rate.',
        ],
      },
      {
        type: 'heading',
        text: 'Credit cards are a special case',
      },
      {
        type: 'paragraph',
        text: 'For most credit cards, the APR and the interest rate are effectively the **same number**, because cards generally do not charge separate origination fees the way installment loans do. (Cards can still charge other fees — like annual or cash-advance fees — but those are not folded into the purchase APR.) For how that APR turns into daily charges, see our guide on [how credit card interest is calculated](/blog/how-is-credit-card-interest-calculated).',
      },
      {
        type: 'calculatorCta',
        slug: 'business-loan',
        heading: 'See the APR with fees',
        text: 'Our Business Loan Calculator computes the effective APR once origination fees are included — so you can compare offers on their true cost, not just the rate.',
      },
      {
        type: 'heading',
        text: 'How to use this when borrowing',
      },
      {
        type: 'paragraph',
        text: 'When comparing offers, **always look at the APR and the total cost**, not just the monthly payment or headline rate. A lower interest rate with high fees can lose to a slightly higher rate with none. Model both the payment and the fee-inclusive APR in our [Personal Loan Calculator](/calculators/personal-loan) and [Business Loan Calculator](/calculators/business-loan) before you sign anything.',
      },
    ],
    faqs: [
      {
        q: 'What is the difference between APR and interest rate?',
        a: 'The interest rate is the cost of borrowing the principal alone, while the APR (annual percentage rate) also includes most fees, such as origination charges, expressed as a single annualized rate. Because fees raise your real cost, the APR is usually higher than the interest rate.',
      },
      {
        q: 'Why is APR a better number for comparing loans?',
        a: 'APR captures both interest and fees, so it reflects the true cost of borrowing. Two loans with the same interest rate can have very different APRs if one charges higher fees, which is why APR allows an apples-to-apples comparison.',
      },
      {
        q: 'Why is APR higher than the interest rate?',
        a: 'APR is higher because it includes upfront fees on top of the interest rate. Those fees reduce the cash you actually receive while you still repay the full principal plus interest, which raises the effective annualized cost.',
      },
      {
        q: 'Are APR and interest rate the same on a credit card?',
        a: 'For most credit cards, yes — the purchase APR and interest rate are effectively the same because cards generally do not charge separate origination fees. Cards may charge other fees, like annual or cash-advance fees, but those are not folded into the purchase APR.',
      },
      {
        q: 'Should I compare loans by APR or monthly payment?',
        a: 'Compare by APR and total cost rather than the monthly payment alone. A low monthly payment can hide a long term and high total interest, while the APR reflects the true annualized cost including fees.',
      },
    ],
  },
];
