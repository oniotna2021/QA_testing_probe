import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

//UI
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

//utils
import { useStyles } from "utils/useStyles";

//components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

// services
import { getVenuesByCity } from "services/GeneralConfig/Venues";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateSelectedProducts } from "modules/quotations";

const SelectVenue = ({
  setSelectVenueModal,
  citiesOptions,
  product,
  price,
  sign,
  updateSelectedProducts,
  selectedProducts,
}) => {
  const [selectedCity, setselectedCity] = useState();
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venuesOptions, setvenuesOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  const classes = useStyles();

  const handleSelectProduct = () => {
    if (selectedCity && selectedVenue) {
      if (
        !selectedProducts.find((productItem) => productItem.id === product.id)
      ) {
        updateSelectedProducts([
          ...selectedProducts,
          {
            ...product,
            id_venue: selectedVenue.id,
            id_category: selectedVenue.id_category,
            sign: sign?.sign,
            price,
          },
        ]);
        handleCancel();
      }
    }
  };

  const handleCancel = () => {
    setSelectVenueModal(false);
  };

  useEffect(() => {
    if (selectedCity) {
      setIsLoading(true);
      setSelectedVenue(null);
      getVenuesByCity(selectedCity).then(({ data }) => {
        setvenuesOptions(data.data);
        setIsLoading(false);
      });
    }
  }, [selectedCity]);

  return (
    <div className="container row">
      <div className="col-12 my-4">{t("Detail.SpecificProduct")}</div>
      <div className="col-12">
        <Autocomplete
          name="cities"
          multiple={false}
          options={citiesOptions || []}
          onChange={(_, data) => setselectedCity(data.id)}
          getOptionLabel={(option) => `${option.name}`}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("FormZones.City")}
              variant="outlined"
              margin="normal"
            />
          )}
        />

        {!selectedCity ? (
          <span style={{ color: "gray" }}>
            {t("QuotationsConfig.SelectVenue.SelectCity")}
          </span>
        ) : isLoading ? (
          <Loading />
        ) : (
          <Autocomplete
            name="venue"
            multiple={false}
            options={venuesOptions || []}
            onChange={(_, data) => setSelectedVenue(data)}
            getOptionLabel={(option) => `${option.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("FormProfessional.InputSelectVenue")}
                variant="outlined"
                margin="normal"
              />
            )}
          />
        )}
      </div>
      <div className="d-flex justify-content-around my-4">
        <Button className={classes.buttonCancel} onClick={handleCancel}>
          {t("Btn.Cancel")}
        </Button>
        <ButtonSave
          style={{ width: 180 }}
          disabled={!selectedVenue ? true : false}
          text={t("Promotions.AddProduct")}
          onClick={() => {
            handleSelectProduct();
          }}
        />
      </div>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectVenue);
