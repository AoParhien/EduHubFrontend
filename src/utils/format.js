// Shared display helpers so prices, boards and formats read the same on every page.

export const formatRupees = (amount) => `Rs ${Number(amount || 0).toLocaleString('en-PK')}`;

const BOARD_LABELS = {
  olevels: 'O Levels',
  alevels: 'A Levels',
  matric: 'Matric',
  intermediate: 'Intermediate',
  inter: 'Intermediate',
  edexcel: 'Edexcel',
  sat: 'SAT',
  ecat: 'ECAT',
  mcat: 'MCAT',
  bcom: 'B.Com',
};

export const normalizeBoard = (board = '') =>
  String(board).replace(/['\s.]/g, '').toLowerCase();

export const formatBoard = (board) => BOARD_LABELS[normalizeBoard(board)] || board || '';

// Boards a student can browse. `slug` is what the course listing API expects.
export const BOARDS = [
  { slug: 'olevels', label: 'O Levels' },
  { slug: 'alevels', label: 'A Levels' },
  { slug: 'matric', label: 'Matric' },
  { slug: 'intermediate', label: 'Intermediate' },
  { slug: 'edexcel', label: 'Edexcel' },
  { slug: 'ecat', label: 'ECAT' },
  { slug: 'mcat', label: 'MCAT' },
];

export const formatClassFormat = (format) => {
  if (!format) return '';
  if (format === 'InPerson') return 'In person';
  return format;
};

export const formatMonths = (months) => {
  const n = Number(months);
  if (!n) return '';
  return `${n} ${n === 1 ? 'month' : 'months'}`;
};
