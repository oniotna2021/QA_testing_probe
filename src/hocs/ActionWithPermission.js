const ActionWithPermission = ({ isValid, children }) => {
  return isValid ? children : null;
};

export default ActionWithPermission;
