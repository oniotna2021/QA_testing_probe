import { axiosInstance } from '../instance';

export const getFieldType = () => {
    return axiosInstance.get('customInputFieldType')
}

export const getDataType = () => {
    return axiosInstance.get('customdatatype')
}



