import jwtDecode from 'jwt-decode';

export interface User {
  fullName: string;
  id: string;
}

export const removeUser = () => {
  localStorage.removeItem('token');
};

export const saveUser = (token: string) => {
  localStorage.setItem('token', token);
};

export const getUser = (): User => {
  const token = localStorage.getItem('token');
  return token ? jwtDecode(token) : { fullName: '', id: '' };
};
