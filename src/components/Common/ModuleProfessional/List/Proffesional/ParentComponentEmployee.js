import React, { useState } from "react";

import { AccordionWithImage } from "components/Shared/AccordionConfigReservations/AccordionWithImage";
import DetailEmployee from "components/Common/ModuleProfessional/List/Proffesional/DetailEmployee";
import FormProffesional from "components/Common/ModuleProfessional/Manage/Proffesional/FormProffesional";

const ParentComponentEmployee = ({
  defaultIsEdit,
  expanded,
  setExpanded,
  title_no_data,
  load,
  setLoad,
  ...restProps
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [files, setFiles] = useState([]);

  return (
    <>
      <AccordionWithImage
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
          <DetailEmployee
            {...restProps}
            files={files}
            setFiles={setFiles}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            setLoad={setLoad}
            setExpanded={setExpanded}
          />
        ) : (
          <FormProffesional
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

export default ParentComponentEmployee;
