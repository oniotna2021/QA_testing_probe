import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

//UI
import Typography from "@material-ui/core/Typography";

// components
import Loading from "components/Shared/Loading/Loading";

// utils
import { errorToast, mapErrors } from "utils/misc";

// services
import { getProductById } from "services/Comercial/Product";

const DetailProducts = ({
  product: defaultValue,
  isDetail,
  fromSelectedProduct,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [product, setProduct] = useState();
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (fromSelectedProduct) {
      setisLoading(true);
      getProductById(defaultValue.uuid)
        .then(({ data }) => setProduct(data.data))
        .catch((err) => enqueueSnackbar(mapErrors(err), errorToast))
        .finally(() => setisLoading(false));
    } else {
      setProduct(defaultValue);
    }
  }, [defaultValue, fromSelectedProduct, enqueueSnackbar]);

  return (
    <div className="container p-3">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="col-12">
            <Typography variant={"h6"}>
              {t("DetailDescription.DescriptionShort")}
            </Typography>
            <Typography variant={"p"}>
              {isDetail
                ? product?.short_description
                : product?.product_details?.at(-1)?.short_description}
            </Typography>
          </div>
          {product?.kit_products?.length > 0 && (
            <div className="col-12 mt-3">
              <Typography variant={"h6"}>
                {t("QuotationsConfig.Resume.KitProducts")}
              </Typography>

              <ul>
                {product?.kit_products.map((kitProduct) => {
                  return <li>{kitProduct.name}</li>;
                })}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DetailProducts;
