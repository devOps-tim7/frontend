import {
  Button,
  Checkbox,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Role, Gender } from '../helper/shared';
import moment from 'moment';

const initialState = {
  username: '',
  password: '',
  fullName: '',
  email: '',
  phone: '',
  gender: Gender.Male,
  birthDate: moment(new Date()).format('yyyy-MM-DD'),
  description: '',
  website: '',
  private: false,
  taggable: false,
  role: Role.User,
};

const Register: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState(initialState);

  const [error, setError] = useState();

  const handleChange = (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleChangeChecked = (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users`, user);
      alert('Registered successfully');
      history.push('/');
    } catch (error) {
      setError(error.response.data.errors[0].username);
    }
  };

  return (
    <Container maxWidth='sm'>
      <form onSubmit={handleSubmit}>
        <Paper style={{ padding: 16 }}>
          <Typography variant='h5'>Register</Typography>
          <TextField
            required
            margin='dense'
            label='Username'
            fullWidth
            value={user.username}
            onChange={handleChange('username')}
          />
          <TextField
            required
            margin='dense'
            label='Password'
            fullWidth
            type='password'
            value={user.password}
            onChange={handleChange('password')}
          />
          <TextField
            required
            margin='dense'
            label='Full name'
            fullWidth
            value={user.fullName}
            onChange={handleChange('fullName')}
          />
          <TextField
            margin='dense'
            label='Gender'
            select
            fullWidth
            value={user.gender}
            variant='standard'
            onChange={handleChange('gender')}>
            <MenuItem value={Gender.Male}>Male</MenuItem>
            <MenuItem value={Gender.Female}>Female</MenuItem>
            <MenuItem value={Gender.Other}>Other</MenuItem>
          </TextField>
          <TextField
            required
            margin='dense'
            label='Email'
            fullWidth
            type='email'
            value={user.email}
            onChange={handleChange('email')}
          />
          <TextField
            margin='dense'
            label='Phone'
            fullWidth
            value={user.phone}
            onChange={handleChange('phone')}
          />
          <TextField
            margin='dense'
            label='Website'
            fullWidth
            value={user.website}
            onChange={handleChange('website')}
          />
          <TextField
            margin='dense'
            label='Description'
            fullWidth
            multiline
            value={user.description}
            onChange={handleChange('description')}
          />
          <TextField
            required
            margin='dense'
            label='Date'
            type='date'
            fullWidth
            value={user.birthDate}
            onChange={handleChange('birthDate')}
          />
          Taggable: <Checkbox checked={user.taggable} onChange={handleChangeChecked('taggable')} />
          Private: <Checkbox checked={user.private} onChange={handleChangeChecked('private')} />
          <Button variant='contained' color='primary' type='submit' style={{ marginLeft: 150 }}>
            Register
          </Button>
          <Typography variant='body1' style={{ color: 'red' }}>
            {error}
          </Typography>
        </Paper>
      </form>
    </Container>
  );
};

export default Register;
