import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authHeader } from '../helper/auth';
import { getUser } from '../helper/localStorage';
import { PostRelationType, RelationType } from '../helper/shared';
import { useRelations } from './useRelations';

export interface PostType {
  id: string;
  description: string;
  comments: CommentType[];
  user: {
    id: string;
    username: string;
    private: boolean;
  };
  relations: PostRelation[];
  image: string;
  tags: any[];
}

export interface PostRelation {
  post_id: string;
  user_id: string;
  type: PostRelationType;
}

export interface CommentType {
  id: string;
  content: string;
  user: {
    username: string;
  };
}

const initialState = {
  id: '',
  description: '',
  comments: [],
  user: {
    id: '',
    username: '',
    private: false,
  },
  relations: [],
  image: '',
  tags: [],
};

export const usePost = (id: string) => {
  const [post, setPost] = useState<PostType>(initialState);

  const history = useHistory();
  const { relations } = useRelations({ loggedIn: !!getUser().id });
  const { relations: blockRelations } = useRelations({ toUser: true, loggedIn: !!getUser().id });

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    getPost(id);
  }, [id]);

  useEffect(() => {
    if (redirect) {
      history.replace('/');
    }
  }, [redirect, history]);

  useEffect(() => {
    const blockExists =
      relations?.filter(
        (rel: any) => rel.object.id === post.user.id && rel.type === RelationType.Block
      ).length > 0;
    const blockExistsToUser =
      blockRelations?.filter(
        (rel: any) => rel.subject.id === post.user.id && rel.type === RelationType.Block
      ).length > 0;

    const followExists =
      relations?.filter(
        (rel: any) => rel.object.id === post.user.id && rel.type === RelationType.Follow
      ).length > 0;

    if (blockExists || blockExistsToUser || (followExists && post.user.private)) {
      setRedirect(true);
    }
  }, [post, blockRelations, relations]);

  const getPost = async (id: string) => {
    if (!getUser().id && post.user.private) {
      setRedirect(true);
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/${id}`,
        authHeader()
      );
      setPost(response.data);
    } catch (error) {
      if (error.response.status === 404) {
        setRedirect(true);
      }
    }
  };

  const addComment = async (id: string, content: string) => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/posts/comment/${id}`,
      { content },
      authHeader()
    );
    getPost(id);
  };

  const createRelation = async (id: string, name: string) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/${name}/${id}`, {}, authHeader());
    getPost(id);
  };

  const deleteRelation = async (id: string, name: string) => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/posts/${name}/${id}/delete`,
      {},
      authHeader()
    );
    getPost(id);
  };

  return { post, addComment, createRelation, deleteRelation };
};
