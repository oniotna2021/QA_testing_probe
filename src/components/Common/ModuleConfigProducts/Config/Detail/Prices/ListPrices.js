import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

// Components
import { MessageView } from "components/Shared/MessageView/MessageView";
import Loading from "components/Shared/Loading/Loading";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import AddPriceForm from "./AddPriceModal/AddPriceForm";
import GridPrices from "./GridPrices/GridPrices";

// styles
import { useStyles } from "utils/useStyles";

//Imports
import { useSnackbar } from "notistack";

//Utils
import { errorToast, mapErrors } from "utils/misc";

// Service
import { getPriceByProduct } from "services/Comercial/Price";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

export const ListPrices = ({ productInfo }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [fecthData, setFetchData] = useState(false);
  const [data, setData] = useState([]);
  const [addPriceModal, setAddPriceModal] = useState(false);
  const [newCurrencyForm, setNewCurrencyForm] = useState(false);

  const classes = useStyles();
  const theme = useTheme();

  const fetchPrices = () => {
    setFetchData(true);
    setData([]);
    getPriceByProduct(productInfo.id)
      .then(({ data }) => {
        setFetchData(false);
        if (
          data &&
          data.data
        ) {
          console.log(data.data)
          setData(data.data);
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
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <>
      <div className="container">
        {fecthData && data.length === 0 ? (
          <div className="mt-5">
            <Loading />
          </div>
        ) : (
          <div className="row gx-3">
            <div className="col">
              <div className="row">
                <div className="col">
                  <div className="row mt-3">
                    <div className="col">
                      <Card
                        onClick={() => setAddPriceModal(true)}
                        className={classes.defaultBoxContainerPrices}
                      >
                        <Typography variant="p">
                          {t("ListPrices.CreateNewPrice")}
                        </Typography>
                        <IconButton className={classes.iconButtonArrow}>
                          <AddIcon color={theme.palette.black.main}></AddIcon>
                        </IconButton>
                      </Card>
                    </div>
                  </div>
                  {data.length === 0 ? (
                    <MessageView label="No hay Datos" />
                  ) : (
                    <div className="row mt-3">
                      <div className="col">
                        <GridPrices header={data.header} data={data.price} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ShardComponentModal
        {...modalProps}
        body={
          <AddPriceForm
            fetchPrices={fetchPrices}
            newCurrencyForm={newCurrencyForm}
            setNewCurrencyForm={setNewCurrencyForm}
            currentPrices={data}
            productInfo={productInfo}
            handleClose={() => {
              setNewCurrencyForm(false);
              setAddPriceModal(false);
            }}
          />
        }
        isOpen={addPriceModal}
        handleClose={() => {
          setNewCurrencyForm(false);
          setAddPriceModal(false);
        }}
        title={
          newCurrencyForm
            ? t("ListPrices.NewCurrency")
            : t("ListPrices.NewPrice")
        }
      />
    </>
  );
};

export default ListPrices;
