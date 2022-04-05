import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";

// components
import FormLocality from "./FormLocality";
import { MessageView } from "components/Shared/MessageView/MessageView";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";
import FiltersSelect from "./FiltersSelect";

// utils
import { errorToast, mapErrors } from "utils/misc";

// hooks
import useSearchable from "hooks/useSearchable";
import useListCitiesByCountry from "hooks/useListCitiesByCountry";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// service
import { getLocalityByCity } from "services/GeneralConfig/Localities";

export const ListLocalities = ({ permissionsActions }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [reload, setReload] = useState(true);
  const [data, setData] = useState([]);

  // DataFilter States
  const [idCity, setIdCity] = useState(null);
  const { idCountry, handleChangeIdCountry, listCities } =
    useListCitiesByCountry(1);

  // search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  useEffect(() => {
    const getList = (idCity) => {
      setFetchData(true);
      getLocalityByCity(idCity)
        .then(({ data }) => {
          if (data.status === "success") {
            setData(data.data);
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
          setReload(false);
        });
    };

    if (reload && idCity) {
      getList(idCity);
    }
  }, [enqueueSnackbar, reload, idCity]);

  const onClose = () => {
    setExpanded(false);
    setReload(true);
  };

  const handleChangeCity = (value) => {
    setIdCity(value);
    setReload(true);
  };

  return (
    <div className="container">
      <div className="row gx-3">
        <div className="col">
          <div className="row">
            <div className="col-8">
              <Typography variant="h4">
                {t("ListLocalities.Localities")}
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
            <div className="col-6">
              <FiltersSelect
                idCity={idCity}
                setIdCity={handleChangeCity}
                listCities={listCities}
                handleChangeIdCountry={handleChangeIdCountry}
                idCountry={idCountry}
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
                      title_no_data={t("ListLocalities.CreateLocality")}
                      form={
                        <FormLocality
                          setExpanded={setExpanded}
                          onClose={onClose}
                          defaultValueIdCountry={idCountry}
                          defaultValueIdCity={idCity}
                          permissionsActions={permissionsActions}
                        />
                      }
                    />
                  </div>
                </div>
              </ActionWithPermission>

              {fecthData ? (
                <Loading />
              ) : data && data.length === 0 ? (
                <MessageView label={t("ListPermissions.NoData")} />
              ) : (
                <div className="row mt-3">
                  <div className="col">
                    {searchableData &&
                      searchableData.map((row) => (
                        <CommonComponentAccordion
                          expanded={expanded}
                          setExpanded={setExpanded}
                          key={`${row.id}`}
                          data={row}
                          form={
                            <FormLocality
                              isEdit
                              defaultValue={row}
                              setExpanded={setExpanded}
                              onClose={onClose}
                              defaultValueIdCountry={idCountry}
                              defaultValueIdCity={idCity}
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
    </div>
  );
};

export default ListLocalities;
