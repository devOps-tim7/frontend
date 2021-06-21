import { Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { CommentType } from '../../hooks/usePost';

interface CommentProps {
  comment: CommentType;
}

const Comment = ({ comment }: CommentProps) => {
  return (
    <Paper style={{ maxWidth: 500, marginTop: 16, padding: 16, textAlign: 'justify' }}>
      <Link to={`/users/${comment.user.username}`} style={{ textDecoration: 'none' }}>
        <b>@{comment.user.username}</b>
      </Link>{' '}
      commented: <br />
      {comment.content}
    </Paper>
  );
};

export default Comment;
