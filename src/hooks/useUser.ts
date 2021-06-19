import axios from 'axios';
import { useEffect, useState } from 'react';
import { authHeader } from '../helper/auth';
import { Gender, Role } from '../helper/shared';
import moment from 'moment';

const initialState = {
  username: '',
  password: '',
  fullName: '',
  email: '',
  phone: '',
  gender: Gender.Male,
  birthDate: moment(new Date()).format('yyyy-MM-DD'),
  description: '',
  website: '',
  private: false,
  taggable: false,
  role: Role.User,
};

export const useUser = (getProfile: boolean) => {
  const [user, setUser] = useState<Record<string, any>>(initialState);

  useEffect(() => {
    getSingle(getProfile);
  }, [getProfile]);

  const getSingle = async (getProfile: boolean) => {
    if (getProfile) {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        authHeader()
      );
      setUser({
        ...response.data,
        birthDate: moment(response.data.birthDate).format('yyyy-MM-DD'),
      });
    }
  };

  const updateUser = async () => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/users`, { ...user }, authHeader());
    getSingle(true);
  };

  return { user, setUser, updateUser };
};
