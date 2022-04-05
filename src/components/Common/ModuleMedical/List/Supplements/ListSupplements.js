import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";

// Components
import { FormSupplements } from "../../Manage/Supplements/FormSupplements";
import { MessageView } from "../../../../Shared/MessageView/MessageView";
import { CommonComponentAccordion } from "../../../../Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";

//IMPORTS
import { useSnackbar } from "notistack";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

//hoc
import ActionWithPermission from "hocs/ActionWithPermission";

//Hooks
import useSearchable from "hooks/useSearchable";

// Service
import { getSupplements } from "../../../../../services/MedicalSoftware/Supplements";

export const ListSupplements = ({ permissionsActions }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(true);
  const [data, setData] = useState([]);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  useEffect(() => {
    if (fecthData) {
      getSupplements()
        .then(({ data }) => {
          if (data && data.status === "success" && data.data.items) {
            setData(data.data.items);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setFetchData(false);
        });
    }
  }, [enqueueSnackbar, fecthData]);

  return (
    <div className="container">
      {fecthData ? (
        <Loading />
      ) : (
        <div className="row gx-3">
          <div className="col">
            <div className="row">
              <div className="col-8">
                <Typography variant="h4">
                  {t("ListSupplements.TitleSupplements")}
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
                          "ListSupplements.NewCreateSupplements"
                        )}
                        form={
                          <FormSupplements
                            type="Nuevo"
                            setExpanded={setExpanded}
                            setFetchData={setFetchData}
                            onClose={() => {
                              setFetchData(true);
                              setExpanded(false);
                            }}
                            permissionsActions={permissionsActions}
                          />
                        }
                      />
                    </ActionWithPermission>
                  </div>
                </div>
                {data.length === 0 ? (
                  <MessageView label={t("ListPermissions.NoData")} />
                ) : (
                  <div className="row mt-3">
                    <div className="col">
                      {searchableData.map((row) => (
                        <CommonComponentAccordion
                          expanded={expanded}
                          setExpanded={setExpanded}
                          key={`${row.id}`}
                          data={row}
                          form={
                            <FormSupplements
                              type="Editar"
                              defaultValue={row}
                              setExpanded={setExpanded}
                              setFetchData={setFetchData}
                              permissionsActions={permissionsActions}
                              onClose={() => {
                                setFetchData(true);
                                setExpanded(false);
                              }}
                            />
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
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

export default connect(mapStateToProps)(ListSupplements);
