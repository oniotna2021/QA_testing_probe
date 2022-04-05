import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// ui
import Avatar from "@material-ui/core/Avatar";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

// styled
import { WithoutTrainer, ButtonDetail, Point } from "./PartnersCard.style";

// components
import FormAssignTrainer from "../FormAssignTrainer/FormAssignTrainer";
import { ShardComponentModal } from "components/Shared/Modal/Modal";

// icons
import {
  IconMedical,
  IconMenuCollaborators,
  IconWeightlifting,
  IconRecipes,
} from "assets/icons/customize/config";

const PartnersCard = ({
  data,
  is360,
  isControlTower,
  isTrainner,
  isVirtualAdmin,
  setIsCarterization,
}) => {
  const history = useHistory();
  const appointment_id = undefined;

  // modal
  const [openModal, setOpenModal] = useState(false);

  // isAssign or Reassign
  const [assignCoach, setAssignCoach] = useState(false);
  const [reassignCoach, setReassignCoach] = useState(false);

  const handleAssignCoach = () => {
    setAssignCoach(true);
    setOpenModal(true);
  };

  const handleReassignCoach = () => {
    setReassignCoach(true);
    setOpenModal(true);
  };

  return (
    <div className="mt-3">
      <Accordion>
        <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
          <div className="d-flex align-items-center" style={{ width: "100%" }}>
            <div className="d-flex align-items-center col-3">
              <Point active={data.plan_status === "active" ? true : false} />
              <Avatar />
              <Typography className="ms-3" variant="body2">
                <b>{data.member_name}</b>
              </Typography>
            </div>

            <div className="d-flex col-3">
              <b>Bodytech</b>
              <Typography variant="body2" className="mx-3">
                {data.plan_type ? data.plan_type : ""}
              </Typography>
            </div>
            <div className="d-flex col-3">
              {data.plan_status === "active" ? (
                <>
                  <b>Activo desde</b>
                  <Typography variant="body2" className="mx-3">
                    {data.start_date}
                  </Typography>
                </>
              ) : (
                <>
                  <b>Inactivo desde</b>
                  <Typography variant="body2" className="mx-3">
                    {data.end_date}
                  </Typography>
                </>
              )}
            </div>
            <div className="col-3">
              {isTrainner && data.with_plan === 0 && (
                <WithoutTrainer>
                  <p>Sin plan</p>
                </WithoutTrainer>
              )}
              {(isVirtualAdmin || isControlTower) &&
                data.with_coach === null ? (
                <WithoutTrainer>
                  <p>Sin entrenador</p>
                </WithoutTrainer>
              ) : (
                ""
              )}
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div
            className="d-flex justify-content-center"
            style={{ width: "100%" }}
          >
            {/* buttons trainer */}
            {isTrainner &&
              data.with_plan === 0 &&
              data.plan_status === "active" ? (
              // Buttons WITHOUT PLAN
              <>
                <ButtonDetail
                  onClick={() =>
                    history.push(
                      `/detail-virtual-afiliate/${data.member_id}${is360 ? "/0" : ""
                      }`
                    )
                  }
                >
                  <IconMedical color="black" />
                  <Typography className="ms-3">
                    <b>Iniciar cita</b>
                  </Typography>
                </ButtonDetail>
              </>
            ) : (
              ""
            )}

            {isTrainner &&
              data.with_plan === 0 &&
              data.plan_type === "nutricion" &&
              data.plan_status === "active" ? (
              <>
                <ButtonDetail
                  onClick={() => {
                    history.push(`nutrition/${data.member_id}`);
                  }}
                >
                  <IconRecipes color="black" />
                  <Typography className="ms-3">
                    <b>Plan Nutrición </b>
                  </Typography>
                </ButtonDetail>
              </>
            ) : (
              ""
            )}

            {isTrainner &&
              data.with_plan === 0 &&
              data.plan_type === "mycoach" &&
              data.plan_status === "active" ? (
              <>
                <ButtonDetail
                  onClick={() =>
                    history.push(
                      `/create-plan-training-for-afiliate/${data.document_number}`
                    )
                  }
                >
                  <IconWeightlifting color="black" width="20" height="20" />
                  <Typography className="ms-3">
                    <b>Plan Entrenamiento</b>
                  </Typography>
                </ButtonDetail>
              </>
            ) : (
              ""
            )}
            {(isTrainner && data.with_plan === 1) ||
              (isTrainner &&
                data.with_plan === 0 &&
                data.plan_status === "inactive") ? (
              <>
                <ButtonDetail
                  onClick={() =>
                    history.push(
                      `/detail-virtual-afiliate/${data.member_id
                      }/${appointment_id}${is360 ? "/0" : ""}`
                    )
                  }
                >
                  <IconMedical color="black" />
                  <Typography className="ms-3">
                    <b>Ver 360 afiliado</b>
                  </Typography>
                </ButtonDetail>
              </>
            ) : (
              ""
            )}
            {/* buttons controlTower */}
            {isControlTower || (isVirtualAdmin && data.with_coach) ? (
              <>
                <ButtonDetail
                  onClick={() =>
                    history.push(
                      `/detail-virtual-afiliate/${data.member_id
                      }/${appointment_id}${is360 ? "/0" : ""}`
                    )
                  }
                >
                  <IconMedical color="black" />
                  <Typography className="ms-3">
                    <b>Ver 360 afiliado</b>
                  </Typography>
                </ButtonDetail>
              </>
            ) : (
              ""
            )}
            {/* Assign or Reassign Coach*/}
            {(isControlTower || isVirtualAdmin) && data.with_coach === null ? (
              <ButtonDetail onClick={handleAssignCoach}>
                <IconMenuCollaborators color="black" />
                <Typography className="ms-3">
                  <b>Asignar Entrenador</b>
                </Typography>
              </ButtonDetail>
            ) : (isControlTower || isVirtualAdmin) &&
              data.plan_status === "active" &&
              data.with_coach ? (
              <ButtonDetail onClick={handleReassignCoach}>
                <IconMenuCollaborators color="black" />
                <Typography className="ms-3">
                  <b>Reasignar Entrenador</b>
                </Typography>
              </ButtonDetail>
            ) : (
              ""
            )}
          </div>
        </AccordionDetails>
      </Accordion>

      <ShardComponentModal
        viewButtonClose={true}
        handleClose={() => setOpenModal(false)}
        fullWidth={true}
        width={"xs"}
        title={assignCoach ? "Asignar entrenador" : "Reasignar entrenador"}
        isOpen={openModal}
        body={
          <FormAssignTrainer
            dataUser={data}
            typePlan={data && data.plan_type}
            setIsCarterization={setIsCarterization}
            setOpenModal={setOpenModal}
            assignCoach={assignCoach}
            reassignCoach={reassignCoach}
          />
        }
        backButton={true}
      />
    </div>
  );
};

export default PartnersCard;
