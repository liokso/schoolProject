import React, { Component } from 'react';
import Login from './Components/Login.js';
import Register from './Components/Register.js';
import SearchResult from './Components/Search.js';
import AdvanceSearch from './Components/AdvanceSearch';
import NavBarController from './Components/NavBarControler';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './Components/Home.js';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
  }

  /**
   * refreh all components
   */
  refresh() {
    this.setState({
      refresh: 'refresh'
    });
  }

  render() {
    return (      
      <Router>
      <div className="App">
        <aside>
          <NavBarController />
        </aside> 
        <main>
          <Route exact path='/' component={() => <Login refresh={this.refresh}/>} />
          <Route path='/register' component={() => <Register refresh={this.refresh}/>} />
          <Route path='/home' component={Home} /> 
          <Route path='/search' component={SearchResult} />
          <Route path='/advancesearch' component={AdvanceSearch} />
        </main>
      </div>
      </Router>
    );
  }
}

export default App;
