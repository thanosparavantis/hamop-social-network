import React from 'react';
import Helmet from "react-helmet";
import greetingImage from "./phone.png"
import AnnouncementsFeed from "../announcements/AnnouncementsFeed";
import {Link} from "react-router-dom";
import announcementsImage from "../announcements/books-32x32.png";
import newsImage from "../news/newspaper-32x32.png";
import communityImage from "../community/globe-32x32.png";

function HomePage() {
  return (
    <div className="mt-20 mb-3">
      <Helmet>
        <title>hamop.gr - Αρχική Σελίδα</title>
      </Helmet>
      <div className="flex justify-center">
        <div className="container md:mx-0 mx-3">
          <div className="mb-20 flex items-center justify-center text-center md:flex-row flex-col">
            <img src={greetingImage} className="md:mr-10 md:mb-0 mb-5" alt=""/>
            <div>
              <h1 className="font-bold mb-1 md:text-xl">
                Καλοσωρίσατε στο <span className="text-indigo-700">hamop.gr</span>!
              </h1>
              <h2 className="text-gray-800 text-sm">
                Η πρώτη διαδικτυακή πύλη ραδιοερασιτεχνών στην Ελλάδα
              </h2>
            </div>
          </div>
          <div className="flex md:flex-row flex-col">
            <div className="md:w-1/3 md:mr-5 md:mb-0 mb-10">
              <Link to="/announcements" className="text-center mb-4 text-lg font-bold flex items-center justify-center">
                <img src={announcementsImage} className="mr-3" alt=""/>
                <div>Ανακοινώσεις</div>
              </Link>
              <AnnouncementsFeed truncated={true}/>
            </div>
            <div className="md:w-1/3 md:mr-5 md:mb-0 mb-10">
              <Link to="/news" className="text-center mb-4 text-lg font-bold flex items-center justify-center">
                <img src={newsImage} className="mr-3" alt=""/>
                <div>Ειδήσεις</div>
              </Link>
              <div className="bg-white p-3 shadow rounded">
                Δεν φαίνεται να υπάρχει κάτι εδώ ακόμα.
              </div>
            </div>
            <div className="md:w-1/3 md:mb-0 mb-10">
              <Link to="/news" className="text-center mb-4 text-lg font-bold flex items-center justify-center">
                <img src={communityImage} className="mr-3" alt=""/>
                <div>Κοινότητα</div>
              </Link>
              <div className="bg-white p-3 shadow rounded">
                Δεν φαίνεται να υπάρχει κάτι εδώ ακόμα.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
