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
import FormProffesional from "components/Common/ModuleProfessional/Manage/Proffesional/FormProffesional";
import VenuesScheduleByEmployee from "../../List/Proffesional/VenuesScheduleByEmployee";

// Service
import { getDetailEmployeeById } from "services/Reservations/employess";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Utils
import { errorToast, mapErrors } from "utils/misc";

const useStyles = makeStyles((theme) => ({
  boxMarginLeft: {
    marginLeft: 52,
  },
  backgroundDescription: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    padding: 10,
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
  boxSchedule: {
    backgroundColor: "#F3F3F3",
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

const DetailEmployee = ({
  idDetail,
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

  const [venuesSchedule, setVenuesSchedule] = useState([]);
  const [dataDetail, setDataDetail] = useState({});
  const [fetchDetail, setFetchDetail] = useState(false);

  useEffect(() => {
    (() => {
      setFetchDetail(true)
      getDetailEmployeeById(idDetail)
        .then(({ data }) => {
          setFetchDetail(false)
          if (data.status === "success" && data.data) {
            setDataDetail(data?.data);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    })();
  }, [idDetail, enqueueSnackbar]);

  // useEffect(() => {
  //     if(idVenue) {
  //         getScheduleVenueById(idVenue).then(({data}) => {
  //             if(data.status === 'success' && data.data) {
  //                 setScheduleData(setArrayWeeksDay(data?.data))
  //             }
  //         }).catch((err) => {
  //             enqueueSnackbar(mapErrors(err), errorToast);
  //         })
  //     }
  // }, [idVenue, enqueueSnackbar])

  const handleChangeIsEdit = () => {
    setIsEdit(true);
  };

  return (
    <>
      <div>
        {fetchDetail ? (
          <Loading />
        ) : isEdit ? (
          <FormProffesional
            idDetail={idDetail}
            files={files}
            setFiles={setFiles}
            defaultValue={dataDetail}
            isEdit={true}
            setExpanded={setExpanded}
            setLoad={setLoad}
            permissionsActions={permissionsActions}
          />
        ) : (
          <div className="row gx-4">
            <div className="col-10">
              <div className="row">
                <div className={`col-4 ${classes.backgroundDescription}`}>
                  <div>
                    <Typography className={classes.label} variant="body3">
                      {t("ListProfessional.Bithday")}
                    </Typography>
                    <Typography variant="body2">
                      {dataDetail?.birthdate ? dataDetail?.birthdate : "----"}
                    </Typography>
                  </div>

                  <div className="mt-4">
                    <Typography className={classes.label} variant="body3">
                      {t("ListProfessional.Gender")}
                    </Typography>
                    <Typography variant="body2">
                      {dataDetail?.genre ? dataDetail?.genre : "----"}
                    </Typography>
                  </div>

                  <div className="mt-4">
                    <Typography className={classes.label} variant="body3">
                      {t("FormProfessional.InputDocumentNumber")}
                    </Typography>
                    <Typography variant="body2">
                      {dataDetail?.document_number
                        ? dataDetail?.document_number
                        : "----"}
                    </Typography>
                  </div>
                </div>

                <div className="col-4">
                  <div>
                    <Typography className={classes.label} variant="body3">
                      {t("ListProfessional.Country")}
                    </Typography>
                    <Typography variant="body2">
                      {dataDetail?.country_name
                        ? dataDetail?.country_name
                        : "----"}
                    </Typography>
                  </div>

                  <div className="mt-4">
                    <Typography className={classes.label} variant="body3">
                      {t("FormZones.City")}
                    </Typography>
                    <Typography variant="body2">
                      {dataDetail?.city_name ? dataDetail?.city_name : "----"}
                    </Typography>
                  </div>

                  <div className="mt-4">
                    <Typography className={classes.label} variant="body3">
                      {t("ListProfessional.CellNumber")}
                    </Typography>
                    <Typography variant="body2">
                      {dataDetail?.phone_number
                        ? dataDetail?.phone_number
                        : "----"}
                    </Typography>
                  </div>
                </div>

                <div className="col-4">
                  <div>
                    <Typography className={classes.label} variant="body3">
                      {t("ListProfessional.Email")}
                    </Typography>
                    <Typography variant="body2">
                      {dataDetail?.email ? dataDetail?.email : "----"}
                    </Typography>
                  </div>

                  <div className="mt-4">
                    <Typography className={classes.label} variant="body3">
                      {t("ListProfessional.Contract")}
                    </Typography>
                    <Typography variant="body2">
                      {dataDetail?.type_contract_name
                        ? dataDetail?.type_contract_name
                        : "----"}
                    </Typography>
                  </div>

                  <div className="mt-4">
                    <Typography className={classes.label} variant="body3">
                      {t("LogIn.password")}
                    </Typography>
                    <Typography variant="body2">********</Typography>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <VenuesScheduleByEmployee
                  venues={venuesSchedule}
                  setVenues={setVenuesSchedule}
                  shouldAdd={false}
                  idUser={idDetail || ""}
                  isEdit={true}
                  selectedCity={1}
                  permissionsActions={permissionsActions}
                />
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

                {/* <IconButton className={classes.buttonIcon} variant="outlined" size="medium" onClick={deleteForm}>
                                <IconDeleteItem color="#3C3C3B" width="25" height="25" />
                            </IconButton> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DetailEmployee;
