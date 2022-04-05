import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";

// redux
import { useDispatch } from "react-redux";
import { updateWelcomeForm } from "modules/virtualJourney";

// hooks
import { useGetSelectsClinicalHistory } from "hooks/useGetSelectsClinicalHistory";
import useSearchUserById from "hooks/useSearchUserById";

// UI
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { useTheme } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";

// components
import IdentificationCard from "./Cards/IdentificationCard";
import Notes from "./Options/Notes";
import Valuation from "./Options/Valuation/Valuation";
import Plan from "./Options/Plan";
import Schedule from "./Options/Schedule/Schedule";
import LogsAppMobile from "components/Shared/LogsAppMobile/LogsAppMobile";
import PlansInfoCard from "components/Shared/PlansInfoCard/PlansInfoCard";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import SuggestionByAfiliate from "../ManageDetailAfiliate/SuggestionByAfiliate";
import PhysicalValuation from "components/Shared/PhysicalValuation/PhysicalValuation";
import FormQuote from "../ModuleCalendarJourney/Calendar/FormQuote";
import { ShardComponentModal } from "components/Shared/Modal/Modal";

// utils
import { useStyles } from "utils/useStyles";

// services
import { getPlansByUser } from "services/VirtualJourney/Afiliates";
import { postWelcomeForm } from "services/VirtualJourney/WelcomeForm";
import { finishQuote } from "services/VirtualJourney/Quotes";
import { getQuoteById } from "services/MedicalSoftware/Quotes";
import { postLastWelcomeFormFromClient } from "services/VirtualJourney/Afiliates";

// utils
import { mapErrors, errorToast } from "utils/misc";

// icons
import {
  IconEditPencil,
  IconPhoneCall,
  IconPlan,
  IconPlus,
  IconValuation,
} from "assets/icons/customize/config";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// translate
import { useTranslation } from "react-i18next";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "xs",
  style: {
    padding: "20px 15px",
  },
};

