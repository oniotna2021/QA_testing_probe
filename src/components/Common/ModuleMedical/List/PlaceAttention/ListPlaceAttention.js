import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";

// Components
import { FormPlaceAttention } from "../../Manage/PlaceAttention/FormPlaceAttention";
import { MessageView } from "../../../../Shared/MessageView/MessageView";
import { CommonComponentAccordion } from "../../../../Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";

// hoc
import ActionWithPermission from "hocs/ActionWithPermission";

//IMPORTS
import { useSnackbar } from "notistack";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

//Hooks
import useSearchable from "hooks/useSearchable";

// Service
import { getPlaceAttention } from "services/MedicalSoftware/PlaceAttention";

export const ListPlaceAttention = ({ permissionsActions }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  useEffect(() => {
    setFetchData(true);
    getPlaceAttention()
      .then(({ data }) => {
        setFetchData(false);
        if (data && data.status === "success" && data.data.items.length > 0) {
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
  }, [enqueueSnackbar, load]);

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
                  {t("ListPLaceAttention.TitlePLaceAttention")}
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
                          "ListPLaceAttention.NewCreatePLaceAttention"
                        )}
                        form={
                          <FormPlaceAttention
                            type="Nuevo"
                            setExpanded={setExpanded}
                            load={load}
                            setLoad={setLoad}
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
                            <FormPlaceAttention
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

export default connect(mapStateToProps)(ListPlaceAttention);
