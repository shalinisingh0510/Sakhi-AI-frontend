/**
 * Calculators API Client & Offline Calculation Engine for Sakhi AI
 * Implements 100% evidence-based clinical logic and models with client fallback
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export interface CalculatorMeta {
  id: string;
  title: string;
  short_title: string;
  slug: string;
  category: "fertility" | "pregnancy" | "cycle" | "clinical";
  description: string;
  icon: string;
  badge?: string;
  featured?: boolean;
}

export const LOCAL_CATALOG: CalculatorMeta[] = [
  {
    id: "ovulation-calculator",
    title: "Ovulation Calculator: Figure Out Your Most Fertile Days",
    short_title: "Ovulation Calculator",
    slug: "ovulation-calculator",
    category: "fertility",
    description: "Identify your likely ovulation day and 6-day fertile window to optimize conception or track your body's rhythm.",
    icon: "Sparkles",
    badge: "Popular",
    featured: true,
  },
  {
    id: "hcg-calculator",
    title: "Beta hCG Doubling Time Calculator & Charts",
    short_title: "hCG Doubling Calculator",
    slug: "hcg-calculator",
    category: "clinical",
    description: "Track your beta-hCG blood test rise, calculate doubling time, and compare against standard early pregnancy ranges.",
    icon: "Activity",
    badge: "Clinical",
    featured: true,
  },
  {
    id: "pregnancy-test-calculator",
    title: "Pregnancy Test Calculator: When to Take a Test",
    short_title: "Pregnancy Test Calculator",
    slug: "pregnancy-test-calculator",
    category: "fertility",
    description: "Find out the most accurate day to take a home pregnancy test based on your period or ovulation date to prevent false negatives.",
    icon: "CheckCircle2",
    featured: false,
  },
  {
    id: "menstrual-cycle-calculator",
    title: "Menstrual Cycle Calculator: Phases & Hormone Rhythm",
    short_title: "Menstrual Cycle Calculator",
    slug: "menstrual-cycle-calculator",
    category: "cycle",
    description: "Explore the 4 phases of your menstrual cycle — menstrual, follicular, ovulation, and luteal — and how your hormones fluctuate.",
    icon: "Calendar",
    featured: true,
  },
  {
    id: "period-calculator",
    title: "Period Calculator: Predict Your Next 3 Cycles",
    short_title: "Period Calculator",
    slug: "period-calculator",
    category: "cycle",
    description: "Predict when your next periods will arrive, plan trips and events, and stay in tune with your personal cycle schedule.",
    icon: "CalendarDays",
    badge: "Essential",
    featured: true,
  },
  {
    id: "implantation-calculator",
    title: "Implantation Calculator: When Does Implantation Occur?",
    short_title: "Implantation Calculator",
    slug: "implantation-calculator",
    category: "fertility",
    description: "Calculate the exact window when a fertilized egg attaches to the uterine lining and understand early implantation signs.",
    icon: "HeartPulse",
    featured: false,
  },
  {
    id: "pregnancy-weeks-to-months-calculator",
    title: "Pregnancy Weeks to Months Calculator: How Far Along Are You?",
    short_title: "Weeks to Months Calculator",
    slug: "pregnancy-weeks-to-months-calculator",
    category: "pregnancy",
    description: "Convert pregnancy weeks into months and trimesters, track fetal size comparisons, and understand developmental milestones.",
    icon: "Baby",
    featured: true,
  },
  {
    id: "due-date-calculator",
    title: "Pregnancy Due Date Calculator",
    short_title: "Due Date Calculator",
    slug: "due-date-calculator",
    category: "pregnancy",
    description: "Calculate your estimated due date (EDD) using your last period or conception date, and see key trimester milestones.",
    icon: "Clock",
    badge: "Top Tool",
    featured: true,
  },
  {
    id: "ivf-due-date-calculator",
    title: "IVF and FET Due Date Calculator",
    short_title: "IVF Due Date Calculator",
    slug: "ivf-due-date-calculator",
    category: "clinical",
    description: "Calculate your accurate due date following a Day 3, Day 5 blastocyst, Day 6, or fresh/frozen embryo transfer.",
    icon: "Microscope",
    badge: "Specialized",
    featured: false,
  },
  {
    id: "due-date-by-ultrasound",
    title: "Due Date Calculator by Ultrasound",
    short_title: "Ultrasound Due Date Calculator",
    slug: "due-date-by-ultrasound",
    category: "clinical",
    description: "Calculate your due date based on an early sonogram / ultrasound scan and understand ACOG redating criteria.",
    icon: "ScanLine",
    featured: false,
  },
];

// Helper Date Utilities
function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function parseDate(s: string): Date {
  return new Date(s + "T00:00:00");
}

// 1. Ovulation
export interface OvulationResult {
  ovulation_date: string;
  fertile_window_start: string;
  fertile_window_end: string;
  next_period_date: string;
  cycle_length: number;
  most_fertile_days: string[];
  fertility_score_by_day: Array<{ date: string; score: number; label: string }>;
  clinical_note: string;
}

// 2. hCG
export interface HcgResult {
  first_level: number;
  second_level: number;
  time_hours: number;
  doubling_time_hours: number | null;
  doubling_time_days: number | null;
  increase_24h_percent: number;
  increase_48h_percent: number;
  is_increasing: boolean;
  status: string;
  clinical_interpretation: string;
  chart_reference: Array<{
    gestational_weeks: string;
    typical_hCG_range: string;
    expected_doubling: string;
  }>;
}

// 3. Pregnancy Test
export interface PregnancyTestResult {
  recommended_test_date: string;
  early_test_date: string;
  days_past_ovulation: number;
  days_until_recommended_test: number;
  test_accuracy_today: string;
  clinical_guidance: string;
  timeline: Array<{ stage: string; dpo: number; date: string; event: string }>;
}

// 4. Menstrual Cycle
export interface CyclePhase {
  name: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  hormone_focus: string;
  body_symptoms: string[];
  energy_level: string;
  wellness_tips: string;
}

export interface MenstrualCycleResult {
  next_period_start: string;
  next_period_end: string;
  ovulation_date: string;
  fertile_window_start: string;
  fertile_window_end: string;
  phases: CyclePhase[];
  cycle_regularity_info: string;
}

// 5. Period
export interface PredictedCycle {
  cycle_number: number;
  period_start: string;
  period_end: string;
  ovulation_date: string;
  fertile_start: string;
  fertile_end: string;
  pms_start: string;
}

export interface PeriodResult {
  days_until_next_period: number;
  next_period_start: string;
  next_period_end: string;
  next_ovulation_date: string;
  predicted_cycles: PredictedCycle[];
  summary_text: string;
}

// 6. Implantation
export interface ImplantationResult {
  ovulation_date: string;
  implantation_window_start: string;
  implantation_window_end: string;
  peak_implantation_date: string;
  earliest_pregnancy_test_date: string;
  days_past_ovulation_range: string;
  symptoms_guide: Array<{ symptom: string; details: string }>;
  clinical_note: string;
}

// 7. Pregnancy Weeks to Months
export interface WeeksToMonthsResult {
  weeks: number;
  days: number;
  total_days: number;
  current_month: number;
  current_trimester: number;
  trimester_name: string;
  percentage_completed: number;
  estimated_due_date: string;
  baby_size_comparison: string;
  fetal_development_milestones: string[];
  trimester_timeline: Array<{
    trimester: number;
    name: string;
    weeks: string;
    active: boolean;
  }>;
}

// 8. Due Date
export interface Milestone {
  milestone: string;
  date: string;
  gestational_age: string;
  description: string;
}

export interface DueDateResult {
  estimated_due_date: string;
  conception_date: string;
  gestational_age_weeks: number;
  gestational_age_days: number;
  current_trimester: number;
  days_remaining: number;
  percentage_progress: number;
  milestones: Milestone[];
  clinical_guideline: string;
}

// 9. IVF Due Date
export interface IvfDueDateResult {
  estimated_due_date: string;
  theoretical_lmp: string;
  gestational_age_weeks: number;
  gestational_age_days: number;
  days_remaining: number;
  transfer_type_label: string;
  milestones: Milestone[];
  clinical_explanation: string;
}

// 10. Due Date by Ultrasound
export interface UltrasoundDueDateResult {
  estimated_due_date: string;
  estimated_conception_date: string;
  gestational_age_at_scan_days: number;
  current_gestational_age_weeks: number;
  current_gestational_age_days: number;
  days_remaining: number;
  acog_redating_criteria: string;
  scan_insights: string;
}

// API Request Wrapper
async function postCalculator<T>(endpoint: string, body: unknown, fallbackFn: () => T): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}/calculators/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[Calculators API] Server fetch failed for ${endpoint}, using client computation fallback.`, err);
    return fallbackFn();
  }
}

export const calculatorsApi = {
  async getCatalog(): Promise<CalculatorMeta[]> {
    try {
      const res = await fetch(`${BASE_URL}/calculators/catalog`);
      if (res.ok) {
        const data = await res.json();
        return data.calculators;
      }
    } catch {
      // fallback
    }
    return LOCAL_CATALOG;
  },

  // 1. Ovulation
  async calculateOvulation(lastPeriodDate: string, cycleLength: number = 28): Promise<OvulationResult> {
    return postCalculator("ovulation", { last_period_date: lastPeriodDate, cycle_length: cycleLength }, () => {
      const lmp = parseDate(lastPeriodDate);
      const nextPeriod = addDays(lmp, cycleLength);
      const ovulation = addDays(nextPeriod, -14);
      const fertileStart = addDays(ovulation, -5);
      const fertileEnd = addDays(ovulation, 1);

      const scores = [
        { date: formatDate(fertileStart), score: 12, label: "Fertile (Medium)" },
        { date: formatDate(addDays(fertileStart, 1)), score: 18, label: "Fertile (Medium)" },
        { date: formatDate(addDays(fertileStart, 2)), score: 24, label: "High Fertility" },
        { date: formatDate(addDays(fertileStart, 3)), score: 32, label: "Very High Fertility" },
        { date: formatDate(addDays(ovulation, -1)), score: 35, label: "Peak Fertility (Day Before Ovulation)" },
        { date: formatDate(ovulation), score: 30, label: "Ovulation Day (Peak)" },
        { date: formatDate(fertileEnd), score: 10, label: "Ovulation + 1 (Egg viable ~12-24h)" },
      ];

      return {
        ovulation_date: formatDate(ovulation),
        fertile_window_start: formatDate(fertileStart),
        fertile_window_end: formatDate(fertileEnd),
        next_period_date: formatDate(nextPeriod),
        cycle_length: cycleLength,
        most_fertile_days: [formatDate(addDays(ovulation, -1)), formatDate(ovulation)],
        fertility_score_by_day: scores,
        clinical_note: `Based on your ${cycleLength}-day cycle, your luteal phase is estimated at 14 days. Your fertile window spans 6 days because sperm can survive up to 5 days, and the egg is viable for up to 24 hours.`,
      };
    });
  },

  // 2. hCG
  async calculateHcg(firstLevel: number, secondLevel: number, timeBetween: number, timeUnit: "days" | "hours" = "days"): Promise<HcgResult> {
    return postCalculator("hcg", { first_level: firstLevel, second_level: secondLevel, time_between: timeBetween, time_unit: timeUnit }, () => {
      const timeHours = timeUnit === "days" ? timeBetween * 24 : timeBetween;
      const ratio = secondLevel / firstLevel;
      const isIncreasing = ratio > 1;

      let doublingHours: number | null = null;
      let doublingDays: number | null = null;
      let inc24 = 0;
      let inc48 = 0;
      let status = "Decreasing or Plateaued";
      let interpretation = "Your beta-hCG level has not increased between the two draws. Consult your OB/GYN for evaluation.";

      if (isIncreasing) {
        doublingHours = Number((timeHours / Math.log2(ratio)).toFixed(2));
        doublingDays = Number((doublingHours / 24).toFixed(2));
        inc24 = Number((100 * (Math.pow(2, 24 / doublingHours) - 1)).toFixed(1));
        inc48 = Number((100 * (Math.pow(2, 48 / doublingHours) - 1)).toFixed(1));

        if (doublingHours < 72) {
          status = "Normal Doubling (Expected Rise)";
          interpretation = `Your hCG doubled in approximately ${doublingHours} hours (${doublingDays} days). A doubling time between 48 and 72 hours is typical for early intrauterine pregnancies under 6,000 mIU/mL.`;
        } else if (doublingHours <= 96) {
          status = "Borderline / Slower Doubling";
          interpretation = `Your doubling time is ${doublingHours} hours. Once hCG passes 6,000 mIU/mL, doubling naturally slows to 96+ hours.`;
        } else {
          status = "Prolonged Doubling Time";
          interpretation = `Your doubling time is ${doublingHours} hours, longer than typical early pregnancy rates. Review results with your healthcare provider.`;
        }
      }

      const chartReference = [
        { gestational_weeks: "3 Weeks LMP", typical_hCG_range: "5 - 50 mIU/mL", expected_doubling: "30 - 48 hours" },
        { gestational_weeks: "4 Weeks LMP", typical_hCG_range: "5 - 426 mIU/mL", expected_doubling: "40 - 54 hours" },
        { gestational_weeks: "5 Weeks LMP", typical_hCG_range: "18 - 7,340 mIU/mL", expected_doubling: "48 - 72 hours" },
        { gestational_weeks: "6 Weeks LMP", typical_hCG_range: "1,080 - 56,500 mIU/mL", expected_doubling: "72 - 96 hours" },
        { gestational_weeks: "7 - 8 Weeks", typical_hCG_range: "7,650 - 229,000 mIU/mL", expected_doubling: "> 96 hours (Peaks)" },
      ];

      return {
        first_level: firstLevel,
        second_level: secondLevel,
        time_hours: timeHours,
        doubling_time_hours: doublingHours,
        doubling_time_days: doublingDays,
        increase_24h_percent: inc24,
        increase_48h_percent: inc48,
        is_increasing: isIncreasing,
        status,
        clinical_interpretation: interpretation,
        chart_reference: chartReference,
      };
    });
  },

  // 3. Pregnancy Test
  async calculatePregnancyTest(method: "last_period" | "ovulation", inputDate: string, cycleLength: number = 28): Promise<PregnancyTestResult> {
    return postCalculator("pregnancy-test", { method, date: inputDate, cycle_length: cycleLength }, () => {
      const parsed = parseDate(inputDate);
      let ovulationDate: Date;
      let recDate: Date;

      if (method === "last_period") {
        ovulationDate = addDays(parsed, cycleLength - 14);
        recDate = addDays(parsed, cycleLength);
      } else {
        ovulationDate = parsed;
        recDate = addDays(ovulationDate, 14);
      }

      const earlyDate = addDays(recDate, -4);
      const today = new Date();
      const dpo = Math.max(0, Math.floor((today.getTime() - ovulationDate.getTime()) / (1000 * 60 * 60 * 24)));
      const daysUntil = Math.floor((recDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return {
        recommended_test_date: formatDate(recDate),
        early_test_date: formatDate(earlyDate),
        days_past_ovulation: dpo,
        days_until_recommended_test: daysUntil,
        test_accuracy_today: dpo < 10 ? "Low (<25%)" : dpo < 14 ? "High (85-90%)" : "Very High (99%+)",
        clinical_guidance: `The optimal day to test is ${recDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} (14 DPO). Testing earlier than 10 DPO frequently causes false negatives.`,
        timeline: [
          { stage: "Fertilization", dpo: 0, date: formatDate(ovulationDate), event: "Sperm fertilizes egg in fallopian tube" },
          { stage: "Implantation", dpo: 8, date: formatDate(addDays(ovulationDate, 8)), event: "Blastocyst implants; hCG release starts" },
          { stage: "Early Detection", dpo: 10, date: formatDate(earlyDate), event: "High-sensitivity tests may show faint line" },
          { stage: "Missed Period (99% Accurate)", dpo: 14, date: formatDate(recDate), event: "Standard urine test detects hCG reliably" },
        ],
      };
    });
  },

  // 4. Menstrual Cycle
  async calculateMenstrualCycle(lastPeriodDate: string, periodDuration: number = 5, cycleLength: number = 28): Promise<MenstrualCycleResult> {
    return postCalculator("menstrual-cycle", { last_period_date: lastPeriodDate, period_duration: periodDuration, cycle_length: cycleLength }, () => {
      const lmp = parseDate(lastPeriodDate);
      const nextStart = addDays(lmp, cycleLength);
      const nextEnd = addDays(nextStart, periodDuration - 1);
      const ovulation = addDays(nextStart, -14);
      const fertileStart = addDays(ovulation, -5);
      const fertileEnd = addDays(ovulation, 1);

      return {
        next_period_start: formatDate(nextStart),
        next_period_end: formatDate(nextEnd),
        ovulation_date: formatDate(ovulation),
        fertile_window_start: formatDate(fertileStart),
        fertile_window_end: formatDate(fertileEnd),
        phases: [
          {
            name: "Menstrual Phase",
            start_date: formatDate(nextStart),
            end_date: formatDate(nextEnd),
            duration_days: periodDuration,
            hormone_focus: "Estrogen & Progesterone are at baseline low",
            body_symptoms: ["Cramping", "Fatigue", "Spotting/Flow"],
            energy_level: "Gentle rest & reflective focus",
            wellness_tips: "Iron-rich meals, warm herbal teas, gentle walks.",
          },
          {
            name: "Follicular Phase",
            start_date: formatDate(addDays(nextEnd, 1)),
            end_date: formatDate(addDays(ovulation, -1)),
            duration_days: Math.max(1, Math.floor((ovulation.getTime() - nextEnd.getTime()) / (1000 * 60 * 60 * 24)) - 1),
            hormone_focus: "FSH stimulates follicles; Estrogen rises steadily",
            body_symptoms: ["High stamina", "Radiant skin", "Rising libido"],
            energy_level: "High energy, creativity & strength workouts",
            wellness_tips: "Start ambitious projects and strength training.",
          },
          {
            name: "Ovulation Phase",
            start_date: formatDate(addDays(ovulation, -1)),
            end_date: formatDate(addDays(ovulation, 1)),
            duration_days: 3,
            hormone_focus: "LH surge triggers egg release; Peak Estrogen",
            body_symptoms: ["Egg-white fluid", "Mild pelvic twinge", "Heightened senses"],
            energy_level: "Peak vitality, confidence & social communication",
            wellness_tips: "Optimal window for conception and high-intensity workouts.",
          },
          {
            name: "Luteal Phase",
            start_date: formatDate(addDays(ovulation, 1)),
            end_date: formatDate(addDays(nextStart, cycleLength - 1)),
            duration_days: 14,
            hormone_focus: "Progesterone dominates; second mild estrogen curve",
            body_symptoms: ["Bloating", "Breast tenderness", "Food cravings"],
            energy_level: "Reflective, detail-oriented, winding down",
            wellness_tips: "Support mood with complex carbs, magnesium, and restorative sleep.",
          },
        ],
        cycle_regularity_info: `Your cycle is ${cycleLength} days. Normal healthy adult cycles range from 21 to 35 days.`,
      };
    });
  },

  // 5. Period
  async calculatePeriod(lastPeriodDate: string, periodDuration: number = 5, cycleLength: number = 28, forecastMonths: number = 3): Promise<PeriodResult> {
    return postCalculator("period", { last_period_date: lastPeriodDate, period_duration: periodDuration, cycle_length: cycleLength, forecast_months: forecastMonths }, () => {
      const lmp = parseDate(lastPeriodDate);
      const today = new Date();
      const predictedCycles: PredictedCycle[] = [];

      for (let i = 1; i <= forecastMonths; i++) {
        const start = addDays(lmp, cycleLength * i);
        const end = addDays(start, periodDuration - 1);
        const ov = addDays(start, -14);
        predictedCycles.push({
          cycle_number: i,
          period_start: formatDate(start),
          period_end: formatDate(end),
          ovulation_date: formatDate(ov),
          fertile_start: formatDate(addDays(ov, -5)),
          fertile_end: formatDate(addDays(ov, 1)),
          pms_start: formatDate(addDays(start, -7)),
        });
      }

      const first = predictedCycles[0];
      const daysUntil = Math.floor((parseDate(first.period_start).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return {
        days_until_next_period: daysUntil,
        next_period_start: first.period_start,
        next_period_end: first.period_end,
        next_ovulation_date: first.ovulation_date,
        predicted_cycles: predictedCycles,
        summary_text: `Your next period is predicted to begin on ${parseDate(first.period_start).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}.`,
      };
    });
  },

  // 6. Implantation
  async calculateImplantation(method: "od" | "lp", inputDate: string, cycleLength: number = 28): Promise<ImplantationResult> {
    return postCalculator("implantation", { method, date: inputDate, cycle_length: cycleLength }, () => {
      const parsed = parseDate(inputDate);
      const ovulation = method === "od" ? parsed : addDays(parsed, cycleLength - 14);

      const winStart = addDays(ovulation, 6);
      const winEnd = addDays(ovulation, 10);
      const peak = addDays(ovulation, 9);
      const testDate = addDays(ovulation, 14);

      return {
        ovulation_date: formatDate(ovulation),
        implantation_window_start: formatDate(winStart),
        implantation_window_end: formatDate(winEnd),
        peak_implantation_date: formatDate(peak),
        earliest_pregnancy_test_date: formatDate(testDate),
        days_past_ovulation_range: "6 - 10 DPO",
        symptoms_guide: [
          { symptom: "Light Spotting", details: "Pinkish or rust/brown droplet, lasts 1-2 days without clots." },
          { symptom: "Mild Uterine Prickling", details: "Gentle tingling sensation in lower abdomen, noticeably milder than menstrual cramps." },
          { symptom: "Basal Body Temp Dip", details: "A transient 1-day temperature drop followed by sustained high luteal temperatures." },
          { symptom: "Fatigue & Tenderness", details: "Nascent progesterone elevation causing breast tenderness and drowsiness." },
        ],
        clinical_note: `Implantation most commonly occurs 8 to 9 days after ovulation (normal physiological window: 6-10 DPO: ${winStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${winEnd.toLocaleDateString(undefined, { month: "short", day: "numeric" })}).`,
      };
    });
  },

  // 7. Weeks to Months
  async calculateWeeksToMonths(weeks: number, days: number = 0): Promise<WeeksToMonthsResult> {
    return postCalculator("pregnancy-weeks-to-months", { weeks, days }, () => {
      const totalDays = weeks * 7 + days;
      const today = new Date();
      const edd = addDays(today, 280 - totalDays);
      const percentage = Math.min(100, Number(((totalDays / 280) * 100).toFixed(1)));

      let currentMonth = 1;
      let currentTrimester = 1;
      let trimesterName = "First Trimester";

      if (weeks >= 36) { currentMonth = 9; currentTrimester = 3; trimesterName = "Third Trimester"; }
      else if (weeks >= 32) { currentMonth = 8; currentTrimester = 3; trimesterName = "Third Trimester"; }
      else if (weeks >= 28) { currentMonth = 7; currentTrimester = 3; trimesterName = "Third Trimester"; }
      else if (weeks >= 23) { currentMonth = 6; currentTrimester = 2; trimesterName = "Second Trimester"; }
      else if (weeks >= 18) { currentMonth = 5; currentTrimester = 2; trimesterName = "Second Trimester"; }
      else if (weeks >= 14) { currentMonth = 4; currentTrimester = 2; trimesterName = "Second Trimester"; }
      else if (weeks >= 9) { currentMonth = 3; currentTrimester = 1; trimesterName = "First Trimester"; }
      else if (weeks >= 5) { currentMonth = 2; currentTrimester = 1; trimesterName = "First Trimester"; }

      const milestonesByMonth: Record<number, string[]> = {
        1: ["Fertilization and blastocyst migration", "Implantation into uterine wall", "Neural tube formation begins"],
        2: ["Heart begins beating (~Week 6)", "Tiny arm and leg buds form", "Facial features start emerging"],
        3: ["All vital organs formed", "Baby opens and closes fingers", "Miscarriage risk drops significantly"],
        4: ["Lanugo fine hair covers body", "Baby practices swallowing", "Gender may be detected on ultrasound"],
        5: ["You may feel first flutters (quickening)", "Vernix protects delicate skin", "Baby can hear muffled sounds"],
        6: ["Surfactant production in lungs begins", "Eyes open and react to light", "Rapid nervous system growth"],
        7: ["Baby practices breathing motions", "Brain waves show REM sleep cycles", "Bones continue hardening"],
        8: ["Rapid weight gain (~0.5 lb/week)", "Maternal antibody transfer peaks", "Baby turns head-down"],
        9: ["Full Term (Weeks 37+)", "Lungs fully mature", "Ready to meet the world!"],
      };

      const sizes: Record<number, string> = {
        1: "Poppy Seed",
        2: "Blueberry",
        3: "Plum",
        4: "Avocado",
        5: "Banana",
        6: "Cauliflower",
        7: "Eggplant",
        8: "Honeydew Melon",
        9: "Watermelon / Pumpkin",
      };

      return {
        weeks,
        days,
        total_days: totalDays,
        current_month: currentMonth,
        current_trimester: currentTrimester,
        trimester_name: trimesterName,
        percentage_completed: percentage,
        estimated_due_date: formatDate(edd),
        baby_size_comparison: sizes[currentMonth] || "Full Term Baby",
        fetal_development_milestones: milestonesByMonth[currentMonth] || [],
        trimester_timeline: [
          { trimester: 1, name: "First Trimester", weeks: "Weeks 1 - 13", active: currentTrimester === 1 },
          { trimester: 2, name: "Second Trimester", weeks: "Weeks 14 - 27", active: currentTrimester === 2 },
          { trimester: 3, name: "Third Trimester", weeks: "Weeks 28 - 40+", active: currentTrimester === 3 },
        ],
      };
    });
  },

  // 8. Due Date
  async calculateDueDate(method: "last_period" | "conception", inputDate: string, cycleLength: number = 28): Promise<DueDateResult> {
    return postCalculator("due-date", { method, date: inputDate, cycle_length: cycleLength }, () => {
      const parsed = parseDate(inputDate);
      const today = new Date();
      let edd: Date;
      let conception: Date;
      let gestDays: number;

      if (method === "last_period") {
        const cycleAdj = cycleLength - 28;
        edd = addDays(parsed, 280 + cycleAdj);
        conception = addDays(parsed, cycleLength - 14);
        gestDays = Math.max(0, Math.floor((today.getTime() - parsed.getTime()) / (1000 * 60 * 60 * 24)));
      } else {
        conception = parsed;
        edd = addDays(conception, 266);
        const lmpRef = addDays(conception, -14);
        gestDays = Math.max(0, Math.floor((today.getTime() - lmpRef.getTime()) / (1000 * 60 * 60 * 24)));
      }

      const weeks = Math.floor(gestDays / 7);
      const days = gestDays % 7;
      const daysRem = Math.max(0, Math.floor((edd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
      const progress = Math.min(100, Number(((gestDays / 280) * 100).toFixed(1)));
      const trimester = weeks < 14 ? 1 : weeks < 28 ? 2 : 3;

      const lmpRef = addDays(edd, -280);
      return {
        estimated_due_date: formatDate(edd),
        conception_date: formatDate(conception),
        gestational_age_weeks: weeks,
        gestational_age_days: days,
        current_trimester: trimester,
        days_remaining: daysRem,
        percentage_progress: progress,
        milestones: [
          { milestone: "Heartbeat on Ultrasound", date: formatDate(addDays(lmpRef, 42)), gestational_age: "6 Weeks", description: "Rhythmic cardiac tube pulsations visible on scan." },
          { milestone: "End of First Trimester", date: formatDate(addDays(lmpRef, 91)), gestational_age: "13 Weeks", description: "Placenta fully operational; fatigue begins subsiding." },
          { milestone: "Anatomy Ultrasound Scan", date: formatDate(addDays(lmpRef, 140)), gestational_age: "20 Weeks", description: "Detailed anatomical evaluation of baby's organs." },
          { milestone: "Fetal Viability", date: formatDate(addDays(lmpRef, 168)), gestational_age: "24 Weeks", description: "Important medical threshold for survival with neonatal care." },
          { milestone: "Full Term Delivery Window", date: formatDate(addDays(lmpRef, 259)), gestational_age: "37 - 40 Weeks", description: "Baby is fully developed and ready for labor." },
        ],
        clinical_guideline: `Estimated Delivery Date: ${edd.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}. Only about 4-5% of babies arrive on their exact due date.`,
      };
    });
  },

  // 9. IVF Due Date
  async calculateIvfDueDate(transferDate: string, transferType: "tr-1" | "tr-2" | "tr-3" | "tr-4" = "tr-2"): Promise<IvfDueDateResult> {
    return postCalculator("ivf-due-date", { date: transferDate, transfer_type: transferType }, () => {
      const parsed = parseDate(transferDate);
      const today = new Date();
      let addDaysCount = 261;
      let offset = 19;
      let label = "Day 5 Blastocyst Transfer";

      if (transferType === "tr-1") {
        addDaysCount = 263;
        offset = 17;
        label = "Day 3 Embryo Transfer";
      } else if (transferType === "tr-4") {
        addDaysCount = 260;
        offset = 20;
        label = "Day 6 Blastocyst Transfer";
      } else if (transferType === "tr-3") {
        addDaysCount = 266;
        offset = 14;
        label = "Egg Retrieval / Day 0";
      }

      const edd = addDays(parsed, addDaysCount);
      const theoreticalLmp = addDays(parsed, -offset);
      const gestDays = Math.max(0, Math.floor((today.getTime() - theoreticalLmp.getTime()) / (1000 * 60 * 60 * 24)));
      const weeks = Math.floor(gestDays / 7);
      const days = gestDays % 7;
      const daysRem = Math.max(0, Math.floor((edd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

      return {
        estimated_due_date: formatDate(edd),
        theoretical_lmp: formatDate(theoreticalLmp),
        gestational_age_weeks: weeks,
        gestational_age_days: days,
        days_remaining: daysRem,
        transfer_type_label: label,
        milestones: [
          { milestone: "Beta hCG Blood Test", date: formatDate(addDays(parsed, transferType === "tr-2" ? 10 : 14)), gestational_age: "~4 Weeks", description: "Serum hCG test to confirm implantation." },
          { milestone: "First Viability Scan", date: formatDate(addDays(theoreticalLmp, 45)), gestational_age: "6.5 Weeks", description: "Confirmation of gestational sac and fetal cardiac activity." },
          { milestone: "Graduation to OB/GYN", date: formatDate(addDays(theoreticalLmp, 70)), gestational_age: "10 Weeks", description: "Discontinuation of supplemental fertility medications." },
        ],
        clinical_explanation: `Because transfer timing is precisely documented in IVF, your estimated due date of ${edd.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })} is among the most accurate in obstetrics.`,
      };
    });
  },

  // 10. Due Date by Ultrasound
  async calculateUltrasoundDueDate(ultrasoundDate: string, weeks: number, days: number = 0, crlMm?: number): Promise<UltrasoundDueDateResult> {
    return postCalculator("due-date-by-ultrasound", { ultrasound_date: ultrasoundDate, weeks, days, crl_mm: crlMm }, () => {
      const scanDate = parseDate(ultrasoundDate);
      const today = new Date();
      const scanDays = weeks * 7 + days;
      const edd = addDays(scanDate, 280 - scanDays);
      const theoreticalLmp = addDays(scanDate, -scanDays);
      const conception = addDays(theoreticalLmp, 14);

      const daysSinceScan = Math.floor((today.getTime() - scanDate.getTime()) / (1000 * 60 * 60 * 24));
      const currentDays = Math.max(0, scanDays + daysSinceScan);
      const currentWeeks = Math.floor(currentDays / 7);
      const currentDaysRem = currentDays % 7;
      const daysRem = Math.max(0, Math.floor((edd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

      return {
        estimated_due_date: formatDate(edd),
        estimated_conception_date: formatDate(conception),
        gestational_age_at_scan_days: scanDays,
        current_gestational_age_weeks: currentWeeks,
        current_gestational_age_days: currentDaysRem,
        days_remaining: daysRem,
        acog_redating_criteria: "According to ACOG Committee Opinion No. 700, first trimester ultrasound (<14 weeks) is the most accurate method to establish gestational age. If scan dating differs from LMP dating by >5-7 days, ultrasound dating is adopted as the final EDD.",
        scan_insights: `Based on your scan on ${scanDate.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })} measuring ${weeks}w ${days}d, your estimated due date is ${edd.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}.`,
      };
    });
  },
};
