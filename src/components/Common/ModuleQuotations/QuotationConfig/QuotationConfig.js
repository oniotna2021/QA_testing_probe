import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useParams } from "react-router";

// components
import ProductsSearch from "./ProductsSearch";
import ProductsList from "./ProductsList";
import FormNewUser from "./Modals/FormNewUser";
import SendQuotation from "./Modals/SendQuotation";
import { ShardComponentModal } from "components/Shared/Modal/Modal";


import InvoiceModal from "./Modals/Invoice/InvoiceModal";
import ApprovedTransaction from "./Modals/Invoice/ApprovedTransaction";
import Payment from "./Modals/Invoice/Payment";

// services
import {
  postQuotation,
  getQuotationByuuid,
} from "services/Payments/Quotations";

import {
  searchProduct,
  initBudget
} from "services/Comercial/Product";


import { getAllCurrencies } from "services/GeneralConfig/Currency";

//hooks
import useDebounce from 'hooks/useDebounce';

// utils
import { successToast, errorToast, mapErrors, infoToast } from "utils/misc";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateSelectedProducts } from "modules/quotations";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const QuotationConfig = ({ updateSelectedProducts, selectedProducts }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { quotation_id } = useParams();
  const { t } = useTranslation();
  const history = useHistory();

  const [isLoading, setisLoading] = useState(false);
  const [loadingFetchQuotation, setLoadingFetchQuotation] = useState(false);

  //
  const [termSearchProduct, setTermSearchProduct] = useState('');
  const [termSearchProductDebounce, setTermSearchProductDebounce] = useDebounce(termSearchProduct);
  const [optionsProducts, setOptionsProducts] = useState([]);
  const [searchLoader, setSearchLoader] = useState(false);

  //Buget
  const [infoBudget, seInfoBudget] = useState(null);
  const [loadingBudget, setLoadingBudget] = useState(false);
  const [updateItemFetch, setUpdateItemFetch] = useState(true);

  // modals
  const [newUserForm, setNewUserForm] = useState(quotation_id ? false : true);
  const [sendQuotationModal, setSendQuotationModal] = useState(false);
  const [invoiceModalState, setInvoiceModalState] = useState(false);
  const [aprovedTransactionModal, setAprovedTransactionModal] = useState(false);

  // payment
  const [paymentMethod, setPaymentMethod] = useState();
  const [paymentLabel, setPaymentLabel] = useState("");

  // preload data
  const [defaultQuotation, setDefaultQuotation] = useState();
  const [currencies, setCurrencies] = useState([]);

  // data
  const [selectedUserInfo, setSelectedUserInfo] = useState();



  useEffect(() => {
    //selectedUserInfo.categoryId
    if (termSearchProductDebounce && selectedUserInfo) {
      searchProduct({
        "id_sub_segment": 2,
        "id_channel": 2,
        "id_category": 6,
        "search": termSearchProductDebounce
      }).then(({ data }) => {
        if (data && data.data) {
          setOptionsProducts(data.data)
        }
      })
    }
  }, [selectedUserInfo, termSearchProductDebounce])


  const SubmitQuotation = () => {
    if (selectedUserInfo && selectedProducts.length > 0) {
      setisLoading(true);
      const data = {
        id_user: selectedUserInfo.user_id,
        products: selectedProducts.map((product) => {
          return {
            id_product: Number(product.id),
            id_venue: Number(product.id_venue),
            id_category: Number(product.id_category),
          };
        }),
      };
      postQuotation(data).then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setisLoading(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          history.push("/quotation");
        } else {
          setisLoading(false);
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      });
    } else {
      if (!selectedUserInfo)
        enqueueSnackbar(
          t("QuotationsConfig.SubmitQuotation.UserError"),
          infoToast
        );
      if (!selectedProducts.length > 0)
        enqueueSnackbar(
          t("QuotationsConfig.SubmitQuotation.ProductsError"),
          infoToast
        );
    }
  };

  const initDefaultQuotaiton = async () => {
    setLoadingFetchQuotation(true);
    try {
      const { data: resDefaultQuotation } = await getQuotationByuuid(
        quotation_id
      );
      const { data: resCurrencies } = await getAllCurrencies();

      if (resDefaultQuotation.status === "success") {
        const sign = resCurrencies?.data?.find(
          (currency) =>
            Number(currency.id) === Number(resDefaultQuotation.data.currency_id)
        );
        setDefaultQuotation({ ...resDefaultQuotation.data, sign });
        updateSelectedProducts(resDefaultQuotation.data.products);
      } else {
        enqueueSnackbar(t("Message.ErrorOcurred"), errorToast);
        updateSelectedProducts([]);
        history.push("/quotation");
      }
      setLoadingFetchQuotation(false);
    } catch (err) {
      setLoadingFetchQuotation(false);
      enqueueSnackbar(mapErrors(err), errorToast);
      updateSelectedProducts([]);
      history.push("/quotation");
    }
  };

  useEffect(() => {
    console.log(selectedProducts)
    if (selectedUserInfo && selectedProducts.length > 0 && updateItemFetch) {
      setLoadingBudget(true);
      const dataBuget = {
        "id_budget": null,
        "id_lead": selectedUserInfo.user_id,
        // "id_costumer": 100,
        // "id_member": 100,
        "id_channel": 2,
        "id_sub_segment": 2,
        "id_source": null,
        "id_campaing": null,
        "id_category": selectedUserInfo.categoryId,
        "id_venue": selectedUserInfo.venueId,
        "products": selectedProducts
      }
      initBudget(dataBuget)
        .then(({ data }) => {
          setLoadingBudget(false);
          if (data.data && data.data) {
            seInfoBudget(data.data);
            setUpdateItemFetch(false);
            updateSelectedProducts((data.data.products || []).map(x => {
              return {
                ...x,
                id: x.id_product
              }
            }))
          }
        })
    }

  }, [selectedProducts, updateItemFetch])

  useEffect(() => {
    window.scrollTo(0, 0);
    if (quotation_id) {
      initDefaultQuotaiton();
    } else {
      updateSelectedProducts([]);
      getAllCurrencies()
        .then(({ data }) => setCurrencies(data.data))
        .catch((err) => console.log(err));
    }
    return () => updateSelectedProducts([]);
  }, []);

  useEffect(() => {
    if (paymentMethod === "card") {
      setPaymentLabel("Pago con tarjeta");
    } else if (paymentMethod === "cash") {
      setPaymentLabel("Pago con efectivo");
    } else if (paymentMethod === "mixed") {
      setPaymentLabel("Pago Mixto");
    }
  }, [paymentMethod]);

  return (
    <>
      <div className="container">
        <div className="row">
          {!quotation_id && (
            <div
              className="col-4 p-4"
              style={{
                backgroundColor: "#F3F3F3",
                borderRadius: 20,
                minHeight: "85vh",
              }}
            >
              <ProductsSearch
                setTerm={setTermSearchProduct}
                options={optionsProducts}
                isDetail={quotation_id}
                searchLoader={searchLoader}
                setUpdateItemFetch={() => setUpdateItemFetch(true)}
                currencies={currencies}
              />
            </div>
          )}

          <div className="col">

            <ProductsList
              loadingFetchQuotation={loadingFetchQuotation}
              setNewUserForm={setNewUserForm}
              defaultQuotation={defaultQuotation}
              isDetail={quotation_id}
              isLoading={isLoading}
              loadingBudget={loadingBudget}
              selectedUserInfo={selectedUserInfo}
              SubmitQuotation={SubmitQuotation}
              currencies={currencies}
              infoBudget={infoBudget}
              setInvoiceModalState={setInvoiceModalState}
            />

          </div>
        </div>
      </div>

      {/* Add user modal */}
      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={
          <FormNewUser
            setNewUserForm={setNewUserForm}
            selectedUserInfo={selectedUserInfo}
            setSelectedUserInfo={setSelectedUserInfo}
          />
        }
        isOpen={newUserForm}
        handleClose={() => setNewUserForm(false)}
        title={t("Quotation.SelectUser")}
      />

      {/* Send quotation modal */}
      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={<SendQuotation />}
        isOpen={sendQuotationModal}
        handleClose={() => setSendQuotationModal(false)}
        title={t("Quotation.SendQuotation")}
      />

      {/* Invoice modal */}
      <ShardComponentModal
        {...modalProps}
        body={
          aprovedTransactionModal ? (
            <ApprovedTransaction
              setSendQuotationModal={setSendQuotationModal}
            />
          ) : paymentMethod ? (
            <Payment
              method={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              setAprovedTransactionModal={setAprovedTransactionModal}
            />
          ) : (
            <InvoiceModal infoBudget={infoBudget} setPaymentMethod={setPaymentMethod} />
          )
        }
        isOpen={invoiceModalState}
        handleClose={() => {
          setAprovedTransactionModal(false);
          setInvoiceModalState(false);
        }}
        title={
          aprovedTransactionModal
            ? "Transacción aprobada"
            : paymentMethod
              ? paymentLabel
              : "Facturar"
        }
      />
    </>
  );
};

const mapStateToProps = ({ quotations }) => ({
  selectedProducts: quotations.selectedProducts,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateSelectedProducts,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(QuotationConfig);
