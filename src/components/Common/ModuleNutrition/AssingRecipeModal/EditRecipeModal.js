import React, { useState } from "react";

import FormRecipe from "components/Common/ModuleRecipes/FormRecipe";

const AssingRecipeDates = ({
  selectedRecipe,
  setSelectedRecipe,
  setEditRecipeModal,
  cellData,
}) => {
  const [load, setLoad] = useState(false);
  const [expanded, setExpanded] = useState(false);
  return (
    <FormRecipe
      cellData={cellData}
      setSelectedRecipe={setSelectedRecipe}
      selectedRecipe={selectedRecipe}
      fromAssingModal={true}
      dataItem={selectedRecipe}
      isEdit={true}
      setLoad={setLoad}
      setExpanded={setExpanded}
      setEditRecipeModal={setEditRecipeModal}
    />
  );
};

export default AssingRecipeDates;
