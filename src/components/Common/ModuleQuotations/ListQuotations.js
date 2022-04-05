import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

// UI
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { IconArrowRightMin } from "assets/icons/customize/config";
import { useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

// Components
import { MessageView } from "components/Shared/MessageView/MessageView";
import Loading from "components/Shared/Loading/Loading";
import FilterSelectionOption from "components/Shared/FilterSelectionOption/FilterSelectionOption";


// styles
import { useStyles } from "utils/useStyles";

//Imports
import { useSnackbar } from "notistack";

//Utils
import { errorToast, mapErrors } from "utils/misc";

//Hooks
import useSearchable from "hooks/useSearchable";

// Service
import { getAllQuotations } from "services/Payments/Quotations";

const ListQuitations = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [statusForFilter, setStatusForFilter] = useState([]);

  const colorsStatusQuotations = {
    1: '#DFEFD7',
  }

  const classes = useStyles();
  const theme = useTheme();

  const history = useHistory();

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  useEffect(() => {
    setFetchData(true);
    getAllQuotations()
      .then(({ data }) => {
        setFetchData(false);
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data?.length >= 0
        ) {
          setData(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar]);

  return (
    <div className="container">
      {fecthData && data.length === 0 ? (
        <Loading />
      ) : (
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col-7">
                <Typography variant="h4">
                  {t("ListQuotations.Title")}
                </Typography>
              </div>

              <div className="col-3">
                <FilterSelectionOption
                  value={''}
                  handleChange={''}
                  label={'Todos'}
                  options={statusForFilter}
                />
              </div>
              <div className="col-2">
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
                <div className="col mt-3">
                  <Card
                    onClick={() => history.push("/quotation-config")}
                    className={classes.defaultBoxContainerPrices}
                  >
                    <Typography variant="body1" style={{ marginLeft: 20 }}>
                      {t("ListQuotations.CreateNewQuotation")}
                    </Typography>
                    <IconButton className={classes.iconButtonArrow}>
                      <AddIcon color={theme.palette.black.main}></AddIcon>
                    </IconButton>
                  </Card>
                </div>
                {data.length === 0 ? (
                  <MessageView label={"ListPermissions.NoData"} />
                ) : (
                  <div className="mt-3">
                      {searchableData?.map((row) => (
                        <Card
                          onClick={() =>
                            history.push(`/quotation-config/${row.uuid}`)
                          }
                          key={`item-product-select` + row.id}
                          className={classes.cardRecipes}
                        >
                          <div className="col-3">
                            <div className={`${classes.quotationsBoxTitle}`}>
                              <Typography variant="body3">
                                <strong>Cotización N° 7655678</strong>
                              </Typography>
                            </div>
                          </div>

                          <div className="col-6 d-flex align-items-center">
                            <Typography variant="p">
                              {row.client_name}
                            </Typography>
                          </div>

                          <div
                            className={`col-2 d-flex align-items-center justify-content-end`}
                          >
                            <Typography
                              variant="body1"
                              className={`${classes.defaultBoxCenteredContainerQuotations}`}
                              style={{ width: 100, backgroundColor: colorsStatusQuotations[row.status] }}
                            >

                              {row.status_name}
                            </Typography>
                          </div>
                          <IconButton className={classes.iconButtonArrow}>
                            <IconArrowRightMin
                              color={theme.palette.black.main}
                            ></IconArrowRightMin>
                          </IconButton>
                        </Card>
                      ))}
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

export default ListQuitations;
