import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";

// Components
import { FormSegments } from "components/Common/ModuleConfigProducts/Segments/FormSegments";
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
import { getAllSegments } from "services/GeneralConfig/Segments";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";
import { Controls } from "react-flow-renderer";

export const ListSegments = ({ permissionsActions }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const [subsegments, setSubsegments] = useState([]);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  useEffect(() => {
    setFetchData(true);
    getAllSegments()
      .then(({ data }) => {
        setFetchData(false);
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.length >= 0
        ) {
          setData(data.data);
          setSubsegments(filterSubsegments(data.data));
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [load, enqueueSnackbar]);

  const filterSubsegments = (data) => {
    let newData = [];
    data.map((item) => {
      let collection = {};
      collection.id = item.id;
      collection.name = item.name;
      if (!item.parent_id) {
        newData.push(collection);
      }
    });
    return newData;
  };

  return (
    <div className="container">
      {fecthData && data.length === 0 ? (
        <Loading />
      ) : (
        <div className="row gx-3">
          <div className="col">
            <div className="row">
              <div className="col-8">
                <Typography variant="h4">{"Segmentos"}</Typography>
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
                        title_no_data={t("Crear nuevo segmento")}
                        form={
                          <FormSegments
                            type="Nuevo"
                            setExpanded={setExpanded}
                            load={load}
                            setLoad={setLoad}
                            permissionsActions={permissionsActions}
                            subsegments={subsegments}
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
                            <FormSegments
                              type="Editar"
                              id={row.id}
                              defaultValue={row}
                              setExpanded={setExpanded}
                              load={load}
                              permissionsActions={permissionsActions}
                              setLoad={setLoad}
                              subsegments={subsegments}
                              hasSegmentParent={row.parent_id != null}
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

export default ListSegments;
