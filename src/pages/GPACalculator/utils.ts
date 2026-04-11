export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'F';
export type CourseWeight = 'Regular' | 'Honors' | 'AP' | 'IB' | 'Dual Enrollment';
export type GpaScale = '4.0' | '4.3';

export interface Course {
  id: string;
  name: string;
  credits: number;
  grade: Grade | '';
  weight: CourseWeight;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
  isQuickEntry?: boolean;
  quickGpa?: number;
  quickCredits?: number;
}

export const GRADE_POINTS_4_0: Record<Grade, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0
};

export const GRADE_POINTS_4_3: Record<Grade, number> = {
  'A+': 4.3, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0
};

export const WEIGHT_BONUS: Record<CourseWeight, number> = {
  'Regular': 0.0,
  'Honors': 0.5,
  'AP': 1.0,
  'IB': 1.0,
  'Dual Enrollment': 0.5
};

export const GRADE_REFERENCE = [
  { letter: 'A+', p40: 4.0, p43: 4.3, pct: '97–100%', desc: 'Exceptional' },
  { letter: 'A', p40: 4.0, p43: 4.0, pct: '93–96%', desc: 'Excellent' },
  { letter: 'A-', p40: 3.7, p43: 3.7, pct: '90–92%', desc: 'Very Good' },
  { letter: 'B+', p40: 3.3, p43: 3.3, pct: '87–89%', desc: 'Good' },
  { letter: 'B', p40: 3.0, p43: 3.0, pct: '83–86%', desc: 'Above Average' },
  { letter: 'B-', p40: 2.7, p43: 2.7, pct: '80–82%', desc: 'Average' },
  { letter: 'C+', p40: 2.3, p43: 2.3, pct: '77–79%', desc: 'Below Average' },
  { letter: 'C', p40: 2.0, p43: 2.0, pct: '73–76%', desc: 'Satisfactory' },
  { letter: 'C-', p40: 1.7, p43: 1.7, pct: '70–72%', desc: 'Poor' },
  { letter: 'D+', p40: 1.3, p43: 1.3, pct: '67–69%', desc: 'Barely Passing' },
  { letter: 'D', p40: 1.0, p43: 1.0, pct: '63–66%', desc: 'Passing' },
  { letter: 'D-', p40: 0.7, p43: 0.7, pct: '60–62%', desc: 'Minimum Passing' },
  { letter: 'F', p40: 0.0, p43: 0.0, pct: '0–59%', desc: 'Failing' },
];

export function getGradeEquivalent(gpa: number, scale: GpaScale): string {
  const points = scale === '4.0' ? GRADE_POINTS_4_0 : GRADE_POINTS_4_3;
  let closest = 'F';
  let minDiff = Infinity;
  for (const [grade, val] of Object.entries(points)) {
    const diff = Math.abs(gpa - val);
    if (diff < minDiff) {
      minDiff = diff;
      closest = grade;
    }
  }
  return closest;
}

export function getPercentageEquivalent(gpa: number, scale: GpaScale): string {
  const grade = getGradeEquivalent(gpa, scale);
  const ref = GRADE_REFERENCE.find(r => r.letter === grade);
  return ref ? ref.pct : 'N/A';
}

