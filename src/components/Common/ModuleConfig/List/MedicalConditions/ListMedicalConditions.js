import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

// Components
import { FormMedicalConditions } from "components/Common/ModuleConfig/Manage/MedicalConditions/FormMedicalConditions";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";
import SortableList from "components/Shared/SortableList/SortableList";

//Hooks
import useSearchable from "hooks/useSearchable";

// Services
import {
  getMedicalConditions,
  orderListMedicalConditions,
} from "services/TrainingPlan/MedicalConditions";

//IMPORTS
import { useSnackbar } from "notistack";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

export const ListMedicalConditions = ({ permissionsActions }) => {
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
      getMedicalConditions()
        .then(({ data }) => {
          setLoad(false);
          if (data && data.status === "success" && data.data) {
            setData(data.data.items);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [load, enqueueSnackbar]);

  const setOrderList = (data) => {
    orderListMedicalConditions(data)
      .then(({ data }) => {
        if (data && data.status === "success" && data.data) {
          setLoad(true);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data?.message), errorToast);
          }
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
                  {t("ListMedicalConditions.Container")}
                </Typography>
              </div>
              <div className="col-4 d-flex justify-content-end">
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
                <div className="row">
                  <div className="col">
                    <ActionWithPermission isValid={permissionsActions.create}>
                      <CommonComponentAccordion
                        color="primary"
                        expanded={expanded}
                        setExpanded={setExpanded}
                        title_no_data={t(
                          "ListMedicalConditions.ContainerAccordion"
                        )}
                        form={
                          <FormMedicalConditions
                            type="Nuevo"
                            setExpanded={setExpanded}
                            load={load}
                            permissionsActions={permissionsActions}
                            setLoad={setLoad}
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
                      FormComponent={FormMedicalConditions}
                      type="Editar"
                      load={load}
                      setLoad={setLoad}
                      marginSize={"5px 0 0 0"}
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

export default connect(mapStateToProps)(ListMedicalConditions);
