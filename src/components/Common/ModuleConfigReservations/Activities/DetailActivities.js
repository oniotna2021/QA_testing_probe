import { IconDeleteItem, IconEditItem } from "assets/icons/customize/config";
import React, { useEffect, useState } from "react";
// Service
import {
  deleteActivity,
  getActivitiesById,
} from "services/Reservations/activities";
//Utils
import { errorToast, mapErrors } from "utils/misc";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";
import Button from "@material-ui/core/Button";
import { FormActivity } from "./FormActivities";
import FormActivitys from "components/Common/ModuleConfigReservations/Venues/FormsVenue/FormsVenueActivities/FormActivity";
import IconButton from "@material-ui/core/IconButton";
// Components
import Loading from "components/Shared/Loading/Loading";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
//Swal
import Swal from "sweetalert2";
// UI
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  backgroundDescription: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  descriptionLabel: {
    marginLeft: 20,
    color: "rgba(60, 60, 59, 1)",
  },
  label: {
    color: "rgba(60, 60, 59, 1)",
  },
  pill: {
    backgroundColor: "#3C3C3B",
    padding: 5,
    color: "#ffffff",
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 4,
  },
  buttonIcon: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
  },
}));

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "xs",
};

const DetailActivities = ({
  idDetail,
  setLoad,
  setExpanded,
  isEdit,
  setIsEdit,
  files,
  setFiles,
  permissionsActions,
  userType,
  idVenue,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [dataDetail, setDataDetail] = useState({});

  // modal activities
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    (() => {
      getActivitiesById(idDetail)
        .then(({ data }) => {
          setDataDetail(data.data);
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    })();
  }, [idDetail, enqueueSnackbar]);

  const deleteForm = () => {
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
        deleteActivity(idDetail)
          .then((req) => {
            Swal.fire(
              t("Message.Eliminated"),
              t("Message.EliminatedSuccess"),
              "success"
            );
            setLoad(true);
          })
          .catch((err) => {
            Swal.fire(t("Message.ErrorOcurred"), mapErrors(err), "error");
          });
      }
    });
  };

  const handleCloseModal = () => {
    setOpenForm(false);
  };

  const handleChangeIsEdit = () => {
    setIsEdit(true);
  };

  return (
    <div>
      {Object.keys(dataDetail).length === 0 ? (
        <Loading />
      ) : isEdit ? (
        <FormActivity
          files={files}
          setFiles={setFiles}
          dataItem={dataDetail}
          defaultValue={{
            type_activity_id: dataDetail.type_activity_id,
            atributes: dataDetail.atributes.map((i) => i.id),
            check_age_restriction:
              dataDetail.check_age_restriction === 1 ? true : 0,
            type_schedule: dataDetail.type_schedule,
            is_appoiment: dataDetail.is_appoiment,
            colour: dataDetail?.colour,
            modality: dataDetail?.modality,
          }}
          isEdit={true}
          setExpanded={setExpanded}
          setLoad={setLoad}
        />
      ) : (
        <div className="row gx-4">
          <div className="col-4">
            <Typography className={classes.descriptionLabel} variant="body3">
              {t("WeeklyNutrition.InputDescription")}
            </Typography>
            <div className={classes.backgroundDescription}>
              <Typography variant="body2">{dataDetail.description}</Typography>
            </div>
          </div>

          <div className="col-3">
            <div className="column">
              <div className="row">
                <Typography className={classes.label} variant="body3">
                  {t("ListActivities.DetailTypeActivity")}
                </Typography>
                <Typography variant="body2">
                  {dataDetail.type_activity.name}
                </Typography>
              </div>

              <div className="row mt-2">
                <Typography className={classes.label} variant="body3">
                  {t("ListActivities.DetailDuration")}
                </Typography>
                <Typography variant="body2">
                  {dataDetail.duration} Min
                </Typography>
              </div>

              <div className="row mt-2">
                <Typography className={classes.label} variant="body3">
                  {t("ListActivities.DetailRangeAge")}
                </Typography>
                <Typography variant="body2">{`${
                  dataDetail.range_ini === null ? "" : dataDetail.range_ini
                } - ${
                  dataDetail.range_end === null ? "" : dataDetail.range_end
                }`}</Typography>
              </div>
            </div>
          </div>

          <div className="col-3">
            <Typography className={classes.label} variant="body3">
              {t("ListAttributes.Container")}
            </Typography>
            <div className="d-flex flex-wrap mt-2">
              {dataDetail.atributes.map((item, index) => (
                <div className={classes.pill} key={index}>
                  <Typography noWrap color="#ffffff" variant="body3">
                    {" "}
                    {item.name}
                  </Typography>
                </div>
              ))}
            </div>
          </div>

          <div className="col-2 d-flex justify-content-end">
            <div className="d-flex column align-content-center align-items-end">
              <ActionWithPermission isValid={permissionsActions.edit}>
                <IconButton
                  className={`${classes.buttonIcon} me-2`}
                  variant="outlined"
                  size="medium"
                  onClick={handleChangeIsEdit}
                >
                  <IconEditItem color="#3C3C3B" width="25" height="25" />
                </IconButton>
              </ActionWithPermission>

              <ActionWithPermission isValid={permissionsActions.delete}>
                <IconButton
                  className={classes.buttonIcon}
                  variant="outlined"
                  size="medium"
                  onClick={deleteForm}
                >
                  <IconDeleteItem color="#3C3C3B" width="25" height="25" />
                </IconButton>
              </ActionWithPermission>
            </div>
          </div>
          {/* Botón asignar masivo clase grupal */}
          <div className="d-flex justify-content-start">
            {userType === 17 || userType === 41 ? (
              <Button
                style={{ width: "171px", height: "48px" }}
                variant="outlined"
                onClick={() => setOpenForm(true)}
              >
                Horario
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      )}

      <ShardComponentModal
        {...modalProps}
        body={
          <FormActivitys
            dataItem={dataDetail}
            userType={userType}
            setOpenForm={setOpenForm}
            idVenue={idVenue}
            isEdit={true}
          />
        }
        isOpen={openForm}
        handleClose={handleCloseModal}
        title={"Editar Actividad"}
      />
    </div>
  );
};

export default DetailActivities;
