//REACT
import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

//COMPONENTS
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";
import ItemUserList from "components/Shared/ItemUserList/ItemUserList";
import { MessageView } from "components/Shared/MessageView/MessageView";

//FORMS
import FormTrainingPlan from "./FormTrainingPlan";

const ItemClient = ({
  valueFilter,
  loader,
  data,
  expanded,
  setExpanded,
  reload,
  setReload,
  userId,
  availableBrands,
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {loader ? (
        <Loading />
      ) : data.length > 0 ? (
        data &&
        data.map((item, idx) =>
          valueFilter !== 1 ? (
            <ItemUserList
              key={`client-${idx}`}
              data={item._source ? item._source : item}
              userId={userId}
              availableBrands={availableBrands}
            />
          ) : (
            <CommonComponentAccordion
              expanded={expanded}
              data={item}
              setExpanded={setExpanded}
              isReserva={true}
              key={`client-${idx}`}
              form={
                <FormTrainingPlan
                  user_id={item.id}
                  reload={reload}
                  setReload={setReload}
                  setOpenAssignTrainer={setExpanded}
                  setExpanded={setExpanded}
                />
              }
            />
          )
        )
      ) : (
        <MessageView label={t("Message.EmptyData")} />
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth }) => ({
  availableBrands: auth.availableBrands,
});

export default connect(mapStateToProps)(ItemClient);
