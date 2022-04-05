import React, { useEffect, useState } from "react";
// utils
import { errorToast, mapErrors } from "utils/misc";

import Card from "@material-ui/core/Card";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";
// components
import { FormProduct } from "./FormProduct";
import { IconArrowRightMin } from "assets/icons/customize/config";
import IconButton from "@material-ui/core/IconButton";
import Loading from "components/Shared/Loading/Loading";
import { MessageView } from "components/Shared/MessageView/MessageView";
import Pagination from "@material-ui/lab/Pagination";
import { TextField } from "@material-ui/core";
// UI
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
// services
import { getAllProducts } from "services/Comercial/Product";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import usePagination from "hooks/usePagination";
// hooks
import useSearchable from "hooks/useSearchable";
// imports
import { useSnackbar } from "notistack";
// styles
import { useStyles } from "utils/useStyles";
import { useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

const arrayFilterOptions = [
  { id: "base", name: "Base" },
  { id: "variant", name: "Variante" },
  { id: "kit", name: "Kit" },
];

const productTypes = {
  variant: "Variante",
  base: "Base",
  kit: "Kit",
};

export const ListProducts = ({ userType }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { control } = useForm();
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();

  const [expanded, setExpanded] = useState(false);
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // pagination
  const itemsPerPage = 20;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);
  const [reload, setReload] = useState(true);

  //Search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(filteredData, term, (l) => [l.name]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setFetchData(true);
    getAllProducts(itemsPerPage, currentPage)
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.items?.length >= 0
        ) {
          setData(data.data.items);
          setPages(data.data.total_items);
          setFilteredData(data.data.items);
        } else {
          console.log(data);
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => setFetchData(false));
  }, [enqueueSnackbar, reload, setPages, currentPage]);

  const multiFilterCategory = (filters) => {
    if (filters.length === 0) {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((product) => {
          return filters.some((item) => product.product_type === item.id);
        })
      );
    }
  };

  return (
    <div className="container">
      {fecthData ? (
        <Loading />
      ) : (
        <div className="row gx-3">
          <div className="col">
            <div className="row">
              <div className="col-8">
                <Typography variant="h4">{"Productos y servicios"}</Typography>
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
                      rotateX={true}
                      color="primary"
                      expanded={expanded}
                      setExpanded={setExpanded}
                      title_no_data={t("ListProducts.CreateNewProduct")}
                      form={
                        <FormProduct
                          type="Nuevo"
                          setExpanded={setExpanded}
                          userType={userType}
                        />
                      }
                    />
                  </div>
                </div>

                <div className="row m-0 mt-3">
                  <div className="col-4">
                    <ControlledAutocomplete
                      control={control}
                      name="goals"
                      handleChange={multiFilterCategory}
                      options={arrayFilterOptions || []}
                      getOptionLabel={(option) => `${option.name}`}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Filtro de productos"
                          variant="outlined"
                          margin="normal"
                        />
                      )}
                      defaultValue={[]}
                    />
                  </div>
                </div>
                {data.length === 0 ? (
                  <MessageView label={t("ListPermissions.NoData")} />
                ) : (
                  <div className="row mt-3">
                    <div className="col">
                      {searchableData.map((row) => {
                        return (
                          <Card
                            onClick={() =>
                              history.push(
                                `/detail-config-products/${row.uuid}`
                              )
                            }
                            key={`item-product-select` + row.id}
                            className={classes.cardRecipes}
                          >
                            <div className="row">
                              <div className="col-3">
                                <div
                                  className={`${classes.comercialBoxContainer}`}
                                >
                                  <Typography variant="body3">
                                    {row.product_details && row.product_details.reference
                                      ? row.product_details[0].reference
                                      : "Ref. BT01-01-0002"}
                                  </Typography>
                                </div>
                              </div>

                              <div className="col-4 d-flex align-items-center">
                                <Typography variant="body1">
                                  {row.name}
                                </Typography>
                              </div>

                              <div
                                className={`col-3 d-flex align-items-center justify-content-center`}
                              >
                                {!row?.product_prices && (
                                  <Typography
                                    variant="body1"
                                    className={`${classes.emptyPriceBox}`}
                                  >
                                    {t("ListProducts.NoPrice")}
                                  </Typography>
                                )}
                              </div>

                              <div
                                className={`col-2 d-flex align-items-center justify-content-center`}
                              >
                                <Typography
                                  variant="body1"
                                  className={`${classes.defaultBoxCenteredContainer}`}
                                  style={{ width: 100 }}
                                >
                                  {productTypes[row.product_type]}
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
          <div
            className={`${classes.paginationStyle} d-flex justify-content-end mt-4`}
          >
            <Pagination
              shape="rounded"
              count={pages}
              page={currentPage}
              onChange={(e, p) => {
                handleChangePage(e, p);
                setReload(true);
              }}
              size="large"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  userType: auth.userType,
});

export default connect(mapStateToProps)(ListProducts);
