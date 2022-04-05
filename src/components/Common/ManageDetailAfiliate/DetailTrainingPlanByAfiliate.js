import React, { useState } from "react";

//date-fns
import { format } from "date-fns";
import { es } from "date-fns/locale";

//UI
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

//COMPONENTS
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import ItemContentResumeSession from "components/Common/ModuleSession/ItemContentResumeSession/ItemContentResumeSession";

const DetailTrainingPlanByAfiliate = ({
  dataPlan,
  setIsOpen,
  isDetailAffiliate,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="row">
      <div className="d-flex justify-content-between">
        <Typography variant="h5">Programa de entrenamiento</Typography>
        <IconButton onClick={() => setIsOpen(false)}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="row">
        <div className="col-12 d-flex align-items-center">
          <Typography variant="body1">
            {dataPlan.start_date &&
              `${format(new Date(dataPlan.start_date), "dd LLLL", {
                locale: es,
              })} de ${format(new Date(dataPlan.start_date), "yyyy")}`}
          </Typography>
        </div>
      </div>
      <div className="row">
        {dataPlan?.sessions?.map((itemSession) => (
          <React.Fragment>
            <CommonComponentAccordion
              key={`acordion-session-${itemSession.uuid}`}
              data={itemSession}
              isDetail={true}
              isDetailPlan={true}
              isSession={true}
              expanded={expanded}
              form={
                <ItemContentResumeSession
                  isDetailAffiliate={true}
                  isNoTitle={true}
                  infoResumeSession={itemSession}
                  isDetailPlan={true}
                />
              }
              setExpanded={setExpanded}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DetailTrainingPlanByAfiliate;
