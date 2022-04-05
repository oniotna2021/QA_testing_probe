import React, { useState, useEffect } from "react";
import { useStyles } from "utils/useStyles";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useHistory } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";

// UI
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// components
import DetailDescription from "./DetailDescription";
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import ConfirmDeleteAlert from "components/Shared/ConfirmDeleteAlert/ConfirmDeleteAlert";

//Icons
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { IconDeleteItem, IconEditItem } from "assets/icons/customize/config";

// services
import { deleteProduct } from "services/Comercial/Product";

// utils
import { successToast, errorToast, mapErrors } from "utils/misc";
import { frecuencyType } from "utils/misc";

// UI
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useTheme } from "@material-ui/core";

// services
import {
  getCustomizedActivities,
  getProductActivities,
} from "services/Reservations/activities";
import { putProduct } from "services/Comercial/Product";

import Styled from "@emotion/styled";

export const Tr = Styled.tr`
  & td{
    padding: 5px 40px 5px 30px;
  }
`;

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const parsedFrecuency = {
  ano: "Año",
  mes: "Mes",
  dia: "Día",
  hora: "Hora",
};

const DetailProduct = ({ detailProduct, setOptionSelection }) => {
  const [agendaPersonalized, setAgendaPersonalized] = useState(false);
  const [agendaVenue, setAgendaVenue] = useState(false);
  const [activities, setActivities] = useState([]);
  const [openModalConfirmDeletProduct, setOpenModalConfirmDeletProduct] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();

  // useEffect(() => {
  //   setSelectedActivities(detailProduct.product_agenda_personalized)
  // }, [])

  useEffect(() => {
    if (agendaPersonalized) {
      getCustomizedActivities().then(({ data }) => setActivities(data.data));
    } else if (agendaVenue) {
      getProductActivities().then(({ data }) =>
        setActivities(
          data.data.filter((activity) => activity.type_schedule === "product")
        )
      );
    }
  }, [agendaPersonalized, agendaVenue]);

  const editActivities = (values) => {
    // required values
    values.name = detailProduct.name;
    values.type = detailProduct.type;
    values.barcode = detailProduct.barcode;
    values.product_detail = detailProduct.product_details;

    values.channels = detailProduct.product_channels.map((channel) => {
      return { id: channel.id };
    });

    values.number_sessions = detailProduct?.number_sessions
      ? detailProduct?.number_sessions
      : values.number_sessions;

    values.agenda_personalized_activities =
      values.agenda_personalized_activities
        ? values.agenda_personalized_activities?.map((item) => {
          return {
            id: item.id,
            min_sessions: Number(values?.[`min_sessions_${item.id}`]),
          };
        })
        : detailProduct?.product_agenda_personalized?.map((item) => {
          return { id: item.activity_id };
        });

    values.agenda_product_activities = values.agenda_product_activities
      ? values.agenda_product_activities?.map((item) => {
        return { id: item.id };
      })
      : detailProduct?.product_agenda_product?.map((item) => {
        return { id: item.activity_id };
      });

    values.agenda_personalized =
      values.agenda_personalized_activities?.length > 0;

    values.agenda_product = values.agenda_product_activities?.length > 0;

    setLoadingFetch(true);
    putProduct(values, detailProduct.uuid)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          history.go(0);
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

  const deleteForm = (uuid) => {
    setOpenModalConfirmDeletProduct(true);
    // Swal.fire({
    //   title: t("Message.AreYouSure"),
    //   text: t("Message.DontRevertThis"),
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: t("Message.YesDeleteIt"),
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     deleteProduct(uuid)
    //       .then((req) => {
    //         Swal.fire(
    //           t("Message.Eliminated"),
    //           t("Message.EliminatedSuccess"),
    //           "success"
    //         );
    //         history.push("/config-products");
    //       })
    //       .catch((err) => {
    //         Swal.fire(t("Message.ErrorOcurred"), mapErrors(err), "error");
    //       });
    //   }
    // });
  };

  const handleSelectActivities = (data) => {
    setSelectedActivities(data);
  };

  return (
    <>
      <div className="row">
        <div className="col-4">


          <ShardComponentModal
            title={t('DetailProduct.DeleteProduct')}
            fullWidth={true}
            width={"xs"}
            handleClose={() => setOpenModalConfirmDeletProduct(false)}
            body={
              <ConfirmDeleteAlert textDetail={`
              Estás a punto de eliminar un producto, si lo eliminas será definitivo.
              <br>
              <br>
              Para eliminar escribe por favor el nombre del producto
             `} handleClose={() => setOpenModalConfirmDeletProduct(false)}
                label="Nombre del producto" />
            } isOpen={openModalConfirmDeletProduct} />



          <Card>
            <CardContent>
              <div className="d-flex justify-content-between mb-3">
                <Typography variant="body1" className="mb-3">
                  <strong>{t("DetailProduct.BasicInfo")}</strong>
                </Typography>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setOptionSelection(4)}
                >
                  <IconEditItem
                    color={theme.palette.black.main}
                    width={"25"}
                    height={"25"}
                  />
                </div>
              </div>

              <div className={`${classes.comercialBoxContainer} mb-4`}>
                <Typography variant="body3">
                  {detailProduct.product_details?.reference
                    ? detailProduct.product_details.at(-1).reference
                    : "Ref. BT01-01-0002"}
                </Typography>
              </div>
              <div className="row mb-5 m-0">
                <div className="col p-0 pe-1">
                  <div className={`${classes.defaultBoxCenteredContainer}`}>
                    <Typography variant="body3">
                      ID {detailProduct.id}
                    </Typography>
                  </div>
                </div>

                <div className="col p-0 ps-1">
                  <div className={`${classes.defaultBoxCenteredContainer}`}>
                    <Typography display="block" variant="body3">
                      {"UUID-0001"}
                    </Typography>
                  </div>
                </div>
              </div>

              <table className="mx-auto">
                <tbody>
                  <Tr>
                    <td>
                      <Typography
                        display="block"
                        component={"span"}
                        variant="caption"
                        className={classes.fontGray}
                      >
                        {t("FormAppointmentByMedical.InputType")}
                      </Typography>
                    </td>
                    <td>
                      <Typography display="block" variant="p">
                        {detailProduct.type}
                      </Typography>
                    </td>
                  </Tr>

                  <Tr>
                    <td>
                      <Typography
                        display="block"
                        component={"span"}
                        variant="caption"
                        className={classes.fontGray}
                      >
                        {t("DetailProduct.ReferenceExt")}
                      </Typography>
                    </td>
                    <td>
                      {detailProduct.product_details && detailProduct.product_details.length > 0 &&
                        <Typography display="block" variant="p" >
                          {
                            detailProduct.product_details?.at(-1)
                              .external_reference
                          }
                        </Typography>
                      }

                    </td>
                  </Tr>

                  <Tr>
                    <td>
                      <Typography
                        display="block"
                        component={"span"}
                        variant="caption"
                        className={classes.fontGray}
                      >
                        {t("DetailProduct.Channel")}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="p">
                        <ul style={{ paddingLeft: 20 }}>
                          {detailProduct.product_channels?.map((channel) => {
                            return <li>{channel.name}</li>;
                          })}
                        </ul>
                      </Typography>
                    </td>
                  </Tr>

                  <Tr>
                    <td>
                      <Typography
                        display="block"
                        component={"span"}
                        variant="caption"
                        className={classes.fontGray}
                      >
                        {t("DetailProduct.Frecuency")}
                      </Typography>
                    </td>
                    <td>
                      <Typography display="block" variant="p">
                        {`${detailProduct.frecuency_quantity} ${parsedFrecuency[detailProduct.frecuency_type]
                          }`}
                      </Typography>
                    </td>
                  </Tr>

                  <Tr>
                    <td>
                      <Typography
                        display="block"
                        component={"span"}
                        variant="caption"
                        className={classes.fontGray}
                      >
                        {t("Message.Virtual")}
                      </Typography>
                    </td>
                    <td>
                      <Typography display="block" variant="p">
                        {detailProduct.is_virtual ? "Sí" : "No"}
                      </Typography>
                    </td>
                  </Tr>

                  <Tr>
                    <td>
                      <Typography
                        display="block"
                        component={"span"}
                        variant="caption"
                        className={classes.fontGray}
                      >
                        {t("DetailProduct.Recurrent")}
                      </Typography>
                    </td>
                    <td>
                      <Typography display="block" variant="p">
                        {detailProduct.is_recurring ? "Sí" : "No"}
                      </Typography>
                    </td>
                  </Tr>

                  <Tr>
                    <td>
                      <Typography
                        display="block"
                        component={"span"}
                        variant="caption"
                        className={classes.fontGray}
                      >
                        {t("FormProduct.AgendaVenue")}
                      </Typography>
                    </td>
                    <td>
                      <Typography display="block" variant="p">
                        {detailProduct.agenda_venue ? "Sí" : "No"}
                      </Typography>
                    </td>
                  </Tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
          <div className="col my-3">
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  {t("DetailProduct.Schedule")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="d-flex justify-content-between align-items-center">
                <Typography
                  display="block"
                  component={"span"}
                  variant="caption"
                  className={classes.fontGray}
                >
                  {t("FormProduct.PersonalizedAgenda")}
                </Typography>

                <Typography>
                  {detailProduct.agenda_personalized ? "Sí" : "No"}
                </Typography>

                <IconButton onClick={() => setAgendaPersonalized(true)}>
                  <IconEditItem
                    color={theme.palette.black.main}
                    width={"25"}
                    height={"25"}
                  />
                </IconButton>
              </AccordionDetails>
              <AccordionDetails className="d-flex justify-content-between align-items-center">
                <Typography
                  display="block"
                  component={"span"}
                  variant="caption"
                  className={classes.fontGray}
                >
                  {t("FormProduct.ProductAgenda")}
                </Typography>
                <Typography>
                  {detailProduct.agenda_product ? "Sí" : "No"}
                </Typography>
                <IconButton onClick={() => setAgendaVenue(true)}>
                  <IconEditItem
                    color={theme.palette.black.main}
                    width={"25"}
                    height={"25"}
                  />
                </IconButton>
              </AccordionDetails>
            </Accordion>

            <div className="col-12 my-3">
              <Button
                fullWidth
                style={{
                  height: "50px",
                  background: theme.themeColorSoft,
                }}
                onClick={() => deleteForm(detailProduct.uuid)}
              >
                <IconDeleteItem
                  color={theme.palette.black.main}
                  width={"18"}
                  height={"18"}
                />
                {t("DetailProduct.DeleteProduct")}
              </Button>

            </div>

          </div>
        </div>
        <div className="col-8">
          <Card>
            <CardContent style={{ minHeight: "65vh" }}>
              <DetailDescription detailProduct={detailProduct} />
            </CardContent>
          </Card>
        </div>
      </div>
      {/*AGENDA PERZONALIZADA*/}
      <ShardComponentModal
        {...modalProps}
        isOpen={agendaPersonalized}
        handleClose={() => {
          setAgendaPersonalized(false);
        }}
        body={
          <form onSubmit={handleSubmit(editActivities)}>
            <Controller
              rules={{ required: true }}
              control={control}
              name="number_sessions"
              defaultValue={detailProduct?.number_sessions}
              render={({ field }) => (
                <TextField
                  fullWidth
                  className="mb-3"
                  {...field}
                  type="number"
                  label={t("FormProduct.NumberSessions")}
                  variant="outlined"
                />
              )}
            />
            <Controller
              rules={{ required: true }}
              control={control}
              name="min_sessions"
              defaultValue={detailProduct?.min_sessions}
              render={({ field }) => (
                <TextField
                  fullWidth
                  className="mb-3"
                  {...field}
                  type="number"
                  label={"Numero minimo de sesiones por 30 dias"}
                  variant="outlined"
                />
              )}
            />

            <ControlledAutocomplete
              control={control}
              name="agenda_personalized_activities"
              error={errors.agenda_personalized_activities}
              defaultValue={
                getValues("agenda_personalized_activities")
                  ? getValues("agenda_personalized_activities")
                  : detailProduct?.product_agenda_personalized?.map(
                    (agendaItem) => {
                      return activities?.find(
                        (activity) => activity.id === agendaItem.activity_id
                      );
                    }
                  )
              }
              options={activities || []}
              handleChange={handleSelectActivities}
              getOptionLabel={(option) => `${option && option?.name}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("ListActivities.Container")}
                  variant="outlined"
                  margin="normal"
                />
              )}
            />
            {selectedActivities.map((activity, idx) => (
              <div key={`field-activity-${idx}`} className="my-3">
                <Controller
                  control={control}
                  name={`min_sessions_${activity.id}`}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      type="number"
                      label={`Número de sesiones para ${activity.name}`}
                    />
                  )}
                />
              </div>
            ))}
            <div className="row m-0">
              <div className="col-6 ps-0">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  error={errors.frecuency_type}
                  name="frecuency_schedule_type"
                  defaultValue={detailProduct?.frecuency_schedule_type}
                  render={({ field }) => (
                    <FormControl variant="outlined" style={{ marginTop: 7 }}>
                      <InputLabel>{t("FormProduct.Frecuency")}</InputLabel>
                      <Select
                        {...field}
                        fullWidth
                        error={errors.frecuency_type}
                        variant="outlined"
                        label={t("FormProduct.Frecuency")}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      >
                        {frecuencyType.map((item) => (
                          <MenuItem key={`item-${item.id}`} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
              <div className="col-6 pe-0">
                <Controller
                  control={control}
                  defaultValue={detailProduct?.frecuency_schedule_quantity}
                  name="frecuency_schedule_quantity"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Valor de frecuencia"
                      variant="outlined"
                      type="number"
                      margin="normal"
                    />
                  )}
                />
              </div>
            </div>
            <Controller
              control={control}
              defaultValue={detailProduct?.rescheduling}
              name="rescheduling"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Número de reprogramaciones"
                  variant="outlined"
                  type="number"
                  margin="normal"
                />
              )}
            />

            <div className="mt-3 d-flex justify-content-end">
              <ButtonSave text={t("Btn.save")} loader={loadingFetch} />
            </div>
          </form>
        }
        title={t("FormProduct.PersonalizedAgenda")}
      />

      {/*AGENDA UNICA VEZ*/}
      <ShardComponentModal
        {...modalProps}
        isOpen={agendaVenue}
        handleClose={() => {
          setAgendaVenue(false);
        }}
        body={
          <form onSubmit={handleSubmit(editActivities)}>
            <ControlledAutocomplete
              control={control}
              name="agenda_product_activities"
              defaultValue={
                getValues("agenda_product_activities")
                  ? getValues("agenda_product_activities")
                  : detailProduct?.product_agenda_product?.map((agendaItem) => {
                    return activities?.find(
                      (activity) => activity.id === agendaItem.activity_id
                    );
                  })
              }
              options={activities || []}
              getOptionLabel={(option) => `${option?.name}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("ListActivities.Container")}
                  variant="outlined"
                  margin="normal"
                />
              )}
            />
            <div className="row m-0">
              <div className="col-6 ps-0">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  error={errors.frecuency_type}
                  name="frecuency_schedule_type"
                  defaultValue={detailProduct?.frecuency_schedule_type}
                  render={({ field }) => (
                    <FormControl variant="outlined" style={{ marginTop: 7 }}>
                      <InputLabel>{t("FormProduct.Frecuency")}</InputLabel>
                      <Select
                        {...field}
                        fullWidth
                        error={errors.frecuency_type}
                        variant="outlined"
                        label={t("FormProduct.Frecuency")}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      >
                        {frecuencyType.map((item) => (
                          <MenuItem key={`item-${item.id}`} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
              <div className="col-6 pe-0">
                <Controller
                  control={control}
                  name="frecuency_schedule_quantity"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Valor de frecuencia"
                      variant="outlined"
                      type="number"
                      margin="normal"
                    />
                  )}
                />
              </div>
            </div>
            <Controller
              control={control}
              defaultValue={detailProduct?.permitted_cancellations}
              name="permitted_cancellations"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Número de cancelaciones"
                  variant="outlined"
                  type="number"
                  margin="normal"
                />
              )}
            />
            <div className="mt-3 d-flex justify-content-end">
              <ButtonSave text={t("Btn.save")} loader={loadingFetch} />
            </div>
          </form>
        }
        title={t("FormProduct.ProductAgenda")}
      />
    </>
  );
};

export default DetailProduct;
