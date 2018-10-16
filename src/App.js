import React, { PureComponent } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from 'react-router'
import Login from './pages/Login';
import Privacy from './pages/Privacy';

class App extends PureComponent {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/privacy" component={Privacy} />
          <Route component={Login} />
        </Switch>
      </Router>
    );
  }
}

export default App;
