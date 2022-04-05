import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

//Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

//UI
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";

//Components
import ViewDiagramFlow from "components/Common/ModuleSession/ViewDiagramFlow/ViewDiagramFlow";
import Loading from "components/Shared/Loading/Loading";
import OptionsTypeTraining from "components/Shared/OptionsTypeTraining/OptionsTypeTraining";

//Sessions
import { setStepOption } from "modules/sessions";

//Styles
import { useStyles } from "utils/useStyles";

//Services
import { getOneSessions } from "services/TrainingPlan/Sessions";

//Internal dependencies
import { casteMapNameArrayForString } from "utils/misc";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Icons
import { IconEditItem } from "assets/icons/customize/config";
import { iconView } from "utils/iconsPlaceSession";

/**
 * Componente para visualizar una sesion
 */

const ItemContentResumeSession = ({
  isDetailAffiliate = false,
  isNoTitle = false,
  infoResumeSession,
  isDetailPlan,
  setStepOption,
  setIsEdit,
  training_step_name,
  isViewNoEdit = false,
  permissionsActions,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [infoTrainiginSteps, setInfoTrainiginSteps] = useState(
    infoResumeSession.training_steps ?? null
  );
  const [fetchData, setFetchData] = useState(false);
  // const IconPlace = iconView[infoResumeSession?.training_places && infoResumeSession.training_places[0].id];
  const [detailSession, setDetailSession] = useState();
  const [optionTypeTrainingSelect, setOptionTypeTrainingSelect] = useState("");

  useEffect(() => {
    if (
      infoResumeSession.training_steps &&
      infoResumeSession.training_steps.length > 0 &&
      infoResumeSession.training_steps[0].diagram
    ) {
      setOptionTypeTrainingSelect(infoResumeSession.training_steps[0].diagram);
      mapDataForViewSteps(infoResumeSession.training_steps);
    } else {
      setFetchData(true);
      getOneSessions(infoResumeSession.uuid)
        .then(({ data }) => {
          setFetchData(false);
          if (
            data.data.training_steps &&
            data.data.training_steps.length > 0 &&
            data.data.training_steps[0].diagram
          ) {
            const validationNewDiagram = JSON.parse(
              data.data.training_steps[0].diagram
            );
            if (validationNewDiagram && !validationNewDiagram[0].nodes) {
              setOptionTypeTrainingSelect(data.data.training_steps[0].diagram);
              mapDataForViewSteps(data.data.training_steps);
            }
          }
          setDetailSession(data.data);
        })
        .catch((err) => {});
    }
  }, [infoResumeSession]);

  const mapDataForViewSteps = (data) => {
    const dataEnd = [];
    data.forEach((dataStep, index) => {
      if (index === 0) {
        setStepOption({
          training_step: {
            _id: dataStep.front_step_id,
            name: dataStep.training_step_name,
            id: dataStep.training_step_id,
            diagram: dataStep.diagram,
          },
        });
      }
      dataEnd.push({
        ...dataStep,
        _id: dataStep.front_step_id,
        name: dataStep.training_step_name,
        id: dataStep.training_step_id,
        diagram: dataStep.diagram,
      });
    });
    setInfoTrainiginSteps(dataEnd);
  };

  const handleTypeTraining = (value) => {
    setStepOption({ training_step: { ...value, _id: value.front_step_id } });
    const findTrainignSelect = infoTrainiginSteps.find(
      (x) => x.front_step_id === value.front_step_id
    )
      ? infoTrainiginSteps.find((x) => x.front_step_id === value.front_step_id)
          ?.diagram
      : "";
    setOptionTypeTrainingSelect(findTrainignSelect);
    setFetchData(false);
  };

  return (
    <div className="mb-5 border border-2">
      {!isNoTitle && (
        <div className="row mt-3 mb-3">
          <Typography>
            {isDetailPlan ? detailSession?.name : infoResumeSession.name}
          </Typography>
        </div>
      )}
      <div className="row">
        <div className="col-4">
          <Card className={classes.cardItemSession}>
            <Typography className={classes.fontGray}>
              {t("WeeklyNutrition.InputDescription")}
            </Typography>
            <Typography variant="body2">
              {infoResumeSession.long_description}
            </Typography>
          </Card>
        </div>
        <div className="col-8">
          <div className="row">
            <div className="col-6">
              <div className="d-flex flex-column p-1">
                <Typography className={classes.fontGray}>
                  {t("Level.Title")}
                </Typography>
                <Typography>
                  {isDetailPlan
                    ? detailSession?.training_levels &&
                      casteMapNameArrayForString(detailSession?.training_levels)
                    : infoResumeSession.training_levels &&
                      casteMapNameArrayForString(
                        infoResumeSession.training_levels
                      )}
                </Typography>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex flex-column p-1">
                <Typography className={classes.fontGray}>
                  {t("ListNutritionGoals.NutritionGoal")}
                </Typography>
                <Typography>
                  {isDetailPlan
                    ? detailSession?.goals &&
                      casteMapNameArrayForString(detailSession.goals)
                    : infoResumeSession.goals &&
                      casteMapNameArrayForString(infoResumeSession.goals)}
                </Typography>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="d-flex flex-column p-1">
                <Typography className={classes.fontGray}>
                  {t("ItemContentResumeSession.Pathologies")}
                </Typography>
                <Typography>
                  {isDetailPlan
                    ? detailSession?.pathologies &&
                      casteMapNameArrayForString(
                        detailSession.pathologies,
                        "No Aplica"
                      )
                    : infoResumeSession.pathologies &&
                      casteMapNameArrayForString(
                        infoResumeSession.pathologies,
                        "No Aplica"
                      )}
                </Typography>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex flex-column p-1">
                <Typography className={classes.fontGray}>
                  {t("MedicalSuggestions.Contraindications")}
                </Typography>
                <Typography>
                  {isDetailPlan
                    ? detailSession?.contraindications &&
                      casteMapNameArrayForString(
                        detailSession.contraindications,
                        "No Aplica"
                      )
                    : infoResumeSession.contraindications &&
                      casteMapNameArrayForString(
                        infoResumeSession.contraindications,
                        "No Aplica"
                      )}
                </Typography>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="d-flex flex-column p-1">
                <Typography className={classes.fontGray}>
                  {t("Place.label")}
                </Typography>
                <div className="row">
                  {!isDetailPlan &&
                    (infoResumeSession?.training_places || []).map((item) => {
                      const IconPlace = iconView[item.id];
                      return (
                        <div
                          className={`col-6 ${classes.placeRound} mx-1`}
                          key={`icon-place-${item.id}`}
                        >
                          <IconPlace />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* <ActionWithPermission isValid={permissionsActions?.edit}> */}
            {!isDetailAffiliate && !isViewNoEdit && (
              <div className="col-6 mt-4 d-flex justify-content-end">
                <IconButton onClick={() => setIsEdit(true)}>
                  <IconEditItem />
                </IconButton>
              </div>
            )}
            {/* </ActionWithPermission> */}
          </div>
        </div>

        {fetchData && <Loading />}
        {infoTrainiginSteps &&
          infoTrainiginSteps.length > 0 &&
          infoTrainiginSteps[0].diagram &&
          !fetchData && (
            <div className="col-12">
              <OptionsTypeTraining
                selectedOption={handleTypeTraining}
                isDynamic={false}
                dataViewStepsDiagram={infoTrainiginSteps}
              />
              {optionTypeTrainingSelect && (
                <ViewDiagramFlow
                  training_step_name={training_step_name}
                  data={JSON.parse(optionTypeTrainingSelect)}
                />
              )}
            </div>
          )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ common, sessions }) => ({
  trainingStepsSelected: common.trainingStepsSelected,
  training_step_id: sessions.training_step_id,
  training_step_name: sessions.training_step_name,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setStepOption,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemContentResumeSession);
