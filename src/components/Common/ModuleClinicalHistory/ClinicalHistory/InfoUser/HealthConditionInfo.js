import React from "react";
import { useTranslation } from "react-i18next";

//UI
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

//COMPONENTS
import ItemHealthCondition from "./ItemHealthCondition";

//UTILS
import { formatNameDate } from "utils/misc";

const HealthConditionInfo = ({ fieldsHealth }) => {
  const { t } = useTranslation();
  return (
    <div className="mb-3">
      <Accordion>
        <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
          <div className="col-12">
            <Typography>
              <b>{t("NutritionSuggestions.SectionOne")}</b>
            </Typography>
            <Typography style={{ fontSize: 12 }}>
              {fieldsHealth?.created_at
                ? formatNameDate(fieldsHealth?.created_at)
                : t("Message.EmptyDataRecords")}
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="row">
            <ItemHealthCondition
              title={t("DetailClinicHistory.AntPathological")}
              validation={fieldsHealth?.presence_of_a_pathological_history}
              name={fieldsHealth?.pathological_antecedents_name}
              subTitle={"Antecedente patológico:"}
              observation={fieldsHealth?.observation_of_pathological_history}
              isNoRemovable={false}
            />
            <ItemHealthCondition
              title={t("DetailClinicHistory.Surgeries")}
              validation={fieldsHealth?.surgery}
              name={fieldsHealth?.time_of_surgery_name}
              subTitle={"Tiempo de ultimo procedimiento:"}
              observation={fieldsHealth?.obs_of_surgery}
              isNoRemovable={false}
            />
            <ItemHealthCondition
              title={t("DetailClinicHistory.AntOsteomuscular")}
              validation={fieldsHealth?.musculoskeletal}
              name={fieldsHealth?.time_of_musculoskeletal_name}
              subTitle={"Antecedente osteomuscular:"}
              observation={fieldsHealth?.obs_of_musculoskeletal}
              isNoRemovable={false}
            />
            <ItemHealthCondition
              title={t("DetailClinicHistory.TakeDrugs")}
              validation={fieldsHealth?.take_drugs}
              observation={fieldsHealth?.drugs_observacion}
              isNoRemovable={false}
            />
            <ItemHealthCondition
              title={t("DetailClinicHistory.HaveAnyAllergies")}
              validation={fieldsHealth?.have_allergies}
              observation={fieldsHealth?.obs_allergies}
              isNoRemovable={false}
            />
            <ItemHealthCondition
              title={t("DetailClinicHistory.AntFamiliar")}
              validation={fieldsHealth?.presence_family_history}
              name={fieldsHealth?.family_history_name}
              subTitle={"Antecedente familiar:"}
              observation={fieldsHealth?.obs_family_history}
              isNoRemovable={false}
            />
            <ItemHealthCondition
              title={t("BodytechRisk.QuestionSix")}
              validation={fieldsHealth?.state_pregnancy}
              isNoRemovable={true}
            />
            <ItemHealthCondition
              title={t("DetailClinicHistory.Birth")}
              validation={fieldsHealth?.births}
              isNoRemovable={true}
            />
            <ItemHealthCondition
              title={t("DetailClinicHistory.Caesarean")}
              validation={fieldsHealth?.caesarean_sections}
              isNoRemovable={true}
            />
            <ItemHealthCondition
              title={t("DetailClinicHistory.Abortions")}
              validation={fieldsHealth?.abortions}
              isNoRemovable={true}
            />
            <ItemHealthCondition
              title={t("DetailClinicHistory.Menstruation")}
              validation={fieldsHealth?.last_menstruation_date}
              isNoRemovable={true}
            />
            <ItemHealthCondition
              title={t("DetailClinicHistory.FamilyPlanning")}
              validation={fieldsHealth?.family_planning}
              observation={fieldsHealth?.obs_family_planning}
              isNoRemovable={false}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default HealthConditionInfo;
