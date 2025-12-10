export const saveUser = (user) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('xavron_user', JSON.stringify(user));
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('xavron_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

export const clearUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('xavron_user');
};

