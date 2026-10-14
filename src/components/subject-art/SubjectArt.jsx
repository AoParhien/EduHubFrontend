import React from 'react';

/*
 * Illustration for a subject, drawn in SVG so every subject gets artwork
 * without anyone uploading images. Subjects are grouped into families that
 * share a colour and a motif (formulas for maths, an atom for physics…).
 */

const FAMILIES = {
  maths: { bg: '#e7edfb', ink: '#00308f' },
  physics: { bg: '#dcf0f3', ink: '#14606f' },
  chemistry: { bg: '#ebe3fa', ink: '#5b33a3' },
  biology: { bg: '#def2e5', ink: '#1f6b43' },
  computing: { bg: '#e2e6ef', ink: '#1b2a4a' },
  english: { bg: '#f3e6ef', ink: '#8a2f63' },
  urdu: { bg: '#fde6dc', ink: '#a8431f' },
  islamiyat: { bg: '#fbf1cf', ink: '#8a6a00' },
  pakistan: { bg: '#e0f0e6', ink: '#0b5a33' },
  history: { bg: '#f1e9df', ink: '#7a4e22' },
  geography: { bg: '#dfeefa', ink: '#1d5d93' },
  business: { bg: '#e6f2dc', ink: '#3f6b14' },
  society: { bg: '#f6e3e3', ink: '#8f2d3a' },
  prep: { bg: '#fdf1c4', ink: '#7a5a00' },
};

export const subjectFamily = (name = '') => {
  const n = name.toLowerCase();
  if (/math|statistic/.test(n)) return 'maths';
  if (/physic/.test(n)) return 'physics';
  if (/chemis/.test(n)) return 'chemistry';
  if (/biolog/.test(n)) return 'biology';
  if (/computer|information tech/.test(n)) return 'computing';
  if (/urdu|sindhi/.test(n)) return 'urdu';
  if (/english|literature|general paper/.test(n)) return 'english';
  if (/islam/.test(n)) return 'islamiyat';
  if (/pakistan/.test(n)) return 'pakistan';
  if (/history/.test(n)) return 'history';
  if (/geograph|environment/.test(n)) return 'geography';
  if (/econom|account|business|commerce/.test(n)) return 'business';
  if (/sociolog|psycholog|law/.test(n)) return 'society';
  return 'prep';
};

