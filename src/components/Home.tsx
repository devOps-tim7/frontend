import { Container, Typography } from '@material-ui/core';
import { usePosts } from '../hooks/usePosts';
import Post from './post/Post';

interface HomeProps {
  userExists: boolean;
}

const Home = ({ userExists }: HomeProps) => {
  const { posts } = usePosts();

  return (
    <Container maxWidth='sm'>
      {userExists ? (
        <>
          <Typography variant='h5'>Your feed</Typography>
          {posts.map((post: any) => (
            <Post key={post.id} post={post} large />
          ))}
        </>
      ) : (
        <>
          <Typography variant='h5'>Welcome to Nistagram!</Typography>
          <br />
          <Typography variant='h5'>
            Please create an account! As a non-registered user, you can only view public profiles.
          </Typography>
        </>
      )}
    </Container>
  );
};

export default Home;
