//REACT
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

//UTILS
import { useStyles } from "utils/useStyles";
import {
  errorToast,
  infoToast,
  mapErrors,
  addFormsPercentToLocalStorage,
} from "utils/misc";
import Swal from "sweetalert2";

//COMPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

//SERVICES
import {
  postBodytechRisk,
  getLastBodytechRisk,
} from "services/MedicalSoftware/Questions";

export const FormBodytechRisk = ({
  setIsOpen,
  user_id,
  resultCardiovascularRisk,
  pregnancy,
  surgery = "",
  quote_id,
  reload,
  setReload,
}) => {
  let result = {};
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastData, setLastData] = useState([]);
  const [resultRisk, setResultRisk] = useState("");

  useEffect(() => {
    setLoading(true);
    getLastBodytechRisk(user_id)
      .then(({ data }) => {
        if (data && data.status === "success") {
          setLastData(data.data.questions);
          setResultRisk(data.data.risk);
        }
        setLoading(false);
      })
      .catch(({ err }) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [user_id, enqueueSnackbar]);

  const onSubmit = (value) => {
    setLoadingFetch(true);
    let dataSubmit = {
      user_id: user_id,
      quote_id: quote_id,
      questions: [
        { survey_question_id: 27, answer: value.question_one },
        { survey_question_id: 28, answer: value.question_two },
        { survey_question_id: 29, answer: value.question_three },
        {
          survey_question_id: 30,
          answer: resultCardiovascularRisk ? resultCardiovascularRisk : "",
        },
        {
          survey_question_id: 31,
          answer:
            surgery === null
              ? "no"
              : surgery && surgery === 109937
              ? "si"
              : "no",
        },
        {
          survey_question_id: 32,
          answer:
            pregnancy === null
              ? "no"
              : pregnancy
              ? (pregnancy || "").toLowerCase()
              : "",
        },
      ],
    };

    postBodytechRisk(dataSubmit)
      .then(({ data }) => {
        if (data && data.status === "success") {
          Swal.fire({
            title: t("Message.SavedSuccess"),
            icon: "success",
          });
          setReload(!reload);
          result = { id: 22, result: data.data };
          addFormsPercentToLocalStorage(result);
          setIsOpen(false);
        } else {
          if (pregnancy === undefined) {
            Swal.fire({
              title: t("BodytechRisk.ValidateErrorForm"),
              icon: "warning",
            });
          } else {
            Swal.fire({
              title: t("BodytechRisk.ValidateError"),
              icon: "warning",
            });
          }
        }
        setLoadingFetch(false);
      })
      .catch((err) => {
        Swal.fire({
          title: mapErrors(err),
          icon: "error",
        });
        setLoadingFetch(false);
      });
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertCompleteQuestions"), infoToast);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Typography variant="h6">
          {t("DetailClinicHistory.BodytechRisk")}
        </Typography>
        <div style={{ marginRight: "12px" }}>
          <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <React.Fragment>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="row">
              <div className="d-flex justify-content-end pe-5">
                <div className="d-flex">
                  <Typography variant="body2" style={{ marginRight: 30 }}>
                    SI
                  </Typography>
                  <Typography variant="body2" style={{ marginRight: 5 }}>
                    NO
                  </Typography>
                </div>
              </div>
              <div className="col-9 mt-3">
                <Typography variant="body2">
                  {t("BodytechRisk.QuestionOne")}
                </Typography>
              </div>
              <div className="col-3 mt-3">
                <Controller
                  name="question_one"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[0] && lastData[0].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="si"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio color="primary" />}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {errors.question_one && (
                <div className="d-flex justify-content-end">
                  <FormHelperText
                    style={{
                      marginTop: -12,
                      marginBottom: 5,
                      marginRight: -20,
                    }}
                    error={true}
                  >
                    {t("Message.AlertSelectOption")}
                  </FormHelperText>{" "}
                </div>
              )}
              <div className="col-9 mt-3">
                <Typography variant="body2">
                  {t("BodytechRisk.QuestionTwo")}
                </Typography>
              </div>
              <div className="col-3 mt-3">
                <Controller
                  name="question_two"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[1] && lastData[1].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="si"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio color="primary" />}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {errors.question_two && (
                <div className="d-flex justify-content-end">
                  <FormHelperText
                    style={{
                      marginTop: -12,
                      marginBottom: 5,
                      marginRight: -20,
                    }}
                    error={true}
                  >
                    {t("Message.AlertSelectOption")}
                  </FormHelperText>{" "}
                </div>
              )}
              <div className="col-9 mt-3">
                <Typography variant="body2">
                  {t("BodytechRisk.QuestionThree")}
                </Typography>
              </div>
              <div className="col-3 mt-3">
                <Controller
                  name="question_three"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[2] && lastData[2].answer}
                  render={({ field }) => (
                    <>
                      <FormControl component="fieldset">
                        <RadioGroup {...field} row={true} name="Surgery">
                          <FormControlLabel
                            value="si"
                            control={<Radio color="primary" />}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio color="primary" />}
                          />
                        </RadioGroup>
                      </FormControl>
                    </>
                  )}
                />
              </div>
              {errors.question_three && (
                <div className="d-flex justify-content-end">
                  <FormHelperText
                    style={{
                      marginTop: -12,
                      marginBottom: 5,
                      marginRight: -20,
                    }}
                    error={true}
                  >
                    {t("Message.AlertSelectOption")}
                  </FormHelperText>{" "}
                </div>
              )}
              <div className="col-9 mt-3">
                <Typography variant="body2">
                  {t("BodytechRisk.QuestionFour")}
                </Typography>
              </div>
              <div className="col-3 mt-3">
                <div
                  className={classes.boxRisk}
                  style={{
                    background:
                      resultCardiovascularRisk === "ALTO"
                        ? "#DF3D19"
                        : resultCardiovascularRisk === "MEDIO"
                        ? "#E5BE01"
                        : "green",
                  }}
                >
                  {resultCardiovascularRisk !== ""
                    ? resultCardiovascularRisk
                    : ""}
                </div>
              </div>
              <div className="col-9 mt-3">
                <Typography variant="body2">
                  {t("BodytechRisk.QuestionFive")}
                </Typography>
              </div>
              <div className="col-3 mt-3">
                <div className={classes.boxNormal}>
                  {surgery && surgery === 109937 && surgery !== ""
                    ? "Si"
                    : "No"}
                </div>
              </div>
              <div className="col-9 mt-3">
                <Typography variant="body2">
                  {t("BodytechRisk.QuestionSix")}
                </Typography>
              </div>
              <div className="col-3 mt-3">
                <div className={classes.boxNormal}>
                  {pregnancy !== null ? pregnancy : "-"}
                </div>
              </div>
              <div className="row">
                <Typography variant="body2">{`Riesgo: ${resultRisk}`}</Typography>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <ButtonSave text="Guardar" loader={loadingFetch} />
              </div>
            </div>
          </form>
        </React.Fragment>
      )}
    </div>
  );
};
