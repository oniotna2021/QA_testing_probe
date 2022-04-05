import React, { Suspense, useMemo, lazy } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

import Loading from "components/Shared/Loading/Loading";

const Page404 = lazy(() => import("pages/Page404"));

const RouteWithSubRoutes = (route) => {
  const isUserAuth = useSelector((state) => state.auth.isUserAuthenticated);
  const permissions = useSelector((state) => state.auth.permissions);

  const permissionsModule = useMemo(() => {
    if (route.requiredPermissions) {
      const arrPermissions = permissions.find(
        (p) => p.module_groups_name === route.path.split("/")[1]
      );

      return Boolean(arrPermissions)
        ? arrPermissions.permissions.some((p) => p.read === true)
          ? arrPermissions.permissions
          : []
        : [];
    }

    return [];
  }, [permissions, route]);

  return (
    <Suspense fallback={<Loading />}>
      <Route
        path={route.path}
        render={(props) =>
          route.redirect ? (
            <Redirect to={route.redirect} />
          ) : route.private ? (
            isUserAuth ? (
              route.requiredPermissions ? (
                permissionsModule.length > 0 ? (
                  <route.component
                    {...props}
                    permissionsModule={permissionsModule}
                    routes={route.routes}
                  />
                ) : (
                  <Page404 />
                )
              ) : (
                <route.component
                  {...props}
                  permissionsModule={permissionsModule}
                  routes={route.routes}
                />
              )
            ) : (
              <Redirect to="/auth/login" />
            )
          ) : isUserAuth ? (
            <Redirect to="/home" />
          ) : (
            route.component && (
              <route.component {...props} routes={route.routes} />
            )
          )
        }
      />
    </Suspense>
  );
};

export default RouteWithSubRoutes;
