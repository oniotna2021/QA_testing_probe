import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

//components
import LeftPanelCreateKit from "./LeftPanelCreateKit";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//UI
import Card from "@material-ui/core/Card";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { Typography } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";

//services
import { postKit } from "services/Comercial/Kit";

const ContainerKitCreation = ({ detailProduct }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit } = useForm();
  const { t } = useTranslation();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const deleteSelectedProduct = (id) => {
    setSelectedProducts(selectedProducts.filter((item) => item.id !== id));
  };

  const onSubmit = () => {
    setLoadingFetch(true);
    let dataSubmit = {
      product_kit_id: detailProduct.id,
      products: selectedProducts.map((x) => {
        return { id: x.id };
      }),
    };
    if (dataSubmit.products.length > 0) {
      postKit(dataSubmit)
        .then(({ data }) => {
          if (data && data.status === "success") {
            enqueueSnackbar(data.message, successToast);
          } else {
            enqueueSnackbar(mapErrors(data.message), errorToast);
            setLoadingFetch(false);
          }
          setLoadingFetch(false);
        })
        .catch(({ e }) => {
          enqueueSnackbar(e, errorToast);
          setLoadingFetch(false);
        });
    } else {
      enqueueSnackbar(t("Kits.EmpryProductsError"), errorToast);
      setLoadingFetch(false);
    }
  };

  return (
    <div className="row m-0">
      <LeftPanelCreateKit
        detailProduct={detailProduct}
        setSelectedProducts={setSelectedProducts}
        selectedProducts={selectedProducts}
        isLoading={isLoading}
        setisLoading={setisLoading}
      />
      <div className="col-8">
        {isLoading ? (
          <div>
            <Skeleton animation="wave" height={50} />
            <Skeleton animation="wave" height={50} />
          </div>
        ) : (
          selectedProducts.map((item, idx) => (
            <Card
              className="p-2 mb-2 d-flex align-items-center justify-content-between"
              key={`item - ${idx}`}
            >
              <Typography variant="body1">{item.name}</Typography>
              <IconButton onClick={() => deleteSelectedProduct(item.id)}>
                <CloseIcon />
              </IconButton>
            </Card>
          ))
        )}
        <div className="d-flex justify-content-end align-items-end mt-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ButtonSave loader={loadingFetch} text={t("Btn.save")} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContainerKitCreation;
