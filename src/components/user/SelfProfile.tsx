import {
  Button,
  Checkbox,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { Gender, RelationType } from '../../helper/shared';
import { useUser } from '../../hooks/useUser';
import moment from 'moment';
import { useRelations } from '../../hooks/useRelations';

const SelfProfile: React.FC = () => {
  const { user, setUser, updateUser } = useUser(true);

  const [error, setError] = useState();

  const handleChange = (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (name === 'birthDate') {
      setUser({ ...user, [name]: moment(value).format('yyyy-MM-DD') });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleChangeChecked = (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await updateUser();
      alert('Profile updated successfully');
    } catch (error) {
      setError(error.response.data.errors[0].base);
    }
  };

  const { relations, accept, reject } = useRelations({ pending: true, toUser: true });

  return (
    <Container maxWidth={user.private ? 'lg' : 'sm'}>
      <Grid container spacing={3}>
        <Grid item xs={user.private ? 6 : 12}>
          <form onSubmit={handleSubmit}>
            <Paper style={{ padding: 16 }}>
              <Typography variant='h5'>My profile</Typography>
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
              Taggable:{' '}
              <Checkbox checked={user.taggable} onChange={handleChangeChecked('taggable')} />
              Private: <Checkbox checked={user.private} onChange={handleChangeChecked('private')} />
              <Button variant='contained' color='primary' type='submit' style={{ marginLeft: 150 }}>
                Submit changes
              </Button>
              <Typography variant='body1' style={{ color: 'red' }}>
                {error}
              </Typography>
            </Paper>
          </form>
        </Grid>
        {user.private && (
          <Grid item xs={6}>
            <Paper style={{ padding: 16 }}>
              <Typography variant='h5'>Follow requests</Typography>
              {relations.map((relation: any) => (
                <div key={relation.subject.id}>
                  <b>@{relation.subject.username}</b>
                  <br />
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => accept(relation.subject.id, RelationType.Follow)}>
                    Accept
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    style={{ marginLeft: 8 }}
                    onClick={() => reject(relation.subject.id, RelationType.Follow)}>
                    Reject
                  </Button>
                </div>
              ))}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default SelfProfile;