const Motif = ({ family, ink }) => {
  const stroke = { fill: 'none', stroke: ink, strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (family) {
    case 'maths':
      return (
        <g fill={ink}>
          <text x="150" y="118" fontSize="96" fontFamily="Georgia, serif" fontStyle="italic">∑</text>
          <text x="226" y="80" fontSize="54" fontFamily="Georgia, serif" fontStyle="italic" opacity="0.55">π</text>
          <text x="214" y="160" fontSize="44" fontFamily="Georgia, serif" fontStyle="italic" opacity="0.4">√x</text>
        </g>
      );
    case 'physics':
      return (
        <g {...stroke} transform="translate(225 92)">
          <ellipse rx="78" ry="26" />
          <ellipse rx="78" ry="26" transform="rotate(60)" />
          <ellipse rx="78" ry="26" transform="rotate(-60)" />
          <circle r="11" fill={ink} stroke="none" />
        </g>
      );
    case 'chemistry':
      return (
        <g {...stroke}>
          <polygon points="210,46 250,69 250,115 210,138 170,115 170,69" />
          <polygon points="250,115 290,92 290,46 250,23" opacity="0.45" />
          <line x1="181" y1="76" x2="181" y2="108" opacity="0.6" />
          <circle cx="210" cy="92" r="6" fill={ink} stroke="none" />
        </g>
      );
    case 'biology':
      return (
        <g {...stroke}>
          <path d="M170 20 C 250 60, 170 120, 250 160" />
          <path d="M250 20 C 170 60, 250 120, 170 160" opacity="0.55" />
          {[44, 72, 108, 136].map((y) => <line key={y} x1="186" y1={y} x2="234" y2={y} strokeWidth="4" opacity="0.5" />)}
        </g>
      );
    case 'computing':
      return (
        <g fill={ink}>
          <text x="140" y="122" fontSize="88" fontFamily="'Courier New', monospace" fontWeight="700">{'</>'}</text>
        </g>
      );
    case 'english':
      return (
        <g fill={ink}>
          <text x="160" y="126" fontSize="108" fontFamily="Georgia, serif">Aa</text>
        </g>
      );
    case 'urdu':
      return (
        <g fill={ink}>
          <text x="225" y="118" fontSize="84" fontFamily="'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Times New Roman', serif" textAnchor="middle">اردو</text>
        </g>
      );
    case 'islamiyat':
      return (
        <g {...stroke} transform="translate(225 92)">
          <rect x="-50" y="-50" width="100" height="100" />
          <rect x="-50" y="-50" width="100" height="100" transform="rotate(45)" />
          <circle r="18" />
        </g>
      );
    case 'pakistan':
      return (
        <g fill={ink}>
          <path d="M248 42 a54 54 0 1 0 22 92 a44 44 0 1 1 -22 -92 z" />
          <polygon points="262,62 268,80 287,80 272,91 278,109 262,98 246,109 252,91 237,80 256,80" />
        </g>
      );
    case 'history':
      return (
        <g {...stroke}>
          <polygon points="160,62 225,30 290,62" />
          {[176, 208, 240, 272].map((x) => <line key={x} x1={x} y1="76" x2={x} y2="140" />)}
          <line x1="156" y1="152" x2="294" y2="152" />
        </g>
      );
    case 'geography':
      return (
        <g {...stroke} transform="translate(225 92)">
          <circle r="64" />
          <ellipse rx="28" ry="64" />
          <line x1="-64" y1="0" x2="64" y2="0" />
          <path d="M-56 -30 Q0 -18 56 -30" opacity="0.6" />
          <path d="M-56 30 Q0 18 56 30" opacity="0.6" />
        </g>
      );
    case 'business':
      return (
        <g>
          {[[170, 110], [204, 84], [238, 58], [272, 32]].map(([x, y]) => (
            <rect key={x} x={x} y={y} width="24" height={150 - y} rx="4" fill={ink} opacity={0.35 + (x - 170) / 200} />
          ))}
          <path d="M166 100 L208 74 L236 88 L290 30" {...stroke} />
        </g>
      );
    case 'society':
      return (
        <g fill={ink}>
          {[[190, 0.45], [225, 1], [260, 0.45]].map(([x, o]) => (
            <g key={x} opacity={o}>
              <circle cx={x} cy="68" r="17" />
              <path d={`M${x - 28} 140 a28 30 0 0 1 56 0 z`} />
            </g>
          ))}
        </g>
      );
    default:
      return (
        <g {...stroke} transform="translate(225 92)">
          <circle r="64" />
          <circle r="42" opacity="0.7" />
          <circle r="20" opacity="0.5" />
          <circle r="7" fill={ink} stroke="none" />
          <line x1="-86" y1="-58" x2="-6" y2="-6" />
        </g>
      );
  }
};

const SubjectArt = ({ name, label, muted = false, className = '' }) => {
  const family = subjectFamily(name);
  const { bg, ink } = FAMILIES[family];
  return (
    <svg
      className={`subject-art${muted ? ' subject-art--muted' : ''} ${className}`}
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${name} illustration`}
    >
      <rect width="320" height="180" fill={bg} />
      <circle cx="300" cy="-10" r="90" fill={ink} opacity="0.06" />
      <Motif family={family} ink={ink} />
      {label && (
        <g>
          <rect x="14" y="14" rx="11" height="24" width={label.length * 7.4 + 22} fill="#fff" opacity="0.92" />
          <text x="25" y="31" fontSize="13" fontWeight="500" fill={ink} fontFamily="Roboto, system-ui, sans-serif">{label}</text>
        </g>
      )}
    </svg>
  );
};

export default SubjectArt;
