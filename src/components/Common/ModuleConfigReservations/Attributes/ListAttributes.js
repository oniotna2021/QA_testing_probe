import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Pagination from "@material-ui/lab/Pagination";

// Components
import { FormAttribute } from "components/Common/ModuleConfigReservations/Attributes/FormAttribute";
import { MessageView } from "components/Shared/MessageView/MessageView";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";

//Imports
import { useSnackbar } from "notistack";

//Utils
import { errorToast, mapErrors } from "utils/misc";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// hooks
import useSearchable from "hooks/useSearchable";
import usePagination from "hooks/usePagination";

// Service
import { getAttributesPagination } from "services/Reservations/attributes";

export const ListActivityCategory = ({ permissionsActions }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const [itemsPage, setItemsPage] = useState(10);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  // usePagination
  const itemsPerPage = itemsPage;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  useEffect(() => {
    setFetchData(true);
    getAttributesPagination(itemsPerPage, currentPage)
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setData(data.data.items);
          setPages(data.data.total_items);
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
  }, [load, enqueueSnackbar, currentPage, itemsPerPage]);

  return (
    <div className="container">
      {fecthData && data.length === 0 ? (
        <Loading />
      ) : (
        <div className="row gx-3">
          <div className="col">
            <div className="row">
              <div className="col-8">
                <Typography variant="h4">
                  {t("ListAttributes.Container")}
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
                        title_no_data={t("ListAttributes.CreateNewAttribute")}
                        form={
                          <FormAttribute
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
                            <FormAttribute
                              type="Editar"
                              defaultValue={row}
                              setExpanded={setExpanded}
                              load={load}
                              permissionsActions={permissionsActions}
                              setLoad={setLoad}
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
          <div className="container">
            <div className="d-flex justify-content-between">
              <div className="d-flex mt-3">
                <p>Items por página:</p>
                <FormControl
                  variant="outlined"
                  style={{ width: "6rem", margin: "0em .8em" }}
                >
                  <InputLabel id="document_type_id">Items</InputLabel>
                  <Select
                    variant="outlined"
                    label="Items"
                    onChange={(e) => {
                      setItemsPage(e.target.value);
                    }}
                  >
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={16}>16</MenuItem>
                    <MenuItem value={24}>24</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="d-flex mt-3">
                <Pagination
                  shape="rounded"
                  count={pages}
                  page={currentPage}
                  onChange={handleChangePage}
                  size="large"
                />
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

export default connect(mapStateToProps)(ListActivityCategory);
