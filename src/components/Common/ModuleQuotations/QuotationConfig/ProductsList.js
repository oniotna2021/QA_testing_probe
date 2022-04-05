import React from "react";
import { useTranslation } from "react-i18next";

//UI
import Typography from "@material-ui/core/Typography";
import { Skeleton } from "@material-ui/lab";
import Button from '@material-ui/core/Button'

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";
import UserInfoCard from "./Cards/UserInfoCard";
import AddedProductCard from "./Cards/AddedProductCard";
import ResumeCard from "./Cards/ResumeCard";

//redux
import { connect } from "react-redux";

const ProductsList = ({
  SubmitQuotation,
  selectedUserInfo,
  isLoading,
  loadingBudget,
  isDetail,
  defaultQuotation,
  setNewUserForm,
  loadingFetchQuotation,
  selectedProducts,
  infoBudget,
  setInvoiceModalState,
}) => {
  const { t } = useTranslation();

  return (
    <div className="container">
      {loadingFetchQuotation ? (
        <div>
          <Skeleton animation="wave" height={70} />
          <Skeleton animation="wave" height={70} />
          <Skeleton animation="wave" height={70} />
          <Skeleton animation="wave" height={70} />
        </div>
      ) : (
        <div className="row">
          {isDetail && (
            <div className="row mb-3">
              <div className="col d-flex align-items-center">
                <Typography variant="h6" className="me-2">
                  <strong>{t("QuotationsConfig.ProductsList.Title")}</strong>
                </Typography>
                <Typography variant="p">
                  {defaultQuotation?.start_date}
                </Typography>
              </div>
              <div className="col d-flex justify-content-end align-items-center">
                <Typography variant="body1">Nº</Typography>
                <Typography variant="h6">
                  <strong>67890123</strong>
                </Typography>
              </div>
            </div>
          )}

          <div className="row mb-3">
            <div className="col">
              <UserInfoCard
                selectedUserInfo={selectedUserInfo}
                setNewUserForm={setNewUserForm}
                isDetail={isDetail}
                defaultQuotation={defaultQuotation}
              />
            </div>
          </div>


          {loadingBudget ? (
            <Loading />
          ) : (
            <div className="row mb-5">
              <div className="col">
                {selectedProducts?.map((product) => {
                  return (
                    <AddedProductCard
                      product={product}
                      selectedProducts={selectedProducts}
                      isDetail={isDetail}
                      defaultQuotation={defaultQuotation}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="row mb-3">
            <div className="col">
              <ResumeCard
                defaultQuotation={defaultQuotation}
                isDetail={isDetail}
                infoBudget={infoBudget}
              />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6 d-flex justify-content-start">
              <Button>
                Cancelar
              </Button>
            </div>
            <div className="col-md-3 d-flex justify-content-end">
              <Button
                style={{ width: 200 }}
                onClick={SubmitQuotation}
                disabled={infoBudget ? false : true}
                variant="outlined">
                {isDetail ? t("Btn.Edit") : t("Btn.save")}
              </Button>
            </div>
            <div className="col-md-3 d-flex justify-content-end">
              <ButtonSave
                style={{ width: 200 }}
                text={"Facturar"}
                loader={isLoading}
                disabled={infoBudget ? false : true}
                onClick={() => setInvoiceModalState(true)}
              />
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};

const mapStateToProps = ({ quotations }) => ({
  selectedProducts: quotations.selectedProducts,
});

export default connect(mapStateToProps)(ProductsList);
