import React from "react";
import AnnouncementsFeed from "./AnnouncementsFeed";
import Helmet from "react-helmet";
import announcementsImage from "./books-64x64.png";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";

function AnnouncementsPage() {
  return (
    <div>
      <Helmet>
        <title>hamop.gr - Ανακοινώσεις</title>
      </Helmet>
      <div className="flex justify-center mt-10 mb-5">
        <div className="container mx-3">
          <div className="flex md:items-center items-start mb-10">
            <img src={announcementsImage} className="mr-5" alt=""/>
            <div>
              <h1 className="text-lg font-bold flex items-center mb-1">
                <Link to="/" className="text-gray-700 md:block hidden">Αρχική Σελίδα</Link>
                <FontAwesomeIcon icon={faChevronRight} className="md:block hidden mx-3 text-gray-700"/>
                <div>Ανακοινώσεις</div>
              </h1>
              <p className="text-gray-800 md:text-sm">
                Όλες οι ραδιοερασιτεχνικές ανακοινώσεις από τις σελίδες των περιφεριών.
              </p>
            </div>
          </div>
          <AnnouncementsFeed/>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementsPage;