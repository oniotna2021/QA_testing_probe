import React, { useState } from "react";
import { useParams } from "react-router-dom";

// UI
import { Typography } from "@material-ui/core";

// redux
import { connect } from "react-redux";

// components
import CardItem from "./CardItem";
import { ShardComponentModal } from "components/Shared/Modal/Modal";

// modals
import IdentityForm from "./Forms/IdentityForm";
import ResidenceDataForm from "./Forms/ResidenceDataForm";
import BasicInformationForm from "./Forms/BasicInformationForm";
import HealthconditionForm from "./Forms/HealthConditionForm";
import BodyCompositionForm from "./Forms/BodyCompositionForm";
import TrainingObjectiveForm from "./Forms/TrainingObjectiveForm";
import NutritionBackgroundForm from "./Forms/NutritionBackgroundForm";
import DietaryHistory from "./Forms/DietaryHistoryForm";
import WeeklyNutritionForm from "./Forms/WeeklyNutritionForm";
import PhysicalBackground from "./Forms/PhysicalBackground";

// styles
import styled from "@emotion/styled";

// translate
import { useTranslation } from "react-i18next";

const MenuSelector = styled.div`
  margin: 0 20px;
  width: 100px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  ${({ isActive }) => isActive && "border-top: solid 3px #007771;"};
`;

const modalProps = {
  backgroundColorButtonClose: "transparent",
  colorButtonClose: "transparent",
  fullWidth: true,
  width: "sm",
};

