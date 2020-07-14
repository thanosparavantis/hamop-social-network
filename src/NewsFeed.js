import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle, faPaperclip, faSpinner} from "@fortawesome/free-solid-svg-icons";
import ReactTimeAgo from "react-time-ago/modules/ReactTimeAgo";

class NewsFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: [],
      atticaBuffer: [],
      centralGreeceBuffer: [],
      cacheDate: 0,
      isCacheValid: false,
      hasError: false,
    }

    this.cacheEntriesKey = "feed-entries";
    this.cacheDateKey = "feed-date";
    this.corsURL = "https://cors-anywhere.herokuapp.com/";
    this.atticaDomain = "https://www.patt.gov.gr";
    this.atticaEndpoint = `${this.corsURL}${this.atticaDomain}/site/index.php?option=com_content&view=category&id=529&Itemid=838&limitstart=`
    this.centralGreeceDomain = "https://pste.gov.gr"
    this.centralGreeceEndpoint = `${this.corsURL}${this.centralGreeceDomain}/deltia-tipou-2/page/`
  }

  componentDidMount() {
    console.debug("Checking cache...");
    this.loadEntriesFromCache();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Triggered when cache is empty and items must be fetched from endpoints
    if (!this.state.isCacheValid) {
      console.debug("News feed must be updated");
      this.fetchAtticaEntries();
      this.fetchCentralGreeceEntries();

      this.setState({
        isCacheValid: true
      });
    }

    // Triggered when new entries are added from any buffer and must be saved in local storage
    if (prevState.isCacheValid && this.state.isCacheValid && prevState.entries !== this.state.entries) {
      console.debug("Updating local storage")
      localStorage.setItem(this.cacheEntriesKey, JSON.stringify(this.state.entries));
    }

    // Triggered when new entries from buffers must be added to the component state
    Object.keys(this.state).forEach(key => {
      let buffer = this.state[key];

      if (key.endsWith("Buffer") && buffer.length > 0) {
        console.debug(`Updating entries from ${key}`);

        const currentDateTime = new Date().getTime();
        let newEntries = prevState.entries.concat(buffer);

        newEntries = this.sortEntries(this.filterEntries(newEntries));

        this.setState((prevState, props) => {
          return {
            entries: newEntries,
            [key]: [],
            cacheDate: currentDateTime,
          }
        });

        localStorage.setItem(this.cacheDateKey, currentDateTime.toString());
      }
    });
  }

  loadEntriesFromCache() {
    let cacheEntries = localStorage.getItem(this.cacheEntriesKey);

    if (cacheEntries) {
      cacheEntries = JSON.parse(cacheEntries);
      console.debug(`Reading cache: ${cacheEntries.length} entries found`);
    } else {
      cacheEntries = [];
      console.debug(`No valid cached entries found.`);
    }

    let cacheDate = localStorage.getItem(this.cacheDateKey);

    if (cacheDate) {
      cacheDate = parseInt(cacheDate);
      console.debug(`Reading cache date: ${cacheDate}`);
    } else {
      cacheDate = 0;
      console.debug(`No valid cache date found.`);
    }

    const now = new Date().getTime();
    const oneDayOld = 86400000;
    const cacheLife = now - cacheDate;
    const isCacheValid = cacheLife <= oneDayOld

    console.debug(`Cache validity: ${isCacheValid}`);

    this.setState((state, props) => {
      return {
        entries: cacheEntries,
        cacheDate: cacheDate,
        isCacheValid: cacheLife <= oneDayOld,
      }
    });
  }

  filterEntries(entries) {
    return entries.filter(item => {
      const text = item.text.toLowerCase();
      return text.includes('ραδιοερασιτέχνη');
    });
  }

  sortEntries(entries) {
    return entries.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    })
  }

  fetchAtticaEntries(pager = 0) {
    fetch(this.atticaEndpoint + pager)
      .then(response => response.text())
      .then(response => {
        const parser = new DOMParser();
        const htmlResponse = parser.parseFromString(response, "text/html");
        const entries = htmlResponse.getElementsByClassName("list-title");
        const dates = htmlResponse.getElementsByClassName("list-date");
        let newEntries = [];

        for (let i = 0; i < entries.length; i++) {
          const link = entries[i].getElementsByTagName("a")[0];
          const entryText = link.textContent.trim();
          const entryHref = this.atticaDomain + link.href.replace(/https?:\/\/[^/]+/i, "");
          const rawDate = dates[i].textContent.trim().split("/");
          const entryDate = new Date(rawDate[2], rawDate[1] - 1, rawDate[0]).getTime();

          newEntries.push({
            text: entryText,
            href: entryHref,
            date: entryDate,
            region: "Περιφέρεια Αττικής"
          });
        }

        if (entries.length > 0 && pager < 20) {
          console.debug(`Request: ${this.atticaEndpoint + pager}`)

          this.setState((prevState, props) => {
            return {
              atticaBuffer: prevState.atticaBuffer.concat(newEntries),
            }
          });

          setTimeout(() => {
            this.fetchAtticaEntries(pager + 10);
          }, 100);
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({
          hasError: true
        });
      });
  }

  fetchCentralGreeceEntries(pager = 1) {
    fetch(this.centralGreeceEndpoint + pager)
      .then(response => response.text())
      .then(response => {
        const parser = new DOMParser();
        const htmlResponse = parser.parseFromString(response, "text/html");
        const entries = htmlResponse.getElementsByClassName("slide-entry-title");
        const dates = htmlResponse.getElementsByClassName("slide-meta-time");
        let newEntries = [];

        for (let i = 0; i < entries.length; i++) {
          const link = entries[i].getElementsByTagName("a")[0];
          const entryText = link.textContent.trim();
          const entryHref = this.centralGreeceDomain + link.href.replace(/https?:\/\/[^/]+/i, "");
          const rawDate = dates[i].dateTime;
          const entryDate = new Date(rawDate).getTime();

          newEntries.push({
            text: entryText,
            href: entryHref,
            date: entryDate,
            region: 'Περιφέρεια Στερεάς Ελλάδας'
          });
        }

        if (entries.length > 0 && pager < 3) {
          console.debug(`Request: ${this.centralGreeceEndpoint + pager}`)

          this.setState((prevState, props) => {
            return {
              centralGreeceBuffer: prevState.centralGreeceBuffer.concat(newEntries),
            }
          });

          setTimeout(() => {
            this.fetchCentralGreeceEntries(pager + 1);
          }, 100);
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({
          hasError: true
        });
      });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-5 flex items-center justify-center text-center border rounded my-5 shadow bg-white text-red-600">
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-3"/>
          <div className="font-bold">Πρόβλημα στη φόρτωση των ειδήσεων</div>
        </div>
      )
    } else if (!this.state.entries.length) {
      return (
        <div className="p-5 flex items-center justify-center text-center border rounded my-5 shadow bg-white">
          <FontAwesomeIcon icon={faSpinner} spin={true} className="mr-3"/>
          <div className="italic font-bold">Φόρτωση...</div>
        </div>
      )
    } else {
      return (
        <div>
          <h1 className="font-bold text-lg mb-2 flex items-center">
            <FontAwesomeIcon icon={faPaperclip} className="mr-3"/>
            <div>Ειδήσεις</div>
          </h1>
          <div className="text-sm mb-5 text-gray-800">
            Τελευταία ενημέρωση: <ReactTimeAgo date={new Date(this.state.cacheDate)} locale="el"/>
          </div>
          {
            this.state.entries.map(
              (entry) =>
                <div key={entry.href} className="border rounded my-5 shadow bg-white">
                  <a href={entry.href} className="block p-5 border-b">
                    {entry.text}
                  </a>
                  <div className="flex items-center p-5 text-sm text-gray-700">
                    <div className="mr-5">
                      <ReactTimeAgo date={new Date(entry.date)} locale="el"/>
                    </div>
                    <div>
                      {entry.region}
                    </div>
                  </div>
                </div>
            )
          }
        </div>
      )
    }
  }
}

export default NewsFeed;