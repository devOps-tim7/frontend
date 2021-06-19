import { Button, Container, Paper, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';

const SearchUsers = () => {
  const [username, setUsername] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/users?username=${username.toLowerCase()}`
    );
    setResults(response.data);
  };

  return (
    <Container maxWidth='md'>
      <form onSubmit={handleSubmit}>
        <Typography variant='h5'>Search profiles</Typography>
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
      {results.map((user: any) => (
        <Paper key={user.id} style={{ padding: 8, marginTop: 8 }}>
          <Link to={`/users/${user.username}`}>
            <b>@{user.username}</b>
          </Link>
        </Paper>
      ))}
    </Container>
  );
};

export default SearchUsers;
