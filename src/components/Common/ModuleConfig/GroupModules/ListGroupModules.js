import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";

// Components
import { FormGroupModules } from "components/Common/ModuleConfig/GroupModules/FormGroupModules";
import { MessageView } from "components/Shared/MessageView/MessageView";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";

//Imports
import { useSnackbar } from "notistack";

//Utils
import { errorToast, mapErrors } from "utils/misc";

//Hooks
import useSearchable from "hooks/useSearchable";

// Service
import { getGroupModules } from "services/SuperAdmin/GroupModules";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

export const ListGroupModules = ({ permissionsActions }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  useEffect(() => {
    setFetchData(true);
    getGroupModules()
      .then(({ data }) => {
        setFetchData(false);
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
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
  }, [load, enqueueSnackbar]);

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
                  {t("ListGroupModules.Container")}
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
                  <ActionWithPermission isValid={permissionsActions.create}>
                    <div className="col">
                      <CommonComponentAccordion
                        color="primary"
                        expanded={expanded}
                        setExpanded={setExpanded}
                        title_no_data="Crear nuevo grupo de módulo"
                        form={
                          <FormGroupModules
                            type="Nuevo"
                            setExpanded={setExpanded}
                            load={load}
                            setLoad={setLoad}
                            permissionsActions={permissionsActions}
                          />
                        }
                      />
                    </div>
                  </ActionWithPermission>
                </div>
                {data.length === 0 ? (
                  <MessageView label="No hay Datos" />
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
                            <FormGroupModules
                              type="Editar"
                              defaultValue={row}
                              setExpanded={setExpanded}
                              load={load}
                              setLoad={setLoad}
                              permissionsActions={permissionsActions}
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

export default connect(mapStateToProps)(ListGroupModules);
