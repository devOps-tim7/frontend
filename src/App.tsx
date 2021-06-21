import { Switch, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, CssBaseline } from '@material-ui/core';
import Home from './components/Home';
import Login from './components/Login';
import { useEffect, useState } from 'react';
import Register from './components/Register';
import { getUser, User } from './helper/localStorage';
import SearchUsers from './components/user/SearchUsers';
import SelfProfile from './components/user/SelfProfile';
import Profile from './components/user/Profile';
import NewPost from './components/post/NewPost';
import PostDetails from './components/post/PostDetails';
import PostRelations from './components/post/PostRelations';
import SearchTags from './components/post/SearchTags';

const App = () => {
  const [token, setToken] = useState<User | null>(null);
  useEffect(() => {
    setToken(getUser());
  }, []);

  const userExists = !!token?.id;

  return (
    <div>
      <CssBaseline />
      <AppBar position='static' style={{ marginBottom: 32 }}>
        <Toolbar>
          <Typography variant='h6' style={{ flexGrow: 1 }}>
            <Link style={{ color: 'white', textDecoration: 'none' }} to='/'>
              Home
            </Link>
            <Link style={{ color: 'white', textDecoration: 'none', marginLeft: 16 }} to='/search'>
              Search users
            </Link>
            <Link
              style={{ color: 'white', textDecoration: 'none', marginLeft: 16 }}
              to='/search/tags'>
              Search tags
            </Link>
            {userExists && (
              <>
                <Link
                  style={{ color: 'white', textDecoration: 'none', marginLeft: 16 }}
                  to='/newPost'>
                  Add post
                </Link>
                <Link
                  style={{ color: 'white', textDecoration: 'none', marginLeft: 16 }}
                  to='/posts/byRelation/like'>
                  Liked posts
                </Link>
                <Link
                  style={{ color: 'white', textDecoration: 'none', marginLeft: 16 }}
                  to='/posts/byRelation/dislike'>
                  Disliked posts
                </Link>
                <Link
                  style={{ color: 'white', textDecoration: 'none', marginLeft: 16 }}
                  to='/posts/byRelation/save'>
                  Saved posts
                </Link>
              </>
            )}
          </Typography>
          {userExists && (
            <Link style={{ color: 'white', textDecoration: 'none', marginLeft: 16 }} to='/profile'>
              {getUser().fullName}
            </Link>
          )}
          {!userExists && (
            <Button color='inherit' component={Link} to='/register'>
              Register
            </Button>
          )}
          <Button color='inherit' component={Link} to='/login'>
            {userExists ? 'Logout' : 'Login'}
          </Button>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route exact path='/'>
          <Home userExists={userExists} />
        </Route>
        <Route exact path='/login'>
          <Login setToken={setToken} />
        </Route>
        <Route exact path='/register'>
          <Register />
        </Route>
        <Route exact path='/profile'>
          <SelfProfile />
        </Route>
        <Route exact path='/users/:username'>
          <Profile />
        </Route>
        <Route exact path='/search'>
          <SearchUsers />
        </Route>
        <Route exact path='/search/tags'>
          <SearchTags />
        </Route>
        <Route exact path='/newPost'>
          <NewPost />
        </Route>
        <Route exact path='/posts/:id'>
          <PostDetails />
        </Route>
        <Route exact path='/posts/byRelation/:typeStr'>
          <PostRelations />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
