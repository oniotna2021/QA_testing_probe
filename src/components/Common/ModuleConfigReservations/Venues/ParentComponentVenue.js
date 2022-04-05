import React, { useState } from "react";

import { AccordionVenue } from "components/Shared/AccordionConfigReservations/AccordionVenue";
import DetailVenue from "components/Common/ModuleConfigReservations/Venues/DetailVenue";
import FormVenue from "components/Common/ModuleConfigReservations/Venues/FormVenue";

const ParentComponentItem = ({
  defaultIsEdit,
  expanded,
  setExpanded,
  title_no_data,
  load,
  setLoad,
  permissionsActions,
  ...restProps
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [files, setFiles] = useState([]);

  return (
    <>
      <AccordionVenue
        isVenue={true}
        color="primary"
        expanded={expanded}
        setExpanded={setExpanded}
        title_no_data={title_no_data}
        setIsEdit={setIsEdit}
        isEdit={isEdit}
        files={files}
        setFiles={setFiles}
        {...restProps}
      >
        {defaultIsEdit ? (
          <DetailVenue
            {...restProps}
            files={files}
            setFiles={setFiles}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            setLoad={setLoad}
            setExpanded={setExpanded}
            permissionsActions={permissionsActions}
          />
        ) : (
          <FormVenue
            {...restProps}
            files={files}
            setFiles={setFiles}
            isEdit={isEdit}
            setExpanded={setExpanded}
            load={load}
            setLoad={setLoad}
          />
        )}
      </AccordionVenue>
    </>
  );
};

export default ParentComponentItem;
