import React, { useState } from "react";
import { useHistory } from "react-router";
import format from "date-fns/format";
import { es } from "date-fns/locale";

// UI
import { Tooltip, Typography } from "@material-ui/core";

// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import DetailTrainingPlanByAfiliate from "components/Common/ManageDetailAfiliate/DetailTrainingPlanByAfiliate";

// icons
import { IconFilledStar, IconArrowRight } from "assets/icons/customize/config";

// style
import styled from "@emotion/styled";
import { addDays } from "date-fns";

const Container = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  justify-content: space-between;
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  ${({ isActive }) =>
    isActive
      ? "box-shadow: 0px 0px 13px 0px #d7d7d7;"
      : "background-color: #F3F3F3;"}
`;

const PlanCardItem = ({
  isActive,
  name,
  user_id,
  nutritional_plan_id,
  trainingPlanData,
  trainer,
  date = new Date(),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();
  return (
    <>
      <Container isActive={isActive}>
        <div className="d-flex align-items-center">
          <div
            className="me-4"
            style={{
              backgroundColor: "#CCE4E3",
              padding: "10px 30px",
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <Typography>
              <b>{format(addDays(new Date(date), 1), "dd")}</b>
            </Typography>
            <Typography variant="body2">
              {format(addDays(new Date(date), 1), "MMM", {
                locale: es,
              })}
            </Typography>
          </div>
          <div>
            <Tooltip title={name}>
              <Typography style={{ width: 250 }} noWrap>
                <b>{name}</b>
              </Typography>
            </Tooltip>
            <Typography>{trainer}</Typography>
          </div>
        </div>

        <div className="d-flex align-items-center pe-4">
          <div className="me-5 d-flex align-items-center">
            <IconFilledStar color="#E68859" />
            <Typography className="ms-1">4.3</Typography>
          </div>

          <div
            style={{
              backgroundColor: isActive
                ? "rgba(230, 241, 241, .5)"
                : "rgba(247, 195, 195, .5)",
              padding: "10px 20px",
              borderRadius: 10,
            }}
            className="me-4"
          >
            {isActive ? "Activo" : "Vencido"}
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (!trainingPlanData) {
                history.push(`/nutrition/${user_id}/${nutritional_plan_id}`);
              } else {
                setIsOpen(true);
              }
            }}
          >
            <IconArrowRight />
          </div>
        </div>
      </Container>

      <ShardComponentModal
        body={
          <DetailTrainingPlanByAfiliate
            dataPlan={trainingPlanData}
            setIsOpen={setIsOpen}
            isDetailAffiliate={false}
          />
        }
        isOpen={isOpen}
      />
    </>
  );
};

export default PlanCardItem;
