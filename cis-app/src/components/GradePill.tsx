const GRADE_STYLES: Record<string, string> = {
  A: 'bg-green-bg text-green',
  B: 'bg-blue-bg text-blue',
  C: 'bg-amber-bg text-amber',
  D: 'bg-red-bg text-red',
  F: 'bg-red-bg text-red',
};

export default function GradePill({ grade }: { grade: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${GRADE_STYLES[grade] ?? ''}`}
    >
      {grade}
    </span>
  );
}
