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
import { Role } from './helper/shared';
import Reports from './components/admin/Reports';
import BecomeAgent from './components/agent/BecomeAgent';
import AgentRequests from './components/admin/AgentRequests';

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
          <Typography style={{ flexGrow: 1 }}>
            <Link style={{ color: 'white', textDecoration: 'none' }} to='/'>
              Home
            </Link>
            {getUser().role !== Role.Admin && (
              <>
                <Link
                  style={{ color: 'white', textDecoration: 'none', marginLeft: 16 }}
                  to='/search'>
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
              </>
            )}
          </Typography>
          {userExists && getUser().role === Role.Admin && (
            <>
              <Link
                style={{ color: 'white', textDecoration: 'none', marginLeft: 16 }}
                to='/reports'>
                ADMIN: Reports
              </Link>
              <Link
                style={{ color: 'white', textDecoration: 'none', marginLeft: 16 }}
                to='/agentRequests'>
                ADMIN: Agent requests
              </Link>
            </>
          )}
          {userExists && getUser().role !== Role.Admin && (
            <>
              {getUser().role !== Role.Agent && (
                <Button variant='contained' color='secondary'>
                  <Link style={{ color: 'white', textDecoration: 'none' }} to='/becomeAgent'>
                    BECOME AN AGENT
                  </Link>
                </Button>
              )}
              <Link
                style={{ color: 'white', textDecoration: 'none', marginLeft: 16 }}
                to='/profile'>
                {getUser().fullName}
              </Link>
            </>
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
        <Route exact path='/reports'>
          <Reports />
        </Route>
        <Route exact path='/becomeAgent'>
          <BecomeAgent />
        </Route>
        <Route exact path='/agentRequests'>
          <AgentRequests />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
