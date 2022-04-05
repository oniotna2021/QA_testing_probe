import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useSnackbar } from "notistack";
import { useHistory, useParams } from "react-router-dom";

//Components
import SessionManageFilter from "components/Common/ModuleSession/SessionManageFilter/SessionManageFilter";
import DiagramFlujo from "components/Common/ModuleSession/DiagramFlujo/DiagramFlujo";
import InfoForCreateSession from "components/Common/ModuleSession/InfoForCreateSession/InfoForCreateSession";
import FormSessions from "components/Common/ModuleSession/ManageSession/ManageSession";

import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import Loading from "components/Shared/Loading/Loading";

//Actions redux
import {
  setInitsForm,
  resetCreateSession,
  setStepOption,
} from "modules/sessions";
import { reorderTrainingSteps, editDiagramTrainingStep } from "modules/common";

//UI
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

//Hooks
import useWindowUnloadEffect from "hooks/useWindowUnloadEffect";
import { useLocalForage } from "hooks/useLocalForage";

//Services
import { createSession, getOneSessions } from "services/TrainingPlan/Sessions";

//internal dependencies
import {
  addSessionInSelection,
  onDeleteSessionInSelection,
} from "modules/trainingPlan";

//Mics
import { ConfigNameRoutes } from "router/constants";
import {
  errorToast,
  successToast,
  mapErrors,
  normalizeDataNodesSave,
  casteMapNameArrayForString,
} from "utils/misc";

