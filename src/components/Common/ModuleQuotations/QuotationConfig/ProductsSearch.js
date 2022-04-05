//icons
import { IconLocation, IconSearch } from "assets/icons/customize/config";
import { InputLabel, MenuItem, Select } from "@material-ui/core";

// components
import ProductCard from "./Cards/ProductCard";
import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import TextField from "@material-ui/core/TextField";
//UI
import Typography from "@material-ui/core/Typography";
import { bindActionCreators } from "redux";
//redux
import { connect } from "react-redux";
import { updateSelectedProducts } from "modules/quotations";
import { useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

const ProductsSearch = ({
  setTerm,
  options,
  searchLoader,
  currencies,
  isDetail,
  updateSelectedProducts,
  selectedProducts,
  setUpdateItemFetch
}) => {

  const { t } = useTranslation();
  const theme = useTheme();


  return (
    <>
      <div className="row">
        <div className="col-12 mb-3">
            <Typography variant="h5" >
              {t("QuotationsConfig.SearchProducts")}
            </Typography>
            <div className="row mt-3 mb-2 mx-0">
            <div className="col-2 px-0 my-auto"><IconLocation /></div>
            <div className="col-10 px-0 ">
              <Select
                fullWidth
                onChange={() => { }}
                disableUnderline
              >
                {['Gran Estación', 'Salitre Plaza', 'Centro Mayor'].map((item) => (
                  <MenuItem key={`item-${item}`} value={item}  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
          </div>
          </div>
          <Typography  variant="p" >
              {t("QuotationsConfig.SearchProducts.Label")}
            </Typography>
          
          <TextField
          className="mt-3"
            disabled={isDetail}
            variant="outlined"
            label={t("ModuleKit.SearchProduct")}
            onChange={(e) => setTerm(e.target.value)}
            InputProps={{
              endAdornment: <IconSearch color={theme.palette.black.main} />,
            }}
          />
        </div>
      </div>
      <div className="row mb-5">
        <div className="col">
          {searchLoader ? (
            <div>
              <Skeleton animation="wave" height={40} />
              <Skeleton animation="wave" height={40} />
              <Skeleton animation="wave" height={40} />
            </div>
          ) : (
            options.forEach((product) => {
              const found = selectedProducts.find(
                (item) => item.id === product.id
              );
              if (!found) {
                return (
                  <ProductCard
                    setUpdateItemFetch={setUpdateItemFetch}
                    currencies={currencies}
                    product={product}
                    updateSelectedProducts={updateSelectedProducts}
                    selectedProducts={selectedProducts}
                  />
                );
              }
            })
          )}
        </div>
      </div>
      {!isDetail && (
        <div className="row">
          <div className="col">
            {/* <Typography variant="h5" className="mb-3">
              {t("QuotationsConfig.SelledProducts")}
            </Typography> */}

            <div>
              {options.map((product) => {
                const found = selectedProducts.find(
                  (item) => item.id === product.id
                );
                if (!found) {
                  return (
                    <ProductCard
                      currencies={currencies}
                      product={product}
                      setUpdateItemFetch={setUpdateItemFetch}
                      updateSelectedProducts={updateSelectedProducts}
                      selectedProducts={selectedProducts}
                    />
                  );
                }

                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ quotations }) => ({
  selectedProducts: quotations.selectedProducts,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateSelectedProducts,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProductsSearch);
