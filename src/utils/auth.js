export const OFFICER_PASSWORD = import.meta.env.VITE_OFFICER_PASSWORD;

console.log('OFFICER_PASSWORD loaded:', OFFICER_PASSWORD ? 'yes' : 'no');

export const isOfficer = () => {
  return localStorage.getItem('lunation_officer') === 'true';
};

export const login = (password) => {
  console.log('login() called with:', password, 'expected:', OFFICER_PASSWORD);
  if (password === OFFICER_PASSWORD) {
    localStorage.setItem('lunation_officer', 'true');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('lunation_officer');
};