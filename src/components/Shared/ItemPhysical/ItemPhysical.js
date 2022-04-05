import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

//UI
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import { useTheme } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
//UTILS
import { useStyles } from "utils/useStyles";
import { formatNameDate } from "utils/misc";

//ICONS
import { IconCheck } from "assets/icons/customize/config";

//SERVICES
import { getPhysicalEvaluationBySurvery } from "services/MedicalSoftware/Questions";

const ItemPhysical = ({ data, setIsOpen }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();

  const [dataSurvery, setDataSurvery] = useState({});

  const [optionSelection, setOptionSelection] = useState(1);

  useEffect(() => {
    getPhysicalEvaluationBySurvery(data.survey_physical_evaluation_id).then(
      ({ data }) => {
        if (data && data.status === "success") {
          setDataSurvery(data.data);
        } else {
          setDataSurvery({});
        }
      }
    );
  }, [data.survey_physical_evaluation_id]);

  return (
    <Card>
      <div className="d-flex justify-content-between">
        <CardHeader
          title={t("DetailClinicHistory.PhysicalAssessment")}
        ></CardHeader>
        <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
      </div>
      <div className="row">
        <div className="ms-3">
          <Typography variant="body2">
            {formatNameDate(data.created_at)}
          </Typography>
        </div>
      </div>
      <div className="ms-3 mt-3">
        <Button
          className={
            optionSelection === 1
              ? classes.miniBoxAnnexesSelected
              : classes.miniBoxAnnexes
          }
          endIcon={
            optionSelection === 1 ? (
              <IconCheck color={theme.palette.black.main} />
            ) : null
          }
          onClick={() => setOptionSelection(1)}
        >
          <Typography
            display="block"
            component={"span"}
            variant="body2"
            style={{ fontSize: "12px" }}
          >
            {t("DetailClinicHistory.PhysicalAssessmentItemOne")}
          </Typography>
        </Button>
        <Button
          className={
            optionSelection === 2
              ? classes.miniBoxAnnexesSelected
              : classes.miniBoxAnnexes
          }
          endIcon={
            optionSelection === 2 ? (
              <IconCheck color={theme.palette.black.main} />
            ) : null
          }
          onClick={() => setOptionSelection(2)}
        >
          <Typography
            display="block"
            component={"span"}
            variant="body2"
            style={{ fontSize: "12px" }}
          >
            {t("DetailClinicHistory.PhysicalAssessmentItemTwo")}
          </Typography>
        </Button>
      </div>

      {optionSelection === 1 ? (
        <div className="row">
          <div className="col-6">
            <div className={classes.itemData}>
              <div className="row">
                <div className="col-8">
                  <div className="row">
                    <Typography className={classes.fontObservation}>
                      {t("BodyCompositionForm.Weight")}
                    </Typography>
                    <Typography variant="body2">{`${data.weight} kg`}</Typography>
                  </div>
                  <div className="row">
                    <Typography className={classes.fontObservation}>
                      {t("BodyCompositionForm.IMC")}
                    </Typography>
                    <Typography variant="body2">{`${data.IMC}`}</Typography>
                  </div>
                  <div className="row">
                    <Typography className={classes.fontObservation}>
                      {t("BodyCompositionForm.Fat")}
                    </Typography>
                    <Typography variant="body2">{`${data.fat_percentage}`}</Typography>
                  </div>
                  <div className="row">
                    <Typography className={classes.fontObservation}>
                      {t("BodyCompositionForm.AbdominalPerimeter")}
                    </Typography>
                    <Typography variant="body2">{`${data.abdominal_perimeter}`}</Typography>
                  </div>
                </div>
                <div className="col-4">
                  <div className="row">
                    <Typography className={classes.fontObservation}>
                      {t("BodyCompositionForm.SizeInfoItem")}
                    </Typography>
                    <Typography variant="body2">{`${data.height} m`}</Typography>
                  </div>
                  <div className="row">
                    <Typography className={classes.fontObservation}>
                      {t("BodyCompositionForm.IMM")}
                    </Typography>
                    <Typography variant="body2">{`${data.IMM}`}</Typography>
                  </div>
                  <div className="row">
                    <Typography className={classes.fontObservation}>
                      {t("BodyCompositionForm.Muscle")}
                    </Typography>
                    <Typography variant="body2">{`${data.muscle_mass_percentage}`}</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className={classes.itemDataObservation}>
              <div className="row">
                <Typography className={classes.fontObservation}>
                  {t("DetailClinicHistory.Observations")}
                </Typography>
                <Typography variant="body2">{`${data.observations}`}</Typography>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="row d-flex align-items-center m-5">
            <div className="col-10 p-0">
              <Typography
                display="block"
                component={"span"}
                variant="button"
                style={{ color: "black" }}
              >
                {t("PhysicalAssesment.QuestionOne")}
              </Typography>
            </div>
            <div className="col-2">{dataSurvery &&  dataSurvery?.questions ? dataSurvery?.questions[0]?.answer : '-'}</div>
            <Divider style={{ margin: "10px 0" }} />
            <div className="col-10 p-0">
              <Typography
                display="block"
                component={"span"}
                variant="button"
                style={{ color: "black" }}
              >
                {t("PhysicalAssesment.QuestionTwo")}
              </Typography>
            </div>
            <div className="col-2">{dataSurvery &&  dataSurvery?.questions ? dataSurvery?.questions[1]?.answer : '-'}</div>
            <Divider style={{ margin: "10px 0" }} />
            <div className="col-10 p-0">
              <Typography
                display="block"
                component={"span"}
                variant="button"
                style={{ color: "black" }}
              >
                {t("PhysicalAssesment.QuestionThree")}
              </Typography>
            </div>
            <div className="col-2">{dataSurvery &&  dataSurvery?.questions ? dataSurvery?.questions[2]?.answer : '-'}</div>
            <Divider style={{ margin: "10px 0" }} />
            <div className="col-10 p-0">
              <Typography
                display="block"
                component={"span"}
                variant="button"
                style={{ color: "black" }}
              >
                {t("PhysicalAssesment.QuestionFour")}
              </Typography>
            </div>
            <div className="col-2">{dataSurvery &&  dataSurvery?.questions ? dataSurvery?.questions[3]?.answer : '-'}</div>
            <Divider style={{ margin: "10px 0" }} />
            <div className="col-10 p-0">
              <Typography
                display="block"
                component={"span"}
                variant="button"
                style={{ color: "black" }}
              >
                {t("PhysicalAssesment.QuestionFive")}
              </Typography>
            </div>
            <div className="col-2">{dataSurvery &&  dataSurvery?.questions ? dataSurvery?.questions[4]?.answer : '-'}</div>
            <Divider style={{ margin: "10px 0" }} />
            <div className="col-10 p-0">
              <Typography
                display="block"
                component={"span"}
                variant="button"
                style={{ color: "black" }}
              >
                {t("PhysicalAssesment.QuestionSix")}
              </Typography>
            </div>
            <div className="col-2">{dataSurvery &&  dataSurvery?.questions ? dataSurvery?.questions[5]?.answer : '-'}</div>
            <Divider style={{ margin: "10px 0" }} />
            <div className="col-10 p-0">
              <Typography
                display="block"
                component={"span"}
                variant="button"
                style={{ color: "black" }}
              >
                {t("PhysicalAssesment.QuestionSeven")}
              </Typography>
            </div>
            <div className="col-2">{dataSurvery &&  dataSurvery?.questions ? dataSurvery?.questions[6]?.answer : '-'}</div>
            <Divider style={{ margin: "10px 0" }} />
            <div className="col-10 p-0">
              <Typography
                display="block"
                component={"span"}
                variant="button"
                style={{ color: "black" }}
              >
                {t("PhysicalAssesment.QuestionEight")}
              </Typography>
            </div>
            <div className="col-2">{dataSurvery &&  dataSurvery?.questions ? dataSurvery?.questions[7]?.answer : '-'}</div>
            <Divider style={{ margin: "10px 0" }} />
            <div className="col-10 p-0">
              <Typography
                display="block"
                component={"span"}
                variant="button"
                style={{ color: "black" }}
              >
                {t("Message.Risk")}
              </Typography>
            </div>
            <div className="col-2">{dataSurvery ? dataSurvery?.risk : '-'}</div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ItemPhysical;
