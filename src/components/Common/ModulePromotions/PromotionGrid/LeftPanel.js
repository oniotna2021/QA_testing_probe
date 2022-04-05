import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// UI
import { Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Skeleton from "@material-ui/lab/Skeleton";

// icons
import { IconSearch } from "assets/icons/customize/config";

// components
import ProductItemCard from "./Cards/ProductItemCard";

// utils
import { compareFilterOptions } from "utils/misc";

// hooks
import { useSearchElasticProducts } from "hooks/useSearchElasticProducts";

// redux
import { connect } from "react-redux";

const LeftPanel = ({ selectedProducts, defaultInfo }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [setTerm, options, searchLoader] = useSearchElasticProducts();
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    setFilteredOptions(compareFilterOptions(options, selectedProducts));
  }, [selectedProducts, options]);

  return (
    <>
      <div className="mb-5">
        <Typography variant="h6">{defaultInfo?.name}</Typography>
        <Typography variant="p">
          {t("PromotionRule.Creation")} {defaultInfo?.created_at}
        </Typography>
      </div>

      <div>
        <Typography variant="p">
          {t("Promotions.SearchProductsLabel")}
        </Typography>

        <TextField
          className="mb-3 mt-3"
          variant="outlined"
          label={t("ModuleKit.SearchProduct")}
          onChange={(e) => setTerm(e.target.value)}
          InputProps={{
            endAdornment: <IconSearch color={theme.palette.black.main} />,
          }}
        />
      </div>

      <div>
        {searchLoader ? (
          <div>
            <Skeleton animation="wave" height={50} />
            <Skeleton animation="wave" height={50} />
            <Skeleton animation="wave" height={50} />
          </div>
        ) : (
          filteredOptions.map((item, idx) => {
            return (
              <ProductItemCard
                key={`product - ${idx}`}
                product={item._source}
              />
            );
          })
        )}
      </div>
    </>
  );
};

const mapStateToProps = ({ promotions }) => ({
  selectedProducts: promotions.selectedProducts,
});

export default connect(mapStateToProps)(LeftPanel);
