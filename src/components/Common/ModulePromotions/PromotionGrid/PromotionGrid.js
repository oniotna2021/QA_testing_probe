import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router";

// UI
import Button from "@material-ui/core/Button";

// components
import LeftPanel from "./LeftPanel";
import Grid from "./Grid/Grid.js";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

// utils
import { errorToast, infoToast, mapErrors, successToast } from "utils/misc";
import { useStyles } from "utils/useStyles";

// services
import {
  addProductsToPromotion,
  getPromotionGridByuuid,
  editPromotionGrid,
} from "services/Comercial/Promotions";
import { getAllCategories } from "services/GeneralConfig/Categories";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  resetGrid,
  updateSelectedProducts,
  updateSelectedCategories,
  updateSelectedPromotions,
} from "modules/promotions";

const PromotionGrid = ({
  resetGrid,
  selectedPromotions,
  selectedProducts,
  selectedCategories,
  updateSelectedProducts,
  updateSelectedCategories,
  updateSelectedPromotions,
}) => {
  const { t } = useTranslation();
  const { promotion_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDefaultGrid, setIsLoadingDefaultGrid] = useState(false);
  const [defaultGrid, setDefaultGrid] = useState();
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [defaultInfo, setDefaultInfo] = useState({});

  const savePromotionGrid = () => {
    setIsLoading(true);
    const dataSubmit = {
      promotion_uuid: promotion_id,
      promotions: selectedPromotions,
    };

    const serviceToFetch = defaultGrid
      ? editPromotionGrid
      : addProductsToPromotion;

    serviceToFetch(dataSubmit)
      .then((data) => {
        if (data.data.status === "success") {
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          history.push("/promotions");
        } else {
          enqueueSnackbar(mapErrors(data.data), errorToast);
        }
      })
      .catch((err) => enqueueSnackbar(mapErrors(err), errorToast))
      .finally(() => setIsLoading(false));
  };

  const getDefaultData = useCallback(async () => {
    try {
      setIsLoadingDefaultGrid(true);
      const { data: allCategories } = await getAllCategories();
      const { data: promotionGrid } = await getPromotionGridByuuid(
        promotion_id
      );

      setCategoriesOptions(allCategories.data);
      if (promotionGrid?.data?.grid?.length > 0) {
        setDefaultGrid(promotionGrid?.data?.grid);
        setDefaultInfo(promotionGrid.data);
      } else {
        enqueueSnackbar(t("PromotionRule.CreateGridAlert"), infoToast);
      }
    } catch (err) {
      enqueueSnackbar(mapErrors(err), errorToast);
    }
    setIsLoadingDefaultGrid(false);
  }, [enqueueSnackbar, promotion_id, t]);

  // get default grid
  useEffect(() => {
    window.scrollTo(0, 0);
    getDefaultData();
    return () => {
      resetGrid();
    };
  }, [getDefaultData, resetGrid]);

  // assign default grid to redux state
  useEffect(() => {
    let selectedCategories = [];
    const currentProducts = [];
    const currentCategories = [];

    // assign products with selected categories
    defaultGrid?.forEach((gridItem) => {
      selectedCategories = [];
      defaultGrid?.forEach((promotion) => {
        if (promotion.product_id === gridItem.product_id) {
          return selectedCategories.push({ id: promotion.category_id });
        }
      });
      if (!currentProducts.some((item) => item.id === gridItem.product_id)) {
        return currentProducts.push({
          id: gridItem.product_id,
          name: gridItem.product_name,
          uuid: gridItem.product_uuid,
          selectedCategories,
        });
      }
    });

    // assign categories
    defaultGrid?.forEach((gridItem) => {
      if (!currentCategories.some((item) => item.id === gridItem.category_id)) {
        return currentCategories.push({
          id: gridItem.category_id,
          name: categoriesOptions?.find(
            (category) => category.id === gridItem.category_id
          )?.name,
        });
      }
    });

    updateSelectedCategories(currentCategories);
    updateSelectedProducts(currentProducts);
    // assign promotions
    updateSelectedPromotions(defaultGrid || []);
  }, [
    defaultGrid,
    updateSelectedProducts,
    updateSelectedCategories,
    updateSelectedPromotions,
    categoriesOptions,
  ]);

  const handleCategories = () => {
    let currentCategories = [];

    selectedCategories.forEach((category) => {
      selectedProducts.forEach((product) => {
        if (
          product.selectedCategories.some(
            (productCategory) => productCategory.id === category.id
          ) &&
          !currentCategories.some(
            (selectedCategory) => selectedCategory.id === category.id
          )
        ) {
          currentCategories.push(category);
        }
      });
    });

    updateSelectedCategories(currentCategories);
  };

  // handle categories validating products
  /* eslint-disable */
  useEffect(() => {
    if (selectedCategories.length > 0) {
      handleCategories();
    }
  }, [selectedProducts]);

  return (
    <div className="container ">
      {isLoadingDefaultGrid ? (
        <Loading />
      ) : (
        <div className="row">
          <div
            className="col-4 p-4"
            style={{
              backgroundColor: "#F3F3F3",
              borderRadius: 20,
              minHeight: "85vh",
            }}
          >
            <LeftPanel defaultInfo={defaultInfo} />
          </div>

          <div className="col-8 p-3 d-flex flex-column align-items-center">
            <Grid />
            <div className="d-flex justify-content-around row mt-5">
              <Button
                className={classes.buttonCancel}
                onClick={() => resetGrid()}
              >
                {t("PromotionRule.DeleteGrid")}
              </Button>
              <ButtonSave
                text={defaultGrid ? t("Btn.Edit") : t("Btn.save")}
                onClick={savePromotionGrid}
                loader={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ promotions }) => ({
  selectedPromotions: promotions.selectedPromotions,
  selectedProducts: promotions.selectedProducts,
  selectedCategories: promotions.selectedCategories,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      resetGrid,
      updateSelectedProducts,
      updateSelectedCategories,
      updateSelectedPromotions,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PromotionGrid);
