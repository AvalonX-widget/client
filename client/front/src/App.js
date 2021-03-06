import React, { Component } from 'react';
import { Router,Route  } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css'
import {createBrowserHistory} from "history";
import Axios from 'axios';

import NavBar from './components/NavBar';
import Home from './pages/Home/index';
import Join from './pages/Join/index';
import Login from './pages/Login/index';
import MyPage from './pages/MyPage/index';
import Posts from './pages/Post/index';
import PostCreate from './pages/PostCreate/index';
import PostDetail from './pages/PostDetail/index';


const history = createBrowserHistory();

class App extends Component {
  state = {
		loggedInUser: {
			name: '',
			email: ''
		}
	}

 	fetchUser = async () => {
    const fetched_user = (await Axios.get('http://localhost:8080/users/info', { withCredentials: true })).data.user;

    if (!fetched_user) {
      this.setState({
        loggedInUser: {
          name: '',
          email: ''
        }
      });
      return;
    } else {
      const email_changed = fetched_user.email === this.state.loggedInUser.email;
      const name_changed = fetched_user.name === this.state.loggedInUser.name;

      if (email_changed && name_changed) {
        return;
      }
        
      this.setState({
        loggedInUser: {
          name: fetched_user.name,
          email: fetched_user.email,
        }
      });
    }
  }

	constructor(props) {
		super(props);
		history.listen(async (location, action) => {
      await this.fetchUser();
    });
  }
  
  render() {
    return (
      <Router history={history}>
        <div>
          <NavBar 
            loggedInUser={this.state.loggedInUser} 
            fetchUser={this.fetchUser}
          />
          <div>
            <Route path="/" exact component={Home} />
            {this.state.loggedInUser.name ? (
              <div>
                <Route path="/mypage" component={MyPage} />
                <Route path="/new_post" component={PostCreate} />
                <Route path='/post/:id/edit' component={PostCreate} />
              </div>
            ): (
              <div>
                <Route path="/join" component={Join} />
                <Route path="/login" component={Login} />
              </div>
            )}
            <Route path='/posts/:id' component={(props) => <PostDetail {...props} loggedInUser={this.state.loggedInUser} />} />
            <Route exact path='/posts' component={Posts}/>
            
          </div>
        </div>
      </Router>
    )
  }
}

export default App;
