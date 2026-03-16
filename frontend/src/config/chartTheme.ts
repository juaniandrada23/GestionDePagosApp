import type { TooltipOptions } from 'chart.js';

export const CHART_COLORS = {
  primary: '#006989',
  primaryHover: '#004E66',
  primaryFill: 'rgba(0, 105, 137, 0.15)',
  accent: '#FF5714',
  accentHover: '#CC4610',
  accentFill: 'rgba(255, 87, 20, 0.15)',
  emerald: '#10B981',
  emeraldHover: '#059669',
  red: '#EF4444',
  redHover: '#DC2626',
  amber: '#F59E0B',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
} as const;

export const DONUT_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.accent,
  CHART_COLORS.emerald,
  CHART_COLORS.amber,
  CHART_COLORS.purple,
  CHART_COLORS.pink,
  CHART_COLORS.indigo,
] as const;

export const BAR_COLORS = [CHART_COLORS.primary, CHART_COLORS.accent] as const;

export const TOOLTIP_STYLE: Partial<TooltipOptions> = {
  backgroundColor: 'rgba(17, 24, 39, 0.88)',
  titleColor: '#F9FAFB',
  bodyColor: '#E5E7EB',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  borderWidth: 1,
  cornerRadius: 8,
  padding: 10,
  titleFont: { size: 13, weight: 'bold' },
  bodyFont: { size: 12 },
  displayColors: true,
  boxPadding: 4,
};

export const AXIS_STYLE = {
  x: {
    grid: { display: false },
    ticks: {
      color: '#4B5563',
      font: { size: 12, weight: 'bold' as const },
      maxRotation: 45,
      maxTicksLimit: 15,
    },
  },
  y: {
    beginAtZero: true,
    grid: { color: 'rgba(0, 0, 0, 0.08)' },
    ticks: { precision: 0, color: '#4B5563', font: { size: 12 } },
  },
} as const;
