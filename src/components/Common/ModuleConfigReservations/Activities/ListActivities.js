import React, { useEffect, useState } from "react";
//Utils
import { errorToast, mapErrors } from "utils/misc";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";
import Loading from "components/Shared/Loading/Loading";
// Components
import { MessageView } from "components/Shared/MessageView/MessageView";
import ParentComponentItem from "components/Common/ModuleConfigReservations/Activities/ParentComponentItem";
import { TextField } from "@material-ui/core";
// UI
import Typography from "@material-ui/core/Typography";
// redux 
import { connect } from "react-redux";
// Service
import { getAllActivities } from "services/Reservations/activities";
//Hooks
import useSearchable from "hooks/useSearchable";
//Imports
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export const ListActivities = ({ permissionsActions, userType }) => {
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
      getAllActivities()
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
                  {t("ListActivities.Container")}
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
                      <ParentComponentItem
                        defaultIsEdit={false}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        title_no_data={t("ListActivities.CreateNewActivity")}
                        permissionsActions={permissionsActions}
                        load={load}
                        setLoad={setLoad}
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
                        <ParentComponentItem
                          userType={userType}
                          defaultIsEdit={true}
                          key={`${row.id}`}
                          expanded={expanded}
                          setExpanded={setExpanded}
                          load={load}
                          setLoad={setLoad}
                          data={row}
                          idDetail={row.uuid}
                          permissionsActions={permissionsActions}
                          isDetail={true}
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
  userType: auth.userType,
  venueIdDefaultProfile: auth.venueIdDefaultProfile
});

export default connect(mapStateToProps)(ListActivities);