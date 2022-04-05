import React from "react";

// Components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import DatePicker from "./DatePicker";

const CustomDatePicker = ({
  date,
  handleChangeDate,
  handleChangeOpenModal,
  isOpenDatePicker,
}) => {
  return (
    <>
      <ShardComponentModal
        width="xs"
        viewButtonClose={false}
        handleClose={() => handleChangeOpenModal()}
        title={""}
        body={
          <DatePicker currentDate={date} handleChangeDate={handleChangeDate} />
        }
        isOpen={isOpenDatePicker}
      />
    </>
  );
};

export default CustomDatePicker;
