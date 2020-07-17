import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowCircleRight, faExclamationCircle, faSpinner} from "@fortawesome/free-solid-svg-icons";
import Announcement from "./Announcement";
import {Link} from "react-router-dom";

class AnnouncementsFeed extends Component {
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

    this.cacheEntriesKey = "announcements";
    this.cacheDateKey = "announcements-date";
    this.corsURL = "https://cors-anywhere.herokuapp.com/";
    this.atticaDomain = "https://www.patt.gov.gr";
    this.atticaEndpoint = `${this.corsURL}${this.atticaDomain}/site/index.php?option=com_content&view=category&id=529&Itemid=838`
    this.centralGreeceDomain = "https://pste.gov.gr"
    this.centralGreeceEndpoint = `${this.corsURL}${this.centralGreeceDomain}/deltia-tipou-2/`
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
    let cacheDate = localStorage.getItem(this.cacheDateKey);
    const now = new Date().getTime();
    const oneDayOld = 86400000;
    const cacheLife = now - cacheDate;
    const isCacheValid = cacheLife <= oneDayOld

    if (cacheEntries && cacheDate && isCacheValid) {
      console.log("Cache is valid, loading entries and dates");
      cacheEntries = JSON.parse(cacheEntries);
      cacheDate = parseInt(cacheDate);
    } else {
      console.log("Cache is not valid");
      cacheEntries = [];
      cacheDate = 0;
    }

    this.setState((state, props) => {
      return {
        entries: cacheEntries,
        cacheDate: cacheDate,
        isCacheValid: isCacheValid,
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

  fetchAtticaEntries() {
    console.debug(`Request: ${this.atticaEndpoint}`)

    fetch(this.atticaEndpoint)
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

        this.setState((prevState, props) => {
          return {
            atticaBuffer: prevState.atticaBuffer.concat(newEntries),
          }
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          hasError: true
        });
      });
  }

  fetchCentralGreeceEntries() {
    console.debug(`Request: ${this.centralGreeceEndpoint}`)

    fetch(this.centralGreeceEndpoint)
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

        this.setState((prevState, props) => {
          return {
            centralGreeceBuffer: prevState.centralGreeceBuffer.concat(newEntries),
          }
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          hasError: true
        });
      });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-5 text-sm flex items-center justify-center text-center border rounded my-5 shadow bg-white text-red-600">
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-3"/>
          <div className="font-bold">
            Πρόβλημα στη φόρτωση των ανακοινώσεων
          </div>
        </div>
      )
    } else if (!this.state.entries.length) {
      return (
        <div className="p-5 text-sm flex items-center justify-center text-center border rounded my-5 shadow bg-white">
          <FontAwesomeIcon icon={faSpinner} spin={true} className="mr-3"/>
          <div className="font-bold">
            Φόρτωση...
          </div>
        </div>
      )
    } else if (this.props.truncated && this.state.entries.length > 5) {
      const topFiveEntries = this.state.entries.slice(0, 5);
      const total = this.state.entries.length - 5
      return (
        <div className="bg-white shadow rounded">
          {topFiveEntries.map((entry) => <Announcement key={entry.href} entry={entry}/>)}
          <Link to="/announcements" className="p-5 text-center flex items-center justify-center text-sm font-bold text-gray-800">
            <div>Διαβάστε ακόμη {total} ανακοινώσεις</div>
            <FontAwesomeIcon icon={faArrowCircleRight} className="ml-2"/>
          </Link>
        </div>
      )
    } else {
      return (
        <div className="bg-white shadow rounded">
          {this.state.entries.map((entry) => <Announcement key={entry.href} entry={entry}/>)}
        </div>
      )
    }
  }
}

export default AnnouncementsFeed;