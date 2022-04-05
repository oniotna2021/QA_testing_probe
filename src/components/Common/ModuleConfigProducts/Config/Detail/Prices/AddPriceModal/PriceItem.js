import React, { useState, useEffect } from "react";
import { useStyles } from "utils/useStyles";
import { useTranslation } from "react-i18next";

// UI
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Skeleton from "@material-ui/lab/Skeleton";

// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import EditPriceForm from "./EditPriceForm";

// services
import { getCurrencyById } from "services/GeneralConfig/Currency";
import { getCategoryById } from "services/GeneralConfig/Categories";

import { formatCurrency } from "utils/misc";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const PriceItem = ({
  price,
  deleteItem,
  categoriesOptions,
  companiesOptions,
  taxesOptions,
  userType,
  fetchPrices,
}) => {
  const [currentCurrency, setCurrentCurrency] = useState({});
  const [currentCategory, setCurrentCategory] = useState({});
  const [handleEditModal, setHandleEditModal] = useState(false);
  const classes = useStyles();

  const { t } = useTranslation();

  useEffect(() => {
    getCurrencyById(price.currency_id)
      .then(({ data }) => setCurrentCurrency(data.data))
      .catch((err) => console.log(err));

    getCategoryById(price.category_id)
      .then(({ data }) => {
        setCurrentCategory(data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="row mx-auto">
        <div className={`${classes.defaultBoxContainerAddPrice} row mx-auto`}>
          <div className="col-5">
            {currentCategory.name ? (
              currentCategory.name
            ) : (
              <Skeleton animation="wave" height={30} />
            )}
          </div>

          <div className="col-5 d-flex justify-content-end">
            {currentCurrency.sign ? (
              `${currentCurrency.name} ${currentCurrency.sign}${formatCurrency(
                price.price
              )}`
            ) : (
              <Skeleton animation="wave" height={30} width={80} />
            )}
          </div>

          <div className="col-1" style={{ cursor: "pointer" }}>
            <div
              onClick={() => {
                deleteItem(price.uuid);
              }}
            >
              <DeleteIcon />
            </div>
          </div>
          <div className="col-1" style={{ cursor: "pointer" }}>
            <div
              onClick={() => {
                setHandleEditModal(true);
              }}
            >
              <EditIcon />
            </div>
          </div>
        </div>
      </div>
      <ShardComponentModal
        {...modalProps}
        body={
          <EditPriceForm
            fetchPrices={fetchPrices}
            categoriesOptions={categoriesOptions}
            defaultValue={price}
            companiesOptions={companiesOptions}
            taxesOptions={taxesOptions}
            setHandleEditModal={setHandleEditModal}
            userType={userType}
          />
        }
        isOpen={handleEditModal}
        handleClose={() => {
          setHandleEditModal(false);
        }}
        title={t("EditPriceForm.EditPrice")}
      />
    </>
  );
};

export default PriceItem;
