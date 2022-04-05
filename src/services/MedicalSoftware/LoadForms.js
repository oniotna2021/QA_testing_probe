import { axiosInstance } from '../instance';

export const getLoadCustomForm = (form_id, appoiment_type_id, user_id, isCompleted) => {
    return axiosInstance.get(`customForm/sections/${form_id}/${appoiment_type_id}/${user_id}?autocomplete=${isCompleted}`);
}

export const getLoadForm = (form_id, appoiment_type_id, user_id, isCompleted) => {
    return axiosInstance.get(`customForm/${form_id}/${appoiment_type_id}/${user_id}?autocomplete=${isCompleted}`);
}
