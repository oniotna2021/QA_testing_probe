/* eslint-disable no-unused-vars */
// react - redux
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

// state
import {
  updateDailyFood,
  updateFoodPreparationType,
  updateTerritorialZones,
  updateRelationship,
  updateLinkTypes,
  updateTerritorialEntities,
  updateDisability,
  updatePathologicalAntecendents,
  updateSurgeryTimes,
  updateMusculoskeletalHistory,
  updateFamilyHistory,
  updateTypeHealthTechnology,
  updateDiagnosticType,
  updateMycoachIntervention,
  updateHealthTechnology,
  updateHealthEducation,
  updateGoalsIntervention,
  updateMethod,
  updateModeType,
  updateSupplements,
  updateSleepPatern,
} from "modules/medical";

// axios
import axios from "axios";

//services
import { getDailyFood } from "services/MedicalSoftware/DailyFood";
import { getFoodPreparationType } from "services/MedicalSoftware/FoodPreparationType";
import { getTerritorialZones } from "services/MedicalSoftware/TerritorialZones";
import { getRelationship } from "services/MedicalSoftware/Relationship";
import { getLinkTypes } from "services/MedicalSoftware/LinkTypes";
import { getTerritorialEntity } from "services/MedicalSoftware/TerritorialEntity";
import { getDisability } from "services/MedicalSoftware/Disability";
import { getPathologicalAntecedents } from "services/MedicalSoftware/PathologicalAntecedents";
import { getSurgeryTimes } from "services/MedicalSoftware/SurgeryTimes";
import { getMusculoskeletalHistory } from "services/MedicalSoftware/MusculoskeletalHistory";
import { getFamilyHistory } from "services/MedicalSoftware/FamilyHistory";
import { getTypeHealthTechnology } from "services/MedicalSoftware/TypeHealthTechnology";
import { getDiagnosticType } from "services/MedicalSoftware/DiagnosticType";
import { getMyCoachIntervention } from "services/MedicalSoftware/MyCoachIntervention";
import { getHealthTechnology } from "services/MedicalSoftware/HealthTechnology";
import { getHealthEducation } from "services/MedicalSoftware/HealthEducation";
import { getGoalsIntervention } from "services/MedicalSoftware/GoalIntervention";
import { getMethod } from "services/MedicalSoftware/Method";
import { getModeType } from "services/MedicalSoftware/ModeType";
import { getSupplements } from "services/MedicalSoftware/Supplements";
import { getSleepPattern } from "services/MedicalSoftware/SleepPattern";

export const useGetSelectsClinicalHistory = () => {
  const dispatch = useDispatch();

  const [dataSelects, setDataSelects] = useState(false);

  useEffect(() => {
    const dailyFoodFetch = getDailyFood();
    const foodPreparationTypeFetch = getFoodPreparationType();
    const territorailZonesFetch = getTerritorialZones();
    const relationshipFetch = getRelationship();
    const linkTypesFetch = getLinkTypes();
    const territorialEntitiesFetch = getTerritorialEntity();
    const disabilityFetch = getDisability();
    const pathologicalFetch = getPathologicalAntecedents();
    const surgeryTimesFetch = getSurgeryTimes();
    const musculoskeletalFetch = getMusculoskeletalHistory();
    const familyHistoryFetch = getFamilyHistory();
    const typeHealthTechnologyFetch = getTypeHealthTechnology();
    const diagnosticTypeFetch = getDiagnosticType();
    const myCoachFetch = getMyCoachIntervention();
    const healthTechnologyFetch = getHealthTechnology();
    const healthEducationFetch = getHealthEducation();
    const goalsFetch = getGoalsIntervention();
    const methodFetch = getMethod();
    const modeTypeFetch = getModeType();
    const supplementsFetch = getSupplements();
    const sleepPaternFetch = getSleepPattern();

    axios
      .all([
        dailyFoodFetch,
        foodPreparationTypeFetch,
        territorailZonesFetch,
        relationshipFetch,
        linkTypesFetch,
        territorialEntitiesFetch,
        disabilityFetch,
        pathologicalFetch,
        surgeryTimesFetch,
        musculoskeletalFetch,
        familyHistoryFetch,
        typeHealthTechnologyFetch,
        diagnosticTypeFetch,
        myCoachFetch,
        healthTechnologyFetch,
        healthEducationFetch,
        goalsFetch,
        methodFetch,
        modeTypeFetch,
        supplementsFetch,
        sleepPaternFetch,
      ])
      .then(
        axios.spread((...responses) => {
          const { data: dailyFood } = responses[0];
          const { data: foodPreparationType } = responses[1];
          const { data: territorialZones } = responses[2];
          const { data: relationship } = responses[3];
          const { data: linkTypes } = responses[4];
          const { data: territorialEntities } = responses[5];
          const { data: disability } = responses[6];
          const { data: pathologicalAntecedents } = responses[7];
          const { data: surgeryTimes } = responses[8];
          const { data: musculoskeletalHistory } = responses[9];
          const { data: familyHistory } = responses[10];
          const { data: typeHealthTechnology } = responses[11];
          const { data: diagnosticType } = responses[12];
          const { data: myCoachIntervention } = responses[13];
          const { data: healthTechnology } = responses[14];
          const { data: healthEducation } = responses[15];
          const { data: goalsIntervention } = responses[16];
          const { data: method } = responses[17];
          const { data: modeType } = responses[18];
          const { data: supplements } = responses[19];
          const { data: sleepPatern } = responses[20];

          // use/access the results
          dispatch(updateDailyFood(dailyFood.data));
          dispatch(updateFoodPreparationType(foodPreparationType.data));
          dispatch(updateTerritorialZones(territorialZones.data));
          dispatch(updateRelationship(relationship.data));
          dispatch(updateLinkTypes(linkTypes.data));
          dispatch(updateTerritorialEntities(territorialEntities.data));
          dispatch(updateDisability(disability.data));
          dispatch(
            updatePathologicalAntecendents(pathologicalAntecedents.data)
          );
          dispatch(updateSurgeryTimes(surgeryTimes.data));
          dispatch(updateMusculoskeletalHistory(musculoskeletalHistory.data));
          dispatch(updateFamilyHistory(familyHistory.data));
          dispatch(updateTypeHealthTechnology(typeHealthTechnology.data));
          dispatch(updateDiagnosticType(diagnosticType.data));
          dispatch(updateMycoachIntervention(myCoachIntervention.data));
          dispatch(updateHealthTechnology(healthTechnology.data));
          dispatch(updateHealthEducation(healthEducation.data));
          dispatch(updateGoalsIntervention(goalsIntervention.data));
          dispatch(updateMethod(method.data));
          dispatch(updateModeType(modeType.data));
          dispatch(updateSupplements(supplements.data));
          dispatch(updateSleepPatern(sleepPatern.data));
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
  }, [dispatch]);
  return [dataSelects];
};
