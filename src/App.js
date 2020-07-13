import React from 'react';
import './App.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faGlobe} from '@fortawesome/free-solid-svg-icons'
import Helmet from "react-helmet";
import NavbarDesktop from "./NavbarDesktop";

function App() {
  return (
    <div className="font-hamop">
      <Helmet>
        <title>hamop.gr - Αρχική Σελίδα</title>
      </Helmet>
      <NavbarDesktop/>
      <div className="container m-auto text-center px-10 mt-20">
        <h1 className="text-gray-900 text-xl font-bold mb-3">
          <FontAwesomeIcon icon={faGlobe} className="mr-3"/>
          <span>Καλοσωρίσατε στο <span className="text-indigo-700">hamop.gr</span>!</span>
        </h1>
        <h2 className="text-gray-900">
          Η πρώτη διαδικτυακή πύλη ραδιοερασιτεχνών στην Ελλάδα
        </h2>
      </div>
    </div>
  );
}

export default App;
