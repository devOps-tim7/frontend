import axios from 'axios';
import { useEffect, useState } from 'react';
import { getUser } from '../helper/localStorage';
import { Role, Decision } from '../helper/shared';

export const useReports = () => {
  const [reports, setReports] = useState([]);

  const getReports = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/reports/`);
    setReports(response.data);
  };

  const handleReport = async (id: string, decision: Decision) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/reports/${id}/${decision}`);
    getReports();
  };

  useEffect(() => {
    if (getUser().role === Role.Admin) {
      getReports();
    }
  }, []);

  return { reports, handleReport };
};
