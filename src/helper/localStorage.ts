import jwtDecode from 'jwt-decode';
import { Role } from './shared';

export interface User {
  fullName: string;
  id: string;
  role: Role;
}

export const removeUser = () => {
  localStorage.removeItem('token');
};

export const saveUser = (token: string) => {
  localStorage.setItem('token', token);
};

export const getUser = (): User => {
  const token = localStorage.getItem('token');
  return token ? jwtDecode(token) : { fullName: '', id: '', role: Role.User };
};
