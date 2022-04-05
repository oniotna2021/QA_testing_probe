import React from "react";
import { useTranslation } from "react-i18next";

// UI
import AddIcon from "@material-ui/icons/Add";
import { Typography } from "@material-ui/core";

const AddProductButton = ({ setAddProductModal }) => {
  const { t } = useTranslation();
  return (
    <td
      className="d-flex justify-content-center align-items-center"
      style={{ cursor: "pointer" }}
      onClick={() => setAddProductModal(true)}
    >
      {
        <div className="d-flex flex-column align-items-center">
          <AddIcon className="mb-2" />
          <Typography variant="p">{t("Promotions.AddProduct")}</Typography>
        </div>
      }
    </td>
  );
};

export default AddProductButton;
