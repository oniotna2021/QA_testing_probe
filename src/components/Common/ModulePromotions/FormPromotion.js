import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router";

// UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

// icons
import {
  IconEditPencil,
  IconDeleteItem,
  IconCalendar,
} from "assets/icons/customize/config";

// translate
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

// utils
import { errorToast, mapErrors, successToast, infoToast } from "utils/misc";

// services
import {
  deletePromotion,
  putPromotion,
  postPromotion,
} from "services/Comercial/Promotions";

// swal
import Swal from "sweetalert2";
import Loading from "components/Shared/Loading/Loading";

const useStyles = makeStyles((theme) => ({
  iconButton: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    background: "#F3F3F3",
    marginLeft: "0.5em",
  },
}));

const FormPromotion = ({
  defaultValue,
  load,
  setLoad,
  dataPromotion,
  setExpand,
  isDetail,
  setIsDetail,
}) => {
  const history = useHistory();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [loadSave, setLoadSave] = useState(false);
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = (data) => {
    setLoadSave(true);
    let dataSubmit = {
      name: data.name,
      description: data.description,
      start_period_publication: data.start_period_publication,
      end_period_publication: data.end_period_publication,
      start_period_contract: data.start_period_contract,
      end_period_contract: data.end_period_contract,
      months_advance: Number(1, 24),
    };

    if (!defaultValue) {
      postPromotion(dataSubmit)
        .then(({ data }) => {
          if (data && data.status === "success") {
            enqueueSnackbar(data.message, successToast);
            history.push(`/promotions-grid/${data.data.uuid}`);
          } else {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => setLoadSave(false));
    } else {
      putPromotion(dataSubmit, defaultValue.uuid)
        .then(({ data }) => {
          if (data && data.status === "success") {
            enqueueSnackbar(data.message, successToast);
            setLoad(!load);
            setExpand(true);
            setIsDetail(true);
          } else {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => setLoadSave(false));
    }
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
  };

  const handleDelete = () => {
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
        deletePromotion(defaultValue.uuid)
          .then(({ data }) => {
            Swal.fire(
              t("Message.Eliminated"),
              t("Message.EliminatedSuccess"),
              "success"
            );
            setLoad(!load);
          })
          .catch((err) => {
            Swal.fire(t("Message.ErrorOcurred"), mapErrors(err), "error");
          });
      }
    });
  };

  return (
    <div className="mx-4 my-4">
      {!isDetail ? (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="row">
            <div className="col-12">
              <Controller
                defaultValue={defaultValue && defaultValue?.name}
                rules={{ required: true }}
                control={control}
                name="name"
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={errors.name ? true : false}
                    fullWidth
                    type="text"
                    label={t("ListPromotions.NamePromotions")}
                    rows={1}
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div className="col-6 mt-3">
              <div className="col-12 d-flex justify-content-between">
                <div className="col-5">
                  <Controller
                    defaultValue={defaultValue?.start_period_publication}
                    rules={{ required: true }}
                    control={control}
                    name="start_period_publication"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={errors.start_period_publication ? true : false}
                        type="date"
                        label={t("Promotions.StartPeriod")}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </div>
                <div className="col-5">
                  <Controller
                    defaultValue={defaultValue?.end_period_publication}
                    rules={{ required: true }}
                    control={control}
                    name="end_period_publication"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={errors.end_period_publication ? true : false}
                        type="date"
                        label={t("Promotions.EndPeriod")}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 d-flex justify-content-between">
                <div className="col-5 mt-3">
                  <Controller
                    defaultValue={defaultValue?.start_period_contract}
                    rules={{ required: true }}
                    control={control}
                    name="start_period_contract"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={errors.start_period_contract ? true : false}
                        type="date"
                        label={t("Promotions.StartPeriodContract")}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </div>
                <div className="col-5 mt-3">
                  <Controller
                    defaultValue={defaultValue?.end_period_contract}
                    rules={{ required: true }}
                    control={control}
                    name="end_period_contract"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={errors.end_period_contract ? true : false}
                        type="date"
                        label={t("Promotions.EndPeriodContract")}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-2">
                <Button
                  style={{ height: 50, background: "#EBEBEB" }}
                  endIcon={
                    loadSave ? (
                      <Loading />
                    ) : (
                      <IconEditPencil width="24" height="24" color="#3C3C3B" />
                    )
                  }
                  fullWidth
                  onClick={handleSubmit(onSubmit, onError)}
                >
                  <Typography style={{ marginRight: 30 }}>
                    {t("ListPromotions.CreatePromotion")}
                  </Typography>
                </Button>
              </div>
            </div>
            <div className="col-6 mt-3">
              <Controller
                defaultValue={defaultValue?.description}
                rules={{ required: true }}
                control={control}
                name="description"
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={errors.description ? true : false}
                    multiline
                    rows={8}
                    type="text"
                    label={t("WeeklyNutrition.InputDescription")}
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div className="d-flex justify-content-end mt-3">
              {defaultValue && <ButtonSave text="Guardar" loader={loadSave} />}
            </div>
          </div>
        </form>
      ) : (
        <div className="row">
          <div className="col-12 d-flex mx-2 my-4">
            <div className="col-5">
              <div className="d-flex">
                <div className="col-6">
                  <Typography>{t("Promotions.StartPeriod")}</Typography>
                  <div className="col-8 d-flex align-items-center">
                    {<IconCalendar color="#FF6978" />}
                    <p style={{ marginLeft: 10 }}>
                      {defaultValue?.start_period_publication}
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <Typography>{t("Promotions.EndPeriod")}</Typography>
                  <div className="col-8 d-flex align-items-center my-0">
                    {<IconCalendar color="#FF6978" />}
                    <p style={{ marginLeft: 10 }}>
                      {defaultValue?.end_period_publication}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 d-flex mt-2 justify-content-between">
                <div className="col-6">
                  <Typography>{t("Promotions.StartPeriodContract")}</Typography>
                  <div className="col-8 d-flex align-items-center">
                    {<IconCalendar color="#FF6978" />}
                    <p style={{ marginLeft: 10 }}>
                      {defaultValue?.start_period_contract}
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <Typography>{t("Promotions.EndPeriodContract")}</Typography>
                  <div className="col-8 d-flex align-items-center">
                    {<IconCalendar color="#FF6978" />}
                    <p style={{ marginLeft: 10 }}>
                      {defaultValue?.end_period_contract}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-10 mt-2">
                {defaultValue.has_grid ? (
                  <Button
                    style={{
                      height: 50,
                      background: "#FF6978",
                      color: "#FFFF",
                    }}
                    endIcon={
                      <IconEditPencil width="24" height="24" color="#FFFF" />
                    }
                    fullWidth
                    onClick={() =>
                      history.push(`/promotions-grid/${defaultValue?.uuid}`)
                    }
                  >
                    <Typography style={{ marginRight: 30 }}>
                      {t("Promotions.SeeMayaPromotion")}
                    </Typography>
                  </Button>
                ) : (
                  <Button
                    style={{ height: 50, background: "#EBEBEB" }}
                    endIcon={
                      loadSave ? (
                        <Loading />
                      ) : (
                        <IconEditPencil
                          width="24"
                          height="24"
                          color="#3C3C3B"
                        />
                      )
                    }
                    fullWidth
                    onClick={() =>
                      history.push(`/promotions-grid/${defaultValue?.uuid}`)
                    }
                  >
                    <Typography style={{ marginRight: 30 }}>
                      {t("ListPromotions.CreatePromotion")}
                    </Typography>
                  </Button>
                )}
              </div>
            </div>
            <div className="col-5">
              <Typography>{t("WeeklyNutrition.InputDescription")}</Typography>
              <TextField
                style={{ background: "#F3F3F3" }}
                multiline
                rows={8}
                type="text"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                value={defaultValue?.description}
              />
            </div>
            <div className="col-3 d-flex align-items-end mx-3">
              <IconButton
                className={classes.iconButton}
                onClick={() => setIsDetail(false)}
              >
                {<IconEditPencil color="#FF6978" />}
              </IconButton>
              <IconButton className={classes.iconButton} onClick={handleDelete}>
                {<IconDeleteItem color="#FF6978" />}
              </IconButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPromotion;
