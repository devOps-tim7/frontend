import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  makeStyles,
  Grid,
  CardActions,
  Button,
} from '@material-ui/core';
import axios from 'axios';
import { SyntheticEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getUser } from '../../helper/localStorage';
import { PostRelationType, Role } from '../../helper/shared';
import { PostType } from '../../hooks/usePost';

interface PostProps {
  post: PostType;
  large?: boolean;
  createRelation?: (id: string, name: string) => Promise<void>;
  deleteRelation?: (id: string, name: string) => Promise<void>;
}

const Post = ({ post, large = false, createRelation, deleteRelation }: PostProps) => {
  const classes = useStyles();

  const history = useHistory();

  const handleClick = (e: SyntheticEvent) => {
    history.push(`/posts/${post.id}`);
  };

  const hasRelation = (type: PostRelationType) =>
    !!post.relations.find(
      (relation) => relation.user_id === getUser().id && relation.type === type
    );

  const handleReport = async () => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/reports/${post.id}`);
  };

  return (
    <Grid item xs={large ? 12 : 4}>
      <Card onClick={handleClick} className={large ? classes.largeCard : classes.card}>
        <CardActionArea>
          <CardMedia className={large ? classes.largeMedia : classes.media} image={post.image} />
          <CardContent className={classes.content}>
            <Typography variant='body2' color='textSecondary' component='p'>
              <Link to={`/users/${post.user.username}`} onClick={(e) => e.stopPropagation()}>
                <b>@{post.user.username}</b>
              </Link>{' '}
              {post.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        {post.tags && (
          <Typography
            variant='body2'
            color='textSecondary'
            component='p'
            style={{ textAlign: 'justify', padding: '8px 16px' }}>
            Tagged:{' '}
            {post.tags.map((user) => (
              <>
                <Link
                  key={`${post.id}-${user.username}`}
                  to={`/users/${user.username}`}
                  onClick={(e) => e.stopPropagation()}>
                  <b>@{user.username}</b>
                </Link>{' '}
              </>
            ))}
          </Typography>
        )}
        {!!getUser().id && getUser().role !== Role.Admin && createRelation && deleteRelation && (
          <CardActions style={{ display: 'flex' }}>
            {hasRelation(PostRelationType.Like) ? (
              <Button
                size='small'
                color='primary'
                variant='outlined'
                onClick={() => deleteRelation(post.id, 'like')}>
                Like
              </Button>
            ) : (
              <Button
                size='small'
                color='primary'
                variant='contained'
                onClick={() => createRelation(post.id, 'like')}>
                Like
              </Button>
            )}
            {hasRelation(PostRelationType.Dislike) ? (
              <Button
                size='small'
                color='primary'
                variant='outlined'
                onClick={() => deleteRelation(post.id, 'dislike')}>
                Dislike
              </Button>
            ) : (
              <Button
                size='small'
                color='primary'
                variant='contained'
                onClick={() => createRelation(post.id, 'dislike')}>
                Dislike
              </Button>
            )}
            <div style={{ flexGrow: 1 }} />
            {hasRelation(PostRelationType.Save) ? (
              <Button
                size='small'
                color='primary'
                variant='outlined'
                onClick={() => deleteRelation(post.id, 'save')}>
                Favorite
              </Button>
            ) : (
              <Button
                size='small'
                color='primary'
                variant='contained'
                onClick={() => createRelation(post.id, 'save')}>
                Favorite
              </Button>
            )}
            {getUser().id !== post.user.id && (
              <Button size='small' color='secondary' variant='contained' onClick={handleReport}>
                Report
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </Grid>
  );
};

export default Post;

const useStyles = makeStyles({
  media: {
    minHeight: 250,
  },
  largeMedia: {
    minHeight: 500,
  },
  bottomText: {
    marginTop: 16,
    display: 'flex',
  },
  grower: {
    flexGrow: 1,
  },
  soldOut: {
    color: '#ff1744',
    fontWeight: 'bold',
  },
  card: {
    marginTop: 16,
    maxWidth: 300,
  },
  largeCard: {
    marginTop: 16,
    maxWidth: 500,
  },
  content: {
    textAlign: 'justify',
  },
});
