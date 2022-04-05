import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";

//UI
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Tooltip from "@material-ui/core/Tooltip";
import { useTheme } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";

//Components
import SuggestionByAfiliate from "components/Common/ManageDetailAfiliate/SuggestionByAfiliate";
import PhysicalByAfiliate from "components/Common/ManageDetailAfiliate/PhysicalByAfiliate";
import TrainingsPlansAfiliate from "components/Common/ManageDetailAfiliate/TrainingsPlansAfiliate";
import AppointmentsByAfiliate from "components/Common/ManageDetailAfiliate/AppointmentsByAfiliate";
import DetailNutritionalPlan from "components/Common/ModuleClinicalHistory/Nutrition/NutritionPlan/DetailNutritionalPlan";
import ActivitiesByAfiliate from "components/Common/ManageDetailAfiliate/ActivitiesByAfiliate";
import LogsAccessByAfiliate from "components/Common/ManageDetailAfiliate/LogsAccessByAfiliate";

//service
import { getAfiliateForId, getLogsIdUserActions } from "services/affiliates";

//UTILS
import { useStyles } from "utils/useStyles";
import { errorToast, mapErrors } from "utils/misc";

//ICONS
import {
  IconProfile,
  IconPlus,
} from "assets/icons/customize/config";

//HOOKS
import useSearchUserById from "hooks/useSearchUserById";
import LogsAppMobile from "components/Shared/LogsAppMobile/LogsAppMobile";

