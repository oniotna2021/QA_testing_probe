import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

// Internal dependencies
import { hotjar } from "react-hotjar";
import ReactGA from "react-ga4";


import ServiceWorkerWrapper from "ServiceWorkerWrapper";

import { routes } from "router/config";
import Router from "router/Router";

function App({ isUserAuthenticated, userEmail }) {
  const history = useHistory();

  useEffect(() => {
    // Google analytics
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
    });
    hotjar.initialize(process.env.REACT_APP_HOTJAR_API, 6);
  }, []);

  useEffect(() => {
    if (!isUserAuthenticated) {
      history.push("/auth/login");
    }
  }, [isUserAuthenticated, history, userEmail]);

  history.listen(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  });

  return (
    <div style={{ height: "100%" }}>
      <ServiceWorkerWrapper>
        <Router routes={routes} />
      </ServiceWorkerWrapper>
    </div>
  );
}

const mapStateToProps = ({ auth }) => ({
  isUserAuthenticated: auth.isUserAuthenticated,
  userEmail: auth.userEmail,
});

export default connect(mapStateToProps)(App);
