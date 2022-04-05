import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { bindActionCreators } from "redux";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

//UI
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

//Components
import FilterForCreateTrainingPlan from "components/Common/ManageTrainingPlan/FilterForCreateTrainingPlan/FilterForCreateTrainingPlan";
import SessionListInPlan from "components/Common/ManageTrainingPlan/SessionListInPlan/SessionListInPlan";
import InfoCreateTrainingPlan from "components/Common/ManageTrainingPlan/InfoCreateTrainingPlan/InfoCreateTrainingPlan";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import Loading from "components/Shared/Loading/Loading";

//Service
import {
  searchAfiliatesService,
  getAfiliateForId,
  getTrainingPlansByUser,
} from "services/affiliates";

//ActionsRedux
import {
  setSessionList,
  setResetSessionCreate,
  addSessionInSelection,
  setInitFormDefaultValue,
} from "modules/trainingPlan";

import { errorToast, mapErrors } from "utils/misc";

import { ConfigNameRoutes } from "router/constants";

const ManageTrainingConfigPage = ({
  step,
  isEditingSession,
  dataSessionsSelection,
  dataInfoForSessionCreate,
  setSessionList,
  setResetSessionCreate,
  userId,
  addSessionInSelection,
  setInitFormDefaultValue,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const history = useHistory();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [fetchData, setFetchData] = useState(false);
  const [fetchDataRoute, setFetchDataRoute] = useState(false);
  const [daysSelected, setDaysSelected] = useState(() => []);
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
    getValues,
    defaultValues,
  } = useForm({ defaultValues: dataInfoForSessionCreate });
  const watchNumberSessions = watch("numberSessions", null); // you can supply default value as second argument

  const { document_number = null } = useParams();
  const [viewDataAfiliateRoute, setViewDataAfiliateRoute] = useState({});

  const queryParams = new URLSearchParams(window.location.search);
  const afiliateIdRoute = queryParams.get("afiliateIdRoute");

  const onSave = () => {
    setIsOpenModal(true);
  };

  useEffect(() => {
    if (
      dataInfoForSessionCreate &&
      isEditingSession &&
      dataInfoForSessionCreate.training_days
    ) {
      setDaysSelected(
        dataInfoForSessionCreate && isEditingSession
          ? dataInfoForSessionCreate.training_days
          : []
      );
    }
    if (
      dataInfoForSessionCreate &&
      isEditingSession &&
      dataInfoForSessionCreate.user
    ) {
      setViewDataAfiliateRoute(
        dataInfoForSessionCreate && isEditingSession
          ? dataInfoForSessionCreate.user
          : {}
      );
    }
  }, [isEditingSession]);

  useEffect(() => {
    if (!isEditingSession) {
      setResetSessionCreate();
    }
  }, [isEditingSession, setResetSessionCreate]);

  useEffect(() => {
    setInitFormDefaultValue({
      dataInfoForSessionCreate: { ...getValues(), training_days: daysSelected },
    });
  }, [daysSelected, watchNumberSessions]);

  useEffect(() => {
    if (document_number || afiliateIdRoute) {
      setFetchDataRoute(true);
      const functionCall = afiliateIdRoute
        ? getAfiliateForId
        : searchAfiliatesService;
      functionCall(afiliateIdRoute || document_number)
        .then(async ({ data }) => {
          if (afiliateIdRoute && data && data.data) {
            setViewDataAfiliateRoute({ ...data.data, user_id: data.data.id });
            setValue("user", { ...data.data, user_id: data.data.id });
            const dataTrainingDetail = await getTrainingPlansByUser(
              data.data.id
            );
            const detailDataMap = dataTrainingDetail.data.data[0];
            const daysConvert = detailDataMap.training_days
              .split(",")
              .map(Number);
            setValue("numberSessions", detailDataMap.number_sessions);
            setValue("training_days", daysConvert);
            setDaysSelected(daysConvert);
            if (!isEditingSession) {
              mapAddSessionForEditing(detailDataMap.sessions);
              setInitFormDefaultValue({
                dataInfoForSessionCreate: {
                  ...getValues(),
                  training_days: daysConvert,
                },
              });
            }
            setFetchDataRoute(false);
          } else {
            setFetchDataRoute(false);
            if (data && data.data && data.data.length > 0) {
              setViewDataAfiliateRoute(data.data[0]);
              setValue("user", data.data[0]);
            } else {
              enqueueSnackbar(data.message, errorToast);
              setViewDataAfiliateRoute({});
              history.push(ConfigNameRoutes.afiliates);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [document_number, afiliateIdRoute, enqueueSnackbar, setValue]);

  const mapAddSessionForEditing = (item) => {
    item.forEach((element) => {
      addSessionInSelection(element);
    });
  };

  const handleCloseSuccess = () => {
    setIsOpenModal(false);
    reset();
    setDaysSelected(() => []);
    setResetSessionCreate();
  };

  return (
    <>
      <ShardComponentModal
        width={"xs"}
        isOpen={isOpenModal}
        handleClose={() => setIsOpenModal(false)}
        body={
          <InfoCreateTrainingPlan
            onClose={handleCloseSuccess}
            userId={userId}
            info={{
              dataInfoForSessionCreate,
              dataSessionsSelection,
            }}
          />
        }
        title={t("ManageTrainingConfigPage.WarningData")}
      />
      <div className="row">
        <div className="col-12 m-2 mb-4">
          <Typography variant="h4">{t("TrainingPlan.title")}</Typography>
        </div>

        <div className="col-4">
          <FilterForCreateTrainingPlan
            setSessionList={setSessionList}
            handleSubmit={handleSubmit}
            isViewAfiliate={
              document_number ||
              afiliateIdRoute ||
              Object.keys(viewDataAfiliateRoute).length > 0
                ? true
                : false
            }
            viewDataAfiliateRoute={viewDataAfiliateRoute}
            errors={errors}
            control={control}
            fetchData={fetchData}
            defaultValues={defaultValues}
            setFetchData={setFetchData}
            getValues={getValues}
            setValue={setValue}
            daysSelected={daysSelected}
            setDaysSelected={setDaysSelected}
          />
        </div>

        {fetchDataRoute && (
          <div className="col-8">
            <Loading />
          </div>
        )}

        {dataSessionsSelection.length > 0 && (
          <div className="col-8">
            {fetchDataRoute ? <Loading /> : <SessionListInPlan />}

            <div className="d-flex justify-content-end mt-4">
              <Button onClick={onSave} color="primary" variant="contained">
                {t("Message.SavePlan")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const mapStateToProps = ({ auth, trainingPlan }) => ({
  step: trainingPlan.step,
  userId: auth.userId,
  dataSessionsSelection: trainingPlan.dataSessionsSelection,
  dataInfoForSessionCreate: trainingPlan.dataInfoForSessionCreate,
  isEditingSession: trainingPlan.isEditingSession,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setSessionList,
      setResetSessionCreate,
      addSessionInSelection,
      setInitFormDefaultValue,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageTrainingConfigPage);
