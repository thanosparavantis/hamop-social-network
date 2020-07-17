import React from 'react';
import ReactDOM from 'react-dom';
import './tailwind.build.css'
import HomePage from './home/HomePage';

import JavascriptTimeAgo from 'javascript-time-ago'
import el from 'javascript-time-ago/locale/el'
import {BrowserRouter, Route, Switch} from "react-router-dom";
import NavbarDesktop from "./NavbarDesktop";
import AnnouncementsPage from "./announcements/AnnouncementsPage";
import Helmet from "react-helmet";
import ScrollToTop from "./ScrollToTop";

JavascriptTimeAgo.addLocale(el);

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <body className="bg-gray-200 font-hamop"/>
    </Helmet>
    <BrowserRouter>
      <ScrollToTop/>
      <NavbarDesktop/>
      <Switch>
        <Route path="/announcements">
          <AnnouncementsPage/>
        </Route>
        <Route path="/">
          <HomePage/>
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
