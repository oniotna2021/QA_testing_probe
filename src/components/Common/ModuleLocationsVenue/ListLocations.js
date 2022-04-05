import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";

// Components
import { MessageView } from "components/Shared/MessageView/MessageView";
import Loading from "components/Shared/Loading/Loading";
import ParentComponentLocation from "components/Common/ModuleLocationsVenue/ParentComponentLocation";

//Hooks
import useSearchable from "hooks/useSearchable";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Services
import { useGetLocationByVenue } from "hooks/CachedServices/location";

export const ListLocations = ({ idVenue, permissionsModule }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  // swr
  const { swrData, isLoading, refreshData } = useGetLocationByVenue(idVenue);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(swrData, term, (l) => [l.name]);

  return (
    <div className="container">
      {isLoading ? (
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
                    <ActionWithPermission isValid={permissionsModule[0].create}>
                      <ParentComponentLocation
                        defaultIsEdit={false}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        title_no_data={t("ListLocation.CreateNewLocation")}
                        setLoad={refreshData}
                        permissionsActions={permissionsModule[0]}
                      />
                    </ActionWithPermission>
                  </div>
                </div>
                {swrData.length === 0 ? (
                  <MessageView label="No hay Datos" />
                ) : (
                  <div className="row mt-3">
                    <div className="col">
                      {searchableData &&
                        searchableData.map((row) => (
                          <ParentComponentLocation
                            defaultIsEdit={true}
                            key={`${row.location_has_venue_id}`}
                            keyIndex={`${row.location_has_venue_id}`}
                            expanded={expanded}
                            setExpanded={setExpanded}
                            setLoad={refreshData}
                            data={{ ...row, id: row.location_has_venue_id }}
                            idDetail={row.location_has_venue_id}
                            isDetail={true}
                            permissionsActions={permissionsModule[0]}
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
  idVenue: auth.venueIdDefaultProfile,
});

export default connect(mapStateToProps)(ListLocations);
