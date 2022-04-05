import React, { useState } from "react";

import { AccordionWithImage } from "components/Shared/AccordionConfigReservations/AccordionWithImage";
import DetailLocation from "components/Common/ModuleConfigReservations/Location/DetailLocation";
import { FormLocation } from "components/Common/ModuleConfigReservations/Location/FormLocation";

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
        files={files}
        setFiles={setFiles}
        {...restProps}
      >
        {defaultIsEdit ? (
          <DetailLocation
            {...restProps}
            files={files}
            setFiles={setFiles}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            setLoad={setLoad}
            permissionsActions={permissionsActions}
            setExpanded={setExpanded}
          />
        ) : (
          <FormLocation
            {...restProps}
            files={files}
            setFiles={setFiles}
            isEdit={isEdit}
            setExpanded={setExpanded}
            load={load}
            setLoad={setLoad}
          />
        )}
      </AccordionWithImage>
    </>
  );
};

export default ParentComponentItem;
