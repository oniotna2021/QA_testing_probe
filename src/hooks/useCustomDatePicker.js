import { useState } from "react";

const useCustomDatePicker = () => {
  const [date, setDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const handleChangeOpenModal = () => setIsOpen(!isOpen);

  return { handleChangeOpenModal, isOpenDatePicker: isOpen, date, setDate };
};

export default useCustomDatePicker;
