import { useState } from "react";

//components
import FormRecipe from "./FormRecipe";
import DetailRecipe from "./DetailRecipe";
import AccordionRecipes from "components/Shared/Accordion/AccordionRecipes";

const PaternItemRecipe = ({
  data,
  defaultIsEdit,
  expanded,
  setExpanded,
  title_no_data,
  load,
  setLoad,
  key,
  permissionsActions,
  ...restProps
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [files, setFiles] = useState([]);

  return (
    <div>
      <AccordionRecipes
        color="primary"
        key={key}
        data={data}
        expanded={expanded}
        setExpanded={setExpanded}
        title_no_data={title_no_data}
        setIsEdit={setIsEdit}
        isEdit={isEdit}
        files={files}
        setFiles={setFiles}
        {...restProps}
        content={
          defaultIsEdit ? (
            <DetailRecipe
              setIsEdit={setIsEdit}
              isEdit={isEdit}
              data={data}
              load={load}
              setLoad={setLoad}
              setExpanded={setExpanded}
              permissionsActions={permissionsActions}
            />
          ) : (
            <FormRecipe
              {...restProps}
              files={files}
              setFiles={setFiles}
              isEdit={isEdit}
              setExpanded={setExpanded}
              load={load}
              setLoad={setLoad}
              setEditRecipeModal={""}
              permissionsActions={permissionsActions}
            />
          )
        }
      />
    </div>
  );
};

export default PaternItemRecipe;