const Valuation = ({
  dailyFood,
  foodPreparationType,
  pathologicalAntecedents,
  surgeryTimes,
  musculoskeletalHistory,
  familyHistory,
  supplements,
  sleepPatern,
  territorialZones,
  relationship,
  linkTypes,
  territorialEntities,
  disability,
  userType,
  diagnosticType,
}) => {
  const { t } = useTranslation();
  const { user_id, quote_id } = useParams();
  const [menuSelection, setMenuSelection] = useState(0);
  // eslint-disable-next-line
  const [reloadInfo, setReloadInfo] = useState(false);

  // temporal
  const [selectedFoodAlergies, setSelectedFoodAlergies] = useState([]);
  const [selectedFoodRejected, setSelectedFoodRejected] = useState([]);
  const [selectedFoodFavorite, setSelectedFoodFavorite] = useState([]);

  // modals
  const [indentityFormModal, setIndentityFormModal] = useState(false);
  const [residenceDataFormModal, setResidenceDataFormModal] = useState(false);
  const [basicInformationFormModal, setBasicInformationFormModal] =
    useState(false);
  const [healthConditionFormModal, setHealthConditionFormModal] =
    useState(false);
  const [bodyCompositionFormModal, setBodyCompositionFormModal] =
    useState(false);
  const [trainingObjectiveFormModal, setTrainingObjectiveFormModal] =
    useState(false);
  const [nutritionBackgroundFormModal, setNutritionBackgroundFormModal] =
    useState(false);
  const [dietaryHistoryFormModal, setDietaryHistoryFormModal] = useState(false);
  const [weeklyNutritionFormModal, setWeeklyNutritionFormModal] =
    useState(false);

  return (
    <>
      <div className="d-flex justify-content-center flex-column align-items-center">
        <div className="d-flex mb-3">
          <MenuSelector
            isActive={menuSelection === 0}
            onClick={() => setMenuSelection(0)}
          >
            <Typography variant="body2">
              {t("DetailClinicHistory.BasicData")}
            </Typography>
          </MenuSelector>
          <MenuSelector
            isActive={menuSelection === 1}
            onClick={() => setMenuSelection(1)}
          >
            <Typography variant="body2">
              {t("DetailClinicHistory.Anamnesis")}
            </Typography>
          </MenuSelector>
          <MenuSelector
            isActive={menuSelection === 2}
            onClick={() => setMenuSelection(2)}
          >
            <Typography variant="body2">
              {t("Valuation.ModuleVirtualJourneyEvaluation")}
            </Typography>
          </MenuSelector>
        </div>

        <div className="mt-3">
          {menuSelection === 0 && (
            <>
              <div onClick={() => setIndentityFormModal(true)}>
                <CardItem
                  title={t("DetailClinicHistory.Identity")}
                  status={
                    window.localStorage.getItem(`form_1_${user_id}_${quote_id}`)
                      ? t("Valuation.ModuleVirtualJourneyFull")
                      : t("Valuation.ModuleVirtualJourneyUnfilled")
                  }
                />
              </div>

              <div onClick={() => setResidenceDataFormModal(true)}>
                <CardItem
                  title={t("ResidenceAddress.ResidenceData")}
                  status={
                    window.localStorage.getItem(`form_2_${user_id}_${quote_id}`)
                      ? t("Valuation.ModuleVirtualJourneyFull")
                      : t("Valuation.ModuleVirtualJourneyUnfilled")
                  }
                />
              </div>
              {userType === 30 && (
                <div onClick={() => setBasicInformationFormModal(true)}>
                  <CardItem
                    title={t("DetailProduct.BasicInfo")}
                    status={
                      window.localStorage.getItem(
                        `form_8_${user_id}_${quote_id}`
                      )
                        ? t("Valuation.ModuleVirtualJourneyFull")
                        : t("Valuation.ModuleVirtualJourneyUnfilled")
                    }
                  />
                </div>
              )}
            </>
          )}
          {menuSelection === 1 && (
            <>
              <div onClick={() => setHealthConditionFormModal(true)}>
                <CardItem
                  title={t("Valuation.ModuleVirtualJourneyHealthCondition")}
                  status={
                    window.localStorage.getItem(`form_5_${user_id}_${quote_id}`)
                      ? t("Valuation.ModuleVirtualJourneyFull")
                      : t("Valuation.ModuleVirtualJourneyUnfilled")
                  }
                />
              </div>

              {userType === 30 && (
                <>
                  <div onClick={() => setDietaryHistoryFormModal(true)}>
                    <CardItem
                      title={t("Valuation.ModuleVirtualJourneyFood")}
                      status={
                        window.localStorage.getItem(
                          `form_9_${user_id}_${quote_id}`
                        )
                          ? t("Valuation.ModuleVirtualJourneyFull")
                          : t("Valuation.ModuleVirtualJourneyUnfilled")
                      }
                    />
                  </div>

                  <div onClick={() => setWeeklyNutritionFormModal(true)}>
                    <CardItem
                      title={t("NutritionSuggestions.SectionTwo")}
                      status={
                        window.localStorage.getItem(
                          `form_10_${user_id}_${quote_id}`
                        )
                          ? t("Valuation.ModuleVirtualJourneyFull")
                          : t("Valuation.ModuleVirtualJourneyUnfilled")
                      }
                    />
                  </div>
                </>
              )}
            </>
          )}
          {menuSelection === 2 && (
            <>
              <div onClick={() => setBodyCompositionFormModal(true)}>
                <CardItem
                  title={t("Valuation.ModuleVirtualJourneyAssesssment")}
                  status={
                    window.localStorage.getItem(`form_3_${user_id}_${quote_id}`)
                      ? t("Valuation.ModuleVirtualJourneyFull")
                      : t("Valuation.ModuleVirtualJourneyUnfilled")
                  }
                />
              </div>

              <div onClick={() => setTrainingObjectiveFormModal(true)}>
                <CardItem
                  title={t("Valuation.ModuleVirtualJourneyTarget")}
                  status={
                    window.localStorage.getItem(`form_4_${user_id}_${quote_id}`)
                      ? t("Valuation.ModuleVirtualJourneyFull")
                      : t("Valuation.ModuleVirtualJourneyUnfilled")
                  }
                />
              </div>

              <div onClick={() => setNutritionBackgroundFormModal(true)}>
                <CardItem
                  title={t("NutritionSuggestions.SectionOne")}
                  status={
                    userType !== 30
                      ? window.localStorage.getItem(
                          `form_6_${user_id}_${quote_id}`
                        )
                        ? t("Valuation.ModuleVirtualJourneyFull")
                        : t("Valuation.ModuleVirtualJourneyUnfilled")
                      : window.localStorage.getItem(
                          `form_11_${user_id}_${quote_id}`
                        )
                      ? t("Valuation.ModuleVirtualJourneyFull")
                      : t("Valuation.ModuleVirtualJourneyUnfilled")
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}

      <ShardComponentModal
        {...modalProps}
        body={
          <IdentityForm
            setIsOpen={setIndentityFormModal}
            isDetailAffiliate={false}
            userType={userType}
            setReloadInfo={setReloadInfo}
          />
        }
        style={{ padding: 20 }}
        isOpen={indentityFormModal}
      />

      <ShardComponentModal
        {...modalProps}
        body={
          <ResidenceDataForm
            setIsOpen={setResidenceDataFormModal}
            isDetailAffiliate={false}
            territorialZones={territorialZones?.items}
            relationship={relationship?.items}
            userType={userType}
            setReloadInfo={setReloadInfo}
          />
        }
        style={{ padding: 20 }}
        isOpen={residenceDataFormModal}
      />

      <ShardComponentModal
        {...modalProps}
        body={
          <BasicInformationForm
            setIsOpen={setBasicInformationFormModal}
            isDetailAffiliate={false}
            linkTypes={linkTypes?.items}
            territorialEntities={territorialEntities?.items}
            disability={disability?.items}
            userType={userType}
            setReloadInfo={setReloadInfo}
          />
        }
        style={{ padding: 20 }}
        isOpen={basicInformationFormModal}
      />

      <ShardComponentModal
        {...modalProps}
        body={
          <HealthconditionForm
            setIsOpen={setHealthConditionFormModal}
            isDetailAffiliate={false}
            pathologicalAntecedents={pathologicalAntecedents.items}
            surgeryTimes={surgeryTimes.items}
            musculoskeletalHistory={musculoskeletalHistory.items}
            familyHistory={familyHistory.items}
            setReloadInfo={setReloadInfo}
            userType={userType}
          />
        }
        style={{ padding: 20 }}
        isOpen={healthConditionFormModal}
      />

      <ShardComponentModal
        {...modalProps}
        body={
          <BodyCompositionForm
            setIsOpen={setBodyCompositionFormModal}
            isDetailAffiliate={false}
            setReloadInfo={setReloadInfo}
            userType={userType}
          />
        }
        style={{ padding: 20 }}
        isOpen={bodyCompositionFormModal}
      />

      <ShardComponentModal
        {...modalProps}
        body={
          <TrainingObjectiveForm
            setIsOpen={setTrainingObjectiveFormModal}
            isDetailAffiliate={false}
            userType={userType}
            setReloadInfo={setReloadInfo}
          />
        }
        style={{ padding: 20 }}
        isOpen={trainingObjectiveFormModal}
      />

      <ShardComponentModal
        {...modalProps}
        body={
          userType === 30 ? (
            <NutritionBackgroundForm
              setIsOpen={setNutritionBackgroundFormModal}
              isDetailAffiliate={false}
              diagnosticType={diagnosticType?.items}
              setReloadInfo={setReloadInfo}
            />
          ) : (
            <PhysicalBackground
              setIsOpen={setNutritionBackgroundFormModal}
              isDetailAffiliate={false}
              setReloadInfo={setReloadInfo}
            />
          )
        }
        style={{ padding: 20 }}
        isOpen={nutritionBackgroundFormModal}
      />

      <ShardComponentModal
        {...modalProps}
        body={
          <DietaryHistory
            setIsOpen={setDietaryHistoryFormModal}
            isDetailAffiliate={false}
            supplements={supplements?.items}
            sleepPatern={sleepPatern?.items}
            setReloadInfo={setReloadInfo}
            selectedFoodAlergies={selectedFoodAlergies}
            setSelectedFoodAlergies={setSelectedFoodAlergies}
            selectedFoodRejected={selectedFoodRejected}
            setSelectedFoodRejected={setSelectedFoodRejected}
            selectedFoodFavorite={selectedFoodFavorite}
            setSelectedFoodFavorite={setSelectedFoodFavorite}
          />
        }
        style={{ padding: 20 }}
        isOpen={dietaryHistoryFormModal}
      />

      <ShardComponentModal
        {...modalProps}
        body={
          <WeeklyNutritionForm
            foodPreparationType={foodPreparationType?.items}
            dailyFood={dailyFood?.items}
            setIsOpen={setWeeklyNutritionFormModal}
            isDetailAffiliate={false}
            setReloadInfo={setReloadInfo}
          />
        }
        style={{ padding: 20 }}
        isOpen={weeklyNutritionFormModal}
      />
    </>
  );
};
const mapStateToProps = ({ medical, auth, global }) => ({
  dailyFood: medical.dailyFood,
  foodPreparationType: medical.foodPreparationType,
  pathologicalAntecedents: medical.pathologicalAntecedents,
  surgeryTimes: medical.surgeryTimes,
  musculoskeletalHistory: medical.musculoskeletalHistory,
  familyHistory: medical.familyHistory,
  supplements: medical.supplements,
  sleepPatern: medical.sleepPatern,
  territorialZones: medical.territorialZones,
  relationship: medical.relationship,
  linkTypes: medical.linkTypes,
  territorialEntities: medical.territorialEntities,
  disability: medical.disability,
  diagnosticType: medical.diagnosticType,
  userType: auth.userType,
});

export default connect(mapStateToProps)(Valuation);
