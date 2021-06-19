import { Button, Container, Paper, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getUser } from '../../helper/localStorage';
import { RelationType } from '../../helper/shared';
import { useRelations } from '../../hooks/useRelations';
import { useUser } from '../../hooks/useUser';

const Profile = () => {
  const { relations, createRelation, deleteRelation, loading } = useRelations();
  const { relations: blockRelations } = useRelations({ toUser: true });
  const { user } = useUser(false);

  const history = useHistory();
  useEffect(() => {
    if (user.id === getUser().id) {
      history.replace('/profile');
    }
  }, [user, history]);

  const followExists =
    relations?.filter((rel: any) => rel.object.id === user.id && rel.type === RelationType.Follow)
      .length > 0;
  const muteExists =
    relations?.filter((rel: any) => rel.object.id === user.id && rel.type === RelationType.Mute)
      .length > 0;
  const blockExists =
    relations?.filter((rel: any) => rel.object.id === user.id && rel.type === RelationType.Block)
      .length > 0;
  const blockExistsToUser =
    blockRelations?.filter(
      (rel: any) => rel.subject.id === user.id && rel.type === RelationType.Block
    ).length > 0;

  if (loading) {
    return null;
  }

  if (blockExists || blockExistsToUser) {
    history.replace('/');
  }

  const isPending =
    relations?.filter((rel: any) => rel.type === RelationType.Follow && rel.pending).length > 0;

  const renderPrivate = () => (
    <Paper style={{ padding: 16 }}>
      <b>@{user.username}</b>
      <Typography variant='body1'>
        This profile is private {isPending && '(request sent)'}
      </Typography>
      <Button
        variant='contained'
        color='primary'
        style={{ marginTop: 8 }}
        disabled={isPending}
        onClick={() => createRelation(user.id, RelationType.Follow)}>
        Follow
      </Button>
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

      {followExists && !isPending && (
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

      <Button
        variant='contained'
        color='secondary'
        style={{ marginTop: 8, marginLeft: 8 }}
        disabled={isPending}
        onClick={() => createRelation(user.id, RelationType.Block)}>
        Block
      </Button>
    </Paper>
  );

  return (
    <Container maxWidth='lg'>
      {(!followExists || isPending) && user?.private ? renderPrivate() : renderProfile()}
    </Container>
  );
};

export default Profile;
