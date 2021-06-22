import { Button, Container, Paper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useAgentRequests } from '../../hooks/useAgentRequests';

const AgentRequests = () => {
  const { requests, approve, reject } = useAgentRequests();
  return (
    <Container maxWidth='md'>
      {requests.map((request: any) => (
        <Paper
          key={request.id}
          style={{ padding: 8, marginTop: 8, display: 'flex', alignItems: 'center' }}>
          <div>
            <Typography variant='body1'>
              <b>Username:</b>{' '}
              <Link to={`/users/${request.user.username}`}>@{request.user.username}</Link>
            </Typography>

            <Typography variant='body1'>
              <b>Email:</b> {request.email}
            </Typography>
            <Typography variant='body1'>
              <b>Website:</b> {request.website}
            </Typography>
          </div>

          <div style={{ flexGrow: 1 }} />
          <Button
            color='primary'
            variant='contained'
            style={{ marginRight: 8 }}
            onClick={() => approve(request.user.id)}>
            Approve
          </Button>
          <Button
            color='secondary'
            variant='contained'
            style={{ marginRight: 8 }}
            onClick={() => reject(request.user.id)}>
            Reject
          </Button>
        </Paper>
      ))}
    </Container>
  );
};

export default AgentRequests;