export function getAcademicStanding(gpa: number) {
  if (gpa >= 3.9) return { label: '🏆 Summa Cum Laude', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
  if (gpa >= 3.7) return { label: '🥇 Magna Cum Laude', color: 'bg-amber-100 text-amber-800 border-amber-200' };
  if (gpa >= 3.5) return { label: '🥈 Cum Laude / Dean\'s List Eligible', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  if (gpa >= 3.0) return { label: '✅ Good Standing', color: 'bg-blue-100 text-blue-800 border-blue-200' };
  if (gpa >= 2.0) return { label: '⚠️ Satisfactory', color: 'bg-slate-100 text-slate-800 border-slate-200' };
  return { label: '🚨 Academic Probation Risk', color: 'bg-red-100 text-red-800 border-red-200' };
}

export interface ProcessedCourse extends Course {
  unweightedPoints: number;
  weightedPoints: number;
  contribution: number;
}

export interface SemesterResult {
  id: string;
  name: string;
  totalCredits: number;
  unweightedGpa: number;
  weightedGpa: number;
  totalUnweightedPoints: number;
  totalWeightedPoints: number;
  courses: ProcessedCourse[];
  weightedCourseCount: number;
  cumulativeGpaAfter?: number;
}

export function calculateSemesterGPA(courses: Course[], scale: GpaScale): SemesterResult {
  let totalCredits = 0;
  let totalUnweightedPoints = 0;
  let totalWeightedPoints = 0;
  let weightedCourseCount = 0;
  
  const pointsMap = scale === '4.0' ? GRADE_POINTS_4_0 : GRADE_POINTS_4_3;
  const maxWeighted = scale === '4.0' ? 5.0 : 5.3;

  const processedCourses = courses.filter(c => c.grade !== '').map(c => {
    const basePoints = pointsMap[c.grade as Grade];
    const bonus = WEIGHT_BONUS[c.weight];
    
    // Cap weighted points
    const weightedPointValue = Math.min(basePoints + bonus, maxWeighted);
    
    const unweightedPoints = basePoints * c.credits;
    const weightedPoints = weightedPointValue * c.credits;
    
    totalCredits += c.credits;
    totalUnweightedPoints += unweightedPoints;
    totalWeightedPoints += weightedPoints;
    
    if (bonus > 0) weightedCourseCount++;

    return {
      ...c,
      unweightedPoints: basePoints,
      weightedPoints: weightedPointValue,
      contribution: weightedPoints
    };
  });

  const unweightedGpa = totalCredits > 0 ? totalUnweightedPoints / totalCredits : 0;
  const weightedGpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;

  return {
    id: 'sem',
    name: 'Semester',
    totalCredits,
    unweightedGpa,
    weightedGpa,
    totalUnweightedPoints,
    totalWeightedPoints,
    courses: processedCourses,
    weightedCourseCount
  };
}

export interface CumulativeResult {
  totalCredits: number;
  unweightedGpa: number;
  weightedGpa: number;
  totalUnweightedPoints: number;
  totalWeightedPoints: number;
  weightedCourseCount: number;
  semesters: SemesterResult[];
}

export function calculateCumulativeGPA(semesters: Semester[], scale: GpaScale): CumulativeResult {
  let totalCredits = 0;
  let totalUnweightedPoints = 0;
  let totalWeightedPoints = 0;
  let weightedCourseCount = 0;
  
  const processedSemesters: SemesterResult[] = [];

  for (const sem of semesters) {
    if (sem.isQuickEntry) {
      if (sem.quickCredits && sem.quickGpa !== undefined) {
        totalCredits += sem.quickCredits;
        const pts = sem.quickGpa * sem.quickCredits;
        totalUnweightedPoints += pts;
        totalWeightedPoints += pts;
        
        const currentCumGpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
        
        processedSemesters.push({
          id: sem.id,
          name: sem.name || 'Quick Entry',
          totalCredits: sem.quickCredits,
          unweightedGpa: sem.quickGpa,
          weightedGpa: sem.quickGpa,
          totalUnweightedPoints: pts,
          totalWeightedPoints: pts,
          courses: [],
          weightedCourseCount: 0,
          cumulativeGpaAfter: currentCumGpa
        });
      }
    } else {
      const semRes = calculateSemesterGPA(sem.courses, scale);
      if (semRes.totalCredits > 0) {
        totalCredits += semRes.totalCredits;
        totalUnweightedPoints += semRes.totalUnweightedPoints;
        totalWeightedPoints += semRes.totalWeightedPoints;
        weightedCourseCount += semRes.weightedCourseCount;
        
        const currentCumGpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
        
        processedSemesters.push({
          ...semRes,
          id: sem.id,
          name: sem.name || 'Semester',
          cumulativeGpaAfter: currentCumGpa
        });
      }
    }
  }

  const unweightedGpa = totalCredits > 0 ? totalUnweightedPoints / totalCredits : 0;
  const weightedGpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;

  return {
    totalCredits,
    unweightedGpa,
    weightedGpa,
    totalUnweightedPoints,
    totalWeightedPoints,
    weightedCourseCount,
    semesters: processedSemesters
  };
}

export interface TargetResult {
  currentGpa: number;
  creditsCompleted: number;
  targetGpa: number;
  creditsRemaining: number;
  requiredGpa: number;
  difficulty: string;
  status: 'achieved' | 'possible' | 'impossible';
  whatIfs: { gpa: number; result: number }[];
}

export function calculateTargetGPA(currentGpa: number, creditsCompleted: number, targetGpa: number, creditsRemaining: number, scale: GpaScale): TargetResult {
  const requiredGpa = (targetGpa * (creditsCompleted + creditsRemaining) - currentGpa * creditsCompleted) / creditsRemaining;
  
  const maxScale = scale === '4.0' ? 4.0 : 4.3;
  
  let status: 'achieved' | 'possible' | 'impossible' = 'possible';
  let difficulty = '';

  if (requiredGpa < 0) {
    status = 'achieved';
    difficulty = 'Already Achieved';
  } else if (requiredGpa > maxScale) {
    status = 'impossible';
    difficulty = 'Not Achievable';
  } else {
    if (requiredGpa <= 2.0) difficulty = 'Easy';
    else if (requiredGpa <= 3.0) difficulty = 'Moderate';
    else if (requiredGpa <= 3.5) difficulty = 'Challenging';
    else difficulty = 'Very Challenging';
  }

  const whatIfGpas = [4.0, 3.7, 3.3, 3.0, 2.7, 2.0];
  const whatIfs = whatIfGpas.map(gpa => ({
    gpa,
    result: (currentGpa * creditsCompleted + gpa * creditsRemaining) / (creditsCompleted + creditsRemaining)
  }));

  if (status === 'possible' && !whatIfGpas.includes(Number(requiredGpa.toFixed(2)))) {
    whatIfs.push({
      gpa: requiredGpa,
      result: targetGpa
    });
    whatIfs.sort((a, b) => b.gpa - a.gpa);
  }

  return {
    currentGpa,
    creditsCompleted,
    targetGpa,
    creditsRemaining,
    requiredGpa,
    difficulty,
    status,
    whatIfs
  };
}
