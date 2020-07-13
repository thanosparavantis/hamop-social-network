import React from 'react';
import ReactDOM from 'react-dom';
import './tailwind.build.css'
import HomePage from './HomePage';
import * as serviceWorker from './serviceWorker';

import JavascriptTimeAgo from 'javascript-time-ago'
import el from 'javascript-time-ago/locale/el'
import {BrowserRouter, Route, Switch} from "react-router-dom";
import NavbarDesktop from "./NavbarDesktop";
import NewsPage from "./NewsPage";
import Helmet from "react-helmet";

JavascriptTimeAgo.addLocale(el)

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <body className="bg-gray-200 font-hamop"/>
    </Helmet>
    <BrowserRouter>
      <NavbarDesktop/>
      <Switch>
        <Route path="/news">
          <NewsPage/>
        </Route>
        <Route path="/">
          <HomePage/>
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
