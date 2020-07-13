import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowCircleRight, faGlobe, faPaperclip} from '@fortawesome/free-solid-svg-icons'
import Helmet from "react-helmet";
import {Link} from "react-router-dom";

function HomePage() {
  return (
    <div>
      <Helmet>
        <title>hamop.gr - Αρχική Σελίδα</title>
      </Helmet>
      <div className="flex justify-center">
        <div className="container mx-10 mt-20">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-3">
              <FontAwesomeIcon icon={faGlobe} className="mr-3"/>
              <span>Καλοσωρίσατε στο <span className="text-indigo-700">hamop.gr</span>!</span>
            </h1>
            <h2 className="text-gray-800">
              Η πρώτη διαδικτυακή πύλη ραδιοερασιτεχνών στην Ελλάδα
            </h2>
          </div>
          <div className="p-10 mt-10 bg-white rounded shadow">
            <h1 className="mb-2 text-lg font-bold flex items-center">
              <FontAwesomeIcon icon={faPaperclip} className="mr-3"/>
              <div>Ειδήσεις</div>
            </h1>
            <h2 className="mb-5">
              Επισκεφθείτε τη σελίδα ραδιοερασιτεχνικών ειδήσεων για να μείνετε συντονισμένοι με τις ανακοινώσεις των περιφερειών.
            </h2>
            <Link to="/news" className="px-5 py-3 bg-indigo-500 rounded shadow text-white inline-flex items-center hover:bg-indigo-600">
              <div>Μετάβαση</div>
              <FontAwesomeIcon icon={faArrowCircleRight} className="ml-3"/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
