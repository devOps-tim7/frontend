import { Container, Paper, TextField } from '@material-ui/core';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUser } from '../../helper/localStorage';
import { Role } from '../../helper/shared';
import { CommentType, usePost } from '../../hooks/usePost';
import Comment from './Comment';
import Post from './Post';

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { post, addComment, createRelation, deleteRelation } = usePost(id);

  const [content, setContent] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await addComment(id, content);
    setContent('');
  };

  return (
    <Container maxWidth='sm' style={{ textAlign: 'center' }}>
      <Post post={post} large createRelation={createRelation} deleteRelation={deleteRelation} />
      {!!getUser().id && getUser().role !== Role.Admin && (
        <form onSubmit={handleSubmit}>
          <Paper style={{ maxWidth: 500, marginTop: 16, padding: '0px 8px', textAlign: 'right' }}>
            <TextField
              fullWidth
              margin='dense'
              label='Add comment'
              value={content}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
            />
          </Paper>
        </form>
      )}

      {post.comments.map((comment: CommentType) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </Container>
  );
};

export default PostDetails;
