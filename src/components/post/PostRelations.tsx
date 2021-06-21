import { Container, Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostRelationType } from '../../helper/shared';
import Post from './Post';
import { authHeader } from '../../helper/auth';

const PostRelations = () => {
  const { typeStr } = useParams<{ typeStr: string }>();
  const [posts, setPosts] = useState<Record<string, any>>([]);
  const [title, setTitle] = useState('Liked posts');

  useEffect(() => {
    const getPosts = async () => {
      let type;
      switch (typeStr) {
        case 'save':
          type = PostRelationType.Save;
          setTitle('Saved posts');
          break;
        case 'dislike':
          type = PostRelationType.Dislike;
          setTitle('Disliked posts');
          break;
        default:
          type = PostRelationType.Like;
          setTitle('Liked posts');
          break;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/byPostRelation/${type}`,
        authHeader()
      );
      setPosts(response.data.map((relation: any) => relation.post));
    };
    getPosts();
  }, [typeStr]);

  return (
    <Container maxWidth='sm' style={{ textAlign: 'center' }}>
      <Typography variant='h5'>{title}</Typography>
      <Grid container spacing={2}>
        {posts.map((post: any) => (
          <Post key={post.id} large post={post} />
        ))}
      </Grid>
    </Container>
  );
};

export default PostRelations;
