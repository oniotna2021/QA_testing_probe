import React from "react";
import format from "date-fns/format";
import { es } from "date-fns/locale";

// UI
import { IconButton, Typography } from "@material-ui/core";

// icons
import { IconPhoneCall, IconEditPencil } from "assets/icons/customize/config";

// style
import styled from "@emotion/styled";

const statusQuote = {
  active: "Activa",
  started: "En Ejecución",
  finished: "Finalizada",
  canceled: "Cancelada",
  not_attended: "No atendida",
  system_terminated: "Terminada",
  programada: "Programada",
  exitosa: "Exitosa",
  "no exitosa": "No exitosa",
  fallido: "Fallida",
};

const Container = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  justify-content: space-between;
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  box-shadow: 0px 0px 13px 0px #d7d7d7;
`;

const ScheduleCardItem = ({
  status_quote,
  type_quote_name,
  day_hour_format,
  date_hour,
  handleClickHistoryCallsQuote,
  id,
  medical_professional_id,
  user_id,
  phone_number_user,
  isFrom360,
  handleClickQuote,
}) => {
  return (
    <>
      <Container>
        <div className="d-flex align-items-center">
          <div
            className="me-4"
            style={{
              padding: "0px 20px",
              textAlign: "center",
              borderRight: "solid 0.5px #CECECE",
            }}
          >
            <Typography>
              <b>{format(new Date(date_hour), "dd")}</b>
            </Typography>
            <Typography variant="body2">
              {format(new Date(date_hour), "MMM", {
                locale: es,
              })}
            </Typography>
          </div>
          <div className="d-flex">
            <Typography variant="body2" className="me-5">
              <b>{type_quote_name}</b>
            </Typography>

            <Typography variant="body2" align="left">
              {day_hour_format}
            </Typography>
          </div>
        </div>

        <div className="d-flex align-items-center pe-4">
          <IconButton
            onClick={() =>
              handleClickQuote({
                data: {
                  id,
                  medical_professional_id,
                  user_id,
                  phone_number_user,
                },
              })
            }
            style={{
              backgroundColor: "#F3F3F3",
              borderRadius: 8,
              marginRight: 10,
              padding: 5,
            }}
          >
            <IconEditPencil color="black" />
          </IconButton>

          <div
            style={{
              backgroundColor:
                status_quote === "programada"
                  ? "#ECECEB"
                  : status_quote === "active" ||
                    status_quote === "exitoso" ||
                    status_quote === "started"
                  ? "rgba(230, 241, 241, .5)"
                  : "rgba(247, 195, 195, .5)",
              padding: "10px 20px",
              borderRadius: 10,
              width: 120,
              textAlign: "center",
            }}
          >
            {statusQuote[status_quote]}
          </div>

          <IconButton
            style={{
              backgroundColor:
                status_quote !== "programada" && !isFrom360
                  ? "#EC6969"
                  : "#CECECE",
              borderRadius: 8,
              marginLeft: 10,
              padding: 5,
            }}
            disabled={status_quote === "programada" || isFrom360}
            onClick={() => handleClickHistoryCallsQuote(id)}
          >
            <IconPhoneCall color="white" />
          </IconButton>
        </div>
      </Container>
    </>
  );
};

export default ScheduleCardItem;
