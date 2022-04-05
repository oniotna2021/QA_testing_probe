import {useState} from 'react';

const useTimeValuePicker = (defaultValue={start_date: null, end_date: null, start_time: null, end_time: null}) => {

    const [selectedDate, setSelectedDate] = useState({
        start_date: defaultValue?.start_date,
        end_date: defaultValue?.end_date,
        start_time: defaultValue?.start_time,
        end_time: defaultValue?.end_time
    });

    const handleChangeDate = (value, name) => {
        setSelectedDate({
            ...selectedDate,
            [name]: value
        })
    }

    return [selectedDate, handleChangeDate];
}

export default useTimeValuePicker;