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
import Switch from "@material-ui/core/Switch";
import FormHelperText from "@material-ui/core/FormHelperText";

//UTILS
import {
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
  postIndexDownton,
  getLastIndexDownton,
} from "services/MedicalSoftware/Questions";

export const FormIndexDownTon = ({
  setIsOpen,
  user_id,
  reload,
  setReload,
  quote_id,
}) => {
  let result = {};
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();

  const [firstPart, setFirstPart] = useState(false);
  const [secondPart, setSecondPart] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastData, setLastData] = useState([]);
  const [resultRisk, setResultRisk] = useState("");

  useEffect(() => {
    setLoading(true);
    getLastIndexDownton(user_id.toString()).then(({ data }) => {
      if (data && data.status === "success" && data.data) {
        setLastData(data.data.questions);
        setResultRisk(data.data.risk);
        setFirstPart(
          data &&
            data.data.questions &&
            data?.data?.questions[2]?.answer === "SI"
            ? true
            : false
        );
        setSecondPart(
          data &&
            data.data.questions &&
            data?.data?.questions[6]?.answer === "SI"
            ? true
            : false
        );
      } else {
        if (data.status === "error") {
          enqueueSnackbar(mapErrors(data.data), errorToast);
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
        { id: 9, answer: value.question_one },
        {
          id: 36,
          answer: value.question_two !== undefined ? value.question_two : "NO",
        },
        { id: 10, answer: firstPart === true ? "SI" : "NO" },
        {
          id: 11,
          answer:
            value.question_three !== undefined ? value.question_three : "NO",
        },
        {
          id: 12,
          answer:
            value.question_four !== undefined ? value.question_four : "NO",
        },
        {
          id: 13,
          answer:
            value.question_five !== undefined ? value.question_five : "NO",
        },
        { id: 14, answer: secondPart === true ? "SI" : "NO" },
        {
          id: 15,
          answer:
            value.question_seven !== undefined ? value.question_seven : "NO",
        },
        {
          id: 16,
          answer:
            value.question_eight !== undefined ? value.question_eight : "NO",
        },
        {
          id: 35,
          answer:
            value.question_nine !== undefined ? value.question_nine : "NO",
        },
      ],
    };
    postIndexDownton(dataSubmit)
      .then(({ data }) => {
        if (data && data.status === "success") {
          Swal.fire({
            title: t("Message.SavedSuccess"),
            icon: "success",
          });
          setIsOpen(false);
          result = { id: 18, result: data.data };
          addFormsPercentToLocalStorage(result);
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
          {t("DetailClinicHistory.IndexDownton")}
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
                  {t("IndexDownTon.QuestionOne")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_one"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[0] && lastData[0].answer}
                  render={({ field }) => (
                    <FormControl
                      component="fieldset"
                      error={errors.question_one}
                    >
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
                  {t("IndexDownTon.Question")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_two"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={lastData && lastData[0] && lastData[0].answer}
                  render={({ field }) => (
                    <FormControl
                      component="fieldset"
                      error={errors.question_two}
                    >
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
            </div>
            <div className="row mt-3">
              <div className="col-9">
                <Typography variant="body2">
                  {t("IndexDownTon.QuestionTwo")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_two"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      name="checkedA"
                      checked={firstPart}
                      value={firstPart}
                      onChange={() => setFirstPart(!firstPart)}
                    />
                  )}
                />
              </div>
            </div>
            {firstPart && (
              <React.Fragment>
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
                      {t("IndexDownTon.SubQuestionOne")}
                    </Typography>
                  </div>
                  <div className="col-3">
                    <Controller
                      name="question_three"
                      control={control}
                      rules={{ required: firstPart ? true : false }}
                      defaultValue={
                        lastData && lastData[0] && lastData[2].answer
                      }
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
                </div>
                <div className="row">
                  <div className="col-9">
                    <Typography variant="body2">
                      {t("IndexDownTon.SubQuestionTwo")}
                    </Typography>
                  </div>
                  <div className="col-3">
                    <Controller
                      name="question_four"
                      control={control}
                      rules={{ required: firstPart ? true : false }}
                      defaultValue={
                        lastData && lastData[3] && lastData[3].answer
                      }
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
                </div>
                <div className="row">
                  <div className="col-9">
                    <Typography variant="body2">
                      {t("IndexDownTon.SubQuestionThree")}
                    </Typography>
                  </div>
                  <div className="col-3">
                    <Controller
                      name="question_five"
                      control={control}
                      rules={{ required: firstPart ? true : false }}
                      defaultValue={
                        lastData && lastData[4] && lastData[4].answer
                      }
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
                </div>
              </React.Fragment>
            )}
            <div className="row mt-3">
              <div className="col-9">
                <Typography variant="body2">
                  {t("IndexDownTon.QuestionThree")}
                </Typography>
              </div>
              <div className="col-3">
                <Controller
                  name="question_six"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={secondPart}
                      value={secondPart}
                      onChange={() => setSecondPart(!secondPart)}
                      name="checkedB"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  )}
                />
              </div>
            </div>
            {secondPart && (
              <React.Fragment>
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
                      {t("IndexDownTon.SubQuestionFive")}
                    </Typography>
                  </div>
                  <div className="col-3">
                    <Controller
                      name="question_seven"
                      control={control}
                      rules={{ required: secondPart ? true : false }}
                      defaultValue={
                        lastData && lastData[6] && lastData[6].answer
                      }
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
                </div>
                <div className="row">
                  <div className="col-9">
                    <Typography variant="body2">
                      {t("IndexDownTon.SubQuestionSix")}
                    </Typography>
                  </div>
                  <div className="col-3">
                    <Controller
                      name="question_eight"
                      control={control}
                      defaultValue={
                        lastData && lastData[7] && lastData[7].answer
                      }
                      rules={{ required: secondPart ? true : false }}
                      render={({ field }) => (
                        <FormControl component="fieldset">
                          <RadioGroup {...field} row name="Surgery">
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
                </div>
                <div className="row">
                  <div className="col-9">
                    <Typography variant="body2">
                      {t("IndexDownTon.SubQuestionSeven")}
                    </Typography>
                  </div>
                  <div className="col-3">
                    <Controller
                      name="question_nine"
                      control={control}
                      rules={{ required: secondPart ? true : false }}
                      defaultValue={
                        lastData && lastData[8] && lastData[8].answer
                      }
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
                </div>
              </React.Fragment>
            )}
            <div className="row">
              <Typography variant="body2">{`Riesgo: ${resultRisk}`}</Typography>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <ButtonSave text="Guardar" loader={loadingFetch} />
            </div>
          </form>
        </React.Fragment>
      )}
    </div>
  );
};
