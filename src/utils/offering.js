import { DAYS, formatTimeRange, startOffset } from './schedule';

const SHORT_DAYS = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };

// "Mon, Wed 3 pm – 4:30 pm" for a batch's weekly class times.
export const summarizeTimes = (times = []) => {
  if (!times.length) return 'Class times not published yet';
  const sorted = [...times].sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));
  const groups = new Map();
  sorted.forEach((time) => {
    const range = formatTimeRange(time.startHour, time.duration);
    if (!groups.has(range)) groups.set(range, []);
    groups.get(range).push(SHORT_DAYS[time.day] || time.day);
  });
  return [...groups.entries()].map(([range, days]) => `${days.join(', ')} ${range}`).join('; ');
};

// The batch a student is most likely to join: the next one to start, otherwise the latest.
export const nextBatch = (batches = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = batches.filter((batch) => new Date(batch.startDate) >= today);
  if (upcoming.length) return upcoming.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];
  return [...batches].sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0] || null;
};

const isWeekend = (day) => day === 'Saturday' || day === 'Sunday';

export const meetsOn = (offering, when) => {
  if (when === 'any') return true;
  const times = offering.batches.flatMap((batch) => batch.times);
  if (!times.length) return false;
  return when === 'weekends' ? times.some((t) => isWeekend(t.day)) : times.some((t) => !isWeekend(t.day));
};

// Evening means classes starting at 5 pm or later.
export const startsInEvening = (offering) =>
  offering.batches.some((batch) => batch.times.some((time) => startOffset(time.startHour) >= 5));
