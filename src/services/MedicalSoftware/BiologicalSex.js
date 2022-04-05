import { axiosInstance } from '../instance';

export const getBiologicalSex = () => {
    return axiosInstance.get('customDataSelect/table/18')
}