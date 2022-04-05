import { Switch } from "react-router-dom";
import RouteWithPermissions from "./RouteWithPermissions";

const RouterValidatePermissions = ({ routes, permissionsModule }) => {
  return (
    <Switch>
      {routes &&
        routes.map((route) => (
          <RouteWithPermissions
            key={route.path}
            permissions={permissionsModule}
            {...route}
          />
        ))}
    </Switch>
  );
};

export default RouterValidatePermissions;
