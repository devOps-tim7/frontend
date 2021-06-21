import axios from 'axios';
import { useEffect, useState } from 'react';
import { authHeader } from '../helper/auth';
import { RelationType } from '../helper/shared';

interface RelationProps {
  pending?: boolean;
  toUser?: boolean;
  loggedIn: boolean;
}

export const useRelations = ({ pending, toUser, loggedIn }: RelationProps = { loggedIn: true }) => {
  const [relations, setRelations] = useState<Record<string, any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRelations();
  }, [pending, loggedIn]);

  const getRelations = async () => {
    if (!loggedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/users/relation?pending=${pending || ''}&toUser=${
        toUser || ''
      }`,
      authHeader()
    );
    setLoading(false);
    setRelations(response.data);
  };

  const createRelation = async (id: string, type: RelationType) => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/users/relation`,
      { id, type },
      authHeader()
    );
    getRelations();
  };

  const accept = async (id: string, type: RelationType) => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/users/relation/accept`,
      { id, type },
      authHeader()
    );
    getRelations();
  };

  const reject = async (id: string, type: RelationType) => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/users/relation/reject`,
      { id, type },
      authHeader()
    );
    getRelations();
  };

  const deleteRelation = async (id: string, type: RelationType) => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/users/relation/delete`,
      { id, type },
      authHeader()
    );
    getRelations();
  };

  return { relations, createRelation, accept, reject, deleteRelation, loading };
};
