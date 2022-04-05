import React, { useEffect, useState } from "react";

//IMPORTS
import { useSnackbar } from "notistack";

//TRANSLATE
import { useTranslation } from "react-i18next";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

//Components
import Loading from "components/Shared/Loading/Loading";
import { MessageView } from "components/Shared/MessageView/MessageView";
import ItemListUserNutritionHistory from "components/Shared/ItemListUserNutritionHistory/ItemListUserNutritionHistory";
//service
import { getAllNutritionalPlansByUser } from "services/MedicalSoftware/NutritionalPlan";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import ModuleNutrition from "components/Common/ModuleClinicalHistory/Nutrition/NutritionPlan/ModuleNutrition";

const DetailNutritionalPlan = ({ id }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [fetchData, setFechData] = useState(false);

  useEffect(() => {
    setFechData(true);
    getAllNutritionalPlansByUser(id)
      .then(({ data }) => {
        setFechData(false);
        if (data.data && data.data.items && data.data.items.length > 0) {
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
  }, [enqueueSnackbar, id]);

  return (
    <React.Fragment>
      {fetchData && <Loading />}
      {data.length === 0 && !fetchData && (
        <MessageView label={t("Message.EmptyData")} />
      )}
      {data.reverse().map((item) => (
        <React.Fragment>
          <ItemListUserNutritionHistory isNutritionalPlan={true}
          nutritionPlanId={item.nutritional_plan_id}
          start_date={item.start_date}
          end_date={item.end_date}
          nutritionPlanName=
          {`${t(DetailNutritionalPlan.description)} ${
            item.nutritional_plan_name
          }`}
          />
          <ShardComponentModal
            fullWidth={true}
            isOpen={isOpen}
            body={
              <ModuleNutrition
                setIsOpen={setIsOpen}
                id_plan={item.id}
                is_afiliate={true}
              />
            }
          />
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default DetailNutritionalPlan;
