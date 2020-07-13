import React, {useEffect, useState} from "react";
import ReactTimeAgo from "react-time-ago/modules/ReactTimeAgo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle, faPaperclip, faSpinner} from "@fortawesome/free-solid-svg-icons";

export default NewsFeed;

function NewsFeed() {
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState(false);
  const [feedItems, setFeedItems] = useState([]);
  const [feedDate, setFeedDate] = useState(0);

  const feedItemsStorageKey = "feed-items";
  const feedDateStorageKey = "feed-date";
  const domain = "https://www.patt.gov.gr";
  const newsURL = "https://cors-anywhere.herokuapp.com/https://www.patt.gov.gr/site/index.php?option=com_content&view=category&id=529&Itemid=838&limitstart=0";

  useEffect(() => {
    let localFeedItems = JSON.parse(localStorage.getItem(feedItemsStorageKey));
    let localFeedDate = parseInt(localStorage.getItem(feedDateStorageKey));
    let now = new Date().getTime();
    const cacheLife = now - localFeedDate;
    const oneDayOld = 86400000;

    if (localFeedItems && localFeedDate && cacheLife <= oneDayOld) {
      setFeedLoading(false);
      setFeedItems(localFeedItems);
      setFeedDate(localFeedDate);
    } else {
      fetch(newsURL)
        .then(response => response.text())
        .then(response => {
          const parser = new DOMParser();
          const htmlResponse = parser.parseFromString(response, "text/html");
          const entries = htmlResponse.getElementsByClassName("list-title");
          const dates = htmlResponse.getElementsByClassName("list-date");
          const newFeedItems = []

          for (let i = 0; i < entries.length; i++) {
            const link = entries[i].getElementsByTagName("a")[0];
            const entryText = link.textContent.trim();
            const entryHref = domain + link.href.replace(/https?:\/\/[^/]+/i, "");
            newFeedItems.push({text: entryText, href: entryHref})
          }

          for (let i = 0; i < entries.length; i++) {
            const rawDate = dates[i].textContent.trim().split("/");
            const entryDate = new Date(rawDate[2], rawDate[1] - 1, rawDate[0]);
            newFeedItems[i]["date"] = entryDate.getTime();
          }

          localFeedItems = JSON.stringify(newFeedItems);
          now = new Date().getTime();
          localFeedDate = now.toString();

          localStorage.setItem(feedItemsStorageKey, localFeedItems);
          localStorage.setItem(feedDateStorageKey, localFeedDate);

          setFeedLoading(false);
          setFeedItems(newFeedItems);
          setFeedDate(now);
        })
        .catch(error => {
          setFeedError(true);
        });
    }
  }, []);

  const loadingNewsFeed = (
    <div className="p-5 flex items-center justify-center text-center border rounded my-5 shadow bg-white">
      <FontAwesomeIcon icon={faSpinner} spin={true} className="mr-3"/>
      <div className="italic font-bold">Φόρτωση...</div>
    </div>
  )

  const errorNewsFeed = (
    <div className="p-5 flex items-center justify-center text-center border rounded my-5 shadow bg-white text-red-600">
      <FontAwesomeIcon icon={faExclamationCircle} className="mr-3"/>
      <div className="font-bold">Πρόβλημα στη φόρτωση των ειδήσεων</div>
    </div>
  )

  const newsFeed = (
    <div>
      <div className="text-sm mb-5 text-gray-800">
        Τελευταία ενημέρωση: <ReactTimeAgo date={new Date(feedDate)} locale="el"/>
      </div>
      {
        feedItems.map(
          (feedItem) =>
            <div key={feedItem.text} className="border rounded my-5 shadow bg-white">
              <a href={feedItem.href} className="block p-5 border-b">
                {feedItem.text}
              </a>
              <div className="flex items-center p-5 text-sm text-gray-700">
                <div>
                  <ReactTimeAgo date={new Date(feedItem.date)} locale="el"/>
                </div>
              </div>
            </div>
        )
      }
    </div>
  )

  return (
    <div className="mt-10">
      <h1 className="font-bold text-lg mb-2 flex items-center">
        <FontAwesomeIcon icon={faPaperclip} className="mr-3"/>
        <div>Ειδήσεις Περιφέρειας Αττικής</div>
      </h1>
      {feedError ? errorNewsFeed : feedLoading ? loadingNewsFeed : newsFeed}
    </div>
  )
}
