// Base URL of the single EduHub backend (auth, student, enrollment and institute APIs).
export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || process.env.VITE_BACKEND_URL || '';

export default BACKEND_URL;
