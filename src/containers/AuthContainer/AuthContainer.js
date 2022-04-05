import React from "react";

// HOCS
import Router from "router/Router";

/**
 * Page container for the auth forms
 */
const AuthContainer = ({ routes }) => {
  return (
    <>
      <Router routes={routes} />
    </>
  );
};

export default AuthContainer;
