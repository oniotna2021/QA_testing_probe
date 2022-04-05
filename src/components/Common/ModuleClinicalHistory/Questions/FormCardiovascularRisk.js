//REACT
import React, { useState, useEffect } from "react";
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
import {
  successToast,
  errorToast,
  mapErrors,
  addFormsPercentToLocalStorage,
  infoToast,
} from "utils/misc";
import Swal from "sweetalert2";

//COMPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

//SERVICES
import {
  postCardiovascularRisk,
  getLastCardiovascularRisk,
} from "services/MedicalSoftware/Questions";

export const FormCardiovascularRisk = ({
  setIsOpen,
  user_id,
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

  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastData, setLastData] = useState([]);
  const [resultRisk, setResultRisk] = useState("");

  useEffect(() => {
    setLoading(true);
    getLastCardiovascularRisk(user_id).then(({ data }) => {
      if (data && data.status === "success" && data.data) {
        setLastData(data.data.questions);
        setResultRisk(data.data.risk);
      } else {
        if (data.status === "error") {
          enqueueSnackbar(mapErrors(data.data?.message), errorToast);
        }
      }
      setLoading(false);
    });
  }, [user_id, enqueueSnackbar]);

  const onSubmit = (value) => {
    setLoadingFetch(true);
    let dataSubmit = {
      users_id: user_id,
      quotes_id: quote_id,
      questions: [
        { id: 17, answer: value.question_one },
        { id: 18, answer: value.question_two },
        { id: 19, answer: value.question_three },
        { id: 20, answer: value.question_four },
        { id: 21, answer: value.question_five },
        { id: 22, answer: value.question_six },
        { id: 23, answer: value.question_seven },
        { id: 24, answer: value.question_eight },
        { id: 25, answer: value.question_nine },
        { id: 26, answer: value.question_ten },
        { id: 33, answer: value.question_eleven },
        { id: 34, answer: value.question_twelve },
      ],
    };
    postCardiovascularRisk(dataSubmit)
      .then(({ data }) => {
        if (data && data.status === "success") {
          Swal.fire({
            title: t("Message.SavedSuccess"),
            icon: "success",
          });
          result = { id: 19, result: data.data };
          addFormsPercentToLocalStorage(result);
          setIsOpen(false);
          setReload(!reload);
        } else {
          Swal.fire({
            title: mapErrors(data),
            icon: "error",
          });
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
          {t("DetailClinicHistory.CardiovascularRisk")}
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
              <div className="col-9">
                <Typography variant="body2">
                  {t("CardiovascularRisk.QuestionOne")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_one"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[0] && lastData[0].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="SI"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="NO"
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
              <div className="col-9">
                <Typography variant="body2">
                  {t("CardiovascularRisk.QuestionTwo")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_two"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[1] && lastData[1].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="SI"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="NO"
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
              <div className="col-9">
                <Typography variant="body2">
                  {t("CardiovascularRisk.QuestionThree")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_three"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[2] && lastData[2].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="SI"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="NO"
                          control={<Radio color="primary" />}
                        />
                      </RadioGroup>
                    </FormControl>
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
              <div className="col-9">
                <Typography variant="body2">
                  {t("CardiovascularRisk.QuestionFour")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_four"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[3] && lastData[3].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="SI"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="NO"
                          control={<Radio color="primary" />}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {errors.question_four && (
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
              <div className="col-9">
                <Typography variant="body2">
                  {t("CardiovascularRisk.QuestionFive")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_five"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[4] && lastData[4].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="SI"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="NO"
                          control={<Radio color="primary" />}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {errors.question_five && (
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
              <div className="col-9">
                <Typography variant="body2">
                  {t("MedicalSuggestions.TitleAge")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_six"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[5] && lastData[5].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="SI"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="NO"
                          control={<Radio color="primary" />}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {errors.question_six && (
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
              <div className="col-9">
                <Typography variant="body2">
                  {t("CardiovascularRisk.QuestionSeven")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_seven"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[6] && lastData[6].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="SI"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="NO"
                          control={<Radio color="primary" />}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {errors.question_seven && (
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
              <div className="col-9">
                <Typography variant="body2">
                  {t("CardiovascularRisk.QuestionEight")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_eight"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[7] && lastData[7].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="SI"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="NO"
                          control={<Radio color="primary" />}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {errors.question_eight && (
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
              <div className="col-9">
                <Typography variant="body2">
                  {t("CardiovascularRisk.QuestionNine")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_nine"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[8] && lastData[8].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="SI"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="NO"
                          control={<Radio color="primary" />}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {errors.question_nine && (
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
              <div className="col-9">
                <Typography variant="body2">
                  {t("CardiovascularRisk.QuestionTen")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_ten"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[9] && lastData[9].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="SI"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="NO"
                          control={<Radio color="primary" />}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {errors.question_ten && (
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
              <div className="col-9">
                <Typography variant="body2">
                  {t("CardiovascularRisk.QuestionEleven")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_eleven"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[10] && lastData[10].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="SI"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="NO"
                          control={<Radio color="primary" />}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {errors.question_eleven && (
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
              <div className="col-9">
                <Typography variant="body2">
                  {t("CardiovascularRisk.QuestionTwelve")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_twelve"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[11] && lastData[11].answer}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup {...field} row={true} name="Surgery">
                        <FormControlLabel
                          value="SI"
                          control={<Radio color="primary" />}
                        />
                        <FormControlLabel
                          value="NO"
                          control={<Radio color="primary" />}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {errors.question_twelve && (
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
