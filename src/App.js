import GoogleFontLoader from "react-google-font-loader";
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom";
import HomePage from "./HomePage";

function App() {
  return (
    <>
      <GoogleFontLoader fonts={[
        {
          font: "Source Sans Pro",
          weights: [300, 400, 600],
        }
      ]}/>
      <Router>
        <Switch>
          <Route path="/" exact>
            <HomePage/>
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
