import { Button, Container, Grid, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { authHeader } from '../../helper/auth';
import Post from './Post';

const SearchTags = () => {
  const [username, setUsername] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/posts/tagged?username=${username}`,
      authHeader()
    );
    setResults(response.data);
  };

  return (
    <Container maxWidth='md'>
      <form onSubmit={handleSubmit}>
        <Typography variant='h5'>Search tagged posts</Typography>
        <TextField
          margin='dense'
          label='Username'
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
        />
        <br />
        <Button variant='contained' color='primary' type='submit'>
          Search
        </Button>
      </form>
      <Grid container spacing={2}>
        {results.map((post: any) => (
          <Post key={post.id} post={post} />
        ))}
      </Grid>
    </Container>
  );
};

export default SearchTags;
