import { lazy } from "react";
import { routesUrl, ConfigNameRoutes } from "./constants";

export const routes = [
  {
    path: routesUrl.base,
    exact: true,
    redirect: routesUrl.login,
  },
  {
    path: routesUrl.baseAuth,
    component: lazy(() => import("containers/AuthContainer/AuthContainer")),
    exact: false,
    private: false,
    routes: [
      {
        path: routesUrl.login,
        component: lazy(() => import("pages/LoginPage/LoginPage")),
        exact: true,
        private: false,
      },
    ],
  },
  {
    path: routesUrl.baseApp,
    component: lazy(() => import("containers/AppContainer/index")),
    exact: false,
    private: true,
    requiredPermissions: false,
    routes: [
      {
        path: routesUrl.home,
        component: lazy(() => import("pages/HomeTraining/HomeTrainingPlans")),
        exact: true,
        private: true,
        requiredPermissions: false,
      },

      //! Form New TEMPORAL ROUTE
      {
        path: "/form/new/",
        component: lazy(() =>
          import("../components/Common/ModuleForms/Form/FromManage")
        ),
        exact: true,
        private: true,
        requiredPermissions: false,
      },

      //* AFILIATES
      {
        path: `${ConfigNameRoutes.afiliates}`,
        component: lazy(() => import("pages/AfiliatesPage/AfiliatesPage")),
        exact: true,
        private: true,
        requiredPermissions: true,
      },
      //* Calendar Reservation Coach
      {
        path: `${ConfigNameRoutes.trainerBooking}`,
        component: lazy(() => import("pages/AfiliatesPage/ReservationCoach")),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* VIRTUAL JOURNEY

      {
        path: `${ConfigNameRoutes.virtualAfiliates}`,
        component: lazy(() =>
          import("components/Common/ModuleVirtualJourney/VirtualAfiliatesList")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      {
        path: `${ConfigNameRoutes.detailVirtualAfiliate}`,
        component: lazy(() =>
          import("components/Common/ModuleVirtualJourney/VirtualAfiliateDetail")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* CALENDAR JOURNEY
      {
        path: `${ConfigNameRoutes.calendarJourney}`,
        component: lazy(() =>
          import("components/Common/ModuleCalendarJourney/CalendarJourney")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* DASHBOARD JOURNEY
      {
        path: `${ConfigNameRoutes.dashboardJourney}`,
        component: lazy(() =>
          import("components/Common/ModuleDashboardJourney/DashboardJourney")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* ADMIN TORRE CENTRAL ROLES ACTIVE AND INACTIVE
      {
        path: `${ConfigNameRoutes.partnersJourney}`,
        component: lazy(() =>
          import("components/Common/ModulePartnersJourney/PartnersJourney")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },
      {
        path: `${ConfigNameRoutes.partnersJourneyCoach}`,
        component: lazy(() =>
          import("components/Common/ModulePartnersJourney/PartnersJourney")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Quotes
      {
        path: `${ConfigNameRoutes.quotes}`,
        component: lazy(() =>
          import("../pages/ConfigModuleQuotes/ConfigModuleQuotesPage")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Clinic History
      {
        path: `/clinic-history/:quote_id/:appoiment_type_id/:medical_professional_id/:user_id/:modality_id`,
        component: lazy(() =>
          import(
            "../components/Common/ModuleClinicalHistory/ClinicalHistory/DetailClinicalHistory"
          )
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Maximun Capacity
      {
        path: `${ConfigNameRoutes.maximunCapacity}`,
        component: lazy(() =>
          import("components/Common/ManageTrainingPlan/Capacity/Capacity")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Detail Afiliate
      {
        path: `${ConfigNameRoutes.detailAfiliate}`,
        component: lazy(() =>
          import("pages/DetailAfiliatePage/DetailAfiliatePage")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Create Plan Training for Afiliate
      {
        path: `/create-plan-training-for-afiliate/:document_number`,
        component: lazy(() =>
          import("pages/ManageTrainingConfigPage/ManageTrainingConfigPage")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Manage Training
      {
        path: `${ConfigNameRoutes.manageTraining}`,
        component: lazy(() =>
          import("containers/ManageTrainingContainer/ManageTrainingContainer")
        ),
        exact: false,
        private: true,
        requiredPermissions: true,
        routes: [
          {
            path: `${ConfigNameRoutes.manageTraining}/exercises`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfig/List/Exercises/ListExercises"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.manageTraining}/sessions`,
            component: lazy(() =>
              import(
                "components/Common/ModuleSession/ListSessions/ListSessions"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.manageTraining}/plans-training`,
            component: lazy(() =>
              import("pages/TrainingsConfigPage/TrainingsConfigPage")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
        ],
      },

      //* Create Session
      {
        path: `${ConfigNameRoutes.createSession}`,
        component: lazy(() => import("pages/SessionesPage/SessionesPage")),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Update Session
      {
        path: `${ConfigNameRoutes.updateSession}`,
        component: lazy(() => import("pages/SessionesPage/SessionesPage")),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Quotation
      {
        path: `${ConfigNameRoutes.quotation}`,
        component: lazy(() =>
          import("components/Common/ModuleQuotations/ListQuotations")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Quotation Config
      {
        path: `${ConfigNameRoutes.quotationConfig}`,
        component: lazy(() =>
          import(
            "components/Common/ModuleQuotations/QuotationConfig/QuotationConfig"
          )
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Create Training Plan
      {
        path: `${ConfigNameRoutes.createTraining}`,
        component: lazy(() =>
          import("pages/ManageTrainingConfigPage/ManageTrainingConfigPage")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Create Training Plan For Afiliate
      {
        path: `${ConfigNameRoutes.createTrainingForAfiliate}`,
        component: lazy(() =>
          import("pages/ManageTrainingConfigPage/ManageTrainingConfigPage")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Config Training Plan
      {
        path: `${ConfigNameRoutes.configTrainingPlan}`,
        component: lazy(() =>
          import(
            "containers/Config/ModuleTrainingContainer/ModuleTrainingContainer"
          )
        ),
        exact: false,
        private: true,
        requiredPermissions: true,
        routes: [
          {
            path: `${ConfigNameRoutes.configTrainingPlan}/MuscleGroups`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfig/List/MuscleGroups/ListMuscleGroups"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configTrainingPlan}/Objectives`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfig/List/Objectives/ListObjectives"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configTrainingPlan}/MedicalConditions`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfig/List/MedicalConditions/ListMedicalConditions"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configTrainingPlan}/TrainingLevels`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfig/List/TrainingLevels/ListTrainingLevels"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configTrainingPlan}/TrainingElements`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfig/List/TrainingElements/ListTrainingElements"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configTrainingPlan}/TrainingSteps`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfig/List/TrainingSteps/ListTrainingSteps"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configTrainingPlan}/TrainingPlaces`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfig/List/TrainingPlaces/ListTrainingPlaces"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configTrainingPlan}/movements`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfig/List/Movements/ListMovements"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
        ],
      },

      //* Config Products
      {
        path: `${ConfigNameRoutes.configProducts}`,
        component: lazy(() =>
          import(
            "components/Common/ModuleConfigProducts/Config/Products/ListProducts"
          )
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      {
        path: `/detail-config-products/:product_id/:index_value?`,
        component: lazy(() =>
          import(
            "components/Common/ModuleConfigProducts/Config/Detail/GeneralDetailProduct"
          )
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* PROMOTIONS
      {
        path: `/promotions-grid/:promotion_id?`,
        component: lazy(() =>
          import(
            "components/Common/ModulePromotions/PromotionGrid/PromotionGrid"
          )
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      {
        path: `${ConfigNameRoutes.promotions}`,
        component: lazy(() =>
          import("components/Common/ModulePromotions/ListPromotions")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Carterization
      {
        path: `${ConfigNameRoutes.carterization}`,
        component: lazy(() =>
          import("components/Common/ModuleCarterization/Carterization")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Reports
      {
        path: `${ConfigNameRoutes.reports}`,
        component: lazy(() =>
          import("components/Common/ModuleMedicalReports/Reports")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* MODULE PRODUCTS
      {
        path: `${ConfigNameRoutes.products}`,
        component: lazy(() =>
          import(
            "containers/Config/ModuleConfigProducts/ModuleConfigProductsContainer"
          )
        ),
        exact: false,
        private: true,
        requiredPermissions: true,
        routes: [
          {
            path: `${ConfigNameRoutes.products}/channels`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigProducts/Channels/ListChannels"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.products}/currencies`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigProducts/Currencies/ListCurrencies"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.products}/taxes`,
            component: lazy(() =>
              import("components/Common/ModuleConfigProducts/Taxes/ListTaxes")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.products}/segments`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigProducts/Segments/ListSegments"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.products}/durations`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigProducts/Durations/ListDurations"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
        ],
      },

      //* MODULE RESERVATIONS
      {
        path: `${ConfigNameRoutes.collaborators}`,
        component: lazy(() =>
          import("components/Common/ModuleCollaborators/ListCollaborators")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      {
        path: `/collaborator/detail/:user_id`,
        component: lazy(() =>
          import("../components/Common/ModuleCollaborators/DetailCollaborator")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      {
        path: `${ConfigNameRoutes.configReservations}`,
        component: lazy(() =>
          import(
            "containers/Config/ModuleConfigReservations/ModuleConfigReservationsContainer"
          )
        ),
        exact: false,
        private: true,
        requiredPermissions: true,
        routes: [
          {
            path: `${ConfigNameRoutes.configReservations}/attributes`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigReservations/Attributes/ListAttributes"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configReservations}/activity-category`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigReservations/ActivityCategory/ListActivityCategory"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configReservations}/activities`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigReservations/Activities/ListActivities"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configReservations}/type-of-contract`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigReservations/TypeOfContract/ListTypeOfContract"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configReservations}/location-category`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigReservations/LocationCategory/ListLocationCategory"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configReservations}/location`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigReservations/Location/ListLocation"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configReservations}/venues-category`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigReservations/VenuesCategory/ListVenuesCategory"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configReservations}/venues`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigReservations/Venues/ListVenues"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configReservations}/days-festives`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigReservations/Festives/ListFestives"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configReservations}/blocking-reasons`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigReservations/ReasonBlock/ListReasonBlock"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configReservations}/activities-cancelation-reason`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigReservations/ReasonActivityCancelation/ListReasonActivityCancelation"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
        ],
      },

      //* LOCATIONS
      {
        path: `${ConfigNameRoutes.locations}`,
        component: lazy(() =>
          import("components/Common/ModuleLocationsVenue/ListLocations")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* NUTRITION
      {
        path: `${ConfigNameRoutes.nutrition}`,
        component: lazy(() =>
          import(
            "components/Common/ModuleNutrition/NutritionPage/NutritionPage"
          )
        ),
        exact: true,
        private: true,
        requiredPermissions: false,
      },

      //* DIARY GENERAL
      {
        path: `${ConfigNameRoutes.diaryGeneral}`,
        component: lazy(() =>
          import("components/Common/ModuleQuotesGeneral/ModuleQuotesGeneral")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* ACTIVITIES GENERAL
      {
        path: `${ConfigNameRoutes.activitiesCalendar}`,
        component: lazy(() =>
          import(
            "components/Common/ModuleActivitiesCalendar/ModuleActivitiesCalendar"
          )
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* Group Activity Detail
      {
        path: `${ConfigNameRoutes.groupActivityDetail}`,
        component: lazy(() =>
          import(
            "components/Common/ModuleActivitiesCalendar/DetailActivityReservation/DetailActivityReservation"
          )
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* MODULE CONFIGURATIONS RECIPES

      {
        path: `${ConfigNameRoutes.recipes}`,
        component: lazy(() =>
          import(
            "containers/Config/ModuleNutritionContainer/ModuleNutritionContainer"
          )
        ),
        exact: false,
        private: true,
        requiredPermissions: true,
        routes: [
          {
            path: `${ConfigNameRoutes.recipes}/food`,
            component: lazy(() =>
              import("components/Common/ModuleMedical/List/Food/ListFood")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.recipes}/recipes`,
            component: lazy(() =>
              import("components/Common/ModuleRecipes/ListRecipes")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.recipes}/nutrition`,
            component: lazy(() =>
              import(
                "components/Common/ModuleNutrition/NutritionTemplates/ListNutritionTemplates"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.recipes}/type-food`,
            component: lazy(() =>
              import(
                "components/Common/ModuleMedical/List/TypeFood/ListTypeFood"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.recipes}/weight-unit`,
            component: lazy(() =>
              import(
                "components/Common/ModuleMedical/List/WeightUnit/ListWeightUnit"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
        ],
      },

      //* MODULE CONFIGURATIONS HISTORY CLINIC

      {
        path: `${ConfigNameRoutes.configClinicHistory}`,
        component: lazy(() =>
          import(
            "containers/Config/ModuleClinicHistoryContainer/ModuleClinicHistoryContainer"
          )
        ),
        exact: false,
        private: true,
        requiredPermissions: true,
        routes: [
          {
            path: `${ConfigNameRoutes.configClinicHistory}/BloodType`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/BloodType/ListBloodType"
              )
            ),
            title: "Tipo de Sangre",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/GenderIdentity`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/GenderIdentity/ListGenderIdentity"
              )
            ),
            title: "Identidad de genero",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/reasons-init-ch`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/ArgumentForce/ListArgumentForce"
              )
            ),
            title: "Motivos de inicio de HC",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/method`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/Method/ListMethod"
              )
            ),
            title: "Método",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/mode-type`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/ModeType/ListModeType"
              )
            ),
            title: "Tipo o modo",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/Occupation`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/Occupation/ListOccupation"
              )
            ),
            title: "Ocupación",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/relationship`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/Relationship/ListRelationship"
              )
            ),
            title: "Parentesco",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/oms-risk`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/OMSRisk/ListOSMRisk"
              )
            ),
            title: "Riesgo OMS",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/physical-activity`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/PhysicalActivity/ListPhysicalActivity"
              )
            ),
            title: "Actividad física",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/disability`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/Disability/ListDisability"
              )
            ),
            title: "Discapacidades",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/sleep-pattern`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/SleepPattern/ListSleepPattern"
              )
            ),
            title: "Patrón del sueño",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/type-preparation`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/FoodPreparationType/ListFormPreparationType"
              )
            ),
            title: "Tipo de preparación",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/type-diagnostic`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/DiagnosticType/ListDiagnosticType"
              )
            ),
            title: "Tipo de diagnostico",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/modality`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/Modality/ListModality"
              )
            ),
            title: "Modalidad",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/link-types`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/LinkTypes/ListLinkTypes"
              )
            ),
            title: "Tipo de vinculación",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/nutrition-goals`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/NutritionGoals/ListNutritionGoals"
              )
            ),
            title: "Objetivos de nutrición",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/type-alimentation`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/TypeAlimentation/ListTypeAlimentation"
              )
            ),
            title: "Tipos de alimentación",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/territorial-entity`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/TerritorialEntity/ListTerritorialEntity"
              )
            ),
            title: "Entidad territorial",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/service-group`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/ServiceGroup/ListServiceGroup"
              )
            ),
            title: "Grupos de servicio",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/system-gateway`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/SystemGateway/ListSystemGateway"
              )
            ),
            title: "Puerta de entrada del sistema",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/place-attention`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/PlaceAttention/ListPlaceAttention"
              )
            ),
            title: "Lugar de atención",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/health-technology`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/HealthTechnology/ListHealthTechnology"
              )
            ),
            title: "Tecnología en salud",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/type-health-technology`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/TypeHealthTechnology/ListTypeHealthTechnology"
              )
            ),
            title: "Tipo de tecnología en salud",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/eps`,
            component: lazy(() =>
              import("../components/Common/ModuleMedical/List/EPS/ListEPS")
            ),
            title: "Entidad promotora de salud",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/procedures`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/Procedure/ListProcedure"
              )
            ),
            title: "Procedimientos",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/query-type`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/QueryType/ListQueryType"
              )
            ),
            title: "Tipo de consulta",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/diagnosis`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/Diagnosis/ListDiagnosis"
              )
            ),
            title: "Diagnosticos",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/health-education`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/HealthEducation/ListHealthEducation"
              )
            ),
            title: "Educación en salud",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/pathological-antecedents`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/PathologicalAntecedents/ListPathologicalAntecedents"
              )
            ),
            title: "Antecedentes patológicos",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/ethnicity`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/Ethnicity/ListEthnicity"
              )
            ),
            title: "Pertenencia etnica",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/reason-consultation`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/ReasonConsultation/ListReasonConsultation"
              )
            ),
            title: "Motivos de consulta",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/territorial-zones`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/TerritorialZones/ListTerritorialZones"
              )
            ),
            title: "Zonas Territoriales",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/cause-attention`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/CauseAttention/ListCauseAttention"
              )
            ),
            title: "Causas de atención",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/family-history`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/FamilyHistory/ListFamilyHistory"
              )
            ),
            title: "Antecedentes familiares",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/mycoach-intervention`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/MyCoachIntervention/ListMyCoachIntervention"
              )
            ),
            title: "Intervención MyCoach",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/ethnic-community`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/EthnicCommunity/ListEthnicCommunity"
              )
            ),
            title: "Comunidad etnica",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/musculoskeletal-history`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/MusculoskeletalHistory/ListMusculoskeletalHistory"
              )
            ),
            title: "Antecedentes Osteomusculares",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/daily-food`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/DailyFood/ListDailyFood"
              )
            ),
            title: "Tipos de comidas",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/referral-services`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/ReferralServices/ListReferralServices"
              )
            ),
            title: "Servisios de remisión",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configClinicHistory}/suplements`,
            component: lazy(() =>
              import(
                "../components/Common/ModuleMedical/List/Supplements/ListSupplements"
              )
            ),
            title: "Suplementos",
            exact: true,
            private: true,
            requiredPermissions: true,
          },
        ],
      },

      //* MODULE CONFIGURATIONS

      {
        path: `${ConfigNameRoutes.config}`,
        component: lazy(() =>
          import("pages/ConfigModulesPage/ConfigModulesPage")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },

      //* CONFIGURATIONS MODULES
      {
        path: `${ConfigNameRoutes.configModules}`,
        component: lazy(() =>
          import("containers/Config/ModuleModules/ModuleModules")
        ),
        exact: false,
        private: true,
        requiredPermissions: true,
        routes: [
          {
            path: `${ConfigNameRoutes.configModules}/group-modules`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfig/GroupModules/ListGroupModules"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/modules`,
            component: lazy(() =>
              import("components/Common/ModuleConfig/Modules/ListModules")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/roles`,
            component: lazy(() =>
              import("components/Common/ModuleConfig/Roles/ListRoles")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/permissions`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfig/Permissions/ListPermissions"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/images`,
            component: lazy(() =>
              import("components/Common/ModuleImages/List/ListImages")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/users`,
            component: lazy(() =>
              import(
                "components/Common/ModuleProfessional/List/Proffesional/ListProffesional"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/countries`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigProducts/Countries/ListCountries"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/departments`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfig/Departments/ListDepartments"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/cities`,
            component: lazy(() =>
              import("components/Common/ModuleConfig/Cities/ListCities")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/regions`,
            component: lazy(() =>
              import("components/Common/ModuleConfig/Regions/ListRegions")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/localities`,
            component: lazy(() =>
              import("components/Common/ModuleConfig/Localities/ListLocalities")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/zones`,
            component: lazy(() =>
              import("components/Common/ModuleConfig/Zones/ListZones")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/organizations`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfig/Organizations/ListOrganizations"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/companies`,
            component: lazy(() =>
              import("components/Common/ModuleConfig/Companies/ListCompanies")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configModules}/brands`,
            component: lazy(() =>
              import("components/Common/ModuleConfig/Mark/ListMarks")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
        ],
      },

      // Module Journeys
      {
        path: `${ConfigNameRoutes.configJourneys}`,
        component: lazy(() =>
          import("containers/Config/ModuleJourneys/ModuleJourneys")
        ),
        exact: false,
        private: true,
        requiredPermissions: true,
        routes: [
          {
            path: `${ConfigNameRoutes.configJourneys}/objetive-virtual-product`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigJourney/ObjetiveVirtualProduct/ListObjetiveVirtualProduct"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configJourneys}/type-of-work`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigJourney/TypeTaskVirtualProduct/ListTypeTask"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configJourneys}/physical-condition`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigJourney/PhysicalCondition/ListPhysicalCondition"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configJourneys}/task-stage`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigJourney/StepsTaksVirtualProduct/ListTaskStage"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configJourneys}/elements-training-mycoach`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigJourney/TrainingElementsMycoach/ListTrainingElementsMycoach"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configJourneys}/heart-diseases`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigJourney/HeartDiseases/ListHeartDiseases"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configJourneys}/reasons-reasing-quotes`,
            component: lazy(() =>
              import(
                "components/Common/ModuleConfigJourney/ReasonsReasingQuotes/ListReasonsReasingQuotes"
              )
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
        ],
      },

      // Module Tickets
      {
        path: `/tickets`,
        component: lazy(() =>
          import("../components/Common/ModuleTickets/Tickets/TicketsView/TicketsView")
        ),
        exact: true,
        private: true,
        requiredPermissions: true,
      },
      {
        path: `${ConfigNameRoutes.configTickets}`,
        component: lazy(() =>
          import(
            "containers/Config/ModuleConfigTickets/ModuleConfigTicketsContainer"
          )
        ),
        exact: false,
        private: true,
        requiredPermissions: true,
        routes: [
          {
            path: `${ConfigNameRoutes.configTickets}/categories`,
            component: lazy(() =>
              import("components/Common/ModuleTickets/Config/ListCategory")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          // {
          //   path: `${ConfigNameRoutes.configTickets}/sub-categories`,
          //   component: lazy(() =>
          //     import(
          //       "components/Common/ModuleConfigJourney/TypeTaskVirtualProduct/ListTypeTask"
          //     )
          //   ),
          //   exact: true,
          //   private: true,
          //   requiredPermissions: true,
          // },
          {
            path: `${ConfigNameRoutes.configTickets}/ranking`,
            component: lazy(() =>
              import("components/Common/ModuleTickets/Config/ListSeverity")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configTickets}/type-ticket`,
            component: lazy(() =>
              import("components/Common/ModuleTickets/Config/ListTypeTicket")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
          {
            path: `${ConfigNameRoutes.configTickets}/sources`,
            component: lazy(() =>
              import("components/Common/ModuleTickets/Config/ListChannel")
            ),
            exact: true,
            private: true,
            requiredPermissions: true,
          },
        ],
      },
    ],
  },
];
