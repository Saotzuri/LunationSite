export const OFFICER_PASSWORD = import.meta.env.VITE_OFFICER_PASSWORD;

export const isOfficer = () => {
  return localStorage.getItem('lunation_officer') === 'true';
};

export const login = (password) => {
  if (password === OFFICER_PASSWORD) {
    localStorage.setItem('lunation_officer', 'true');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('lunation_officer');
};