import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";

// components
import { FormDepartment } from "./FormDepartment";
import { MessageView } from "components/Shared/MessageView/MessageView";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";

// utils
import { errorToast, mapErrors } from "utils/misc";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// hooks
import useSearchable from "hooks/useSearchable";

// service
import { getAllDeparments } from "services/GeneralConfig/Deparments";
import { getAllCountries } from "services/GeneralConfig/Countries";

export const ListDepartments = ({ permissionsActions }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [countriesOptions, setCountriesOptions] = useState([]);

  // search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  const getList = useCallback(() => {
    setFetchData(true);
    getAllDeparments()
      .then(({ data }) => {
        if (data.status === "success") {
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
      .finally(() => setFetchData(false));
    getAllCountries().then(({ data }) => setCountriesOptions(data.data));
  }, [enqueueSnackbar]);

  useEffect(() => {
    getList();
  }, [getList]);

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
                  {t("ListDepartments.Departments")}
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
                <ActionWithPermission isValid={permissionsActions.create}>
                  <div className="row mt-3">
                    <div className="col">
                      <CommonComponentAccordion
                        color="primary"
                        expanded={expanded}
                        setExpanded={setExpanded}
                        title_no_data={t("ListDepartments.CreateDepartments")}
                        form={
                          <FormDepartment
                            setExpanded={setExpanded}
                            countriesOptions={countriesOptions}
                            getList={getList}
                            permissionsActions={permissionsActions}
                          />
                        }
                      />
                    </div>
                  </div>
                </ActionWithPermission>

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
                            <FormDepartment
                              isEdit
                              defaultValue={row}
                              setExpanded={setExpanded}
                              countriesOptions={countriesOptions}
                              getList={getList}
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

export default ListDepartments;
