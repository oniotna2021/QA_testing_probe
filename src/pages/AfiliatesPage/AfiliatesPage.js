import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useTheme } from "@material-ui/core/styles";

//Components
import ItemClient from "components/Shared/FormAppointment/ItemClient";
import FilterSelectionOption from "components/Shared/FilterSelectionOption/FilterSelectionOption";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import FormAfiliateLead from "components/Common/ManageDetailAfiliate/FormAfiliateLead";
import ButtonConsultDeporwinUser from "components/Shared/ButtonConsultDeporwinUser/ButtonConsultDeporwinUser";

//Services
import {
  getUsersWithoutForTrainer,
  getUsersForTrainerWaitingSinPlan,
  getUsersForTrainerWaitingNutritionPlan,
  getUsersForTrainerWithFilters,
  getCountUsersPlanParams,
} from "services/affiliates";
import { getUsersByMedicalPaginated } from "services/MedicalSoftware/MedicalProfesional";
import { searchAfiliatesService } from "services/affiliates";

//UI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { IconAddUser } from "assets/icons/customize/config";
import Pagination from "@material-ui/lab/Pagination";

// Hooks
import useCheckWithDeporwin from "hooks/useCheckWithDeporwin";
import usePagination from "hooks/usePagination";

//UTILS
import { errorToast, mapErrors } from "utils/misc";
import { useStyles } from "utils/useStyles";
import ItemUserPriorization from "components/Shared/ItemUserPriorization/ItemUserPriorization";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const AfiliatesPage = ({
  venueIdDefaultProfile,
  venueNameDefaultProfile,
  userId,
  userType,
  userNameRole,
  listTypeDocuments,
  userProfileId,
  brandId,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [loader, setLoader] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const [isAllAfiliates, setIsAllAfiliates] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [documentUser, setDocumentUser] = useState("");
  const [typeDocument, setTypeDocument] = useState(
    listTypeDocuments ? listTypeDocuments[0]?.id : 0
  );
  const [filterParams, setFilterParams] = useState("");
  const [selectedFilterTrainer, setSelectedFilterTrainer] = useState(0);
  const [dataCountUsersWithPlan, setDataCountUsersWithPlan] = useState({});

  const itemsPerPage = 15;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  // check user with deporwin
  const {
    errorUserNotFound,
    setErrorUserNotFound,
    errorUser,
    loadingFetchingUserDW,
    handleAuthDW,
    setErrorUser,
  } = useCheckWithDeporwin(brandId);

  /**DATA FILTER */
  const [valueFilter, setValueFilter] = useState(3);

  const optionsSelections =
    userType === 6 || userType === 14
      ? [
          {
            id: 1,
            name: "Pendientes por entrenador",
          },
          {
            id: 3,
            name: "Todos mis afiliados",
          },
        ]
      : userNameRole === "Nutricionista" || userProfileId === 2
      ? [
          {
            id: 3,
            name: "Todos mis afiliados",
          },
          {
            id: 4,
            name: "Pendientes por plan de nutrición",
          },
        ]
      : [
          {
            id: 2,
            name: "Pendientes por programa de entrenamiento",
          },
          {
            id: 3,
            name: "Todos mis afiliados",
          },
        ];

  useEffect(() => {
    setLoader(true);
    getCountUsersPlanParams(userId).then(({ data }) => {
      if (data && data.status === "success") {
        setDataCountUsersWithPlan(data.data);
      }
    });
    switch (valueFilter) {
      case 1:
        setIsAllAfiliates(false);
        getUsersWithoutForTrainer(venueIdDefaultProfile)
          .then(({ data }) => {
            setLoader(false);
            if (
              data.status === "success" &&
              data.data &&
              data.data.length > 0
            ) {
              setData(data.data);
            }
          })
          .catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
          });
        break;

      case 2:
        setIsAllAfiliates(false);
        getUsersForTrainerWaitingSinPlan(userId)
          .then(({ data }) => {
            setLoader(false);
            if (
              data.status === "success" &&
              data.data &&
              data.data.items &&
              data.data.items.length > 0
            ) {
              setData(data.data.items);
            }
          })
          .catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
          });
        break;

      case 3:
        setIsAllAfiliates(true);
        if (userType === 3) {
          getUsersByMedicalPaginated(userId, currentPage, itemsPerPage)
            .then(({ data }) => {
              setLoader(false);
              if (
                data.status === "success" &&
                data.data &&
                data.data.items.length > 0
              ) {
                setData(data.data.items);
                setPages(data.data.total_items);
              }
            })
            .catch((err) => {
              enqueueSnackbar(mapErrors(err), errorToast);
            });
        } else {
          setData([]);
          getUsersForTrainerWithFilters(userId, filterParams)
            .then(({ data }) => {
              setLoader(false);
              if (data.status === "success" && data.data) {
                setData(data.data);
              }
            })
            .catch((err) => {
              enqueueSnackbar(mapErrors(err), errorToast);
            });
        }
        break;
      case 4:
        getUsersForTrainerWaitingNutritionPlan(userId)
          .then(({ data }) => {
            setLoader(false);
            if (
              data.status === "success" &&
              data.data &&
              data.data.items &&
              data.data.items.length > 0
            ) {
              setData(data.data.items);
            } else {
              setData([]);
            }
          })
          .catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
          });
        break;
      default:
        break;
    }
  }, [
    valueFilter,
    reload,
    enqueueSnackbar,
    userId,
    userType,
    venueIdDefaultProfile,
    filterParams,
  ]);

  //GET USER DATA
  const setFilterValue = (value) => {
    if (value.length === 0) {
      setDocumentUser("");
      setErrorUser("");
      setErrorUserNotFound(false);
      setData([]);
      return;
    }

    setData([]);
    setDocumentUser(value);

    searchAfiliatesService(value)
      .then(({ data }) => {
        if (data && data.data) {
          if (data?.data?.length > 0) {
            setErrorUser("");
            setErrorUserNotFound(false);
            setData(data.data);
            return;
          }
          setErrorUserNotFound(true);
          setErrorUser("Usuario no encontrado");
        }
      })
      .catch((err) => {
        setErrorUserNotFound(true);
        setErrorUser("Usuario no encontrado");
        //enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  const handleClickCheckDeporwin = () => {
    const callBack = (data) => {
      setData([data]);
      setErrorUserNotFound(false);
    };
    handleAuthDW(documentUser, typeDocument, callBack);
  };

  const handleClickModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="row">
          <div className="col">
            <Typography variant="h4">{t("Affiliates.Title")}</Typography>
            <Typography variant="body1">
              {t("Venue.Label")} {venueNameDefaultProfile}
            </Typography>
          </div>
          {userType === 5 && valueFilter === 3 && (
            <div className="d-flex mt-3">
              <IconButton
                onClick={() => {
                  setFilterParams("has_active_training_plan=1");
                  setSelectedFilterTrainer(1);
                }}
                style={{
                  background:
                    selectedFilterTrainer === 1
                      ? theme.palette.secondary.light
                      : "#F3F3F3",
                  borderRadius: 10,
                  padding: 10,
                  width: 100,
                  marginRight: 20,
                }}
              >
                <Typography style={{ fontWeight: "bold", fontSize: 12 }}>
                  {t("Affiliates.WithPlan")}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "bold",
                    fontSize: 12,
                    marginLeft: 10,
                  }}
                >
                  {dataCountUsersWithPlan?.with_plan}
                </Typography>
              </IconButton>
              <IconButton
                onClick={() => {
                  setFilterParams("has_active_training_plan=0");
                  setSelectedFilterTrainer(2);
                }}
                style={{
                  background:
                    selectedFilterTrainer === 2
                      ? theme.palette.secondary.light
                      : "#F3F3F3",
                  borderRadius: 10,
                  padding: 10,
                  width: 100,
                  marginRight: 20,
                }}
              >
                <Typography style={{ fontWeight: "bold", fontSize: 12 }}>
                  {t("Affiliates.WithoutPlan")}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "bold",
                    fontSize: 12,
                    marginLeft: 10,
                  }}
                >
                  {dataCountUsersWithPlan?.without_plan}
                </Typography>
              </IconButton>
              <IconButton
                onClick={() => {
                  setFilterParams(
                    "has_active_training_plan=0&had_training_plan=1"
                  );
                  setSelectedFilterTrainer(3);
                }}
                style={{
                  background:
                    selectedFilterTrainer === 3
                      ? theme.palette.secondary.light
                      : "#F3F3F3",
                  borderRadius: 10,
                  padding: 10,
                  width: 100,
                }}
              >
                <Typography style={{ fontWeight: "bold", fontSize: 10 }}>
                  {t("Afiliates.WithoutPlanVig")}
                </Typography>
              </IconButton>
            </div>
          )}
        </div>

        <div className="row mt-4">
          <div className="col">
            {isAllAfiliates && (
              <Button
                style={{ backgroundColor: theme.palette.secondary.light }}
                onClick={handleClickModal}
                className={classes.buttonUserLead}
                startIcon={<IconAddUser />}
              >
                {t("FormAfiliateLead.labelNewUser")}
              </Button>
            )}
          </div>

          <div className="col d-flex justify-content-end">
            <div className="me-3">
              <FilterSelectionOption
                style={{ width: 200 }}
                value={valueFilter}
                handleChange={(e) => {
                  setValueFilter(e.target.value);
                  setErrorUserNotFound(false);
                }}
                options={optionsSelections}
              />
            </div>

            {errorUserNotFound && (
              <FormControl
                variant="outlined"
                className="me-2"
                style={{ width: 100 }}
              >
                <InputLabel id="select_type_document">
                  {t("FormAppointmentByMedical.InputType")}
                </InputLabel>
                <Select
                  labelId="select_type_document"
                  label={t("FormAppointmentByMedical.InputType")}
                  defaultValue={10}
                  onChange={(e) => {
                    setTypeDocument(e.target.value);
                  }}
                  value={typeDocument}
                >
                  {listTypeDocuments &&
                    listTypeDocuments.map((res) => (
                      <MenuItem key={res.id} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}

            {valueFilter === 3 && (
              <div className="me-3">
                <TextField
                  label="N. de documento"
                  variant="outlined"
                  style={{ width: 160 }}
                  onChange={(e) => {
                    setFilterValue(e.target.value);
                  }}
                />
                {errorUser !== "" && (
                  <FormHelperText error>{errorUser}</FormHelperText>
                )}
              </div>
            )}

            {valueFilter === 3 && (
              <div>
                <ButtonConsultDeporwinUser
                  styles={{ height: 58 }}
                  errorUserNotFound={errorUserNotFound}
                  handleClick={handleClickCheckDeporwin}
                  loading={loadingFetchingUserDW}
                  bgColor={theme.palette.secondary.light}
                />
              </div>
            )}
          </div>
        </div>
        <>
          {userType === 5 && valueFilter === 3 ? (
            <div className="col-12 mt-4">
              <ItemUserPriorization data={data} loader={loader} />
            </div>
          ) : (
            <div className="col-12 mt-4">
              <ItemClient
                valueFilter={valueFilter}
                data={data}
                loader={loader}
                expanded={expanded}
                setExpanded={setExpanded}
                reload={reload}
                setReload={setReload}
                userId={userId}
                venueId={venueIdDefaultProfile}
              />
            </div>
          )}
        </>
      </div>
      <ShardComponentModal
        {...modalProps}
        fullWidth
        maxWidth="sm"
        body={<FormAfiliateLead setIsOpen={setIsOpen} />}
        isOpen={isOpen}
        handleClose={handleCloseModal}
        title={t("AffiliatesLead.CreateUser")}
      />
      <div className="d-flex justify-content-end mt-3">
        <Pagination
          count={pages}
          page={currentPage}
          onChange={handleChangePage}
          size="large"
        />
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth, global }) => ({
  venueIdDefaultProfile: auth.venueIdDefaultProfile,
  venueNameDefaultProfile: auth.venueNameDefaultProfile,
  userId: auth.userId,
  userType: auth.userType,
  userNameRole: auth.userNameRole,
  listTypeDocuments: global.typesDocuments,
  userProfileId: auth.userProfileId,
  brandId: auth.brandId,
});

export default connect(mapStateToProps)(AfiliatesPage);
