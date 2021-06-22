import axios from 'axios';
import { useEffect, useState } from 'react';
import { authHeader } from '../helper/auth';
import { getUser } from '../helper/localStorage';
import { Role } from '../helper/shared';

export const useAgentRequests = () => {
  const [requests, setRequests] = useState([]);

  const getRequests = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/admin/requests/`,
      authHeader()
    );
    setRequests(response.data);
  };

  const approve = async (id: string) => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/admin/requests/${id}/approve`,
      {},
      authHeader()
    );
    getRequests();
  };

  const reject = async (id: string) => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/admin/requests/${id}/reject`,
      {},
      authHeader()
    );
    getRequests();
  };

  useEffect(() => {
    if (getUser().role === Role.Admin) {
      getRequests();
    }
  }, []);

  return { requests, approve, reject };
};
