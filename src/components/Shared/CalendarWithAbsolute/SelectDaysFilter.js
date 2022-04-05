import React, { useState } from "react";

import styled from "styled-components";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import ViewModal from "../ViewModal/ViewModal";
import TitleModal from "../ViewModal/TitleModal";
import FormSelectSchedule from "../ListReservas/FormSelectSchedule";
import ScheduleSessionsUser from "../ScheduleSessionUser/ScheduleSessionsUser";

const SelectContainer = styled.div`
  border: 1px solid #3c3c3b;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  z-index: 1;
`;

const ItemDay = styled.div`
  border-radius: 8px;
  background: #e3e3e3;
  width: 140px;
  height: 40px;
  display: flex;
  margin-right: 10px;
  margin-bottom: 5px;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const SelectDaysFilter = ({
  dataForm,
  setDataForm,
  isMobile,
  scheduleData,
  setScheduleData,
}) => {
  const [modalSchedule, setModalSchedule] = useState(0);

  const handleModalSchedule = () => {
    if (modalSchedule === 1) {
      setModalSchedule(0);
    } else {
      setModalSchedule(1);
    }
  };

  const openModalEdit = (e) => {
    if (modalSchedule === 1 && dataForm.length > 0) {
      e.stopPropagation();
      setModalSchedule(0);
    } else {
      setModalSchedule(1);
    }
  };

  const handleDeleteFilter = (e, day) => {
    e.stopPropagation();
    console.log(day);
    setDataForm({
      day_weeks: dataForm?.day_weeks?.filter(
        (dayFilter) => dayFilter.day_week_id !== day.day_week_id
      ),
    });
  };

  return (
    <>
      <SelectContainer>
        <div className="p-2" onClick={handleModalSchedule}>
          {dataForm?.length === 0 || dataForm?.day_weeks?.length === 0 ? (
            <>
              <Typography
                style={{
                  fontSize: isMobile ? "11px" : "15px",
                  width: isMobile ? "70%" : "100%",
                }}
              >
                CLICK AQUÍ, PARA SELECCIONAR UN HORARIO
              </Typography>
              <Typography
                style={{
                  fontSize: isMobile ? "10px" : "13px",
                }}
              >
                Selecciona la fechas cuando quieres entrenar
              </Typography>
            </>
          ) : (
            <div className={isMobile ? " mt-1" : "d-flex mt-1"}>
              {dataForm &&
                dataForm?.day_weeks?.map((day, idx) => (
                  <ItemDay>
                    <p
                      style={{
                        fontSize: 12,
                        marginRight: 5,
                        margin: 0,
                        fontFamily: "Gotham medium",
                      }}
                    >
                      {day.name}
                    </p>
                    <p style={{ fontSize: 12, margin: 0 }}>{day.time}</p>
                    <IconButton
                      style={{ width: 10 }}
                      onClick={(e) => handleDeleteFilter(e, day)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </ItemDay>
                ))}
            </div>
          )}
        </div>
        <Button
          onClick={(e) => openModalEdit(e)}
          disabled={dataForm.length > 0 ? false : true}
          style={{
            fontSize: isMobile ? 12 : 15,
            height: 50,
            width: isMobile ? 40 : 136,
            position: "absolute",
            top: "7.75%",
            right: "1%",
            zIndex: 5,
          }}
          color="primary"
          variant="contained"
        >
          EDITAR
        </Button>
      </SelectContainer>
      <ViewModal
        title={<TitleModal title={"SELECCIONAR HORARIO"} action={""} />}
        open={modalSchedule}
        component={
          <FormSelectSchedule
            setModalSchedule={setModalSchedule}
            modalSchedule={modalSchedule}
            setDataForm={setDataForm}
            scheduleData={scheduleData}
            setScheduleData={setScheduleData}
          />
        }
        backButton={true}
        actionBackButton={handleModalSchedule}
      />

      {/* <div className="mt-5">
        <ScheduleSessionsUser />
      </div> */}
    </>
  );
};

export default SelectDaysFilter;
