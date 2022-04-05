import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

// Components
import { FormTrainingPlaces } from "components/Common/ModuleConfig/Manage/TrainingPlaces/FormTrainingPlaces";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";
import SortableList from "components/Shared/SortableList/SortableList";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

//IMPORTS
import { useSnackbar } from "notistack";

//Hooks
import useSearchable from "hooks/useSearchable";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// Service
import {
  getTrainingPlaces,
  orderListTrainingPlaces,
} from "services/TrainingPlan/TrainingPlaces";

export const ListTrainingPlaces = ({ permissionsActions }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  useEffect(() => {
    if (load) {
      getTrainingPlaces()
        .then(({ data }) => {
          setLoad(false);
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data.data.items.length > 0
          ) {
            setData(data.data.items);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data?.message), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [load, enqueueSnackbar]);

  const setOrderList = (data) => {
    orderListTrainingPlaces(data)
      .then(({ data }) => {
        if (data && data.status === "success" && data.data) {
          setLoad(true);
        } else {
          enqueueSnackbar(mapErrors(data.data?.message), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return (
    <div className="container">
      {load && searchableData.length === 0 ? (
        <Loading />
      ) : (
        <div className="row gx-3">
          <div className="col">
            <div className="row">
              <div className="col-8">
                <Typography variant="h4">
                  {t("ListTrainingPlaces.Container")}
                </Typography>
              </div>
              <div className="col d-flex justify-content-end">
                <TextField
                  variant="outlined"
                  onChange={({ target }) => setTerm(target.value)}
                  value={term}
                  label={t("Search.Placeholder")}
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <div className="row mt-3">
                  <div className="col">
                    <ActionWithPermission isValid={permissionsActions.create}>
                      <CommonComponentAccordion
                        color="primary"
                        expanded={expanded}
                        setExpanded={setExpanded}
                        title_no_data={t(
                          "ListTrainingPLaces.Container.TitleNoData"
                        )}
                        form={
                          <FormTrainingPlaces
                            type="Nuevo"
                            setExpanded={setExpanded}
                            load={load}
                            setLoad={setLoad}
                            permissionsActions={permissionsActions}
                          />
                        }
                      />
                    </ActionWithPermission>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col">
                    <SortableList
                      listItems={searchableData || []}
                      setListItems={setData}
                      funcToOrder={setOrderList}
                      expanded={expanded}
                      setExpanded={setExpanded}
                      FormComponent={FormTrainingPlaces}
                      type="Editar"
                      load={load}
                      setLoad={setLoad}
                      permissionsActions={permissionsActions}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  isLoggingIn: auth.isLoggingIn,
});

export default connect(mapStateToProps)(ListTrainingPlaces);
