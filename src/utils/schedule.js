// Class times are stored as afternoon/evening hour slots such as "3-4" (3 pm) or
// "3:30", plus a duration in hours. These helpers turn them into readable times.

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Hour slots as stored in the database, starting at noon.
export const HOUR_SLOTS = ['12-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12'];

// Returns the start time as hours after noon (e.g. "3-4" -> 3, "3:30" -> 3.5, "12-1" -> 0).
export const startOffset = (startHour) => {
    if (startHour === undefined || startHour === null) return NaN;
    const value = String(startHour);
    const slotIndex = HOUR_SLOTS.indexOf(value);
    if (slotIndex !== -1) return slotIndex;

    const [hours, minutes = 0] = value.includes(':')
        ? value.split(':').map(Number)
        : [parseFloat(value), 0];

    if (Number.isNaN(hours)) return NaN;
    return (hours % 12) + minutes / 60;
};

export const formatTime = (offset) => {
    const total = Math.round(offset * 60);
    const hours24 = 12 + Math.floor(total / 60);
    const minutes = total % 60;
    const hours12 = hours24 > 12 ? hours24 - 12 : hours24;
    const suffix = hours24 >= 24 ? 'am' : 'pm';
    return `${hours12 === 0 ? 12 : hours12}${minutes ? `:${String(minutes).padStart(2, '0')}` : ''} ${suffix}`;
};

export const formatTimeRange = (startHour, duration) => {
    const start = startOffset(startHour);
    if (Number.isNaN(start)) return '';
    return `${formatTime(start)} – ${formatTime(start + Number(duration || 1))}`;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const describeStart = (dateString) => {
    const formatted = formatDate(dateString);
    if (!formatted) return '';
    const isPast = new Date(dateString).getTime() < Date.now();
    return `${isPast ? 'Started' : 'Starts'} ${formatted}`;
};

// Batch colours: a light fill readable with dark text, plus a stronger accent.
export const BATCH_COLORS = [
    { fill: '#e1e9fa', accent: '#00308f' },
    { fill: '#fdf1c4', accent: '#b8930a' },
    { fill: '#dcf2e4', accent: '#1f7a4a' },
    { fill: '#ece2fa', accent: '#6b3fb5' },
    { fill: '#fde1d8', accent: '#c2502b' },
    { fill: '#d9eff3', accent: '#1d7385' },
];

export const batchColor = (index) => BATCH_COLORS[index % BATCH_COLORS.length];
