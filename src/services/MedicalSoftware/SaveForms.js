import { axiosInstance } from '../instance';

export const saveForms = (data) => {
    return axiosInstance.post('formValue', data);
}
