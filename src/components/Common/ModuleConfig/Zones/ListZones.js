import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";

// components
import { FormZone } from "./FormZone";
import { MessageView } from "components/Shared/MessageView/MessageView";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";
import Pagination from "@material-ui/lab/Pagination";

// hooks
import useSearchable from "hooks/useSearchable";
import usePagination from "hooks/usePagination";

// service
import { getAllZones } from "services/GeneralConfig/Zones";
import { getAllCities } from "services/GeneralConfig/Cities";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// utils
import { errorToast, mapErrors } from "utils/misc";
import { useStyles } from "utils/useStyles";

export const ListZones = ({ permissionsActions }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);

  // search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  // Pagination
  const itemsPerPage = 10;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  const getList = useCallback(() => {
    setFetchData(true);
    getAllZones(currentPage, itemsPerPage)
      .then(({ data }) => {
        if (data.status === "success") {
          setPages(data.data.total_items);
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

    getAllCities().then(({ data }) => setCitiesOptions(data.data));
  }, [enqueueSnackbar, setPages, currentPage]);

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
                <Typography variant="h4">{t("ListZones.Zones")}</Typography>
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
                        title_no_data={t("ListCities.CreateCity")}
                        form={
                          <FormZone
                            setExpanded={setExpanded}
                            citiesOptions={citiesOptions}
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
                            <FormZone
                              isEdit
                              defaultValue={row}
                              setExpanded={setExpanded}
                              citiesOptions={citiesOptions}
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

      <div className="d-flex justify-content-end">
        <div className={classes.paginationStyle}>
          <Pagination
            shape="rounded"
            count={pages}
            page={currentPage}
            onChange={(e, p) => {
              handleChangePage(e, p);
              getList();
            }}
            size="large"
          />
        </div>
      </div>
    </div>
  );
};

export default ListZones;