const SessionesPage = ({
  userId,
  formValues,
  addSessionInSelection,
  trainingsLevels,
  reorderTrainingSteps,
  trainingSteps,
  setInitsForm,
  setStepOption,
  trainingStepsSelected,
  onDeleteSessionInSelection,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [expandedInfoSession, setExpandedInfoSession] = useState(false);
  const [isOpenedEditingSessionInfo, setIsOpenedEditingSessionInfo] =
    useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [reloadFetchOnSave, setReloadFetchOnSave] = useState(null);
  let { sessionId } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const tokenSession = queryParams.get("token");
  const backWindow = queryParams.get("from");
  const idForListTraining = queryParams.get("idForList");
  const [setItemInLocalForage, getItemInLocalForage] = useLocalForage();

  //Scren diagram
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState(false);

  useWindowUnloadEffect(async () => {
    if (tokenSession) {
      if (Object.keys(formValues).length !== 0) {
        await setItemInLocalForage(tokenSession, {
          formValues,
          trainingStepsSelected,
        });
      }
    }
  }, true);

  //Efecto para traer la data por UUID de sesion y editarla
  useEffect(() => {
    if (sessionId) {
      setLoadingFetch(true);
      getOneSessions(sessionId)
        .then(({ data }) => {
          setLoadingFetch(false);
          data.data.training_levels = data.data.training_levels[0].id;
          data.data.training_places = data.data.training_places.map(
            (x) => x.id
          );
          if (Object.keys(formValues).length === 0 || idForListTraining) {
            setInitsForm(data.data);
          }
          if (data.data.training_steps.length > 0) {
            mapDataForViewSteps(data.data.training_steps);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //Proteger la ruta de que los datos vengan en el flujo
      if (Object.keys(formValues).length === 0 && tokenSession) {
        if (tokenSession) {
          getItemInLocalForage(tokenSession)
            .then((data) => {
              const getDataLocalStorageSession = data;
              setInitsForm(getDataLocalStorageSession.formValues);
              reorderTrainingSteps(
                getDataLocalStorageSession.trainingStepsSelected
              );
            })
            .catch((err) => {
              console.log(err);
              history.push(ConfigNameRoutes.listSessions);
            });
        } else {
          history.push(ConfigNameRoutes.listSessions);
        }
      }
    }
  }, [sessionId]);

  /*useEffect(() => {
        const timer = window.setInterval(() => {
            if (tokenSession) {
                sessionStorage.setItem(tokenSession, JSON.stringify({
                    formValues,
                    trainingStepsSelected
                }))
            }
        }, 5000);
        return () => { // Return callback to run on unmount.
            window.clearInterval(timer);
        };
    }, [tokenSession, formValues, trainingStepsSelected]);*/

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      reorderTrainingSteps([]);
    };
  }, []);

  const mapDataForViewSteps = (data) => {
    let dataEnd = [];
    data.forEach((dataStep, index) => {
      const diagramElements = dataStep.diagram
        ? JSON.parse(dataStep.diagram)[0].elements
        : "";
      if (index === 0) {
        setStepOption({
          training_step: {
            _id: dataStep.front_step_id,
            name: dataStep.training_step_name,
            id: dataStep.training_step_id,
            diagram: { elements: diagramElements },
          },
        });
      }
      dataEnd.push({
        ...dataStep,
        _id: dataStep.front_step_id,
        name: dataStep.training_step_name,
        id: dataStep.training_step_id,
        diagram: { elements: diagramElements },
      });
    });
    reorderTrainingSteps(dataEnd);
  };

  useEffect(() => {
    if (reloadFetchOnSave) {
      onSave();
    }
  }, [reloadFetchOnSave]);

  const onSave = async () => {
    const mapEnd = mapSaveTrainigSteps();
    if (mapEnd.length > 0) {
      if (saniceSeriesGroup(mapEnd).length === 0) {
        setLoadingSave(true);
        const dataEnd = {
          session_id:
            !reloadFetchOnSave || backWindow
              ? formValues.session_id || formValues.id || null
              : reloadFetchOnSave || null,
          is_draft_session: formValues.is_draft_session || false,
          day: formValues.day,
          trainers_id: userId,
          is_personalized: backWindow || reloadFetchOnSave ? true : false,
          training_places: formValues.training_places.map((x) => {
            return { id: x };
          }),
          pathologies: (formValues.pathologies || []).map((x) => {
            return { id: x.id };
          }),
          contraindications: (formValues.contraindications || []).map((x) => {
            return { id: x.id };
          }),
          training_levels: [{ id: formValues.training_levels || null }],
          goals: (formValues.goals || []).map((x) => {
            return { id: x.id };
          }),
          name: formValues.name,
          is_plan_by_goals: backWindow ? 0 : formValues.is_plan_by_goals,
          is_daily_training: backWindow ? 0 : formValues.is_daily_training,
          long_description: formValues.long_description,
          short_description: formValues.name,
          training_steps: mapEnd,
        };
        createSession(dataEnd)
          .then(({ data }) => {
            if (data.status === "success") {
              setTimeout(() => {
                setLoadingSave(false);

                if (backWindow && idForListTraining) {
                  //Busca y elimina la seccion que esta en lista
                  onDeleteSessionInSelection({ id: Number(idForListTraining) });
                  //Se añade la session nueva
                  addSessionInSelection(data.data);
                }
                reorderTrainingSteps([]);
                if (tokenSession) {
                  localStorage.removeItem(tokenSession);
                }
                history.push(
                  backWindow ? backWindow : ConfigNameRoutes.listSessions
                );
              }, 250);
              enqueueSnackbar(data.message, successToast);
            } else {
              if (data.status === "error" && data.data.used_in_training_plan) {
                setReloadFetchOnSave(data.data.id);
              } else {
                enqueueSnackbar(
                  data.status === "error"
                    ? data.message[0].message
                    : data.message,
                  data.status === "success" ? successToast : errorToast
                );
              }
              setLoadingSave(false);
            }
          })
          .catch((err) => {
            setLoadingSave(false);
            enqueueSnackbar(mapErrors(err), errorToast);
          });
      } else {
        enqueueSnackbar(
          "Las siguientes etapas estan incompleta: " +
            casteMapNameArrayForString(saniceSeriesGroup(mapEnd)),
          errorToast
        );
      }
    } else {
      enqueueSnackbar(
        trainingSteps.length === 0
          ? t("SessionsPage.Warning1")
          : t("SessionsPage.Warning2"),
        errorToast
      );
    }
  };

  const mapSaveTrainigSteps = () => {
    let endData = [];
    trainingStepsSelected.forEach((element) => {
      if (element.diagram && element.diagram.elements) {
        endData.push({
          training_step_id: element.id,
          name: element.name,
          order: element.order,
          front_step_id: element._id,
          training_level_id: formValues.training_levels,
          type_time_apply: element.type_time_repetition,
          /*diagram: sessionStorage.getItem(element._id) ? JSON.stringify([{ elements: JSON.parse(sessionStorage.getItem(element._id)) }]) : JSON.stringify([{ elements: element.diagram.elements }]),*/
          // diagram: [{ elements: element.diagram.elements }],
          diagram: JSON.stringify([{ elements: element.diagram.elements }]),
          series_group: normalizeDataNodesSave(element.diagram.elements),
        });
        //localStorage.removeItem(element._id)
      }
    });
    return endData;
  };

  const saniceSeriesGroup = (value) => {
    return value.filter((x) => x.series_group.length === 0);
  };

  return (
    <>
      <div className="row">
        {loadingFetch ? (
          <Loading />
        ) : (
          <React.Fragment>
            <ShardComponentModal
              width="sm"
              handleClose={() => setIsOpenedEditingSessionInfo(false)}
              body={
                <div className="contentEditingInfoSessionModal">
                  <FormSessions
                    handleClose={() => setIsOpenedEditingSessionInfo(false)}
                    defaultValue={{
                      ...formValues,
                      training_levels: [{ id: formValues?.training_levels }],
                      training_places: (formValues?.training_places || []).map(
                        (x) => {
                          return { id: x };
                        }
                      ),
                      isEditForModal: true,
                    }}
                  />
                </div>
              }
              isOpen={isOpenedEditingSessionInfo}
            />
            <div className="col-3">
              <CommonComponentAccordion
                expanded={expandedInfoSession}
                setExpanded={setExpandedInfoSession}
                key={`info-session-create`}
                data={formValues}
                marginSize={0}
                isInfoSessionCreating={true}
                onEditSession={() => setIsOpenedEditingSessionInfo(true)}
                mb="mb-4"
                form={
                  <InfoForCreateSession
                    formValues={{ ...formValues }}
                    trainingsLevels={trainingsLevels}
                  />
                }
              />

              <SessionManageFilter />
            </div>

            <div className="col-9">
              <DiagramFlujo
                loadingSteps={loadingSteps}
                isEditDiagram={sessionId ? true : false}
              />
              <div style={{ marginTop: 160 }} />
              <div className="d-flex justify-content-end mt-4">
                <Button
                  disabled={loadingSave}
                  onClick={onSave}
                  color="primary"
                  variant="contained"
                >
                  {loadingSave ? (
                    <CircularProgress size={30} color="secondary" />
                  ) : (
                    t("Btn.save")
                  )}
                </Button>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </>
  );
};

const mapStateToProps = ({ auth, sessions, common }) => ({
  userId: auth.userId,
  formValues: sessions.formValues,
  training_step_id: sessions.training_step_id,
  trainingsLevels: common.trainingsLevels,
  trainingStepsSelected: common.trainingStepsSelected,
  trainingSteps: common.trainingSteps,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      resetCreateSession,
      reorderTrainingSteps,
      setInitsForm,
      setStepOption,
      editDiagramTrainingStep,
      addSessionInSelection,
      onDeleteSessionInSelection,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SessionesPage);
