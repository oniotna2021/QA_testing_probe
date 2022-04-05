import React from "react";

const ActionSubmoduleWithPermission = ({ permissions, path, children }) => {
  const hasPermission = permissions.find((p) => p.module_path === path);

  return Boolean(hasPermission) ? (
    hasPermission.read ? (
      <> {children} </>
    ) : null
  ) : null;
};

export default ActionSubmoduleWithPermission;
