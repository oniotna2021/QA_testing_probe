import React from "react";
import { useHistory } from "react-router";

//UI
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

//utils
import { useStyles } from "utils/useStyles";

//icons
import { IconEditItem } from "assets/icons/customize/config";

//COMPONENTS
import FormFirstStepNutritionTemplate from "./FormFirstStepNutritionTemplate";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setNutrition } from "modules/nutrition";

const DetailNutritionTemplate = ({
  isEdit,
  setIsEdit,
  data,
  setNutrition,
  permissionsActions,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const handleChangeEdit = () => {
    setIsEdit(true);
  };

  const handleViewTemplate = () => {
    let initialData = {
      name: data.name,
      goal: data.goal_name,
      type_alimentation: data.type_alimentation_name,
      description: data.description,
      recipes: data?.rescipes,
      recipe_exchange: data?.recipes_exchangue,
      isCreateTemplate: true,
      isViewTemplate: true,
    };
    setNutrition(initialData);
    history.push("/nutrition/0");
  };

  return (
    <>
      {isEdit ? (
        <FormFirstStepNutritionTemplate defaultValues={data} isEdit={isEdit} />
      ) : (
        <div className="row">
          <div className="col-1 d-flex justify-content-center"></div>
          <div className="col-4">
            <div className="d-flex flex-column mt-4">
              <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
                Objetivo
              </Typography>
              <Typography variant="body1">{data.goal_name}</Typography>
            </div>
            <div className="d-flex flex-column my-4">
              <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
                Tipo de Alimentacion
              </Typography>
              <Typography variant="body1">
                {data.type_alimentation_name}
              </Typography>
            </div>
            <Button
              size="large"
              className={classes.button2}
              onClick={() => handleViewTemplate()}
            >
              Plan de nutrición
            </Button>
          </div>
          <div className="col-5">
            <div className={classes.boxPreparation}>
              <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
                Descripción
              </Typography>
              <Typography>{data.description}</Typography>
            </div>
          </div>
          <div className="col-2 d-flex align-items-end mb-3 ps-5">
            <ActionWithPermission isValid={permissionsActions.edit}>
              <IconButton
                className={`${classes.buttonIcon} me-2`}
                variant="outlined"
                size="medium"
                onClick={() => handleChangeEdit()}
              >
                <IconEditItem color="#3C3C3B" width="25" height="25" />
              </IconButton>
            </ActionWithPermission>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ nutrition }) => ({
  dataFromStore: nutrition.data,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setNutrition }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailNutritionTemplate);
