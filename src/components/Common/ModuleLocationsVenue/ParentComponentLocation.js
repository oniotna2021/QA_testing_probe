import React, { useState } from "react";

import { AccordionWithImage } from "components/Shared/AccordionConfigReservations/AccordionWithImage";
import DetailLocation from "components/Common/ModuleLocationsVenue/DetailLocation";
import FormLocation from "components/Common/ModuleLocationsVenue/FormLocation";

const ParentComponentItem = ({
  defaultIsEdit,
  expanded,
  setExpanded,
  title_no_data,
  setLoad,
  keyIndex,
  ...restProps
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [files, setFiles] = useState([]);

  return (
    <>
      <AccordionWithImage
        color="primary"
        key={keyIndex}
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
            setExpanded={setExpanded}
          />
        ) : (
          <FormLocation
            {...restProps}
            files={files}
            setFiles={setFiles}
            isEdit={isEdit}
            setExpanded={setExpanded}
            setLoad={setLoad}
          />
        )}
      </AccordionWithImage>
    </>
  );
};

export default ParentComponentItem;
