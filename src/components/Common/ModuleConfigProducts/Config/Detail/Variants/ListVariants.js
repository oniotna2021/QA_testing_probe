import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

// UI
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { IconArrowRightMin } from "assets/icons/customize/config";
import { useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

// Components
import { FormProduct } from "../../Products/FormProduct";
import { MessageView } from "components/Shared/MessageView/MessageView";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";

// styles
import { useStyles } from "utils/useStyles";

//Imports
import { useSnackbar } from "notistack";

//Utils
import { errorToast, mapErrors } from "utils/misc";

// Service
import { getVariantsByProduct } from "services/Comercial/Variant";

export const ListVariants = ({ productUUID }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const history = useHistory();

  const classes = useStyles();
  const theme = useTheme();

  useEffect(() => {
    setFetchData(true);
    getVariantsByProduct(productUUID)
      .then(({ data }) => {
        setFetchData(false);
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data?.items?.length >= 0
        ) {
          setData(data.data.items);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        setFetchData(false);
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [load, enqueueSnackbar, productUUID]);

  return (
    <div className="container">
      {fecthData && data.length === 0 ? (
        <Loading />
      ) : (
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col">
                <div className="row">
                  <div className="col">
                    <CommonComponentAccordion
                      color="primary"
                      expanded={expanded}
                      setExpanded={setExpanded}
                      title_no_data={t("ListVariants.CreateVariant")}
                      form={
                        <FormProduct
                          type="Nuevo"
                          setExpanded={setExpanded}
                          load={load}
                          setLoad={setLoad}
                          isVariant
                          productUUID={productUUID}
                        />
                      }
                    />
                  </div>
                </div>
                {data.length === 0 ? (
                  <MessageView label={t("ListPermissions.NoData")} />
                ) : (
                  <div className="row mt-3">
                    <div className="col">
                      {data.map((row) => {
                        return (
                          <Card
                            onClick={() => {
                              history.push(
                                `/detail-config-products/${row.uuid}`
                              );
                              history.go(0);
                            }}
                            key={`item-product-select` + row.id}
                            className={classes.cardRecipes}
                          >
                            <div className="row">
                              <div className="col-3">
                                <div
                                  className={`${classes.comercialBoxContainer}`}
                                >
                                  <Typography variant="body3">
                                    <strong>
                                      {row.product_details.reference
                                        ? row.product_details[0].reference
                                        : "Ref. BT01-01-0002"}
                                    </strong>
                                  </Typography>
                                </div>
                              </div>

                              <div className="col d-flex align-items-center">
                                <Typography variant="body1">
                                  {row.name}
                                </Typography>
                              </div>
                            </div>
                            <IconButton className={classes.iconButtonArrow}>
                              <IconArrowRightMin
                                color={theme.palette.black.main}
                              ></IconArrowRightMin>
                            </IconButton>
                          </Card>
                        );
                      })}
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

export default ListVariants;
