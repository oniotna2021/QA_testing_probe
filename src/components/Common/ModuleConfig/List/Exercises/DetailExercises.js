import React, { useState } from "react";
import { useSnackbar } from "notistack";

//UI
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

//components
import { IconPlayVideo } from "assets/icons/customize/config";
import { FormExercises } from "components/Common/ModuleConfig/Manage/Exercises/FormExercises";

//utils
import { useStyles } from "utils/useStyles";
import { successToast, errorToast, mapErrors, decodeURL } from "utils/misc";

//services
import { putExercises } from "services/TrainingPlan/Exercises";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Internal dependencies
import { casteMapArray, casteMapNameArrayForString } from "utils/misc";

import { IconEditItem } from "assets/icons/customize/config";

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#52d869",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const DetailExercises = ({
  data,
  onViewVideo,
  userType,
  reload,
  setReload,
  setExpanded,
  isView = false,
  permissionsActions,
}) => {
  const [state, setState] = useState(data.status === "1" ? true : false);
  const [isEdit, setIsEdit] = useState(false);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = () => {
    setState(!state);
    const dataSubmit = {
      name: data.name,
      description: data.description,
      image_desktop: data.image_desktop,
      image_mobile: data.image_mobile,
      duration: data.duration,
      video_url: data.video_url,
      video_url_landscape: data.video_url_landscape,
      training_levels: casteMapArray(data.training_levels),
      training_places: casteMapArray(data.training_places),
      training_steps: casteMapArray(data.training_steps),
      contraindications: casteMapArray(data.contraindications),
      pathologies: casteMapArray(data.pathologies),
      muscle_groups: casteMapArray(data.muscle_groups),
      training_elements: casteMapArray(data.training_elements),
      movements: casteMapArray(data.movements),
      is_home_training: parseInt(data.is_home_training),
      status: state ? 3 : 1,
    };
    putExercises(data.uuid, dataSubmit)
      .then(({ data }) => {
        if (data && data.status === "success") {
          setTimeout(() => {
            setReload(true);
          }, 2);
          enqueueSnackbar("Actualizado correctamente", successToast);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return isEdit ? (
    <FormExercises
      setState={setState}
      defaultValue={data}
      isUpdate={true}
      setExpanded={setExpanded}
      setReload={setReload}
      reload={reload}
    />
  ) : (
    <div className="row">
      <div className={isView ? "col-6" : "col-2"}>
        <div>
          <Typography className={classes.fontObservation}>Nivel</Typography>
          <Typography variant="body1" className="textEllipsis">
            {casteMapNameArrayForString(data.training_levels)}
          </Typography>
        </div>
        {/* <div>
                    <Typography className={classes.fontObservation}>Objetivos</Typography>
                    <Typography variant='body1' className="textEllipsis">{casteMapNameArrayForString(data.goals)}</Typography>
                </div> */}
        <div>
          <Typography className={classes.fontObservation}>Duración</Typography>
          <Typography variant="body1">{data.duration}</Typography>
        </div>
      </div>

      {!isView && (
        <div className={"col-6"}>
          <Typography className={classes.fontObservation}>
            Descripción
          </Typography>
          <div className={classes.boxObservationTwo}>
            <Typography variant="body1">{data.description}</Typography>
          </div>
          <div className="d-flex">
            <Typography className={classes.fontObservation}>Url</Typography>
            <IconButton onClick={() => onViewVideo()}>
              <IconPlayVideo />
            </IconButton>
          </div>
          <div className={classes.boxObservationTwo}>
            <Typography variant="body1" className="textEllipsis">
              {decodeURL(
                process.env.REACT_APP_VIDEOS_EXERCICES +
                  "Verticales/" +
                  data.video_url
              )}
              /
            </Typography>
          </div>
        </div>
      )}

      <div className={isView ? "col-6" : "col-3"}>
        <div>
          <Typography className={classes.fontObservation}>
            Elementos de entrenamiento
          </Typography>
          <Typography variant="body1" className="textEllipsis">
            {casteMapNameArrayForString(data.training_elements)}
          </Typography>
        </div>
        <div>
          <Typography className={classes.fontObservation}>
            Recomendado para
          </Typography>
          <Typography variant="body1" className="textEllipsis">
            {casteMapNameArrayForString(data.pathologies)}
          </Typography>
        </div>
      </div>

      {isView && (
        <div className={"col-12"}>
          <Typography className={classes.fontObservation}>
            Descripción
          </Typography>
          <div className={classes.boxObservationTwo}>
            <Typography variant="body1">{data.description}</Typography>
          </div>
        </div>
      )}

      {!isView && (
        <div className="col-1 d-flex flex-column justify-content-between">
          <div>
            <ActionWithPermission isValid={permissionsActions.delete}>
              <Typography className={classes.fontObservation}>
                {state ? "Activo" : "Inactivo"}
              </Typography>
              <IOSSwitch
                checked={state}
                onChange={() => handleChange()}
                name="checkedB"
              />
            </ActionWithPermission>
          </div>
          <div>
            <ActionWithPermission isValid={permissionsActions.edit}>
              <IconButton onClick={() => setIsEdit(true)}>
                <IconEditItem />
              </IconButton>
            </ActionWithPermission>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailExercises;
