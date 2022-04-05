import { useMemo } from "react";
import { useSelector } from "react-redux";

const ActionWithPermissions = ({ isPublic, path, children }) => {
  const permissions = useSelector((state) => state.auth.permissions);

  const hasPermission = useMemo(() => {
    if (!isPublic) {
      const arrPermissions = permissions.find(
        (p) => `/${p.module_groups_name}` === path
      );

      return Boolean(arrPermissions)
        ? arrPermissions.permissions.some((p) => p.read === true)
        : false;
    }

    return true;
  }, [permissions, isPublic, path]);

  return hasPermission ? <> {children} </> : null;
};

export default ActionWithPermissions;
