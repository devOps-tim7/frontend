import {
  Button,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authHeader } from '../../helper/auth';
import { getUser } from '../../helper/localStorage';
import { Gender, hours, Role } from '../../helper/shared';
import moment from 'moment';

const NewPost = () => {
  const [description, setDescription] = useState('');
  const history = useHistory();

  const [taggable, setTaggable] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const classes = useStyles();

  const [file, setFile] = useState<File>();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setFile(fileList[0]);
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }

    const tagArray = JSON.stringify(
      tags.map((username) => taggable.find((user) => user.username === username).id)
    );

    formData.append('tags', tagArray);
    formData.append('description', description);
    formData.append('campaignDates', '[]');

    if (campaign) {
      formData.delete('tags');
      formData.append('tags', '[]');

      formData.delete('campaignDates');
      formData.append(
        'campaignDates',
        JSON.stringify(enumerateDates(filter.start, filter.end, hoursSelected))
      );

      formData.append('ageFilterLow', filter.low.toString());
      formData.append('ageFilterHigh', filter.high.toString());
      formData.append('genderFilter', filter.gender.toString());
      formData.append('hidden', 'true');
    }

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/posts`,
      formData,
      authHeader()
    );
    history.push(`/posts/${response.data.id}`);
  };

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/forTagging`,
        authHeader()
      );
      setTaggable(response.data);
    };
    getData();
  }, []);

  const handleChangeMultiple = (event: React.ChangeEvent<{ value: unknown }>) => {
    const options = event.target.value as any;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      value.push(options[i]);
    }
    setTags(value);
  };

  const handleFilterChange = (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter({ ...filter, [name]: value });
  };

  const [campaign, setCampaign] = useState(false);

  const [filter, setFilter] = useState({
    low: 0,
    high: 150,
    gender: Gender.Everyone,
    start: moment(new Date()).format('yyyy-MM-DD'),
    end: moment(new Date()).format('yyyy-MM-DD'),
  });

  const [hoursSelected, setHoursSelected] = useState<string[]>([]);
  const handleChangeHours = (event: React.ChangeEvent<{ value: unknown }>) => {
    const options = event.target.value as any;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      value.push(options[i]);
    }
    setHoursSelected(value);
  };

  const renderAgentForm = () => (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h5'>Publish campaign</Typography>{' '}
        <Checkbox checked={campaign} onChange={(e) => setCampaign(e.target.checked)} />
      </div>
      {campaign && (
        <>
          <TextField
            margin='dense'
            label='Gender filter'
            select
            value={filter.gender}
            variant='standard'
            fullWidth
            onChange={handleFilterChange('gender')}>
            <MenuItem value={Gender.Everyone}>Everyone</MenuItem>
            <MenuItem value={Gender.Male}>Male</MenuItem>
            <MenuItem value={Gender.Female}>Female</MenuItem>
            <MenuItem value={Gender.Other}>Other</MenuItem>
          </TextField>
          <TextField
            required
            margin='dense'
            label='Min age'
            type='number'
            fullWidth
            inputProps={{
              min: 0,
            }}
            value={filter.low}
            onChange={handleFilterChange('low')}
          />
          <TextField
            required
            margin='dense'
            label='Max age'
            fullWidth
            type='number'
            inputProps={{
              max: 150,
            }}
            value={filter.high}
            onChange={handleFilterChange('high')}
          />
          <TextField
            required
            margin='dense'
            label='Start date'
            type='date'
            fullWidth
            value={filter.start}
            onChange={handleFilterChange('start')}
          />
          <TextField
            required
            margin='dense'
            label='End date'
            type='date'
            fullWidth
            value={filter.end}
            onChange={handleFilterChange('end')}
          />
          <FormControl className={classes.formControl}>
            <InputLabel>Hours</InputLabel>
            <Select multiple required value={hoursSelected} onChange={handleChangeHours}>
              {hours.map((hour) => (
                <MenuItem key={hour} value={hour}>
                  {hour}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
    </>
  );

  return (
    <Container maxWidth='sm'>
      <form onSubmit={handleSubmit}>
        <Paper style={{ padding: 16 }}>
          <Typography variant='h5'>Add a post</Typography>
          <TextField
            margin='normal'
            label='Image'
            fullWidth
            type='file'
            variant='standard'
            inputProps={{
              accept: 'image/*',
            }}
            required={true}
            onChange={handleFileChange}
            style={{ marginTop: 16, marginBottom: 16 }}
          />
          <TextField
            margin='dense'
            label='Description'
            variant='outlined'
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl className={classes.formControl}>
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={tags}
              onChange={handleChangeMultiple}
              renderValue={(usernames) =>
                (usernames as string[]).map((username) => `@${username}`).join(', ')
              }>
              {taggable.map((user: any) => (
                <MenuItem key={user.username} value={user.username}>
                  <b>@{user.username}</b>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {getUser().role === Role.Agent && renderAgentForm()}
          <div style={{ textAlign: 'right', width: '100%' }}>
            <Button type='submit' color='primary' variant='contained'>
              Create post
            </Button>
          </div>
        </Paper>
      </form>
    </Container>
  );
};

export default NewPost;

const useStyles = makeStyles({
  formControl: {
    margin: 8,
    width: '100%',
  },
});

const enumerateDates = function (startDate: string, endDate: string, hours: string[]) {
  const now = moment(startDate, 'yyyy-MM-DD').clone();
  const end = moment(endDate, 'yyyy-MM-DD');
  const dates = [];

  const justHours = hours.map((hour) => hour.split(':')[0]);

  while (now.isSameOrBefore(end)) {
    for (let i = 0; i < justHours.length; i++) {
      const hour = justHours[i];
      dates.push(now.clone().add(hour, 'hours').toISOString(true));
    }
    now.add(1, 'days');
  }
  return dates;
};
