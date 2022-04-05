import { Suspense, lazy, useMemo } from "react";
import { Route } from "react-router-dom";

import Loading from "components/Shared/Loading/Loading";

const Page404 = lazy(() => import("pages/Page404"));

const RouteWithPermissions = (route) => {
  const hasPermission = useMemo(() => {
    if (route.permissions.length > 0 && route.requiredPermissions) {
      const findPermission = route.permissions.find(
        (p) => p.module_path === route.path.split("/")[2]
      );

      if (Boolean(findPermission)) {
        return {
          authorized: findPermission.read === true,
          permission: findPermission,
        };
      }
    }

    return {
      authorized: false,
    };
  }, [route]);

  return (
    <Suspense fallback={<Loading />}>
      <Route
        path={route.path}
        render={(props) =>
          hasPermission.authorized ? (
            route.component && (
              <route.component
                permissionsActions={hasPermission.permission}
                {...props}
              />
            )
          ) : (
            <Page404 />
          )
        }
      />
    </Suspense>
  );
};

export default RouteWithPermissions;
