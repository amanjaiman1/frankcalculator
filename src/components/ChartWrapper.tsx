'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const darkThemeDefaults: Partial<ChartOptions<'doughnut'>> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      labels: {
        color: '#e2e8f0',
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(17, 17, 24, 0.9)',
      titleColor: '#e2e8f0',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(0, 212, 255, 0.3)',
      borderWidth: 1,
    },
  },
};

const lineBarDefaults: Partial<ChartOptions<'line'>> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      labels: {
        color: '#e2e8f0',
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(17, 17, 24, 0.9)',
      titleColor: '#e2e8f0',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(0, 212, 255, 0.3)',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: { color: '#64748b' },
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
    },
    y: {
      ticks: { color: '#64748b' },
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
    },
  },
};

export const chartColors = {
  electricBlue: '#00d4ff',
  neonGreen: '#00ff88',
  hotOrange: '#ff6b35',
  vividPurple: '#a855f7',
  electricPink: '#ff006e',
  accentCyan: '#06b6d4',
};

interface ChartWrapperProps {
  children: React.ReactNode;
  title?: string;
}

export function ChartContainer({ children, title }: ChartWrapperProps) {
  return (
    <div className="glass-card p-6">
      {title && (
        <h3 className="text-sm font-medium text-gray-300 mb-4">{title}</h3>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

export function DarkDoughnut({ data, options = {} }: { data: React.ComponentProps<typeof Doughnut>['data']; options?: Partial<ChartOptions<'doughnut'>> }) {
  const mergedOptions = { ...darkThemeDefaults, ...options } as ChartOptions<'doughnut'>;
  return <Doughnut data={data} options={mergedOptions} />;
}

export function DarkLine({ data, options = {} }: { data: React.ComponentProps<typeof Line>['data']; options?: Partial<ChartOptions<'line'>> }) {
  const mergedOptions = { ...lineBarDefaults, ...options } as ChartOptions<'line'>;
  return <Line data={data} options={mergedOptions} />;
}

export function DarkBar({ data, options = {} }: { data: React.ComponentProps<typeof Bar>['data']; options?: Partial<ChartOptions<'bar'>> }) {
  const mergedOptions = { ...lineBarDefaults, ...options } as ChartOptions<'bar'>;
  return <Bar data={data} options={mergedOptions} />;
}
