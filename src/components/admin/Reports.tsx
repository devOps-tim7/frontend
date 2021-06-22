import { Button, Container, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Decision } from '../../helper/shared';
import { useReports } from '../../hooks/useReports';

const Reports = () => {
  const { reports, handleReport } = useReports();
  return (
    <Container maxWidth='md'>
      {reports.map((report: any) => (
        <Paper key={report.id} style={{ padding: 8, marginTop: 8, display: 'flex' }}>
          <Link to={`/posts/${report.post.id}`}>Go to post</Link>
          <div style={{ flexGrow: 1 }} />
          <Button
            color='primary'
            variant='contained'
            style={{ marginRight: 8 }}
            onClick={() => handleReport(report.id, Decision.Nothing)}>
            Do nothing
          </Button>
          <Button
            color='secondary'
            variant='contained'
            style={{ marginRight: 8 }}
            onClick={() => handleReport(report.id, Decision.Ban)}>
            Ban user
          </Button>
          <Button
            color='secondary'
            variant='contained'
            onClick={() => handleReport(report.id, Decision.Remove)}>
            Remove post
          </Button>
        </Paper>
      ))}
    </Container>
  );
};

export default Reports;
