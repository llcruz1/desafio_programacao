import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Celulares } from "./components/Celulares";

function App() {
  return (
    <Router>
      <div className="container p-4">
        <Switch>
          <Route exact path="/" component={Celulares} />       
        </Switch>
      </div>
    </Router>
  );
}

export default App;