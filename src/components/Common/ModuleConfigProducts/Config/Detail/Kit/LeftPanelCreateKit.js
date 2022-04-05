import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

//UI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { useTheme } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";

//components
import AccordionDetailProduct from "./AccordionDetailProduct";
import ItemSearchProduct from "./ItemSearchProduct";

//utils
import { useStyles } from "utils/useStyles";

//icons
import { IconSearch } from "assets/icons/customize/config";

//services
import { getProductById } from "services/Comercial/Product";

// hooks
import { useSearchElasticProducts } from "hooks/useSearchElasticProducts";

const LeftPanelCreateKit = ({
  detailProduct,
  setSelectedProducts,
  selectedProducts,
  isLoading,
  setisLoading,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();

  const [setTerm, options, searchLoader] = useSearchElasticProducts();

  useEffect(() => {
    setisLoading(true);
    getProductById(detailProduct.uuid)
      .then(({ data }) => {
        setisLoading(false);
        if (data && data.status === "success") {
          setSelectedProducts(data.data.kit_products);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const addNewProduct = (item) => {
    const itemFound = selectedProducts.find((x) => x.id === item.id);
    if (!itemFound) {
      return setSelectedProducts([...selectedProducts, item]);
    }
  };

  return (
    <div className={`col-4 ${classes.rightPanelKit}`}>
      <AccordionDetailProduct detailProduct={detailProduct} />
      <div className="mb-4">
        <Typography variant="h4">{t("ModuleKit.TitleCreateKit")}</Typography>
        <Typography variant="body1">
          {t("ModuleKit.DescriptionCreateKit")}
        </Typography>
      </div>
      <TextField
        variant="outlined"
        label={t("ModuleKit.SearchProduct")}
        onChange={(e) => setTerm(e.target.value)}
        InputProps={{
          endAdornment: <IconSearch color={theme.palette.black.main} />,
        }}
      />
      <div className="mt-4">
        {isLoading ? (
          <div>
            <Skeleton animation="wave" height={50} />
            <Skeleton animation="wave" height={50} />
            <Skeleton animation="wave" height={50} />
          </div>
        ) : searchLoader ? (
          <div>
            <Skeleton animation="wave" height={50} />
            <Skeleton animation="wave" height={50} />
          </div>
        ) : (
          options.map((item, idx) => {
            const found = selectedProducts.find(
              (x) => Number(x.id) === Number(item._source.id)
            );
            if (
              !found &&
              item._source.product_type !== "kit" &&
              item._source.organization === detailProduct.organization &&
              Number(item._source.id) !== Number(detailProduct.id)
            )
              return (
                <ItemSearchProduct
                  key={`product - ${idx}`}
                  product={item._source}
                  addNewProduct={addNewProduct}
                />
              );
          })
        )}
      </div>
    </div>
  );
};

export default LeftPanelCreateKit;
