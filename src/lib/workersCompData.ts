/**
 * Workers' Compensation reference data.
 *
 * IMPORTANT: These figures are EDUCATIONAL ESTIMATES. State maximum/minimum
 * weekly compensation rates change at least once a year (they are tied to each
 * state's average weekly wage and reset on different dates — Jan 1, Jul 1,
 * Oct 1, etc.), and body-part "scheduled weeks" tables differ significantly
 * from state to state. The maximum weekly rates below were refreshed to the
 * most recent published 2025–2026 values we could verify from state agencies
 * and legal sources, but they can still change and may not match your exact
 * date of injury. Always confirm current figures with your state's workers'
 * compensation board or a licensed attorney.
 *
 * Each entry carries an `effective` label so users can see the period a rate
 * applies to, and a `specialSystem` flag for states whose benefit/permanent-
 * disability rules differ fundamentally from the simple "weeks × rate ×
 * impairment" model this calculator uses (e.g. California, Texas, Ohio,
 * Washington, Michigan).
 */

/** Human-readable "rates reviewed" stamp shown in the UI. */
export const RATES_AS_OF = 'Reviewed June 2026 · 2025–2026 rate cycle';

export interface StateCompData {
  /** Two-letter code or "GENERIC". */
  code: string;
  /** Human-readable name. */
  name: string;
  /**
   * Approximate maximum weekly temporary-total / indemnity rate. A value of 0
   * means "no hard cap modelled" (used for the Generic / Other option).
   */
  maxWeekly: number;
  /** Approximate minimum weekly indemnity rate (0 if not modelled). */
  minWeekly: number;
  /** Period the max/min figures apply to, e.g. "2026" or "Jul 2026–Jun 2027". */
  effective: string;
  /**
   * True when the state's actual permanent-disability or benefit calculation
   * differs fundamentally from this calculator's simplified model, so the
   * estimate should be treated with extra caution.
   */
  specialSystem?: boolean;
  /** Short note about how this state is treated / caveats. */
  note: string;
}

/**
 * Representative states plus a Generic option. Maximum weekly rates reflect the
 * most recent published 2025–2026 figures we could verify; treat as estimates.
 */
export const STATE_COMP_DATA: StateCompData[] = [
  {
    code: 'GENERIC',
    name: 'Generic / Other (no state cap)',
    maxWeekly: 0,
    minWeekly: 0,
    effective: '—',
    note: 'Applies the two-thirds rule with no hard state maximum. Use this if your state is not listed, then verify your state’s cap and schedule.',
  },
  {
    code: 'CA',
    name: 'California',
    maxWeekly: 1764.11,
    minWeekly: 264.61,
    effective: '2026 (eff. Jan 1)',
    specialSystem: true,
    note: 'California’s 2026 TTD max is $1,764.11/wk (min $264.61). Permanent disability is NOT a simple weeks × rate × impairment figure — California uses a Permanent Disability Rating Schedule (a rating string adjusted for occupation and age) and a separate PD money chart, so the PPD estimate here is only a rough proxy.',
  },
  {
    code: 'NY',
    name: 'New York',
    maxWeekly: 1222.42,
    minWeekly: 275,
    effective: 'Jul 2025–Jun 2026',
    note: 'New York recalculates its maximum each July 1 from the state average weekly wage. The max is $1,222.42 for injuries 7/1/2025–6/30/2026, and rises to $1,281.50 for injuries on/after 7/1/2026.',
  },
  {
    code: 'TX',
    name: 'Texas',
    maxWeekly: 1271,
    minWeekly: 191,
    effective: '2026 (state fiscal year)',
    specialSystem: true,
    note: 'Texas’s 2026 income-benefit cap is ~$1,271/wk (the state average weekly wage). Texas is unusual: private employers can opt out of workers’ comp entirely, and permanent value is paid as impairment income benefits (3 weeks per impairment-rating point), so this estimate is approximate.',
  },
  {
    code: 'FL',
    name: 'Florida',
    maxWeekly: 1358,
    minWeekly: 20,
    effective: '2026 (eff. Jan 1)',
    note: 'Florida’s maximum weekly rate for injuries on/after Jan 1, 2026 is $1,358 (resets each January 1). Most temporary benefits are capped at 104 weeks.',
  },
  {
    code: 'IL',
    name: 'Illinois',
    maxWeekly: 2008.6,
    minWeekly: 0,
    effective: 'Jan–Jul 2026',
    note: 'Illinois’s TTD/PTD maximum is $2,008.60/wk for the Jan 15–Jul 14, 2026 period (it resets twice a year). The minimum varies with your number of dependents, so no fixed floor is modelled here.',
  },
  {
    code: 'PA',
    name: 'Pennsylvania',
    maxWeekly: 1394,
    minWeekly: 0,
    effective: '2026 (eff. Jan 1)',
    note: 'Pennsylvania’s maximum weekly rate for injuries on/after Jan 1, 2026 is $1,394.00. Low-wage workers can receive up to 90% of their average weekly wage, so no fixed floor is modelled here.',
  },
  {
    code: 'OH',
    name: 'Ohio',
    maxWeekly: 1281,
    minWeekly: 427,
    effective: '2026',
    specialSystem: true,
    note: 'Ohio is a monopolistic state fund. The 2026 TTD max is ~$1,281/wk (state average weekly wage) with a ~$427 minimum, and the first 12 weeks of TTD are paid at 72% of the full weekly wage rather than two-thirds.',
  },
  {
    code: 'GA',
    name: 'Georgia',
    maxWeekly: 800,
    minWeekly: 50,
    effective: 'approx. 2025 — verify',
    note: 'Georgia’s statutory maximum TTD rate has been $800/wk since July 2023 (it changes only by legislation, not automatic indexing). Confirm the current figure with the State Board of Workers’ Compensation.',
  },
  {
    code: 'NJ',
    name: 'New Jersey',
    maxWeekly: 1199,
    minWeekly: 320,
    effective: '2026',
    note: 'New Jersey sets a 2026 maximum of $1,199/wk and a $320 minimum, adjusted each calendar year. Wage-loss benefits are 70% of average earnings.',
  },
  {
    code: 'MA',
    name: 'Massachusetts',
    maxWeekly: 1829.13,
    minWeekly: 365.83,
    effective: 'approx. Oct 2024–Sep 2025 — verify',
    note: 'Massachusetts ties its maximum to 100% of the state average weekly wage and updates it each October 1. The figure shown (~$1,829/wk) is for the 10/1/2024–9/30/2025 period; confirm the current year’s rate.',
  },
  {
    code: 'WA',
    name: 'Washington',
    maxWeekly: 2196,
    minWeekly: 0,
    effective: 'approx. 2025 — verify',
    specialSystem: true,
    note: 'Washington is a monopolistic fund that pays a percentage of wages based on marital status and dependents and is administered monthly (a 2025 max of ~$9,516/month, ≈ $2,196/week). Your actual rate can differ substantially, so treat this as a loose ceiling only.',
  },
  {
    code: 'MI',
    name: 'Michigan',
    maxWeekly: 1200,
    minWeekly: 0,
    effective: 'approx. 2025 — verify',
    specialSystem: true,
    note: 'Michigan pays 80% of your after-tax average weekly wage (not two-thirds of gross) and can coordinate/offset benefits against other wage-replacement sources, so this gross-based estimate is approximate.',
  },
  {
    code: 'NC',
    name: 'North Carolina',
    maxWeekly: 1446,
    minWeekly: 30,
    effective: '2026 (eff. Jan 1)',
    note: 'North Carolina updates its maximum weekly benefit each January 1; it is $1,446 for injuries in 2026 (up from $1,380 in 2025).',
  },
  {
    code: 'VA',
    name: 'Virginia',
    maxWeekly: 1410,
    minWeekly: 352.5,
    effective: 'approx. 2025 — verify',
    note: 'Virginia ties its maximum to the state average weekly wage and adjusts it annually (around $1,410/wk for recent injuries, with the minimum set at 25% of the maximum). Confirm the current figure with the Virginia Workers’ Compensation Commission.',
  },
];