const DetailAfiliatePage = ({ userType }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const [optionSelection, setOptionSelection] = useState(0);
  const [finishQuoteLoader, setFinishQuoteLoader] = useState(false);
  const [afiliatePlans, setAfiliatePlans] = useState([]);
  const [openModalResponse, setOpenModalResponse] = useState(false);
  const [isOpenCreateQuote, setIsOpenCreateQuote] = useState(false);
  const [messageResponseFinishQuote, setMessageResponseFinishQuote] = useState(
    {}
  );
  // eslint-disable-next-line
  const [dataSelects] = useGetSelectsClinicalHistory();

  const dispatch = useDispatch();

  const { user_id, quote_id, quote_type } = useParams();
  const isControl = Number(quote_type) === 7 || Number(quote_type) === 10;
  const isFrom360 = Number(quote_type) === 0;
  const isTrainner = userType === 29 || userType === 30;

  const [reloadUserInfo, setReloadUserInfo] = useState({});
  const [userInfo, loader] = useSearchUserById(user_id);
  // quote type coach 1 - nutricion 2
  const isQuoteCoach = quote_type === 6 || quote_type === 7 || quote_type === 8;

  // loader plans user
  const [loadingPlans, setLoadingPlans] = useState(false);

  useEffect(() => {
    if (!isFrom360) {
      postLastWelcomeFormFromClient({
        user_id: user_id,
        quote_id: quote_id,
        form_type: isQuoteCoach ? 1 : 2,
      })
        .then(({ data }) => {
          if (data.status === "success") {
            dispatch(updateWelcomeForm(data.data));
          } else {
            if (userInfo) {
              const payload = {
                form: 2,
                form_type: isQuoteCoach ? 1 : 2,
                quote_id: quote_id,
                user_id: user_id,
                first_name: userInfo.first_name,
                last_name: userInfo.last_name,
                email: userInfo.email,
                date_birth: userInfo.birthdate,
              };
              postWelcomeForm(payload).then(({ data }) =>
                dispatch(updateWelcomeForm(data.data))
              );
            }
          }
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line
  }, [userInfo]);

  useEffect(() => {
    setLoadingPlans(true);
    getPlansByUser(user_id)
      .then(({ data }) => {
        if (data && data.data && data.status === "success") {
          setAfiliatePlans(data.data);
        } else {
          setAfiliatePlans([]);
        }
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        setLoadingPlans(false);
      });
  }, [user_id]);

  const postFinishQuote = () => {
    setFinishQuoteLoader(true);
    getQuoteById(quote_id)
      .then(({ data }) => {
        if (data && data?.status && data?.status === "success" && data.data) {
          const payload = {
            quote_id: quote_id,
            medical_professional_id: data.data.employee_id,
            user_id: user_id,
            type_appointment: quote_type,
          };
          finishQuote(payload)
            .then(({ data }) => {
              if (
                data &&
                data.status &&
                data?.status === "success" &&
                data.data &&
                data.data.reschedule &&
                data.data.reschedule !== 1
              ) {
                setMessageResponseFinishQuote({
                  message: data.message,
                  reschedule: 0,
                });
                setOpenModalResponse(true);

                //enqueueSnackbar("Cita finalizada correctamente", successToast);
                setTimeout(() => {
                  history.push("/virtual-afiliates");
                }, 1000);
                window.localStorage.removeItem(`form_1_${user_id}_${quote_id}`);
                window.localStorage.removeItem(`form_2_${user_id}_${quote_id}`);
                window.localStorage.removeItem(`form_3_${user_id}_${quote_id}`);
                window.localStorage.removeItem(`form_4_${user_id}_${quote_id}`);
                window.localStorage.removeItem(`form_5_${user_id}_${quote_id}`);
                window.localStorage.removeItem(`form_6_${user_id}_${quote_id}`);
                window.localStorage.removeItem(`form_8_${user_id}_${quote_id}`);
                window.localStorage.removeItem(`form_9_${user_id}_${quote_id}`);
                window.localStorage.removeItem(
                  `form_11_${user_id}_${quote_id}`
                );
                window.localStorage.removeItem(
                  `form_10_${user_id}_${quote_id}`
                );
              } else {
                setMessageResponseFinishQuote({
                  message: mapErrors(data),
                  reschedule: data.data.reschedule,
                });
                setOpenModalResponse(true);
              }
            })
            .catch((err) => enqueueSnackbar(mapErrors(err), errorToast));
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
        setFinishQuoteLoader(false);
      });
  };

  useEffect(() => {
    return () => {
      dispatch(updateWelcomeForm({}));
    };
  }, []);

  return (
    <div className="container m-4">
      <div className="row">
        <div className="col-4 d-flex align-items-center">
          <Avatar className="me-3"></Avatar>
          <div>
            <Typography variant="h6">
              {userInfo?.first_name} {userInfo?.last_name}
            </Typography>
            <Typography variant="body1">{userInfo?.document_number}</Typography>
          </div>
        </div>
        <div className="col-8 d-flex justify-content-around">
          <Button
            className={
              optionSelection === 0 ? classes.miniBoxSelected : classes.miniBox
            }
            onClick={() => setOptionSelection(0)}
          >
            <IconEditPencil color="black" />
            <Typography
              display="block"
              component={"span"}
              variant="body2"
              color={theme.palette.black.main}
              className="ms-3"
            >
              {t("VirtualAfiliateDetail.VirtualJourneyNotes")}
            </Typography>
          </Button>

          {!isFrom360 && !isControl && (
            <Button
              className={
                optionSelection === 1
                  ? classes.miniBoxSelected
                  : classes.miniBox
              }
              onClick={() => setOptionSelection(1)}
            >
              <IconValuation color="black" />
              <Typography
                display="block"
                component={"span"}
                variant="body2"
                className="ms-3"
              >
                {t("VirtualAfiliateDetail.VirtualJourneyValoration")}
              </Typography>
            </Button>
          )}

          <Button
            className={
              optionSelection === 2 ? classes.miniBoxSelected : classes.miniBox
            }
            onClick={() => setOptionSelection(2)}
          >
            <IconPlan color="black" />
            <Typography
              display="block"
              component={"span"}
              variant="body2"
              className="ms-3"
            >
              {t("VirtualAfiliateDetail.VirtualJourneyPlan")}
            </Typography>
          </Button>
          <Button
            className={
              optionSelection === 3 ? classes.miniBoxSelected : classes.miniBox
            }
            onClick={() => setOptionSelection(3)}
          >
            <IconPhoneCall color="black" />
            <Typography
              display="block"
              component={"span"}
              variant="body2"
              className="ms-3"
            >
              {t("DetailProduct.Schedule")}
            </Typography>
          </Button>
          {!isFrom360 && (
            <ButtonSave
              text="Finalizar cita"
              onClick={postFinishQuote}
              loader={finishQuoteLoader}
            />
          )}
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-4">
          <IdentificationCard
            userInfo={userInfo}
            isLoading={loader}
            setReloadUserInfo={setReloadUserInfo}
            reloadUserInfo={reloadUserInfo}
          />
          <PlansInfoCard afiliatePlans={afiliatePlans} loadingPlans={loadingPlans} />
          <div>
            {isTrainner ? (
              <PhysicalValuation />
            ) : (
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
                      {t("VirtualAfiliateDetail.tittle")}
                    </Typography>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="col-12">
                    <SuggestionByAfiliate id={460547} />
                  </div>
                </AccordionDetails>
              </Accordion>
            )}
          </div>
          <LogsAppMobile />
        </div>

        <div className="col-8">
          <Card>
            <CardContent style={{ minHeight: "50vh", padding: 30 }}>
              {optionSelection === 0 && <Notes isFrom360={isFrom360} />}
              {optionSelection === 1 && <Valuation />}
              {optionSelection === 2 && <Plan />}
              {optionSelection === 3 && (
                <Schedule
                  setOptionSelection={setOptionSelection}
                  isFrom360={isFrom360}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <ShardComponentModal
        isOpen={openModalResponse}
        viewButtonClose
        handleClose={() => setOpenModalResponse(false)}
        title="Error al finalizar la cita"
        body={
          <div className="p-3">
            <p>{messageResponseFinishQuote.message}</p>
            <div className="row m-0">
              <div className="col-12">
                {messageResponseFinishQuote.reschedule &&
                  messageResponseFinishQuote.reschedule === 1 ? (
                  <Button
                    onClick={() => {
                      setIsOpenCreateQuote((prev) => (prev = true));
                    }}
                    fullWidth
                    className={classes.buttonBlock}
                    style={{
                      fontWeight: "700",
                      backgroundColor: "#4DA09C",
                      color: "#ffffff",
                      borderRadius: 10,
                      height: 43,
                    }}
                    disabled={false}
                  >
                    {t("FormDetailQuote.RescheduleAppoinment")}
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        }
      />
      <ShardComponentModal
        fullWidth
        {...modalProps}
        body={
          <FormQuote
            handleClose={() => {
              setIsOpenCreateQuote(false);
            }}
            setIsOpen={setIsOpenCreateQuote}
            defaultDate={""}
          />
        }
        isOpen={isOpenCreateQuote}
      />
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  userType: auth.userType,
});

export default connect(mapStateToProps)(DetailAfiliatePage);
