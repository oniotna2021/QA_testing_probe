import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

// UI
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// Components
import Loading from "components/Shared/Loading/Loading";
import { IconEditItem, IconDeleteItem } from "assets/icons/customize/config";

//Swal
import Swal from "sweetalert2";

// Service
import { getLocationById } from "services/Reservations/location";
import { deleteLocation } from "services/Reservations/location";

//Utils
import { errorToast, mapErrors } from "utils/misc";
import { FormLocation } from "components/Common/ModuleConfigReservations/Location/FormLocation";

const useStyles = makeStyles((theme) => ({
  boxMarginLeft: {
    marginLeft: 52,
  },
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
    marginRight: 10,
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

const DetailActivities = ({
  idDetail,
  setLoad,
  setExpanded,
  isEdit,
  setIsEdit,
  files,
  setFiles,
  permissionsActions,
}) => {
  const [dataDetail, setDataDetail] = useState({});
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  useEffect(() => {
    (() => {
      getLocationById(idDetail)
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
        deleteLocation(idDetail)
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

  const handleChangeIsEdit = () => {
    setIsEdit(true);
  };

  return (
    <div>
      {Object.keys(dataDetail).length === 0 ? (
        <Loading />
      ) : isEdit ? (
        <FormLocation
          files={files}
          setFiles={setFiles}
          dataItem={dataDetail}
          defaultValue={{
            name: dataDetail?.name,
            location_category_id: dataDetail?.location_category_id,
          }}
          isEdit={true}
          setExpanded={setExpanded}
          setLoad={setLoad}
        />
      ) : (
        <div className="row gx-4">
          <div className="col-10">
            <div className={`d-flex flex-row ${classes.boxMarginLeft}`}>
              <Typography className={classes.label} variant="body3">
                {t("ListLocation.DetailTypeLocation")}
              </Typography>
              <Typography variant="body2">
                {dataDetail?.location_category_name}
              </Typography>
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
        </div>
      )}
    </div>
  );
};

export default DetailActivities;
