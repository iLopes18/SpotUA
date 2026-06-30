import { EventCategory, Campus, UAEvent } from './types';

// Helper to get local date string YYYY-MM-DD for any date offset
export function getOffsetDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get day and month formatted (e.g., "30 Jun" or "1 Jul")
export function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  return `${day} ${months[date.getMonth()]}`;
}

// Get weekday name abbreviated (e.g., "Ter", "Qua")
export function formatWeekdayLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return weekdays[date.getDay()];
}

// Generate the 7 days starting from today (dynamic timeline)
export function getNext7Days(): string[] {
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(getOffsetDateString(i));
  }
  return days;
}

export const SEEDED_EVENTS: UAEvent[] = [];

export const CATEGORY_STYLES: Record<EventCategory, { bg: string; text: string; border: string; accentBg: string; shadow: string }> = {
  [EventCategory.ACADEMICOS]: {
    bg: 'bg-[#3B82F6]',
    text: 'text-white',
    border: 'border-black',
    accentBg: 'bg-blue-600',
    shadow: 'shadow-[6px_6px_0px_0px_#3B82F6]',
  },
  [EventCategory.DESPORTO]: {
    bg: 'bg-[#10B981]',
    text: 'text-white',
    border: 'border-black',
    accentBg: 'bg-emerald-600',
    shadow: 'shadow-[6px_6px_0px_0px_#10B981]',
  },
  [EventCategory.FESTAS]: {
    bg: 'bg-[#EF4444]',
    text: 'text-white',
    border: 'border-black',
    accentBg: 'bg-red-600',
    shadow: 'shadow-[6px_6px_0px_0px_#EF4444]',
  },
  [EventCategory.WORKSHOPS]: {
    bg: 'bg-[#8B5CF6]',
    text: 'text-white',
    border: 'border-black',
    accentBg: 'bg-purple-600',
    shadow: 'shadow-[6px_6px_0px_0px_#8B5CF6]',
  },
  [EventCategory.CULTURA]: {
    bg: 'bg-[#F59E0B]',
    text: 'text-white',
    border: 'border-black',
    accentBg: 'bg-amber-600',
    shadow: 'shadow-[6px_6px_0px_0px_#F59E0B]',
  },
  [EventCategory.CIENCIA]: {
    bg: 'bg-[#06B6D4]',
    text: 'text-white',
    border: 'border-black',
    accentBg: 'bg-cyan-600',
    shadow: 'shadow-[6px_6px_0px_0px_#06B6D4]',
  },
};
