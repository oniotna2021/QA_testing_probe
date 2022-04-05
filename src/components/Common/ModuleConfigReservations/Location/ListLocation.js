import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

// Components
import { MessageView } from "components/Shared/MessageView/MessageView";
import Loading from "components/Shared/Loading/Loading";
import ParentComponentLocation from "components/Common/ModuleConfigReservations/Location/ParentComponentLocation";

//Imports
import { useSnackbar } from "notistack";

//Utils
import { errorToast, mapErrors } from "utils/misc";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Hooks
import useSearchable from "hooks/useSearchable";

// Service
import { getAllLocation } from "services/Reservations/location";

export const ListLocations = ({ permissionsActions }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  useEffect(() => {
    if (load) {
      getAllLocation()
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data.data.length > 0
          ) {
            setData(data.data);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
          setLoad(false);
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
          setLoad(false);
        });
    }
  }, [load, enqueueSnackbar]);

  return (
    <div className="container">
      {load && data.length === 0 ? (
        <Loading />
      ) : (
        <div className="row gx-3">
          <div className="col">
            <div className="row">
              <div className="col-8">
                <Typography variant="h4">
                  {t("ListLocation.Container")}
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
                      <ParentComponentLocation
                        defaultIsEdit={false}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        title_no_data={t("ListLocation.CreateNewLocation")}
                        load={load}
                        setLoad={setLoad}
                        permissionsActions={permissionsActions}
                      />
                    </ActionWithPermission>
                  </div>
                </div>
                {data.length === 0 ? (
                  <MessageView label="No hay Datos" />
                ) : (
                  <div className="row mt-3">
                    <div className="col">
                      {searchableData.map((row) => (
                        <ParentComponentLocation
                          defaultIsEdit={true}
                          key={`${row.id}`}
                          expanded={expanded}
                          setExpanded={setExpanded}
                          load={load}
                          setLoad={setLoad}
                          data={row}
                          idDetail={row.uuid}
                          isDetail={true}
                          permissionsActions={permissionsActions}
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

export default ListLocations;
