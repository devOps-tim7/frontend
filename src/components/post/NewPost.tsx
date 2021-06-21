import {
  Button,
  Container,
  FormControl,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authHeader } from '../../helper/auth';

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
