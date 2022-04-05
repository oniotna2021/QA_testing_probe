import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

// Components
import { FormDailyFood } from "components/Common/ModuleMedical/Manage/DailyFood/FormDailyFood";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import SortableList from "components/Shared/SortableList/SortableList";
import Loading from "components/Shared/Loading/Loading";

// hoc
import ActionWithPermission from "hocs/ActionWithPermission";

//Hooks
import useSearchable from "hooks/useSearchable";

//IMPORTS
import { useSnackbar } from "notistack";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

// Service
import {
  getDailyFood,
  orderDailyFoodElements,
} from "services/MedicalSoftware/DailyFood";

export const ListDailyFood = ({ permissionsActions }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  useEffect(() => {
    if (load) {
      getDailyFood()
        .then(({ data }) => {
          setLoad(false);
          if (data && data.status === "success" && data.data) {
            setData(data.data.items);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data?.message), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [load, enqueueSnackbar]);

  const setOrderList = (data) => {
    orderDailyFoodElements(data)
      .then(({ data }) => {
        if (data && data.status === "success" && data.data) {
          setLoad(true);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data?.message), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return (
    <div className="container">
      {load && searchableData.length === 0 ? (
        <Loading />
      ) : (
        <div className="row gx-3">
          <div className="col">
            <div className="row">
              <div className="col-8">
                <Typography variant="h4">
                  {t("ListDailyFood.TypesFood")}
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
                    <CommonComponentAccordion
                      color="primary"
                      expanded={expanded}
                      setExpanded={setExpanded}
                      title_no_data={t("ListDailyFood.CreateTypesFood")}
                      form={
                        <FormDailyFood
                          type="Nuevo"
                          setExpanded={setExpanded}
                          load={load}
                          setLoad={setLoad}
                          permissionsActions={permissionsActions}
                        />
                      }
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col">
                    <SortableList
                      listItems={searchableData || []}
                      setListItems={setData}
                      funcToOrder={setOrderList}
                      expanded={expanded}
                      setExpanded={setExpanded}
                      FormComponent={FormDailyFood}
                      type="Editar"
                      load={load}
                      setLoad={setLoad}
                      permissionsActions={permissionsActions}
                    />
                  </div>
                </div>
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

export default connect(mapStateToProps)(ListDailyFood);
