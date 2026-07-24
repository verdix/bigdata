import type { ReactNode } from 'react';
import GradePill from './GradePill';

export interface LeaderboardColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface LeaderboardProps<T> {
  title: string;
  rows: T[];
  getId: (row: T) => string;
  getName: (row: T) => string;
  getComposite: (row: T) => number;
  getGrade: (row: T) => string;
  columns: LeaderboardColumn<T>[];
}

export default function Leaderboard<T>({
  title,
  rows,
  getId,
  getName,
  getComposite,
  getGrade,
  columns,
}: LeaderboardProps<T>) {
  const sorted = [...rows].sort((a, b) => getComposite(b) - getComposite(a));

  if (sorted.length === 0) {
    return (
      <div className="bg-card border border-line rounded-xl p-6 text-center text-gray text-sm">
        No results to rank yet.
      </div>
    );
  }

  return (
    <div className="bg-card border border-line rounded-xl overflow-hidden">
      <h3 className="font-semibold text-navy px-5 pt-5 pb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray border-y border-line">
              <th className="px-4 py-2 font-medium">#</th>
              <th className="px-4 py-2 font-medium">Name</th>
              {columns.map((c) => (
                <th
                  key={c.header}
                  className={`px-4 py-2 font-medium ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  {c.header}
                </th>
              ))}
              <th className="px-4 py-2 font-medium text-right">Score</th>
              <th className="px-4 py-2 font-medium text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={getId(row)}
                className={`border-b border-line last:border-0 ${i === 0 ? 'bg-gold/10' : ''}`}
              >
                <td className="px-4 py-3 font-semibold text-gray">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-ink">{getName(row)}</td>
                {columns.map((c) => (
                  <td
                    key={c.header}
                    className={`px-4 py-3 ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {c.render(row)}
                  </td>
                ))}
                <td className="px-4 py-3 text-right font-bold text-navy">
                  {getComposite(row).toFixed(1)}
                </td>
                <td className="px-4 py-3 text-center">
                  <GradePill grade={getGrade(row)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
