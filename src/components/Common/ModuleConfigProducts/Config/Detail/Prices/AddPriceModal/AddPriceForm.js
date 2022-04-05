import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useStyles } from "utils/useStyles";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";

// components
import NewPriceForm from "./NewPriceForm";
import NewCurrencyForm from "./NewCurrencyForm";

//utils
import { successToast, errorToast, mapErrors, infoToast } from "utils/misc";

// services
import { postPrice } from "services/Comercial/Price";
import { getAllCategories } from "services/GeneralConfig/Categories";
import { getAllTaxes } from "services/Comercial/Tax";
import { deletePrice } from "services/Comercial/Price";
import { getAllChannels } from "services/Comercial/Channel";
import { getAllSegments } from "services/GeneralConfig/Segments";


const AddPriceForm = ({
  setNewCurrencyForm,
  newCurrencyForm,
  productInfo,
  currentPrices,
  userType,
  handleClose,
  fetchPrices,
}) => {
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [taxesOptions, setTaxesOptions] = useState([]);
  const [channels, setChannels] = useState([]);
  const [segments, setSegments] = useState([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { t } = useTranslation();

  const onSubmit = async (values) => {


    if (values.id_category && values.id_category.length > 0) {
      values.product_id = productInfo.id;
      values.price = Number(values.price);
      values.price_min = Number(values.price_min);



      if (values.id_category) {
        values.id_category = values.id_category.map((tax) => {
          return tax.id;
        });
      }

      if (values.segments) {
        values.id_sub_segment = values.segments.map((tax) => {
          return tax.id;
        });
      }


      if (values.channels) {
        values.id_channel = values.channels.map((tax) => {
          return tax.id;
        });
      }

      if (values.taxes) {
        values.taxes = values.taxes.map((tax) => {
          return tax.id;
        });
      }

      try {
        setLoadingFetch(true);
        const { data } = await postPrice(values);
        if (data && data.status === "success") {
          reset();
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          fetchPrices();
          handleClose();
          setNewCurrencyForm(false);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
        setLoadingFetch(false);
      } catch (err) {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoadingFetch(false);
      }
    } else {
      enqueueSnackbar(t("CreatePriceForm.CategoryError"), infoToast);
    }
  };

  const onError = () => {
    enqueueSnackbar(t("CreatePriceForm.CategoryFieldsRequired"), infoToast);
  };

  const deleteItem = (uuid) => {
    Swal.fire({
      title: t("Message.AreYouSure"),
      text: t("Message.DontRevertThis"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Message.YesDeleteIt"),
    }).then((result) => {
      if (result.isConfirmed) {
        deletePrice(uuid)
          .then((req) => {
            fetchPrices();
            Swal.fire(
              t("Message.Eliminated"),
              t("Message.EliminatedSuccess"),
              "success"
            );
          })
          .catch((err) => {
            Swal.fire(t("Message.ErrorOcurred"), mapErrors(err), "error");
          });
      }
    });
  };

  const getSelectOptions = async () => {
    try {
      const categories = await getAllCategories();
      setCategoriesOptions(categories.data.data);

      const taxes = await getAllTaxes();
      setTaxesOptions(taxes.data.data.items);

      const segments = await getAllSegments();
      setSegments(segments.data.data);

      const channels = await getAllChannels();
      setChannels(channels.data.data.items);
    } catch (err) {
      enqueueSnackbar(mapErrors(err), errorToast);
    }
  };

  useEffect(() => {
    getSelectOptions();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        {!newCurrencyForm ? (
          <NewPriceForm
            fetchPrices={fetchPrices}
            Controller={Controller}
            control={control}
            classes={classes}
            t={t}
            deleteItem={deleteItem}
            channels={channels}
            segments={segments}
            currentPrices={currentPrices}
            setNewCurrencyForm={setNewCurrencyForm}
            taxesOptions={taxesOptions}
            categoriesOptions={categoriesOptions}
            userType={userType}
          />
        ) : (
          <NewCurrencyForm
            errors={errors}
            loadingFetch={loadingFetch}
            Controller={Controller}
            control={control}
            classes={classes}
            t={t}
            setNewCurrencyForm={setNewCurrencyForm}
            taxesOptions={taxesOptions}
            userType={userType}
          />
        )}
      </form>
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  userType: auth.userType,
});

export default connect(mapStateToProps)(AddPriceForm);
