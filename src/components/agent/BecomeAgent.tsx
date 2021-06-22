import { Container, Typography } from '@material-ui/core';
import axios from 'axios';
import { useEffect } from 'react';
import { authHeader } from '../../helper/auth';
import { useUser } from '../../hooks/useUser';

const BecomeAgent = () => {
  const { user } = useUser(true);

  useEffect(() => {
    if (!!user.id) {
      const sendRequest = async () => {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/admin/requests`,
          {
            website: user.website,
            email: user.email,
          },
          authHeader()
        );
      };
      sendRequest();
    }
  }, [user]);

  return (
    <Container maxWidth='sm'>
      <>
        <Typography variant='h5'>Request sent!</Typography>
        <br />
        <Typography variant='h5'>
          Your request to become an agent has been sent to the admins. When they approve you, you
          will be able to post campaigns.
        </Typography>
      </>
    </Container>
  );
};

export default BecomeAgent;
