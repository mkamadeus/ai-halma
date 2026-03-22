import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Setting from "./Setting";
import "./css/styles.css";
import {BrowserRouter, Route, Switch} from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <Switch>
        <Route path="/" component={Setting}/>
      </Switch>
      <Switch>
        <Route path="/play" component={App}/>
      </Switch>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
);
