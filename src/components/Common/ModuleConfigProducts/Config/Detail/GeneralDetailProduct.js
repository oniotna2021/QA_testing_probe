import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useStyles } from "utils/useStyles";

//UI
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/core/styles";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";

//Icons
import {
  IconGraphic,
  IconFrame,
  IconPrices,
  IconKit,
} from "assets/icons/customize/config";

//Components
import Loading from "components/Shared/Loading/Loading";
import DetailProduct from "./DetailProduct/DetailProduct";
import ListPrice from "./Prices/ListPrices";
import ContainerKitCreation from "./Kit/ContainerKitCreation";
import ListVariants from "./Variants/ListVariants";
import EditProduct from "./EditProduct/EditProduct";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

// services
import { getProductById } from "services/Comercial/Product";

const GeneralDetailProduct = () => {
  const theme = useTheme();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { product_id, index_value } = useParams();
  const [fetchData, setFechData] = useState(false);
  const [optionSelection, setOptionSelection] = useState(
    index_value ? index_value : 0
  );
  const [detailProduct, setDetailProduct] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    setFechData(true);
    getProductById(product_id)
      .then(({ data }) => {
        setDetailProduct(data.data);
        setFechData(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setFechData(false);
      });
  }, [enqueueSnackbar, product_id]);

  return (
    <div className="container">
      {fetchData ? (
        <Loading />
      ) : (
        <>
          <div className="row mb-5">
            <div className="col">
              <div className="row">
                <div className="col d-flex">
                  <Typography variant="h5" color={theme.palette.black.main}>
                    {detailProduct.name}
                  </Typography>

                  <div
                    onClick={() => setOptionSelection(0)}
                    style={{ cursor: "pointer" }}
                    className="ms-3 pt-2"
                  >
                    <VisibilityOutlinedIcon />
                  </div>
                </div>

                <Typography
                  display="block"
                  component={"span"}
                  variant="body1"
                  color={theme.palette.black.main}
                >
                  Última edición, 01, Jun, 2021
                </Typography>
              </div>
            </div>

            <div className="col-6 d-flex justify-content-start">

              <Button
                className={
                  optionSelection === null
                    ? classes.miniBoxSelected
                    : classes.miniBox
                }
                onClick={() => setOptionSelection(0)}
              >
                <Typography display="block" component={"span"} variant="body2">
                  General
                </Typography>
              </Button>

              <Button
                // disabled={true}
                startIcon={<IconGraphic color={theme.themeColor} />}
                className={
                  optionSelection === null
                    ? classes.miniBoxSelected
                    : classes.miniBox
                }
              >
                <Typography display="block" component={"span"} variant="body2">
                  {t("GeneralDetailProduct.Statistics")}
                </Typography>
              </Button>

              <Button
                startIcon={<IconPrices color={theme.themeColor} />}
                className={
                  optionSelection === 1
                    ? classes.miniBoxSelected
                    : classes.miniBox
                }
                onClick={() => setOptionSelection(1)}
              >
                <Typography display="block" component={"span"} variant="body2">
                  {t("GeneralDetailProduct.Prices")}
                </Typography>
              </Button>

              {detailProduct.product_type !== "kit" &&
                detailProduct.product_type !== "variant" && (
                  <Button
                    startIcon={<IconFrame color={theme.themeColor} />}
                    className={
                      optionSelection === 2
                        ? classes.miniBoxSelected
                        : classes.miniBox
                    }
                    onClick={() => setOptionSelection(2)}
                  >
                    <Typography
                      display="block"
                      component={"span"}
                      variant="body2"
                    >
                      {t("GeneralDetailProduct.Variants")}
                    </Typography>
                  </Button>
                )}

            </div>

            <div className="col-2 d-flex justify-content-end">
              {detailProduct.product_type !== "variant" && (
                <Button
                  startIcon={<IconKit color={theme.themeColor} />}
                  className={
                    optionSelection === 3
                      ? classes.miniBoxSelected
                      : classes.miniBox
                  }
                  onClick={() => setOptionSelection(3)}
                >
                  <Typography
                    display="block"
                    component={"span"}
                    variant="body2"
                  >
                    {detailProduct.product_type === "kit"
                      ? t("GeneralDetailProduct.KitDetail")
                      : t("GeneralDetailProduct.CreateKit")}
                  </Typography>
                </Button>
              )}
            </div>

          </div>
          {optionSelection === 0 && (
            <DetailProduct
              detailProduct={detailProduct}
              setOptionSelection={setOptionSelection}
            />
          )}
          {optionSelection === 1 && <ListPrice productInfo={detailProduct} />}
          {optionSelection === 2 && (
            <ListVariants
              productUUID={detailProduct.uuid}
              productId={detailProduct.id}
            />
          )}
          {optionSelection === 3 && (
            <ContainerKitCreation detailProduct={detailProduct} />
          )}
          {optionSelection === 4 && (
            <EditProduct detailProduct={detailProduct} />
          )}
        </>
      )}
    </div>
  );
};

export default GeneralDetailProduct;
