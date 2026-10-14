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
  mcat: 'MDCAT',
  mdcat: 'MDCAT',
  bcom: 'B.Com',
};

export const normalizeBoard = (board = '') =>
  String(board).replace(/['\s.]/g, '').toLowerCase();

export const formatBoard = (board) => BOARD_LABELS[normalizeBoard(board)] || board || '';

// Boards a student can browse; must match backend/modules/catalog/data/boards.js.
export const BOARDS = [
  { slug: 'olevels', label: 'O Levels', levels: ['O Level'] },
  { slug: 'alevels', label: 'A Levels', levels: ['AS Level', 'A2 Level'] },
  { slug: 'matric', label: 'Matric', levels: ['Class 9', 'Class 10'] },
  { slug: 'intermediate', label: 'Intermediate', levels: ['XI', 'XII'] },
  { slug: 'mdcat', label: 'MDCAT', levels: ['MDCAT'] },
  { slug: 'ecat', label: 'ECAT', levels: ['ECAT'] },
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
