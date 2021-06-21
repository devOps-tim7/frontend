import { Button, Container, Grid, Paper, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getUser } from '../../helper/localStorage';
import { RelationType } from '../../helper/shared';
import { usePosts } from '../../hooks/usePosts';
import { useRelations } from '../../hooks/useRelations';
import { useUser } from '../../hooks/useUser';
import Post from '../post/Post';

const Profile = () => {
  const { relations, createRelation, deleteRelation, loading } = useRelations({
    loggedIn: !!getUser().id,
  });
  const { relations: blockRelations } = useRelations({ toUser: true, loggedIn: !!getUser().id });
  const { user } = useUser(false);
  const [redirect, setRedirect] = useState(false);
  const history = useHistory();

  const sameUser = user.id === getUser().id;

  useEffect(() => {
    const blockExists =
      relations?.filter((rel: any) => rel.object.id === user.id && rel.type === RelationType.Block)
        .length > 0;
    const blockExistsToUser =
      blockRelations?.filter(
        (rel: any) => rel.subject.id === user.id && rel.type === RelationType.Block
      ).length > 0;

    if (blockExists || blockExistsToUser) {
      setRedirect(true);
    }
  }, [user, blockRelations, relations]);

  useEffect(() => {
    if (redirect) {
      history.replace('/');
    }
  }, [redirect, history]);

  const { posts } = usePosts({ forUser: true, id: user.id });

  if (loading) {
    return null;
  }

  const followExists =
    relations?.filter((rel: any) => rel.object.id === user.id && rel.type === RelationType.Follow)
      .length > 0;
  const muteExists =
    relations?.filter((rel: any) => rel.object.id === user.id && rel.type === RelationType.Mute)
      .length > 0;

  const isPending =
    relations?.filter((rel: any) => rel.type === RelationType.Follow && rel.pending).length > 0;

  const renderPrivate = () => (
    <Paper style={{ padding: 16 }}>
      <b>@{user.username}</b>
      <Typography variant='body1'>
        This profile is private {isPending && '(request sent)'}
      </Typography>
      {!!getUser().id ? (
        <Button
          variant='contained'
          color='primary'
          style={{ marginTop: 8 }}
          disabled={isPending}
          onClick={() => createRelation(user.id, RelationType.Follow)}>
          Follow
        </Button>
      ) : (
        <Typography variant='body1'>
          Please login (or create an account) to send a follow request.
        </Typography>
      )}
    </Paper>
  );

  const renderProfile = () => (
    <Paper style={{ padding: 16 }}>
      <b>@{user.username}</b>
      <Typography variant='body1'>
        {user.fullName} ({user.email}) <br />
        {user.description}
        <br />
      </Typography>
      {!sameUser && !!getUser().id && (
        <>
          {!followExists ? (
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 8 }}
              disabled={isPending}
              onClick={() => createRelation(user.id, RelationType.Follow)}>
              Follow
            </Button>
          ) : (
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 8 }}
              disabled={isPending}
              onClick={() => deleteRelation(user.id, RelationType.Follow)}>
              Unfollow
            </Button>
          )}
        </>
      )}

      {!sameUser && followExists && !isPending && (
        <>
          {muteExists ? (
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 8, marginLeft: 8 }}
              disabled={isPending}
              onClick={() => deleteRelation(user.id, RelationType.Mute)}>
              Unmute
            </Button>
          ) : (
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 8, marginLeft: 8 }}
              disabled={isPending}
              onClick={() => createRelation(user.id, RelationType.Mute)}>
              Mute
            </Button>
          )}
        </>
      )}
      {!sameUser && !!getUser().id && (
        <Button
          variant='contained'
          color='secondary'
          style={{ marginTop: 8, marginLeft: 8 }}
          disabled={isPending}
          onClick={() => createRelation(user.id, RelationType.Block)}>
          Block
        </Button>
      )}
    </Paper>
  );

  const showPosts = sameUser || !user?.private || (followExists && !isPending);

  return (
    <Container maxWidth='md'>
      {showPosts ? renderProfile() : renderPrivate()}
      {showPosts && (
        <Grid container spacing={2}>
          {posts.map((post: any) => (
            <Post key={post.id} post={post} />
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Profile;
