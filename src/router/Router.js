import React from "react";
import { Switch } from "react-router-dom";
import RouteWithSubRoutes from "./RouteWithSubRoutes";

// const Page404 = React.lazy(() => import('pages/Page404'));

const Router = ({ routes }) => {
  return (
    <Switch>
      {routes &&
        routes.map((route) => (
          <RouteWithSubRoutes key={route.path} {...route} />
        ))}
    </Switch>
  );
};

export default Router;
