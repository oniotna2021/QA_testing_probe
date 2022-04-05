import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

// UI
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

// Components
import Loading from "components/Shared/Loading/Loading";
import { IconEditItem } from "assets/icons/customize/config";

//Services
import { getSchedulesByLocationVenue } from "services/Reservations/locationHasVenue";

//Utils
import { errorToast, mapErrors, setArrayWeeksDay } from "utils/misc";
import FormLocation from "components/Common/ModuleLocationsVenue/FormLocation";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

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
  label: {
    fontWeight: "bold",
    marginLeft: 10,
    color: "rgba(60, 60, 59, 1)",
  },
  containerSchedule: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
  },
  boxSchedule: {
    minWidth: "500px",
    maxWidth: "600px",
    backgroundColor: "rgba(60, 60, 59, 0.1)",
    padding: "20px",
    borderRadius: "5px",
  },
  labelSchedule: {
    fontWeight: "bold",
    textAlign: "center",
  },
  alignSchedule: {
    textAlign: "center",
  },
}));

const DetailActivities = ({
  idDetail,
  data: dataDefault,
  setLoad,
  setExpanded,
  isEdit,
  setIsEdit,
  files,
  setFiles,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [dataSchedule, setDataSchedule] = useState([]);

  useEffect(() => {
    if (idDetail) {
      setLoading(true);
      getSchedulesByLocationVenue(idDetail)
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            setDataDetail(data.data);
            setDataSchedule(setArrayWeeksDay(data.data.schedules));
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data?.message), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    return () => {
      setIsEdit(false);
    };
  }, [enqueueSnackbar, setIsEdit, setDataDetail, idDetail]);

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
            location_category_id: dataDefault?.location_category_id,
          }}
          isEdit={true}
          setExpanded={setExpanded}
          setLoad={setLoad}
        />
      ) : (
        <div className="row gx-4">
          <div className="col-10">
            <div className="row">
              <div className="col-3 d-flex flex-column align-content-center justify-content-center">
                <div>
                  <Typography variant="body1">
                    {t("ListLocation.DetailTypeLocation")}
                  </Typography>
                  <Typography className="mt-2" variant="body2">
                    {dataDefault?.location_category_name}
                  </Typography>
                </div>

                <div className="mt-3">
                  <Typography variant="body1">
                    {t("ListLocation.Capacity")}
                  </Typography>
                  <Typography className="mt-2" variant="body2">
                    {dataDefault?.is_capacity === 1
                      ? dataDefault?.capacity
                      : "---"}
                  </Typography>
                </div>
              </div>

              <div className="col-9">
                <Typography variant="body2">
                  {t("ListLocation.Schedule")}
                </Typography>
                <div
                  className={`${classes.boxSchedule} d-flex justify-content-between mt-2`}
                >
                  {loading ? (
                    <Loading />
                  ) : (
                    <>
                      {dataSchedule &&
                        dataSchedule.map((schedule, index) => (
                          <div key={index} className="text-center">
                            <Typography
                              className={classes.labelSchedule}
                              variant="body2"
                            >
                              {schedule.name}
                            </Typography>
                            <Typography
                              className={classes.alignSchedule}
                              variant="body2"
                            >
                              {schedule.start_time}
                            </Typography>
                            <Typography
                              className={classes.alignSchedule}
                              variant="body2"
                            >
                              {schedule.end_time}
                            </Typography>
                          </div>
                        ))}
                      {dataSchedule.length === 0 && (
                        <Typography
                          className={classes.labelSchedule}
                          variant="body2"
                        >
                          Esta sede no cuenta con horario asignado
                        </Typography>
                      )}
                    </>
                  )}
                </div>
              </div>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailActivities;