export interface BodyPartSchedule {
  key: string;
  label: string;
  /**
   * Representative number of "scheduled weeks" of PPD for the TOTAL loss (100%
   * impairment) of this body part. Real schedules vary a lot by state.
   */
  weeks: number;
}

/**
 * Representative national body-part schedule (weeks for 100% loss). State
 * schedules differ — California, Illinois, New York, etc. all use different
 * values — so these are middle-of-the-road figures for estimation only.
 */
export const BODY_PART_SCHEDULE: BodyPartSchedule[] = [
  { key: 'arm', label: 'Arm', weeks: 250 },
  { key: 'shoulder', label: 'Shoulder', weeks: 260 },
  { key: 'hand', label: 'Hand', weeks: 190 },
  { key: 'thumb', label: 'Thumb', weeks: 60 },
  { key: 'finger', label: 'Finger (index)', weeks: 35 },
  { key: 'leg', label: 'Leg', weeks: 250 },
  { key: 'hip', label: 'Hip', weeks: 230 },
  { key: 'knee', label: 'Knee', weeks: 215 },
  { key: 'foot', label: 'Foot', weeks: 150 },
  { key: 'toe', label: 'Great Toe', weeks: 30 },
  { key: 'eye', label: 'Eye (loss of vision)', weeks: 150 },
  { key: 'ear', label: 'Ear / Hearing (one)', weeks: 75 },
];

/**
 * Whole-person ("unscheduled") body regions — back, neck, head, internal,
 * psychological. These are not on the member schedule; instead they are valued
 * using a whole-person impairment rating against a statutory number of weeks.
 */
export const WHOLE_PERSON_REGIONS: { key: string; label: string }[] = [
  { key: 'back', label: 'Back / Spine (lower)' },
  { key: 'neck', label: 'Neck / Cervical spine' },
  { key: 'head', label: 'Head / Brain' },
  { key: 'internal', label: 'Internal / Organ' },
  { key: 'psych', label: 'Psychological / Mental' },
  { key: 'multiple', label: 'Multiple body parts' },
];

/**
 * Representative statutory "whole-person" week count used to value unscheduled
 * injuries and as a baseline for permanent total disability. Many states use a
 * figure in the 400–500 week range for whole-person/total awards.
 */
export const WHOLE_PERSON_WEEKS = 500;

/** Typical fraction of average weekly wage paid as the comp rate (two-thirds). */
export const DEFAULT_COMP_RATE_PCT = 66.67;

/** Typical attorney contingency fee on a workers' comp recovery (often capped). */
export const DEFAULT_ATTORNEY_FEE_PCT = 20;
