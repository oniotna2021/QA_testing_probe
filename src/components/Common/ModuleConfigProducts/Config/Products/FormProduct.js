import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
//utils
import {
  errorToast,
  frecuencyType,
  infoToast,
  mapErrors,
  successToast,
} from "utils/misc";
import {
  getCustomizedActivities,
  getProductActivities,
} from "services/Reservations/activities";

// UI
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { Button } from "@material-ui/core";
//Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";
import FirstStepForm from "./FormSteps/FirstStepForm";
import FirstStepFormV2 from "./FormSteps/FirstStepFormV2";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import SecondStepForm from "./FormSteps/SecondStepForm";
import Select from "@material-ui/core/Select";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import TextField from "@material-ui/core/TextField";
import { getAllChannels } from "services/Comercial/Channel";
import { getAllOrganizations } from "services/GeneralConfig/Organization";
//Services
import { postProduct } from "services/Comercial/Product";
import { postVariant } from "services/Comercial/Variant";
import { putProduct } from "services/Comercial/Product";
import { useHistory } from "react-router";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//Utils
import { formatPriceReplace } from 'utils/misc';

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

export const FormProduct = ({
  defaultValue,
  setExpanded,
  isVariant,
  productUUID,
  fromEditProduct,
  userType,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [isSecondStep, setIsSecondStep] = useState(false);
  const [activities, setActivities] = useState([]);
  const [agendaVenue, setAgendaVenue] = useState(false);
  const [agendaPersonalized, setAgendaPersonalized] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [expandedForSale, setExpandedForSale] = useState(false);

  const [channels, setChannels] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const onSubmit = (value) => {

    // console.log(value);
    // return;

    const submitData = {
      ...value,
      // channels:
      //   value.channels !== undefined
      //     ? value.channels.map((channel) => {
      //       return { id: channel.id };
      //     })
      //     : defaultValue.product_channels.map((channel) => {
      //       return { id: channel.id };
      //     }),

      // agenda_personalized: fromEditProduct
      //   ? defaultValue.agenda_personalized
      //   : value.agenda_personalized_activities?.length > 0,

      // agenda_product: fromEditProduct
      //   ? defaultValue.agenda_product
      //   : value.agenda_product_activities?.length > 0,

      // number_sessions: fromEditProduct
      //   ? defaultValue.number_sessions
      //   : value.number_sessions,

      // agenda_personalized_activities: fromEditProduct
      //   ? defaultValue.product_agenda_personalized.map((activity) => {
      //     return { id: activity.activity_id };
      //   })
      //   : value.agenda_personalized_activities?.map((activity) => {
      //     return {
      //       id: activity.id,
      //       min_sessions: Number(value?.[`min_sessions_${activity.id}`]),
      //     };
      //   }),

      agenda_product_activities: fromEditProduct
        ? defaultValue.product_agenda_product.map((activity) => {
          return { id: activity.activity_id };
        })
        : value.agenda_product_activities,
      accounting_configuration: {
        "code_sales": value.code_sales,
        "code_purchase": value.code_purchase,
        "export_accounting_code": value.export_accounting_code,
        "code_import_purchase": value.export_accounting_code
      },
      product_detail: {
        "service_agreements": value.service_agreements,
        "external_reference": value.external_reference,
        "short_description": value.short_description,
        "long_description": value.long_description,
        "private_note": value.private_note,
        "public_note": value.public_note
      },
      sku: value.name,
      price: Number.isInteger(value.price) ? value.price : formatPriceReplace(value.price),
      "available_for_sale": expandedForSale
    };

    setLoadingFetch(true);
    const postOption = fromEditProduct
      ? putProduct
      : isVariant
        ? postVariant
        : postProduct;
    postOption(
      submitData,
      isVariant ? productUUID : fromEditProduct ? defaultValue.uuid : null
    )
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          console.log(data);
          if (isVariant) {
            enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
            history.push(`/`);
            history.replace(`detail-config-products/${data.data.product.uuid}`);
          } else if (!fromEditProduct) {
            setExpanded(false);
            enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
            history.push(`detail-config-products/${data.data.product.uuid}`);
          } else {
            enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
            history.push(`/`);
            history.replace(`detail-config-products/${defaultValue.uuid}`);
          }
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
        setLoadingFetch(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoadingFetch(false);
      });
  };


  const onError = () => {
    if (fromEditProduct) {
      setIsSecondStep(true);
    } else {
      enqueueSnackbar(t("CreatePriceForm.CategoryFieldsRequired"), infoToast);
    }
  };

  useEffect(() => {
    if (agendaPersonalized) {
      getCustomizedActivities().then(({ data }) => setActivities(data.data));
    } else if (agendaVenue) {
      getProductActivities().then(({ data }) => setActivities(data.data));
    }
  }, [agendaPersonalized, agendaVenue]);

  const handleSelectActivities = (data) => {
    setSelectedActivities(data);
  };

  useEffect(() => {
    // getAllChannels().then(({ data }) => setChannels(data.data.items));
    // getAllOrganizations().then(({ data }) => setOrganizations(data.data));
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <FirstStepFormV2
        Controller={Controller}
        control={control}
        defaultValue={defaultValue}
        userType={userType}
        errors={errors}
        getValues={getValues}
        channels={channels}
        expandedForSale={expandedForSale}
        setExpandedForSale={setExpandedForSale}
        organizations={organizations}
      />
      <div className="row mt-5">
        <div className="col-6">
          <Button
            color="#FFFFF"
            onClick={() => setExpanded(false)}
          ><div style={{ padding: '5px 50px' }}>{t('Btn.Cancel')}</div></Button>
        </div>
        <div className="col-6" style={{ textAlign: 'end' }}>
          <Button
            style={{ background: '#CC5667', color: 'white' }}
            type="submit"
          ><div style={{ padding: '5px 50px' }}>{t('Btn.save')}</div></Button>
        </div>
      </div>


    </form>
  );
};
