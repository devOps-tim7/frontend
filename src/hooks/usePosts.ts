import axios from 'axios';
import { useEffect, useState } from 'react';
import { authHeader } from '../helper/auth';

interface PostsProps {
  forUser?: boolean;
  id?: string;
}

export const usePosts = ({ forUser = false, id }: PostsProps = {}) => {
  const [posts, setPosts] = useState<Record<string, any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (forUser && id) {
      getPostsForUser(id);
    } else {
      getPostsForFeed();
    }
  }, [forUser, id]);

  const getPostsForUser = async (id?: string) => {
    setLoading(true);
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/posts/forUser/${id}`,
      authHeader()
    );
    setLoading(false);
    setPosts(response.data);
  };

  const getPostsForFeed = async () => {
    setLoading(true);
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`, authHeader());
    setLoading(false);
    setPosts(response.data);
  };

  return { posts, loading };
};
