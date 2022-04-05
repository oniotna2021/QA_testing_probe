import React from "react";

// components
import FormAfiliateLead from "components/Common/ManageDetailAfiliate/FormAfiliateLead";


const FormNewUser = ({ selectedUserInfo, setNewUserForm, setSelectedUserInfo }) => {
  const handleUserSelection = (info) => {
    setSelectedUserInfo(info);
    setNewUserForm(false);
  };

  return (
    <FormAfiliateLead
      fromQuotationConfig
      selectedUserInfo={selectedUserInfo}
      handlerClose={() => setNewUserForm(false)}
      handleUserSelection={handleUserSelection}
    />
  );
};

export default FormNewUser;
