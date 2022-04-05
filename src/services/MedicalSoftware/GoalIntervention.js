import { axiosInstance } from '../instance';

export const getGoalsIntervention = () => {
    return axiosInstance.get('customDataSelect/table/47')
}
