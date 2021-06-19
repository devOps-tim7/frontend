import { Button, Container, Paper, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getUser, removeUser, saveUser, User } from '../helper/localStorage';

interface LoginProps {
  setToken: (arg0: User | null) => void;
}

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const history = useHistory();
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    setToken(null);
    removeUser();
  }, [setToken]);

  const handleChange = (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, user);
      saveUser(response.data.token);
      setToken(getUser());
      history.push('/');
    } catch (error) {
      setError(error.response.data.errors[0].base);
    }
  };

  return (
    <Container maxWidth='xs'>
      <form onSubmit={handleSubmit}>
        <Paper style={{ padding: 16 }}>
          <Typography variant='h5'>Login</Typography>
          <TextField
            margin='dense'
            label='Username'
            fullWidth
            value={user.username}
            onChange={handleChange('username')}
          />
          <TextField
            margin='dense'
            label='Password'
            fullWidth
            type='password'
            value={user.password}
            onChange={handleChange('password')}
          />
          <Button variant='contained' color='primary' type='submit'>
            login
          </Button>
          <Typography variant='body1' style={{ color: 'red' }}>
            {error}
          </Typography>
        </Paper>
      </form>
    </Container>
  );
};

export default Login;
