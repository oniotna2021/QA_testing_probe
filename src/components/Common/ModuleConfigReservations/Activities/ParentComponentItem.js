import React, { useState } from "react";

import { AccordionWithImage } from "components/Shared/AccordionConfigReservations/AccordionWithImage";
import DetailActivities from "components/Common/ModuleConfigReservations/Activities/DetailActivities";
import { FormActivity } from "components/Common/ModuleConfigReservations/Activities/FormActivities";

const ParentComponentItem = ({
  defaultIsEdit,
  expanded,
  setExpanded,
  title_no_data,
  load,
  setLoad,
  permissionsActions,
  key,
  ...restProps
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [files, setFiles] = useState([]);

  return (
    <>
      <AccordionWithImage
        color="primary"
        key={key}
        expanded={expanded}
        setExpanded={setExpanded}
        title_no_data={title_no_data}
        setIsEdit={setIsEdit}
        isEdit={isEdit}
        permissionsActions={permissionsActions}
        files={files}
        setFiles={setFiles}
        {...restProps}
      >
        {defaultIsEdit ? (
          <DetailActivities
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
          <FormActivity
            {...restProps}
            files={files}
            setFiles={setFiles}
            isEdit={isEdit}
            setExpanded={setExpanded}
            load={load}
            setLoad={setLoad}
            permissionsActions={permissionsActions}
          />
        )}
      </AccordionWithImage>
    </>
  );
};

export default ParentComponentItem;
