import React from "react";
import NewsFeed from "./NewsFeed";
import Helmet from "react-helmet";

function NewsPage() {
  return (
    <div>
      <Helmet>
        <title>hamop.gr - Ειδήσεις</title>
      </Helmet>
      <div className="flex justify-center">
        <div className="container mx-10 mt-10">
          <NewsFeed/>
        </div>
      </div>
    </div>
  );
}

export default NewsPage;