const DetailAfiliatePage = ({ userType }) => {
  const theme = useTheme();

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { id } = useParams();
  const [infoAfiliate, setInfoAfiliate] = useState({ profile: "" });
  const [fetchData, setFechData] = useState(false);
  const [logsAfiliate, setLogsAfiliate] = useState([]);
  const [titleOption, setTitleOption] = useState("Prescripción del ejercicio");
  const [optionSelection, setOptionSelection] = useState(
    userType === 3 ? 0 : 1
  );

  const [userInfo, loader] = useSearchUserById(id);

  useEffect(() => {
    setFechData(true);
    (async () => {
      await getAfiliateForId(id)
        .then(({ data }) => {
          setInfoAfiliate({ profile: data.data });
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });

      await getLogsIdUserActions(id)
        .then(({ data }) => {
          setFechData(false);
          if (data.data && data.data.items) {
            setLogsAfiliate(data.data.items);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    })();
  }, [id, enqueueSnackbar]);

  useEffect(() => {
    switch (optionSelection) {
      case 0:
        setTitleOption("Observaciones y Anexos");
        break;

      case 1:
        setTitleOption("Citas");
        break;

      case 2:
        setTitleOption("Analisis de composición corporal");
        break;

      case 3:
        setTitleOption("Programas de entrenamiento");
        break;
      case 4:
        setTitleOption("Plan de nutrición");
        break;

      default:
        break;
    }
  }, [optionSelection]);

  return (
    <div className="container m-4">
      <div className="row">
        <div className="col-4 d-flex align-items-center">
          <Avatar className="me-3"></Avatar>
          <div>
            <Typography variant="h6">
              {userInfo.first_name} {userInfo?.last_name}
            </Typography>
            <Typography variant="body1">{userInfo?.document_number}</Typography>
            <Typography style={{ fontWeight: "bold" }}>
              Entrenador asignado
            </Typography>
            <Typography variant="body1">
              {infoAfiliate.profile?.trainer?.trainer_name}
            </Typography>
          </div>
        </div>
        <div className="col-8 d-flex justify-content-around">
          {userType === 3 && (
            <Button
              className={
                optionSelection === 0
                  ? classes.miniBoxSelected
                  : classes.miniBox
              }
              onClick={() => setOptionSelection(0)}
            >
              <Typography
                display="block"
                component={"span"}
                variant="body2"
                color={theme.palette.black.main}
              >
                {t("DetailAfiliate.Observations")}
              </Typography>
            </Button>
          )}
          <Button
            className={
              optionSelection === 1 ? classes.miniBoxSelected : classes.miniBox
            }
            onClick={() => setOptionSelection(1)}
          >
            <Typography display="block" component={"span"} variant="body2">
              {t("DetailAfiliate.Quotes")}
            </Typography>
          </Button>
          <Button
            className={
              optionSelection === 2 ? classes.miniBoxSelected : classes.miniBox
            }
            onClick={() => setOptionSelection(2)}
          >
            <Typography display="block" component={"span"} variant="body2">
              {t("DetailAfiliate.PhysicalAssessment")}
            </Typography>
          </Button>
          <Button
            className={
              optionSelection === 3 ? classes.miniBoxSelected : classes.miniBox
            }
            onClick={() => setOptionSelection(3)}
          >
            <Typography display="block" component={"span"} variant="body2">
              {t("DetailAfiliate.TrainingPlan")}
            </Typography>
          </Button>
          <Button
            className={
              optionSelection === 4 ? classes.miniBoxSelected : classes.miniBox
            }
            onClick={() => setOptionSelection(4)}
          >
            <Typography display="block" component={"span"} variant="body2">
              {t("DetailAfiliate.Nutrition")}
            </Typography>
          </Button>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-4">
          <Card>
            <div className="d-flex align-items-center p-3">
              <div className="row">
                <div className="col-12 mb-4 d-flex justify-content-start align-items-center">
                  <IconProfile
                    width="25"
                    height="25"
                    color={theme.palette.black.main}
                  />
                  <Typography
                    className="ms-2"
                    style={{ fontWeight: "bold", fontSize: "18px" }}
                  >
                    {t("ID")}
                  </Typography>
                </div>
                {loader ? (
                  <>
                    <Skeleton animation="wave" variant="text" height={25} />
                    <Skeleton animation="wave" variant="text" height={25} />
                    <Skeleton animation="wave" variant="text" height={25} />
                    <Skeleton animation="wave" variant="text" height={25} />
                    <Skeleton animation="wave" variant="text" height={25} />
                    <Skeleton animation="wave" variant="text" height={25} />
                  </>
                ) : (
                  <>
                    <div className="col-6">
                      <React.Fragment>
                        <Typography>
                          {t("DetailAfiliate.LabelName")}{" "}
                        </Typography>
                        <Typography>
                          {t("DetailAfiliate.LabelLastName")}
                        </Typography>
                        <Typography>
                          {t("FormProfessional.InputDocumentNumber")}
                        </Typography>
                        <Typography>
                          {t("DetailAfiliate.LabelBirthday")}
                        </Typography>
                        <Typography>
                          {t("DetailClinicHistory.Phone")}
                        </Typography>

                        <Typography>
                          {t("DetailClinicHistory.Email")}
                        </Typography>
                      </React.Fragment>
                    </div>
                    <div className="col-6">
                      <Typography>{userInfo?.first_name}</Typography>
                      <Typography>{userInfo?.last_name}</Typography>
                      <Typography>{userInfo?.document_number}</Typography>
                      <Typography>{userInfo?.birthdate}</Typography>
                      <Typography>{userInfo?.mobile_phone}</Typography>
                      <Tooltip
                        title={userInfo?.email ? userInfo?.email : "-"}
                        placement="bottom"
                        arrow
                      >
                        <Typography noWrap>{userInfo?.email}</Typography>
                      </Tooltip>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>

          <div>
            <LogsAppMobile logsAfiliate={logsAfiliate} userId={id} />
          </div>

          <div>
            <LogsAccessByAfiliate idAfiliate={id} />
          </div>

          <div>
            <Accordion className="mt-3" style={{ borderRadius: "8px" }}>
              <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
                <div className="col-12 d-flex justify-content-start align-items-center">
                  <IconPlus
                    width="30"
                    height="35"
                    color={theme.palette.black.main}
                  />
                  <Typography
                    className="ms-2"
                    style={{ fontWeight: "bold", fontSize: "18px" }}
                  >
                    {t("DetailAfiliate.LabelMedicalRecommendations")}
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="col-12">
                  <SuggestionByAfiliate id={id} />
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
        <div className="col-8">
          <Card>
            <CardHeader title={titleOption}></CardHeader>
            <CardContent style={{ minHeight: "50vh" }}>
              {optionSelection === 0 && userType === 3 && (
                <ActivitiesByAfiliate id={id} />
              )}
              {optionSelection === 1 && (
                <AppointmentsByAfiliate id={id} userType={userType} />
              )}
              {optionSelection === 2 && <PhysicalByAfiliate id={id} />}
              {optionSelection === 3 && <TrainingsPlansAfiliate id={id} />}
              {optionSelection === 4 && <DetailNutritionalPlan id={id} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  userType: auth.userType,
});

export default connect(mapStateToProps)(DetailAfiliatePage);
