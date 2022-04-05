import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";

// UI
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import { Autocomplete } from "@material-ui/lab";

// components
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  updateSelectedCategories,
  updateSelectedProducts,
} from "modules/promotions";

// hooks
import { useSearchElasticProducts } from "hooks/useSearchElasticProducts";

// utils
import { compareFilterOptions, errorToast, mapErrors } from "utils/misc";

// services
import { getAllCategories } from "services/GeneralConfig/Categories";
import { getVenuesByCategories } from "services/GeneralConfig/Venues";
import Loading from "components/Shared/Loading/Loading";
import { Typography } from "@material-ui/core";

const AddProduct = ({
  selectedProducts,
  selectedCategories,
  updateSelectedCategories,
  updateSelectedProducts,
  setAddProductModal,
  defaultValue,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [setTerm, options] = useSearchElasticProducts();
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [applyAllVenues, setApplyAllVenues] = useState(true);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedCategoriesInput, setSelectedCategoriesInput] = useState([]);
  const [venuesByCategory, setVenuesByCategory] = useState([]);

  const onSubmit = (values) => {
    values.filteredCategories = [];
    values.category.map((category) => {
      if (
        !selectedCategories.some(
          (selectedCategory) => selectedCategory.id === category.id
        )
      ) {
        return values.filteredCategories.push(category);
      }
      return null;
    });

    updateSelectedCategories([
      ...selectedCategories,
      ...values.filteredCategories,
    ]);
    updateSelectedProducts([
      ...selectedProducts,
      {
        ...values.product[0]._source,
        selectedCategories: [...values.category],
      },
    ]);
    setAddProductModal(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getAllCategories()
      .then(({ data }) => {
        if (data.status === "success") {
          setCategoriesOptions(data.data);
        } else {
          enqueueSnackbar(mapErrors(data, errorToast));
        }
      })
      .catch((err) => enqueueSnackbar(mapErrors(err, errorToast)))
      .finally(() => setIsLoading(false));
  }, [enqueueSnackbar]);

  useEffect(() => {
    setFilteredOptions(compareFilterOptions(options, selectedProducts));
  }, [options, selectedProducts]);

  useEffect(() => {
    getVenuesByCategories(
      selectedCategoriesInput.map((category) => category.id)
    )
      .then(({ data }) => {
        if (data.status === "success") {
          setVenuesByCategory(data.data);
        } else {
          setVenuesByCategory([]);
        }
      })
      .catch((err) => enqueueSnackbar(mapErrors(err, errorToast)));
  }, [selectedCategoriesInput, enqueueSnackbar]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-3">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ControlledAutocomplete
            required={true}
            control={control}
            name="product"
            options={filteredOptions || []}
            getOptionLabel={(option) => `${option?._source?.name}`}
            defaultValue={defaultValue ? [{ _source: defaultValue }] : []}
            renderInput={(params) => (
              <TextField
                {...params}
                error={errors.product}
                label={t("Promotions.SearchProduct")}
                variant="outlined"
                margin="normal"
                onChange={({ target }) => setTerm(target.value)}
              />
            )}
          />

          <Controller
            rules={{ required: true }}
            control={control}
            name="category"
            render={({ field: { onChange } }) => (
              <Autocomplete
                options={categoriesOptions || []}
                multiple={true}
                getOptionLabel={(option) => `${option.name}`}
                onChange={(_, data) => {
                  setSelectedCategoriesInput(data);
                  onChange(data);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={errors.category}
                    label={t("EditPriceForm.Category")}
                    variant="outlined"
                    margin="normal"
                    onChange={({ target }) => setTerm(target.value)}
                  />
                )}
              />
            )}
          />

          <div className="mt-3 mb-1 d-flex justify-content-around">
            <Typography variant="p">
              {t("Promotions.ApplyAllVenues")}
            </Typography>
            <Checkbox
              color="primary"
              size="medium"
              checked={applyAllVenues}
              onChange={() => setApplyAllVenues(!applyAllVenues)}
            />
          </div>

          {!applyAllVenues && (
            <Controller
              rules={{ required: true }}
              control={control}
              name="venues"
              render={({ field: { onChange } }) => (
                <Autocomplete
                  options={venuesByCategory || []}
                  multiple={true}
                  getOptionLabel={(option) => `${option.name}`}
                  onChange={(_, data) => onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={errors.venues}
                      label={t("Promotions.Venues")}
                      variant="outlined"
                      margin="normal"
                      onChange={({ target }) => setTerm(target.value)}
                    />
                  )}
                />
              )}
            />
          )}

          <div className="mt-3 d-flex justify-content-end">
            <ButtonSave text={t("Btn.save")} />
          </div>
        </>
      )}
    </form>
  );
};

const mapStateToProps = ({ promotions }) => ({
  selectedProducts: promotions.selectedProducts,
  selectedCategories: promotions.selectedCategories,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateSelectedCategories,
      updateSelectedProducts,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
