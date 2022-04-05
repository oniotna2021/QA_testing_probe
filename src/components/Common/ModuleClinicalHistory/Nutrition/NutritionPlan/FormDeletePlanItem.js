import { useState } from "react";
//TRANSLATE
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
//UI
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";

//components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
//UTILS
import { useStyles } from "utils/useStyles";
import { successToast, errorToast, mapErrors } from "utils/misc";

//services
import { deleteRecipe } from "services/MedicalSoftware/Recipes";

const FormDeletePlanItem = ({
  setIsOpen,
  idRecipe,
  load,
  setLoad,
  setExpanded,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [loadingFetch, setLoadingFetch] = useState(false);

  const deleteItem = () => {
    setLoadingFetch(true);
    deleteRecipe(idRecipe).then(({ data }) => {
      if (data && data.status === "success") {
        enqueueSnackbar("Eliminado correctamente", successToast);
        setIsOpen(false);
        setLoad(!load);
      } else {
        enqueueSnackbar(mapErrors(data.message), errorToast);
      }
      setLoadingFetch(false);
      //setExpanded(false)
    });
  };

  return (
    <div style={{ width: 450 }}>
      <div className="row mb-3">
        <div className="col-11">
          <Typography variant="h6">{t("NutritionPlan.Delete")}</Typography>
        </div>
        <div className="col-1">
          <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
        </div>
      </div>
      <div className="row mb-3">
        <Typography variant="p">
          {t("NutritionPlan.FormDeletePlanItem.Text")}
        </Typography>
      </div>
      <div className="d-flex justify-content-between">
        <Button className={classes.button} variant="contained">
          {t("NutritionPlan.ButtonKeep")}
        </Button>
        <ButtonSave
          typeButton="button"
          onClick={() => deleteItem()}
          text={t("Btn.delete")}
          loader={loadingFetch}
        />
      </div>
    </div>
  );
};

export default FormDeletePlanItem;
